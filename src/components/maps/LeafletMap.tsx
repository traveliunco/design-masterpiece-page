import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons
const createCustomIcon = (color: string, size: number = 30) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, ${color}, ${color}dd);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: ${size * 0.4}px;
          height: ${size * 0.4}px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

const cityIcon = createCustomIcon('#3b82f6', 35);
const capitalIcon = createCustomIcon('#ef4444', 40);
const highlightIcon = createCustomIcon('#f59e0b', 40);

interface MapCity {
  id: string;
  nameAr: string;
  nameEn: string;
  coordinates: { lat: number; lng: number };
  image?: string;
  isCapital?: boolean;
}

interface LeafletMapProps {
  cities: MapCity[];
  center: { lat: number; lng: number };
  zoom?: number;
  onCityClick?: (cityId: string) => void;
  showConnections?: boolean;
  selectedCity?: string | null;
  height?: string;
  style?: 'default' | 'dark' | 'satellite';
}

// Component to handle map view changes
const MapController = ({ center, zoom, selectedCity, cities }: { 
  center: { lat: number; lng: number }; 
  zoom: number;
  selectedCity?: string | null;
  cities: MapCity[];
}) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedCity) {
      const city = cities.find(c => c.id === selectedCity);
      if (city) {
        map.flyTo([city.coordinates.lat, city.coordinates.lng], zoom + 2, {
          duration: 1.5
        });
      }
    } else {
      map.flyTo([center.lat, center.lng], zoom, {
        duration: 1
      });
    }
  }, [selectedCity, center, zoom, map, cities]);

  return null;
};

const LeafletMap = ({
  cities,
  center,
  zoom = 6,
  onCityClick,
  showConnections = true,
  selectedCity,
  height = '500px',
  style = 'default'
}: LeafletMapProps) => {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  // Get tile layer based on style
  const getTileLayer = () => {
    switch (style) {
      case 'dark':
        return 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  // Create connection lines from center to each city
  const connectionLines = cities.map(city => [
    [center.lat, center.lng] as [number, number],
    [city.coordinates.lat, city.coordinates.lng] as [number, number]
  ]);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ height }}>
      {/* Gradient overlay for premium look */}
      <div className="absolute inset-0 pointer-events-none z-[1000] bg-gradient-to-t from-black/20 via-transparent to-black/10" />
      
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={getTileLayer()}
        />
        
        <MapController 
          center={center} 
          zoom={zoom} 
          selectedCity={selectedCity}
          cities={cities}
        />

        {/* Connection lines */}
        {showConnections && connectionLines.map((line, index) => (
          <Polyline
            key={`line-${index}`}
            positions={line}
            pathOptions={{
              color: hoveredCity === cities[index].id ? '#f59e0b' : '#3b82f6',
              weight: hoveredCity === cities[index].id ? 3 : 2,
              opacity: hoveredCity === cities[index].id ? 0.9 : 0.4,
              dashArray: '10, 10',
            }}
          />
        ))}

        {/* City markers */}
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.coordinates.lat, city.coordinates.lng]}
            icon={
              selectedCity === city.id || hoveredCity === city.id
                ? highlightIcon
                : city.isCapital
                ? capitalIcon
                : cityIcon
            }
            eventHandlers={{
              click: () => onCityClick?.(city.id),
              mouseover: () => setHoveredCity(city.id),
              mouseout: () => setHoveredCity(null),
            }}
          >
            <Popup className="custom-popup">
              <div className="min-w-[200px]">
                {city.image && (
                  <img
                    src={city.image}
                    alt={city.nameAr}
                    className="w-full h-24 object-cover rounded-t-lg -mt-3 -mx-3 mb-2"
                    style={{ width: 'calc(100% + 24px)' }}
                  />
                )}
                <h3 className="font-bold text-lg text-gray-900">{city.nameAr}</h3>
                <p className="text-sm text-gray-600">{city.nameEn}</p>
                {onCityClick && (
                  <button
                    onClick={() => onCityClick(city.id)}
                    className="mt-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all"
                  >
                    استكشف المدينة ←
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Center marker (country center) */}
        <Marker
          position={[center.lat, center.lng]}
          icon={L.divIcon({
            className: 'center-marker',
            html: `
              <div style="
                width: 20px;
                height: 20px;
                background: radial-gradient(circle, #ef4444 0%, #dc2626 100%);
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
                animation: pulse 2s infinite;
              "></div>
              <style>
                @keyframes pulse {
                  0%, 100% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.2); opacity: 0.8; }
                }
              </style>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          })}
        />
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1001] bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-red-600 border-2 border-white shadow" />
            <span className="text-gray-700">المركز</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-white shadow" />
            <span className="text-gray-700">المدن</span>
          </div>
        </div>
      </div>

      {/* City list sidebar */}
      <div className="absolute top-4 right-4 z-[1001] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg max-h-[300px] overflow-y-auto">
        <div className="p-3 border-b border-gray-100">
          <h4 className="font-bold text-gray-800 text-sm">المدن ({cities.length})</h4>
        </div>
        <div className="p-2">
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => onCityClick?.(city.id)}
              onMouseEnter={() => setHoveredCity(city.id)}
              onMouseLeave={() => setHoveredCity(null)}
              className={`w-full text-right p-2 rounded-lg transition-all text-sm ${
                selectedCity === city.id || hoveredCity === city.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <span className="font-medium">{city.nameAr}</span>
              <span className="text-gray-400 text-xs mr-2">({city.nameEn})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeafletMap;
