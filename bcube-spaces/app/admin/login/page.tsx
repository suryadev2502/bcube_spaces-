"use client";
import { useActionState } from "react";
import { Loader2, Lock } from "lucide-react";
import Logo from "@/components/Logo";
import { signIn, type FormState } from "../actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, { ok: false, message: "" });
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero.svg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute bottom-12 left-12 text-white">
          <Logo light />
          <p className="mt-6 max-w-sm font-display text-3xl leading-snug">Manage listings, locations and enquiries.</p>
        </div>
      </div>
      <div className="grid place-items-center p-6">
        <form action={action} className="w-full max-w-sm">
          <div className="lg:hidden"><Logo /></div>
          <div className="mt-10 grid h-12 w-12 place-items-center rounded-2xl bg-ink text-gold-400"><Lock className="h-5 w-5" /></div>
          <h1 className="mt-6 text-4xl">Admin sign in</h1>
          <p className="mt-2 text-sm text-ink-500">Only authorised BCUBE SPACES team members.</p>
          <div className="mt-8 space-y-4">
            <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" required autoComplete="email" className="input" /></div>
            <div><label className="label" htmlFor="password">Password</label><input id="password" name="password" type="password" required autoComplete="current-password" className="input" /></div>
          </div>
          {state.message && <p className="mt-4 text-sm text-red-600">{state.message}</p>}
          <button disabled={pending} className="btn-dark mt-6 w-full">{pending && <Loader2 className="h-4 w-4 animate-spin" />} Sign in</button>
        </form>
      </div>
    </div>
  );
}
