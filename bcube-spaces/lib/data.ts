import "server-only";
import { cache } from "react";
import fs from "node:fs/promises";
import path from "node:path";
import { isSupabaseConfigured, TYPE_FILTERS } from "./config";
import { createPublicClient } from "./supabase/public";
import { demoCategories, demoLocations, demoProperties, demoSettings } from "./demo-data";
import type { Category, Location, LocationWithCount, MapLayer, Property, SearchParams, SiteSettings } from "./types";

export const PROPERTY_SELECT =
  "*, location:locations(id,name,slug,zone), category:categories(id,name,slug,grp), images:property_images(id,url,storage_path,alt,sort_order)";

function normalize(p: Property): Property {
  return {
    ...p,
    price: p.price == null ? null : Number(p.price),
    size_value: p.size_value == null ? null : Number(p.size_value),
    size_sqyd: p.size_sqyd == null ? null : Number(p.size_sqyd),
    amenities: p.amenities ?? [],
    landmarks: p.landmarks ?? [],
    connectivity: p.connectivity ?? [],
    images: [...(p.images ?? [])].sort((a, b) => a.sort_order - b.sort_order),
  };
}

function logError(where: string, error: unknown) {
  console.error(`[data] ${where}:`, error instanceof Error ? error.message : error);
}

// ---------------------------------------------------------------- settings
export const getSettings = cache(async (): Promise<SiteSettings> => {
  if (!isSupabaseConfigured) return demoSettings;
  const { data, error } = await createPublicClient().from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) logError("getSettings", error);
  return { ...demoSettings, ...(data ?? {}), services: data?.services ?? demoSettings.services };
});

// --------------------------------------------------------------- categories
export const getCategories = cache(async (): Promise<Category[]> => {
  if (!isSupabaseConfigured) return demoCategories;
  const { data, error } = await createPublicClient().from("categories").select("*").order("sort_order");
  if (error) logError("getCategories", error);
  return data ?? [];
});

// ---------------------------------------------------------------- locations
export const getLocations = cache(async (): Promise<LocationWithCount[]> => {
  let locations: Location[];
  let counts: Record<string, number> = {};
  if (!isSupabaseConfigured) {
    locations = demoLocations;
    demoProperties.forEach((p) => (counts[p.location_id] = (counts[p.location_id] ?? 0) + 1));
  } else {
    const sb = createPublicClient();
    const [locRes, propRes] = await Promise.all([
      sb.from("locations").select("*").eq("is_active", true).order("sort_order").order("name"),
      sb.from("properties").select("location_id").eq("is_published", true),
    ]);
    if (locRes.error) logError("getLocations", locRes.error);
    if (propRes.error) logError("getLocations.counts", propRes.error);
    locations = locRes.data ?? [];
    counts = {};
    (propRes.data ?? []).forEach((r: { location_id: string }) => (counts[r.location_id] = (counts[r.location_id] ?? 0) + 1));
  }
  return locations.map((l) => ({ ...l, property_count: counts[l.id] ?? 0 }));
});

export const getLocationBySlug = cache(async (slug: string) => {
  const all = await getLocations();
  return all.find((l) => l.slug === slug) ?? null;
});

// --------------------------------------------------------------- properties
export const getPublishedProperties = cache(async (): Promise<Property[]> => {
  if (!isSupabaseConfigured) return demoProperties;
  const { data, error } = await createPublicClient()
    .from("properties").select(PROPERTY_SELECT).eq("is_published", true).order("created_at", { ascending: false });
  if (error) logError("getPublishedProperties", error);
  return (data ?? []).map(normalize);
});

export async function getFeaturedProperties(limit = 9): Promise<Property[]> {
  if (!isSupabaseConfigured) return demoProperties.filter((p) => p.is_featured).slice(0, limit);
  const { data, error } = await createPublicClient()
    .from("properties").select(PROPERTY_SELECT).eq("is_published", true).eq("is_featured", true)
    .order("created_at", { ascending: false }).limit(limit);
  if (error) logError("getFeaturedProperties", error);
  return (data ?? []).map(normalize);
}

export async function getPropertiesByLocation(locationId: string): Promise<Property[]> {
  if (!isSupabaseConfigured) return demoProperties.filter((p) => p.location_id === locationId);
  const { data, error } = await createPublicClient()
    .from("properties").select(PROPERTY_SELECT).eq("is_published", true).eq("location_id", locationId)
    .order("created_at", { ascending: false });
  if (error) logError("getPropertiesByLocation", error);
  return (data ?? []).map(normalize);
}

export const getPropertyBySlug = cache(async (slug: string): Promise<Property | null> => {
  if (!isSupabaseConfigured) return demoProperties.find((p) => p.slug === slug) ?? null;
  const { data, error } = await createPublicClient()
    .from("properties").select(PROPERTY_SELECT).eq("slug", slug).eq("is_published", true).maybeSingle();
  if (error) logError("getPropertyBySlug", error);
  return data ? normalize(data) : null;
});

export async function getSimilarProperties(p: Property, limit = 3): Promise<Property[]> {
  const all = await getPublishedProperties();
  const others = all.filter((x) => x.id !== p.id);
  const sameLoc = others.filter((x) => x.location_id === p.location_id);
  const sameCat = others.filter((x) => x.category_id === p.category_id && x.location_id !== p.location_id);
  return [...sameLoc, ...sameCat].slice(0, limit);
}

// ------------------------------------------------------------------ search
const num = (v?: string) => {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

export async function searchProperties(params: SearchParams): Promise<Property[]> {
  const q = (params.q ?? "").trim().toLowerCase().slice(0, 80);
  const min = num(params.min), max = num(params.max);
  const minSize = num(params.minSize), maxSize = num(params.maxSize);
  const filter = TYPE_FILTERS.find((f) => f.key === params.type);
  const [locations, categories] = await Promise.all([getLocations(), getCategories()]);
  const loc = params.location ? locations.find((l) => l.slug === params.location) : undefined;
  if (params.location && !loc) return [];

  const catIds = filter
    ? categories.filter((c) => ("group" in filter ? c.grp === filter.group : c.slug === filter.category)).map((c) => c.id)
    : undefined;

  let results: Property[];
  if (!isSupabaseConfigured) {
    results = demoProperties;
    if (loc) results = results.filter((p) => p.location_id === loc.id);
    if (catIds) results = results.filter((p) => catIds.includes(p.category_id));
    if (min != null) results = results.filter((p) => p.price != null && p.price >= min);
    if (max != null) results = results.filter((p) => p.price != null && p.price <= max);
    if (minSize != null) results = results.filter((p) => p.size_sqyd != null && p.size_sqyd >= minSize);
    if (maxSize != null) results = results.filter((p) => p.size_sqyd != null && p.size_sqyd <= maxSize);
    if (q) results = results.filter((p) => [p.title, p.location.name, p.category.name, p.short_description ?? ""].some((s) => s.toLowerCase().includes(q)));
  } else {
    let query = createPublicClient().from("properties").select(PROPERTY_SELECT).eq("is_published", true);
    if (loc) query = query.eq("location_id", loc.id);
    if (catIds) query = query.in("category_id", catIds.length ? catIds : ["00000000-0000-0000-0000-000000000000"]);
    if (min != null) query = query.gte("price", min);
    if (max != null) query = query.lte("price", max);
    if (minSize != null) query = query.gte("size_sqyd", minSize);
    if (maxSize != null) query = query.lte("size_sqyd", maxSize);
    if (q) {
      const safe = q.replace(/[%,()*\\"]/g, " ").trim();
      const locIds = locations.filter((l) => l.name.toLowerCase().includes(safe)).map((l) => l.id);
      const catMatch = categories.filter((c) => c.name.toLowerCase().includes(safe)).map((c) => c.id);
      const ors = [`title.ilike.%${safe}%`, `short_description.ilike.%${safe}%`];
      if (locIds.length) ors.push(`location_id.in.(${locIds.join(",")})`);
      if (catMatch.length) ors.push(`category_id.in.(${catMatch.join(",")})`);
      query = query.or(ors.join(","));
    }
    query = query.order("created_at", { ascending: false }).limit(500);
    const { data, error } = await query;
    if (error) logError("searchProperties", error);
    results = (data ?? []).map(normalize);
  }

  const sorted = [...results];
  if (params.sort === "price_asc" || params.sort === "price_desc") {
    const dir = params.sort === "price_asc" ? 1 : -1;
    sorted.sort((a, b) => {
      if (a.price == null && b.price == null) return 0;
      if (a.price == null) return 1; // undisclosed prices go last
      if (b.price == null) return -1;
      return (a.price - b.price) * dir;
    });
  } else {
    sorted.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  return sorted;
}

// --------------------------------------------------------------- map layers
async function readGeoFile(key: "orr" | "rrr"): Promise<MapLayer | null> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "public", "geo", `${key}.geojson`), "utf8");
    return { key, name: key === "orr" ? "Outer Ring Road (ORR)" : "Regional Ring Road (RRR)", geojson: JSON.parse(raw), source_note: "OpenStreetMap contributors (ODbL)" };
  } catch {
    return null;
  }
}

export const getMapLayers = cache(async (): Promise<MapLayer[]> => {
  const out: MapLayer[] = [];
  if (isSupabaseConfigured) {
    const { data, error } = await createPublicClient().from("map_layers").select("*");
    if (error) logError("getMapLayers", error);
    (data ?? []).forEach((l: MapLayer) => out.push(l));
  }
  for (const key of ["orr", "rrr"] as const) {
    if (!out.some((l) => l.key === key)) {
      const f = await readGeoFile(key);
      if (f) out.push(f);
    }
  }
  return out;
});
