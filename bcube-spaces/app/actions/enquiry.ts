"use server";
import { isSupabaseConfigured } from "@/lib/config";
import { createPublicClient } from "@/lib/supabase/public";

export interface EnquiryState {
  ok: boolean;
  message: string;
  errors?: Partial<Record<"name" | "phone" | "message", string>>;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function submitEnquiry(_prev: EnquiryState, form: FormData): Promise<EnquiryState> {
  // Honeypot: bots fill hidden fields, people don't.
  if (String(form.get("company") ?? "")) return { ok: true, message: "Thank you! We'll be in touch shortly." };

  const name = String(form.get("name") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();
  const propertyId = String(form.get("property_id") ?? "");
  const propertyTitle = String(form.get("property_title") ?? "").trim() || null;
  const source = String(form.get("source") ?? "website").slice(0, 60);

  const errors: EnquiryState["errors"] = {};
  if (name.length < 2 || name.length > 120) errors.name = "Please enter your name.";
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) errors.phone = "Please enter a valid phone number.";
  if (message.length > 2000) errors.message = "Message is too long (max 2000 characters).";
  if (Object.keys(errors).length) return { ok: false, message: "Please check the highlighted fields.", errors };

  if (!isSupabaseConfigured) {
    return { ok: true, message: "Demo mode: your enquiry looks good, but it isn't saved until Supabase is connected." };
  }

  const { error } = await createPublicClient().from("enquiries").insert({
    name,
    phone,
    message: message || null,
    property_id: UUID.test(propertyId) ? propertyId : null,
    property_title: propertyTitle,
    source,
  });
  if (error) {
    console.error("[enquiry] insert failed:", error.message);
    return { ok: false, message: "Sorry, something went wrong. Please call or WhatsApp us instead." };
  }
  return { ok: true, message: "Thank you! Our team will contact you shortly." };
}
