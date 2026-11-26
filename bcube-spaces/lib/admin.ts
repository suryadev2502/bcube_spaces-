import "server-only";
import { redirect } from "next/navigation";
import { createServerSupabase } from "./supabase/server";

/** Returns a session client for a signed-in admin, or redirects to login. */
export async function getAdmin() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  return { supabase, user, isAdmin: Boolean(isAdmin) };
}

/** For server actions: throws if the caller isn't an admin. */
export async function requireAdmin() {
  const ctx = await getAdmin();
  if (!ctx.isAdmin) throw new Error("Not authorised");
  return ctx;
}
