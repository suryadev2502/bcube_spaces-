import { Check, Mail, MapPin, Phone } from "lucide-react";
import Reveal from "./Reveal";
import { InstagramIcon, LogoMark, WhatsAppIcon } from "./icons";
import EnquiryForm from "./EnquiryForm";
import { whatsappLink } from "@/lib/format";
import type { SiteSettings } from "@/lib/types";

export default function AboutContact({ settings, showForm = true }: { settings: SiteSettings; showForm?: boolean }) {
  return (
    <section id="about" className="bg-stone-100 py-24 sm:py-32">
      <div className="container-site grid gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="flex items-center gap-4">
            <LogoMark className="h-16 w-auto" />
            <div className="flex flex-col items-center leading-none">
              <p className="text-3xl font-semibold tracking-[-0.01em]">B cube</p>
              <p className="mt-1.5 text-xs font-medium tracking-[0.42em] text-ink-500">spaces</p>
            </div>
          </div>
          <p className="eyebrow mt-12">About us</p>
          <p className="mt-4 font-display text-3xl leading-snug text-ink sm:text-[34px]">{settings.about_text}</p>
          {settings.mission_text && (
            <>
              <p className="eyebrow mt-10">Our mission</p>
              <p className="mt-3 text-base leading-relaxed text-ink-500">{settings.mission_text}</p>
            </>
          )}
          {settings.services.length > 0 && (
            <>
              <p className="eyebrow mt-10">Our services</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {settings.services.map((s) => (
                  <li key={s} className="flex items-start gap-3 text-sm text-ink-600">
                    <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-gold-500/15"><Check className="h-3 w-3 text-gold-700" /></span>
                    {s}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Reveal>

        <Reveal delay={0.1} id="contact" className="scroll-mt-28">
          <div className="rounded-[28px] bg-white p-7 shadow-lift sm:p-10">
            <p className="eyebrow">Contact us</p>
            <h2 className="mt-3 text-4xl">Let’s find your space.</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {settings.whatsapp && (
                <a href={whatsappLink(settings.whatsapp, "Hi BCUBE SPACES, I'd like to know more about your properties.")} target="_blank" rel="noopener noreferrer" className="btn bg-[#1f7a4d] text-white hover:bg-[#186640]">
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp us
                </a>
              )}
              {settings.phone && (
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="btn-dark"><Phone className="h-4 w-4" /> Call now</a>
              )}
            </div>
            <ul className="mt-8 space-y-3 text-sm text-ink-600">
              {settings.phone && <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-gold-600" /> {settings.phone}</li>}
              {settings.email && <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-gold-600" /> <a href={`mailto:${settings.email}`} className="hover:text-ink">{settings.email}</a></li>}
              {settings.address && <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-gold-600" /> {settings.address}</li>}
              {settings.instagram_url && (
                <li className="flex items-center gap-3"><InstagramIcon className="h-4 w-4 text-gold-600" /> <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-ink">Follow us on Instagram</a></li>
              )}
            </ul>
            {showForm && (
              <div className="mt-8 border-t border-stone-100 pt-8">
                <EnquiryForm source="contact-section" />
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
