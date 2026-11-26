"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Building2, ExternalLink, Inbox, LayoutDashboard, LogOut, Map, MapPin, Menu, Settings, X } from "lucide-react";
import Logo from "@/components/Logo";
import { signOut } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Properties", icon: Building2 },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/map", label: "Map boundaries", icon: Map },
  { href: "/admin/settings", label: "Contact & settings", icon: Settings },
];

export default function AdminNav({ email, newEnquiries }: { email: string; newEnquiries: number }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (h: string) => (h === "/admin" ? path === h : path.startsWith(h));
  const links = (
    <>
      <ul className="space-y-1">
        {NAV.map((n) => (
          <li key={n.href}>
            <Link href={n.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active(n.href) ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>
              <n.icon className={`h-4 w-4 ${active(n.href) ? "text-gold-400" : ""}`} /> {n.label}
              {n.href === "/admin/enquiries" && newEnquiries > 0 && <span className="ml-auto rounded-full bg-gold-500 px-2 text-[10px] font-bold text-ink">{newEnquiries}</span>}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
        <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:text-white"><ExternalLink className="h-4 w-4" /> View website</a>
        <p className="truncate px-3 pt-2 text-xs text-white/40">{email}</p>
        <form action={signOut}><button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:text-white"><LogOut className="h-4 w-4" /> Sign out</button></form>
      </div>
    </>
  );
  return (
    <>
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-ink p-5 lg:flex">
        <div className="mb-8 px-2"><Logo light /></div>
        {links}
      </aside>
      <div className="sticky top-0 z-40 flex items-center justify-between bg-ink px-4 py-3 lg:hidden">
        <Logo light />
        <button onClick={() => setOpen(!open)} className="text-white" aria-label="Menu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="fixed inset-x-0 bottom-0 top-[60px] z-40 flex flex-col bg-ink p-5 lg:hidden">{links}</div>}
    </>
  );
}
