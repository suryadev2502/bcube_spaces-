import { BadgeCheck, Eye, Handshake, Layers, MapPin } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const POINTS = [
  { icon: BadgeCheck, title: "Verified property information", text: "Listings are checked before they go live, so the details you see are the details you get." },
  { icon: MapPin, title: "Location-focused discovery", text: "Explore Hyderabad area by area — from established neighbourhoods to the ORR–RRR growth belt." },
  { icon: Eye, title: "Transparent property details", text: "Size, facing, road access, amenities and location shown clearly on every listing." },
  { icon: Layers, title: "Multiple investment opportunities", text: "Open plots, apartments, villas, commercial spaces and agricultural land in one place." },
  { icon: Handshake, title: "Personal assistance", text: "Talk to our team directly for site visits, documentation guidance and honest advice." },
];

export default function WhyChoose() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white sm:py-32">
      <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-gold-500/10 blur-3xl" />
      <div className="container-site relative">
        <SectionHeading light eyebrow="Why BCUBE SPACES" title={<>A clearer way to <span className="italic text-gold-300">find property</span> in Hyderabad.</>} />
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
          {POINTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08} className="group bg-ink p-7 transition-colors duration-500 hover:bg-ink-800">
              <p.icon className="h-7 w-7 text-gold-400 transition-transform duration-500 group-hover:-translate-y-1" strokeWidth={1.5} />
              <h3 className="mt-8 text-2xl leading-tight">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
