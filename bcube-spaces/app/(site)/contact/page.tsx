import type { Metadata } from "next";
import AboutContact from "@/components/AboutContact";
import { getSettings } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = { title: "Contact Us", description: "Contact BCUBE SPACES by phone, WhatsApp or enquiry form." };

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <>
      <section className="bg-ink pb-20 pt-20 text-white sm:pt-28">
        <div className="container-site">
          <p className="eyebrow !text-gold-400">Contact us</p>
          <h1 className="mt-4 max-w-4xl text-5xl leading-[1.02] sm:text-7xl">Let’s talk <span className="italic text-gold-300">property.</span></h1>
        </div>
      </section>
      <AboutContact settings={settings} />
    </>
  );
}
