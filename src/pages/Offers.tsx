import { Link } from "react-router-dom";
import { Tag, Clock, MapPin, Phone, Percent, Calendar, Flame, Zap, ArrowLeft } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import malaysiaImg from "@/assets/malaysia.jpg";
import thailandImg from "@/assets/thailand.jpg";
import turkeyImg from "@/assets/turkey.jpg";
import georgiaImg from "@/assets/georgia.jpg";
import indonesiaImg from "@/assets/indonesia.jpg";
import { useSEO } from "@/hooks/useSEO";

const offers = [
  { id: "summer-malaysia", title: "عرض ماليزيا الصيفي", destination: "ماليزيا", image: malaysiaImg, originalPrice: "5,999", discountedPrice: "4,499", discount: "25%", duration: "7 أيام / 6 ليالي", includes: ["الإقامة", "المواصلات", "الإفطار", "الجولات"], validUntil: "31 يناير 2026", isHot: true },
  { id: "turkey-winter", title: "تركيا الشتوية", destination: "طرابزون - تركيا", image: turkeyImg, originalPrice: "4,999", discountedPrice: "3,999", discount: "20%", duration: "5 أيام / 4 ليالي", includes: ["الإقامة", "المواصلات", "الإفطار", "مرشد"], validUntil: "15 فبراير 2026", isHot: true },
  { id: "georgia-special", title: "جورجيا الاقتصادية", destination: "تبليسي - جورجيا", image: georgiaImg, originalPrice: "3,999", discountedPrice: "2,999", discount: "25%", duration: "6 أيام / 5 ليالي", includes: ["الإقامة", "المواصلات", "الإفطار", "الجولات"], validUntil: "28 فبراير 2026", isHot: false },
  { id: "thailand-romantic", title: "تايلاند الرومانسية", destination: "بوكيت - تايلاند", image: thailandImg, originalPrice: "7,499", discountedPrice: "5,999", discount: "20%", duration: "8 أيام / 7 ليالي", includes: ["الإقامة", "المواصلات", "الإفطار", "سبا"], validUntil: "10 فبراير 2026", isHot: true },
  { id: "bali-adventure", title: "مغامرة بالي", destination: "بالي - إندونيسيا", image: indonesiaImg, originalPrice: "6,999", discountedPrice: "5,499", discount: "21%", duration: "7 أيام / 6 ليالي", includes: ["الإقامة", "المواصلات", "الإفطار", "جولات"], validUntil: "20 فبراير 2026", isHot: false },
];

const Offers = () => {
  useSEO({
    title: "عروض السفر - خصومات تصل إلى 25%",
    description: "أقوى عروض السفر والسياحة من ترافليون. خصومات تصل إلى 25% على رحلات ماليزيا، تركيا، تايلاند وغيرها.",
    keywords: "عروض سياحية, خصومات سفر, عروض ماليزيا, عروض تركيا, عروض تايلاند",
  });

  return (
    <PageLayout>
      <PageHeader
        badge="عروض حصرية لفترة محدودة"
        badgeIcon={<Zap className="w-4 h-4 text-luxury-gold" />}
        title="أقوى العروض"
        subtitle="استفد من خصومات تصل إلى 25% على أفضل الوجهات السياحية - العروض محدودة!"
      />

      {/* Flash Sale Banner */}
      <section className="bg-luxury-gold py-4">
        <div className="container px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-luxury-navy">
            <Flame className="w-6 h-6 animate-pulse" />
            <span className="font-bold text-lg">عرض اليوم الحصري</span>
            <span className="bg-luxury-navy/10 px-4 py-1 rounded-full">خصم إضافي 5% عند الحجز اليوم</span>
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-20 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((offer) => (
              <div key={offer.id} className="group card-3d overflow-hidden">
                <div className="relative h-56 overflow-hidden">
                  <img src={offer.image} alt={offer.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/80 to-transparent" />

                  {offer.isHot && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                      <Flame className="w-3 h-3" />عرض ساخن
                    </div>
                  )}

                  <div className="absolute top-4 left-4 bg-luxury-gold text-luxury-navy px-3 py-1 rounded-full text-sm font-bold">
                    <Percent className="w-3 h-3 inline ml-1" />خصم {offer.discount}
                  </div>

                  <div className="absolute bottom-4 right-4 flex items-center gap-1 glass-dark px-3 py-1 rounded-full text-xs">
                    <MapPin className="w-3 h-3 text-white" /><span className="text-white">{offer.destination}</span>
                  </div>
                </div>

                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold text-luxury-navy mb-3">{offer.title}</h3>

                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                    <Clock className="w-4 h-4" /><span>{offer.duration}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {offer.includes.map((item, idx) => (
                      <span key={idx} className="bg-luxury-teal/10 text-luxury-teal px-2 py-1 rounded-lg text-xs">{item}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4" /><span>صالح حتى: {offer.validUntil}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-muted-foreground line-through text-lg">{offer.originalPrice} ر.س</span>
                    <span className="text-2xl font-bold text-luxury-teal">{offer.discountedPrice} ر.س</span>
                  </div>

                  <a href={`https://api.whatsapp.com/send?phone=966569222111&text=أريد الاستفسار عن ${offer.title}`} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full btn-luxury py-6 flex items-center justify-center gap-2">
                      <Phone className="w-5 h-5" />احجز العرض
                    </Button>
                  </a>
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
        <div className="container px-4 text-center relative z-10">
          <Tag className="w-16 h-16 text-luxury-gold mx-auto mb-6" />
          <h2 className="text-section text-white mb-4">لم تجد العرض المناسب؟</h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">تواصل معنا وسنجد لك أفضل عرض يناسب ميزانيتك</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://api.whatsapp.com/send?phone=966569222111" target="_blank" rel="noopener noreferrer">
              <Button className="btn-gold px-10 py-5 text-lg flex items-center gap-2"><Phone className="w-5 h-5" />واتساب</Button>
            </a>
            <Link to="/destinations">
              <Button className="btn-outline-luxury px-10 py-5 text-lg text-white border-white/30 hover:bg-white hover:text-luxury-navy flex items-center gap-2">
                تصفح الوجهات<ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Offers;
