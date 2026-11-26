import Link from "next/link";
import { MapPinOff, Pencil, Trash2 } from "lucide-react";
import { getAdmin } from "@/lib/admin";
import { ZONES } from "@/lib/config";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmButton from "@/components/admin/ConfirmButton";
import Flash from "@/components/admin/Flash";
import { deleteLocation } from "../../actions";
import type { Location } from "@/lib/types";

export default async function AdminLocations({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const sp = await searchParams;
  const { supabase } = await getAdmin();
  const [{ data: locs }, { data: props }] = await Promise.all([
    supabase.from("locations").select("*").order("sort_order").order("name"),
    supabase.from("properties").select("location_id"),
  ]);
  const counts: Record<string, number> = {};
  (props ?? []).forEach((p) => (counts[p.location_id] = (counts[p.location_id] ?? 0) + 1));
  const locations = (locs ?? []) as Location[];

  return (
    <>
      <PageHeader title="Locations" subtitle="Areas shown on the Hyderabad map. Starting coordinates are approximate — check each pin." action={{ href: "/admin/locations/new", label: "Add location" }} />
      <Flash saved={sp.saved} error={sp.error} />
      <div className="space-y-8">
        {ZONES.map((z) => {
          const list = locations.filter((l) => l.zone === z.key);
          return (
            <div key={z.key}>
              <h2 className="mb-3 text-2xl">{z.label} <span className="text-base text-stone-400">({list.length})</span></h2>
              <div className="card overflow-hidden">
                <ul className="divide-y divide-stone-100">
                  {list.map((l) => (
                    <li key={l.id} className="flex items-center gap-4 px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <Link href={`/admin/locations/${l.id}`} className="font-semibold hover:text-gold-700">{l.name}</Link>
                        <p className="flex items-center gap-2 text-xs text-stone-500">
                          {counts[l.id] ?? 0} properties
                          {l.lat == null && <span className="flex items-center gap-1 text-gold-700"><MapPinOff className="h-3 w-3" /> no map position</span>}
                          {!l.is_active && <span className="text-red-600">hidden</span>}
                        </p>
                      </div>
                      <Link href={`/admin/locations/${l.id}`} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-stone-100" title="Edit"><Pencil className="h-4 w-4" /></Link>
                      <form action={deleteLocation}>
                        <input type="hidden" name="id" value={l.id} />
                        <ConfirmButton message={`Delete location "${l.name}"?`} className="grid h-9 w-9 place-items-center rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></ConfirmButton>
                      </form>
                    </li>
                  ))}
                  {!list.length && <li className="px-4 py-6 text-sm text-stone-500">No locations in this zone.</li>}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
