import Link from "next/link";
import { ArrowRight, Building2, Eye, Inbox, MapPin, Plus } from "lucide-react";
import { getAdmin } from "@/lib/admin";
import PageHeader from "@/components/admin/PageHeader";

export default async function Dashboard() {
  const { supabase } = await getAdmin();
  const head = { count: "exact" as const, head: true };
  const [all, published, demo, locations, newEnq, recent] = await Promise.all([
    supabase.from("properties").select("id", head),
    supabase.from("properties").select("id", head).eq("is_published", true),
    supabase.from("properties").select("id", head).eq("is_demo", true),
    supabase.from("locations").select("id", head),
    supabase.from("enquiries").select("id", head).eq("status", "new"),
    supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(6),
  ]);
  const stats = [
    { label: "Total properties", value: all.count ?? 0, icon: Building2, href: "/admin/properties" },
    { label: "Published", value: published.count ?? 0, icon: Eye, href: "/admin/properties" },
    { label: "Locations", value: locations.count ?? 0, icon: MapPin, href: "/admin/locations" },
    { label: "New enquiries", value: newEnq.count ?? 0, icon: Inbox, href: "/admin/enquiries?status=new" },
  ];
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Your weekly property updates start here." action={{ href: "/admin/properties/new", label: "Add property" }} />
      {(demo.count ?? 0) > 0 && (
        <div className="mb-6 rounded-2xl border border-gold-300 bg-gold-50 p-4 text-sm text-gold-700">
          {demo.count} sample listing{demo.count === 1 ? " is" : "s are"} still live. <Link href="/admin/properties?demo=1" className="font-semibold underline">Review and delete them</Link> once your real properties are added.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-5 transition hover:-translate-y-0.5">
            <s.icon className="h-5 w-5 text-gold-600" />
            <p className="mt-4 font-display text-4xl">{s.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{s.label}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between"><h2 className="text-2xl">Latest enquiries</h2><Link href="/admin/enquiries" className="text-sm font-semibold text-gold-700">View all</Link></div>
          <ul className="mt-4 divide-y divide-stone-100">
            {(recent.data ?? []).map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <div className="min-w-0">
                  <p className="font-semibold">{e.name} <span className="font-normal text-stone-500">· {e.phone}</span></p>
                  <p className="truncate text-stone-500">{e.property_title ?? "General enquiry"}{e.message ? ` — ${e.message}` : ""}</p>
                </div>
                <span className={`flex-none rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${e.status === "new" ? "bg-gold-100 text-gold-700" : "bg-stone-100 text-stone-500"}`}>{e.status}</span>
              </li>
            ))}
            {!recent.data?.length && <li className="py-6 text-sm text-stone-500">No enquiries yet.</li>}
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="text-2xl">Quick actions</h2>
          <div className="mt-4 space-y-2">
            {[
              { href: "/admin/properties/new", label: "Add a new property" },
              { href: "/admin/locations/new", label: "Add a new location" },
              { href: "/admin/map", label: "Update ORR / RRR boundaries" },
              { href: "/admin/settings", label: "Edit contact details" },
            ].map((a) => (
              <Link key={a.href} href={a.href} className="flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3 text-sm font-medium hover:bg-stone-100">
                <span className="flex items-center gap-2"><Plus className="h-4 w-4 text-gold-600" />{a.label}</span><ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
