import { Link } from "react-router-dom";
import { 
  Plane, Hotel, MapPin, Car, FileText, Shield, 
  Heart, Tag, Calendar, Users, Clock, ArrowLeft,
  Sparkles, Star, CheckCircle
} from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

const services = [
  {
    id: "flights",
    title: "حجز الطيران",
    description: "احجز تذكرة طيرانك بأفضل الأسعار من خلال شبكتنا العالمية من شركات الطيران",
    icon: Plane,
    color: "from-blue-500 to-cyan-600",
    path: "/amadeus-flights",
    features: ["أسعار تنافسية", "حجز فوري", "دعم 24/7", "تأكيد سريع"],
    image: "✈️",
  },
  {
    id: "hotels",
    title: "الفنادق والمنتجعات",
    description: "اختر من بين آلاف الفنادق والمنتجعات الفاخرة حول العالم",
    icon: Hotel,
    color: "from-purple-500 to-pink-600",
    path: "/hotels",
    features: ["فنادق 5 نجوم", "أسعار مميزة", "إلغاء مجاني", "خدمة عملاء"],
    image: "🏨",
  },
  {
    id: "programs",
    title: "البرامج السياحية",
    description: "برامج سياحية متكاملة مصممة خصيصاً لتناسب احتياجاتك",
    icon: MapPin,
    color: "from-emerald-500 to-teal-600",
    path: "/programs",
    features: ["برامج مخصصة", "مرشد سياحي", "نقل مريح", "أماكن مميزة"],
    image: "🗺️",
  },
  {
    id: "honeymoon",
    title: "رحلات شهر العسل",
    description: "باقات رومانسية مميزة تجعل شهر عسلك تجربة لا تُنسى",
    icon: Heart,
    color: "from-rose-500 to-pink-600",
    path: "/honeymoon",
    features: ["تزيين الغرفة", "عشاء رومانسي", "جلسة تصوير", "سبا للزوجين"],
    image: "💑",
  },
  {
    id: "car-rental",
    title: "تأجير السيارات",
    description: "استأجر سيارتك المفضلة واستمتع بحرية التنقل في وجهتك",
    icon: Car,
    color: "from-orange-500 to-red-600",
    path: "/car-rental",
    features: ["أحدث الموديلات", "أسعار شاملة", "تأمين كامل", "توصيل مجاني"],
    image: "🚗",
  },
  {
    id: "visas",
    title: "خدمات التأشيرات",
    description: "نساعدك في إنهاء إجراءات التأشيرة بسرعة وسهولة",
    icon: FileText,
    color: "from-indigo-500 to-purple-600",
    path: "/visas",
    features: ["معالجة سريعة", "استشارات مجانية", "متابعة دقيقة", "خدمة VIP"],
    image: "📋",
  },
  {
    id: "insurance",
    title: "تأمين السفر",
    description: "سافر بأمان مع تغطية تأمينية شاملة لجميع حالات الطوارئ",
    icon: Shield,
    color: "from-teal-500 to-cyan-600",
    path: "/insurance",
    features: ["تغطية طبية", "فقدان الأمتعة", "إلغاء الرحلة", "إصدار فوري"],
    image: "🛡️",
  },
  {
    id: "offers",
    title: "العروض الخاصة",
    description: "عروض وخصومات حصرية على باقات سفر مختارة بعناية",
    icon: Tag,
    color: "from-amber-500 to-orange-600",
    path: "/offers",
    features: ["خصم حتى 25%", "عروض محدودة", "باقات شاملة", "دفع مرن"],
    image: "🏷️",
  },
];

const whyChooseUs = [
  { icon: Star, title: "خبرة 6 سنوات", desc: "في مجال السياحة والسفر" },
  { icon: Users, title: "+10,000 عميل", desc: "راضٍ عن خدماتنا" },
  { icon: Clock, title: "دعم 24/7", desc: "فريق دعم متاح دائماً" },
  { icon: CheckCircle, title: "ضمان الجودة", desc: "نضمن أفضل الخدمات" },
];

const Services = () => {
  useSEO({
    title: "خدماتنا - جميع خدمات السفر والسياحة",
    description: "اكتشف مجموعة واسعة من خدمات السفر: حجز طيران، فنادق، برامج سياحية، شهر العسل، تأجير سيارات، تأشيرات وتأمين سفر.",
    keywords: "خدمات سفر, حجز طيران, فنادق, برامج سياحية, شهر عسل, تأجير سيارات, تأشيرات, تأمين سفر",
  });

  return (
    <PageLayout>
      <PageHeader
        badge="كل ما تحتاجه لرحلتك"
        badgeIcon={<Sparkles className="w-4 h-4 text-luxury-gold" />}
        title="خدماتنا المتكاملة"
        subtitle="نوفر لك جميع خدمات السفر في مكان واحد لتجربة سفر سلسة ومريحة"
      />

      {/* Main Services Grid */}
      <section className="py-20 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Link
                key={service.id}
                to={service.path}
                className="group card-3d overflow-hidden hover:scale-[1.02] transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header with Gradient */}
                <div className={`h-40 bg-gradient-to-br ${service.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
                    <span className="text-6xl mb-2">{service.image}</span>
                    <service.icon className="w-8 h-8" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold text-luxury-navy mb-3 group-hover:text-luxury-teal transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-luxury-teal flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button className="w-full btn-luxury group-hover:shadow-glow-teal transition-all">
                    استكشف الخدمة
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-luxury-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-luxury-teal/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-luxury-gold/10 rounded-full blur-[100px]" />
        </div>
        <div className="container px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-section text-white mb-4">لماذا تختار ترافليون؟</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              نحن نقدم أكثر من مجرد خدمات سفر - نقدم تجربة متكاملة تضمن راحتك وسعادتك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="text-center glass-dark rounded-3xl p-8 hover:scale-105 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-luxury-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-luxury-gold" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-background to-luxury-cream/30">
        <div className="container px-4 text-center">
          <Calendar className="w-16 h-16 text-luxury-teal mx-auto mb-6" />
          <h2 className="text-section text-luxury-navy mb-4">جاهز للبدء؟</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            تواصل معنا الآن وابدأ في التخطيط لرحلتك القادمة مع فريق من الخبراء
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button className="btn-luxury px-10 py-5 text-lg">
                تواصل معنا
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
            <a href="https://api.whatsapp.com/send?phone=966569222111" target="_blank" rel="noopener noreferrer">
              <Button className="btn-gold px-10 py-5 text-lg">
                واتساب
              </Button>
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Services;
