// Regenerates supabase/seed.sql from supabase/seed-data.json
// Usage: node scripts/generate-seed.mjs
import fs from "node:fs";
const data = JSON.parse(fs.readFileSync(new URL("../supabase/seed-data.json", import.meta.url)));
const q = (v) => v === null || v === undefined ? "null" : typeof v === "number" ? String(v) : typeof v === "boolean" ? String(v) : `'${String(v).replace(/'/g, "''")}'`;
const arr = (a) => `array[${(a || []).map(q).join(",")}]::text[]`;
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
let out = `-- BCUBE SPACES seed data (generated from seed-data.json). Safe to re-run.\n-- Location coordinates are approximate; verify in Admin → Locations.\n\n`;
out += `insert into public.categories (name, slug, grp, sort_order) values\n` +
  data.categories.map(c => `  (${q(c.name)}, ${q(c.slug)}, ${q(c.grp)}, ${c.sort_order})`).join(",\n") +
  `\non conflict (slug) do nothing;\n\n`;
out += `insert into public.locations (name, slug, zone, description, lat, lng, sort_order) values\n` +
  data.locations.map((l, i) => `  (${q(l.name)}, ${q(slug(l.name))}, '${l.zone}', ${q(l.description)}, ${q(l.lat)}, ${q(l.lng)}, ${i})`).join(",\n") +
  `\non conflict (slug) do nothing;\n\n`;
out += `insert into public.site_settings (id, phone, whatsapp, email, address, instagram_url, about_text, mission_text, services)\nvalues (1, '+91 90000 00000', '919000000000', 'hello@example.com', 'Hyderabad, Telangana', 'https://instagram.com/',\n  'BCUBE SPACES is a Hyderabad real estate platform that helps buyers and investors discover residential, commercial and land opportunities — from the heart of the city to the fast-growing corridors between the ORR and the RRR.',\n  'To make property discovery clear, location-focused and transparent, so every client can make a confident decision.',\n  array['Residential plots & homes','Apartments & villas','Commercial spaces','Agricultural & investment land','Site visits & personal assistance'])\non conflict (id) do nothing;\n\n`;
out += `-- ---------- SAMPLE / DEMO listings (delete from Admin when you add real ones) ----------\n`;
for (const p of data.properties) {
  const s = slug(p.title + "-" + p.location);
  out += `with ins as (\n  insert into public.properties (title, slug, location_id, category_id, short_description, description, price, price_label, size_value, size_unit, facing, road_width, dimensions, floor_details, amenities, landmarks, connectivity, lat, lng, is_featured, is_published, is_demo)\n  select ${q(p.title)}, ${q(s)}, l.id, c.id, ${q(p.short_description)}, ${q(p.description)}, ${q(p.price)}, ${q(p.price_label)}, ${q(p.size_value)}, ${q(p.size_unit)}, ${q(p.facing)}, ${q(p.road_width)}, ${q(p.dimensions)}, ${q(p.floor_details)}, ${arr(p.amenities)}, ${arr(p.landmarks)}, ${arr(p.connectivity)}, ${q(p.lat)}, ${q(p.lng)}, ${p.is_featured}, true, true\n  from public.locations l, public.categories c where l.slug = ${q(slug(p.location))} and c.slug = ${q(p.category)}\n  on conflict (slug) do nothing returning id\n)\ninsert into public.property_images (property_id, url, alt, sort_order)\nselect ins.id, v.url, ${q(p.title + " (sample image)")}, v.ord from ins, (values ${p.images.map((im, i) => `('/demo/${im}.svg', ${i})`).join(", ")}) as v(url, ord);\n\n`;
}
fs.writeFileSync(new URL("../supabase/seed.sql", import.meta.url), out);
console.log("seed.sql written");
