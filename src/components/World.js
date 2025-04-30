import React, { useEffect, useState, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import * as topojson from 'topojson-client';
//import * as THREE from 'three';

// Replace with your backend endpoint
const BACK_URL = process.env.REACT_APP_BACK_URL;

// ISO and name lookups keyed by numeric ISO 3166-1 codes
const isoLookup = { 840: 'USA', 250: 'FRA', 392: 'JPN', 32: 'ARG', 826: 'GBR' };
const nameLookup = { 840: 'United States', 250: 'France', 392: 'Japan', 32: 'Argentina', 826: 'United Kingdom' };
export default function NewsGlobe() {
  const globeRef = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [newsData, setNewsData] = useState({});
  const [dims, setDims] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [selected, setSelected] = useState(null);

  // 1) handle window resize
  useEffect(() => {
    const handleResize = () => setDims({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2) load world geometry and enrich properties
  useEffect(() => {
    fetch('https://unpkg.com/world-atlas@1/world/110m.json')
      .then(res => res.json())
      .then(worldData => {
        const geo = topojson.feature(worldData, worldData.objects.countries);
        geo.features = geo.features.map(f => {
          const idNum = Number(f.id);
          return {
            ...f,
            properties: {
              ...f.properties,
              iso_a3: isoLookup[idNum] || 'UNK',
              name: nameLookup[idNum] || f.properties.name
            }
          };
        });
        setCountries(geo);
      })
      .catch(err => console.error('Error loading world data:', err));
  }, []);

  // 3) fetch news data from backend
  useEffect(() => {
    if (!countries.features.length) return;
    fetch(`${BACK_URL}/news`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => setNewsData(data))
      .catch(err => console.error('Error loading news data:', err));
  }, [countries]);

  // 4) globe controls & atmosphere
  useEffect(() => {
    const controls = globeRef.current?.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
    }
  }, []);

  const polygons = useMemo(() => countries.features, [countries]);
  const newsCount = iso => (newsData[iso]?.length || 0);

  const getColor = count => {
    if (count >= 2) return 'rgba(89, 207, 59, 0.2)';
    if (count === 1) return 'rgba(255, 215, 0, 0.3)';
    return 'rgba(0,0,0,0)';
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Globe
        ref={globeRef}
        width={dims.width}
        height={dims.height}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
        showAtmosphere
        atmosphereColor="#3FA7D6"
        atmosphereAltitude={0.25}
        polygonsData={polygons}
        polygonAltitude={d => (newsCount(d.properties.iso_a3) > 0 ? 0.03 : 0)}
        polygonCapColor={d => getColor(newsCount(d.properties.iso_a3))}
        polygonSideColor={() => 'rgba(0, 0, 0, 0.2)'}
        polygonsTransitionDuration={300}
        onPolygonHover={d => {
          document.body.style.cursor = d && newsCount(d.properties.iso_a3) > 0 ? 'pointer' : 'default';
        }}
        onPolygonClick={d => {
          const iso = d.properties.iso_a3;
          const list = newsData[iso] || [];
          if (list.length) setSelected({ iso, name: d.properties.name, items: list });
        }}
      />

      {/* Side panel for selected country news */}
      {selected && (
        <div style={{
          position: 'absolute', top: 20, right: 20, width: 320, maxHeight: '70vh', overflowY: 'auto',
          background: 'rgba(0,0,0,0.7)', color: '#FFF', padding: '16px', borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}>
          <button
            style={{ position: 'absolute', top: 12, right: 12, background: 'transparent', border: 'none', color: '#FFF', fontSize: '1.2rem', cursor: 'pointer' }}
            onClick={() => setSelected(null)}
          >✕</button>
          <h3 style={{ margin: '0 0 12px', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '8px' }}>{selected.name}</h3>
          <ul style={{ listStyle: 'disc inside', margin: 0, padding: 0 }}>
            {selected.items.map((n, i) => (
              <li key={i} style={{ marginBottom: '12px' }}>
                <a href={n.url} target="_blank" rel="noopener noreferrer" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: '500' }}>{n.title}</a>
                <p style={{ margin: '4px 0 0', fontSize: '0.9rem', lineHeight: 1.3, opacity: 0.8 }}>{n.summary}</p>
                {n.source && (
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', opacity: 0.6 }}><strong>Source:</strong> {n.source}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
