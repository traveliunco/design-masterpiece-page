import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Info, CheckCircle, Shield, Clock, Phone, Mail, Sparkles, Award, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "react-router-dom";

const ServiceInfo = () => {
  useSEO({
    title: "معلومات الخدمات - ترافليون",
    description: "تعرف على كيفية عمل خدماتنا وما يميزنا عن الآخرين",
    keywords: "معلومات الخدمات, كيف نعمل, خدمات ترافليون",
  });

  const howItWorks = [
    { step: "1", title: "اختر وجهتك", desc: "تصفح أكثر من 50 وجهة سياحية عالمية", icon: "🌍" },
    { step: "2", title: "اختر برنامجك", desc: "نوفر باقات جاهزة أو تخصيص كامل", icon: "📋" },
    { step: "3", title: "احجز وادفع", desc: "حجز فوري بطرق دفع متعددة ومرنة", icon: "💳" },
    { step: "4", title: "استمتع برحلتك", desc: "دعم 24/7 أثناء رحلتك", icon: "✈️" },
  ];

  const features = [
    { icon: Shield, title: "حماية كاملة", desc: "تأمين شامل وضمان أفضل الأسعار", color: "from-blue-500 to-cyan-600" },
    { icon: Clock, title: "حجز فوري", desc: "تأكيد فوري لجميع الحجوزات", color: "from-emerald-500 to-teal-600" },
    { icon: Users, title: "خدمة شخصية", desc: "مدير حسابات مخصص لك", color: "from-purple-500 to-pink-600" },
    { icon: TrendingUp, title: "أسعار تنافسية", desc: "أفضل الأسعار في السوق", color: "from-orange-500 to-red-600" },
  ];

  const whyChooseUs = [
    "خبرة 10+ سنوات في السياحة",
    "شراكات مع أفضل الفنادق عالمياً",
    "برامج مخصصة حسب رغبتك",
    "دعم فني على مدار الساعة",
    "ضمان أفضل سعر",
    "مرونة في التعديل والإلغاء",
  ];

  return (
    <PageLayout>
      <PageHeader
        badge="كيف نعمل"
        badgeIcon={<Info className="w-4 h-4 text-luxury-teal" />}
        title={<>معلومات <span className="text-gradient-teal">الخدمات</span></>}
        subtitle="تعرف على كيفية عمل خدماتنا وما يميزنا عن الآخرين"
      />

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-section text-luxury-navy mb-4">كيف تعمل خدماتنا؟</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">4 خطوات بسيطة لرحلة أحلامك</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {howItWorks.map((item, i) => (
              <div key={i} className="card-3d p-8 text-center hover:scale-105 transition-transform">
                <div className="text-6xl mb-4">{item.icon}</div>
                <div className="w-12 h-12 bg-luxury-teal rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-luxury-navy mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-luxury-cream/50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <Sparkles className="w-12 h-12 text-luxury-gold mx-auto mb-4" />
            <h2 className="text-section text-luxury-navy mb-4">ما يميزنا</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {features.map((feature, i) => (
              <div key={i} className="card-3d p-8 text-center hover:scale-105 transition-transform group">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-luxury-navy mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-b from-background to-luxury-cream/30">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-section text-luxury-navy mb-4">لماذا ترافليون؟</h2>
              <p className="text-lg text-muted-foreground">نجمع بين الخبرة والجودة والسعر المناسب</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {whyChooseUs.map((reason, i) => (
                <div key={i} className="flex items-center gap-3 p-5 bg-luxury-cream/50 rounded-xl border border-luxury-teal/20">
                  <CheckCircle className="w-6 h-6 text-luxury-teal flex-shrink-0" />
                  <span className="font-semibold text-luxury-navy">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-luxury-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-luxury-gold/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-luxury-teal/10 rounded-full blur-[100px]" />
        </div>
        <div className="container px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">إنجازاتنا بالأرقام</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { value: "10K+", label: "عميل سعيد" },
              { value: "50+", label: "وجهة سياحية" },
              { value: "1000+", label: "فندق شريك" },
              { value: "4.9/5", label: "تقييم العملاء" },
            ].map((stat, i) => (
              <div key={i} className="glass-dark rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-luxury-gold mb-2">{stat.value}</div>
                <div className="text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-b from-background to-luxury-cream/30">
        <div className="container px-4 text-center">
          <Award className="w-16 h-16 text-luxury-gold mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-luxury-navy mb-6">جاهز لبدء رحلتك؟</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            تصفح وجهاتنا واختر برنامجك المفضل
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/destinations">
              <Button className="btn-luxury px-12 py-6 text-lg rounded-full">استكشف الوجهات</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="px-12 py-6 text-lg rounded-full border-luxury-teal text-luxury-teal hover:bg-luxury-teal/10">
                <Phone className="w-5 h-5 ml-2" />
                تواصل معنا
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ServiceInfo;
