import Link from "next/link";
import { Plus } from "lucide-react";

export default function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: { href: string; label: string } }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
      </div>
      {action && <Link href={action.href} className="btn-gold"><Plus className="h-4 w-4" /> {action.label}</Link>}
    </div>
  );
}
