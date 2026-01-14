import { CreditCard, CheckCircle2, ShieldCheck, Clock, ArrowLeft, Sparkles } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSEO } from "@/hooks/useSEO";

const TabbyPage = () => {
  useSEO({
    title: "تقسيط تابي - سافر الآن وادفع لاحقاً",
    description: "قسّط رحلتك على 4 دفعات شهرية بدون فوائد أو رسوم إضافية مع تابي وترافليون.",
    keywords: "تابي, تقسيط, سفر, دفع لاحق, بدون فوائد",
  });

  const steps = [
    { title: "اختر وجهتك", desc: "تصفح برامجنا السياحية المتميزة واختر ما يناسبك" },
    { title: "الدفع بتابي", desc: "عند الدفع، اختر 'تابي' كخيار للدفع المفضل لديك" },
    { title: "قسّم دفعاتك", desc: "قسّم المبلغ على 4 دفعات شهرية بدون فوائد أو رسوم إضافية" },
    { title: "سافر بمتعة", desc: "استمتع برحلتك فوراً وادفع لاحقاً بكل راحة" },
  ];

  return (
    <PageLayout>
      <PageHeader
        badge="شريك ترافليون الرسمي"
        badgeIcon={<CreditCard className="w-4 h-4 text-emerald-400" />}
        title="سافر الآن وادفع لاحقاً مع تابي"
        subtitle="لا تدع الميزانية تعيق أحلامك. استمتع الآن بتقسيط رحلتك على 4 دفعات ميسرة بدون أي فوائد."
      />

      {/* Tabby Logo Banner */}
      <section className="py-12 -mt-10 relative z-20">
        <div className="container px-4">
          <div className="glass-premium rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" /> بدون فوائد
              </div>
              <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" /> بدون رسوم خفية
              </div>
              <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" /> موافقة فورية
              </div>
            </div>
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl font-black text-white">tabby</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <SectionTitle
            badge="كيف تعمل؟"
            badgeIcon={<Sparkles className="w-4 h-4 text-luxury-gold" />}
            title="4 خطوات تفصلك عن"
            highlight="رحلة أحلامك"
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className={cn("relative group card-3d p-8 text-center animate-reveal")} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="w-16 h-16 rounded-full bg-luxury-teal/10 flex items-center justify-center mx-auto mb-6 border border-luxury-teal/20 group-hover:bg-luxury-teal group-hover:text-white transition-all duration-500">
                  <span className="text-2xl font-bold text-luxury-teal group-hover:text-white">{i + 1}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-[2px] bg-gradient-to-r from-luxury-teal/30 to-transparent -translate-x-1/2" />
                )}
                <h3 className="text-xl font-bold text-luxury-navy mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Tabby */}
      <section className="py-20 bg-luxury-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-luxury-gold/10 rounded-full blur-[100px]" />
        </div>
        <div className="container px-4 relative z-10">
          <div className="glass-dark rounded-3xl p-12 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <h2 className="text-section text-white">ليه تختار تابي؟</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">حماية وأمان</h4>
                    <p className="text-sm text-white/60">بياناتك البنكية في أمان تام مع أنظمة تشفير عالمية</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">موافقة فورية</h4>
                    <p className="text-sm text-white/60">احصل على موافقة التقسيط في ثوانٍ معدودة</p>
                  </div>
                </div>
              </div>
              <a href="/programs">
                <Button className="btn-gold px-10 py-5 text-lg flex items-center gap-2">
                  ابدأ التخطيط لرحلتك <ArrowLeft className="w-5 h-5" />
                </Button>
              </a>
            </div>
            <div className="flex-1 text-center">
              <div className="w-48 h-48 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <span className="text-4xl font-black text-white">tabby</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default TabbyPage;
