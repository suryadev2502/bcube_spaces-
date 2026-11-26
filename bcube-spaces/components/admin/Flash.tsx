export default function Flash({ saved, error }: { saved?: string; error?: string }) {
  if (error) return <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  if (saved) return <p className="mb-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Saved. The website has been updated.</p>;
  return null;
}
