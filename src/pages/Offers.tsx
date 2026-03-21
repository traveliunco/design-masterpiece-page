import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Tag, Clock, MapPin, Phone, Percent, Calendar, Flame, Zap, ArrowLeft,
  Loader2, Globe, Heart, Sparkles, Users, Timer, Star, Gift,
  ChevronLeft, Bot
} from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useSEO } from "@/hooks/useSEO";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "sonner";

interface OfferFromDB {
  id: string;
  title_ar: string;
  title_en: string | null;
  slug: string;
  offer_type: string;
  destination: string;
  cover_image: string | null;
  description_ar: string | null;
  original_price: number;
  discounted_price: number;
  discount_percentage: number;
  duration: string | null;
  includes: string[] | null;
  valid_until: string | null;
  is_hot: boolean;
  is_active: boolean;
  is_featured: boolean;
  countries: string[] | null;
  highlights: string[] | null;
  terms: string | null;
}

const offerTypes = [
  { id: "all", name: "الكل", icon: "🎯", color: "from-slate-500 to-slate-600" },
  { id: "seasonal", name: "موسمي", icon: "🌤️", color: "from-amber-500 to-orange-500" },
  { id: "flash", name: "فلاش", icon: "⚡", color: "from-red-500 to-rose-500" },
  { id: "honeymoon", name: "شهر عسل", icon: "💕", color: "from-pink-500 to-rose-400" },
  { id: "family", name: "عائلي", icon: "👨‍👩‍👧‍👦", color: "from-blue-500 to-cyan-500" },
  { id: "lastminute", name: "لحظة أخيرة", icon: "⏰", color: "from-red-600 to-red-500" },
  { id: "earlybird", name: "حجز مبكر", icon: "🐣", color: "from-green-500 to-emerald-500" },
  { id: "group", name: "مجموعات", icon: "👥", color: "from-violet-500 to-purple-500" },
  { id: "weekend", name: "نهاية أسبوع", icon: "🏖️", color: "from-teal-500 to-cyan-500" },
];

const getOfferTypeInfo = (type: string) => {
  return offerTypes.find(t => t.id === type) || offerTypes[0];
};

const getTimeRemaining = (validUntil: string | null) => {
  if (!validUntil) return null;
  const now = new Date();
  const end = new Date(validUntil);
  const diff = end.getTime() - now.getTime();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 30) return `${Math.floor(days / 30)} شهر`;
  if (days > 0) return `${days} يوم`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  return `${hours} ساعة`;
};

const Offers = () => {
  const [selectedType, setSelectedType] = useState("all");
  const [offers, setOffers] = useState<OfferFromDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useSEO({
    title: "عروض السفر الحصرية - خصومات تصل إلى 38%",
    description: "أقوى عروض السفر والسياحة من ترافليون. خصومات حصرية على أفضل الوجهات السياحية حول العالم.",
    keywords: "عروض سياحية, خصومات سفر, عروض ماليزيا, عروض تركيا, عروض تايلاند, عروض المالديف",
  });

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("special_offers")
        .select("*")
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("is_hot", { ascending: false })
        .order("discount_percentage", { ascending: false });

      if (error) throw error;
      setOffers((data || []) as OfferFromDB[]);
    } catch (error) {
      console.error("Error loading offers:", error);
      toast.error("حدث خطأ في تحميل العروض");
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = offers.filter((offer) => {
    if (selectedType !== "all" && offer.offer_type !== selectedType) return false;
    return true;
  });

  return (
    <PageLayout>
      <PageHeader
        badge="عروض حصرية لفترة محدودة"
        badgeIcon={<Zap className="w-4 h-4 text-luxury-gold" />}
        title="أقوى العروض"
        subtitle="استفد من خصومات تصل إلى 38% على أفضل الوجهات السياحية - العروض محدودة!"
      />

      {/* Animated Flash Sale Banner */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 py-4">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-30" />
          <div className="container px-4 relative">
            <div className="flex flex-wrap items-center justify-center gap-4 text-white">
              <Flame className="w-6 h-6 animate-bounce" />
              <span className="font-bold text-lg">🔥 عرض اليوم الحصري</span>
              <span className="bg-white/20 backdrop-blur-sm px-5 py-1.5 rounded-full font-bold text-sm border border-white/30">خصم إضافي 5% عند الحجز اليوم</span>
              <Flame className="w-6 h-6 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-gradient-to-b from-luxury-cream/50 to-transparent">
        <div className="container px-4">
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {offerTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-2xl transition-all duration-300 whitespace-nowrap font-medium text-sm",
                  selectedType === type.id
                    ? `bg-gradient-to-r ${type.color} text-white shadow-lg shadow-luxury-teal/20 scale-105`
                    : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:shadow-md border border-gray-100"
                )}
              >
                <span className="text-lg">{type.icon}</span>
                {type.name}
                {selectedType === type.id && type.id !== "all" && (
                  <span className="bg-white/25 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    {offers.filter(o => o.offer_type === type.id).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-12 bg-gradient-to-b from-background via-luxury-cream/20 to-background">
        <div className="container px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <div className="absolute inset-0 w-12 h-12 rounded-full bg-primary/10 animate-ping" />
              </div>
              <p className="text-muted-foreground mt-4">جاري تحميل العروض...</p>
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-6">
                <Gift className="w-12 h-12 text-muted-foreground/40" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">لا توجد عروض حالياً</h3>
              <p className="text-muted-foreground mb-6">تابعنا للحصول على أحدث العروض</p>
              {selectedType !== "all" && (
                <Button variant="outline" onClick={() => setSelectedType("all")} className="rounded-xl">
                  عرض جميع العروض
                </Button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredOffers.map((offer, index) => {
                const typeInfo = getOfferTypeInfo(offer.offer_type);
                const timeLeft = getTimeRemaining(offer.valid_until);
                const highlights = (offer.highlights as string[]) || [];
                const includes = (offer.includes as string[]) || [];

                return (
                  <div
                    key={offer.id}
                    className="group relative rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 animate-reveal"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onMouseEnter={() => setHoveredCard(offer.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Image Section */}
                    <div className="relative h-64 overflow-hidden">
                      {offer.cover_image ? (
                        <img
                          src={offer.cover_image}
                          alt={offer.title_ar}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-luxury-teal/20 to-luxury-gold/20 flex items-center justify-center text-6xl">
                          🏷️
                        </div>
                      )}
                      
                      {/* Dark Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* ====== Glassmorphism Type Badge ====== */}
                      <div className={cn(
                        "absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-2xl",
                        "bg-white/15 backdrop-blur-xl border border-white/25",
                        "shadow-[0_8px_32px_rgba(0,0,0,0.15)]",
                        "transition-all duration-300 group-hover:bg-white/25 group-hover:scale-105"
                      )}>
                        <span className="text-lg drop-shadow-lg">{typeInfo.icon}</span>
                        <span className="text-white font-bold text-sm drop-shadow-md">{typeInfo.name}</span>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                      </div>

                      {/* Hot Badge */}
                      {offer.is_hot && (
                        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-lg shadow-red-500/30 animate-pulse">
                          <Flame className="w-3.5 h-3.5" />عرض ساخن 🔥
                        </div>
                      )}

                      {/* Favorite Button - All Offers */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite({ id: offer.id, type: 'offer', nameAr: offer.title_ar, image: offer.cover_image || undefined, price: offer.discounted_price, destination: offer.destination });
                          toast(isFavorite(offer.id, 'offer') ? `تمت إزالة العرض من المفضلة` : `تمت إضافة العرض إلى المفضلة ❤️`);
                        }}
                        className={cn(
                          "absolute w-10 h-10 rounded-full flex items-center justify-center transition-all z-10",
                          offer.is_hot ? "top-16 left-4" : "top-4 left-4",
                          isFavorite(offer.id, 'offer') ? 'bg-red-500 text-white scale-110' : 'bg-white/20 backdrop-blur-md text-white hover:bg-red-500'
                        )}
                        title="إضافة للمفضلة"
                      >
                        <Heart className={cn("w-4 h-4", isFavorite(offer.id, 'offer') && 'fill-current')} />
                      </button>

                      {/* Discount Circle */}
                      <div className="absolute -bottom-6 left-6 w-16 h-16 bg-gradient-to-br from-luxury-gold to-yellow-400 rounded-full flex flex-col items-center justify-center shadow-xl shadow-luxury-gold/30 border-4 border-white z-10">
                        <span className="text-luxury-navy font-black text-lg leading-none">{offer.discount_percentage}%</span>
                        <span className="text-luxury-navy text-[8px] font-bold">خصم</span>
                      </div>

                      {/* Destination */}
                      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                        <MapPin className="w-3.5 h-3.5 text-white" />
                        <span className="text-white text-sm font-medium">{offer.destination}</span>
                      </div>

                      {/* Time Remaining */}
                      {timeLeft && (
                        <div className="absolute bottom-4 left-24 flex items-center gap-1.5 bg-red-500/80 backdrop-blur-sm px-3 py-1.5 rounded-xl">
                          <Timer className="w-3 h-3 text-white" />
                          <span className="text-white text-xs font-bold">متبقي {timeLeft}</span>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-6 pt-10">
                      {/* Title & Duration */}
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-xl text-luxury-navy group-hover:text-luxury-teal transition-colors leading-tight">
                          {offer.title_ar}
                        </h3>
                      </div>

                      {offer.duration && (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                          <Clock className="w-4 h-4" />
                          <span>{offer.duration}</span>
                        </div>
                      )}

                      {/* Description */}
                      {offer.description_ar && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                          {offer.description_ar}
                        </p>
                      )}

                      {/* Highlights */}
                      {highlights.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {highlights.slice(0, 3).map((h, idx) => (
                            <span key={idx} className="bg-luxury-teal/8 text-luxury-teal px-3 py-1 rounded-xl text-xs font-medium border border-luxury-teal/15">
                              {h}
                            </span>
                          ))}
                          {highlights.length > 3 && (
                            <span className="text-xs text-muted-foreground flex items-center">
                              +{highlights.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Includes */}
                      {includes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {includes.slice(0, 4).map((item, idx) => (
                            <span key={idx} className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-[11px] font-medium">
                              ✓ {item}
                            </span>
                          ))}
                          {includes.length > 4 && (
                            <span className="text-[11px] text-muted-foreground flex items-center px-2">
                              +{includes.length - 4} المزيد
                            </span>
                          )}
                        </div>
                      )}

                      {/* Valid Until */}
                      {offer.valid_until && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5 bg-amber-50 px-3 py-2 rounded-xl border border-amber-100">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          <span>صالح حتى: <strong className="text-amber-700">{new Date(offer.valid_until).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}</strong></span>
                        </div>
                      )}

                      {/* Price + Buttons Section */}
                      <div className="border-t pt-5">
                        <div className="flex items-end justify-between mb-4">
                          <div>
                            <span className="text-muted-foreground line-through text-sm block">{offer.original_price.toLocaleString()} ر.س</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-black text-luxury-teal">{offer.discounted_price.toLocaleString()}</span>
                              <span className="text-sm text-muted-foreground">ر.س</span>
                            </div>
                          </div>
                          <div className="bg-luxury-gold/10 px-3 py-1 rounded-full">
                            <span className="text-luxury-gold font-bold text-sm">وفر {(offer.original_price - offer.discounted_price).toLocaleString()} ر.س</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const typeInfo = getOfferTypeInfo(offer.offer_type);
                              const context = `أهلاً! أنا أساعدك في عرض "${offer.title_ar}" ${typeInfo.icon}\n\n🏷️ تفاصيل العرض:\n• النوع: ${typeInfo.name}\n• الوجهة: ${offer.destination}\n• المدة: ${offer.duration || 'غير محددة'}\n• السعر الأصلي: ${offer.original_price.toLocaleString()} ر.س\n• سعر العرض: ${offer.discounted_price.toLocaleString()} ر.س (خصم ${offer.discount_percentage}%)\n${offer.description_ar ? `\n📝 ${offer.description_ar.slice(0, 200)}` : ''}\n\nاسألني أي سؤال عن هذا العرض!`;
                              window.dispatchEvent(new CustomEvent("openAIChatWithContext", {
                                detail: { context, question: `أخبرني بالمزيد عن عرض ${offer.title_ar}` }
                              }));
                            }}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 text-purple-700 font-bold text-sm transition-all border border-purple-200/50 hover:border-purple-300 hover:shadow-md"
                            title="اسأل الذكاء الاصطناعي عن هذا العرض"
                          >
                            <Bot className="w-4 h-4" />
                            <span>اسأل الذكاء</span>
                          </button>
                          <a
                            href={`https://api.whatsapp.com/send?phone=966569222111&text=أريد حجز عرض: ${offer.title_ar} - ${offer.destination} - ${offer.discounted_price.toLocaleString()} ر.س`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:shadow-xl"
                          >
                            <Phone className="w-4 h-4" />
                            <span>احجز الآن</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Featured Ribbon */}
                    {offer.is_featured && (
                      <div className="absolute top-0 left-0 w-0 h-0 border-t-[60px] border-t-luxury-gold border-r-[60px] border-r-transparent z-10">
                        <Star className="absolute -top-[50px] left-[10px] w-5 h-5 text-luxury-navy fill-luxury-navy" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-luxury-navy via-luxury-navy/95 to-luxury-navy">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Gift className="w-8 h-8" />, value: offers.length.toString(), label: "عرض متاح" },
              { icon: <Percent className="w-8 h-8" />, value: `${Math.max(...offers.map(o => o.discount_percentage), 0)}%`, label: "أعلى خصم" },
              { icon: <Globe className="w-8 h-8" />, value: [...new Set(offers.flatMap(o => o.countries || []))].length.toString(), label: "وجهة" },
              { icon: <Users className="w-8 h-8" />, value: "+2,500", label: "عميل سعيد" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                <div className="text-luxury-gold mb-3 flex justify-center">{stat.icon}</div>
                <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-luxury-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luxury-teal/10 rounded-full blur-[200px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-luxury-gold/10 rounded-full blur-[150px]" />
        </div>
        <div className="container px-4 text-center relative z-10">
          <Sparkles className="w-16 h-16 text-luxury-gold mx-auto mb-6" />
          <h2 className="text-4xl font-black text-white mb-4">لم تجد العرض المناسب؟</h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            تواصل معنا وسنصمم لك عرضاً خاصاً يناسب ميزانيتك وتفضيلاتك
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://api.whatsapp.com/send?phone=966569222111&text=أريد عرض سفر مخصص" target="_blank" rel="noopener noreferrer">
              <Button className="btn-gold px-10 py-6 text-lg flex items-center gap-2 rounded-2xl font-bold">
                <Phone className="w-5 h-5" />واتساب
              </Button>
            </a>
            <Link to="/destinations">
              <Button className="bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-luxury-navy px-10 py-6 text-lg rounded-2xl font-bold flex items-center gap-2 transition-all">
                تصفح الوجهات<ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Offers;
