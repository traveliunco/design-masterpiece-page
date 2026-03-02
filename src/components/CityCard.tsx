import { MapPin, Calendar, DollarSign, Thermometer } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { City } from "@/data/southeast-asia";

interface CityCardProps {
  city: City;
  countryId?: string;
}

const CityCard = ({ city, countryId }: CityCardProps) => {
  const navigate = useNavigate();
  
  const bestTime = city.bestTimeToVisit || city.bestTime || "";
  const avgTemp = typeof city.averageTemp === 'string' 
    ? city.averageTemp 
    : city.averageTemp.summer;
  const accommodation = typeof city.accommodation === 'string'
    ? { budget: city.accommodation, midRange: "-", luxury: "-" }
    : city.accommodation;

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group">
      {/* صورة المدينة */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={city.image}
          alt={city.nameAr}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        <div className="absolute bottom-4 right-4 text-white">
          <h3 className="text-3xl font-bold mb-1">{city.nameAr}</h3>
          <p className="text-sm opacity-90">{city.nameEn}</p>
        </div>

        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
          <MapPin className="w-3 h-3 text-primary" />
          <span className="text-xs font-medium text-gray-700">
            {city.coordinates.lat.toFixed(2)}°, {city.coordinates.lng.toFixed(2)}°
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <p className="text-gray-600 leading-relaxed line-clamp-3">{city.description}</p>

        <div>
          <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span className="text-primary">✨</span>
            أبرز المعالم
          </h4>
          <div className="flex flex-wrap gap-2">
            {city.highlights.slice(0, 3).map((highlight, index) => (
              <span key={index} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{highlight}</span>
            ))}
            {city.highlights.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">+{city.highlights.length - 3} المزيد</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t">
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">أفضل وقت</p>
              <p className="text-sm font-semibold text-gray-800">{bestTime}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Thermometer className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">درجة الحرارة</p>
              <p className="text-sm font-semibold text-gray-800">{avgTemp}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-gray-800">الإقامة (لليلة)</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <p className="text-gray-500 mb-1">اقتصادي</p>
              <p className="font-bold text-green-600">{accommodation.budget}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">متوسط</p>
              <p className="font-bold text-blue-600">{accommodation.midRange}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">فاخر</p>
              <p className="font-bold text-purple-600">{accommodation.luxury}</p>
            </div>
          </div>
        </div>

        {countryId && (
          <Button
            onClick={() => navigate(`/country/${countryId}/city/${city.id}`)}
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            اكتشف {city.nameAr} 🌟
          </Button>
        )}
      </div>
    </Card>
  );
};

export default CityCard;
