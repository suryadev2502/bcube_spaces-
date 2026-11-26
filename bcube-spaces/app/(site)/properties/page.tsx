import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchX } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import SearchFilters from "@/components/SearchFilters";
import { getLocations, searchProperties } from "@/lib/data";
import type { SearchParams } from "@/lib/types";
import { TYPE_FILTERS } from "@/lib/config";

export const metadata: Metadata = {
  title: "Properties",
  description: "Search open plots, apartments, villas, commercial spaces and agricultural land across Hyderabad.",
};

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const [locations, results] = await Promise.all([getLocations(), searchProperties(params)]);
  const typeLabel = TYPE_FILTERS.find((t) => t.key === params.type)?.label;
  const locLabel = locations.find((l) => l.slug === params.location)?.name;

  return (
    <>
      <section className="bg-ink pb-24 pt-20 text-white sm:pt-28">
        <div className="container-site">
          <p className="eyebrow !text-gold-400">Properties</p>
          <h1 className="mt-4 text-5xl leading-none sm:text-7xl">{typeLabel ?? "All properties"}{locLabel ? <span className="italic text-gold-300"> in {locLabel}</span> : null}</h1>
        </div>
      </section>
      <section className="pb-24">
        <div className="container-site -mt-14">
          <Suspense><SearchFilters locations={locations.map((l) => ({ name: l.name, slug: l.slug }))} /></Suspense>
          <p className="mt-8 text-sm text-stone-500" aria-live="polite">{results.length} propert{results.length === 1 ? "y" : "ies"} found</p>
          {results.length ? (
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p, i) => <PropertyCard key={p.id} property={p} showDescription priority={i < 3} />)}
            </div>
          ) : (
            <div className="mt-5 rounded-3xl bg-white p-14 text-center shadow-card">
              <SearchX className="mx-auto h-10 w-10 text-gold-500" strokeWidth={1.5} />
              <p className="mt-5 font-display text-2xl">No properties match these filters.</p>
              <p className="mt-2 text-sm text-ink-500">Try widening your budget or choosing another location.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
