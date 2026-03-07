import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/layouts/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CountryMap from "@/components/CountryMap";
import CityCard from "@/components/CityCard";
import { getCountryById as getCountryFromDB } from "@/services/countriesService";
import { getCountryById as getCountryFromLocal } from "@/data/southeast-asia";
import { Info, Plane, DollarSign, Calendar, Sun, Globe } from "lucide-react";

const CountryPage = () => {
  const navigate = useNavigate();
  const { countryId } = useParams<{ countryId: string }>();

  // أولاً: جرّب تحميل البيانات من Supabase
  const { data: dbCountry, isLoading } = useQuery({
    queryKey: ["tour-country", countryId],
    queryFn: () => getCountryFromDB(countryId!),
    enabled: !!countryId,
    staleTime: 1000 * 60 * 5, // 5 دقائق
  });

  // fallback: البيانات المحلية إن لم توجد في Supabase
  const localCountry = countryId ? getCountryFromLocal(countryId) : null;

  // تحويل بيانات Supabase لنفس هيكل البيانات المحلية
  const country = dbCountry
    ? {
        id: dbCountry.id,
        nameAr: dbCountry.name_ar,
        nameEn: dbCountry.name_en,
        description: dbCountry.description || "",
        coverImage: dbCountry.cover_image || "",
        currency: dbCountry.currency || "",
        language: dbCountry.language || "",
        visa: dbCountry.visa || "",
        bestSeason: dbCountry.best_season || "",
        climate: dbCountry.climate || "",
        budget: dbCountry.budget || "",
        highlights: dbCountry.highlights || [],
        coordinates: {
          lat: dbCountry.coordinates_lat || 0,
          lng: dbCountry.coordinates_lng || 0,
        },
        cities: (dbCountry.cities || []).map((city: any) => ({
          id: city.id,
          nameAr: city.name_ar,
          nameEn: city.name_en,
          description: city.description || "",
          image: city.image || "",
          coordinates: {
            lat: city.coordinates_lat || 0,
            lng: city.coordinates_lng || 0,
          },
          attractions: city.attractions || [],
          highlights: city.highlights || [],
          bestTime: city.best_time || "",
          averageTemp: city.average_temp || "",
          accommodation: city.accommodation || "",
        })),
      }
    : localCountry;

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">جاري تحميل معلومات الدولة...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!country) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-700 mb-2">الدولة غير موجودة</h1>
            <p className="text-gray-500 mb-6">لم يتم العثور على صفحة لهذه الدولة</p>
            <Button onClick={() => navigate("/destinations")}>
              العودة إلى الوجهات
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Helmet>
        <title>{country.nameAr} - وجهة سياحية مميزة | ترافليون</title>
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
        <Card className="p-8 bg-gradient-to-r from-orange-50 via-yellow-50 to-red-50 border-none shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            معلومات أساسية عن {country.nameAr}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {country.currency && (
              <div className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-md">
                <DollarSign className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">العملة</h3>
                  <p className="text-gray-600">{country.currency}</p>
                </div>
              </div>
            )}

            {country.language && (
              <div className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-md">
                <Info className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">اللغة</h3>
                  <p className="text-gray-600">{country.language}</p>
                </div>
              </div>
            )}

            {country.visa && (
              <div className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-md">
                <Plane className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">التأشيرة</h3>
                  <p className="text-gray-600">{country.visa}</p>
                  <p className="text-sm text-gray-500 mt-1">للسعوديين والخليجيين</p>
                </div>
              </div>
            )}

            {country.bestSeason && (
              <div className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-md">
                <Calendar className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">أفضل موسم</h3>
                  <p className="text-gray-600">{country.bestSeason}</p>
                  <p className="text-sm text-gray-500 mt-1">طقس مثالي وأسعار معتدلة</p>
                </div>
              </div>
            )}

            {country.climate && (
              <div className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-md">
                <Sun className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">المناخ</h3>
                  <p className="text-gray-600">{country.climate}</p>
                </div>
              </div>
            )}

            {country.budget && (
              <div className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-md">
                <DollarSign className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">الميزانية اليومية</h3>
                  <p className="text-gray-600">{country.budget}</p>
                  <p className="text-sm text-gray-500 mt-1">شامل الإقامة والطعام والتنقل</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* أبرز المزايا */}
        {country.highlights && country.highlights.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              أبرز ما يميز {country.nameAr}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {country.highlights.map((h: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md border">
                  <span className="text-2xl">✨</span>
                  <p className="text-gray-700 font-medium">{h}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* الخريطة التفاعلية */}
        {country.cities && country.cities.length > 0 && country.coordinates.lat !== 0 && (
          <CountryMap
            cities={country.cities.map((city: any) => ({
              id: city.id,
              nameAr: city.nameAr,
              nameEn: city.nameEn,
              coordinates: city.coordinates,
              image: city.image,
            }))}
            countryName={country.nameAr}
            centerCoordinates={country.coordinates}
            onCityClick={(cityId) => navigate(`/country/${countryId}/city/${cityId}`)}
          />
        )}

        {/* المدن السياحية */}
        {country.cities && country.cities.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                أفضل المدن السياحية في {country.nameAr}
              </h2>
              <p className="text-xl text-gray-600">
                اكتشف {country.cities.length} مدن سياحية ساحرة
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {country.cities.map((city: any) => (
                <CityCard key={city.id} city={city} countryId={countryId!} />
              ))}
            </div>
          </div>
        )}

        {/* دعوة للحجز */}
        <Card className="p-12 bg-gradient-to-r from-primary to-blue-600 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">جاهز لاستكشاف {country.nameAr}؟</h2>
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

export default CountryPage;
