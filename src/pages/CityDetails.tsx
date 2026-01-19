import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import PageLayout from "@/layouts/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AttractionsList from "@/components/AttractionsList";
import { getCityById } from "@/data/southeast-asia";
import { MapPin, Calendar, Thermometer, DollarSign, ArrowLeft } from "lucide-react";

const CityDetails = () => {
  const { countryId, cityId } = useParams();
  const navigate = useNavigate();
  const city = getCityById(cityId || "");

  if (!city) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">المدينة غير موجودة</h1>
          <Button onClick={() => navigate(-1)}>العودة</Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Helmet>
        <title>{city.nameAr} - {city.nameEn} | ترافليون</title>
        <meta name="description" content={city.description} />
      </Helmet>

      {/* صورة الغلاف */}
      <div className="relative h-[70vh] overflow-hidden">
        <img
          src={city.image}
          alt={city.nameAr}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        {/* محتوى الغلاف */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-16">
            {/* زر العودة */}
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 mb-8"
              onClick={() => navigate(`/country/${countryId}`)}
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              العودة إلى الدولة
            </Button>

            <h1 className="text-7xl font-bold text-white mb-2">{city.nameAr}</h1>
            <p className="text-3xl text-white/90 mb-4">{city.nameEn}</p>
            
            {/* الإحداثيات */}
            <div className="flex items-center gap-2 text-white/80">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">
                {city.coordinates.lat.toFixed(4)}°N, {city.coordinates.lng.toFixed(4)}°E
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* الوصف والأبرز */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* الوصف */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">عن {city.nameAr}</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{city.description}</p>
            </Card>
          </div>

          {/* معلومات سريعة */}
          <div className="space-y-4">
            {/* أفضل وقت للزيارة */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-none">
              <div className="flex items-start gap-3">
                <Calendar className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">أفضل وقت للزيارة</h3>
                  <p className="text-gray-600">{city.bestTimeToVisit}</p>
                </div>
              </div>
            </Card>

            {/* درجات الحرارة */}
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-none">
              <div className="flex items-start gap-3">
                <Thermometer className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="w-full">
                  <h3 className="font-bold text-gray-800 mb-3">درجات الحرارة</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">الصيف</span>
                      <span className="font-bold text-orange-600">{city.averageTemp.summer}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">الشتاء</span>
                      <span className="font-bold text-blue-600">{city.averageTemp.winter}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* الإقامة */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-none">
              <div className="flex items-start gap-3">
                <DollarSign className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="w-full">
                  <h3 className="font-bold text-gray-800 mb-3">تكلفة الإقامة (لليلة)</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">اقتصادي</span>
                      <span className="font-bold text-green-600">{city.accommodation.budget}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">متوسط</span>
                      <span className="font-bold text-blue-600">{city.accommodation.midRange}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">فاخر</span>
                      <span className="font-bold text-purple-600">{city.accommodation.luxury}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* أبرز المعالم */}
        <Card className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 border-none">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            ✨ أبرز معالم {city.nameAr}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {city.highlights.map((highlight, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-center group hover:scale-105"
              >
                <div className="text-3xl mb-2">✨</div>
                <p className="font-medium text-gray-800 group-hover:text-primary transition-colors">
                  {highlight}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* قائمة المعالم السياحية */}
        <AttractionsList attractions={city.attractions} cityName={city.nameAr} />

        {/* دعوة للحجز */}
        <Card className="p-12 bg-gradient-to-r from-primary to-blue-600 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">جاهز لزيارة {city.nameAr}؟</h2>
          <p className="text-xl mb-8 opacity-90">
            احجز رحلتك الآن واستمتع بعروض حصرية على الطيران والفنادق
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6"
              onClick={() => navigate("/booking")}
            >
              احجز رحلتك الآن ✈️
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-white/10 border-white text-white hover:bg-white hover:text-primary"
              onClick={() => navigate("/contact")}
            >
              تواصل معنا للاستشارة 💬
            </Button>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default CityDetails;
