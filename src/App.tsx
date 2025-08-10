import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fetchPlaygrounds, refreshBackend, type Feature } from './api'

const HAMBURG_CENTER: LatLngExpression = [53.5511, 9.9937]

export default function App() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // AI label filters
  const [fWheel, setFWheel] = useState(false)
  const [fSensory, setFSensory] = useState(false)
  const [fSoft, setFSoft] = useState(false)
  const [fGround, setFGround] = useState(false)

  async function load() {
    try {
      setLoading(true)
      const gj = await fetchPlaygrounds()
      setFeatures(gj.features)
      setError(null)
    } catch (e: any) {
      setError(e?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    return features.filter(f => {
      const L = f.properties.labels || {}
      if (fWheel && !L.wheelchair_accessible) return false
      if (fSensory && !L.sensory_friendly) return false
      if (fSoft && !L.soft_surface) return false
      if (fGround && !L.ground_level_equipment) return false
      return true
    })
  }, [features, fWheel, fSensory, fSoft, fGround])

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {/* Controls */}
      <div style={{ position: 'absolute', zIndex: 1000, background: 'white', padding: 8, margin: 8, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,.15)' }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Filters (AI labels)</div>
        <label><input type="checkbox" checked={fWheel} onChange={e=>setFWheel(e.target.checked)} /> wheelchair accessible</label><br/>
        <label><input type="checkbox" checked={fSensory} onChange={e=>setFSensory(e.target.checked)} /> sensory-friendly</label><br/>
        <label><input type="checkbox" checked={fSoft} onChange={e=>setFSoft(e.target.checked)} /> soft surface</label><br/>
        <label><input type="checkbox" checked={fGround} onChange={e=>setFGround(e.target.checked)} /> ground-level equipment</label>
        <div style={{ marginTop: 8 }}>
          <button onClick={async () => { await refreshBackend(); await load(); }}>
            Refresh data
          </button>
        </div>
        {loading && <div style={{marginTop:6}}>Loading…</div>}
        {error && <div style={{color:'crimson', marginTop:6}}>Error: {error}</div>}
      </div>

      <MapContainer center={HAMBURG_CENTER} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filtered.map((f) => {
          const [lon, lat] = f.geometry.coordinates
          const L = f.properties.labels || {}
          return (
            <CircleMarker key={String(f.properties.id)} center={[lat, lon]} radius={6}>
              <Popup>
                <b>{f.properties.name || 'Playground'}</b><br/>
                wheelchair: {f.properties.wheelchair ?? 'unknown'}<br/>
                surface: {f.properties.surface ?? '—'}<br/>
                <hr/>
                <div><b>AI labels</b></div>
                <div>wheelchair_accessible: {String(!!L.wheelchair_accessible)}</div>
                <div>sensory_friendly: {String(!!L.sensory_friendly)}</div>
                <div>soft_surface: {String(!!L.soft_surface)}</div>
                <div>ground_level_equipment: {String(!!L.ground_level_equipment)}</div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}
