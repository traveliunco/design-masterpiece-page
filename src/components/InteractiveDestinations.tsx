import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Globe, ArrowLeft } from "lucide-react";
import { southeastAsiaCountries } from "@/data/southeast-asia";
import { cn } from "@/lib/utils";

const InteractiveDestinations = () => {
  const [activeCountryId, setActiveCountryId] = useState(southeastAsiaCountries[0].id);
  const activeCountry = southeastAsiaCountries.find(c => c.id === activeCountryId) || southeastAsiaCountries[0];

  const getFlag = (id: string) => {
    const flags: Record<string, string> = {
      'malaysia': '🇲🇾', 'thailand': '🇹🇭', 'indonesia': '🇮🇩',
      'singapore': '🇸🇬', 'vietnam': '🇻🇳', 'philippines': '🇵🇭', 'turkey': '🇹🇷'
    };
    return flags[id] || '🌍';
  };

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50 relative">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-luxury-navy/5 px-5 py-2 rounded-full mb-6">
            <Globe className="w-4 h-4 text-luxury-teal" />
            <span className="text-sm font-bold text-luxury-navy">وجهاتنا المميزة</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-luxury-navy mb-6">
            استكشف <span className="text-luxury-teal">أجمل بقاع العالم</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            اختر وجهتك القادمة من بين أفضل الدول والمدن السياحية التي نغطيها بخدماتنا
          </p>
        </div>

        {/* Countries Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {southeastAsiaCountries.map((country) => (
            <button
              key={country.id}
              onClick={() => setActiveCountryId(country.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all duration-300",
                activeCountryId === country.id
                  ? "bg-luxury-navy text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              )}
            >
              <span>{getFlag(country.id)}</span>
              {country.nameAr}
            </button>
          ))}
        </div>

        {/* Active Country Info */}
        <div className="bg-luxury-navy rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {getFlag(activeCountryId)} اكتشف {activeCountry.nameAr}
              </h3>
              <p className="text-white/70">
                {activeCountry.id === 'thailand' ? "بلد الابتسامة والمعابد الذهبية والشواطئ الساحرة" : 
                 activeCountry.id === 'malaysia' ? "سحر الطبيعة والترفيه العائلي في قلب آسيا" :
                 "وجهة سياحية مميزة تنتظر استكشافك"}
              </p>
            </div>
            <Link 
              to={`/country/${activeCountryId}`}
              className="inline-flex items-center gap-2 bg-luxury-gold text-luxury-navy px-6 py-3 rounded-full font-bold hover:bg-luxury-gold/90 transition-colors"
            >
              عرض الكل
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeCountry.cities.map((city) => (
            <Link 
              key={city.id}
              to={`/country/${activeCountryId}/city/${city.id}`} 
              className="group block"
            >
              <div className="relative h-[360px] overflow-hidden rounded-2xl bg-gray-900 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                {/* Image */}
                <img
                  src={city.image}
                  alt={city.nameAr}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy via-luxury-navy/50 to-transparent" />
                
                {/* Rating Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-md">
                    <Star className="w-3.5 h-3.5 text-luxury-gold fill-luxury-gold" />
                    <span className="text-luxury-navy font-bold text-sm">4.9</span>
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <h4 className="text-2xl font-bold text-white mb-1">{city.nameAr}</h4>
                  <p className="text-white/70 text-sm mb-3">{city.nameEn}</p>
                  <p className="text-white/60 text-sm line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {city.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link 
            to="/destinations"
            className="inline-flex items-center gap-3 bg-luxury-navy text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-luxury-navy/90 transition-colors shadow-lg"
          >
            <Globe className="w-5 h-5" />
            اكتشف كافة الوجهات السياحية
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDestinations;
