"use client";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageOff, Maximize2, X } from "lucide-react";
import SmartImage from "./SmartImage";
import type { PropertyImage } from "@/lib/types";

export default function Gallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [open, setOpen] = useState(false);
  const n = images.length;

  const go = useCallback((d: number) => {
    if (n < 2) return;
    setDir(d);
    setIndex((i) => (i + d + n) % n);
  }, [n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!n) {
    return <div className="grid aspect-[16/10] place-items-center rounded-3xl bg-stone-200 text-stone-400"><ImageOff className="h-10 w-10" /></div>;
  }

  const img = images[index];
  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -40 }),
  };

  const Slide = ({ big }: { big?: boolean }) => (
    <AnimatePresence initial={false} custom={dir} mode="popLayout">
      <motion.div
        key={img.id}
        custom={dir}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        drag={n > 1 ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
        className="absolute inset-0"
      >
        <SmartImage src={img.url} alt={img.alt ?? title} fill priority={index === 0} sizes={big ? "100vw" : "(min-width:1024px) 66vw, 100vw"} className={big ? "object-contain" : "object-cover"} draggable={false} />
      </motion.div>
    </AnimatePresence>
  );

  const Arrows = ({ light }: { light?: boolean }) => n > 1 ? (
    <>
      <button onClick={() => go(-1)} aria-label="Previous image" className={`absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full backdrop-blur transition ${light ? "bg-white/10 text-white hover:bg-white hover:text-ink" : "bg-white/85 text-ink hover:bg-white"}`}><ChevronLeft className="h-5 w-5" /></button>
      <button onClick={() => go(1)} aria-label="Next image" className={`absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full backdrop-blur transition ${light ? "bg-white/10 text-white hover:bg-white hover:text-ink" : "bg-white/85 text-ink hover:bg-white"}`}><ChevronRight className="h-5 w-5" /></button>
    </>
  ) : null;

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-stone-200">
        <button className="absolute inset-0 z-[1] cursor-zoom-in" onClick={() => setOpen(true)} aria-label="Open full-screen gallery" />
        <Slide />
        <Arrows />
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
          <span className="rounded-full bg-ink/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">{index + 1} / {n}</span>
          <button onClick={() => setOpen(true)} className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink backdrop-blur hover:bg-white" aria-label="Full screen"><Maximize2 className="h-4 w-4" /></button>
        </div>
      </div>
      {n > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((im, i) => (
            <button key={im.id} onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }} aria-label={`Show image ${i + 1}`} className={`relative aspect-[4/3] w-24 flex-none overflow-hidden rounded-xl transition sm:w-28 ${i === index ? "ring-2 ring-gold-500 ring-offset-2" : "opacity-60 hover:opacity-100"}`}>
              <SmartImage src={im.url} alt="" fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex flex-col bg-ink/95 backdrop-blur" role="dialog" aria-modal aria-label={`${title} gallery`}>
            <div className="flex items-center justify-between p-4 text-white">
              <p className="truncate pr-4 text-sm font-medium">{title} <span className="text-white/50">· {index + 1} / {n}</span></p>
              <button onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white hover:text-ink" aria-label="Close gallery"><X className="h-5 w-5" /></button>
            </div>
            <div className="relative flex-1">
              <Slide big />
              <Arrows light />
            </div>
            <div className="flex justify-center gap-2 overflow-x-auto p-4">
              {images.map((im, i) => (
                <button key={im.id} onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }} className={`relative h-14 w-20 flex-none overflow-hidden rounded-lg ${i === index ? "ring-2 ring-gold-500" : "opacity-50 hover:opacity-100"}`} aria-label={`Show image ${i + 1}`}>
                  <SmartImage src={im.url} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
