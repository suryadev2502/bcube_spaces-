"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PropertyCard from "./PropertyCard";
import { TYPE_FILTERS } from "@/lib/config";
import type { Property } from "@/lib/types";

export default function FeaturedProperties({ properties }: { properties: Property[] }) {
  const [type, setType] = useState<string>("all");
  const filtered = useMemo(() => {
    const f = TYPE_FILTERS.find((t) => t.key === type);
    if (!f) return properties;
    return properties.filter((p) => ("group" in f ? p.category.grp === f.group : p.category.slug === f.category));
  }, [properties, type]);

  return (
    <>
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        <button onClick={() => setType("all")} className={`${type === "all" ? "chip-on" : "chip-off"} flex-none`}>All</button>
        {TYPE_FILTERS.map((t) => (
          <button key={t.key} onClick={() => setType(t.key)} className={`${type === t.key ? "chip-on" : "chip-off"} flex-none`}>{t.label}</button>
        ))}
      </div>
      <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35 }}>
              <PropertyCard property={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {filtered.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-stone-300 p-10 text-center">
          <p className="text-ink-600">No featured properties in this category right now.</p>
          <Link href={`/properties?type=${type}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold-700">Browse all listings <ArrowRight className="h-4 w-4" /></Link>
        </div>
      )}
    </>
  );
}
