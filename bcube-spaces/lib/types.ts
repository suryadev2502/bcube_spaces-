export type Zone = "within_orr" | "orr_to_rrr" | "beyond_rrr";
export type SizeUnit = "sq_yd" | "sq_ft" | "acre" | "gunta";
export type CategoryGroup = "residential" | "commercial" | "agricultural";

export interface Location {
  id: string;
  name: string;
  slug: string;
  zone: Zone;
  description: string | null;
  banner_url: string | null;
  lat: number | null;
  lng: number | null;
  is_active: boolean;
  sort_order: number;
}

export interface LocationWithCount extends Location {
  property_count: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  grp: CategoryGroup;
  sort_order: number;
}

export interface PropertyImage {
  id: string;
  url: string;
  storage_path?: string | null;
  alt: string | null;
  sort_order: number;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  location_id: string;
  category_id: string;
  short_description: string | null;
  description: string | null;
  price: number | null;
  price_label: string | null;
  size_value: number | null;
  size_unit: SizeUnit | null;
  size_sqyd: number | null;
  facing: string | null;
  road_width: string | null;
  dimensions: string | null;
  floor_details: string | null;
  ownership_details: string | null;
  amenities: string[];
  landmarks: string[];
  connectivity: string[];
  lat: number | null;
  lng: number | null;
  map_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
  location: Pick<Location, "id" | "name" | "slug" | "zone">;
  category: Pick<Category, "id" | "name" | "slug" | "grp">;
  images: PropertyImage[];
}

export interface Enquiry {
  id: string;
  property_id: string | null;
  property_title: string | null;
  name: string;
  phone: string;
  message: string | null;
  source: string | null;
  status: "new" | "contacted" | "closed";
  created_at: string;
}

export interface SiteSettings {
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  instagram_url: string | null;
  about_text: string | null;
  mission_text: string | null;
  services: string[];
  hero_image_url: string | null;
}

export interface MapLayer {
  key: "orr" | "rrr";
  name: string;
  geojson: GeoJSON.GeoJsonObject;
  source_note: string | null;
}

export interface SearchParams {
  q?: string;
  location?: string;
  type?: string;
  min?: string;
  max?: string;
  minSize?: string;
  maxSize?: string;
  sort?: "latest" | "price_asc" | "price_desc";
}
