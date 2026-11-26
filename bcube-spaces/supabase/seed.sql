-- BCUBE SPACES seed data (generated from seed-data.json). Safe to re-run.
-- Location coordinates are approximate; verify in Admin → Locations.

insert into public.categories (name, slug, grp, sort_order) values
  ('Open Plot', 'open-plot', 'residential', 1),
  ('Apartment', 'apartment', 'residential', 2),
  ('Villa', 'villa', 'residential', 3),
  ('Independent House', 'independent-house', 'residential', 4),
  ('Commercial Space', 'commercial-space', 'commercial', 5),
  ('Commercial Plot', 'commercial-plot', 'commercial', 6),
  ('Agricultural Land', 'agricultural-land', 'agricultural', 7)
on conflict (slug) do nothing;

insert into public.locations (name, slug, zone, description, lat, lng, sort_order) values
  ('Gachibowli', 'gachibowli', 'within_orr', 'Hyderabad''s established IT and education hub, home to major tech campuses, the stadium and premium residential communities.', 17.4401, 78.3489, 0),
  ('Financial District', 'financial-district', 'within_orr', 'Nanakramguda''s corporate core with Grade-A offices, high-rise residences and direct ORR access.', 17.4156, 78.3396, 1),
  ('Kokapet', 'kokapet', 'within_orr', 'A fast-rising address west of the Financial District, known for Neopolis, high-rise developments and the ORR interchange.', 17.3955, 78.3275, 2),
  ('Narsingi', 'narsingi', 'within_orr', 'Well-connected residential and commercial pocket between Gandipet, Kokapet and the Financial District.', 17.3866, 78.3597, 3),
  ('Tellapur', 'tellapur', 'within_orr', 'A planned residential growth zone close to Nallagandla, Gachibowli and the ORR.', 17.4672, 78.2862, 4),
  ('Nallagandla', 'nallagandla', 'within_orr', 'Quiet, green residential neighbourhood near Serilingampally with gated communities.', 17.4719, 78.309, 5),
  ('Miyapur', 'miyapur', 'within_orr', 'Metro-connected residential hub on the Mumbai Highway corridor.', 17.4968, 78.3573, 6),
  ('Kukatpally', 'kukatpally', 'within_orr', 'One of Hyderabad''s most established residential and retail areas with metro connectivity.', 17.4849, 78.4138, 7),
  ('Bachupally', 'bachupally', 'within_orr', 'Growing residential belt north of Miyapur with schools and new communities.', 17.5446, 78.3863, 8),
  ('Kompally', 'kompally', 'within_orr', 'Popular northern suburb on the NH-44 corridor with villas and apartments.', 17.5361, 78.4868, 9),
  ('Medchal', 'medchal', 'orr_to_rrr', 'Northern growth corridor along NH-44 with industrial and residential development.', 17.6297, 78.4814, 10),
  ('Uppal', 'uppal', 'within_orr', 'Eastern hub with metro access, the cricket stadium and the Warangal Highway.', 17.4058, 78.5591, 11),
  ('LB Nagar', 'lb-nagar', 'within_orr', 'South-east gateway on the Vijayawada Highway with strong metro and road links.', 17.3457, 78.5522, 12),
  ('Shamshabad', 'shamshabad', 'within_orr', 'Home to the Rajiv Gandhi International Airport and an emerging southern growth hub.', 17.2603, 78.3969, 13),
  ('Adibatla', 'adibatla', 'orr_to_rrr', 'Aerospace and IT SEZ zone near the ORR on the Srisailam/Nagarjuna Sagar side.', 17.2333, 78.55, 14),
  ('Maheshwaram', 'maheshwaram', 'orr_to_rrr', 'Southern zone known for hardware parks and plotted developments beyond the ORR.', 17.136, 78.433, 15),
  ('Mokila', 'mokila', 'orr_to_rrr', 'Developing western locality beyond Kokapet and Tellapur with villa and plot projects.', 17.433, 78.24, 16),
  ('Shankarpally', 'shankarpally', 'orr_to_rrr', 'Western town with farmland, plotted layouts and weekend-home potential.', 17.456, 78.131, 17),
  ('Patancheru', 'patancheru', 'orr_to_rrr', 'Industrial and residential town on the Mumbai Highway at the ORR.', 17.533, 78.265, 18),
  ('Isnapur', 'isnapur', 'orr_to_rrr', 'Developing residential pocket beyond Patancheru on the NH-65 corridor.', 17.5539, 78.2183, 19),
  ('Kollur', 'kollur', 'orr_to_rrr', 'Emerging residential area near the ORR with large township projects.', 17.48, 78.26, 20),
  ('Muthangi', 'muthangi', 'orr_to_rrr', 'ORR-adjacent locality near Patancheru with plotted and residential developments.', 17.5197, 78.2397, 21),
  ('ORR Exit Areas', 'orr-exit-areas', 'orr_to_rrr', 'Properties located close to Outer Ring Road exits around the city.', null, null, 22),
  ('Tukkuguda', 'tukkuguda', 'orr_to_rrr', 'Southern locality near the ORR, close to the airport and Srisailam Highway.', 17.2053, 78.4884, 23),
  ('Mucherla', 'mucherla', 'orr_to_rrr', 'Southern zone in Kandukur mandal, discussed for large-scale future city development.', 17.045, 78.57, 24),
  ('Yadagirigutta', 'yadagirigutta', 'orr_to_rrr', 'Temple town to the north-east, seeing interest in plotted and investment land.', 17.5878, 78.9449, 25),
  ('Bhongir', 'bhongir', 'orr_to_rrr', 'Historic fort town on the Warangal Highway corridor.', 17.514, 78.888, 26),
  ('Ghatkesar', 'ghatkesar', 'orr_to_rrr', 'Eastern ORR locality on the Warangal Highway with plotted developments.', 17.451, 78.686, 27),
  ('Bibinagar', 'bibinagar', 'orr_to_rrr', 'Developing eastern town, home to AIIMS Bibinagar.', 17.474, 78.796, 28),
  ('Kandukur', 'kandukur', 'orr_to_rrr', 'Southern mandal on the Srisailam Highway side with open land and plots.', 17.1036, 78.5361, 29),
  ('Ibrahimpatnam', 'ibrahimpatnam', 'orr_to_rrr', 'South-eastern town on the Nagarjuna Sagar Highway with growing plotted layouts.', 17.192, 78.65, 30),
  ('Chevella', 'chevella', 'orr_to_rrr', 'Western town known for farmland, farmhouses and the Bijapur Highway.', 17.307, 78.136, 31)
on conflict (slug) do nothing;

insert into public.site_settings (id, phone, whatsapp, email, address, instagram_url, about_text, mission_text, services)
values (1, '+91 90000 00000', '919000000000', 'hello@example.com', 'Hyderabad, Telangana', 'https://instagram.com/',
  'BCUBE SPACES is a Hyderabad real estate platform that helps buyers and investors discover residential, commercial and land opportunities — from the heart of the city to the fast-growing corridors between the ORR and the RRR.',
  'To make property discovery clear, location-focused and transparent, so every client can make a confident decision.',
  array['Residential plots & homes','Apartments & villas','Commercial spaces','Agricultural & investment land','Site visits & personal assistance'])
on conflict (id) do nothing;

-- ---------- SAMPLE / DEMO listings (delete from Admin when you add real ones) ----------
with ins as (
  insert into public.properties (title, slug, location_id, category_id, short_description, description, price, price_label, size_value, size_unit, facing, road_width, dimensions, floor_details, amenities, landmarks, connectivity, lat, lng, is_featured, is_published, is_demo)
  select 'Premium Residential Plot', 'premium-residential-plot-kokapet', l.id, c.id, 'Sample listing — an east-facing residential plot in Kokapet. Replace with your real property details.', 'SAMPLE CONTENT. This listing shows how a property page looks on BCUBE SPACES. Replace the name, photos, price and every detail with information for a real property from the Admin dashboard, or delete it.', null, 'Contact for Price', 300, 'sq_yd', 'East', '40 ft', '45 ft × 60 ft', null, array['Sample amenity: Gated layout','Sample amenity: Underground drainage']::text[], array['Sample landmark']::text[], array['Sample: Near ORR']::text[], 17.3955, 78.3275, true, true, true
  from public.locations l, public.categories c where l.slug = 'kokapet' and c.slug = 'open-plot'
  on conflict (slug) do nothing returning id
)
insert into public.property_images (property_id, url, alt, sort_order)
select ins.id, v.url, 'Premium Residential Plot (sample image)', v.ord from ins, (values ('/demo/demo-1a.svg', 0), ('/demo/demo-1b.svg', 1), ('/demo/demo-1c.svg', 2)) as v(url, ord);

with ins as (
  insert into public.properties (title, slug, location_id, category_id, short_description, description, price, price_label, size_value, size_unit, facing, road_width, dimensions, floor_details, amenities, landmarks, connectivity, lat, lng, is_featured, is_published, is_demo)
  select 'Sample Gated Villa', 'sample-gated-villa-tellapur', l.id, c.id, 'Sample listing — a villa in a gated community. Replace with your real property.', 'SAMPLE CONTENT. Use this card to see how a villa appears on the site, then replace or delete it.', 35000000, null, 3200, 'sq_ft', 'North', null, null, 'G + 2 (sample)', array['Sample: Clubhouse','Sample: Swimming pool']::text[], array[]::text[], array[]::text[], 17.4672, 78.2862, true, true, true
  from public.locations l, public.categories c where l.slug = 'tellapur' and c.slug = 'villa'
  on conflict (slug) do nothing returning id
)
insert into public.property_images (property_id, url, alt, sort_order)
select ins.id, v.url, 'Sample Gated Villa (sample image)', v.ord from ins, (values ('/demo/demo-2a.svg', 0), ('/demo/demo-2b.svg', 1)) as v(url, ord);

with ins as (
  insert into public.properties (title, slug, location_id, category_id, short_description, description, price, price_label, size_value, size_unit, facing, road_width, dimensions, floor_details, amenities, landmarks, connectivity, lat, lng, is_featured, is_published, is_demo)
  select 'Sample 3 BHK Apartment', 'sample-3-bhk-apartment-narsingi', l.id, c.id, 'Sample listing — a 3 BHK apartment. Replace with your real property.', 'SAMPLE CONTENT. This shows how an apartment listing looks, including floor details.', 16000000, null, 1850, 'sq_ft', 'West', null, null, '12th floor (sample)', array[]::text[], array[]::text[], array[]::text[], 17.3866, 78.3597, true, true, true
  from public.locations l, public.categories c where l.slug = 'narsingi' and c.slug = 'apartment'
  on conflict (slug) do nothing returning id
)
insert into public.property_images (property_id, url, alt, sort_order)
select ins.id, v.url, 'Sample 3 BHK Apartment (sample image)', v.ord from ins, (values ('/demo/demo-3a.svg', 0), ('/demo/demo-3b.svg', 1)) as v(url, ord);

with ins as (
  insert into public.properties (title, slug, location_id, category_id, short_description, description, price, price_label, size_value, size_unit, facing, road_width, dimensions, floor_details, amenities, landmarks, connectivity, lat, lng, is_featured, is_published, is_demo)
  select 'Sample Farm Land Parcel', 'sample-farm-land-parcel-shankarpally', l.id, c.id, 'Sample listing — agricultural land. Replace with your real property.', 'SAMPLE CONTENT. Shows how agricultural land is presented, with size in acres.', null, 'Contact for Price', 2, 'acre', null, '30 ft (sample)', null, null, array[]::text[], array[]::text[], array[]::text[], 17.456, 78.131, false, true, true
  from public.locations l, public.categories c where l.slug = 'shankarpally' and c.slug = 'agricultural-land'
  on conflict (slug) do nothing returning id
)
insert into public.property_images (property_id, url, alt, sort_order)
select ins.id, v.url, 'Sample Farm Land Parcel (sample image)', v.ord from ins, (values ('/demo/demo-4a.svg', 0), ('/demo/demo-4b.svg', 1)) as v(url, ord);

with ins as (
  insert into public.properties (title, slug, location_id, category_id, short_description, description, price, price_label, size_value, size_unit, facing, road_width, dimensions, floor_details, amenities, landmarks, connectivity, lat, lng, is_featured, is_published, is_demo)
  select 'Sample Commercial Office Space', 'sample-commercial-office-space-financial-district', l.id, c.id, 'Sample listing — office space. Replace with your real property.', 'SAMPLE CONTENT. Shows how a commercial listing appears.', null, 'Contact for Price', 5000, 'sq_ft', null, null, null, 'Sample: 6th floor', array[]::text[], array[]::text[], array[]::text[], 17.4156, 78.3396, true, true, true
  from public.locations l, public.categories c where l.slug = 'financial-district' and c.slug = 'commercial-space'
  on conflict (slug) do nothing returning id
)
insert into public.property_images (property_id, url, alt, sort_order)
select ins.id, v.url, 'Sample Commercial Office Space (sample image)', v.ord from ins, (values ('/demo/demo-5a.svg', 0), ('/demo/demo-5b.svg', 1)) as v(url, ord);

with ins as (
  insert into public.properties (title, slug, location_id, category_id, short_description, description, price, price_label, size_value, size_unit, facing, road_width, dimensions, floor_details, amenities, landmarks, connectivity, lat, lng, is_featured, is_published, is_demo)
  select 'Sample Open Plot near ORR', 'sample-open-plot-near-orr-tukkuguda', l.id, c.id, 'Sample listing — an open plot near the ORR. Replace with your real property.', 'SAMPLE CONTENT. Shows how a priced open plot appears.', 4500000, null, 200, 'sq_yd', 'North-East', null, null, null, array[]::text[], array[]::text[], array[]::text[], 17.2053, 78.4884, true, true, true
  from public.locations l, public.categories c where l.slug = 'tukkuguda' and c.slug = 'open-plot'
  on conflict (slug) do nothing returning id
)
insert into public.property_images (property_id, url, alt, sort_order)
select ins.id, v.url, 'Sample Open Plot near ORR (sample image)', v.ord from ins, (values ('/demo/demo-6a.svg', 0), ('/demo/demo-6b.svg', 1)) as v(url, ord);

