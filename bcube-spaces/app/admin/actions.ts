"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/format";
import { STORAGE_BUCKET } from "@/lib/config";

export interface FormState { ok: boolean; message: string }
const fail = (message: string): FormState => ({ ok: false, message });

const str = (f: FormData, k: string) => {
  const v = String(f.get(k) ?? "").trim();
  return v.length ? v : null;
};
const numOrNull = (f: FormData, k: string) => {
  const v = str(f, k);
  if (v == null) return null;
  const n = Number(v.replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
};
const lines = (f: FormData, k: string) =>
  String(f.get(k) ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
const bool = (f: FormData, k: string) => f.get(k) === "on" || f.get(k) === "true";

/** Clears cached public pages so changes show up immediately. */
function refreshSite() {
  revalidatePath("/", "layout");
}

async function uniqueSlug(table: "properties" | "locations", base: string, ignoreId?: string | null) {
  const { supabase } = await requireAdmin();
  const root = base || "item";
  for (let i = 1; i < 100; i++) {
    const candidate = i === 1 ? root : `${root}-${i}`;
    let q = supabase.from(table).select("id").eq("slug", candidate);
    if (ignoreId) q = q.neq("id", ignoreId);
    const { data } = await q.maybeSingle();
    if (!data) return candidate;
  }
  return `${root}-${Date.now()}`;
}

// ------------------------------------------------------------------- auth
export async function signIn(_prev: FormState, form: FormData): Promise<FormState> {
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(form.get("email") ?? "").trim(),
    password: String(form.get("password") ?? ""),
  });
  if (error) return fail("Incorrect email or password.");
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// -------------------------------------------------------------- locations
async function createLocation(name: string, zone: string) {
  const { supabase } = await requireAdmin();
  const slug = await uniqueSlug("locations", slugify(name));
  const { data, error } = await supabase.from("locations").insert({ name, slug, zone }).select("id").single();
  if (error) throw new Error(error.message);
  return data.id as string;
}

export async function saveLocation(_prev: FormState, form: FormData): Promise<FormState> {
  try {
    const { supabase } = await requireAdmin();
    const id = str(form, "id");
    const name = str(form, "name");
    if (!name) return fail("Location name is required.");
    const zone = str(form, "zone") ?? "within_orr";
    if (!["within_orr", "orr_to_rrr", "beyond_rrr"].includes(zone)) return fail("Invalid zone.");
    const slug = await uniqueSlug("locations", slugify(str(form, "slug") ?? name), id);
    const row = {
      name, slug, zone,
      description: str(form, "description"),
      banner_url: str(form, "banner_url"),
      lat: numOrNull(form, "lat"),
      lng: numOrNull(form, "lng"),
      is_active: bool(form, "is_active"),
      sort_order: numOrNull(form, "sort_order") ?? 0,
    };
    const { error } = id ? await supabase.from("locations").update(row).eq("id", id) : await supabase.from("locations").insert(row);
    if (error) return fail(error.message);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Could not save location.");
  }
  refreshSite();
  redirect("/admin/locations?saved=1");
}

export async function deleteLocation(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(form.get("id"));
  const { count } = await supabase.from("properties").select("id", { count: "exact", head: true }).eq("location_id", id);
  if (count) redirect(`/admin/locations?error=${encodeURIComponent("Move or delete this location's properties first.")}`);
  await supabase.from("locations").delete().eq("id", id);
  refreshSite();
  redirect("/admin/locations");
}

// ------------------------------------------------------------- properties
interface ImageInput { url: string; storage_path?: string | null; alt?: string | null }

export async function saveProperty(_prev: FormState, form: FormData): Promise<FormState> {
  let savedId: string;
  try {
    const { supabase } = await requireAdmin();
    const id = str(form, "id");
    const title = str(form, "title");
    if (!title) return fail("Property name is required.");
    const category_id = str(form, "category_id");
    if (!category_id) return fail("Choose a property category.");

    let location_id = str(form, "location_id");
    if (location_id === "__new__") {
      const newName = str(form, "new_location_name");
      if (!newName) return fail("Enter a name for the new area.");
      location_id = await createLocation(newName, str(form, "new_location_zone") ?? "orr_to_rrr");
    }
    if (!location_id) return fail("Choose an area for this property.");

    const sizeUnit = str(form, "size_unit");
    const { data: loc } = await supabase.from("locations").select("slug").eq("id", location_id).single();
    const slug = await uniqueSlug("properties", slugify(str(form, "slug") ?? `${title}-${loc?.slug ?? ""}`), id);

    const row = {
      title, slug, location_id, category_id,
      short_description: str(form, "short_description"),
      description: str(form, "description"),
      price: numOrNull(form, "price"),
      price_label: str(form, "price_label"),
      size_value: numOrNull(form, "size_value"),
      size_unit: numOrNull(form, "size_value") != null ? sizeUnit ?? "sq_yd" : null,
      facing: str(form, "facing"),
      road_width: str(form, "road_width"),
      dimensions: str(form, "dimensions"),
      floor_details: str(form, "floor_details"),
      ownership_details: str(form, "ownership_details"),
      amenities: lines(form, "amenities"),
      landmarks: lines(form, "landmarks"),
      connectivity: lines(form, "connectivity"),
      lat: numOrNull(form, "lat"),
      lng: numOrNull(form, "lng"),
      map_url: str(form, "map_url"),
      is_featured: bool(form, "is_featured"),
      is_published: bool(form, "is_published"),
      is_demo: false,
    };

    if (id) {
      const { error } = await supabase.from("properties").update(row).eq("id", id);
      if (error) return fail(error.message);
      savedId = id;
    } else {
      const { data, error } = await supabase.from("properties").insert(row).select("id").single();
      if (error) return fail(error.message);
      savedId = data.id;
    }

    // Replace image list (order = array order)
    let images: ImageInput[] = [];
    try { images = JSON.parse(String(form.get("images") ?? "[]")); } catch { images = []; }
    const { data: existing } = await supabase.from("property_images").select("storage_path").eq("property_id", savedId);
    const keep = new Set(images.map((i) => i.storage_path).filter(Boolean));
    const removed = (existing ?? []).map((e) => e.storage_path).filter((p): p is string => !!p && !keep.has(p));
    await supabase.from("property_images").delete().eq("property_id", savedId);
    if (images.length) {
      const { error } = await supabase.from("property_images").insert(
        images.map((im, i) => ({ property_id: savedId, url: im.url, storage_path: im.storage_path ?? null, alt: im.alt ?? title, sort_order: i })),
      );
      if (error) return fail(`Saved, but images failed: ${error.message}`);
    }
    if (removed.length) await supabase.storage.from(STORAGE_BUCKET).remove(removed);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Could not save property.");
  }
  refreshSite();
  redirect(`/admin/properties?saved=1`);
}

export async function deleteProperty(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(form.get("id"));
  const { data: imgs } = await supabase.from("property_images").select("storage_path").eq("property_id", id);
  const paths = (imgs ?? []).map((i) => i.storage_path).filter((p): p is string => !!p);
  await supabase.from("properties").delete().eq("id", id);
  if (paths.length) await supabase.storage.from(STORAGE_BUCKET).remove(paths);
  refreshSite();
  redirect("/admin/properties");
}

export async function toggleProperty(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(form.get("id"));
  const field = String(form.get("field"));
  if (field !== "is_published" && field !== "is_featured") return;
  await supabase.from("properties").update({ [field]: form.get("value") === "true" }).eq("id", id);
  refreshSite();
  revalidatePath("/admin/properties");
}

// -------------------------------------------------------------- enquiries
export async function updateEnquiry(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(form.get("id"));
  const status = String(form.get("status"));
  if (!["new", "contacted", "closed"].includes(status)) return;
  await supabase.from("enquiries").update({ status }).eq("id", id);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

export async function deleteEnquiry(form: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("enquiries").delete().eq("id", String(form.get("id")));
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

// --------------------------------------------------------------- settings
export async function saveSettings(_prev: FormState, form: FormData): Promise<FormState> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("site_settings").upsert({
      id: 1,
      phone: str(form, "phone"),
      whatsapp: str(form, "whatsapp")?.replace(/\D/g, "") || null,
      email: str(form, "email"),
      address: str(form, "address"),
      instagram_url: str(form, "instagram_url"),
      about_text: str(form, "about_text"),
      mission_text: str(form, "mission_text"),
      services: lines(form, "services"),
      hero_image_url: str(form, "hero_image_url"),
      updated_at: new Date().toISOString(),
    });
    if (error) return fail(error.message);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Could not save settings.");
  }
  refreshSite();
  return { ok: true, message: "Settings saved. The website is updated." };
}

// ------------------------------------------------------------- map layers
export async function saveMapLayer(_prev: FormState, form: FormData): Promise<FormState> {
  try {
    const { supabase } = await requireAdmin();
    const key = String(form.get("key"));
    if (key !== "orr" && key !== "rrr") return fail("Unknown layer.");
    let geojson: { type?: string };
    try { geojson = JSON.parse(String(form.get("geojson") ?? "")); } catch { return fail("That file isn't valid GeoJSON."); }
    const okTypes = ["FeatureCollection", "Feature", "LineString", "MultiLineString", "Polygon", "MultiPolygon"];
    if (!geojson || !okTypes.includes(String(geojson.type))) return fail("GeoJSON must be a FeatureCollection, Feature or line/polygon geometry.");
    const { error } = await supabase.from("map_layers").upsert({
      key,
      name: key === "orr" ? "Outer Ring Road (ORR)" : "Regional Ring Road (RRR)",
      geojson,
      source_note: str(form, "source_note") ?? "Uploaded by admin",
      updated_at: new Date().toISOString(),
    });
    if (error) return fail(error.message);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Could not save boundary.");
  }
  refreshSite();
  return { ok: true, message: "Boundary saved. It now shows on the map." };
}

export async function deleteMapLayer(form: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("map_layers").delete().eq("key", String(form.get("key")));
  refreshSite();
  revalidatePath("/admin/map");
}
