// Downloads the real ORR and RRR road geometry from OpenStreetMap (Overpass API)
// and saves it as GeoJSON in public/geo/. Run on your own computer:
//
//   npm run fetch-boundaries
//
// Then either commit the files (the map loads them automatically) or upload
// them in Admin → Map boundaries. Nothing is drawn on the map until real data
// exists — the site never invents ORR/RRR lines.
//
// Data © OpenStreetMap contributors, available under the ODbL.
import fs from "node:fs";

const ENDPOINT = "https://overpass-api.de/api/interpreter";

const QUERIES = {
  orr: {
    name: "Outer Ring Road (ORR)",
    // Main carriageways named Outer Ring Road / ref ORR around Hyderabad (links excluded)
    q: `[out:json][timeout:90];
(
  way["highway"~"^(motorway|trunk|primary)$"]["name"~"Outer Ring Road",i](17.10,78.10,17.70,78.80);
  way["highway"~"^(motorway|trunk|primary)$"]["ref"~"^ORR$",i](17.10,78.10,17.70,78.80);
);
out geom;`,
  },
  rrr: {
    name: "Regional Ring Road (RRR)",
    // RRR is partly under construction / proposed, so include those tags too
    q: `[out:json][timeout:90];
(
  way["name"~"Regional Ring Road",i](16.60,77.60,18.20,79.50);
  way["highway"~"^(construction|proposed)$"]["name"~"Regional Ring Road|RRR",i](16.60,77.60,18.20,79.50);
  way["ref"~"^RRR$",i](16.60,77.60,18.20,79.50);
);
out geom;`,
  },
};

async function run(key, { name, q }) {
  process.stdout.write(`Fetching ${name} from OpenStreetMap… `);
  const res = await fetch(ENDPOINT, { method: "POST", body: "data=" + encodeURIComponent(q), headers: { "Content-Type": "application/x-www-form-urlencoded" } });
  if (!res.ok) throw new Error(`Overpass returned ${res.status}`);
  const json = await res.json();
  const lines = json.elements
    .filter((e) => e.type === "way" && Array.isArray(e.geometry) && e.geometry.length > 1)
    .map((e) => e.geometry.map((p) => [Number(p.lon.toFixed(6)), Number(p.lat.toFixed(6))]));
  if (!lines.length) {
    console.log("no ways found (OpenStreetMap may not have this road mapped yet). Skipped.");
    return;
  }
  const geojson = {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      properties: { key, name, source: "OpenStreetMap contributors (ODbL), via Overpass API", fetched_at: new Date().toISOString(), ways: lines.length },
      geometry: { type: "MultiLineString", coordinates: lines },
    }],
  };
  fs.mkdirSync(new URL("../public/geo/", import.meta.url), { recursive: true });
  fs.writeFileSync(new URL(`../public/geo/${key}.geojson`, import.meta.url), JSON.stringify(geojson));
  console.log(`${lines.length} road segments saved to public/geo/${key}.geojson`);
}

for (const [key, def] of Object.entries(QUERIES)) {
  try { await run(key, def); } catch (e) { console.log(`failed: ${e.message}`); }
}
