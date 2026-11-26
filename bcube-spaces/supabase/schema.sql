-- =====================================================================
-- BCUBE SPACES — Database schema (Supabase / PostgreSQL)
-- Run this ONCE in Supabase → SQL Editor → New query → Run.
-- Then run seed.sql for the starting locations, categories and demo listings.
-- =====================================================================


-- ---------- Admins ----------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- Locations (areas on the map) ------------------------------
do $$ begin
  create type public.location_zone as enum ('within_orr', 'orr_to_rrr', 'beyond_rrr');
exception when duplicate_object then null; end $$;

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  zone public.location_zone not null default 'within_orr',
  description text,
  banner_url text,
  lat double precision,
  lng double precision,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Categories ------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  grp text not null check (grp in ('residential', 'commercial', 'agricultural')),
  sort_order int not null default 0
);

-- ---------- Properties ------------------------------------------------
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  location_id uuid not null references public.locations(id) on delete restrict,
  category_id uuid not null references public.categories(id) on delete restrict,
  short_description text,
  description text,
  price numeric,                 -- in INR; leave empty if not disclosed
  price_label text,              -- e.g. "Contact for Price" / "₹ 8,500 per sq yd"
  size_value numeric,
  size_unit text check (size_unit in ('sq_yd', 'sq_ft', 'acre', 'gunta')),
  size_sqyd numeric generated always as (
    case size_unit
      when 'sq_yd' then size_value
      when 'sq_ft' then size_value / 9
      when 'acre'  then size_value * 4840
      when 'gunta' then size_value * 121
    end
  ) stored,
  facing text,
  road_width text,
  dimensions text,
  floor_details text,
  ownership_details text,
  amenities text[] not null default '{}',
  landmarks text[] not null default '{}',
  connectivity text[] not null default '{}',
  lat double precision,
  lng double precision,
  map_url text,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_location_idx on public.properties(location_id);
create index if not exists properties_category_idx on public.properties(category_id);
create index if not exists properties_published_idx on public.properties(is_published, created_at desc);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists properties_touch on public.properties;
create trigger properties_touch before update on public.properties
for each row execute function public.touch_updated_at();

-- ---------- Property images -------------------------------------------
create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  url text not null,
  storage_path text,
  alt text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists property_images_property_idx on public.property_images(property_id, sort_order);

-- ---------- Enquiries (leads) -----------------------------------------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete set null,
  property_title text,
  name text not null check (char_length(name) between 1 and 120),
  phone text not null check (char_length(phone) between 6 and 20),
  message text check (char_length(message) <= 2000),
  source text,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

-- ---------- Site settings (single row) --------------------------------
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  phone text,
  whatsapp text,
  email text,
  address text,
  instagram_url text,
  about_text text,
  mission_text text,
  services text[] not null default '{}',
  hero_image_url text,
  updated_at timestamptz not null default now()
);

-- ---------- Map layers (ORR / RRR GeoJSON) ----------------------------
create table if not exists public.map_layers (
  key text primary key check (key in ('orr', 'rrr')),
  name text not null,
  geojson jsonb not null,
  source_note text,
  updated_at timestamptz not null default now()
);

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.admins          enable row level security;
alter table public.locations       enable row level security;
alter table public.categories      enable row level security;
alter table public.properties      enable row level security;
alter table public.property_images enable row level security;
alter table public.enquiries       enable row level security;
alter table public.site_settings   enable row level security;
alter table public.map_layers      enable row level security;

-- Admins table: an admin can see the list; nobody can write from the client.
drop policy if exists "admins read" on public.admins;
create policy "admins read" on public.admins for select using (public.is_admin());

-- Locations
drop policy if exists "locations public read" on public.locations;
create policy "locations public read" on public.locations for select using (is_active or public.is_admin());
drop policy if exists "locations admin write" on public.locations;
create policy "locations admin write" on public.locations for all using (public.is_admin()) with check (public.is_admin());

-- Categories
drop policy if exists "categories public read" on public.categories;
create policy "categories public read" on public.categories for select using (true);
drop policy if exists "categories admin write" on public.categories;
create policy "categories admin write" on public.categories for all using (public.is_admin()) with check (public.is_admin());

-- Properties: visitors only see published listings
drop policy if exists "properties public read" on public.properties;
create policy "properties public read" on public.properties for select using (is_published or public.is_admin());
drop policy if exists "properties admin write" on public.properties;
create policy "properties admin write" on public.properties for all using (public.is_admin()) with check (public.is_admin());

-- Images: visible if the parent listing is visible
drop policy if exists "images public read" on public.property_images;
create policy "images public read" on public.property_images for select using (
  exists (select 1 from public.properties p where p.id = property_id and (p.is_published or public.is_admin()))
);
drop policy if exists "images admin write" on public.property_images;
create policy "images admin write" on public.property_images for all using (public.is_admin()) with check (public.is_admin());

-- Enquiries: anyone can submit; only admins can read/manage
drop policy if exists "enquiries public insert" on public.enquiries;
create policy "enquiries public insert" on public.enquiries for insert with check (status = 'new');
drop policy if exists "enquiries admin manage" on public.enquiries;
create policy "enquiries admin manage" on public.enquiries for all using (public.is_admin()) with check (public.is_admin());

-- Settings & map layers: public read, admin write
drop policy if exists "settings public read" on public.site_settings;
create policy "settings public read" on public.site_settings for select using (true);
drop policy if exists "settings admin write" on public.site_settings;
create policy "settings admin write" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "layers public read" on public.map_layers;
create policy "layers public read" on public.map_layers for select using (true);
drop policy if exists "layers admin write" on public.map_layers;
create policy "layers admin write" on public.map_layers for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- Storage bucket for property & site images
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

drop policy if exists "property images public read" on storage.objects;
create policy "property images public read" on storage.objects
  for select using (bucket_id = 'property-images');

drop policy if exists "property images admin insert" on storage.objects;
create policy "property images admin insert" on storage.objects
  for insert with check (bucket_id = 'property-images' and public.is_admin());

drop policy if exists "property images admin update" on storage.objects;
create policy "property images admin update" on storage.objects
  for update using (bucket_id = 'property-images' and public.is_admin());

drop policy if exists "property images admin delete" on storage.objects;
create policy "property images admin delete" on storage.objects
  for delete using (bucket_id = 'property-images' and public.is_admin());
