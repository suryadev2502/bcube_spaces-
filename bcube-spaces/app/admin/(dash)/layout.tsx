import { getAdmin } from "@/lib/admin";
import AdminNav from "@/components/admin/AdminNav";
import { signOut } from "../actions";

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const { supabase, user, isAdmin } = await getAdmin();
  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <div className="max-w-lg rounded-3xl bg-white p-10 shadow-card">
          <h1 className="text-3xl">This account isn’t an admin yet</h1>
          <p className="mt-3 text-sm text-ink-500">Signed in as <b>{user.email}</b>. To grant admin access, run this in Supabase → SQL Editor:</p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-ink p-4 text-xs text-gold-200">{`insert into public.admins (user_id)\nselect id from auth.users where email = '${user.email}';`}</pre>
          <form action={signOut}><button className="btn-outline mt-6">Sign out</button></form>
        </div>
      </div>
    );
  }
  const { count } = await supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new");
  return (
    <>
      <AdminNav email={user.email ?? ""} newEnquiries={count ?? 0} />
      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl p-5 sm:p-8 lg:p-10">{children}</div>
      </div>
    </>
  );
}
