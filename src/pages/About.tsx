import { Link } from "react-router-dom";
import {
  Users, Target, Award, Globe, Heart, Shield, Star, CheckCircle,
  ArrowLeft, MapPin, Phone, Calendar, Plane, Sparkles, TrendingUp,
  Briefcase, Clock, MessageCircle
} from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import { useSEO } from "@/hooks/useSEO";

const About = () => {
  useSEO({
    title: "من نحن - تعرف على ترافليون للسياحة والسفر",
    description: "تعرف على ترافليون للسياحة - شريكك الموثوق لرحلات الأحلام منذ أكثر من 8 سنوات. 4000+ عميل سعيد ومقر رئيسي بالمدينة المنورة.",
    keywords: "ترافليون, من نحن, شركة سياحة, وكالة سفر, السعودية, المدينة المنورة",
  });

  const stats = [
    { number: "4,000+", label: "عميل سعيد", icon: Users },
    { number: "120+", label: "فندق شريك", icon: Briefcase },
    { number: "15+", label: "وجهة سياحية", icon: Globe },
    { number: "8+", label: "سنوات خبرة", icon: Calendar },
  ];

  const values = [
    { icon: Heart, title: "الشغف بالسفر", description: "نؤمن أن السفر يغير الحياة ونسعى لجعل كل رحلة تجربة لا تُنسى تُروى لأجيال", color: "from-rose-500 to-pink-600" },
    { icon: Shield, title: "الموثوقية والأمان", description: "مرخصون رسمياً من وزارة السياحة السعودية ومسجلون في منصة معروف التجارية", color: "from-teal-500 to-emerald-600" },
    { icon: Star, title: "التميز في الخدمة", description: "نختار أفضل الفنادق والطيران ونوفر مرشدين يتحدثون العربية في كل وجهة", color: "from-amber-500 to-orange-600" },
    { icon: Users, title: "فريق متخصص 24/7", description: "فريق دعم محترف متواجد على مدار الساعة عبر الواتساب والهاتف لخدمتك", color: "from-blue-500 to-indigo-600" },
  ];

  const milestones = [
    { year: "2016", title: "البداية", description: "انطلقنا من المدينة المنورة بحلم تقديم تجارب سفر فاخرة للعائلات السعودية" },
    { year: "2018", title: "التوسع", description: "افتتحنا فرق عمل في ماليزيا وتايلاند لضمان أفضل خدمة محلية لعملائنا" },
    { year: "2020", title: "التحول الرقمي", description: "أطلقنا منصتنا الإلكترونية المتطورة وخدمة الحجز الذكي أونلاين" },
    { year: "2022", title: "شراكات استراتيجية", description: "شراكة مع تابي وتمارا للتقسيط وأكثر من 120 فندق عالمي متعاون" },
    { year: "2024", title: "الريادة", description: "أصبحنا من أبرز وكالات السفر في المملكة مع 4000+ عميل راضٍ" },
    { year: "2025", title: "المستقبل", description: "توسع مستمر نحو وجهات جديدة وخدمات أكثر ابتكاراً وتميزاً" },
  ];

  const destinations = [
    { name: "ماليزيا", emoji: "🇲🇾", programs: "25+ برنامج" },
    { name: "تايلاند", emoji: "🇹🇭", programs: "20+ برنامج" },
    { name: "إندونيسيا", emoji: "🇮🇩", programs: "18+ برنامج" },
    { name: "تركيا", emoji: "🇹🇷", programs: "22+ برنامج" },
    { name: "جورجيا", emoji: "🇬🇪", programs: "15+ برنامج" },
    { name: "أذربيجان", emoji: "🇦🇿", programs: "12+ برنامج" },
    { name: "سنغافورة", emoji: "🇸🇬", programs: "10+ برنامج" },
    { name: "فيتنام", emoji: "🇻🇳", programs: "8+ برنامج" },
  ];

  const teams = [
    { name: "فريق المبيعات والحجوزات", role: "استشارات السفر وتنظيم الرحلات", location: "المدينة المنورة", icon: Phone },
    { name: "فريق الدعم والمتابعة", role: "خدمة 24/7 عبر واتساب وهاتف", location: "السعودية", icon: MessageCircle },
    { name: "فريق العمليات - آسيا", role: "تنسيق ماليزيا، تايلاند، إندونيسيا", location: "كوالالمبور", icon: Globe },
    { name: "فريق العمليات - أوروبا", role: "تنسيق تركيا، جورجيا، أذربيجان", location: "إسطنبول", icon: Plane },
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <PageHeader
        badge="تعرف علينا"
        badgeIcon={<Users className="w-4 h-4 text-luxury-gold" />}
        title="من نحن"
        subtitle="ترافليون للسياحة والسفر — شريكك الموثوق لرحلات الأحلام منذ 2016 من قلب المدينة المنورة إلى أجمل وجهات العالم"
      />

      {/* Stats Strip */}
      <section className="py-14 bg-gradient-to-br from-[hsl(175,84%,32%)] via-[hsl(180,70%,28%)] to-[hsl(185,84%,26%)] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-400/5 rounded-full blur-[100px]" />
        </div>
        <div className="container px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/70 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionTitle badge="قصتنا" title="رحلة" highlight="النجاح" centered={false} />
              <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                <p>
                  بدأت <strong className="text-luxury-navy">ترافليون</strong> كحلم صغير في <strong className="text-luxury-navy">المدينة المنورة</strong> عام 2016،
                  انطلقنا بشغف كبير لتقديم تجارب سفر استثنائية للعائلات السعودية الباحثة عن المتعة والاستجمام في أجمل بقاع العالم.
                </p>
                <p>
                  اليوم، نفخر بأننا أصبحنا من أبرز وكالات السفر في المملكة، مع فرق عمل محلية متواجدة في
                  <strong className="text-luxury-teal"> ماليزيا، تايلاند، إندونيسيا، تركيا، وجورجيا</strong> لضمان تقديم
                  أفضل خدمة لعملائنا بلغتهم وبما يناسب ثقافتهم.
                </p>
                <p>
                  نؤمن أن كل رحلة هي فرصة لصنع ذكريات لا تُنسى، ولهذا نحرص على اختيار أفضل الفنادق 4 و 5 نجوم،
                  وتوفير سيارات خاصة مع سائق، ومرشدين محترفين يتحدثون العربية، وبرامج مصممة خصيصاً لتناسب العائلات السعودية.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="glass-premium rounded-3xl p-8 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-luxury-navy text-lg">رؤيتنا</h3>
                    <p className="text-muted-foreground">أن نكون الخيار الأول للمسافر السعودي بتجارب سفر فاخرة ومتميزة</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Globe className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-luxury-navy text-lg">رسالتنا</h3>
                    <p className="text-muted-foreground">تقديم تجارب سفر فاخرة بأسعار منافسة مع خدمة عملاء استثنائية</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[hsl(222,47%,20%)] to-[hsl(222,47%,11%)] rounded-2xl flex items-center justify-center shadow-lg">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-luxury-navy text-lg">التزامنا</h3>
                    <p className="text-muted-foreground">رضا العميل هو أولويتنا القصوى — ضمان كامل على كل رحلة</p>
                  </div>
                </div>
              </div>
              {/* Location Card */}
              <div className="glass-premium rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="font-bold text-luxury-navy">المقر الرئيسي</p>
                  <p className="text-muted-foreground text-sm">حي الإسكان، شارع الهجرة — المدينة المنورة، المملكة العربية السعودية</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-luxury-cream/50">
        <div className="container px-4">
          <SectionTitle badge="قيمنا" title="ما يميزنا" highlight="عن غيرنا" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={i} className="card-3d p-8 text-center group">
                <div className={`w-16 h-16 bg-gradient-to-br ${v.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <v.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-title text-luxury-navy mb-3">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-gradient-to-b from-background to-luxury-cream/30">
        <div className="container px-4">
          <SectionTitle badge="مسيرتنا" title="محطات" highlight="النجاح" />
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Center Line */}
              <div className="absolute right-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-luxury-teal via-luxury-gold to-luxury-navy hidden md:block" />
              {milestones.map((m, i) => (
                <div key={i} className={`flex flex-col md:flex-row items-center gap-6 mb-12 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                  <div className="flex-1">
                    <div className={`card-3d p-6 ${i % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                      <span className="inline-block bg-luxury-teal/10 text-luxury-teal text-sm font-bold px-4 py-1 rounded-full mb-3">{m.year}</span>
                      <h3 className="font-bold text-luxury-navy text-lg mb-2">{m.title}</h3>
                      <p className="text-muted-foreground text-sm">{m.description}</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-luxury-teal to-emerald-600 flex items-center justify-center shadow-lg z-10 flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Destinations We Cover */}
      <section className="py-24 bg-luxury-cream/50">
        <div className="container px-4">
          <SectionTitle badge="وجهاتنا" title="نغطي أجمل" highlight="وجهات العالم" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {destinations.map((d, i) => (
              <div key={i} className="glass-premium rounded-2xl p-6 text-center group hover:shadow-lg transition-all duration-300 cursor-default">
                <span className="text-4xl block mb-3 group-hover:scale-125 transition-transform duration-300">{d.emoji}</span>
                <h4 className="font-bold text-luxury-navy mb-1">{d.name}</h4>
                <p className="text-xs text-luxury-teal font-medium">{d.programs}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-gradient-to-b from-background to-luxury-cream/30">
        <div className="container px-4">
          <SectionTitle badge="فريقنا" title="فريق عمل" highlight="محترف" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teams.map((t, i) => (
              <div key={i} className="glass-premium rounded-3xl p-8 text-center group hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-luxury-teal to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <t.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-bold text-luxury-navy text-lg mb-1">{t.name}</h3>
                <p className="text-luxury-teal font-medium text-sm mb-1">{t.role}</p>
                <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs">
                  <MapPin className="w-3 h-3" />
                  {t.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications + CTA */}
      <section className="py-24 bg-[hsl(222,47%,11%)] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(175,84%,32%)]/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-400/10 rounded-full blur-[120px]" />
        </div>
        <div className="container px-4 relative z-10">
          <h2 className="text-section text-white text-center mb-4">اعتماداتنا وشراكاتنا</h2>
          <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">نفخر بحصولنا على اعتمادات رسمية وشراكات استراتيجية تضمن لك تجربة سفر آمنة وموثوقة</p>
          <div className="flex flex-wrap justify-center items-center gap-4 mb-16">
            {[
              "مرخصة من وزارة السياحة",
              "مسجلة في منصة معروف",
              "تابي — اشترِ الآن وادفع لاحقاً",
              "تمارا — تقسيط بدون فوائد",
              "شريك 120+ فندق عالمي",
            ].map((cert, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 px-6 py-4 rounded-full hover:bg-white/10 transition-all duration-300">
                <CheckCircle className="w-5 h-5 text-amber-400" />
                <span className="text-white font-medium text-sm">{cert}</span>
              </div>
            ))}
          </div>

          <div className="text-center space-y-4">
            <Sparkles className="w-10 h-10 text-amber-400 mx-auto opacity-60" />
            <p className="text-white/50 italic text-lg">"نحن لا نبيع تذاكر، بل نصنع قصصاً تستحق أن تُروى."</p>
            <p className="text-amber-400 font-bold">إدارة ترافليون</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <Link to="/contact" className="btn-gold inline-flex items-center gap-3 px-10 py-5 text-lg">
              تواصل معنا
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <a href="https://api.whatsapp.com/send?phone=966569222111" target="_blank" rel="noopener noreferrer"
               className="btn-outline-luxury inline-flex items-center gap-3 px-10 py-5 text-lg !border-white !text-white hover:!bg-white/10">
              <MessageCircle className="w-5 h-5" />
              واتساب مباشر
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
