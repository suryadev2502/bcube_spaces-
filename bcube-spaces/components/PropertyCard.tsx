import Link from "next/link";
import { ArrowUpRight, ImageOff, MapPin, Ruler } from "lucide-react";
import SmartImage from "./SmartImage";
import { priceText, sizeText } from "@/lib/format";
import type { Property } from "@/lib/types";

export default function PropertyCard({ property: p, showDescription = false, priority = false }: { property: Property; showDescription?: boolean; priority?: boolean }) {
  const href = `/properties/${p.slug}`;
  const img = p.images[0];
  const size = sizeText(p);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ink/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-stone-200" aria-label={p.title}>
        {img ? (
          <SmartImage src={img.url} alt={img.alt ?? p.title} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" priority={priority} className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]" />
        ) : (
          <div className="grid h-full place-items-center text-stone-400"><ImageOff className="h-8 w-8" /></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-80" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-ink backdrop-blur">{p.category.name}</span>
          {p.is_demo && <span className="rounded-full bg-gold-500 px-3 py-1 text-[10px] font-bold tracking-wider text-ink">SAMPLE LISTING</span>}
        </div>
        <p className="absolute bottom-4 left-4 font-display text-2xl text-white drop-shadow">{priceText(p)}</p>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <Link href={href}>
          <h3 className="text-[22px] leading-tight text-ink transition-colors group-hover:text-gold-700">{p.title}</h3>
        </Link>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-stone-500">
          <MapPin className="h-3.5 w-3.5 text-gold-600" /> {p.location.name}, Hyderabad
        </p>
        {showDescription && p.short_description && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-500">{p.short_description}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
          {size ? (
            <span className="flex items-center gap-1.5 text-sm font-medium text-ink-600"><Ruler className="h-3.5 w-3.5 text-gold-600" /> {size}</span>
          ) : <span />}
          <Link href={href} className="inline-flex items-center gap-1 rounded-full border border-ink/10 px-4 py-2 text-xs font-semibold transition hover:border-ink hover:bg-ink hover:text-white">
            View Details <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
