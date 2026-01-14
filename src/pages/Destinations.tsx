import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowLeft, Star, Calendar, Users, Filter } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import ContentCard from "@/components/ui/ContentCard";
import { destinations } from "@/data/destinations";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";

const filterOptions = ["الكل", "جنوب شرق آسيا", "أوروبا وآسيا", "القوقاز", "المحيط الهندي"];

const DestinationsPage = () => {
  const [activeFilter, setActiveFilter] = useState("الكل");

  useSEO({
    title: "الوجهات السياحية - اكتشف أجمل الوجهات حول العالم",
    description: "اكتشف أجمل الوجهات السياحية مع ترافليون. ماليزيا، تركيا، تايلاند، إندونيسيا، المالديف، جورجيا وأذربيجان. برامج متنوعة وأسعار تناسب الجميع.",
    keywords: "وجهات سياحية, ماليزيا, تركيا, تايلاند, إندونيسيا, المالديف, جورجيا, أذربيجان, سفر",
  });

  const filteredDestinations = useMemo(() => {
    if (activeFilter === "الكل") return destinations;
    return destinations.filter(d => d.region === activeFilter);
  }, [activeFilter]);

  return (
    <PageLayout>
      {/* Hero Section */}
      <PageHeader
        badge="اكتشف العالم معنا"
        badgeIcon={<MapPin className="w-4 h-4 text-luxury-gold" />}
        title="الوجهات السياحية"
        subtitle="اختر وجهتك المفضلة من بين أجمل الوجهات السياحية حول العالم واستمتع برحلة لا تُنسى"
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
                عرض <span className="font-bold text-luxury-teal">{filteredDestinations.length}</span> وجهة
                {activeFilter !== "الكل" && (
                  <span> في <span className="font-bold text-luxury-navy">{activeFilter}</span></span>
                )}
              </p>
            </div>
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination, index) => (
              <Link
                to={`/destinations/${destination.id}`}
                key={destination.id}
                className="group card-3d overflow-hidden animate-reveal"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/80 via-transparent to-transparent" />

                  {/* Region Tag */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-luxury-gold text-luxury-navy px-4 py-1.5 rounded-full text-xs font-bold">
                      {destination.region}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 left-4 glass-dark rounded-full px-3 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-luxury-gold fill-luxury-gold" />
                    <span className="text-white text-xs font-bold">{destination.rating}</span>
                  </div>

                  {/* Destination Info Overlay */}
                  <div className="absolute bottom-4 right-4 left-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{destination.name}</h3>
                    <p className="text-white/70 text-sm line-clamp-2">{destination.description}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-white">
                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{destination.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{destination.groupSize}</span>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <span className="text-muted-foreground text-xs">ابتداءً من</span>
                      <div className="text-luxury-teal font-bold text-xl">{destination.price} ر.س</div>
                    </div>
                    <div className="flex items-center gap-2 text-luxury-teal font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>استكشف</span>
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredDestinations.length === 0 && (
            <div className="text-center py-20">
              <MapPin className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-luxury-navy mb-2">لا توجد وجهات</h3>
              <p className="text-muted-foreground">لم نجد وجهات في هذه المنطقة حالياً</p>
              <button
                onClick={() => setActiveFilter("الكل")}
                className="mt-4 btn-outline-luxury"
              >
                عرض جميع الوجهات
              </button>
            </div>
          )}
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
            تواصل معنا وسنساعدك في التخطيط لرحلة مخصصة إلى أي وجهة في العالم
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