import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { southeastAsiaCountries, Country, City } from '@/data/southeast-asia';
import { saudiAirports, Airport } from '@/data/airports';
import { getArcPoints, latLngToPosition } from '@/utils/distanceUtils';

interface Globe3DProps {
  onCountrySelect: (country: Country | null) => void;
  onCitySelect: (city: City | null, country: Country | null) => void;
  selectedAirport: Airport | null;
  selectedDestination: { lat: number; lng: number } | null;
}

interface PointData {
  lat: number;
  lng: number;
  name: string;
  nameEn: string;
  type: 'country' | 'city' | 'saudi';
  countryId?: string;
  cityId?: string;
  size: number;
  color: string;
}

interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
}

export default function Globe3D({
  onCountrySelect,
  onCitySelect,
  selectedAirport,
  selectedDestination
}: Globe3DProps) {
  const globeRef = useRef<any>(null);
  const [activeCountryId, setActiveCountryId] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<PointData | null>(null);

  // تحضير نقاط الدول
  const countryPoints: PointData[] = useMemo(() => {
    return southeastAsiaCountries
      .filter(country => country.coordinates && country.coordinates.lat && country.coordinates.lng)
      .map(country => ({
        lat: country.coordinates.lat,
        lng: country.coordinates.lng,
        name: country.nameAr,
        nameEn: country.nameEn,
        type: 'country' as const,
        countryId: country.id,
        size: 0.8,
        color: activeCountryId === country.id ? '#06b6d4' : '#14b8a6'
      }));
  }, [activeCountryId]);

  // نقطة السعودية
  const saudiPoint: PointData = useMemo(() => ({
    lat: 24.7136,
    lng: 46.6753,
    name: 'السعودية',
    nameEn: 'Saudi Arabia',
    type: 'saudi' as const,
    size: 1.2,
    color: '#10b981'
  }), []);

  // نقاط المدن للدولة النشطة
  const cityPoints: PointData[] = useMemo(() => {
    if (!activeCountryId) return [];
    const country = southeastAsiaCountries.find(c => c.id === activeCountryId);
    if (!country) return [];
    
    return country.cities
      .filter(city => city.coordinates && city.coordinates.lat && city.coordinates.lng)
      .map(city => ({
        lat: city.coordinates.lat,
        lng: city.coordinates.lng,
        name: city.nameAr,
        nameEn: city.nameEn,
        type: 'city' as const,
        countryId: country.id,
        cityId: city.id,
        size: 0.4,
        color: '#3b82f6'
      }));
  }, [activeCountryId]);

  // جميع النقاط
  const allPoints = useMemo(() => {
    return [saudiPoint, ...countryPoints, ...cityPoints];
  }, [saudiPoint, countryPoints, cityPoints]);

  // خط مسار الطيران
  const arcsData: ArcData[] = useMemo(() => {
    if (!selectedAirport || !selectedDestination) return [];
    return [{
      startLat: selectedAirport.lat,
      startLng: selectedAirport.lng,
      endLat: selectedDestination.lat,
      endLng: selectedDestination.lng,
      color: '#06b6d4'
    }];
  }, [selectedAirport, selectedDestination]);

  // معالجة النقر على نقطة
  const handlePointClick = useCallback((point: PointData) => {
    if (point.type === 'country' && point.countryId) {
      const country = southeastAsiaCountries.find(c => c.id === point.countryId);
      if (country) {
        setActiveCountryId(point.countryId);
        onCountrySelect(country);
        
        // تحريك الكاميرا للدولة
        if (globeRef.current) {
          globeRef.current.pointOfView({
            lat: point.lat,
            lng: point.lng,
            altitude: 1.5
          }, 1000);
        }
      }
    } else if (point.type === 'city' && point.countryId && point.cityId) {
      const country = southeastAsiaCountries.find(c => c.id === point.countryId);
      const city = country?.cities.find(c => c.id === point.cityId);
      if (city && country) {
        onCitySelect(city, country);
      }
    }
  }, [onCountrySelect, onCitySelect]);

  // تكوين الكرة الأرضية عند التحميل
  useEffect(() => {
    if (globeRef.current) {
      // تعيين موقع الكاميرا الابتدائي لرؤية السعودية وآسيا
      globeRef.current.pointOfView({
        lat: 20,
        lng: 80,
        altitude: 2.5
      }, 0);
      
      // تفعيل التدوير التلقائي
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  // إيقاف التدوير التلقائي عند تحديد دولة
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = !activeCountryId;
    }
  }, [activeCountryId]);

  return (
    <div className="w-full h-full min-h-[400px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden relative">
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        // النقاط
        pointsData={allPoints}
        pointLat={(d: any) => d.lat}
        pointLng={(d: any) => d.lng}
        pointColor={(d: any) => d.color}
        pointRadius={(d: any) => d.size}
        pointAltitude={0.01}
        pointLabel={(d: any) => `
          <div class="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-teal-200 text-right" dir="rtl">
            <p class="font-bold text-teal-800 text-sm">${d.name}</p>
            <p class="text-xs text-gray-500">${d.nameEn}</p>
          </div>
        `}
        onPointClick={(point: any) => handlePointClick(point as PointData)}
        onPointHover={(point: any) => setHoveredPoint(point as PointData | null)}
        
        // خطوط الطيران
        arcsData={arcsData}
        arcStartLat={(d: any) => d.startLat}
        arcStartLng={(d: any) => d.startLng}
        arcEndLat={(d: any) => d.endLat}
        arcEndLng={(d: any) => d.endLng}
        arcColor={(d: any) => d.color}
        arcDashLength={0.5}
        arcDashGap={0.2}
        arcDashAnimateTime={2000}
        arcStroke={0.5}
        
        // الأقمار الصناعية / التأثيرات
        atmosphereColor="#14b8a6"
        atmosphereAltitude={0.15}
        
        // إعدادات العرض
        width={undefined}
        height={undefined}
        backgroundColor="rgba(0,0,0,0)"
      />
      
      {/* مؤشر التحميل */}
      <div className="absolute bottom-4 left-4 text-white/50 text-xs">
        اسحب للتدوير • اضغط على النقاط للتفاصيل
      </div>
      
      {/* زر إعادة التعيين */}
      {activeCountryId && (
        <button
          onClick={() => {
            setActiveCountryId(null);
            onCountrySelect(null);
            if (globeRef.current) {
              globeRef.current.pointOfView({
                lat: 20,
                lng: 80,
                altitude: 2.5
              }, 1000);
            }
          }}
          className="absolute top-4 left-4 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white text-sm hover:bg-white/20 transition-colors border border-white/20"
        >
          ← عرض الكل
        </button>
      )}
    </div>
  );
}
