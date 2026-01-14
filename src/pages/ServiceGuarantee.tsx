import { ShieldCheck, Award, ThumbsUp, CheckCircle2, BadgeCheck, Sparkles, Anchor, Gem } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSEO } from "@/hooks/useSEO";

const ServiceGuarantee = () => {
  useSEO({
    title: "ضمان الخدمة - سافر بقلب مطمئن",
    description: "ترافليون تضمن لك جودة فائقة ودعم متواصل وسعر عادل في كل رحلة. ميثاق الثقة والأمان.",
    keywords: "ضمان خدمة, جودة, دعم عملاء, ترافليون, سياحة مضمونة",
  });

  const promises = [
    { title: "ضمان الجودة الفائقة", icon: Award, desc: "نحن ننتقي الشركاء والفنادق بمعايير صارمة جداً لضمان تجربة لا تقل عن 5 نجوم." },
    { title: "ضمان الدعم المتواصل", icon: ThumbsUp, desc: "فريقنا معك في كل خطوة، ونلتزم بحل أي عائق يواجهك خلال أقل من ساعة واحدة." },
    { title: "ضمان السعر العادل", icon: Gem, desc: "نقدم لك أفضل قيمة مقابل السعر، مع شفافية كاملة في الرسوم وبدون أي تكاليف خفية." },
  ];

  const commitments = [
    "تعويض فوري في حال وجود أي تقصير في الخدمات المتفق عليها.",
    "تواصل مباشر مع الإدارة العليا للطلبات الخاصة والشكاوى.",
    "تحديثات مستمرة حول وضع الرحلة والتنبيهات الأمنية والمناخية.",
    "سرية تامة لبيانات العملاء وبرامجهم السياحية.",
  ];

  return (
    <PageLayout>
      <PageHeader
        badge="ميثاق الثقة والأمان"
        badgeIcon={<ShieldCheck className="w-4 h-4 text-luxury-gold" />}
        title="سافر بقلب مطمئن تماماً"
        subtitle="في ترافليون، الجودة ليست خياراً، بل هي الوعد الذي نقطعه لكل عميل. نحن لا نضمن رحلتك فحسب، بل نضمن سعادتك."
      />

      {/* The Promises */}
      <section className="py-20 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {promises.map((p, i) => (
              <div key={i} className={cn("card-3d p-10 group hover:scale-[1.02] transition-all duration-500 animate-reveal")} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="w-16 h-16 bg-luxury-teal/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-luxury-teal group-hover:text-white transition-all duration-500">
                  <p.icon className="w-8 h-8 text-luxury-teal group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-luxury-navy mb-4">{p.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Banner */}
      <section className="py-20 bg-luxury-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-luxury-teal/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-luxury-gold/10 rounded-full blur-[100px]" />
        </div>
        <div className="container px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center">
                  <Anchor className="w-6 h-6 text-luxury-navy" />
                </div>
                <h2 className="text-section text-white">التزامنا <span className="text-luxury-gold">الثابت</span></h2>
              </div>
              <div className="space-y-6">
                {commitments.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center group">
                    <div className="w-6 h-6 rounded-full border border-luxury-gold flex items-center justify-center flex-shrink-0 group-hover:bg-luxury-gold transition-colors">
                      <CheckCircle2 className="w-4 h-4 text-luxury-gold group-hover:text-luxury-navy" />
                    </div>
                    <p className="text-lg text-white/80 group-hover:text-white transition-all">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-luxury-gold/20 rounded-[3rem] blur-[80px] animate-pulse" />
              <div className="glass-dark rounded-3xl p-12 text-center space-y-8 relative z-10">
                <BadgeCheck className="w-24 h-24 text-luxury-gold mx-auto" />
                <h4 className="text-3xl font-bold text-white">ختم الثقة الذهبي</h4>
                <p className="text-white/60 leading-relaxed">
                  جميع رحلات ترافليون مغطاة بضمان الخدمة الذهبي الذي يضمن لك جودة كل ليلة تقضيها في رحلتك.
                </p>
                <Link to="/programs">
                  <Button className="w-full btn-gold py-6 text-lg font-bold">تصفح البرامج المضمونة</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Trust Note */}
      <section className="py-20 bg-gradient-to-b from-background to-luxury-cream/30 text-center">
        <div className="container px-4">
          <Sparkles className="w-12 h-12 text-luxury-gold mx-auto mb-8 opacity-60" />
          <h2 className="text-section text-luxury-navy mb-6">سفرك أمانة في أعناقنا</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نحن لا نكتفي ببيع الخدمة، بل نبني علاقة مبنية على الثقة والاحترام المتبادل. هدفنا أن تعود إلينا في كل رحلة قادمة.
          </p>
        </div>
      </section>
    </PageLayout>
  );
};

export default ServiceGuarantee;
