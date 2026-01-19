import { MapPin, Star, Clock, DollarSign } from "lucide-react";
import { Card } from "./ui/card";

interface Attraction {
  nameAr: string;
  nameEn: string;
  description: string;
  type: string;
  entryFee: string;
  timeNeeded: string;
  bestTimeToVisit: string;
  rating: number;
}

interface AttractionsListProps {
  attractions: Attraction[];
  cityName: string;
}

const AttractionsList = ({ attractions, cityName }: AttractionsListProps) => {
  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      "معبد": "bg-purple-100 text-purple-700",
      "سوق": "bg-orange-100 text-orange-700",
      "شاطئ": "bg-blue-100 text-blue-700",
      "قصر": "bg-pink-100 text-pink-700",
      "متحف": "bg-indigo-100 text-indigo-700",
      "حديقة": "bg-green-100 text-green-700",
      "مركز تسوق": "bg-yellow-100 text-yellow-700",
      "مبنى": "bg-gray-100 text-gray-700",
      "منتزه": "bg-teal-100 text-teal-700",
      "مسجد": "bg-emerald-100 text-emerald-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          أفضل الأماكن السياحية في {cityName}
        </h2>
        <p className="text-gray-600">
          اكتشف {attractions.length} معلم سياحي مميز
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {attractions.map((attraction, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div className="p-6 space-y-4">
              {/* الترتيب والنوع */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {index + 1}
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getTypeColor(attraction.type)}`}>
                    {attraction.type}
                  </span>
                </div>
                
                {/* التقييم */}
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-gray-800">{attraction.rating}</span>
                </div>
              </div>

              {/* الاسم */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors">
                  {attraction.nameAr}
                </h3>
                <p className="text-sm text-gray-500">{attraction.nameEn}</p>
              </div>

              {/* الوصف */}
              <p className="text-gray-600 leading-relaxed">
                {attraction.description}
              </p>

              {/* معلومات الزيارة */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                {/* رسوم الدخول */}
                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">رسوم الدخول</p>
                    <p className="text-sm font-semibold text-gray-800">{attraction.entryFee}</p>
                  </div>
                </div>

                {/* الوقت المطلوب */}
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">مدة الزيارة</p>
                    <p className="text-sm font-semibold text-gray-800">{attraction.timeNeeded}</p>
                  </div>
                </div>

                {/* أفضل وقت للزيارة */}
                <div className="flex items-start gap-2 col-span-2">
                  <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">أفضل وقت للزيارة</p>
                    <p className="text-sm font-semibold text-gray-800">{attraction.bestTimeToVisit}</p>
                  </div>
                </div>
              </div>

              {/* شريط التقدم للتقييم */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>تقييم الزوار</span>
                  <span>{attraction.rating}/5.0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(attraction.rating / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* إحصائيات سريعة */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-none">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-primary mb-1">{attractions.length}</p>
            <p className="text-sm text-gray-600">معلم سياحي</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary mb-1">
              {(attractions.reduce((sum, a) => sum + a.rating, 0) / attractions.length).toFixed(1)}
            </p>
            <p className="text-sm text-gray-600">متوسط التقييم</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary mb-1">
              {attractions.filter(a => a.entryFee.includes("مجاني")).length}
            </p>
            <p className="text-sm text-gray-600">معلم مجاني</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary mb-1">
              {new Set(attractions.map(a => a.type)).size}
            </p>
            <p className="text-sm text-gray-600">أنواع مختلفة</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AttractionsList;
