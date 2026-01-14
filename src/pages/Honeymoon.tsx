import { Link } from "react-router-dom";
import { Heart, Star, MapPin, Calendar, Phone, Sparkles, Gift, Camera, UtensilsCrossed, ArrowLeft } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/button";
import maldivesImg from "@/assets/maldives.jpg";
import thailandImg from "@/assets/thailand.jpg";
import indonesiaImg from "@/assets/indonesia.jpg";
import malaysiaImg from "@/assets/malaysia.jpg";
import { useSEO } from "@/hooks/useSEO";

const honeymoonPackages = [
  { id: "maldives", destination: "المالديف", title: "جنة العشاق", description: "استمتع بإقامة رومانسية في فيلا فوق الماء", image: maldivesImg, duration: "5 أيام / 4 ليالي", price: "12,999", features: ["فيلا فوق الماء", "عشاء رومانسي", "سبا للزوجين"], rating: 4.9 },
  { id: "bali", destination: "بالي - إندونيسيا", title: "سحر الجزيرة", description: "اكتشف جمال بالي مع أفخم المنتجعات", image: indonesiaImg, duration: "7 أيام / 6 ليالي", price: "8,999", features: ["منتجع 5 نجوم", "جولات طبيعية", "مساج بالي"], rating: 4.8 },
  { id: "phuket", destination: "بوكيت - تايلاند", title: "لؤلؤة أندامان", description: "شواطئ ذهبية في أجمل جزر تايلاند", image: thailandImg, duration: "6 أيام / 5 ليالي", price: "6,999", features: ["منتجع شاطئي", "جزر فاي فاي", "مساج تايلاندي"], rating: 4.7 },
  { id: "langkawi", destination: "لنكاوي - ماليزيا", title: "أرض الأساطير", description: "جزيرة الأحلام مع غابات استوائية", image: malaysiaImg, duration: "5 أيام / 4 ليالي", price: "5,499", features: ["منتجع فاخر", "تلفريك لنكاوي", "عشاء رومانسي"], rating: 4.8 },
];

const honeymoonFeatures = [
  { icon: Heart, title: "تزيين الغرفة", description: "ورود وشموع وديكور رومانسي" },
  { icon: Gift, title: "هدايا ترحيبية", description: "سلة فواكه وشوكولاتة" },
  { icon: UtensilsCrossed, title: "عشاء رومانسي", description: "عشاء خاص على الشاطئ" },
  { icon: Sparkles, title: "سبا للزوجين", description: "جلسة مساج واسترخاء" },
  { icon: Camera, title: "جلسة تصوير", description: "تصوير احترافي" },
  { icon: Star, title: "استقبال VIP", description: "استقبال خاص من المطار" },
];

const Honeymoon = () => {
  useSEO({
    title: "عروض شهر العسل - باقات رومانسية مميزة",
    description: "أجمل باقات شهر العسل مع ترافليون. المالديف، بالي، بوكيت، لنكاوي. تزيين الغرف، عشاء رومانسي، سبا للزوجين والمزيد.",
    keywords: "شهر عسل, عروس, زفاف, المالديف, بالي, رومانسي, سفر العرسان",
  });

  return (
    <PageLayout>
      <PageHeader
        badge="عروض شهر العسل"
        badgeIcon={<Heart className="w-4 h-4 text-rose-400 fill-rose-400" />}
        title="شهر عسل لا يُنسى"
        subtitle="ابدأ حياتكما الجديدة برحلة أحلام في أجمل الوجهات الرومانسية حول العالم"
      />

      {/* Features Section */}
      <section className="py-16 bg-rose-50/50">
        <div className="container px-4">
          <SectionTitle
            badge="خدماتنا"
            badgeIcon={<Heart className="w-4 h-4 text-rose-500" />}
            title="ماذا نقدم لكم في"
            highlight="شهر العسل"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {honeymoonFeatures.map((feature, index) => (
              <div key={index} className="card-3d p-4 text-center">
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-6 h-6 text-rose-500" />
                </div>
                <h3 className="font-bold text-luxury-navy text-sm mb-1">{feature.title}</h3>
                <p className="text-muted-foreground text-xs">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <SectionTitle
            badge="باقات مميزة"
            badgeIcon={<Sparkles className="w-4 h-4 text-luxury-gold" />}
            title="اختر"
            highlight="وجهتكما الرومانسية"
          />

          <div className="grid md:grid-cols-2 gap-8">
            {honeymoonPackages.map((pkg) => (
              <div key={pkg.id} className="group card-3d overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <img src={pkg.image} alt={pkg.destination} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/80 to-transparent" />
                  
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    <Heart className="w-3 h-3 fill-white" />شهر عسل
                  </div>
                  
                  <div className="absolute top-4 left-4 flex items-center gap-1 glass-dark px-3 py-1 rounded-full text-xs">
                    <Star className="w-3 h-3 text-luxury-gold fill-luxury-gold" /><span className="text-white">{pkg.rating}</span>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 glass-dark rounded-xl px-4 py-2">
                    <span className="text-xs text-white/70">تبدأ من</span>
                    <div className="text-xl font-bold text-white">{pkg.price} ر.س</div>
                  </div>
                </div>

                <div className="p-6 bg-white">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <MapPin className="w-4 h-4" /><span>{pkg.destination}</span>
                    <span className="mx-2">•</span>
                    <Calendar className="w-4 h-4" /><span>{pkg.duration}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-luxury-navy mb-2">{pkg.title}</h3>
                  <p className="text-muted-foreground mb-4">{pkg.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <span key={idx} className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-medium">{feature}</span>
                    ))}
                  </div>

                  <a href={`https://api.whatsapp.com/send?phone=966569222111&text=أريد الاستفسار عن باقة ${pkg.title}`} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full py-6 flex items-center justify-center gap-2">
                      <Phone className="w-5 h-5" />احجز الآن
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-rose-500 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-[100px]" />
        </div>
        <div className="container px-4 text-center relative z-10">
          <Heart className="w-16 h-16 text-white/30 mx-auto mb-6" />
          <h2 className="text-section text-white mb-4">لم تجد الباقة المناسبة؟</h2>
          <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">تواصل معنا وسنصمم لكم برنامج شهر عسل مخصص حسب رغباتكم</p>
          <a href="https://api.whatsapp.com/send?phone=966569222111&text=أريد تصميم برنامج شهر عسل مخصص" target="_blank" rel="noopener noreferrer">
            <Button className="bg-white text-rose-600 hover:bg-white/90 rounded-full px-10 py-6 text-lg font-bold">صمم رحلتك الخاصة</Button>
          </a>
        </div>
      </section>
    </PageLayout>
  );
};

export default Honeymoon;
