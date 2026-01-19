import { MapPin, Calendar, DollarSign, Thermometer } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface CityCardProps {
  city: {
    id: string;
    nameAr: string;
    nameEn: string;
    description: string;
    image: string;
    coordinates: { lat: number; lng: number };
    highlights: string[];
    accommodation: { budget: string; midRange: string; luxury: string };
    averageTemp: { summer: string; winter: string };
    bestTimeToVisit: string;
  };
  countryId: string;
}

const CityCard = ({ city, countryId }: CityCardProps) => {
  const navigate = useNavigate();

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
        
        {/* اسم المدينة */}
        <div className="absolute bottom-4 right-4 text-white">
          <h3 className="text-3xl font-bold mb-1">{city.nameAr}</h3>
          <p className="text-sm opacity-90">{city.nameEn}</p>
        </div>

        {/* إحداثيات */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
          <MapPin className="w-3 h-3 text-primary" />
          <span className="text-xs font-medium text-gray-700">
            {city.coordinates.lat.toFixed(2)}°, {city.coordinates.lng.toFixed(2)}°
          </span>
        </div>
      </div>

      {/* محتوى البطاقة */}
      <div className="p-6 space-y-4">
        {/* الوصف */}
        <p className="text-gray-600 leading-relaxed line-clamp-3">
          {city.description}
        </p>

        {/* أبرز المعالم */}
        <div>
          <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span className="text-primary">✨</span>
            أبرز المعالم
          </h4>
          <div className="flex flex-wrap gap-2">
            {city.highlights.slice(0, 3).map((highlight, index) => (
              <span
                key={index}
                className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium"
              >
                {highlight}
              </span>
            ))}
            {city.highlights.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                +{city.highlights.length - 3} المزيد
              </span>
            )}
          </div>
        </div>

        {/* معلومات سريعة */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t">
          {/* أفضل وقت للزيارة */}
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">أفضل وقت</p>
              <p className="text-sm font-semibold text-gray-800">{city.bestTimeToVisit}</p>
            </div>
          </div>

          {/* درجة الحرارة */}
          <div className="flex items-start gap-2">
            <Thermometer className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">درجة الحرارة</p>
              <p className="text-sm font-semibold text-gray-800">
                {city.averageTemp.summer}
              </p>
            </div>
          </div>
        </div>

        {/* نطاق الأسعار */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-gray-800">الإقامة (لليلة)</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <p className="text-gray-500 mb-1">اقتصادي</p>
              <p className="font-bold text-green-600">{city.accommodation.budget}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">متوسط</p>
              <p className="font-bold text-blue-600">{city.accommodation.midRange}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">فاخر</p>
              <p className="font-bold text-purple-600">{city.accommodation.luxury}</p>
            </div>
          </div>
        </div>

        {/* زر الانتقال للصفحة */}
        <Button
          onClick={() => navigate(`/country/${countryId}/city/${city.id}`)}
          className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          اكتشف {city.nameAr} 🌟
        </Button>
      </div>
    </Card>
  );
};

export default CityCard;
