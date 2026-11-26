import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import HyderabadMap from "@/components/map/HyderabadMap";
import Reveal from "@/components/Reveal";
import { getLocations, getMapLayers } from "@/lib/data";
import { ZONES } from "@/lib/config";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Explore Locations",
  description: "Explore properties across Hyderabad by location — within the ORR and in the growth zones between the ORR and the RRR.",
};

export default async function LocationsPage() {
  const [locations, layers] = await Promise.all([getLocations(), getMapLayers()]);
  return (
    <>
      <section className="bg-ink pb-16 pt-20 text-white sm:pt-28">
        <div className="container-site">
          <p className="eyebrow !text-gold-400">Explore locations</p>
          <h1 className="mt-4 max-w-3xl text-5xl leading-[1.02] sm:text-7xl">Hyderabad, <span className="italic text-gold-300">area by area.</span></h1>
          <p className="mt-6 max-w-xl text-white/65">Select a location on the map or from the list to see the properties available there.</p>
        </div>
      </section>
      <section className="-mt-4 pb-20">
        <div className="container-site">
          <HyderabadMap locations={locations} layers={layers} />
        </div>
      </section>
      <section className="pb-28">
        <div className="container-site space-y-16">
          {ZONES.map((z) => {
            const list = locations.filter((l) => l.zone === z.key);
            if (!list.length) return null;
            return (
              <div key={z.key}>
                <Reveal className="flex items-baseline justify-between border-b border-stone-200 pb-4">
                  <h2 className="text-3xl sm:text-4xl">{z.label}</h2>
                  <span className="text-sm text-stone-500">{list.length} locations</span>
                </Reveal>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {list.map((l, i) => (
                    <Reveal key={l.id} delay={Math.min(i * 0.03, 0.3)}>
                      <Link href={`/locations/${l.slug}`} className="group flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-card ring-1 ring-ink/5 transition hover:-translate-y-0.5 hover:bg-ink hover:text-white">
                        <span>
                          <span className="block font-display text-xl">{l.name}</span>
                          <span className="text-xs text-stone-500 group-hover:text-white/60">{l.property_count ? `${l.property_count} propert${l.property_count === 1 ? "y" : "ies"}` : "Coming soon"}</span>
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-gold-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold-400" />
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
