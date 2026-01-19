import React, { useEffect, useState, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';

interface CountryFeature {
  type: string;
  properties: {
    ISO_A3: string;
    NAME: string;
    [key: string]: any;
  };
  geometry: any;
}

const SAUDI_ARABIA_COORDS = { lat: 23.8859, lng: 45.0792 };

// Destination cities for arcs
const DESTINATIONS = [
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  { name: 'Cape Town', lat: -33.9249, lng: 18.4241 },
  { name: 'Moscow', lat: 55.7558, lng: 37.6173 },
  { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
  { name: 'Beijing', lat: 39.9042, lng: 116.4074 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
];

export const InteractiveGlobe = ({ className = "" }: { className?: string }) => {
  const globeEl = useRef<any>();
  const [countries, setCountries] = useState<{ features: CountryFeature[] }>({ features: [] });
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Load GeoJSON for countries
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => setCountries(data))
      .catch(err => console.error('Failed to load country data', err));
  }, []);

  // Handle responsive resizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Setup auto-rotation
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.pointOfView({ lat: 23.8859, lng: 45.0792, altitude: 1.5 });
    }
  }, [globeEl.current]);

  const arcsData = useMemo(() => {
    return DESTINATIONS.map(dest => ({
      startLat: SAUDI_ARABIA_COORDS.lat,
      startLng: SAUDI_ARABIA_COORDS.lng,
      endLat: dest.lat,
      endLng: dest.lng,
      color: ['rgba(0, 255, 0, 0.8)', 'rgba(255, 255, 255, 0.5)']
    }));
  }, []);

  return (
    <div ref={containerRef} className={`w-full h-full absolute inset-0 z-0 bg-transparent ${className}`}>
      {containerDimensions.width > 0 && (
        <Globe
          ref={globeEl}
          width={containerDimensions.width}
          height={containerDimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          backgroundColor="rgba(0,0,0,0)"
          
          // Polygon (Country) Styling
          polygonsData={countries.features}
          polygonAltitude={d => (d as CountryFeature).properties.ISO_A3 === 'SAU' ? 0.06 : 0.01}
          polygonCapColor={d => (d as CountryFeature).properties.ISO_A3 === 'SAU' ? 'rgba(0, 255, 100, 0.9)' : 'rgba(200, 200, 200, 0.0)'}
          polygonSideColor={d => (d as CountryFeature).properties.ISO_A3 === 'SAU' ? 'rgba(0, 255, 100, 0.6)' : 'rgba(200, 200, 200, 0.0)'}
          polygonStrokeColor={() => '#111'}
          
          // Arc (Line) Styling
          arcsData={arcsData}
          arcColor={'color'}
          arcDashLength={0.4}
          arcDashGap={4}
          arcDashAnimateTime={2000}
          arcStroke={0.5}
          
          // Atmosphere
          atmosphereColor="#3a228a"
          atmosphereAltitude={0.15}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#001f3f]/90 pointer-events-none" />
    </div>
  );
};

export default InteractiveGlobe;
