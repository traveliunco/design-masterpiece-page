import { Link } from "react-router-dom";
import { Users, Target, Award, Globe, Heart, Shield, Star, CheckCircle, ArrowLeft } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import { useSEO } from "@/hooks/useSEO";

const About = () => {
  const stats = [
    { number: "4000+", label: "عميل سعيد" },
    { number: "120+", label: "فندق متعاون" },
    { number: "15+", label: "وجهة سياحية" },
    { number: "8+", label: "سنوات خبرة" },
  ];

  const values = [
    {
      icon: Heart,
      title: "الشغف بالسفر",
      description: "نؤمن أن السفر يغير الحياة ونسعى لجعل كل رحلة تجربة لا تُنسى",
    },
    {
      icon: Shield,
      title: "الموثوقية",
      description: "مرخصون من وزارة السياحة السعودية وملتزمون بأعلى معايير الجودة",
    },
    {
      icon: Users,
      title: "خدمة العملاء",
      description: "فريق دعم متواجد 24/7 لضمان راحة عملائنا في أي وقت",
    },
    {
      icon: Star,
      title: "التميز",
      description: "نختار أفضل الفنادق والخدمات لنقدم تجربة فاخرة لكل عميل",
    },
  ];

  const team = [
    { name: "فريق المبيعات", role: "حجوزات السفر", location: "السعودية" },
    { name: "فريق الدعم", role: "خدمة العملاء", location: "24/7" },
    { name: "فريق العمليات", role: "ماليزيا وتايلاند", location: "آسيا" },
    { name: "فريق التنسيق", role: "تركيا والقوقاز", location: "أوروبا" },
  ];

  useSEO({
    title: "من نحن - تعرف على ترافليون",
    description: "تعرف على ترافليون للسياحة - شريكك الموثوق لرحلات الأحلام منذ أكثر من 8 سنوات. 4000+ عميل سعيد وفريق محترف.",
    keywords: "ترافليون, من نحن, شركة سياحة, وكالة سفر, السعودية",
  });

  return (
    <PageLayout>
      {/* Hero Section */}
      <PageHeader
        badge="تعرف علينا"
        badgeIcon={<Users className="w-4 h-4 text-luxury-gold" />}
        title="من نحن"
        subtitle="ترافليون للسياحة والسفر - شريكك الموثوق لرحلات الأحلام منذ أكثر من 8 سنوات"
      />

      {/* Stats Section */}
      <section className="py-12 bg-luxury-teal relative">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionTitle
                badge="قصتنا"
                title="رحلة"
                highlight="النجاح"
                centered={false}
              />
              <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                <p>
                  بدأت ترافليون كحلم صغير في المدينة المنورة، انطلقنا بشغف كبير لتقديم
                  تجارب سفر استثنائية للعائلات السعودية الباحثة عن المتعة والاستجمام.
                </p>
                <p>
                  اليوم، نفخر بأننا أصبحنا من أبرز وكالات السفر في المملكة، مع فرق عمل
                  متواجدة في ماليزيا، تايلاند، إندونيسيا، تركيا، وجورجيا لضمان تقديم
                  أفضل خدمة لعملائنا.
                </p>
                <p>
                  نؤمن أن كل رحلة هي فرصة لصنع ذكريات لا تُنسى، ولهذا نحرص على اختيار
                  أفضل الفنادق، وتوفير سيارات خاصة، ومرشدين محترفين يتحدثون العربية.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="glass-premium rounded-3xl p-8 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-luxury-teal rounded-2xl flex items-center justify-center shadow-glow-teal">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-luxury-navy text-lg">رؤيتنا</h3>
                    <p className="text-muted-foreground">أن نكون الخيار الأول للمسافر السعودي</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-luxury-gold rounded-2xl flex items-center justify-center shadow-glow-gold">
                    <Globe className="w-7 h-7 text-luxury-navy" />
                  </div>
                  <div>
                    <h3 className="font-bold text-luxury-navy text-lg">رسالتنا</h3>
                    <p className="text-muted-foreground">تقديم تجارب سفر فاخرة بأسعار منافسة</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-luxury-navy rounded-2xl flex items-center justify-center">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-luxury-navy text-lg">التزامنا</h3>
                    <p className="text-muted-foreground">رضا العميل هو أولويتنا القصوى</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-luxury-cream/50">
        <div className="container px-4">
          <SectionTitle
            badge="قيمنا"
            title="ما يميزنا"
            highlight="عن غيرنا"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="card-3d p-8 text-center"
              >
                <div className="w-16 h-16 bg-luxury-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-luxury-teal" />
                </div>
                <h3 className="text-title text-luxury-navy mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gradient-to-b from-background to-luxury-cream/30">
        <div className="container px-4">
          <SectionTitle
            badge="فريقنا"
            title="فريق عمل"
            highlight="محترف"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="glass-premium rounded-3xl p-8 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-luxury-teal to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-teal">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-bold text-luxury-navy text-lg mb-1">{member.name}</h3>
                <p className="text-luxury-teal font-medium mb-1">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-luxury-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-luxury-teal/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-luxury-gold/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="container px-4 relative z-10">
          <h2 className="text-section text-white text-center mb-12">
            اعتماداتنا وشراكاتنا
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {[
              "مرخصة من وزارة السياحة",
              "معروف - التجارة السعودية",
              "تابي للتقسيط",
              "تمارا للتقسيط",
            ].map((cert, index) => (
              <div
                key={index}
                className="flex items-center gap-3 glass-dark px-6 py-4 rounded-full"
              >
                <CheckCircle className="w-5 h-5 text-luxury-gold" />
                <span className="text-white font-medium">{cert}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/contact" className="btn-gold inline-flex items-center gap-3 px-10 py-5 text-lg">
              تواصل معنا
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
