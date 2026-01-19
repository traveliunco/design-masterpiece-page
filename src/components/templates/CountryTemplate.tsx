import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useState } from "react";
import Nav3D from "@/components/Nav3D";
import MobileNav from "@/components/MobileNav";
import PremiumFooter from "@/components/PremiumFooter";
import LeafletMap from "@/components/maps/LeafletMap";
import { Country } from "@/data/destinations-data";
import { 
  DollarSign, 
  Globe, 
  Plane, 
  Calendar, 
  Sun, 
  Clock,
  MapPin,
  Star,
  ChevronLeft,
  Heart,
  Camera,
  Users,
  Thermometer,
  Hotel,
  Sparkles
} from "lucide-react";

interface CountryTemplateProps {
  country: Country;
}

const CountryTemplate = ({ country }: CountryTemplateProps) => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const handleCityClick = (cityId: string) => {
    navigate(`/country/${country.id}/city/${cityId}`);
  };

  // Quick info cards data
  const quickInfo = [
    { icon: DollarSign, label: "العملة", value: country.currency, color: "from-green-500 to-emerald-600" },
    { icon: Globe, label: "اللغة", value: country.language, color: "from-blue-500 to-indigo-600" },
    { icon: Plane, label: "التأشيرة", value: country.visa, color: "from-purple-500 to-violet-600" },
    { icon: Calendar, label: "أفضل موسم", value: country.bestSeason, color: "from-amber-500 to-orange-600" },
    { icon: Sun, label: "المناخ", value: country.climate, color: "from-cyan-500 to-blue-600" },
    { icon: Clock, label: "مدة الرحلة", value: country.tripDuration, color: "from-rose-500 to-pink-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Helmet>
        <title>{country.nameAr} - {country.nameEn} | ترافليون للسياحة</title>
        <meta name="description" content={country.description} />
        <meta property="og:title" content={`${country.nameAr} - ترافليون`} />
        <meta property="og:image" content={country.coverImage} />
      </Helmet>

      {/* Navigation */}
      <Nav3D />
      <MobileNav />

      {/* Hero Section with Parallax */}
      <section className="relative h-[85vh] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={country.coverImage}
            alt={country.nameAr}
            className="w-full h-full object-cover scale-110 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80" />
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
          {/* Country Name */}
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 tracking-tight">
              {country.nameAr}
            </h1>
            <p className="text-2xl md:text-3xl text-white/80 font-light mb-6">
              {country.nameEn}
            </p>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              {country.description}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-amber-400">{country.cities.length}</div>
              <div className="text-white/60 text-sm">مدن سياحية</div>
            </div>
            <div className="h-16 w-px bg-white/20 hidden md:block" />
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-emerald-400">{country.highlights.length}+</div>
              <div className="text-white/60 text-sm">معالم مميزة</div>
            </div>
            <div className="h-16 w-px bg-white/20 hidden md:block" />
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-400">4.8</div>
              <div className="text-white/60 text-sm flex items-center justify-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> تقييم الزوار
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
            <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-white/50 rounded-full animate-scroll-down" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="relative -mt-20 z-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {quickInfo.map((info, index) => (
              <div
                key={info.label}
                className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 md:p-5 border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:bg-black/50 group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform flex-shrink-0`}>
                  <info.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <p className="text-white/50 text-xs mb-1 font-medium">{info.label}</p>
                <p className="text-white font-semibold text-xs md:text-sm leading-tight break-words">{info.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm mb-4">
              <MapPin className="w-4 h-4" />
              <span>خريطة تفاعلية</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              اكتشف المدن السياحية
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              انقر على أي مدينة في الخريطة للاطلاع على تفاصيلها ومعالمها السياحية
            </p>
          </div>

          <LeafletMap
            cities={country.cities.map(city => ({
              id: city.id,
              nameAr: city.nameAr,
              nameEn: city.nameEn,
              coordinates: city.coordinates,
              image: city.image,
              isCapital: city.id === country.cities[0].id,
            }))}
            center={country.coordinates}
            zoom={6}
            onCityClick={handleCityClick}
            selectedCity={selectedCity}
            height="600px"
            style="default"
          />
        </div>
      </section>

      {/* Cities Showcase */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              <span>أفضل الوجهات</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              المدن السياحية في {country.nameAr}
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              اكتشف {country.cities.length} مدن سياحية رائعة تقدم تجارب لا تُنسى
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {country.cities.map((city, index) => (
              <div
                key={city.id}
                className="group relative bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${index * 0.15}s` }}
                onClick={() => handleCityClick(city.id)}
                onMouseEnter={() => setSelectedCity(city.id)}
                onMouseLeave={() => setSelectedCity(null)}
              >
                {/* Image */}
                <div className="relative h-56 md:h-64 overflow-hidden flex-shrink-0">
                  <img
                    src={city.image}
                    alt={city.nameAr}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Floating badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-medium flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5" />
                      <span className="whitespace-nowrap">{city.averageTemp}</span>
                    </div>
                  </div>
                  
                  <button className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 hover:text-white transition-all">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* City Name */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors truncate">
                        {city.nameAr}
                      </h3>
                      <p className="text-white/50 text-sm">{city.nameEn}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-500/20 px-2.5 py-1.5 rounded-lg flex-shrink-0">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-amber-400 font-bold text-sm">4.8</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-white/70 text-sm leading-relaxed line-clamp-2">{city.description}</p>

                  {/* Quick Stats */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2 text-white/60 text-xs bg-white/5 rounded-lg px-3 py-2">
                      <Calendar className="w-4 h-4 flex-shrink-0 text-blue-400" />
                      <span className="truncate">{city.bestTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-xs bg-white/5 rounded-lg px-3 py-2">
                      <Camera className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                      <span className="truncate">{city.attractions.length} معلم</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2">
                    {city.highlights.slice(0, 3).map((highlight, i) => (
                      <span
                        key={i}
                        className="bg-white/10 text-white/70 px-3 py-1.5 rounded-full text-xs whitespace-nowrap"
                      >
                        {highlight}
                      </span>
                    ))}
                    {city.highlights.length > 3 && (
                      <span className="text-white/40 text-xs px-2 py-1.5">
                        +{city.highlights.length - 3} المزيد
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 group-hover:gap-4 transition-all mt-2">
                    <span>استكشف {city.nameAr}</span>
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Country Highlights */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm mb-4">
              <Camera className="w-4 h-4" />
              <span>أبرز المعالم</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              لماذا تزور {country.nameAr}؟
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {country.highlights.map((highlight, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-emerald-500/50 transition-all duration-300 group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <p className="text-white font-medium text-lg">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Budget Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-blue-900/20">
        <div className="container mx-auto">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">الميزانية المتوقعة</h3>
                <p className="text-white/60">تكلفة تقريبية للرحلة تشمل الإقامة والطعام والتنقل</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  {country.budget}
                </div>
                <p className="text-white/50 text-sm mt-2">يومياً / للشخص</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
              <img
                src={country.coverImage}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/95" />
            </div>

            {/* Content */}
            <div className="relative py-16 px-8 md:px-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                جاهز لاستكشاف {country.nameAr}؟
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                احجز رحلتك الآن واستمتع بعروض حصرية على الطيران والفنادق
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/booking")}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <Plane className="w-5 h-5" />
                  احجز رحلتك الآن
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-lg border border-white/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Users className="w-5 h-5" />
                  تواصل معنا للاستشارة
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
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
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
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
        .animate-scroll-down { animation: scroll-down 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default CountryTemplate;
