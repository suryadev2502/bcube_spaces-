import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getAdmin } from "@/lib/admin";
import { PROPERTY_SELECT } from "@/lib/data";
import PageHeader from "@/components/admin/PageHeader";
import PropertyForm from "@/components/admin/PropertyForm";
import type { Property } from "@/lib/types";

export default async function EditProperty({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await getAdmin();
  const [{ data: property }, { data: locations }, { data: categories }] = await Promise.all([
    supabase.from("properties").select(PROPERTY_SELECT).eq("id", id).maybeSingle(),
    supabase.from("locations").select("*").order("name"),
    supabase.from("categories").select("*").order("sort_order"),
  ]);
  if (!property) notFound();
  const p = property as Property;
  p.images = [...(p.images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  return (
    <>
      <PageHeader title="Edit property" subtitle={p.title} />
      {p.is_published && (
        <a href={`/properties/${p.slug}`} target="_blank" className="-mt-4 mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700">View on website <ExternalLink className="h-3.5 w-3.5" /></a>
      )}
      <PropertyForm property={p} locations={locations ?? []} categories={categories ?? []} />
    </>
  );
}
