"use client";
import { useActionState, useState } from "react";
import { CheckCircle2, FileUp, Loader2 } from "lucide-react";
import { saveMapLayer, type FormState } from "@/app/admin/actions";

export default function LayerUpload({ layerKey }: { layerKey: "orr" | "rrr" }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveMapLayer, { ok: false, message: "" });
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  return (
    <form action={action} className="mt-4 space-y-3">
      <input type="hidden" name="key" value={layerKey} />
      <input type="hidden" name="geojson" value={text} />
      <label className="btn-outline cursor-pointer !py-2.5">
        <FileUp className="h-4 w-4" /> {fileName || "Choose .geojson file"}
        <input type="file" accept=".geojson,.json,application/geo+json,application/json" hidden onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) { setFileName(f.name); setText(await f.text()); }
        }} />
      </label>
      <input name="source_note" placeholder="Source (e.g. OpenStreetMap, HMDA alignment map)" className="input" />
      <button disabled={!text || pending} className="btn-dark !py-2.5">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Upload boundary</button>
      {state.message && <p className={`flex items-center gap-1.5 text-sm ${state.ok ? "text-emerald-700" : "text-red-600"}`}>{state.ok && <CheckCircle2 className="h-4 w-4" />}{state.message}</p>}
    </form>
  );
}
