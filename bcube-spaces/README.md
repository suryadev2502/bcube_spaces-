# BCUBE SPACES — Real Estate Website

Next.js 15 · TypeScript · Tailwind CSS · Framer Motion · Leaflet + OpenStreetMap · Supabase (database, image storage, admin login)

## What's included

| Area | Path |
|---|---|
| Homepage: hero + search, interactive Hyderabad map, featured properties with filters, Why BCUBE, About & Contact | `/` |
| Explore Locations: full map + every area grouped by zone | `/locations` |
| Area page: banner, description, property count, listings (or the "No properties currently available…" message) | `/locations/[area]` |
| Search & filters: name, location, category, budget, size, sorting | `/properties` |
| Property page: gallery with full-screen view, details, map, WhatsApp / Call / enquiry form, similar properties | `/properties/[property]` |
| About, Contact | `/about`, `/contact` |
| **Admin dashboard** (login, properties, locations, enquiries, map boundaries, contact settings) | `/admin` |
| SEO: readable URLs, page titles, sitemap.xml, robots.txt, listing structured data | automatic |

## 1. Run it on your computer (demo mode)

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Until Supabase is connected, the site runs in **demo mode**: a gold bar at the top says so, it shows the six sample listings (each marked **SAMPLE LISTING**), and the admin dashboard is turned off.

## 2. Connect Supabase (go live)

1. Create a free project at https://supabase.com.
2. **SQL Editor → New query**: paste all of `supabase/schema.sql` → **Run**. Then do the same with `supabase/seed.sql` (it adds the 32 starting areas, the categories, your contact settings and the sample listings). Both files can safely be run again.
3. **Authentication → Users → Add user**: create your admin login with email and password.
4. Make that user an admin. In the SQL Editor, run:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com';
   ```
5. **Project Settings → API**: copy the Project URL and the `anon` public key. Copy `.env.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```
6. Restart `npm run dev`, go to `/admin` and sign in.

## 3. Deploy (Vercel, recommended)

1. Push this folder to a GitHub repository.
2. On https://vercel.com, choose **New Project** and import the repo.
3. Add the three environment variables from step 5 and click **Deploy**.
4. Add your domain under **Settings → Domains**.

## 4. Your weekly update routine (no code)

`/admin` → **Properties → Add property**
- Pick an existing area, or choose **＋ Create a new area** in the area list.
- Upload photos. The first photo becomes the cover, and you can reorder them with the arrows. Large photos are resized automatically.
- Fill in only what you know. Empty fields are hidden on the website, so nothing is ever made up.
- Paste the Google Maps link and/or click the map to drop the exact pin.
- Tick **Featured** to show the property on the homepage.

Once you save, the property appears on its area page, in the listings, in search and (if featured) on the homepage. Unpublishing or deleting a property removes it everywhere.

Leads from every enquiry form appear under **Enquiries**, with Call and WhatsApp buttons and a status (New / Contacted / Closed).

## 5. Before launch — things to replace or check

- [ ] **Contact details**: Admin → Contact & settings (phone, WhatsApp, email, Instagram, address, About text). The starting values are placeholders.
- [ ] **Logo**: `components/icons.tsx` (`LogoMark`) and `public/favicon.svg` currently hold a placeholder monogram. Swap in your official logo.
- [ ] **Hero photo**: upload it in Admin → Contact & settings (the default is a drawn skyline placeholder).
- [ ] **Sample listings**: delete them (the dashboard reminds you while any remain).
- [ ] **Area pins and zones**: the 32 starting areas use *approximate* locality centres, and their Within ORR / Between ORR & RRR grouping is a best estimate. Check each one in Admin → Locations (click the map to move a pin).
- [ ] **ORR / RRR lines**: see below.

## 6. ORR and RRR boundaries (verified data only)

The map draws **no** ORR/RRR lines until real geographic data is added. It never invents them.

```bash
npm run fetch-boundaries
```

This downloads the actual ORR and RRR road geometry from OpenStreetMap into `public/geo/orr.geojson` and `public/geo/rrr.geojson`. Commit those files (the map picks them up automatically), or upload them in **Admin → Map boundaries**.

The RRR is still partly under construction or proposed, so OpenStreetMap may only have some sections. For an official alignment, trace it from the government notification map (for example with https://geojson.io), save it as GeoJSON, and upload it in Admin → Map boundaries.

## Project structure

```
app/(site)/          public pages
app/admin/           admin dashboard + server actions (actions.ts)
components/          UI components (map/, admin/)
lib/data.ts          all database reads (falls back to sample data in demo mode)
lib/config.ts        zones, filter chips, map tile settings
supabase/schema.sql  tables, security rules, image storage bucket
supabase/seed-data.json  starting areas/categories/samples → regenerate seed.sql with
                     `node scripts/generate-seed.mjs`
```

**Security:** visitors can only read published listings and submit enquiries. Every change goes through Supabase row-level security that checks the `admins` table, and admin pages also require a signed-in admin.

**Map tiles:** the default is CARTO's light basemap (OpenStreetMap data), which is free for moderate traffic. For heavy traffic, set `NEXT_PUBLIC_MAP_TILE_URL` to a Mapbox or MapTiler style URL.

**Future features** (favourites, comparison, blog, analytics, etc.) slot in as new tables and routes without changing the existing structure.
