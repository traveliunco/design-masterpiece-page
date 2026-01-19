import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import PageLayout from "@/layouts/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CountryMap from "@/components/CountryMap";
import CityCard from "@/components/CityCard";
import { getCountryById } from "@/data/southeast-asia";
import { Info, Plane, DollarSign, Calendar, Sun } from "lucide-react";

const Malaysia = () => {
  const navigate = useNavigate();
  const country = getCountryById("malaysia");

  if (!country) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <PageLayout>
      <Helmet>
        <title>{country.nameAr} - ماليزيا، آسيا الحقيقية | ترافليون</title>
        <meta name="description" content={country.description} />
      </Helmet>

      {/* صورة الغلاف */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={country.coverImage}
          alt={country.nameAr}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* محتوى الغلاف */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-16">
            <div className="mb-4">
              <h1 className="text-6xl font-bold text-white mb-2">{country.nameAr}</h1>
              <p className="text-2xl text-white/90">{country.nameEn}</p>
            </div>
            <p className="text-xl text-white/90 max-w-3xl leading-relaxed">
              {country.description}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* معلومات سريعة */}
        <Card className="p-8 bg-gradient-to-r from-red-50 via-yellow-50 to-blue-50 border-none shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            معلومات أساسية عن ماليزيا
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* العملة */}
            <div className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-md">
              <DollarSign className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">العملة</h3>
                <p className="text-gray-600">{country.currency}</p>
                <p className="text-sm text-gray-500 mt-1">1 USD ≈ 4.7 MYR</p>
              </div>
            </div>

            {/* اللغة */}
            <div className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-md">
              <Info className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">اللغة</h3>
                <p className="text-gray-600">{country.language}</p>
                <p className="text-sm text-gray-500 mt-1">الإنجليزية والصينية منتشرتان</p>
              </div>
            </div>

            {/* التأشيرة */}
            <div className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-md">
              <Plane className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">التأشيرة</h3>
                <p className="text-gray-600">{country.visa}</p>
                <p className="text-sm text-gray-500 mt-1">عند الوصول - 90 يوماً</p>
              </div>
            </div>

            {/* أفضل موسم */}
            <div className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-md">
              <Calendar className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">أفضل موسم</h3>
                <p className="text-gray-600">{country.bestSeason}</p>
                <p className="text-sm text-gray-500 mt-1">جفاف وطقس مثالي</p>
              </div>
            </div>

            {/* المناخ */}
            <div className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-md">
              <Sun className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">المناخ</h3>
                <p className="text-gray-600">{country.climate}</p>
                <p className="text-sm text-gray-500 mt-1">حار ورطب طوال العام</p>
              </div>
            </div>

            {/* الميزانية */}
            <div className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-md">
              <DollarSign className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">الميزانية اليومية</h3>
                <p className="text-gray-600">{country.budget}</p>
                <p className="text-sm text-gray-500 mt-1">شامل الإقامة والطعام والتنقل</p>
              </div>
            </div>
          </div>
        </Card>

        {/* الخريطة التفاعلية */}
        <CountryMap
          cities={country.cities.map(city => ({
            id: city.id,
            nameAr: city.nameAr,
            nameEn: city.nameEn,
            coordinates: city.coordinates,
            image: city.image,
          }))}
          countryName={country.nameAr}
          centerCoordinates={{ lat: 3.1390, lng: 101.6869 }}
          onCityClick={(cityId) => navigate(`/country/malaysia/city/${cityId}`)}
        />

        {/* المدن السياحية */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              أفضل المدن السياحية في ماليزيا
            </h2>
            <p className="text-xl text-gray-600">
              اكتشف {country.cities.length} مدن سياحية رائعة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {country.cities.map((city) => (
              <CityCard key={city.id} city={city} countryId="malaysia" />
            ))}
          </div>
        </div>

        {/* دعوة للحجز */}
        <Card className="p-12 bg-gradient-to-r from-primary to-blue-600 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">جاهز لاستكشاف ماليزيا؟</h2>
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

export default Malaysia;
