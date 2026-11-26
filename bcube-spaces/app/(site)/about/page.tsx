import type { Metadata } from "next";
import AboutContact from "@/components/AboutContact";
import WhyChoose from "@/components/WhyChoose";
import { getSettings } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = { title: "About Us", description: "About BCUBE SPACES — location-focused real estate across Hyderabad." };

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <>
      <section className="bg-ink pb-20 pt-20 text-white sm:pt-28">
        <div className="container-site">
          <p className="eyebrow !text-gold-400">About us</p>
          <h1 className="mt-4 max-w-4xl text-5xl leading-[1.02] sm:text-7xl">Real estate, <span className="italic text-gold-300">mapped with care.</span></h1>
        </div>
      </section>
      <AboutContact settings={settings} showForm={false} />
      <WhyChoose />
    </>
  );
}
