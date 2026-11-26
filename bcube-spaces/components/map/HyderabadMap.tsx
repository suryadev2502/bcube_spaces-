"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Info, Maximize2, Minimize2, Search, X } from "lucide-react";
import { ZONES } from "@/lib/config";
import type { LocationWithCount, MapLayer, Zone } from "@/lib/types";

const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-stone-100">
      <div className="flex items-center gap-3 text-sm text-stone-500">
        <span className="h-2 w-2 animate-ping rounded-full bg-gold-500" /> Loading Hyderabad map…
      </div>
    </div>
  ),
});

interface Props {
  locations: LocationWithCount[];
  layers: MapLayer[];
  height?: string;
}

export default function HyderabadMap({ locations, layers, height = "h-[480px] sm:h-[560px] lg:h-[680px]" }: Props) {
  const router = useRouter();
  const [active, setActive] = useState<string | null>(null);
  const [picked, setPicked] = useState<LocationWithCount | null>(null);
  const [query, setQuery] = useState("");
  const [zones, setZones] = useState<Set<Zone>>(new Set(ZONES.map((z) => z.key)));
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number; zoom?: number; key: number } | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFullscreen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [fullscreen]);

  const visible = useMemo(() => locations.filter((l) => zones.has(l.zone)), [locations, zones]);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? locations.filter((l) => l.name.toLowerCase().includes(q)).slice(0, 8) : [];
  }, [locations, query]);
  const zonesPresent = ZONES.filter((z) => locations.some((l) => l.zone === z.key));
  const hasOrr = layers.some((l) => l.key === "orr");
  const hasRrr = layers.some((l) => l.key === "rrr");

  const go = (slug: string) => router.push(`/locations/${slug}`);
  const pick = (l: LocationWithCount) => {
    setQuery("");
    setPicked(l);
    setActive(l.slug);
    if (l.lat != null && l.lng != null) setFlyTo({ lat: l.lat, lng: l.lng, zoom: 13, key: Date.now() });
    if (!zones.has(l.zone)) setZones(new Set([...zones, l.zone]));
  };
  const toggleZone = (z: Zone) => {
    const next = new Set(zones);
    if (next.has(z)) next.delete(z); else next.add(z);
    setZones(next);
  };

  return (
    <div className={fullscreen ? "fixed inset-0 z-[80] bg-white" : "relative"}>
      <div className={`grid overflow-hidden bg-white ${fullscreen ? "h-full lg:grid-cols-[360px_1fr]" : "rounded-[28px] shadow-lift ring-1 ring-ink/5 lg:grid-cols-[360px_1fr]"}`}>
        {/* ---------- Side panel ---------- */}
        <aside className={`order-2 flex flex-col border-ink/5 lg:order-1 lg:border-r ${fullscreen ? "max-h-[40vh]" : "max-h-[460px]"} lg:h-0 lg:max-h-none lg:min-h-full`}>
          <div className="relative border-b border-ink/5 p-4">
            <label className="flex items-center gap-3 rounded-full bg-stone-100 px-4 py-3 focus-within:ring-2 focus-within:ring-gold-300">
              <Search className="h-4 w-4 text-gold-600" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && results[0]) pick(results[0]);
                }}
                placeholder="Search a location…"
                className="w-full bg-transparent text-sm outline-none"
                aria-label="Search location on map"
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear search"><X className="h-4 w-4 text-stone-400" /></button>
              )}
            </label>
            <AnimatePresence>
              {query && (
                <motion.ul
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute inset-x-4 top-[68px] z-20 overflow-hidden rounded-2xl border border-ink/5 bg-white shadow-lift"
                >
                  {results.length ? (
                    results.map((l) => (
                      <li key={l.id}>
                        <button onClick={() => pick(l)} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-stone-50">
                          <span>{l.name}</span>
                          <span className="text-xs text-stone-400">{ZONES.find((z) => z.key === l.zone)?.short}</span>
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-3 text-sm text-stone-500">No matching location</li>
                  )}
                </motion.ul>
              )}
            </AnimatePresence>
            <div className="mt-3 flex flex-wrap gap-2">
              {zonesPresent.map((z) => (
                <button key={z.key} onClick={() => toggleZone(z.key)} className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${zones.has(z.key) ? "border-ink bg-ink text-white" : "border-stone-200 text-stone-500"}`}>
                  <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${z.key === "within_orr" ? "bg-gold-500" : z.key === "orr_to_rrr" ? "bg-charcoal ring-1 ring-white/50" : "bg-stone-500"}`} />
                  {z.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain p-2">
            {zonesPresent.filter((z) => zones.has(z.key)).map((z) => (
              <div key={z.key} className="mb-2">
                <p className="px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">{z.label}</p>
                <ul>
                  {visible.filter((l) => l.zone === z.key).map((l) => (
                    <li key={l.id}>
                      <button
                        onClick={() => go(l.slug)}
                        onMouseEnter={() => setActive(l.slug)}
                        onMouseLeave={() => setActive(null)}
                        onFocus={() => setActive(l.slug)}
                        className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${active === l.slug ? "bg-ink text-white" : "hover:bg-stone-100"}`}
                      >
                        <span className="font-medium">{l.name}</span>
                        <span className="flex items-center gap-2">
                          {l.property_count > 0 && (
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active === l.slug ? "bg-gold-500 text-ink" : "bg-gold-100 text-gold-700"}`}>{l.property_count}</span>
                          )}
                          <ArrowRight className={`h-3.5 w-3.5 transition ${active === l.slug ? "translate-x-0.5 opacity-100" : "opacity-0 group-hover:opacity-60"}`} />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* ---------- Map ---------- */}
        <div className={`relative order-1 lg:order-2 ${fullscreen ? "h-[60vh] lg:h-full" : height}`}>
          <MapInner
            locations={visible}
            layers={layers}
            activeSlug={active}
            flyTo={flyTo}
            onHover={setActive}
            onSelect={go}
            fullscreen={fullscreen}
          />

          <button
            onClick={() => setFullscreen((v) => !v)}
            className="absolute right-3 top-3 z-[500] grid h-10 w-10 place-items-center rounded-xl bg-white text-ink shadow-lift transition hover:bg-ink hover:text-white"
            aria-label={fullscreen ? "Exit full screen" : "Full screen map"}
          >
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          {/* Legend */}
          <div className="pointer-events-none absolute bottom-3 left-3 z-[500] max-w-[260px] rounded-2xl bg-white/95 p-3 text-[11px] shadow-lift backdrop-blur">
            <div className="flex flex-col gap-1.5">
              {hasOrr && <span className="flex items-center gap-2"><span className="h-[3px] w-6 rounded bg-gold-500" /> Outer Ring Road (ORR)</span>}
              {hasRrr && <span className="flex items-center gap-2"><span className="w-6 border-t-[3px] border-dashed border-charcoal" /> Regional Ring Road (RRR)</span>}
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-gold-500 ring-2 ring-white" /> Within ORR</span>
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-charcoal ring-2 ring-white" /> Between ORR & RRR</span>
              {(!hasOrr || !hasRrr) && (
                <span className="mt-1 hidden gap-1.5 text-stone-500 sm:flex"><Info className="mt-px h-3 w-3 flex-none" /> {!hasOrr && !hasRrr ? "ORR/RRR lines" : !hasOrr ? "ORR line" : "RRR line"} will appear once verified boundary data is added.</span>
              )}
            </div>
          </div>

          <AnimatePresence>
            {picked && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="absolute left-1/2 top-3 z-[500] w-[min(92%,340px)] -translate-x-1/2 rounded-2xl bg-ink p-4 text-white shadow-lift"
              >
                <button onClick={() => { setPicked(null); setActive(null); }} className="absolute right-3 top-3 text-white/50 hover:text-white" aria-label="Close"><X className="h-4 w-4" /></button>
                <p className="eyebrow !text-gold-400">{ZONES.find((z) => z.key === picked.zone)?.label}</p>
                <p className="mt-1 font-display text-2xl">{picked.name}</p>
                <p className="mt-1 text-xs text-white/60">{picked.property_count ? `${picked.property_count} propert${picked.property_count === 1 ? "y" : "ies"} available` : "No listings yet"}</p>
                <button onClick={() => go(picked.slug)} className="btn-gold mt-3 w-full !py-2.5">View properties <ArrowRight className="h-4 w-4" /></button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
