import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import HyderabadMap from "@/components/map/HyderabadMap";
import FeaturedProperties from "@/components/FeaturedProperties";
import WhyChoose from "@/components/WhyChoose";
import AboutContact from "@/components/AboutContact";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { getFeaturedProperties, getLocations, getMapLayers, getSettings } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, locations, layers, featured] = await Promise.all([getSettings(), getLocations(), getMapLayers(), getFeaturedProperties(9)]);
  const listed = locations.filter((l) => l.property_count > 0).length;

  return (
    <>
      <Hero image={settings.hero_image_url || "/hero.svg"} locations={locations.map((l) => ({ name: l.name, slug: l.slug }))} />

      <section id="map" className="scroll-mt-20 py-24 sm:py-32">
        <div className="container-site">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Explore Hyderabad"
              title={<>From the city core to the <span className="italic text-gold-600">RRR corridor.</span></>}
              intro="Tap any location to see the properties available there. Zoom, drag and search the map to explore established neighbourhoods and fast-growing zones between the Outer Ring Road and the Regional Ring Road."
            />
            <Reveal delay={0.1} className="flex gap-10">
              <div><p className="font-display text-5xl text-ink">{locations.length}</p><p className="mt-1 text-xs font-semibold uppercase tracking-wider text-stone-500">Locations</p></div>
              <div><p className="font-display text-5xl text-gold-600">{listed}</p><p className="mt-1 text-xs font-semibold uppercase tracking-wider text-stone-500">With listings</p></div>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="mt-12">
            <HyderabadMap locations={locations} layers={layers} />
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <div className="container-site">
          <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Featured properties" title="Handpicked opportunities." />
            <Link href="/properties" className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-gold-700">View all properties <ArrowRight className="h-4 w-4" /></Link>
          </div>
          {featured.length ? (
            <FeaturedProperties properties={featured} />
          ) : (
            <p className="rounded-2xl border border-dashed border-stone-300 p-10 text-center text-ink-500">New featured properties are coming soon.</p>
          )}
        </div>
      </section>

      <WhyChoose />
      <AboutContact settings={settings} />
    </>
  );
}
