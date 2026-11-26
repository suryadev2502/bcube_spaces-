import Link from "next/link";
import { LogoMark } from "./icons";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`group flex items-center gap-3 ${light ? "text-white" : "text-ink"}`} aria-label="BCUBE SPACES home">
      <LogoMark className="h-9 w-9 transition-transform duration-500 group-hover:rotate-[8deg]" />
      <span className="leading-none">
        <span className="block font-display text-[22px] font-semibold tracking-[0.12em]">BCUBE</span>
        <span className="block text-[9px] font-semibold tracking-[0.5em] text-gold-500">SPACES</span>
      </span>
    </Link>
  );
}
