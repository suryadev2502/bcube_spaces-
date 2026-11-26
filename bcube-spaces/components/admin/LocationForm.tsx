"use client";
import Link from "next/link";
import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { saveLocation, type FormState } from "@/app/admin/actions";
import CoordinateField from "./CoordinateField";
import { SingleImageUploader } from "./ImageUploader";
import { ZONES } from "@/lib/config";
import type { Location } from "@/lib/types";

export default function LocationForm({ location: l }: { location: Location | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveLocation, { ok: false, message: "" });
  return (
    <form action={action} className="space-y-6">
      {l && <input type="hidden" name="id" value={l.id} />}
      <section className="card space-y-5 p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label className="label" htmlFor="name">Location name *</label><input id="name" name="name" required defaultValue={l?.name} className="input" placeholder="e.g. Kokapet" /></div>
          <div>
            <label className="label" htmlFor="zone">Zone</label>
            <select id="zone" name="zone" defaultValue={l?.zone ?? "within_orr"} className="input">
              {ZONES.map((z) => <option key={z.key} value={z.key}>{z.label}</option>)}
            </select>
          </div>
        </div>
        <div><label className="label" htmlFor="description">Short description</label><textarea id="description" name="description" rows={3} defaultValue={l?.description ?? ""} className="input" /></div>
        <div><label className="label">Banner image (optional)</label><SingleImageUploader name="banner_url" initial={l?.banner_url ?? null} folder="locations" /></div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div><label className="label" htmlFor="slug">URL slug</label><input id="slug" name="slug" defaultValue={l?.slug} placeholder="auto" className="input" /></div>
          <div><label className="label" htmlFor="sort_order">Sort order</label><input id="sort_order" name="sort_order" type="number" defaultValue={l?.sort_order ?? 0} className="input" /></div>
          <label className="flex items-end gap-3 pb-3 text-sm"><input type="checkbox" name="is_active" defaultChecked={l ? l.is_active : true} className="h-4 w-4 accent-gold-600" /> Visible on website</label>
        </div>
      </section>
      <section className="card p-6 sm:p-8">
        <h2 className="text-2xl">Map position</h2>
        <p className="mt-1 mb-5 text-xs text-stone-500">Click the map at the centre of this locality. Locations without a position are listed but have no map marker.</p>
        <CoordinateField lat={l?.lat ?? null} lng={l?.lng ?? null} />
      </section>
      <div className="sticky bottom-4 z-30 flex items-center justify-between gap-4 rounded-2xl bg-ink p-4 text-white shadow-lift">
        <p className={`text-sm ${state.message ? "text-red-300" : "text-white/60"}`}>{state.message || (l ? `Editing ${l.name}` : "New location")}</p>
        <div className="flex gap-2">
          <Link href="/admin/locations" className="btn border border-white/20 !py-2.5 text-white hover:bg-white/10">Cancel</Link>
          <button disabled={pending} className="btn-gold !py-2.5">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save location</button>
        </div>
      </div>
    </form>
  );
}
