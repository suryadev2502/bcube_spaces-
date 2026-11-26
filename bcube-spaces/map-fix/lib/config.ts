export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** When Supabase isn't configured the site runs in read-only demo mode using sample data. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes("YOUR-PROJECT"));

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const STORAGE_BUCKET = "property-images";

// Default: OpenStreetMap standard tiles (free, no API key; keep the attribution).
// For higher traffic, switch to a MapTiler / Stadia / Mapbox style URL via these env vars.
export const MAP_TILE_URL = process.env.NEXT_PUBLIC_MAP_TILE_URL ?? "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
export const MAP_TILE_ATTRIBUTION =
  process.env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION ?? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
/** Soft, muted map colours to match the site's black/white/gold palette. Set to false for full-colour tiles. */
export const MAP_MUTED = process.env.NEXT_PUBLIC_MAP_MUTED !== "false";

export const ZONES = [
  { key: "within_orr", label: "Within ORR", short: "Within ORR" },
  { key: "orr_to_rrr", label: "Between ORR & RRR", short: "ORR – RRR" },
  { key: "beyond_rrr", label: "Beyond RRR", short: "Beyond RRR" },
] as const;

/** Filter chips used on the homepage and the search page. */
export const TYPE_FILTERS = [
  { key: "residential", label: "Residential", group: "residential" },
  { key: "commercial", label: "Commercial", group: "commercial" },
  { key: "open-plots", label: "Open Plots", category: "open-plot" },
  { key: "apartments", label: "Apartments", category: "apartment" },
  { key: "villas", label: "Villas", category: "villa" },
  { key: "agricultural-land", label: "Agricultural Land", category: "agricultural-land" },
] as const;

export const SIZE_UNITS = [
  { key: "sq_yd", label: "Sq. Yards" },
  { key: "sq_ft", label: "Sq. Ft" },
  { key: "acre", label: "Acres" },
  { key: "gunta", label: "Guntas" },
] as const;
