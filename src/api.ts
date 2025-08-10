export type Labels = {
  wheelchair_accessible?: boolean;
  sensory_friendly?: boolean;
  soft_surface?: boolean;
  ground_level_equipment?: boolean;
};

export type FeatureProps = {
  id: number | string;
  name?: string;
  wheelchair?: string;
  surface?: string;
  labels?: Labels;
  tags?: Record<string, string>;
};

export type Feature = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: FeatureProps;
};

export type GeoJSON = { type: "FeatureCollection"; features: Feature[] };

const BASE = import.meta.env.VITE_API_BASE;

export async function fetchPlaygrounds(): Promise<GeoJSON> {
  const r = await fetch(`${BASE}/playgrounds`);
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}

export async function refreshBackend(): Promise<void> {
  await fetch(`${BASE}/refresh`, { method: "POST" });
}
