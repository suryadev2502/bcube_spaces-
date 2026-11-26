import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ items, light = false }: { items: { label: string; href?: string }[]; light?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-1.5 text-xs font-medium ${light ? "text-white/60" : "text-stone-500"}`}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3 w-3 opacity-60" />}
          {it.href ? <Link href={it.href} className={light ? "hover:text-white" : "hover:text-ink"}>{it.label}</Link> : <span className={light ? "text-white" : "text-ink"}>{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}
