import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useState } from "react";
import Nav3D from "@/components/Nav3D";
import MobileNav from "@/components/MobileNav";
import PremiumFooter from "@/components/PremiumFooter";
import LeafletMap from "@/components/maps/LeafletMap";
import { City, Country, getCountryById, getCityById } from "@/data/destinations-data";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "sonner";
import { 
  Calendar,
  Thermometer,
  Hotel,
  Star,
  ChevronLeft,
  MapPin,
  Clock,
  Camera,
  Plane,
  ArrowRight,
  Heart,
  Share2,
  Navigation,
  Sparkles,
  CheckCircle,
  Users
} from "lucide-react";

interface CityTemplateProps {
  city: City;
  country: Country;
}

const CityTemplate = ({ city, country }: CityTemplateProps) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<'attractions' | 'highlights' | 'tips'>('attractions');
  const [likedAttractions, setLikedAttractions] = useState<Set<number>>(new Set());

  const cityIsFavorite = isFavorite(city.id, 'city');

  const handleToggleFavorite = () => {
    toggleFavorite({
      id: city.id,
      type: 'city',
      countryId: country.id,
      nameAr: city.nameAr,
      image: city.image,
    });
    toast(cityIsFavorite ? `تمت إزالة ${city.nameAr} من المفضلة` : `تمت إضافة ${city.nameAr} إلى المفضلة ❤️`);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `${city.nameAr} - ${country.nameAr} | ترافليون للسياحة`;
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast('تم نسخ رابط الصفحة! 📋');
    }
  };

  const handleNavigate = () => {
    const lat = city.coordinates.lat;
    const lng = city.coordinates.lng;
    window.open(`https://www.google.com/maps/@${lat},${lng},12z`, '_blank');
  };

  const toggleLike = (index: number) => {
    const newLiked = new Set(likedAttractions);
    if (newLiked.has(index)) {
      newLiked.delete(index);
    } else {
      newLiked.add(index);
    }
    setLikedAttractions(newLiked);
  };

  // Get other cities from the same country
  const otherCities = country.cities.filter(c => c.id !== city.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Helmet>
        <title>{city.nameAr} - {city.nameEn} | {country.nameAr} | ترافليون</title>
        <meta name="description" content={city.description} />
        <meta property="og:title" content={`${city.nameAr} - ${country.nameAr} | ترافليون`} />
        <meta property="og:image" content={city.image} />
      </Helmet>

      {/* Navigation */}
      <Nav3D />
      <MobileNav />

      {/* Breadcrumb */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => navigate('/')} className="text-white/50 hover:text-white transition-colors">
              الرئيسية
            </button>
            <ChevronLeft className="w-4 h-4 text-white/30" />
            <button onClick={() => navigate(`/country/${country.id}`)} className="text-white/50 hover:text-white transition-colors">
              {country.nameAr}
            </button>
            <ChevronLeft className="w-4 h-4 text-white/30" />
            <span className="text-amber-400 font-medium">{city.nameAr}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden pt-20">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={city.image}
            alt={city.nameAr}
            className="w-full h-full object-cover scale-110 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/30 to-slate-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/60" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
          {/* Country Badge */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 animate-fade-in-up">
            <MapPin className="w-5 h-5 text-amber-400" />
            <span className="text-white/80">{country.nameAr}</span>
          </div>

          {/* City Name */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-3 md:mb-4 animate-fade-in-up px-4" style={{ animationDelay: '0.1s' }}>
            {city.nameAr}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed animate-fade-in-up px-4" style={{ animationDelay: '0.2s' }}>
            {city.description}
          </p>

          {/* City Info Summary */}
          <div className="mt-5 bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-5 border border-white/20 animate-fade-in-up max-w-4xl mx-auto" style={{ animationDelay: '0.4s' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {/* Best Time */}
              <div className="text-center">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-2 md:mb-3 mx-auto shadow-lg">
                  <Calendar className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h3 className="text-white font-bold text-xs md:text-sm mb-1 md:mb-2">أفضل وقت</h3>
                <p className="text-white/90 text-sm md:text-base font-semibold leading-snug">{city.bestTime}</p>
              </div>

              {/* Temperature */}
              <div className="text-center">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-2 md:mb-3 mx-auto shadow-lg">
                  <Thermometer className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h3 className="text-white font-bold text-xs md:text-sm mb-1 md:mb-2">درجة الحرارة</h3>
                <p className="text-white/90 text-sm md:text-base font-semibold leading-snug">{city.averageTemp}</p>
              </div>

              {/* City Tags */}
              <div className="text-center">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-2 md:mb-3 mx-auto shadow-lg">
                  <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h3 className="text-white font-bold text-xs md:text-sm mb-1 md:mb-2">مميزات</h3>
                <p className="text-white/90 text-sm md:text-base font-semibold leading-snug">
                  {(() => {
                    const cityTags: Record<string, string> = {
                      'bangkok': 'تسوق • حياة ليلية • ثقافة',
                      'phuket': 'شواطئ • غوص • طبيعة',
                      'chiang-mai': 'معابد • طبيعة • هدوء',
                      'pattaya': 'ترفيه • شواطئ • مغامرة',
                      'kuala-lumpur': 'تنوع • تسوق • عمارة',
                      'langkawi': 'جزر • طبيعة • رومانسية',
                      'penang': 'تراث • فنون • مأكولات',
                      'genting': 'ترفيه • برودة • مغامرة',
                      'kota-kinabalu': 'جبال • غوص • طبيعة',
                      'bali': 'روحانية • طبيعة • جمال',
                      'jakarta': 'تنوع • تاريخ • حداثة',
                      'yogyakarta': 'تراث • معابد • ثقافة',
                      'medan': 'طبيعة • بحيرات • تنوع',
                      'hanoi': 'تاريخ • ثقافة • مأكولات',
                      'ho-chi-minh': 'حيوية • تاريخ • تسوق',
                      'da-nang': 'شواطئ • جسور • طبيعة',
                      'ha-long-bay': 'خلجان • طبيعة • سحر',
                      'manila': 'تنوع • تاريخ • حيوية',
                      'cebu': 'شواطئ • غوص • مغامرة',
                      'boracay': 'شواطئ • رمال • جمال',
                      'palawan': 'جزر • طبيعة • صفاء',
                      'singapore-city': 'حداثة • نظافة • تنوع',
                      'istanbul': 'تاريخ • ثقافة • جمال',
                      'trabzon': 'طبيعة • خضرة • هدوء',
                      'antalya': 'شواطئ • تاريخ • فخامة',
                      'bursa': 'طبيعة • تلفريك • تاريخ',
                      'cappadocia': 'مناطيد • صخور • سحر',
                      'pamukkale': 'ينابيع • طبيعة • جمال',
                      'sapanca': 'بحيرة • هدوء • رومانسية',
                      'fethiye': 'خلجان • طيران • طبيعة',
                      'marmaris': 'بحر • يخوت • ترفيه',
                      'bodrum': 'فخامة • بحر • حيوية',
                      'konya': 'روحانية • تاريخ • ثقافة',
                      'rize': 'شاي • طبيعة • خضرة',
                    };
                    return cityTags[city.id] || 'تنوع • جمال • ثقافة';
                  })()}
                </p>
              </div>

              {/* Attractions */}
              <div className="text-center">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-2 md:mb-3 mx-auto shadow-lg">
                  <Camera className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h3 className="text-white font-bold text-xs md:text-sm mb-1 md:mb-2">المعالم</h3>
                <p className="text-white/90 text-sm md:text-base font-semibold leading-snug">{city.attractions.length} معلم</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 md:mt-6 flex gap-3 md:gap-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <button 
              onClick={handleToggleFavorite}
              className={`w-12 h-12 md:w-14 md:h-14 backdrop-blur-md rounded-full flex items-center justify-center transition-all ${cityIsFavorite ? 'bg-red-500 text-white scale-110' : 'bg-white/10 text-white hover:bg-red-500'}`}
              title="إضافة إلى المفضلة"
            >
              <Heart className={`w-5 h-5 md:w-6 md:h-6 ${cityIsFavorite ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={handleShare}
              className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-all"
              title="مشاركة"
            >
              <Share2 className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button 
              onClick={handleNavigate}
              className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-emerald-500 transition-all"
              title="فتح في خرائط قوقل"
            >
              <Navigation className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* City Highlights Section */}
      <section className="py-20 px-4 bg-slate-950">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 px-6 py-3 rounded-full text-sm mb-6 border border-purple-500/30">
              <Sparkles className="w-5 h-5" />
              <span>مميزات {city.nameAr}</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              لماذا تزور {city.nameAr}؟
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              اكتشف أبرز ما يميز هذه المدينة الساحرة وما يجعلها وجهة مثالية لرحلتك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {city.highlights.slice(0, 6).map((highlight, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <p className="text-white font-medium text-lg">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm mb-4">
              <MapPin className="w-4 h-4" />
              <span>موقع المدينة</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              خريطة {city.nameAr}
            </h2>
          </div>

          <LeafletMap
            cities={[{
              id: city.id,
              nameAr: city.nameAr,
              nameEn: city.nameEn,
              coordinates: city.coordinates,
              image: city.image,
            }]}
            center={city.coordinates}
            zoom={12}
            height="450px"
            showConnections={false}
            style="default"
          />
        </div>
      </section>

      {/* Attractions & Highlights Tabs */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
        <div className="container mx-auto">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-2 inline-flex gap-2">
              <button
                onClick={() => setActiveTab('attractions')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'attractions'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Camera className="w-4 h-4 inline-block ml-2" />
                المعالم السياحية ({city.attractions.length})
              </button>
              <button
                onClick={() => setActiveTab('highlights')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'highlights'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Sparkles className="w-4 h-4 inline-block ml-2" />
                أبرز المميزات ({city.highlights.length})
              </button>
            </div>
          </div>

          {/* Attractions Grid */}
          {activeTab === 'attractions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {city.attractions.map((attraction, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/50 transition-all duration-300 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🏛️</span>
                    </div>
                    <button
                      onClick={() => toggleLike(index)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        likedAttractions.has(index)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/10 text-white/50 hover:bg-red-500/20 hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${likedAttractions.has(index) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-amber-400 transition-colors">
                    {attraction}
                  </h3>
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{city.nameAr}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Highlights Grid */}
          {activeTab === 'highlights' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {city.highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-emerald-500/10 to-teal-600/10 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 flex items-start gap-4 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-lg">{highlight}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Other Cities in Country */}
      {otherCities.length > 0 && (
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm mb-4">
                <MapPin className="w-4 h-4" />
                <span>استكشف المزيد</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                مدن أخرى في {country.nameAr}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherCities.slice(0, 3).map((otherCity, index) => (
                <div
                  key={otherCity.id}
                  onClick={() => navigate(`/country/${country.id}/city/${otherCity.id}`)}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={otherCity.image}
                      alt={otherCity.nameAr}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {otherCity.nameAr}
                    </h3>
                    <div className="flex items-center text-purple-400 text-sm font-medium">
                      <span>استكشف المدينة</span>
                      <ArrowRight className="w-4 h-4 mr-2 group-hover:mr-4 transition-all" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0">
              <img src={city.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/95" />
            </div>

            <div className="relative py-16 px-8 md:px-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                جاهز لزيارة {city.nameAr}؟
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                احجز رحلتك الآن واستمتع بأفضل العروض على الفنادق والطيران
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/booking")}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <Plane className="w-5 h-5" />
                  احجز رحلتك
                </button>
                <button
                  onClick={() => navigate(`/country/${country.id}`)}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-lg border border-white/20 flex items-center justify-center gap-2 transition-all"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                  العودة إلى {country.nameAr}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PremiumFooter />

      {/* Custom Styles */}
      <style>{`
        @keyframes slow-zoom {
          0%, 100% { transform: scale(1.1); }
          50% { transform: scale(1.15); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) translateX(-50%); }
          50% { transform: translateY(-10px) translateX(-50%); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scroll-down {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(8px); opacity: 0; }
        }
        .animate-slow-zoom { animation: slow-zoom 20s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
        .animate-scroll-down { animation: scroll-down 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

// Wrapper component that gets city from URL params
const CityTemplateWrapper = () => {
  const { countryId, cityId } = useParams<{ countryId: string; cityId: string }>();
  const navigate = useNavigate();

  if (!countryId || !cityId) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">معرفات غير صالحة</div>
      </div>
    );
  }

  const country = getCountryById(countryId);
  const city = getCityById(countryId, cityId);

  if (!country || !city) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">المدينة غير موجودة</div>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  return <CityTemplate city={city} country={country} />;
};

export { CityTemplate, CityTemplateWrapper };
export default CityTemplateWrapper;
