"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { TYPE_FILTERS } from "@/lib/config";

interface Props {
  image: string;
  locations: { name: string; slug: string }[];
}

export default function Hero({ image, locations }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    if (location) sp.set("location", location);
    if (type) sp.set("type", type);
    router.push(`/properties${sp.size ? `?${sp}` : ""}`);
  };

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink pb-16 pt-32 text-white sm:items-center sm:pb-24">
      <motion.div className="absolute inset-0" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="h-full w-full object-cover" fetchPriority="high" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(184,148,90,.18),transparent_55%)]" />

      <div className="container-site relative">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease }} className="eyebrow !text-gold-300">
          Hyderabad · ORR · RRR
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease }}
          className="mt-5 max-w-4xl text-[44px] leading-[1.02] sm:text-7xl lg:text-[88px]"
        >
          Find Your Space.
          <br />
          <span className="italic text-gold-300">Build Your Future.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.55, ease }} className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
          Discover residential, commercial, and investment opportunities across Hyderabad and beyond.
        </motion.p>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease }}
          className="mt-10 grid max-w-4xl gap-2 rounded-3xl border border-white/10 bg-white/10 p-2 backdrop-blur-xl sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:rounded-full"
          role="search"
        >
          <label className="flex items-center gap-3 rounded-full bg-white px-5 py-3.5 text-ink">
            <Search className="h-4 w-4 flex-none text-gold-600" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search properties or areas" className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400" aria-label="Search properties" />
          </label>
          <label className="flex items-center gap-2 rounded-full bg-white px-5 py-3.5 text-ink">
            <MapPin className="h-4 w-4 flex-none text-gold-600" />
            <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-transparent text-sm outline-none" aria-label="Location">
              <option value="">All locations</option>
              {locations.map((l) => <option key={l.slug} value={l.slug}>{l.name}</option>)}
            </select>
          </label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-full bg-white px-5 py-3.5 text-sm text-ink outline-none" aria-label="Property type">
            <option value="">All property types</option>
            {TYPE_FILTERS.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
          <button type="submit" className="btn-gold !py-3.5">Search</button>
        </motion.form>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }} className="mt-8 flex flex-wrap gap-3">
          <a href="#map" className="btn-ghost-light">
            <MapPin className="h-4 w-4" /> Explore Locations
          </a>
          <Link href="/properties" className="btn-ghost-light">
            View Properties <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
