import { Trash2 } from "lucide-react";
import { getAdmin } from "@/lib/admin";
import { getMapLayers } from "@/lib/data";
import PageHeader from "@/components/admin/PageHeader";
import LayerUpload from "@/components/admin/LayerUpload";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { deleteMapLayer } from "../../actions";

export default async function MapLayers() {
  const { supabase } = await getAdmin();
  const { data: dbLayers } = await supabase.from("map_layers").select("key, name, source_note, updated_at");
  const effective = await getMapLayers();
  const items = [
    { key: "orr" as const, name: "Outer Ring Road (ORR)" },
    { key: "rrr" as const, name: "Regional Ring Road (RRR)" },
  ];
  return (
    <>
      <PageHeader title="Map boundaries" subtitle="The ORR and RRR lines on the homepage map. Only verified geographic data is drawn — nothing is invented." />
      <div className="grid gap-6 lg:grid-cols-2">
        {items.map((it) => {
          const db = dbLayers?.find((l) => l.key === it.key);
          const eff = effective.find((l) => l.key === it.key);
          return (
            <section key={it.key} className="card p-6">
              <h2 className="text-2xl">{it.name}</h2>
              <p className="mt-2 text-sm">
                {db ? <span className="text-emerald-700">Uploaded · {db.source_note}</span> : eff ? <span className="text-emerald-700">Loaded from public/geo/{it.key}.geojson</span> : <span className="text-gold-700">Not added yet — the map shows no {it.key.toUpperCase()} line.</span>}
              </p>
              <LayerUpload layerKey={it.key} />
              {db && (
                <form action={deleteMapLayer} className="mt-3">
                  <input type="hidden" name="key" value={it.key} />
                  <ConfirmButton message={`Remove the uploaded ${it.key.toUpperCase()} boundary?`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600"><Trash2 className="h-3.5 w-3.5" /> Remove uploaded file</ConfirmButton>
                </form>
              )}
            </section>
          );
        })}
      </div>
      <section className="card mt-6 p-6 text-sm leading-relaxed text-ink-600">
        <h2 className="text-2xl text-ink">Where to get the boundary files</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>On your computer, in the project folder, run <code className="rounded bg-stone-100 px-1.5">npm run fetch-boundaries</code>. It downloads the real ORR and RRR road geometry from OpenStreetMap into <code className="rounded bg-stone-100 px-1.5">public/geo/</code>.</li>
          <li>Upload those files here (or commit them — the map reads them automatically).</li>
          <li>The RRR is still partly under construction or proposed. Where OpenStreetMap doesn’t yet have a section mapped, you can upload an official alignment as GeoJSON (for example, traced from the government notification map in a tool like geojson.io).</li>
        </ol>
      </section>
    </>
  );
}
