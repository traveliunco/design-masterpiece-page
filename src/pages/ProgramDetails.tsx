import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, Users, MapPin, Star, Check, X, Phone, ArrowRight, Clock, Shield, Plane, Hotel, Globe, Loader2, Camera, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";
import { useSEO } from "@/hooks/useSEO";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/contexts/FavoritesContext";

interface ProgramData {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  program_type: string;
  duration_days: number;
  duration_nights: number;
  price: number; // alias for base_price
  base_price: number | null;
  original_price: number | null;
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
  itinerary: { day: number; title: string; description: string }[] | null;
  destination_id: string | null;
  destination?: { name_ar: string; cover_image: string } | null;
}

const typeLabels: Record<string, string> = {
  honeymoon: "شهر عسل",
  family: "عائلي",
  adventure: "مغامرة",
  cultural: "ثقافي",
  budget: "اقتصادي",
  luxury: "فاخر",
  beach: "شاطئي",
};

const ProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState<ProgramData | null>(null);
  const [loading, setLoading] = useState(true);
  const [travelers, setTravelers] = useState({ adults: 2, children: 0 });
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (id) loadProgram(id);
  }, [id]);

  const loadProgram = async (programId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("programs")
        .select(`
          *,
          destination:destinations(name_ar, cover_image)
        `)
        .eq("id", programId)
        .single();

      if (error) throw error;
      setProgram(data as unknown as ProgramData);
    } catch (error) {
      console.error("Error loading program:", error);
      toast.error("لم يتم العثور على البرنامج");
    } finally {
      setLoading(false);
    }
  };

  useSEO({
    title: program ? `${program.name_ar} - ترافليون` : "البرامج السياحية - ترافليون",
    description: program?.description_ar || "برامج سياحية متكاملة من ترافليون",
    keywords: program ? `${program.name_ar}, برنامج سياحي, ${(program.countries || []).join(', ')}` : "برامج سياحية",
  });

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-secondary mx-auto mb-4" />
            <p className="text-muted-foreground">جاري تحميل البرنامج...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!program) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Plane className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">لم يتم العثور على البرنامج</h2>
            <p className="text-muted-foreground mb-6">البرنامج المطلوب غير موجود أو تم حذفه</p>
            <Link to="/programs">
              <Button className="btn-luxury">العودة للبرامج</Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const includes = (program.includes as string[]) || [];
  const excludes = (program.excludes as string[]) || [];
  const itinerary = (program.itinerary as { day: number; title: string; description: string }[]) || [];
  const countries = (program.countries as string[]) || [];
  const highlights = (program.highlights as string[]) || [];
  const gallery = (program.gallery as string[]) || [];
  const originalPrice = program.original_price || program.base_price;
  const price = program.base_price || 0;
  const discount = originalPrice && originalPrice > price 
    ? Math.round((1 - price / originalPrice) * 100) 
    : 0;

  const totalPrice = price * travelers.adults + (price * 0.7 * travelers.children);
  const coverImage = program.cover_image || program.destination?.cover_image;

  const handleBooking = () => {
    const msg = `مرحباً، أرغب بحجز برنامج "${program.name_ar}" لعدد ${travelers.adults} بالغين${travelers.children > 0 ? ` و ${travelers.children} أطفال` : ""}. المبلغ الإجمالي: ${totalPrice.toLocaleString()} ر.س`;
    window.open(`https://api.whatsapp.com/send?phone=966569222111&text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
        {coverImage ? (
          <img src={coverImage} alt={program.name_ar} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center text-9xl">
            🗺️
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/60 to-transparent" />

        {/* Favorite Button on Hero */}
        <button
          onClick={() => {
            toggleFavorite({ id: program.id, type: 'offer', nameAr: program.name_ar, image: program.cover_image || undefined, price: program.base_price || program.price || 0, destination: program.destination?.name_ar || (program.countries || []).join('، ') });
            toast(isFavorite(program.id, 'offer') ? `تمت إزالة البرنامج من المفضلة` : `تمت إضافة البرنامج إلى المفضلة ❤️`);
          }}
          className={cn(
            "absolute top-24 left-6 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg",
            isFavorite(program.id, 'offer') ? 'bg-red-500 text-white scale-110' : 'bg-white/20 backdrop-blur-md text-white hover:bg-red-500 hover:scale-105'
          )}
          title="إضافة للمفضلة"
        >
          <Heart className={cn("w-5 h-5", isFavorite(program.id, 'offer') && 'fill-current')} />
        </button>
        
        <div className="absolute bottom-0 left-0 right-0 pb-16 z-10">
          <div className="container px-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/80 mb-4 text-sm">
              <Link to="/" className="hover:text-secondary transition-colors">الرئيسية</Link>
              <span>/</span>
              <Link to="/programs" className="hover:text-secondary transition-colors">البرامج</Link>
              <span>/</span>
              <span className="text-secondary font-semibold line-clamp-1">{program.name_ar}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
               <span className="bg-secondary/20 text-secondary backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold">
                {typeLabels[program.program_type] || program.program_type}
              </span>
              {program.is_featured && (
                <span className="bg-secondary text-white px-4 py-1.5 rounded-full text-sm font-bold">
                  ⭐ مميز
                </span>
              )}
              {discount > 0 && (
                <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-bold">
                  خصم {discount}%
                </span>
              )}
            </div>

            {/* Countries */}
            {countries.length > 0 && (
              <div className="flex items-center gap-2 text-white/90 mb-4">
                <Globe className="w-5 h-5 text-secondary" />
                <span className="text-lg font-semibold">{countries.join(" • ")}</span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">{program.name_ar}</h1>
            
            {/* Info Bar */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-secondary" />
                <span className="text-white font-semibold">{program.duration_days} أيام / {program.duration_nights} ليالي</span>
              </div>
              {program.average_rating && (
                <div className="flex items-center gap-2">
                   <Star className="w-5 h-5 text-secondary fill-secondary" />
                   <span className="text-white font-bold text-lg">{program.average_rating}</span>
                  <span className="text-white/70">({program.total_bookings || 0} حجز)</span>
                </div>
              )}
              {program.destination?.name_ar && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-secondary" />
                  <span className="text-white font-semibold">{program.destination.name_ar}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gradient-to-b from-background via-muted/30 to-background">
        <div className="container px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              
              {/* Description */}
              {program.description_ar && (
                <div className="card-3d p-8">
                   <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                      <Plane className="w-5 h-5 text-secondary" />
                    </div>
                    نظرة عامة
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">{program.description_ar}</p>
                </div>
              )}

              {/* Highlights */}
              {highlights.length > 0 && (
                <div className="card-3d p-8">
                   <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                      <Star className="w-5 h-5 text-secondary" />
                    </div>
                    أبرز المحطات
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {highlights.map((item: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-luxury-gold/5 rounded-xl border border-luxury-gold/10">
                        <div className="w-8 h-8 bg-luxury-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-luxury-gold" />
                        </div>
                        <span className="text-foreground font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Countries */}
              {countries.length > 1 && (
                <div className="card-3d p-8">
                   <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    الدول المشمولة ({countries.length} دول)
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {countries.map((country: string, i: number) => (
                      <div key={i} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl text-center border border-blue-100">
                        <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <span className="font-bold text-foreground">{country}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {gallery.length > 0 && (
                <div className="card-3d p-8">
                   <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                      <Camera className="w-5 h-5 text-purple-600" />
                    </div>
                    معرض الصور
                  </h2>
                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={gallery[activeGalleryIndex]}
                      alt={`صورة ${activeGalleryIndex + 1}`}
                      className="w-full h-80 object-cover rounded-2xl"
                    />
                    {gallery.length > 1 && (
                      <>
                        <button
                          onClick={() => setActiveGalleryIndex(prev => prev > 0 ? prev - 1 : gallery.length - 1)}
                          aria-label="الصورة السابقة"
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setActiveGalleryIndex(prev => prev < gallery.length - 1 ? prev + 1 : 0)}
                          aria-label="الصورة التالية"
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {gallery.map((_: string, i: number) => (
                            <button
                              key={i}
                              onClick={() => setActiveGalleryIndex(i)}
                              aria-label={`صورة ${i + 1}`}
                              className={cn(
                                "w-2.5 h-2.5 rounded-full transition-all",
                                i === activeGalleryIndex ? "bg-white w-6" : "bg-white/50"
                              )}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  {gallery.length > 1 && (
                    <div className="grid grid-cols-5 gap-2 mt-3">
                      {gallery.map((img: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => setActiveGalleryIndex(i)}                          aria-label={`معاينة الصورة ${i + 1}`}                          className={cn(
                            "rounded-lg overflow-hidden border-2 transition-all",
                            i === activeGalleryIndex ? "border-secondary" : "border-transparent opacity-60 hover:opacity-100"
                          )}
                        >
                          <img src={img} alt={`thumb-${i}`} className="w-full h-16 object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Includes */}
              {includes.length > 0 && (
                <div className="card-3d p-8">
                   <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    يشمل البرنامج
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {includes.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-green-50/50 rounded-xl border border-green-100">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                         <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Excludes */}
              {excludes.length > 0 && (
                <div className="card-3d p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                      <X className="w-5 h-5 text-red-500" />
                    </div>
                    لا يشمل البرنامج
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {excludes.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-red-50/50 rounded-xl border border-red-100">
                        <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerary */}
              {itinerary.length > 0 && (
                <div className="card-3d p-8">
                  <h2 className="text-2xl font-bold text-luxury-navy mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-luxury-teal/10 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-luxury-teal" />
                    </div>
                    برنامج الرحلة يوم بيوم
                  </h2>
                  <div className="space-y-6">
                    {itinerary.map((day, i) => (
                      <div key={i} className="relative border-r-4 border-luxury-teal pr-8 pb-6 last:pb-0">
                        {/* Timeline dot */}
                        <div className="absolute -right-[18px] top-0 w-8 h-8 bg-luxury-teal rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {day.day}
                        </div>
                        <div className="bg-luxury-cream/30 rounded-2xl p-5">
                          <h3 className="text-lg font-bold text-luxury-navy mb-2">
                            اليوم {day.day}: {day.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {day.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Booking Card */}
                <div className="card-3d p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-xl text-luxury-navy">احجز الآن</h3>
                    {discount > 0 && (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  {/* Price Display */}
                  <div className="bg-luxury-cream/50 rounded-2xl p-4 mb-6">
                    {discount > 0 && originalPrice && (
                      <p className="text-muted-foreground line-through text-sm">
                        {originalPrice.toLocaleString()} ر.س للشخص
                      </p>
                    )}
                    <p className="text-3xl font-bold text-luxury-teal">
                      {price.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">ر.س / للشخص</span>
                    </p>
                  </div>
                  
                  {/* Travelers */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block font-medium">عدد البالغين</label>
                      <select
                        value={travelers.adults}
                        onChange={(e) => setTravelers({...travelers, adults: Number(e.target.value)})}
                        aria-label="عدد البالغين"
                        className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-luxury-teal/50 focus:border-luxury-teal transition-all"
                      >
                        {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} بالغ</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block font-medium">عدد الأطفال</label>
                      <select
                        value={travelers.children}
                        onChange={(e) => setTravelers({...travelers, children: Number(e.target.value)})}
                        aria-label="عدد الأطفال"
                        className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-luxury-teal/50 focus:border-luxury-teal transition-all"
                      >
                        {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n} طفل</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">البالغين ({travelers.adults}×)</span>
                      <span className="font-medium">{(price * travelers.adults).toLocaleString()} ر.س</span>
                    </div>
                    {travelers.children > 0 && (
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">الأطفال ({travelers.children}× 70%)</span>
                        <span className="font-medium">{(price * 0.7 * travelers.children).toLocaleString()} ر.س</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-4 pt-3 border-t">
                      <span className="text-lg font-bold text-luxury-navy">الإجمالي</span>
                      <span className="text-2xl font-bold text-luxury-teal">{totalPrice.toLocaleString()} <span className="text-sm">ر.س</span></span>
                    </div>
                  </div>

                  <Button onClick={handleBooking} className="w-full btn-luxury py-6 text-lg rounded-xl mb-3">
                    احجز عبر واتساب
                  </Button>
                  
                  <a href={`https://api.whatsapp.com/send?phone=966569222111&text=${encodeURIComponent(`استفسار عن برنامج "${program.name_ar}"`)}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full py-5 rounded-xl border-luxury-teal text-luxury-teal hover:bg-luxury-teal/10">
                      <Phone className="w-5 h-5 ml-2" />
                      استفسار فقط
                    </Button>
                  </a>
                </div>

                {/* Why this program */}
                <div className="card-3d p-6">
                  <h3 className="font-bold text-luxury-navy mb-4">لماذا هذا البرنامج؟</h3>
                  <ul className="space-y-3">
                    {[
                      { icon: Shield, text: "ضمان أفضل سعر" },
                      { icon: Clock, text: "إلغاء مجاني حتى 14 يوم" },
                      { icon: Users, text: "دليل سياحي محترف" },
                      { icon: Check, text: "برنامج شامل ومتكامل" },
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-luxury-teal/10 rounded-lg flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-luxury-teal" />
                        </div>
                        <span className="text-sm font-medium">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Program Info Summary */}
                <div className="card-3d p-6">
                  <h3 className="font-bold text-luxury-navy mb-4">معلومات البرنامج</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">المدة</span>
                      <span className="font-medium">{program.duration_days} أيام / {program.duration_nights} ليالي</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">النوع</span>
                      <span className="font-medium">{typeLabels[program.program_type] || program.program_type}</span>
                    </div>
                    {countries.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">الدول</span>
                        <span className="font-medium">{countries.length} دول</span>
                      </div>
                    )}
                    {program.destination?.name_ar && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">الوجهة</span>
                        <span className="font-medium">{program.destination.name_ar}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ProgramDetails;
