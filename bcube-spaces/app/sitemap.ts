import type { MetadataRoute } from "next";
import { getLocations, getPublishedProperties } from "@/lib/data";
import { SITE_URL } from "@/lib/config";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [locations, properties] = await Promise.all([getLocations(), getPublishedProperties()]);
  return [
    ...["", "/locations", "/properties", "/about", "/contact"].map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly" as const })),
    ...locations.map((l) => ({ url: `${SITE_URL}/locations/${l.slug}`, changeFrequency: "weekly" as const })),
    ...properties.map((p) => ({ url: `${SITE_URL}/properties/${p.slug}`, lastModified: p.updated_at })),
  ];
}
