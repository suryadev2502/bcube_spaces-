"use client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, ZoomControl, useMap, useMapEvents } from "react-leaflet";
import { MAP_TILE_ATTRIBUTION, MAP_TILE_URL } from "@/lib/config";

const pin = L.divIcon({ className: "bc-icon", iconSize: [34, 34], iconAnchor: [17, 34], html: '<div class="pin-marker" style="position:relative"></div>' });

function ClickPicker({ onPick }: { onPick?: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onPick?.(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6))) });
  return null;
}

function Recenter({ lat, lng }: { lat: number | null; lng: number | null }) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lng != null && !map.getBounds().pad(-0.2).contains([lat, lng])) map.setView([lat, lng], Math.max(map.getZoom(), 13));
  }, [lat, lng, map]);
  return null;
}

export default function PinMapInner({ lat, lng, zoom = 14, onPick }: { lat: number | null; lng: number | null; zoom?: number; onPick?: (lat: number, lng: number) => void }) {
  const has = lat != null && lng != null;
  return (
    <MapContainer center={has ? [lat!, lng!] : [17.4, 78.47]} zoom={has ? zoom : 9} zoomControl={false} scrollWheelZoom={!!onPick} className="h-full w-full">
      <TileLayer url={MAP_TILE_URL} attribution={MAP_TILE_ATTRIBUTION} subdomains="abcd" detectRetina />
      {has && <Marker position={[lat!, lng!]} icon={pin} />}
      <ZoomControl position="bottomright" />
      {onPick && <ClickPicker onPick={onPick} />}
      <Recenter lat={lat} lng={lng} />
    </MapContainer>
  );
}
