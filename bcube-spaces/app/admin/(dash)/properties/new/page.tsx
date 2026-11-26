import { getAdmin } from "@/lib/admin";
import PageHeader from "@/components/admin/PageHeader";
import PropertyForm from "@/components/admin/PropertyForm";

export default async function NewProperty() {
  const { supabase } = await getAdmin();
  const [{ data: locations }, { data: categories }] = await Promise.all([
    supabase.from("locations").select("*").order("name"),
    supabase.from("categories").select("*").order("sort_order"),
  ]);
  return (
    <>
      <PageHeader title="Add property" subtitle="It appears on its area page, in search and in the listings as soon as you save." />
      <PropertyForm property={null} locations={locations ?? []} categories={categories ?? []} />
    </>
  );
}
