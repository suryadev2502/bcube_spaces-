import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2 } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import Reveal from "@/components/Reveal";
import SmartImage from "@/components/SmartImage";
import { getLocationBySlug, getPropertiesByLocation } from "@/lib/data";
import { ZONES } from "@/lib/config";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const loc = await getLocationBySlug((await params).slug);
  if (!loc) return { title: "Location not found" };
  return {
    title: `Properties in ${loc.name}, Hyderabad`,
    description: loc.description ?? `Explore available properties in ${loc.name}, Hyderabad with BCUBE SPACES.`,
    alternates: { canonical: `/locations/${loc.slug}` },
  };
}

export default async function LocationPage({ params }: Params) {
  const loc = await getLocationBySlug((await params).slug);
  if (!loc) notFound();
  const properties = await getPropertiesByLocation(loc.id);
  const zone = ZONES.find((z) => z.key === loc.zone);

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        {loc.banner_url ? (
          <SmartImage src={loc.banner_url} alt={loc.name} fill priority sizes="100vw" className="object-cover opacity-50" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/hero.svg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
        <div className="container-site relative pb-16 pt-20 sm:pb-20 sm:pt-32">
          <Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "Hyderabad", href: "/locations" }, { label: loc.name }]} />
          <p className="eyebrow mt-10 !text-gold-400">{zone?.label}</p>
          <h1 className="mt-3 text-5xl leading-none sm:text-7xl lg:text-8xl">{loc.name}</h1>
          {loc.description && <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{loc.description}</p>}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 backdrop-blur">
            <Building2 className="h-4 w-4 text-gold-400" />
            <span className="text-sm font-semibold">{properties.length} propert{properties.length === 1 ? "y" : "ies"} available</span>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-site">
          {properties.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i * 0.06, 0.3)}>
                  <PropertyCard property={p} showDescription priority={i < 3} />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal className="mx-auto max-w-xl rounded-3xl bg-white p-12 text-center shadow-card">
              <Building2 className="mx-auto h-10 w-10 text-gold-500" strokeWidth={1.5} />
              <p className="mt-6 font-display text-2xl leading-snug">No properties currently available in this location. Check back soon for new listings.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/locations" className="btn-outline"><ArrowLeft className="h-4 w-4" /> Other locations</Link>
                <Link href="/contact" className="btn-gold">Ask about {loc.name}</Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
