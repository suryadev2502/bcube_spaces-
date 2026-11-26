import Link from "next/link";
import { Eye, EyeOff, Pencil, Star, Trash2 } from "lucide-react";
import { getAdmin } from "@/lib/admin";
import { PROPERTY_SELECT } from "@/lib/data";
import { priceText } from "@/lib/format";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmButton from "@/components/admin/ConfirmButton";
import Flash from "@/components/admin/Flash";
import SmartImage from "@/components/SmartImage";
import { deleteProperty, toggleProperty } from "../../actions";
import type { Property } from "@/lib/types";

export default async function AdminProperties({ searchParams }: { searchParams: Promise<{ q?: string; saved?: string; demo?: string }> }) {
  const sp = await searchParams;
  const { supabase } = await getAdmin();
  let query = supabase.from("properties").select(PROPERTY_SELECT).order("created_at", { ascending: false });
  if (sp.q) query = query.ilike("title", `%${sp.q.replace(/[%,()]/g, " ")}%`);
  if (sp.demo) query = query.eq("is_demo", true);
  const { data, error } = await query;
  const rows = (data ?? []) as Property[];

  return (
    <>
      <PageHeader title="Properties" subtitle={`${rows.length} listing${rows.length === 1 ? "" : "s"}`} action={{ href: "/admin/properties/new", label: "Add property" }} />
      <Flash saved={sp.saved} error={error?.message} />
      <form className="mb-5"><input name="q" defaultValue={sp.q} placeholder="Search by property name…" className="input max-w-sm" /></form>
      <div className="card overflow-hidden">
        <ul className="divide-y divide-stone-100">
          {rows.map((p) => {
            const img = [...(p.images ?? [])].sort((a, b) => a.sort_order - b.sort_order)[0];
            return (
              <li key={p.id} className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
                <div className="relative h-16 w-24 flex-none overflow-hidden rounded-lg bg-stone-200">
                  {img && <SmartImage src={img.url} alt="" fill sizes="96px" className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/properties/${p.id}`} className="font-semibold hover:text-gold-700">{p.title}</Link>
                  <p className="text-xs text-stone-500">{p.location?.name} · {p.category?.name} · {priceText(p)}</p>
                  <div className="mt-1 flex gap-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${p.is_published ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>{p.is_published ? "PUBLISHED" : "HIDDEN"}</span>
                    {p.is_featured && <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-bold text-gold-700">FEATURED</span>}
                    {p.is_demo && <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold text-gold-300">SAMPLE</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <form action={toggleProperty}>
                    <input type="hidden" name="id" value={p.id} /><input type="hidden" name="field" value="is_published" /><input type="hidden" name="value" value={String(!p.is_published)} />
                    <button title={p.is_published ? "Unpublish" : "Publish"} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-stone-100">{p.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-stone-400" />}</button>
                  </form>
                  <form action={toggleProperty}>
                    <input type="hidden" name="id" value={p.id} /><input type="hidden" name="field" value="is_featured" /><input type="hidden" name="value" value={String(!p.is_featured)} />
                    <button title={p.is_featured ? "Remove from featured" : "Mark as featured"} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-stone-100"><Star className={`h-4 w-4 ${p.is_featured ? "fill-gold-500 text-gold-500" : "text-stone-400"}`} /></button>
                  </form>
                  <Link href={`/admin/properties/${p.id}`} title="Edit" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-stone-100"><Pencil className="h-4 w-4" /></Link>
                  <form action={deleteProperty}>
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmButton message={`Delete "${p.title}" permanently? This also removes its images.`} className="grid h-9 w-9 place-items-center rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></ConfirmButton>
                  </form>
                </div>
              </li>
            );
          })}
          {!rows.length && <li className="p-10 text-center text-sm text-stone-500">No properties yet. <Link href="/admin/properties/new" className="font-semibold text-gold-700">Add your first one</Link>.</li>}
        </ul>
      </div>
    </>
  );
}
