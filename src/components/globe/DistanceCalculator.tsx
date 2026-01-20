import { useState, useMemo } from 'react';
import { Plane, MapPin, Clock, Route, ChevronDown } from 'lucide-react';
import { saudiAirports, internationalAirports, Airport } from '@/data/airports';
import { calculateDistance, estimateFlightTime, formatDistance, getDistanceColor } from '@/utils/distanceUtils';
import { cn } from '@/lib/utils';

interface DistanceCalculatorProps {
  onFlightSelect: (fromAirport: Airport, toAirport: Airport) => void;
  selectedCountryId?: string;
}

export default function DistanceCalculator({ onFlightSelect, selectedCountryId }: DistanceCalculatorProps) {
  const [fromAirport, setFromAirport] = useState<Airport | null>(saudiAirports[0]);
  const [toAirport, setToAirport] = useState<Airport | null>(null);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  // تصفية المطارات الدولية بناءً على الدولة المختارة
  const filteredDestinations = useMemo(() => {
    if (selectedCountryId) {
      return internationalAirports.filter(a => a.country === selectedCountryId);
    }
    return internationalAirports;
  }, [selectedCountryId]);

  // حساب المسافة ووقت الطيران
  const flightInfo = useMemo(() => {
    if (!fromAirport || !toAirport) return null;
    
    const distance = calculateDistance(
      fromAirport.lat,
      fromAirport.lng,
      toAirport.lat,
      toAirport.lng
    );
    
    const time = estimateFlightTime(distance);
    
    return {
      distance,
      time,
      color: getDistanceColor(distance)
    };
  }, [fromAirport, toAirport]);

  const handleFromSelect = (airport: Airport) => {
    setFromAirport(airport);
    setShowFromDropdown(false);
    if (toAirport) {
      onFlightSelect(airport, toAirport);
    }
  };

  const handleToSelect = (airport: Airport) => {
    setToAirport(airport);
    setShowToDropdown(false);
    if (fromAirport) {
      onFlightSelect(fromAirport, airport);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 border border-white/20">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Route className="w-5 h-5 text-teal-500" />
        حاسبة المسافات الجوية
      </h3>
      
      {/* From Airport */}
      <div className="mb-3">
        <label className="text-xs text-gray-500 mb-1 block">من مطار</label>
        <div className="relative">
          <button
            onClick={() => setShowFromDropdown(!showFromDropdown)}
            className="w-full flex items-center justify-between gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors text-right"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🇸🇦</span>
              <div>
                <p className="font-bold text-gray-800 text-sm">{fromAirport?.city}</p>
                <p className="text-xs text-gray-500">{fromAirport?.code}</p>
              </div>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", showFromDropdown && "rotate-180")} />
          </button>
          
          {showFromDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
              {saudiAirports.map((airport) => (
                <button
                  key={airport.code}
                  onClick={() => handleFromSelect(airport)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 hover:bg-teal-50 transition-colors text-right",
                    fromAirport?.code === airport.code && "bg-teal-50"
                  )}
                >
                  <Plane className="w-4 h-4 text-teal-500" />
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{airport.city}</p>
                    <p className="text-xs text-gray-500">{airport.code} - {airport.nameAr}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* To Airport */}
      <div className="mb-4">
        <label className="text-xs text-gray-500 mb-1 block">إلى مطار</label>
        <div className="relative">
          <button
            onClick={() => setShowToDropdown(!showToDropdown)}
            className="w-full flex items-center justify-between gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors text-right"
          >
            {toAirport ? (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="font-bold text-gray-800 text-sm">{toAirport.city}</p>
                  <p className="text-xs text-gray-500">{toAirport.code}</p>
                </div>
              </div>
            ) : (
              <span className="text-gray-400 text-sm">اختر الوجهة...</span>
            )}
            <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", showToDropdown && "rotate-180")} />
          </button>
          
          {showToDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20 max-h-60 overflow-y-auto">
              {filteredDestinations.map((airport) => (
                <button
                  key={airport.code}
                  onClick={() => handleToSelect(airport)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 hover:bg-teal-50 transition-colors text-right",
                    toAirport?.code === airport.code && "bg-teal-50"
                  )}
                >
                  <Plane className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{airport.city}</p>
                    <p className="text-xs text-gray-500">{airport.code} - {airport.nameAr}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Flight Info Result */}
      {flightInfo && (
        <div 
          className="p-4 rounded-xl border-2 transition-all"
          style={{ 
            borderColor: flightInfo.color,
            backgroundColor: `${flightInfo.color}10`
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${flightInfo.color}20` }}
              >
                <Plane className="w-5 h-5" style={{ color: flightInfo.color }} />
              </div>
              <div>
                <p className="text-xs text-gray-500">المسافة الجوية</p>
                <p className="text-lg font-bold text-gray-800">
                  {formatDistance(flightInfo.distance)}
                </p>
              </div>
            </div>
            
            <div className="text-left">
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="w-3 h-3" />
                <span className="text-xs">وقت الطيران</span>
              </div>
              <p className="text-lg font-bold" style={{ color: flightInfo.color }}>
                {flightInfo.time.formattedAr}
              </p>
            </div>
          </div>
          
          {/* Flight Path Visual */}
          <div className="flex items-center justify-between text-sm">
            <div className="text-center">
              <span className="text-lg">🇸🇦</span>
              <p className="font-bold text-gray-700">{fromAirport?.code}</p>
            </div>
            <div className="flex-1 mx-4 relative">
              <div className="h-0.5 bg-gray-200 rounded" />
              <Plane 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 -rotate-90"
                style={{ color: flightInfo.color }}
              />
            </div>
            <div className="text-center">
              <span className="text-lg">✈️</span>
              <p className="font-bold text-gray-700">{toAirport?.code}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
