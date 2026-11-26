"use client";
import { updateEnquiry } from "@/app/admin/actions";

export default function StatusSelect({ id, status }: { id: string; status: string }) {
  return (
    <form action={updateEnquiry}>
      <input type="hidden" name="id" value={id} />
      <select name="status" defaultValue={status} onChange={(e) => e.currentTarget.form?.requestSubmit()} className={`rounded-full border-0 px-3 py-1.5 text-xs font-bold ${status === "new" ? "bg-gold-100 text-gold-700" : status === "contacted" ? "bg-sky-50 text-sky-700" : "bg-stone-100 text-stone-500"}`}>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="closed">Closed</option>
      </select>
    </form>
  );
}
