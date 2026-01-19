import { MapPin } from "lucide-react";
import { Card } from "./ui/card";

interface CountryMapProps {
  cities: Array<{
    id: string;
    nameAr: string;
    nameEn: string;
    coordinates: { lat: number; lng: number };
    image: string;
  }>;
  countryName: string;
  centerCoordinates: { lat: number; lng: number };
  onCityClick?: (cityId: string) => void;
}

const CountryMap = ({ cities, countryName, centerCoordinates, onCityClick }: CountryMapProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-none shadow-lg">
      <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
        خريطة {countryName}
      </h3>
      
      <div className="relative w-full h-[500px] bg-white rounded-xl shadow-inner overflow-hidden">
        {/* خريطة تفاعلية بسيطة */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" />
            <p className="text-gray-600 text-lg">{countryName}</p>
            <p className="text-sm text-gray-500 mt-2">
              {centerCoordinates.lat.toFixed(4)}°N, {centerCoordinates.lng.toFixed(4)}°E
            </p>
          </div>
        </div>

        {/* نقاط المدن */}
        <div className="absolute inset-0">
          {cities.map((city, index) => {
            // توزيع المدن بشكل دائري حول المركز
            const angle = (index * 360) / cities.length;
            const radius = 35; // نسبة مئوية من المركز
            const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
            const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

            return (
              <div
                key={city.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
                onClick={() => onCityClick?.(city.id)}
              >
                {/* نقطة المدينة */}
                <div className="relative">
                  <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg group-hover:scale-150 transition-transform duration-300 animate-pulse" />
                  
                  {/* بطاقة معلومات عند التمرير */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                    <div className="bg-white rounded-lg shadow-xl p-3 min-w-[180px] border-2 border-primary">
                      <img 
                        src={city.image} 
                        alt={city.nameAr}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                      <p className="font-bold text-gray-800 text-center">{city.nameAr}</p>
                      <p className="text-xs text-gray-500 text-center">{city.nameEn}</p>
                      <div className="flex items-center justify-center gap-1 mt-1 text-xs text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{city.coordinates.lat.toFixed(2)}°, {city.coordinates.lng.toFixed(2)}°</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* اسم المدينة */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs font-semibold text-gray-700 bg-white/90 px-2 py-1 rounded shadow">
                    {city.nameAr}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* قائمة المدن */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {cities.map((city) => (
          <button
            key={city.id}
            onClick={() => onCityClick?.(city.id)}
            className="flex items-center gap-2 p-3 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 hover:bg-primary/5 group"
          >
            <MapPin className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-primary">
              {city.nameAr}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        <p>💡 مرر فوق النقاط الحمراء لرؤية المزيد من المعلومات</p>
        <p className="mt-1">انقر على اسم المدينة لزيارة صفحتها</p>
      </div>
    </Card>
  );
};

export default CountryMap;
