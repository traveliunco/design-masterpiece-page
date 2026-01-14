import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { FileText, Gavel, Scale, CreditCard, Ban, RefreshCw, AlertCircle, CheckCircle2, Sparkles, Building2, Shield, Clock, Users, Phone } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";

const Terms = () => {
  useSEO({
    title: "الشروط والأحكام - ترافليون",
    description: "اطلع على الشروط والأحكام العامة لاستخدام خدمات ترافليون للسياحة والسفر",
    keywords: "شروط الاستخدام, أحكام, سياسة الإلغاء, المسؤولية القانونية",
  });

  const sections = [
    {
      title: "اتفاقية الاستخدام",
      icon: Gavel,
      color: "from-blue-500 to-cyan-600",
      content: "باستخدامك لمنصة ترافليون، فإنك توافق ضمنياً على الالتزام بجميع البنود والشروط المذكورة هنا. نحن نسعى دائماً لتقديم تجربة سفر شفافة وعادلة لجميع عملائنا. هذه الاتفاقية تحكم العلاقة القانونية بيننا وبين عملائنا الكرام."
    },
    {
      title: "سياسة الحجز والأسعار",
      icon: CreditCard,
      color: "from-emerald-500 to-teal-600",
      items: [
        "جميع الأسعار بالريال السعودي وتشمل ضريبة القيمة المضافة (15%)",
        "تظل الأسعار متغيرة حتى إتمام عملية الدفع وتأكيد الحجز رسمياً",
        "يتم إصدار قسائم الحجز (Vouchers) فور تأكيد الدفع بنجاح via Email",
        "الأسعار المعروضة للشخص الواحد ما لم يُذكر خلاف ذلك",
        "قد تتغير الأسعار بسبب تغيرات في أسعار العملات أو تكاليف الطيران"
      ]
    },
    {
      title: "سياسة الإلغاء والاسترداد",
      icon: Ban,
      color: "from-orange-500 to-red-600",
      content: "تخضع مبالغ الاسترداد للفترة الزمنية المتبقية على موعد الرحلة. نسب الاسترداد تختلف حسب نوع الخدمة والموعد:",
      highlights: [
        { label: "قبل 30 يوم", value: "استرداد 90%", color: "text-emerald-600" },
        { label: "15-30 يوم", value: "استرداد 70%", color: "text-amber-600" },
        { label: "7-14 يوم", value: "استرداد 40%", color: "text-orange-600" },
        { label: "أقل من 7 أيام", value: "لا يوجد استرداد", color: "text-red-600" }
      ],
      notes: [
        "قد تطبق رسوم إدارية على عمليات الإلغاء",
        "التذاكر المخفضة أو العروض الخاصة قد تكون غير قابلة للاسترداد",
        "يتم الاسترداد بنفس طريقة الدفع خلال 7-14 يوم عمل"
      ]
    },
    {
      title: "المسؤولية القانونية",
      icon: Scale,
      color: "from-purple-500 to-pink-600",
      content: "ترافليون وسيط بين العميل ومقدمي الخدمة (فنادق، طيران، شركات نقل). نحن نضمن جودة الاختيار ولكننا غير مسؤولين عن القوة القاهرة أو القرارات السيادية للدول. مسؤوليتنا محدودة بقيمة الحجز فقط."
    },
    {
      title: "التزامات العميل",
      icon: Users,
      color: "from-indigo-500 to-blue-600",
      items: [
        "تقديم معلومات صحيحة ودقيقة عند الحجز (الأسماء، جوازات السفر)",
        "الالتزام بمواعيد السفر المحددة في تذاكر الحجز",
        "الحصول على التأشيرات المطلوبة قبل موعد السفر",
        "تحمل مسؤولية الأمتعة الشخصية والممتلكات",
        "احترام قوانين وعادات الدول المُزارة"
      ]
    },
    {
      title: "التعديلات على الحجز",
      icon: RefreshCw,
      color: "from-pink-500 to-rose-600",
      items: [
        "يمكن طلب تعديل الحجز قبل 14 يوم على الأقل من موعد السفر",
        "قد تُطبق رسوم تعديل تتراوح بين 100-500 ريال حسب نوع الخدمة",
        "التعديلات تخضع لتوفر المقاعد والغرف في التواريخ الجديدة",
        "فرق السعر (إن وُجد) يُدفع من قبل العميل"
      ]
    }
  ];

  return (
    <PageLayout>
      <PageHeader
        badge="Traveliun Legal Hub"
        badgeIcon={<Building2 className="w-4 h-4 text-luxury-teal" />}
        title={
          <>
            الشروط <span className="text-gradient-teal">والأحكام</span>
          </>
        }
        subtitle="اتفاقية قانونية شاملة تحكم استخدام خدماتنا وتحمي حقوق جميع الأطراف"
      />

      {/* Version Info */}
      <section className="py-8 -mt-10 relative z-20">
        <div className="container px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-luxury-cream/80 backdrop-blur-sm px-6 py-3 rounded-full border border-luxury-teal/ 20">
            <AlertCircle className="w-4 h-4 text-luxury-teal" />
            <span className="text-sm font-semibold text-luxury-navy">نسخة يناير 2026 الرسمية</span>
          </div>
        </div>
      </section>

      {/* Important Note */}
      <section className="py-8">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto p-6 bg-amber-50 border-r-4 border-amber-500 rounded-2xl">
            <div className="flex items-start gap-4">
              <FileText className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-amber-900 mb-2">ملاحظة قانونية هامة</h3>
                <p className="text-amber-800 leading-relaxed">
                  يُرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام خدماتنا. استخدامك للموقع يعني موافقتك التامة على جميع البنود المذكورة. إذا كنت لا توافق على أي بند، يُرجى عدم استخدام الخدمة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            {/* Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {sections.map((section, i) => (
                <div key={i} className="card-3d p-8 hover:shadow-luxury transition-all duration-500 group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 bg-gradient-to-br ${section.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <section.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-luxury-navy">{section.title}</h3>
                  </div>

                  {section.content && (
                    <p className="text-muted-foreground leading-relaxed mb-4">{section.content}</p>
                  )}

                  {section.items && (
                    <ul className="space-y-3">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-luxury-teal flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-luxury-navy leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.highlights && (
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      {section.highlights.map((h, k) => (
                        <div key={k} className="text-center p-4 rounded-xl bg-luxury-cream/50 border border-border">
                          <div className="text-xs uppercase font-bold text-muted-foreground mb-1">{h.label}</div>
                          <div className={`text-sm font-bold ${h.color}`}>{h.value}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.notes && (
                    <div className="mt-6 space-y-2">
                      {section.notes.map((note, n) => (
                        <div key={n} className="flex items-center gap-2 text-xs text-muted-foreground italic">
                          <div className="w-1 h-1 bg-luxury-teal rounded-full" />
                          {note}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Saudi Law Banner */}
            <div className="relative overflow-hidden rounded-3xl p-12 bg-gradient-to-br from-luxury-navy via-luxury-navy/95 to-luxury-teal/20 text-white mb-16">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-luxury-teal/10 rounded-full blur-[150px]" />
              <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-luxury-gold/10 rounded-full blur-[100px]" />
              
              <div className="relative z-10 text-center md:text-right">
                <Shield className="w-16 h-16 text-luxury-gold mx-auto md:mx-0 mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  القانون <span className="text-luxury-gold">المطبق</span>
                </h2>
                <p className="text-xl text-white/80 leading-relaxed max-w-3xl mb-6">
                  تخضع هذه الاتفاقية وجميع النزاعات الناشئة عنها حصرياً للقوانين المطبقة في المملكة العربية السعودية، وتختص المحاكم السعودية بالنظر في جميع القضايا المتعلقة بها.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {[
                    "نظام التجارة الإلكترونية",
                    "نظام حماية المستهلك",
                    "نظام مكافحة الغش التجاري"
                  ].map((law, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 text-sm font-semibold">
                      {law}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact for More Info */}
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-luxury-teal mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-luxury-navy mb-4">لديك استفسار قانوني؟</h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                فريقنا القانوني جاهز للإجابة على جميع استفساراتك حول الشروط والأحكام
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:legal@traveliun.com">
                  <Button className="btn-luxury px-10 py-6 text-lg rounded-full">
                    تواصل مع الفريق القانوني
                  </Button>
                </a>
                <a href="https://api.whatsapp.com/send?phone=966569222111&text=استفسار عن الشروط والأحكام" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="px-10 py-6 text-lg rounded-full border-luxury-teal text-luxury-teal hover:bg-luxury-teal/10">
                    <Phone className="w-5 h-5 ml-2" />
                    واتساب
                  </Button>
                </a>
              </div>
            </div>

            {/* Final Note */}
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-luxury-teal/10 border-2 border-luxury-teal/30">
                <Sparkles className="w-6 h-6 text-luxury-teal animate-pulse" />
                <span className="font-bold text-luxury-teal text-lg">سافر بكل ثقة.. أنت مع ترافليون</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Terms;
