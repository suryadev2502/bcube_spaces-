"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { saveProperty, type FormState } from "@/app/admin/actions";
import { GalleryUploader } from "./ImageUploader";
import CoordinateField from "./CoordinateField";
import { SIZE_UNITS, ZONES } from "@/lib/config";
import type { Category, Location, Property } from "@/lib/types";

const FACINGS = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="card p-6 sm:p-8">
      <h2 className="text-2xl">{title}</h2>
      {hint && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function Field({ label, name, defaultValue, placeholder, type = "text", list, required }: { label: string; name: string; defaultValue?: string | number | null; placeholder?: string; type?: string; list?: string; required?: boolean }) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}{required && <span className="text-red-500"> *</span>}</label>
      <input id={name} name={name} type={type} defaultValue={defaultValue ?? ""} placeholder={placeholder} list={list} required={required} className="input" step={type === "number" ? "any" : undefined} />
    </div>
  );
}

function Lines({ label, name, value, placeholder }: { label: string; name: string; value: string[]; placeholder: string }) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label} <span className="normal-case tracking-normal text-stone-400">(one per line)</span></label>
      <textarea id={name} name={name} rows={4} defaultValue={value.join("\n")} placeholder={placeholder} className="input" />
    </div>
  );
}

export default function PropertyForm({ property: p, locations, categories }: { property: Property | null; locations: Location[]; categories: Category[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProperty, { ok: false, message: "" });
  const [locationId, setLocationId] = useState(p?.location_id ?? "");

  return (
    <form action={action} className="space-y-6">
      {p && <input type="hidden" name="id" value={p.id} />}

      <Section title="Basic details" hint="Only fill in what you know — empty fields are hidden on the website.">
        <Field label="Property name" name="title" defaultValue={p?.title} placeholder="e.g. Premium Residential Plot" required />
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="location_id">Area / location <span className="text-red-500">*</span></label>
            <select id="location_id" name="location_id" value={locationId} onChange={(e) => setLocationId(e.target.value)} required className="input">
              <option value="">Select an area…</option>
              {ZONES.map((z) => (
                <optgroup key={z.key} label={z.label}>
                  {locations.filter((l) => l.zone === z.key).map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </optgroup>
              ))}
              <option value="__new__">＋ Create a new area…</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="category_id">Category <span className="text-red-500">*</span></label>
            <select id="category_id" name="category_id" defaultValue={p?.category_id ?? ""} required className="input">
              <option value="">Select a category…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        {locationId === "__new__" && (
          <div className="grid gap-5 rounded-xl bg-gold-50 p-4 sm:grid-cols-2">
            <Field label="New area name" name="new_location_name" placeholder="e.g. Kothur" required />
            <div>
              <label className="label" htmlFor="new_location_zone">Zone</label>
              <select id="new_location_zone" name="new_location_zone" defaultValue="orr_to_rrr" className="input">
                {ZONES.map((z) => <option key={z.key} value={z.key}>{z.label}</option>)}
              </select>
            </div>
            <p className="text-xs text-gold-700 sm:col-span-2">The area is created when you save. Add its map position later in Admin → Locations so it appears on the map.</p>
          </div>
        )}
        <div>
          <label className="label" htmlFor="short_description">Short description <span className="normal-case tracking-normal text-stone-400">(shown on cards)</span></label>
          <input id="short_description" name="short_description" defaultValue={p?.short_description ?? ""} maxLength={220} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="description">Full description</label>
          <textarea id="description" name="description" rows={6} defaultValue={p?.description ?? ""} className="input" />
        </div>
      </Section>

      <Section title="Photos">
        <GalleryUploader name="images" initial={(p?.images ?? []).map((i) => ({ url: i.url, storage_path: i.storage_path ?? null, alt: i.alt }))} />
      </Section>

      <Section title="Price & size">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Price (₹, numbers only)" name="price" type="number" defaultValue={p?.price} placeholder="e.g. 4500000" />
          <Field label="Price text (optional)" name="price_label" defaultValue={p?.price_label} placeholder="e.g. Contact for Price" />
        </div>
        <p className="-mt-2 text-xs text-stone-500">If “Price text” is filled, it’s shown instead of the number. Leave both empty to show “Price on Request”.</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Plot / flat size" name="size_value" type="number" defaultValue={p?.size_value} placeholder="e.g. 300" />
          <div>
            <label className="label" htmlFor="size_unit">Unit</label>
            <select id="size_unit" name="size_unit" defaultValue={p?.size_unit ?? "sq_yd"} className="input">
              {SIZE_UNITS.map((u) => <option key={u.key} value={u.key}>{u.label}</option>)}
            </select>
          </div>
        </div>
      </Section>

      <Section title="Specifications">
        <datalist id="facings">{FACINGS.map((f) => <option key={f} value={f} />)}</datalist>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Facing" name="facing" defaultValue={p?.facing} list="facings" placeholder="e.g. East" />
          <Field label="Road width / access" name="road_width" defaultValue={p?.road_width} placeholder="e.g. 40 ft" />
          <Field label="Dimensions" name="dimensions" defaultValue={p?.dimensions} placeholder="e.g. 45 ft × 60 ft" />
          <Field label="Floor details" name="floor_details" defaultValue={p?.floor_details} placeholder="e.g. 12th floor of 30" />
        </div>
        <Field label="Ownership details" name="ownership_details" defaultValue={p?.ownership_details} placeholder="e.g. Clear title, HMDA approved" />
        <div className="grid gap-5 sm:grid-cols-3">
          <Lines label="Amenities" name="amenities" value={p?.amenities ?? []} placeholder={"Gated community\nClubhouse"} />
          <Lines label="Nearby landmarks" name="landmarks" value={p?.landmarks ?? []} placeholder={"5 min to ORR Exit 18"} />
          <Lines label="Connectivity" name="connectivity" value={p?.connectivity ?? []} placeholder={"20 min to Financial District"} />
        </div>
      </Section>

      <Section title="Map location" hint="Paste a Google Maps link and/or click the map to drop the exact pin.">
        <CoordinateField lat={p?.lat ?? null} lng={p?.lng ?? null} mapUrl={p?.map_url} withMapUrl />
      </Section>

      <Section title="Visibility">
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" name="is_published" defaultChecked={p ? p.is_published : true} className="h-4 w-4 accent-gold-600" /> Published (visible on the website)</label>
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" name="is_featured" defaultChecked={p?.is_featured ?? false} className="h-4 w-4 accent-gold-600" /> Show in Featured Properties on the homepage</label>
        <Field label="Custom URL slug (optional)" name="slug" defaultValue={p?.slug} placeholder="auto-generated from name and area" />
      </Section>

      <div className="sticky bottom-4 z-30 flex items-center justify-between gap-4 rounded-2xl bg-ink p-4 text-white shadow-lift">
        <p className={`text-sm ${state.message ? "text-red-300" : "text-white/60"}`}>{state.message || (p ? "Editing existing property" : "New property")}</p>
        <div className="flex gap-2">
          <Link href="/admin/properties" className="btn border border-white/20 !py-2.5 text-white hover:bg-white/10">Cancel</Link>
          <button disabled={pending} className="btn-gold !py-2.5">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save property</button>
        </div>
      </div>
    </form>
  );
}
