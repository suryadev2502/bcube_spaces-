import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Compass, ExternalLink, Layers, MapPin, Maximize, Navigation, Phone, Route, Ruler, ScrollText, Building, Tag } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Gallery from "@/components/Gallery";
import EnquiryForm from "@/components/EnquiryForm";
import PropertyCard from "@/components/PropertyCard";
import Reveal from "@/components/Reveal";
import PinMap from "@/components/map/PinMap";
import { WhatsAppIcon } from "@/components/icons";
import { getPropertyBySlug, getSettings, getSimilarProperties } from "@/lib/data";
import { priceText, sizeText, whatsappLink } from "@/lib/format";
import { SITE_URL } from "@/lib/config";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = await getPropertyBySlug((await params).slug);
  if (!p) return { title: "Property not found" };
  const img = p.images[0]?.url;
  return {
    title: `${p.title} in ${p.location.name}`,
    description: p.short_description ?? `${p.category.name} in ${p.location.name}, Hyderabad — ${priceText(p)}.`,
    alternates: { canonical: `/properties/${p.slug}` },
    openGraph: img && !img.endsWith(".svg") ? { images: [img] } : undefined,
  };
}

export default async function PropertyPage({ params }: Params) {
  const p = await getPropertyBySlug((await params).slug);
  if (!p) notFound();
  const [settings, similar] = await Promise.all([getSettings(), getSimilarProperties(p)]);
  const size = sizeText(p);
  const pageUrl = `${SITE_URL}/properties/${p.slug}`;
  const waText = `Hi BCUBE SPACES, I'm interested in "${p.title}" (${p.location.name}). ${pageUrl}`;
  const hasCoords = p.lat != null && p.lng != null;
  const mapsLink = p.map_url || (hasCoords ? `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}` : null);

  // Only show fields that were actually provided.
  const specs = [
    { icon: Tag, label: "Property type", value: p.category.name },
    { icon: Maximize, label: "Area", value: size },
    { icon: Compass, label: "Facing", value: p.facing },
    { icon: Route, label: "Road width", value: p.road_width },
    { icon: Ruler, label: "Dimensions", value: p.dimensions },
    { icon: Layers, label: "Floor details", value: p.floor_details },
    { icon: ScrollText, label: "Ownership", value: p.ownership_details },
  ].filter((s) => s.value && String(s.value).trim());

  const lists = [
    { title: "Amenities", items: p.amenities },
    { title: "Nearby landmarks", items: p.landmarks },
    { title: "Connectivity", items: p.connectivity },
  ].filter((l) => l.items.length);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.title,
    url: pageUrl,
    description: p.short_description ?? undefined,
    image: p.images.map((i) => (i.url.startsWith("/") ? SITE_URL + i.url : i.url)),
    datePosted: p.created_at,
    ...(p.price != null && !p.price_label ? { offers: { "@type": "Offer", price: p.price, priceCurrency: "INR" } } : {}),
    ...(hasCoords ? { geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng } } : {}),
    address: { "@type": "PostalAddress", addressLocality: p.location.name, addressRegion: "Telangana", addressCountry: "IN" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="container-site pb-6 pt-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: p.location.name, href: `/locations/${p.location.slug}` }, { label: p.title }]} />
      </div>

      <section className="container-site grid gap-10 pb-20 lg:grid-cols-[1fr_400px] lg:gap-14">
        <div className="min-w-0">
          <Reveal y={12}><Gallery images={p.images} title={p.title} /></Reveal>

          <Reveal className="mt-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-ink px-3 py-1 text-[11px] font-semibold text-white">{p.category.name}</span>
              {p.is_demo && <span className="rounded-full bg-gold-500 px-3 py-1 text-[10px] font-bold tracking-wider text-ink">SAMPLE LISTING — REPLACE</span>}
            </div>
            <h1 className="mt-4 text-4xl leading-[1.05] sm:text-6xl">{p.title}</h1>
            <p className="mt-3 flex items-center gap-2 text-ink-500"><MapPin className="h-4 w-4 text-gold-600" /> {p.location.name}, Hyderabad</p>
            <p className="mt-6 font-display text-4xl text-gold-700 lg:hidden">{priceText(p)}</p>
          </Reveal>

          {specs.length > 0 && (
            <Reveal className="mt-10 grid grid-cols-2 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200 sm:grid-cols-3">
              {specs.map((s) => (
                <div key={s.label} className="p-5 shadow-[inset_-1px_-1px_0_#E8E4DC]">
                  <s.icon className="h-5 w-5 text-gold-600" strokeWidth={1.6} />
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-stone-500">{s.label}</p>
                  <p className="mt-1 font-medium text-ink">{s.value}</p>
                </div>
              ))}
            </Reveal>
          )}

          {p.description && (
            <Reveal className="mt-12">
              <h2 className="text-3xl">About this property</h2>
              <div className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-ink-500">{p.description}</div>
            </Reveal>
          )}

          {lists.length > 0 && (
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              {lists.map((l) => (
                <Reveal key={l.title}>
                  <h3 className="text-2xl">{l.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {l.items.map((it) => (
                      <li key={it} className="flex items-start gap-3 text-sm text-ink-600"><span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-gold-500" />{it}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          )}

          {(hasCoords || mapsLink) && (
            <Reveal className="mt-12">
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-3xl">Location</h2>
                {mapsLink && (
                  <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700 hover:text-ink">
                    <Navigation className="h-4 w-4" /> Open in Google Maps <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              {hasCoords && (
                <div className="mt-5 h-[360px] overflow-hidden rounded-2xl ring-1 ring-ink/5 sm:h-[420px]">
                  <PinMap lat={p.lat} lng={p.lng} zoom={15} />
                </div>
              )}
            </Reveal>
          )}
        </div>

        {/* ---------- Sticky contact column ---------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div id="enquire" className="scroll-mt-28 rounded-3xl bg-ink p-7 text-white shadow-lift">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">Price</p>
            <p className="mt-1 font-display text-4xl text-gold-300">{priceText(p)}</p>
            {size && <p className="mt-1 text-sm text-white/60">{size}</p>}
            <div className="mt-6 grid gap-2.5">
              <a href="#enquiry-form" className="btn-gold"><Building className="h-4 w-4" /> Contact BCUBE SPACES</a>
              <div className="grid grid-cols-2 gap-2.5">
                {settings.whatsapp && (
                  <a href={whatsappLink(settings.whatsapp, waText)} target="_blank" rel="noopener noreferrer" className="btn bg-[#1f7a4d] text-white hover:bg-[#186640]"><WhatsAppIcon className="h-4 w-4" /> WhatsApp</a>
                )}
                {settings.phone && (
                  <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="btn border border-white/20 text-white hover:bg-white hover:text-ink"><Phone className="h-4 w-4" /> Call now</a>
                )}
              </div>
            </div>
            <div id="enquiry-form" className="mt-8 scroll-mt-28 border-t border-white/10 pt-7">
              <p className="mb-5 font-display text-2xl">Send an enquiry</p>
              <EnquiryForm dark propertyId={p.id} propertyTitle={p.title} source="property-page" />
            </div>
          </div>
        </aside>
      </section>

      {similar.length > 0 && (
        <section className="bg-white py-20">
          <div className="container-site">
            <p className="eyebrow">You may also like</p>
            <h2 className="mt-3 text-4xl">Similar properties</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((s) => <PropertyCard key={s.id} property={s} />)}
            </div>
          </div>
        </section>
      )}

      {/* Mobile quick-contact bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-ink/5 bg-white/95 p-3 backdrop-blur lg:hidden">
        {settings.phone && <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="btn-outline !px-2 !py-2.5 text-xs"><Phone className="h-4 w-4" /> Call</a>}
        {settings.whatsapp && <a href={whatsappLink(settings.whatsapp, waText)} target="_blank" rel="noopener noreferrer" className="btn !px-2 !py-2.5 bg-[#1f7a4d] text-xs text-white"><WhatsAppIcon className="h-4 w-4" /> WhatsApp</a>}
        <a href="#enquiry-form" className="btn-gold !px-2 !py-2.5 text-xs">Enquire</a>
      </div>
      <div className="h-16 lg:hidden" />
    </>
  );
}
