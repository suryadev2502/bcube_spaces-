"use client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import { GeoJSON, MapContainer, Marker, TileLayer, ZoomControl, useMap, useMapEvents } from "react-leaflet";
import { MAP_MUTED, MAP_TILE_ATTRIBUTION, MAP_TILE_URL } from "@/lib/config";
import type { LocationWithCount, MapLayer } from "@/lib/types";

export const HYD_CENTER: [number, number] = [17.4, 78.47];
const MAX_BOUNDS: L.LatLngBoundsExpression = [[16.4, 77.3], [18.5, 79.7]];
const LABEL_ZOOM = 11;

interface Props {
  locations: LocationWithCount[];
  layers: MapLayer[];
  activeSlug: string | null;
  flyTo: { lat: number; lng: number; zoom?: number; key: number } | null;
  onHover: (slug: string | null) => void;
  onSelect: (slug: string) => void;
  fullscreen: boolean;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function markerIcon(l: LocationWithCount, active: boolean) {
  return L.divIcon({
    className: "bc-icon",
    iconSize: [0, 0],
    html: `<div class="bc-marker zone-${l.zone}${active ? " active" : ""}" role="button" aria-label="${escapeHtml(l.name)}"><span class="dot"></span><span class="label">${escapeHtml(l.name)}${
      l.property_count ? `<span class="count">${l.property_count}</span>` : ""
    }</span></div>`,
  });
}

function ZoomWatcher() {
  const map = useMap();
  const apply = () => {
    map.getContainer().classList.toggle("show-labels", map.getZoom() >= LABEL_ZOOM);
  };
  useMapEvents({ zoomend: apply });
  useEffect(apply); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

/** Scroll-wheel zoom only after the visitor clicks the map, so page scrolling isn't hijacked. */
function WheelGuard() {
  const map = useMap();
  useMapEvents({
    click: () => map.scrollWheelZoom.enable(),
    mouseout: () => map.scrollWheelZoom.disable(),
  });
  return null;
}

function FlyController({ flyTo }: { flyTo: Props["flyTo"] }) {
  const map = useMap();
  useEffect(() => {
    if (flyTo) map.flyTo([flyTo.lat, flyTo.lng], flyTo.zoom ?? 13, { duration: 1.2 });
  }, [flyTo, map]);
  return null;
}

function ResizeOnToggle({ fullscreen }: { fullscreen: boolean }) {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 320);
    return () => clearTimeout(t);
  }, [fullscreen, map]);
  return null;
}

export default function MapInner({ locations, layers, activeSlug, flyTo, onHover, onSelect, fullscreen }: Props) {
  const mapped = useMemo(() => locations.filter((l) => l.lat != null && l.lng != null), [locations]);
  const handlers = useRef({ onHover, onSelect });
  handlers.current = { onHover, onSelect };

  return (
    <MapContainer
      center={HYD_CENTER}
      zoom={9}
      minZoom={8}
      maxZoom={17}
      maxBounds={MAX_BOUNDS}
      maxBoundsViscosity={0.8}
      zoomControl={false}
      scrollWheelZoom={false}
      className={`bc-map h-full w-full${MAP_MUTED ? " bc-muted" : ""}`}
      attributionControl
    >
      <TileLayer url={MAP_TILE_URL} attribution={MAP_TILE_ATTRIBUTION} detectRetina />
      {layers.map((layer) => (
        <GeoJSON
          key={layer.key}
          data={layer.geojson}
          interactive={false}
          style={() =>
            layer.key === "orr"
              ? { color: "#B8945A", weight: 4, opacity: 0.95, lineCap: "round" }
              : { color: "#2B2B2E", weight: 3.5, opacity: 0.85, dashArray: "10 8", lineCap: "round" }
          }
        />
      ))}
      {mapped.map((l) => (
        <Marker
          key={l.id}
          position={[l.lat!, l.lng!]}
          icon={markerIcon(l, l.slug === activeSlug)}
          zIndexOffset={l.slug === activeSlug ? 1000 : l.property_count ? 100 : 0}
          title={`${l.name}${l.property_count ? ` — ${l.property_count} properties` : ""}`}
          keyboard
          eventHandlers={{
            click: () => handlers.current.onSelect(l.slug),
            mouseover: () => handlers.current.onHover(l.slug),
            mouseout: () => handlers.current.onHover(null),
          }}
        />
      ))}
      <ZoomControl position="bottomright" />
      <ZoomWatcher />
      <WheelGuard />
      <FlyController flyTo={flyTo} />
      <ResizeOnToggle fullscreen={fullscreen} />
    </MapContainer>
  );
}
