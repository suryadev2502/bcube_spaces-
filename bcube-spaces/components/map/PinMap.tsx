"use client";
import dynamic from "next/dynamic";

const PinMapInner = dynamic(() => import("./PinMapInner"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-stone-100" />,
});

export default function PinMap(props: { lat: number | null; lng: number | null; zoom?: number; onPick?: (lat: number, lng: number) => void }) {
  return <PinMapInner {...props} />;
}
