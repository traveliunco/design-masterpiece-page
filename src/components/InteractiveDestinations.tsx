import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, TrendingUp, Heart, ArrowLeft, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { destinations } from "@/data/destinations";
import { cn } from "@/lib/utils";

const InteractiveDestinations = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const featuredDestinations = destinations.slice(0, 6);

  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_2px_2px,currentColor_1px,transparent_0)] bg-[size:48px_48px]" />

      {/* Floating Shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float [animation-delay:2s]" />

      <div className="container relative">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 bg-secondary/10 px-6 py-3 rounded-full">
            <Plane className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium text-secondary">وجهات مميزة</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold">
            استكشف
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-gold mx-3">
              العالم
            </span>
            معنا
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            اختر من بين أجمل الوجهات السياحية المصممة خصيصاً لتناسب جميع الأذواق والميزانيات
          </p>
        </div>

        {/* Destinations Grid with 3D Effect */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredDestinations.map((destination, index) => (
            <Link
              key={destination.id}
              to={`/destinations/${destination.id}`}
              className="group relative"
              onMouseEnter={() => setHoveredCard(destination.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div 
                className={cn(
                  "relative h-[450px] rounded-3xl overflow-hidden transition-all duration-700",
                  hoveredCard === destination.id ? "scale-105 shadow-2xl [perspective:1000px] [transform:rotateY(5deg)_translateZ(20px)]" : "scale-100 shadow-lg hover:shadow-xl",
                  index === 0 ? "[animation-delay:0s]" : index === 1 ? "[animation-delay:0.1s]" : "[animation-delay:0.2s]"
                )}
              >
                {/* Image */}
                <div className="absolute inset-0">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      hoveredCard === destination.id ? "scale-110" : "scale-100"
                    }`}
                  />
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ${
                    hoveredCard === destination.id
                      ? "from-foreground/90 via-foreground/50 to-transparent opacity-100"
                      : "from-foreground/80 via-foreground/40 to-transparent opacity-90"
                  }`} />
                </div>

                {/* Badge */}
                <div className="absolute top-6 right-6 z-10">
                  <div className={`px-4 py-2 rounded-full font-medium text-sm backdrop-blur-md transition-all duration-300 ${
                    destination.tag === "الأكثر طلباً" 
                      ? "bg-secondary text-secondary-foreground"
                      : destination.tag === "شهر عسل"
                      ? "bg-rose-500 text-white"
                      : destination.tag === "جديد"
                      ? "bg-green-500 text-white"
                      : "bg-gold text-white"
                  }`}>
                    {destination.tag}
                  </div>
                </div>

                {/* Favorite Button */}
                <button 
                  className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all z-10 group/heart"
                  aria-label="إضافة إلى المفضلة"
                  onClick={(e) => {
                    e.preventDefault();
                    // Add to favorites logic
                  }}
                >
                  <Heart className="w-5 h-5 text-white group-hover/heart:fill-rose-500 group-hover/heart:text-rose-500 transition-all" />
                </button>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                  {/* Region */}
                  <div className="flex items-center gap-2 text-primary-foreground/80 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{destination.region}</span>
                  </div>

                  {/* Title */}
                  <h3 className={`text-3xl font-bold text-primary-foreground mb-3 transition-all duration-300 ${
                    hoveredCard === destination.id ? "translate-y-0" : "translate-y-2"
                  }`}>
                    {destination.name}
                  </h3>

                  {/* Description */}
                  <p className={`text-primary-foreground/80 mb-4 line-clamp-2 transition-all duration-500 ${
                    hoveredCard === destination.id 
                      ? "opacity-100 translate-y-0 max-h-20" 
                      : "opacity-0 translate-y-4 max-h-0"
                  }`}>
                    {destination.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-primary-foreground/80">
                        <Star className="w-4 h-4 text-secondary fill-secondary" />
                        {destination.rating}
                      </span>
                      <span className="text-primary-foreground/60">
                        ({destination.reviewCount}+ تقييم)
                      </span>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className={`flex items-center justify-between transition-all duration-300 ${
                    hoveredCard === destination.id ? "translate-y-0 opacity-100" : "translate-y-4 opacity-80"
                  }`}>
                    <div>
                      <span className="text-xs text-primary-foreground/70">تبدأ من</span>
                      <div className="text-2xl font-bold text-secondary">
                        {destination.startPrice} ر.س
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-2 text-secondary font-medium transition-all ${
                      hoveredCard === destination.id ? "gap-4" : "gap-2"
                    }`}>
                      <span>استكشف الآن</span>
                      <ArrowLeft className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Programs Count */}
                  <div className={`mt-4 pt-4 border-t border-primary-foreground/20 transition-all duration-500 ${
                    hoveredCard === destination.id 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-4 max-h-0 overflow-hidden"
                  }`}>
                    <div className="flex items-center gap-2 text-primary-foreground/80">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">{destination.programs.length} برامج سياحية متاحة</span>
                    </div>
                  </div>
                </div>

                {/* Shine Effect */}
                <div 
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000",
                    hoveredCard === destination.id ? "translate-x-full" : "-translate-x-full"
                  )}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/destinations">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg rounded-full shadow-lg group"
            >
              عرض جميع الوجهات
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDestinations;
