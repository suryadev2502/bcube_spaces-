"use client";
import { useState } from "react";
import { MousePointerClick } from "lucide-react";
import PinMap from "@/components/map/PinMap";
import { coordsFromMapsUrl } from "@/lib/format";

/** Lat/lng inputs + click-to-place map + optional Google Maps link parsing. */
export default function CoordinateField({ lat: lat0, lng: lng0, mapUrl, withMapUrl = false }: { lat: number | null; lng: number | null; mapUrl?: string | null; withMapUrl?: boolean }) {
  const [lat, setLat] = useState(lat0 != null ? String(lat0) : "");
  const [lng, setLng] = useState(lng0 != null ? String(lng0) : "");
  const [url, setUrl] = useState(mapUrl ?? "");
  const [hint, setHint] = useState("");
  const nLat = lat === "" ? null : Number(lat);
  const nLng = lng === "" ? null : Number(lng);

  return (
    <div className="space-y-3">
      {withMapUrl && (
        <div>
          <label className="label" htmlFor="map_url">Google Maps link (optional)</label>
          <input
            id="map_url"
            name="map_url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              const c = coordsFromMapsUrl(e.target.value);
              if (c) { setLat(String(c.lat)); setLng(String(c.lng)); setHint("Coordinates picked up from the link."); }
              else setHint(e.target.value ? "Short links (maps.app.goo.gl) don't contain coordinates — click the map below to place the pin." : "");
            }}
            placeholder="https://www.google.com/maps/…"
            className="input"
          />
          {hint && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div><label className="label" htmlFor="lat">Latitude</label><input id="lat" name="lat" value={lat} onChange={(e) => setLat(e.target.value)} inputMode="decimal" placeholder="17.3955" className="input" /></div>
        <div><label className="label" htmlFor="lng">Longitude</label><input id="lng" name="lng" value={lng} onChange={(e) => setLng(e.target.value)} inputMode="decimal" placeholder="78.3275" className="input" /></div>
      </div>
      <div className="relative h-72 overflow-hidden rounded-xl ring-1 ring-ink/10">
        <PinMap lat={Number.isFinite(nLat) ? nLat : null} lng={Number.isFinite(nLng) ? nLng : null} onPick={(a, b) => { setLat(String(a)); setLng(String(b)); }} />
        <span className="pointer-events-none absolute left-3 top-3 z-[500] flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold shadow"><MousePointerClick className="h-3.5 w-3.5 text-gold-600" /> Click the map to set the exact location</span>
      </div>
      {(lat || lng) && <button type="button" onClick={() => { setLat(""); setLng(""); }} className="text-xs font-semibold text-red-600">Clear location</button>}
    </div>
  );
}
