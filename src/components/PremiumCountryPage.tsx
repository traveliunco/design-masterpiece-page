import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Country } from "@/data/southeast-asia";
import { 
  MapPin, Plane, DollarSign, Calendar, Sun, Globe, Users, Clock,
  Star, ChevronLeft, Heart, Share2, Camera, Utensils, Building,
  Mountain, Waves, TreePine, Sparkles, ArrowRight, Navigation
} from "lucide-react";
import { useState } from "react";
import Nav3D from "./Nav3D";
import PremiumFooter from "./PremiumFooter";
import MobileNav from "./MobileNav";

interface PremiumCountryPageProps {
  country: Country;
}

const PremiumCountryPage = ({ country }: PremiumCountryPageProps) => {
  const navigate = useNavigate();
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  // حساب مواقع المدن على الخريطة بناءً على الإحداثيات الحقيقية
  const getMapPosition = (lat: number, lng: number) => {
    // نحدد حدود الخريطة بناءً على إحداثيات الدولة
    const countryLat = country.coordinates.lat;
    const countryLng = country.coordinates.lng;
    
    // نطاق العرض (تقريباً)
    const latRange = 8; // درجات
    const lngRange = 10;
    
    // حساب الموقع النسبي
    const x = 50 + ((lng - countryLng) / lngRange) * 40;
    const y = 50 - ((lat - countryLat) / latRange) * 40;
    
    return { x: Math.max(10, Math.min(90, x)), y: Math.max(15, Math.min(85, y)) };
  };

  return (
    <>
      <Helmet>
        <title>{country.nameAr} - اكتشف جمال {country.nameAr} | ترافليون للسياحة</title>
        <meta name="description" content={`رحلات سياحية إلى ${country.nameAr}: ${country.description}. احجز الآن مع ترافليون واستمتع بأفضل العروض.`} />
        <meta property="og:title" content={`${country.nameAr} - ترافليون للسياحة`} />
        <meta property="og:description" content={country.description} />
        <meta property="og:image" content={country.coverImage} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Nav3D />
        <MobileNav />
        
        {/* Hero Section - Immersive Full Screen */}
        <section className="relative h-screen overflow-hidden">
          {/* Background Image with Parallax Effect */}
          <div className="absolute inset-0">
            <img
              src={country.coverImage}
              alt={country.nameAr}
              className="w-full h-full object-cover scale-110 animate-slow-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/40" />
          </div>

          {/* Floating Particles Effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 10}s`
                }}
              />
            ))}
          </div>

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 md:px-8">
              <div className="max-w-4xl">
                {/* Country Badge */}
                <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-sm font-bold">
                    <Sparkles className="w-4 h-4 mr-2" />
                    وجهة مميزة
                  </Badge>
                  <Badge variant="outline" className="border-white/30 text-white/80 px-4 py-2">
                    <Globe className="w-4 h-4 mr-2" />
                    جنوب شرق آسيا
                  </Badge>
                </div>

                {/* Title */}
                <div className="mb-6">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {country.nameAr}
                  </h1>
                  <p className="text-2xl md:text-3xl text-white/70 font-light animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {country.nameEn}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  {country.description}
                </p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-3 border border-white/20">
                    <MapPin className="w-5 h-5 text-amber-400" />
                    <span className="text-white font-medium">{country.cities.length} مدن سياحية</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-3 border border-white/20">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="text-white font-medium">4.8 تقييم المسافرين</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-3 border border-white/20">
                    <Users className="w-5 h-5 text-amber-400" />
                    <span className="text-white font-medium">+5000 مسافر سعيد</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white text-lg px-8 py-6 rounded-full font-bold shadow-2xl shadow-orange-500/30 group"
                    onClick={() => navigate('/booking')}
                  >
                    <Plane className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    احجز رحلتك الآن
                    <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full backdrop-blur-md"
                  >
                    <Heart className="w-5 h-5 ml-2" />
                    أضف للمفضلة
                  </Button>
                  <Button 
                    size="lg"
                    variant="ghost"
                    className="text-white hover:bg-white/10 text-lg px-6 py-6 rounded-full"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-8 h-14 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
              <div className="w-2 h-3 bg-white/60 rounded-full animate-scroll-down" />
            </div>
          </div>
        </section>

        {/* Quick Info Cards */}
        <section className="relative -mt-20 z-10 pb-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: DollarSign, label: 'العملة', value: country.currency, color: 'from-emerald-500 to-teal-500' },
                { icon: Globe, label: 'اللغة', value: country.language, color: 'from-blue-500 to-indigo-500' },
                { icon: Plane, label: 'التأشيرة', value: country.visa, color: 'from-violet-500 to-purple-500' },
                { icon: Calendar, label: 'أفضل موسم', value: country.bestSeason, color: 'from-amber-500 to-orange-500' },
                { icon: Sun, label: 'المناخ', value: country.climate, color: 'from-rose-500 to-pink-500' },
                { icon: Clock, label: 'مدة الرحلة', value: country.tripDuration, color: 'from-cyan-500 to-blue-500' }
              ].map((item, index) => (
                <Card 
                  key={index}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 hover:bg-white/10 transition-all duration-500 group hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white/50 text-sm mb-1">{item.label}</p>
                  <p className="text-white font-bold text-sm leading-tight">{item.value}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="py-20 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-12">
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 px-4 py-2 mb-4">
                <Navigation className="w-4 h-4 mr-2" />
                خريطة تفاعلية
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                استكشف مدن <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">{country.nameAr}</span>
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                انقر على أي مدينة لاكتشاف معالمها السياحية والمزيد من المعلومات
              </p>
            </div>

            {/* Map Container */}
            <div className="relative max-w-5xl mx-auto">
              <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl overflow-hidden">
                {/* Map Background */}
                <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-900/30 via-slate-800/50 to-emerald-900/30">
                  {/* Grid Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>

                  {/* Country Shape Outline (Stylized) */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <div className="w-3/4 h-3/4 border-2 border-white/30 rounded-[100px] transform rotate-12" />
                  </div>

                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {country.cities.map((city, i) => {
                      const pos = getMapPosition(city.coordinates.lat, city.coordinates.lng);
                      const centerPos = getMapPosition(country.coordinates.lat, country.coordinates.lng);
                      return (
                        <line
                          key={`line-${city.id}`}
                          x1={`${centerPos.x}%`}
                          y1={`${centerPos.y}%`}
                          x2={`${pos.x}%`}
                          y2={`${pos.y}%`}
                          stroke={hoveredCity === city.id || activeCity === city.id ? '#fbbf24' : 'rgba(255,255,255,0.1)'}
                          strokeWidth={hoveredCity === city.id || activeCity === city.id ? 2 : 1}
                          strokeDasharray="5,5"
                          className="transition-all duration-300"
                        />
                      );
                    })}
                  </svg>

                  {/* Center Point (Capital/Main City) */}
                  <div 
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{ left: '50%', top: '50%' }}
                  >
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50 animate-pulse">
                        <MapPin className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <span className="text-white font-bold text-sm bg-slate-900/80 px-3 py-1 rounded-full">
                          {country.nameAr}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* City Markers */}
                  {country.cities.map((city) => {
                    const pos = getMapPosition(city.coordinates.lat, city.coordinates.lng);
                    const isActive = activeCity === city.id;
                    const isHovered = hoveredCity === city.id;
                    
                    return (
                      <div
                        key={city.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                        onMouseEnter={() => setHoveredCity(city.id)}
                        onMouseLeave={() => setHoveredCity(null)}
                        onClick={() => {
                          setActiveCity(city.id);
                          navigate(`/country/${country.id}/city/${city.id}`);
                        }}
                      >
                        {/* Marker */}
                        <div className="relative group">
                          {/* Pulse Effect */}
                          <div className={`absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75 ${isHovered || isActive ? 'scale-150' : ''}`} />
                          
                          {/* Main Marker */}
                          <div className={`relative w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg ${
                            isHovered || isActive 
                              ? 'bg-gradient-to-br from-amber-400 to-orange-500 scale-150 shadow-orange-500/50' 
                              : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/50'
                          }`}>
                            <MapPin className="w-3 h-3 text-white" />
                          </div>

                          {/* City Name Label */}
                          <div className={`absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap transition-all duration-300 ${
                            isHovered || isActive ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-1'
                          }`}>
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                              isHovered || isActive 
                                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                                : 'bg-white/10 text-white backdrop-blur-md'
                            }`}>
                              {city.nameAr}
                            </span>
                          </div>

                          {/* Hover Card */}
                          {(isHovered || isActive) && (
                            <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 z-30 animate-fade-in">
                              <Card className="bg-slate-900/95 backdrop-blur-xl border border-white/20 p-4 w-64 shadow-2xl rounded-2xl">
                                <img 
                                  src={city.image} 
                                  alt={city.nameAr}
                                  className="w-full h-32 object-cover rounded-xl mb-3"
                                />
                                <h4 className="text-white font-bold text-lg mb-1">{city.nameAr}</h4>
                                <p className="text-white/60 text-xs mb-2">{city.nameEn}</p>
                                <p className="text-white/80 text-sm mb-3 line-clamp-2">{city.description}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                                    <Star className="w-3 h-3 fill-amber-400" />
                                    <span>4.8</span>
                                  </div>
                                  <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-3 py-1 h-7 rounded-full">
                                    استكشف
                                    <ArrowRight className="w-3 h-3 mr-1" />
                                  </Button>
                                </div>
                              </Card>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Compass */}
                  <div className="absolute top-4 left-4 w-16 h-16 opacity-50">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="1" opacity="0.3"/>
                      <text x="50" y="15" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">N</text>
                      <text x="50" y="95" textAnchor="middle" fill="white" fontSize="12">S</text>
                      <text x="10" y="54" textAnchor="middle" fill="white" fontSize="12">W</text>
                      <text x="90" y="54" textAnchor="middle" fill="white" fontSize="12">E</text>
                    </svg>
                  </div>

                  {/* Coordinates Display */}
                  <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full">
                    <p className="text-white/60 text-xs font-mono">
                      {country.coordinates.lat.toFixed(4)}°N, {country.coordinates.lng.toFixed(4)}°E
                    </p>
                  </div>
                </div>

                {/* Cities Quick Nav - Single Row Extended */}
                <div className="mt-8 w-full">
                  <div className="flex flex-row gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
                    {country.cities.map((city, index) => (
                      <Button
                        key={city.id}
                        variant={activeCity === city.id ? "default" : "outline"}
                        className={`rounded-full transition-all duration-300 flex-shrink-0 min-w-[140px] py-3 px-4 text-sm font-semibold whitespace-nowrap ${
                          activeCity === city.id
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none shadow-lg shadow-orange-500/30 scale-105'
                            : 'border-2 border-white/20 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/40 hover:scale-105'
                        }`}
                        onClick={() => {
                          setActiveCity(city.id);
                          navigate(`/country/${country.id}/city/${city.id}`);
                        }}
                      >
                        <MapPin className="w-4 h-4 ml-2 flex-shrink-0" />
                        <span className="truncate">{city.nameAr}</span>
                      </Button>
                    ))}
                  </div>
                  <p className="text-white/50 text-xs mt-4 text-center">
                    {country.cities.length} مدينة متاحة للاستكشاف - مرر أفقياً لرؤية المزيد
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Country Highlights */}
        <section className="py-20 bg-gradient-to-b from-transparent via-white/5 to-transparent">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 px-4 py-2 mb-4">
                <Heart className="w-4 h-4 mr-2" />
                لماذا {country.nameAr}؟
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                أبرز ما يميز <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">{country.nameAr}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {country.highlights.map((highlight, index) => (
                <Card 
                  key={index}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                    ['from-amber-500 to-orange-500', 'from-blue-500 to-cyan-500', 'from-rose-500 to-pink-500', 'from-emerald-500 to-teal-500', 'from-violet-500 to-purple-500'][index % 5]
                  } flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    {[<Mountain />, <Waves />, <Building />, <Utensils />, <Camera />][index % 5]}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{highlight}</h3>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="relative overflow-hidden rounded-3xl">
              <div className="absolute inset-0">
                <img 
                  src={country.coverImage} 
                  alt={country.nameAr}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60" />
              </div>
              
              <div className="relative p-12 md:p-16 text-center">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                  جاهز لاستكشاف {country.nameAr}؟
                </h2>
                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                  احجز رحلتك الآن واستمتع بعروض حصرية على الطيران والفنادق مع ترافليون
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white text-lg px-10 py-7 rounded-full font-bold shadow-2xl shadow-orange-500/30"
                    onClick={() => navigate('/booking')}
                  >
                    <Plane className="w-6 h-6 ml-2" />
                    احجز رحلتك الآن
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/30 text-white hover:bg-white/10 text-lg px-10 py-7 rounded-full backdrop-blur-md"
                    onClick={() => navigate('/contact')}
                  >
                    تواصل معنا للاستشارة
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <PremiumFooter />
      </div>

      <style>{`
        @keyframes slow-zoom {
          0%, 100% { transform: scale(1.1); }
          50% { transform: scale(1.15); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.5; }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        @keyframes scroll-down {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }
        .animate-scroll-down {
          animation: scroll-down 1.5s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default PremiumCountryPage;
