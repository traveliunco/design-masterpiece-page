import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, Users, MapPin, Star, Check, Phone, ArrowRight, Clock, Shield, Plane, Hotel, Utensils, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";
import { useSEO } from "@/hooks/useSEO";
import { useState } from "react";
import { toast } from "sonner";

// Sample program data structure (would come from Supabase)
const samplePrograms = [
  {
    id: "1",
    name: "برنامج المالديف 7 ليالي",
    destination: "جزر المالديف",
    duration: "7 ليالي / 8 أيام",
    price: 12800,
    image: "🏝️",
    rating: 5.0,
    reviews: 89,
    description: "استمتع بإجازة أحلامك في جزر المالديف مع برنامج شامل يتضمن الإقامة الفاخرة والأنشطة المائية",
    includes: ["إقامة 7 ليالي في منتجع 5 نجوم", "وجبة الإفطار يومياً", "رحلات بحرية", "غوص وسنوركل", "تنقلات داخلية"],
    itinerary: [
      { day: 1, title: "الوصول والاستقبال", activities: ["استقبال في المطار", "التوصيل للمنتجع", "تسجيل الدخول", "عشاء ترحيبي"] },
      { day: 2, title: "استكشاف الجزيرة", activities: ["إفطار فاخر", "جولة في الجزيرة", "سنوركل", "عشاء رومانسي"] },
      { day: 3, title: "رحلة بحرية", activities: ["رحلة بحرية خاصة", "صيد الأسماك", "غداء على اليخت", "مشاهدة الدلافين"] },
    ],
    hotels: ["Conrad Maldives Rangali Island", "Anantara Dhigu Resort"],
  },
];

const ProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const program = samplePrograms.find(p => p.id === id) || samplePrograms[0];

  useSEO({
    title: `${program.name} - ترافليون`,
    description: program.description,
    keywords: `${program.destination}, برنامج سياحي, ${program.duration}`,
  });

  const [travelers, setTravelers] = useState({ adults: 2, children: 0 });
  const totalPrice = program.price * travelers.adults + (program.price * 0.7 * travelers.children);

  const handleBooking = () => {
    toast.success("تم إضافة البرنامج للحجز!");
    setTimeout(() => navigate("/booking"), 1500);
  };

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-teal/20 to-luxury-gold/20 flex items-center justify-center text-9xl">
          {program.image}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/95 via-luxury-navy/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 pb-16 z-10">
          <div className="container px-4">
            <div className="flex items-center gap-2 text-white/80 mb-4 text-sm">
              <Link to="/" className="hover:text-luxury-gold transition-colors">الرئيسية</Link>
              <span>/</span>
              <Link to="/programs" className="hover:text-luxury-gold transition-colors">البرامج</Link>
              <span>/</span>
              <span className="text-luxury-gold font-semibold">{program.name}</span>
            </div>
            <div className="flex items-center gap-3 text-white/90 mb-4">
              <MapPin className="w-6 h-6 text-luxury-gold" />
              <span className="text-lg font-semibold">{program.destination}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">{program.name}</h1>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-luxury-gold" />
                <span className="text-white font-semibold">{program.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-luxury-gold fill-luxury-gold" />
                <span className="text-white font-bold text-lg">{program.rating}</span>
                <span className="text-white/70">({program.reviews} تقييم)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <div className="card-3d p-8">
                <h2 className="text-3xl font-bold text-luxury-navy mb-6">نظرة عامة</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{program.description}</p>
              </div>

              {/* Includes */}
              <div className="card-3d p-8">
                <h2 className="text-3xl font-bold text-luxury-navy mb-6">مايشمله البرنامج</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {program.includes.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-luxury-cream/50 rounded-xl">
                      <Check className="w-5 h-5 text-luxury-teal flex-shrink-0 mt-0.5" />
                      <span className="text-luxury-navy">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itinerary */}
              <div className="card-3d p-8">
                <h2 className="text-3xl font-bold text-luxury-navy mb-6">برنامج الرحلة</h2>
                <div className="space-y-6">
                  {program.itinerary.map((day, i) => (
                    <div key={i} className="border-r-4 border-luxury-teal pr-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-luxury-teal rounded-full flex items-center justify-center text-white font-bold">
                          {day.day}
                        </div>
                        <h3 className="text-xl font-bold text-luxury-navy">{day.title}</h3>
                      </div>
                      <ul className="space-y-2 mr-13">
                        {day.activities.map((activity, j) => (
                          <li key={j} className="flex items-center gap-2 text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-luxury-teal rounded-full" />
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotels */}
              <div className="card-3d p-8">
                <h2 className="text-3xl font-bold text-luxury-navy mb-6">الفنادق المقترحة</h2>
                <div className="space-y-3">
                  {program.hotels.map((hotel, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-luxury-cream/50 rounded-xl">
                      <Hotel className="w-6 h-6 text-luxury-teal" />
                      <span className="font-semibold text-luxury-navy">{hotel}</span>
                      <Star className="w-4 h-4 text-luxury-gold fill-luxury-gold mr-auto" />
                      <Star className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
                      <Star className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
                      <Star className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
                      <Star className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="card-3d p-6">
                  <h3 className="font-bold text-luxury-navy mb-6">احجز الآن</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">البالغين</label>
                      <select value={travelers.adults} onChange={(e) => setTravelers({...travelers, adults: Number(e.target.value)})} className="w-full p-3 border rounded-xl">
                        {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">الأطفال</label>
                      <select value={travelers.children} onChange={(e) => setTravelers({...travelers, children: Number(e.target.value)})} className="w-full p-3 border rounded-xl">
                        {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="border-t pt-6 mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">السعر للشخص</span>
                      <span className="font-semibold">{program.price.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-lg font-bold text-luxury-navy">الإجمالي</span>
                      <span className="text-3xl font-bold text-luxury-teal">{totalPrice.toLocaleString()} <span className="text-sm">ر.س</span></span>
                    </div>
                  </div>

                  <Button onClick={handleBooking} className="w-full btn-luxury py-6 text-lg rounded-xl mb-3">احجز الآن</Button>
                  
                  <a href="https://api.whatsapp.com/send?phone=966569222111" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full py-6 rounded-xl border-luxury-teal text-luxury-teal hover:bg-luxury-teal/10">
                      <Phone className="w-5 h-5 ml-2" />
                      استفسار عبر واتساب
                    </Button>
                  </a>
                </div>

                <div className="card-3d p-6">
                  <h3 className="font-bold text-luxury-navy mb-4">لماذا هذا البرنامج؟</h3>
                  <ul className="space-y-3">
                    {[
                      { icon: Shield, text: "ضمان أفضل سعر" },
                      { icon: Clock, text: "إلغاء مجاني حتى 14 يوم" },
                      { icon: Users, text: "دليل سياحي محترف" },
                      { icon: Plane, text: "تذاكر طيران مضمونة" },
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-luxury-teal" />
                        <span className="text-sm">{item.text}</span>
                      </li>
                    ))}
                  </ul>
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
