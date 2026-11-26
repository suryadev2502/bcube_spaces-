import { notFound } from "next/navigation";
import { getAdmin } from "@/lib/admin";
import PageHeader from "@/components/admin/PageHeader";
import LocationForm from "@/components/admin/LocationForm";

export default async function EditLocation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await getAdmin();
  const { data } = await supabase.from("locations").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return (
    <>
      <PageHeader title="Edit location" subtitle={data.name} />
      <LocationForm location={data} />
    </>
  );
}
