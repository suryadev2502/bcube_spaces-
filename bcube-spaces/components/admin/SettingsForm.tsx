"use client";
import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { saveSettings, type FormState } from "@/app/admin/actions";
import { SingleImageUploader } from "./ImageUploader";
import type { SiteSettings } from "@/lib/types";

export default function SettingsForm({ s }: { s: SiteSettings }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveSettings, { ok: false, message: "" });
  const input = (name: keyof SiteSettings, label: string, placeholder = "", hint?: string) => (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input id={name} name={name} defaultValue={(s[name] as string) ?? ""} placeholder={placeholder} className="input" />
      {hint && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
    </div>
  );
  return (
    <form action={action} className="space-y-6">
      <section className="card space-y-5 p-6 sm:p-8">
        <h2 className="text-2xl">Contact details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {input("phone", "Phone (for Call buttons)", "+91 98765 43210")}
          {input("whatsapp", "WhatsApp number", "919876543210", "Include country code, digits only (91 for India).")}
          {input("email", "Email", "hello@bcubespaces.com")}
          {input("instagram_url", "Instagram link", "https://instagram.com/yourhandle")}
        </div>
        {input("address", "Office address", "Hyderabad, Telangana")}
      </section>
      <section className="card space-y-5 p-6 sm:p-8">
        <h2 className="text-2xl">About & homepage</h2>
        <div><label className="label" htmlFor="about_text">About BCUBE SPACES</label><textarea id="about_text" name="about_text" rows={4} defaultValue={s.about_text ?? ""} className="input" /></div>
        <div><label className="label" htmlFor="mission_text">Our mission</label><textarea id="mission_text" name="mission_text" rows={3} defaultValue={s.mission_text ?? ""} className="input" /></div>
        <div><label className="label" htmlFor="services">Our services (one per line)</label><textarea id="services" name="services" rows={5} defaultValue={s.services.join("\n")} className="input" /></div>
        <div><label className="label">Homepage hero background image</label><SingleImageUploader name="hero_image_url" initial={s.hero_image_url} folder="site" /></div>
      </section>
      <div className="sticky bottom-4 z-30 flex items-center justify-between gap-4 rounded-2xl bg-ink p-4 text-white shadow-lift">
        <p className={`text-sm ${state.message ? (state.ok ? "text-emerald-300" : "text-red-300") : "text-white/60"}`}>{state.message || "Changes go live as soon as you save."}</p>
        <button disabled={pending} className="btn-gold !py-2.5">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save settings</button>
      </div>
    </form>
  );
}
