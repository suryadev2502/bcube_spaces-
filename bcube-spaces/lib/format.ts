import type { Property, SizeUnit } from "./types";

export function formatINR(n: number): string {
  if (n >= 1e7) return `₹ ${trim(n / 1e7)} Cr`;
  if (n >= 1e5) return `₹ ${trim(n / 1e5)} L`;
  return `₹ ${n.toLocaleString("en-IN")}`;
}
const trim = (v: number) => (Math.round(v * 100) / 100).toString();

export function priceText(p: Pick<Property, "price" | "price_label">): string {
  if (p.price_label && p.price_label.trim()) return p.price_label;
  if (p.price != null) return formatINR(Number(p.price));
  return "Price on Request";
}

const UNIT_LABEL: Record<SizeUnit, string> = { sq_yd: "Sq. Yards", sq_ft: "Sq. Ft", acre: "Acres", gunta: "Guntas" };

export function sizeText(p: Pick<Property, "size_value" | "size_unit">): string | null {
  if (p.size_value == null || !p.size_unit) return null;
  const v = Number(p.size_value);
  const unit = v === 1 ? UNIT_LABEL[p.size_unit].replace(/s$/, "") : UNIT_LABEL[p.size_unit];
  return `${v.toLocaleString("en-IN")} ${unit}`;
}

export function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}

export function toSqYd(value: number, unit: SizeUnit): number {
  return unit === "sq_ft" ? value / 9 : unit === "acre" ? value * 4840 : unit === "gunta" ? value * 121 : value;
}

export function digitsOnly(s: string | null | undefined): string {
  return (s ?? "").replace(/\D/g, "");
}

export function whatsappLink(number: string | null | undefined, text: string): string {
  const n = digitsOnly(number);
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}

/** Extracts coordinates from a pasted Google Maps link if they're present in the URL. */
export function coordsFromMapsUrl(url: string): { lat: number; lng: number } | null {
  const pats = [/@(-?\d+\.\d+),(-?\d+\.\d+)/, /[?&](?:q|query|ll|destination)=(-?\d+\.\d+),\s*(-?\d+\.\d+)/, /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/];
  for (const re of pats) {
    const m = url.match(re);
    if (m) {
      const lat = parseFloat(m[1]), lng = parseFloat(m[2]);
      if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
    }
  }
  return null;
}
