import { getAdmin } from "@/lib/admin";
import { demoSettings } from "@/lib/demo-data";
import PageHeader from "@/components/admin/PageHeader";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function Settings() {
  const { supabase } = await getAdmin();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return (
    <>
      <PageHeader title="Contact & settings" subtitle="Used in the header, footer, About section and on every property page." />
      <SettingsForm s={{ ...demoSettings, ...(data ?? {}), services: data?.services ?? demoSettings.services }} />
    </>
  );
}
