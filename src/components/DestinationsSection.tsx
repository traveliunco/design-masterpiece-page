import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowLeft, Star, TrendingUp, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { destinations as staticDestinations, Destination } from "@/data/destinations";

const DestinationsSection = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data, error } = await supabase
          .from("destinations")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true })
          .limit(8);

        if (error) throw error;
        setDestinations(data || []);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading && destinations.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center bg-muted/30">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">جاري تحميل أروع الوجهات...</p>
      </div>
    );
  }
  return (
    <section className="py-24 md:py-32 bg-cream relative overflow-hidden">
      {/* Background Artistic Texture */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse [animation-delay:3s]" />
      </div>

      <div className="container relative z-10 px-4">
        {/* Section Master Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-3 bg-secondary/10 text-secondary-foreground px-6 py-2 rounded-full text-xs font-black tracking-[0.2em] uppercase border border-secondary/20">
              <Sparkles className="w-4 h-4 text-secondary" />
              مجموعة ترافليون الحصرية
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-primary leading-tight animate-reveal">
              وجهاتٌ <span className="text-secondary italic">تلامس</span> الروح
            </h2>
            <p className="text-primary/60 text-xl md:text-2xl font-medium leading-relaxed max-w-2xl">
              من شواطئ المالديف الفيروزية إلى قمم جورجيا الشاهقة، نأخذك في رحلة تتجاوز حدود المكان والزمان
            </p>
          </div>
          
          <Link
            to="/destinations"
            className="group flex items-center gap-4 bg-primary text-white px-10 py-6 rounded-2xl font-black text-lg transition-all duration-500 hover:shadow-luxury hover:-translate-y-2"
          >
            استعرض الكل
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
          </Link>
        </div>

        {/* Global Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((destination, index) => (
            <Link
              to={`/destinations/${destination.slug}`}
              key={destination.id}
              className={cn(
                "group relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-700 hover:-translate-y-6",
                (index % 4) === 0 ? "animate-reveal" : (index % 4) === 1 ? "animate-reveal reveal-delay-1" : (index % 4) === 2 ? "animate-reveal reveal-delay-2" : "animate-reveal reveal-delay-3"
              )}
            >
              {/* Cinematic Image Background */}
              <img
                src={destination.cover_image || "/placeholder.jpg"}
                alt={destination.name_ar}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />

              {/* Luxury Gradient Veil */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

              {/* Status & Rating Labels */}
              <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-30">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-2">
                  <Star className="w-4 h-4 text-secondary fill-secondary" />
                  <span className="text-white text-xs font-black">{destination.average_rating || "5.0"}</span>
                </div>
                {destination.is_featured && (
                  <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-gold animate-pulse">
                    مميز جداً
                  </div>
                )}
              </div>

              {/* Dynamic Content Panel */}
              <div className="absolute bottom-0 left-0 right-0 p-10 text-white z-30">
                <div className="flex items-center gap-2 mb-4 text-secondary">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-black tracking-widest uppercase">{destination.region_ar || "عالمي"}</span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-black mb-4 group-hover:text-secondary transition-colors duration-500">
                  {destination.name_ar}
                </h3>
                
                <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-4 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">يبدأ العرض من</span>
                    <div className="text-2xl font-black text-secondary">
                      {destination.starting_price?.toLocaleString() || "3,999"} <span className="text-[10px] font-normal text-white/60">ر.س</span>
                    </div>
                  </div>
                  
                  <div className="w-12 h-12 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center transform group-hover:rotate-[360deg] transition-all duration-1000 shadow-gold">
                    <ArrowLeft className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;