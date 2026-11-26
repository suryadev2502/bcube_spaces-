import Reveal from "./Reveal";

export default function SectionHeading({ eyebrow, title, intro, light = false, align = "left" }: { eyebrow: string; title: React.ReactNode; intro?: string; light?: boolean; align?: "left" | "center" }) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`eyebrow ${light ? "!text-gold-400" : ""}`}>{eyebrow}</p>
      <h2 className={`mt-4 text-4xl leading-[1.05] sm:text-5xl ${light ? "text-white" : "text-ink"}`}>{title}</h2>
      {intro && <p className={`mt-5 text-base leading-relaxed ${light ? "text-white/65" : "text-ink-500"}`}>{intro}</p>}
    </Reveal>
  );
}
