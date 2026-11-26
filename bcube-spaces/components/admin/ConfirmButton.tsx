"use client";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

/** Submit button that asks for confirmation (e.g. before deleting). */
export default function ConfirmButton({ children, message, className = "" }: { children: React.ReactNode; message: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className} onClick={(e) => { if (!window.confirm(message)) e.preventDefault(); }}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </button>
  );
}
