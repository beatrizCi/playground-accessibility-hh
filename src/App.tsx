// src/App.tsx
import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'

type OsmFeature = {
  id: number
  lat?: number
  lon?: number
  tags?: Record<string, string>
}

const HAMBURG_CENTER: [number, number] = [53.5511, 9.9937]

export default function App() {
  const [data, setData] = useState<OsmFeature[]>([])
  const [wheelchairOnly, setWheelchairOnly] = useState(false)

  // Overpass: all playgrounds inside Hamburg (DE-HH)
  const query = useMemo(
    () => `[out:json][timeout:60];
area["ISO3166-2"="DE-HH"][admin_level=4]->.hh;
(
  node["leisure"="playground"](area.hh);
  way["leisure"="playground"](area.hh);
  relation["leisure"="playground"](area.hh);
);
out center tags;`,
    []
  )

  useEffect(() => {
    const url = 'https://overpass-api.de/api/interpreter'
    const body = new URLSearchParams({ data: query })
    fetch(url, { method: 'POST', body })
      .then(r => r.json())
      .then(json => {
        const features: OsmFeature[] = json.elements.map((el: any) => ({
          id: el.id,
          lat: el.lat ?? el.center?.lat,
          lon: el.lon ?? el.center?.lon,
          tags: el.tags ?? {}
        }))
        setData(features.filter(f => f.lat && f.lon))
      })
      .catch(console.error)
  }, [query])

  const filtered = data.filter(f =>
    wheelchairOnly ? f.tags?.wheelchair === 'yes' : true
  )

  return (
    <div className="app" style={{ height: '100vh', width: '100%' }}>
      <div style={{ position: 'absolute', zIndex: 1000, padding: 8 }}>
        <label>
          <input
            type="checkbox"
            checked={wheelchairOnly}
            onChange={e => setWheelchairOnly(e.target.checked)}
          />{' '}
          wheelchair=yes
        </label>
      </div>
      <MapContainer center={HAMBURG_CENTER} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filtered.map(f => (
          <CircleMarker
            key={f.id}
            center={[f.lat!, f.lon!]}
            radius={6}
            stroke={false}
          >
            <Popup>
              <b>{f.tags?.name || 'Playground'}</b><br />
              wheelchair: {f.tags?.wheelchair ?? 'unknown'}<br />
              surface: {f.tags?.surface ?? '—'}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
