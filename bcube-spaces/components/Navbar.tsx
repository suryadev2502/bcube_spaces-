"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import Logo from "./Logo";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/locations", label: "Explore Locations" },
  { href: "/properties", label: "Properties" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar({ phone }: { phone: string | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overHero = pathname === "/" && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${overHero ? "-mb-[76px] bg-transparent" : "border-b border-ink/5 bg-white/85 backdrop-blur-xl"}`}>
      <nav className="container-site flex h-[76px] items-center justify-between">
        <Logo light={overHero} />
        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`relative rounded-full px-4 py-2 text-[13px] font-semibold tracking-wide transition-colors ${
                  overHero ? "text-white/80 hover:text-white" : "text-ink-600 hover:text-ink"
                } ${isActive(l.href) ? (overHero ? "text-white" : "text-ink") : ""}`}
              >
                {l.label}
                {isActive(l.href) && <motion.span layoutId="nav-dot" className="absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full bg-gold-500" />}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Link href="/contact" className="btn-gold hidden !py-2.5 sm:inline-flex">
            <Phone className="h-4 w-4" /> Get in Touch
          </Link>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className={`grid h-11 w-11 place-items-center rounded-full lg:hidden ${overHero ? "text-white" : "text-ink"} hover:bg-ink/5`}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-ink/5 bg-white lg:hidden"
          >
            <ul className="container-site flex flex-col py-4">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={`block border-b border-stone-100 py-4 font-display text-2xl ${isActive(l.href) ? "text-gold-600" : "text-ink"}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
              {phone && (
                <li className="pt-5">
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="btn-gold w-full">
                    <Phone className="h-4 w-4" /> Call {phone}
                  </a>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
