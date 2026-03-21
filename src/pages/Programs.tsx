import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plane, Calendar, MapPin, Users, Star, Clock, CheckCircle,
  Hotel, Car, UtensilsCrossed, Camera, Search, Heart, ArrowLeft,
  Loader2, Globe, Bot, Phone
} from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "sonner";

const programTypes = [
  { id: "all", name: "الكل", icon: "📋" },
  { id: "honeymoon", name: "شهر عسل", icon: "💕" },
  { id: "family", name: "عائلي", icon: "👨‍👩‍👧‍👦" },
  { id: "adventure", name: "مغامرات", icon: "🏔️" },
  { id: "cultural", name: "ثقافي", icon: "🏛️" },
  { id: "luxury", name: "فاخر", icon: "👑" },
  { id: "budget", name: "اقتصادي", icon: "💰" },
  { id: "beach", name: "شاطئي", icon: "🏖️" },
];

interface ProgramFromDB {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  program_type: string;
  duration_days: number;
  duration_nights: number;
  price?: number; // alias for base_price
  base_price: number | null;
  description_ar: string | null;
  description_en: string | null;
  cover_image: string | null;
  is_active: boolean;
  is_featured: boolean;
  average_rating: number | null;
  total_bookings: number | null;
  includes: string[] | null;
  excludes: string[] | null;
  highlights: string[] | null;
  countries: string[] | null;
  gallery: string[] | null;
  itinerary: any[] | null;
  original_price: number | null;
  destination_id: string | null;
  created_at: string;
  destination?: { name_ar: string } | null;
}

const Programs = () => {
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [programs, setPrograms] = useState<ProgramFromDB[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("programs")
        .select(`
          *,
          destination:destinations(name_ar)
        `)
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPrograms((data || []) as unknown as ProgramFromDB[]);
    } catch (error) {
      console.error("Error loading programs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrograms = programs.filter((program) => {
    if (selectedType !== "all" && program.program_type !== selectedType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesName = program.name_ar?.toLowerCase().includes(q) || program.name_en?.toLowerCase().includes(q);
      const matchesDest = program.destination?.name_ar?.toLowerCase().includes(q);
      const matchesCountries = (program.countries || []).some((c: string) => c.toLowerCase().includes(q));
      if (!matchesName && !matchesDest && !matchesCountries) return false;
    }
    return true;
  });

  const getTypeLabel = (type: string) => {
    const found = programTypes.find(t => t.id === type);
    return found ? found.name : type;
  };

  const getDiscountPercent = (program: ProgramFromDB) => {
    const price = program.base_price || program.price || 0;
    const original = program.original_price || 0;
    if (original && original > price && price > 0) {
      return Math.round((1 - price / original) * 100);
    }
    return 0;
  };

  return (
    <PageLayout>
      {/* Hero */}
      <PageHeader
        badge="برامج سياحية متكاملة"
        badgeIcon={<Plane className="w-4 h-4 text-secondary" />}
        title="البرامج السياحية"
        subtitle="برامج مصممة بعناية تشمل كل ما تحتاجه لرحلة مثالية"
      />

      {/* Filters */}
      <section className="py-8 -mt-16 relative z-20">
        <div className="container px-4">
          <div className="glass-premium rounded-3xl p-6 shadow-luxury">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن برنامج بالاسم أو الوجهة أو الدولة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-12 h-14 rounded-xl border-border"
                />
              </div>
              
              {/* Type Filter */}
              <div className="flex flex-wrap gap-2">
                {programTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "px-5 py-3 rounded-xl text-sm font-semibold transition-all",
                      selectedType === type.id
                        ? "bg-secondary text-white shadow-lg shadow-secondary/20"
                        : "bg-white text-foreground/70 hover:bg-secondary/10 border border-border"
                    )}
                  >
                    <span className="ml-2">{type.icon}</span>
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 bg-gradient-to-b from-background via-muted/30 to-background">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              تم العثور على <span className="font-bold text-secondary">{filteredPrograms.length}</span> برنامج
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <div className="absolute inset-0 w-12 h-12 rounded-full bg-primary/10 animate-ping" />
              </div>
              <p className="text-muted-foreground mt-4">جاري تحميل البرامج...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((program, index) => {
                const discount = getDiscountPercent(program);
                const originalPrice = program.original_price || program.base_price;
                const countries = (program.countries as string[]) || [];
                const highlights = (program.highlights as string[]) || [];

                return (
                  <Link
                    key={program.id}
                    to={`/programs/${program.id}`}
                    className="group card-3d overflow-hidden animate-reveal"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden bg-gradient-to-br from-secondary/20 to-accent/20">
                      {program.cover_image ? (
                        <img
                          src={program.cover_image}
                          alt={program.name_ar}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                          🗺️
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        {program.is_featured && (
                          <span className="bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold">
                            مميز
                          </span>
                        )}
                        <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                          {getTypeLabel(program.program_type)}
                        </span>
                      </div>

                      {/* Discount */}
                      {discount > 0 && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          خصم {discount}%
                        </div>
                      )}

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite({ id: program.id, type: 'offer', nameAr: program.name_ar, image: program.cover_image || undefined, price: program.base_price || program.price || 0, destination: program.destination?.name_ar || (program.countries || []).join('، ') });
                          toast(isFavorite(program.id, 'offer') ? `تمت إزالة البرنامج من المفضلة` : `تمت إضافة البرنامج إلى المفضلة ❤️`);
                        }}
                        className={cn(
                          "absolute w-10 h-10 rounded-full flex items-center justify-center transition-all z-10",
                          discount > 0 ? "top-14 left-4" : "top-4 left-4",
                          isFavorite(program.id, 'offer') ? 'bg-red-500 text-white scale-110' : 'bg-white/20 backdrop-blur-md text-white hover:bg-red-500'
                        )}
                        title="إضافة للمفضلة"
                      >
                        <Heart className={cn("w-4 h-4", isFavorite(program.id, 'offer') && 'fill-current')} />
                      </button>

                      {/* Duration */}
                      <div className="absolute bottom-4 right-4 glass-dark rounded-lg px-3 py-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-white" />
                        <span className="text-white text-sm">{program.duration_days} أيام / {program.duration_nights} ليالي</span>
                      </div>

                      {/* Countries */}
                      {countries.length > 0 && (
                        <div className="absolute bottom-4 left-4 glass-dark rounded-lg px-3 py-1 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-secondary" />
                          <span className="text-white text-xs">{countries.length} دول</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-lg text-foreground group-hover:text-secondary transition-colors line-clamp-1">
                          {program.name_ar}
                        </h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
                          <span className="font-bold text-sm">{program.average_rating || "جديد"}</span>
                        </div>
                      </div>

                      {/* Destination or Countries */}
                      <p className="text-muted-foreground text-sm flex items-center gap-1 mb-3">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        {countries.length > 0
                          ? countries.slice(0, 3).join(" • ") + (countries.length > 3 ? ` +${countries.length - 3}` : "")
                          : program.destination?.name_ar || "—"
                        }
                      </p>

                      {/* Highlights */}
                      {highlights.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {highlights.slice(0, 3).map((h: string, i: number) => (
                            <span key={i} className="text-xs bg-luxury-teal/10 text-luxury-teal px-2 py-1 rounded-md">
                              {h}
                            </span>
                          ))}
                          {highlights.length > 3 && (
                            <span className="text-xs text-muted-foreground px-2 py-1">
                              +{highlights.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          {discount > 0 && originalPrice && (
                            <span className="text-muted-foreground line-through text-sm">
                              {originalPrice.toLocaleString()} ر.س
                            </span>
                          )}
                          <div className="text-luxury-teal font-bold text-xl">
                            {(program.base_price || program.price || 0).toLocaleString()} ر.س
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-luxury-teal font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>التفاصيل</span>
                          <ArrowLeft className="w-4 h-4" />
                        </div>
                      </div>

                      {/* AI + WhatsApp Buttons */}
                      <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const context = `أهلاً! أنا أساعدك في برنامج "${program.name_ar}" 🌍\n\n📋 التفاصيل:\n• المدة: ${program.duration_days} أيام / ${program.duration_nights} ليالي\n• السعر: ${(program.base_price || 0).toLocaleString()} ر.س\n• الدول: ${(program.countries || []).join('، ')}\n${program.description_ar ? `\n📝 ${program.description_ar.slice(0, 150)}...` : ''}\n\nاسألني أي سؤال عن هذا البرنامج!`;
                            window.dispatchEvent(new CustomEvent("openAIChatWithContext", {
                              detail: { context, question: `أخبرني بالمزيد عن برنامج ${program.name_ar}` }
                            }));
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 text-purple-700 font-medium text-sm transition-all border border-purple-200/50 hover:border-purple-300"
                          title="اسأل الذكاء الاصطناعي"
                        >
                          <Bot className="w-4 h-4" />
                          <span>اسأل الذكاء</span>
                        </button>
                        <a
                          href={`https://api.whatsapp.com/send?phone=966569222111&text=أريد حجز برنامج: ${program.name_ar} - ${program.duration_days} أيام - ${(program.base_price || 0).toLocaleString()} ر.س`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium text-sm transition-all shadow-sm hover:shadow-md"
                        >
                          <Phone className="w-4 h-4" />
                          <span>احجز الآن</span>
                        </a>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {!loading && filteredPrograms.length === 0 && (
            <div className="text-center py-20">
              <Plane className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-luxury-navy mb-2">لم يتم العثور على برامج</h3>
              <p className="text-muted-foreground mb-4">جرب تغيير معايير البحث</p>
              <button
                onClick={() => { setSelectedType("all"); setSearchQuery(""); }}
                className="btn-outline-luxury"
              >
                عرض جميع البرامج
              </button>
            </div>
          )}
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-luxury-cream/50">
        <div className="container px-4">
          <SectionTitle
            badge="مزايا البرامج"
            title="ماذا تشمل"
            highlight="برامجنا؟"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Plane, label: "تذاكر الطيران", color: "from-blue-500 to-sky-500" },
              { icon: Hotel, label: "إقامة فندقية", color: "from-purple-500 to-violet-500" },
              { icon: Car, label: "المواصلات", color: "from-green-500 to-emerald-500" },
              { icon: Camera, label: "الجولات", color: "from-orange-500 to-amber-500" },
              { icon: UtensilsCrossed, label: "وجبات مختارة", color: "from-red-500 to-rose-500" },
              { icon: Users, label: "مرشد سياحي", color: "from-indigo-500 to-blue-500" },
              { icon: CheckCircle, label: "تأمين السفر", color: "from-teal-500 to-cyan-500" },
              { icon: Clock, label: "دعم 24/7", color: "from-pink-500 to-rose-500" },
            ].map((item, index) => (
              <div key={index} className="card-3d p-6 text-center">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <p className="font-semibold text-luxury-navy">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-luxury-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-luxury-teal/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-luxury-gold/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="container px-4 relative z-10 text-center">
          <h2 className="text-section text-white mb-6">
            لم تجد البرنامج المناسب؟
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            تواصل معنا وسنصمم لك برنامجاً خاصاً يناسب ميزانيتك واهتماماتك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://api.whatsapp.com/send?phone=966569222111" target="_blank" rel="noopener noreferrer">
              <button className="btn-gold px-10 py-5 text-lg">تواصل عبر واتساب</button>
            </a>
            <Link to="/contact">
              <button className="btn-outline-luxury px-10 py-5 text-lg text-white border-white/30 hover:bg-white hover:text-luxury-navy">
                أرسل استفسارك
              </button>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Programs;
