import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowLeft, Star, Calendar, Users, Building2, Heart } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { allCountries } from "@/data/destinations-data";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "sonner";

const filterOptions = ["الكل", "جنوب شرق آسيا", "الشرق الأوسط", "أوروبا"];

const DestinationsPage = () => {
  const [activeFilter, setActiveFilter] = useState("الكل");
  const { isFavorite, toggleFavorite } = useFavorites();

  useSEO({
    title: "الوجهات السياحية - الدول والمدن",
    description: "استكشف الدول والمدن السياحية حول العالم. ماليزيا، تايلاند، إندونيسيا، وتركيا. تعرف على أجمل المدن والمعالم السياحية.",
    keywords: "دول سياحية, مدن سياحية, ماليزيا, تركيا, تايلاند, إندونيسيا, مدن العالم",
  });

  const filteredCountries = useMemo(() => {
    // Basic mapping for regions since it's not explicitly in the data yet
    // defaults to all if "الكل"
    if (activeFilter === "الكل") return allCountries;
    
    return allCountries.filter(country => {
      if (activeFilter === "جنوب شرق آسيا") {
        return ["malaysia", "thailand", "indonesia", "philippines", "vietnam", "singapore"].includes(country.id);
      }
      if (activeFilter === "الشرق الأوسط" || activeFilter === "أوروبا") {
        return ["turkey"].includes(country.id); // Placing Turkey in both for now or based on user pref
      }
      return true;
    });
  }, [activeFilter]);

  return (
    <PageLayout>
      {/* Hero Section */}
      <PageHeader
        badge="اكتشف العالم"
        badgeIcon={<MapPin className="w-4 h-4 text-luxury-gold" />}
        title="الدول والمدن السياحية"
        subtitle="تصفح قائمة الدول والمدن السياحية التي نقدم خدماتنا فيها"
      />

      {/* Main Content */}
      <section className="py-20 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          {/* Filter Section */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-3">
              {filterOptions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={cn(
                    "px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300",
                    activeFilter === tag
                      ? "bg-luxury-teal text-white shadow-glow-teal"
                      : "bg-white text-luxury-navy/70 hover:bg-luxury-teal/10 border border-border"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
            
            {/* Results Count */}
            <div className="text-center mt-8">
              <p className="text-muted-foreground">
                عرض <span className="font-bold text-luxury-teal">{filteredCountries.length}</span> دولة
              </p>
            </div>
          </div>

          {/* Countries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCountries.map((country, index) => (
              <div
                key={country.id}
                className="group card-3d overflow-hidden animate-reveal flex flex-col bg-white rounded-3xl border border-white/50 shadow-sm hover:shadow-xl transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Country Image Link */}
                <Link to={`/country/${country.id}`} className="relative h-64 overflow-hidden block">
                  <img
                    src={country.coverImage}
                    alt={country.nameAr}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/90 via-luxury-navy/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-luxury-gold" />
                    <span className="text-white text-xs font-bold">{country.cities.length} مدينة</span>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite({ id: country.id, type: 'destination', nameAr: country.nameAr, image: country.coverImage });
                      toast(isFavorite(country.id, 'destination') ? `تمت إزالة ${country.nameAr} من المفضلة` : `تمت إضافة ${country.nameAr} إلى المفضلة ❤️`);
                    }}
                    className={cn(
                      "absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center transition-all z-10",
                      isFavorite(country.id, 'destination') ? 'bg-red-500 text-white scale-110' : 'bg-white/20 backdrop-blur-md text-white hover:bg-red-500'
                    )}
                    title="إضافة للمفضلة"
                  >
                    <Heart className={cn("w-4 h-4", isFavorite(country.id, 'destination') && 'fill-current')} />
                  </button>

                  {/* Country Name Overlay */}
                  <div className="absolute bottom-4 right-4 left-4">
                    <h3 className="text-3xl font-black text-white mb-1 group-hover:text-luxury-gold transition-colors">{country.nameAr}</h3>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-6 flex-1">
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
                      {country.description}
                    </p>
                    
                    {/* Cities Preview */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-luxury-navy uppercase tracking-wider opacity-70 flex items-center gap-2">
                        <Building2 className="w-3 h-3" />
                        أبرز المدن
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {country.cities.slice(0, 4).map((city) => (
                          <Link
                            key={city.id}
                            to={`/country/${country.id}/city/${city.id}`}
                            className="px-3 py-1.5 bg-gray-50 hover:bg-luxury-teal/10 hover:text-luxury-teal text-gray-600 text-xs rounded-lg transition-colors border border-gray-100"
                          >
                            {city.nameAr}
                          </Link>
                        ))}
                        {country.cities.length > 4 && (
                          <Link 
                            to={`/country/${country.id}`}
                            className="px-3 py-1.5 bg-gray-50 text-gray-400 text-xs rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            +{country.cities.length - 4}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <Link
                    to={`/country/${country.id}`}
                    className="w-full py-4 rounded-xl btn-luxury flex items-center justify-center gap-2 group/btn"
                  >
                    <span>استكشف {country.nameAr}</span>
                    <ArrowLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-luxury-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-luxury-teal/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-luxury-gold/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="container px-4 relative z-10 text-center">
          <h2 className="text-section text-white mb-6">
            لم تجد وجهتك المفضلة؟
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            تواصل معنا وسنساعدك في التخطيط لرحلة مخصصة إلى أي مدينة في العالم
          </p>
          <Link to="/contact" className="btn-gold inline-flex items-center gap-3 px-10 py-5 text-lg">
            تواصل معنا
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default DestinationsPage;