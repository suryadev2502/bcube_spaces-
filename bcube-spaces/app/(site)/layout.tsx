import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/config";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      {!isSupabaseConfigured && (
        <div className="relative z-[60] bg-gold-500 px-4 py-1.5 text-center text-[11px] font-semibold tracking-wide text-ink">
          DEMO MODE — showing sample listings. Connect Supabase (see README) to go live and enable the admin dashboard.
        </div>
      )}
      <Navbar phone={settings.phone} />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  );
}
