"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Loader2, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { TYPE_FILTERS } from "@/lib/config";
import { formatINR } from "@/lib/format";

const BUDGETS = [1e6, 2.5e6, 5e6, 7.5e6, 1e7, 2e7, 5e7, 1e8];
const SIZES = [100, 150, 200, 300, 500, 1000, 2420, 4840, 24200];
const sizeLabel = (v: number) => (v >= 4840 ? `${v / 4840} acre${v > 4840 ? "s" : ""}` : v === 2420 ? "½ acre" : `${v} sq yd`);

export default function SearchFilters({ locations }: { locations: { name: string; slug: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [showMore, setShowMore] = useState(Boolean(sp.get("min") || sp.get("max") || sp.get("minSize") || sp.get("maxSize")));

  useEffect(() => setQ(sp.get("q") ?? ""), [sp]);

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    start(() => router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false }));
  };

  const select = (name: string, label: string, options: { value: string; label: string }[]) => (
    <label className="block">
      <span className="label">{label}</span>
      <select value={sp.get(name) ?? ""} onChange={(e) => update({ [name]: e.target.value || null })} className="input">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );

  return (
    <div className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-ink/5 sm:p-6">
      <form onSubmit={(e) => { e.preventDefault(); update({ q: q.trim() || null }); }} className="flex gap-2">
        <label className="flex flex-1 items-center gap-3 rounded-full bg-stone-100 px-5 py-3 focus-within:ring-2 focus-within:ring-gold-300">
          <Search className="h-4 w-4 text-gold-600" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by property name, area or type" className="w-full bg-transparent text-sm outline-none" aria-label="Search properties" />
        </label>
        <button className="btn-dark !px-5" type="submit">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}</button>
      </form>
      <div className="mt-4 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap">
        <button onClick={() => update({ type: null })} className={`${!sp.get("type") ? "chip-on" : "chip-off"} flex-none !py-1.5`}>All types</button>
        {TYPE_FILTERS.map((t) => (
          <button key={t.key} onClick={() => update({ type: t.key })} className={`${sp.get("type") === t.key ? "chip-on" : "chip-off"} flex-none !py-1.5`}>{t.label}</button>
        ))}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {select("location", "Location", [{ value: "", label: "All locations" }, ...locations.map((l) => ({ value: l.slug, label: l.name }))])}
        {select("sort", "Sort by", [{ value: "", label: "Latest properties" }, { value: "price_asc", label: "Price: Low to High" }, { value: "price_desc", label: "Price: High to Low" }])}
        <div className="flex items-end gap-2">
          <button type="button" onClick={() => setShowMore((v) => !v)} className="btn-outline flex-1 !py-3"><SlidersHorizontal className="h-4 w-4" /> Budget & size</button>
          <button type="button" onClick={() => { setQ(""); start(() => router.replace(pathname, { scroll: false })); }} className="btn-outline !px-4 !py-3" aria-label="Reset filters"><RotateCcw className="h-4 w-4" /></button>
        </div>
      </div>
      {showMore && (
        <div className="mt-4 grid gap-4 border-t border-stone-100 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          {select("min", "Min budget", [{ value: "", label: "No min" }, ...BUDGETS.map((b) => ({ value: String(b), label: formatINR(b) }))])}
          {select("max", "Max budget", [{ value: "", label: "No max" }, ...BUDGETS.map((b) => ({ value: String(b), label: formatINR(b) }))])}
          {select("minSize", "Min size", [{ value: "", label: "Any" }, ...SIZES.map((s) => ({ value: String(s), label: sizeLabel(s) }))])}
          {select("maxSize", "Max size", [{ value: "", label: "Any" }, ...SIZES.map((s) => ({ value: String(s), label: sizeLabel(s) }))])}
          <p className="text-xs text-stone-500 sm:col-span-2 lg:col-span-4">Budget filters only include listings with a published price. Sizes are compared across units (sq ft, sq yd, acres, guntas).</p>
        </div>
      )}
    </div>
  );
}
