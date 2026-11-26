import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";
import { InstagramIcon, WhatsAppIcon } from "./icons";
import { whatsappLink } from "@/lib/format";
import type { SiteSettings } from "@/lib/types";

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-ink text-white">
      <div className="container-site grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo light />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">{settings.about_text}</p>
          <div className="mt-6 flex gap-3">
            {settings.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition hover:border-gold-500 hover:text-gold-400">
                <InstagramIcon className="h-4 w-4" />
              </a>
            )}
            {settings.whatsapp && (
              <a href={whatsappLink(settings.whatsapp, "Hi BCUBE SPACES, I'd like to know more about your properties.")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition hover:border-gold-500 hover:text-gold-400">
                <WhatsAppIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
        <div className="md:col-span-3">
          <p className="eyebrow !text-gold-400">Explore</p>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            <li><Link className="hover:text-white" href="/locations">Explore Locations</Link></li>
            <li><Link className="hover:text-white" href="/properties">All Properties</Link></li>
            <li><Link className="hover:text-white" href="/properties?type=open-plots">Open Plots</Link></li>
            <li><Link className="hover:text-white" href="/properties?type=commercial">Commercial</Link></li>
            <li><Link className="hover:text-white" href="/about">About Us</Link></li>
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="eyebrow !text-gold-400">Contact</p>
          <ul className="mt-5 space-y-4 text-sm text-white/70">
            {settings.phone && <li className="flex gap-3"><Phone className="h-4 w-4 flex-none text-gold-500" /><a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-white">{settings.phone}</a></li>}
            {settings.email && <li className="flex gap-3"><Mail className="h-4 w-4 flex-none text-gold-500" /><a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a></li>}
            {settings.address && <li className="flex gap-3"><MapPin className="h-4 w-4 flex-none text-gold-500" /><span>{settings.address}</span></li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-6 text-xs text-white/40 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} BCUBE SPACES. All rights reserved.</p>
          <p>Map data © OpenStreetMap contributors</p>
        </div>
      </div>
    </footer>
  );
}
