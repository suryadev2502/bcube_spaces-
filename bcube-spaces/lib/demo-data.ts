// Read-only SAMPLE data used when Supabase isn't connected yet (demo mode).
// The same content is loaded into the database by supabase/seed.sql.
import seed from "@/supabase/seed-data.json";
import { slugify, toSqYd } from "./format";
import type { Category, Location, Property, SiteSettings, SizeUnit, Zone } from "./types";

export const demoCategories: Category[] = seed.categories.map((c, i) => ({
  id: `cat-${i}`, name: c.name, slug: c.slug, grp: c.grp as Category["grp"], sort_order: c.sort_order,
}));

export const demoLocations: Location[] = seed.locations.map((l, i) => ({
  id: `loc-${i}`, name: l.name, slug: slugify(l.name), zone: l.zone as Zone, description: l.description,
  banner_url: null, lat: l.lat, lng: l.lng, is_active: true, sort_order: i,
}));

const day = 86_400_000;
export const demoProperties: Property[] = seed.properties.map((p, i) => {
  const loc = demoLocations.find((l) => l.name === p.location)!;
  const cat = demoCategories.find((c) => c.slug === p.category)!;
  const created = new Date(Date.UTC(2026, 10, 20) - i * day).toISOString();
  const raw = p as Record<string, unknown>;
  return {
    id: `prop-${i}`,
    title: p.title,
    slug: slugify(`${p.title}-${p.location}`),
    location_id: loc.id,
    category_id: cat.id,
    short_description: p.short_description,
    description: p.description,
    price: p.price,
    price_label: p.price_label,
    size_value: p.size_value,
    size_unit: p.size_unit as SizeUnit,
    size_sqyd: toSqYd(p.size_value, p.size_unit as SizeUnit),
    facing: (raw.facing as string) ?? null,
    road_width: (raw.road_width as string) ?? null,
    dimensions: (raw.dimensions as string) ?? null,
    floor_details: (raw.floor_details as string) ?? null,
    ownership_details: null,
    amenities: p.amenities,
    landmarks: p.landmarks,
    connectivity: p.connectivity,
    lat: p.lat,
    lng: p.lng,
    map_url: null,
    is_featured: p.is_featured,
    is_published: true,
    is_demo: true,
    created_at: created,
    updated_at: created,
    location: { id: loc.id, name: loc.name, slug: loc.slug, zone: loc.zone },
    category: { id: cat.id, name: cat.name, slug: cat.slug, grp: cat.grp },
    images: p.images.map((im, j) => ({ id: `img-${i}-${j}`, url: `/demo/${im}.svg`, alt: `${p.title} (sample image)`, sort_order: j })),
  };
});

export const demoSettings: SiteSettings = {
  phone: "+91 90000 00000",
  whatsapp: "919000000000",
  email: "hello@example.com",
  address: "Hyderabad, Telangana",
  instagram_url: "https://instagram.com/",
  about_text:
    "BCUBE SPACES is a Hyderabad real estate platform that helps buyers and investors discover residential, commercial and land opportunities — from the heart of the city to the fast-growing corridors between the ORR and the RRR.",
  mission_text: "To make property discovery clear, location-focused and transparent, so every client can make a confident decision.",
  services: ["Residential plots & homes", "Apartments & villas", "Commercial spaces", "Agricultural & investment land", "Site visits & personal assistance"],
  hero_image_url: null,
};
