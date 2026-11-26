import Link from "next/link";
import { Phone, Trash2 } from "lucide-react";
import { getAdmin } from "@/lib/admin";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmButton from "@/components/admin/ConfirmButton";
import StatusSelect from "@/components/admin/StatusSelect";
import { WhatsAppIcon } from "@/components/icons";
import { deleteEnquiry } from "../../actions";
import { whatsappLink } from "@/lib/format";
import type { Enquiry } from "@/lib/types";

const TABS = [{ key: "", label: "All" }, { key: "new", label: "New" }, { key: "contacted", label: "Contacted" }, { key: "closed", label: "Closed" }];

export default async function Enquiries({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const { supabase } = await getAdmin();
  let q = supabase.from("enquiries").select("*, property:properties(slug)").order("created_at", { ascending: false }).limit(500);
  if (status) q = q.eq("status", status);
  const { data } = await q;
  const rows = (data ?? []) as (Enquiry & { property: { slug: string } | null })[];
  const fmt = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

  return (
    <>
      <PageHeader title="Enquiries" subtitle="Leads from property pages and the contact form." />
      <div className="mb-5 flex gap-2">
        {TABS.map((t) => <Link key={t.key} href={t.key ? `/admin/enquiries?status=${t.key}` : "/admin/enquiries"} className={(status ?? "") === t.key ? "chip-on !py-1.5" : "chip-off !py-1.5"}>{t.label}</Link>)}
      </div>
      <div className="space-y-3">
        {rows.map((e) => (
          <div key={e.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{e.name}</p>
                <span className="text-sm text-stone-500">{e.phone}</span>
                <span className="text-xs text-stone-400">· {fmt.format(new Date(e.created_at))}</span>
              </div>
              <p className="mt-1 text-sm">
                {e.property_title ? (
                  e.property ? <a href={`/properties/${e.property.slug}`} target="_blank" className="font-medium text-gold-700 hover:underline">{e.property_title}</a> : <span className="font-medium">{e.property_title}</span>
                ) : <span className="text-stone-500">General enquiry</span>}
                {e.source && <span className="text-xs text-stone-400"> · via {e.source}</span>}
              </p>
              {e.message && <p className="mt-2 whitespace-pre-line text-sm text-ink-600">{e.message}</p>}
            </div>
            <div className="flex items-center gap-2">
              <a href={`tel:${e.phone.replace(/\s/g, "")}`} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-stone-100" title="Call"><Phone className="h-4 w-4" /></a>
              <a href={whatsappLink(e.phone.replace(/\D/g, "").length === 10 ? `91${e.phone.replace(/\D/g, "")}` : e.phone, `Hi ${e.name}, this is BCUBE SPACES regarding your enquiry${e.property_title ? ` about ${e.property_title}` : ""}.`)} target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-lg text-[#1f7a4d] hover:bg-stone-100" title="WhatsApp"><WhatsAppIcon className="h-4 w-4" /></a>
              <StatusSelect id={e.id} status={e.status} />
              <form action={deleteEnquiry}>
                <input type="hidden" name="id" value={e.id} />
                <ConfirmButton message="Delete this enquiry?" className="grid h-9 w-9 place-items-center rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></ConfirmButton>
              </form>
            </div>
          </div>
        ))}
        {!rows.length && <div className="card p-10 text-center text-sm text-stone-500">No enquiries here yet.</div>}
      </div>
    </>
  );
}
