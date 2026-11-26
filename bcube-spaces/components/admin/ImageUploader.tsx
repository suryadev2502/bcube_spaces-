"use client";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImagePlus, Loader2, Star, X } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { STORAGE_BUCKET } from "@/lib/config";

export interface UploadedImage { url: string; storage_path: string | null; alt?: string | null }

const MAX_DIM = 2400;

/** Downscales very large photos in the browser before upload (faster pages, smaller storage). */
async function prepare(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIM / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size < 1.5e6) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((res) => canvas.toBlob((b) => res(b ?? file), "image/jpeg", 0.85));
  } catch {
    return file;
  }
}

async function upload(file: File, folder: string): Promise<UploadedImage> {
  const supabase = createBrowserSupabase();
  const blob = await prepare(file);
  const ext = blob.type === "image/jpeg" ? "jpg" : (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, blob, { contentType: blob.type || file.type, cacheControl: "31536000" });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, storage_path: path };
}

/** Multi-image gallery uploader. Writes the ordered list as JSON into a hidden input. */
export function GalleryUploader({ name, initial, folder = "properties" }: { name: string; initial: UploadedImage[]; folder?: string }) {
  const [images, setImages] = useState<UploadedImage[]>(initial);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError("");
    const list = Array.from(files);
    setBusy((b) => b + list.length);
    for (const f of list) {
      try {
        const up = await upload(f, folder);
        setImages((imgs) => [...imgs, up]);
      } catch (e) {
        setError(`Couldn't upload ${f.name}: ${e instanceof Error ? e.message : "error"}`);
      } finally {
        setBusy((b) => b - 1);
      }
    }
    if (input.current) input.current.value = "";
  };

  const move = (i: number, d: number) => setImages((imgs) => {
    const j = i + d;
    if (j < 0 || j >= imgs.length) return imgs;
    const next = [...imgs];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  });

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(images)} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((im, i) => (
          <div key={im.url} className={`group relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-200 ${i === 0 ? "ring-2 ring-gold-500" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={im.url} alt="" className="h-full w-full object-cover" />
            {i === 0 && <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-bold text-ink"><Star className="h-3 w-3" /> COVER</span>}
            <div className="absolute inset-x-2 bottom-2 flex justify-between opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
              <div className="flex gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="grid h-7 w-7 place-items-center rounded-full bg-white/90 disabled:opacity-40" aria-label="Move left"><ChevronLeft className="h-4 w-4" /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} className="grid h-7 w-7 place-items-center rounded-full bg-white/90 disabled:opacity-40" aria-label="Move right"><ChevronRight className="h-4 w-4" /></button>
              </div>
              <button type="button" onClick={() => setImages((imgs) => imgs.filter((_, k) => k !== i))} className="grid h-7 w-7 place-items-center rounded-full bg-red-600 text-white" aria-label="Remove image"><X className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {Array.from({ length: busy }).map((_, i) => (
          <div key={`busy-${i}`} className="grid aspect-[4/3] place-items-center rounded-xl bg-stone-100"><Loader2 className="h-5 w-5 animate-spin text-gold-600" /></div>
        ))}
        <button type="button" onClick={() => input.current?.click()} className="grid aspect-[4/3] place-items-center rounded-xl border-2 border-dashed border-stone-300 text-stone-500 transition hover:border-gold-400 hover:text-gold-700">
          <span className="flex flex-col items-center gap-1 text-xs font-semibold"><ImagePlus className="h-6 w-6" /> Add photos</span>
        </button>
      </div>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
      <p className="mt-2 text-xs text-stone-500">The first photo is the cover image. Use the arrows to reorder. Large photos are resized automatically.</p>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      {busy > 0 && <p className="mt-2 text-xs text-gold-700">Uploading {busy} photo{busy > 1 ? "s" : ""}… please wait before saving.</p>}
    </div>
  );
}

/** Single image (banner / hero). Writes the public URL into a hidden input. */
export function SingleImageUploader({ name, initial, folder }: { name: string; initial: string | null; folder: string }) {
  const [url, setUrl] = useState(initial ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div>
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-32 flex-none overflow-hidden rounded-xl bg-stone-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {url && <img src={url} alt="" className="h-full w-full object-cover" />}
          {busy && <div className="absolute inset-0 grid place-items-center bg-white/70"><Loader2 className="h-5 w-5 animate-spin" /></div>}
        </div>
        <label className="btn-outline cursor-pointer !py-2.5">
          <ImagePlus className="h-4 w-4" /> {url ? "Replace" : "Upload"}
          <input type="file" accept="image/*" hidden onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setBusy(true); setError("");
            try { setUrl((await upload(f, folder)).url); } catch (err) { setError(err instanceof Error ? err.message : "Upload failed"); } finally { setBusy(false); }
          }} />
        </label>
        {url && <button type="button" onClick={() => setUrl("")} className="text-xs font-semibold text-red-600">Remove</button>}
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
