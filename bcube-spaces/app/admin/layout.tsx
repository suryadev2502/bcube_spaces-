import type { Metadata } from "next";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/config";
import Logo from "@/components/Logo";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) {
    return (
      <div className="grid min-h-screen place-items-center bg-stone-100 p-6">
        <div className="max-w-lg rounded-3xl bg-white p-10 shadow-lift">
          <Logo />
          <h1 className="mt-8 text-3xl">Connect Supabase to use the admin dashboard</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">
            The website is running in demo mode with sample listings. Follow the steps in <b>README.md</b>: create a free Supabase project, run
            <code className="mx-1 rounded bg-stone-100 px-1.5">supabase/schema.sql</code> and <code className="mx-1 rounded bg-stone-100 px-1.5">supabase/seed.sql</code>,
            then add <code className="mx-1 rounded bg-stone-100 px-1.5">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="mx-1 rounded bg-stone-100 px-1.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment.
          </p>
          <Link href="/" className="btn-dark mt-8">Back to website</Link>
        </div>
      </div>
    );
  }
  return <div className="min-h-screen bg-stone-100">{children}</div>;
}
