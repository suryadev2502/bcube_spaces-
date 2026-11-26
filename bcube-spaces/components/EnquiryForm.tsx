"use client";
import { useActionState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { submitEnquiry, type EnquiryState } from "@/app/actions/enquiry";

export default function EnquiryForm({ propertyId, propertyTitle, source = "website", dark = false }: { propertyId?: string; propertyTitle?: string; source?: string; dark?: boolean }) {
  const [state, action, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, { ok: false, message: "" });

  if (state.ok) {
    return (
      <div className={`flex flex-col items-center rounded-2xl p-8 text-center ${dark ? "bg-white/5 text-white" : "bg-stone-50"}`}>
        <CheckCircle2 className="h-10 w-10 text-gold-500" />
        <p className="mt-4 font-display text-2xl">Enquiry received</p>
        <p className={`mt-2 text-sm ${dark ? "text-white/60" : "text-ink-500"}`}>{state.message}</p>
      </div>
    );
  }

  const field = (name: "name" | "phone" | "message") => state.errors?.[name];
  const inputCls = `input ${dark ? "!border-white/10 !bg-white/5 !text-white placeholder:!text-white/35" : ""}`;
  const labelCls = `label ${dark ? "!text-white/50" : ""}`;

  return (
    <form action={action} className="grid gap-4" noValidate>
      <input type="hidden" name="property_id" value={propertyId ?? ""} />
      <input type="hidden" name="property_title" value={propertyTitle ?? ""} />
      <input type="hidden" name="source" value={source} />
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div>
        <label htmlFor={`name-${source}`} className={labelCls}>Name</label>
        <input id={`name-${source}`} name="name" required autoComplete="name" placeholder="Your full name" className={inputCls} aria-invalid={!!field("name")} />
        {field("name") && <p className="mt-1 text-xs text-red-500">{field("name")}</p>}
      </div>
      <div>
        <label htmlFor={`phone-${source}`} className={labelCls}>Phone number</label>
        <input id={`phone-${source}`} name="phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="+91 " className={inputCls} aria-invalid={!!field("phone")} />
        {field("phone") && <p className="mt-1 text-xs text-red-500">{field("phone")}</p>}
      </div>
      <div>
        <label htmlFor={`msg-${source}`} className={labelCls}>Message</label>
        <textarea id={`msg-${source}`} name="message" rows={4} placeholder={propertyTitle ? `I'm interested in ${propertyTitle}…` : "Tell us what you're looking for…"} className={`${inputCls} resize-none`} />
        {field("message") && <p className="mt-1 text-xs text-red-500">{field("message")}</p>}
      </div>
      {state.message && !state.ok && <p className="text-sm text-red-500">{state.message}</p>}
      <button type="submit" disabled={pending} className="btn-gold w-full">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} {pending ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
