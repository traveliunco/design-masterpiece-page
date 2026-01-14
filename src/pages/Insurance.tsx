import { useState } from "react";
import { Shield, CheckCircle, Phone, Heart, Plane, Briefcase, Clock, Star, AlertCircle, Users } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";

const insurancePlans = [
  { id: 1, name: "الخطة الأساسية", pricePerDay: 15, maxCoverage: 50000, popular: false, coverage: ["تغطية طبية طارئة", "إخلاء طبي", "فقدان الأمتعة (محدود)"], notCovered: ["الأمراض المزمنة", "الرياضات الخطرة", "إلغاء الرحلة"] },
  { id: 2, name: "الخطة الشاملة", pricePerDay: 35, maxCoverage: 200000, popular: true, coverage: ["تغطية طبية كاملة", "إخلاء طبي جوي", "فقدان الأمتعة", "تأخر الرحلة", "إلغاء الرحلة"], notCovered: ["الرياضات الخطرة المتطرفة"] },
  { id: 3, name: "خطة VIP", pricePerDay: 75, maxCoverage: 500000, popular: false, coverage: ["تغطية طبية غير محدودة", "إخلاء طبي جوي", "جميع أنواع الرياضات", "إلغاء لأي سبب", "سرقة", "مساعدة قانونية"], notCovered: [] },
];

const coverageTypes = [
  { icon: Heart, title: "تغطية طبية", desc: "علاج حالات الطوارئ والحوادث", color: "bg-red-100 text-red-600" },
  { icon: Plane, title: "إلغاء الرحلة", desc: "تعويض في حال إلغاء رحلتك", color: "bg-blue-100 text-blue-600" },
  { icon: Briefcase, title: "فقدان الأمتعة", desc: "تعويض عن الأمتعة المفقودة", color: "bg-purple-100 text-purple-600" },
  { icon: Clock, title: "تأخر الرحلة", desc: "تعويض عن التأخيرات الطويلة", color: "bg-orange-100 text-orange-600" },
];

const Insurance = () => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  useSEO({
    title: "تأمين السفر الشامل - سافر بأمان",
    description: "سافر بأمان مع تغطية تأمينية شاملة لجميع حالات الطوارئ. خطط متنوعة تناسب جميع الاحتياجات.",
    keywords: "تأمين سفر, تأمين طبي, تغطية تأمينية, تعويض",
  });

  return (
    <PageLayout>
      <PageHeader
        badge="تأمين سفر شامل ومعتمد"
        badgeIcon={<Shield className="w-4 h-4 text-teal-400" />}
        title="تأمين السفر الشامل"
        subtitle="سافر بأمان مع تغطية تأمينية شاملة لجميع حالات الطوارئ"
      />

      {/* Coverage Types */}
      <section className="py-16 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <h2 className="text-section text-luxury-navy text-center mb-12">ماذا يغطي التأمين؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coverageTypes.map((item, i) => (
              <div key={i} className="card-3d p-6 text-center">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4", item.color)}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-luxury-navy mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20 bg-luxury-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-luxury-gold/10 rounded-full blur-[100px]" />
        </div>
        <div className="container px-4 relative z-10">
          <h2 className="text-section text-white text-center mb-4">اختر خطتك</h2>
          <p className="text-center text-white/60 mb-12">خطط متنوعة تناسب جميع الاحتياجات</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {insurancePlans.map((plan) => (
              <div key={plan.id} className={cn("glass-dark rounded-3xl overflow-hidden transition-all", plan.popular && "ring-2 ring-luxury-gold scale-105", selectedPlan === plan.id && "ring-2 ring-luxury-teal")}>
                {plan.popular && <div className="bg-luxury-gold text-luxury-navy text-center py-2 text-sm font-bold">الأكثر طلباً</div>}
                <div className="p-8">
                  <h3 className="text-xl font-bold text-white text-center">{plan.name}</h3>
                  <div className="text-center my-6">
                    <span className="text-4xl font-bold text-white">{plan.pricePerDay}</span>
                    <span className="text-white/60"> ر.س/يوم</span>
                  </div>
                  <p className="text-center text-sm text-white/60 mb-6">تغطية حتى {(plan.maxCoverage / 1000).toLocaleString()}K ر.س</p>
                  
                  <div className="space-y-3 mb-6">
                    {plan.coverage.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-white/80">
                        <CheckCircle className="w-5 h-5 text-luxury-gold flex-shrink-0" /><span>{item}</span>
                      </div>
                    ))}
                    {plan.notCovered.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-white/40">
                        <AlertCircle className="w-5 h-5 text-white/30 flex-shrink-0" /><span className="line-through">{item}</span>
                      </div>
                    ))}
                  </div>
                  <Button className={cn("w-full", plan.popular ? "btn-gold" : "btn-outline-luxury text-white border-white/30")} onClick={() => setSelectedPlan(plan.id)}>
                    {selectedPlan === plan.id ? "✓ تم الاختيار" : "اختر هذه الخطة"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gradient-to-b from-background to-luxury-cream/30">
        <div className="container px-4">
          <h2 className="text-section text-luxury-navy text-center mb-12">مميزات التأمين معنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "شركات معتمدة", desc: "نتعامل مع أفضل شركات التأمين العالمية" },
              { icon: Clock, title: "إصدار فوري", desc: "احصل على وثيقتك خلال دقائق" },
              { icon: Users, title: "تغطية عائلية", desc: "خصومات خاصة للعائلات" },
              { icon: Star, title: "دعم 24/7", desc: "فريق دعم متاح على مدار الساعة" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-luxury-teal/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-luxury-teal" />
                </div>
                <h3 className="font-bold text-luxury-navy mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-luxury-cream/30">
        <div className="container px-4 max-w-3xl">
          <h2 className="text-section text-luxury-navy text-center mb-8">الأسئلة الشائعة</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="1" className="card-3d px-6"><AccordionTrigger className="text-luxury-navy font-bold">هل التأمين إلزامي للسفر؟</AccordionTrigger><AccordionContent className="text-muted-foreground">بعض الدول تشترط تأمين سفر للحصول على التأشيرة (مثل شنغن). وحتى إن لم يكن إلزامياً، ننصح به دائماً.</AccordionContent></AccordionItem>
            <AccordionItem value="2" className="card-3d px-6"><AccordionTrigger className="text-luxury-navy font-bold">متى تبدأ التغطية؟</AccordionTrigger><AccordionContent className="text-muted-foreground">تبدأ التغطية من لحظة مغادرتك للمملكة وتنتهي عند عودتك.</AccordionContent></AccordionItem>
            <AccordionItem value="3" className="card-3d px-6"><AccordionTrigger className="text-luxury-navy font-bold">كيف أقدم مطالبة؟</AccordionTrigger><AccordionContent className="text-muted-foreground">تواصل مع خط الطوارئ المذكور في وثيقتك، وسيرشدك فريقنا لجميع الإجراءات.</AccordionContent></AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-cyan-700 text-white text-center">
        <Phone className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-section mb-4">تحتاج مساعدة في اختيار التأمين؟</h2>
        <p className="text-white/80 mb-8">فريقنا جاهز لمساعدتك في اختيار الخطة المناسبة</p>
        <a href="https://api.whatsapp.com/send?phone=966569222111&text=استفسار عن تأمين السفر" target="_blank" rel="noopener noreferrer">
          <Button className="btn-gold px-10 py-5 text-lg">تواصل واتساب</Button>
        </a>
      </section>
    </PageLayout>
  );
};

export default Insurance;
