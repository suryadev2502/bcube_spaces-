import Link from "next/link";
import { LogoMark } from "./icons";

/** Official B Cube Spaces logo: "b" mark + wordmark. `light` = for dark backgrounds. */
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`group flex items-center gap-2.5 ${light ? "text-white" : "text-ink"}`} aria-label="B Cube Spaces home">
      <LogoMark light={light} className="h-10 w-auto transition-transform duration-500 group-hover:-translate-y-0.5" />
      <span className="flex flex-col items-center leading-none">
        <span className="font-sans text-[21px] font-semibold tracking-[-0.01em]">B cube</span>
        <span className={`mt-1 font-sans text-[10px] font-medium tracking-[0.42em] ${light ? "text-white/70" : "text-ink-500"}`}>spaces</span>
      </span>
    </Link>
  );
}
