import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Shield, Eye, Lock, Database, UserCheck, Mail, Fingerprint, Sparkles, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

const Privacy = () => {
  useSEO({
    title: "سياسة الخصوصية - ترافليون",
    description: "نحن في ترافليون نضع خصوصيتك في مقدمة أولوياتنا. تعرف على كيفية حماية بياناتك وحقوقك القانونية",
    keywords: "سياسة الخصوصية, حماية البيانات, أمن المعلومات, GDPR",
  });

  const sections = [
    {
      title: "مقدمة",
      icon: Eye,
      color: "from-blue-500 to-cyan-600",
      content: "نحن في ترافليون للسياحة والسفر نضع خصوصيتك في مقدمة أولوياتنا. تهدف هذه السياسة إلى شرح كيفية تعاملنا مع بياناتك الشخصية بشفافية تامة وفقاً لأعلى المعايير العالمية لحماية البيانات."
    },
    {
      title: "المعلومات التي نجمعها",
      icon: Database,
      color: "from-purple-500 to-pink-600",
      items: [
        "معلومات الهوية والاتصال (الاسم، البريد، رقم الجوال)",
        "بيانات السفر والحجوزات وتفضيلات الوجهات",
        "المعلومات التقنية مثل عنوان IP ونوع المتصفح",
        "سجل التعاملات المالية وتفضيلات الدفع"
      ]
    },
    {
      title: "كيف نستخدم بياناتك",
      icon: UserCheck,
      color: "from-emerald-500 to-teal-600",
      items: [
        "معالجة الحجوزات وتقديم الخدمات السياحية",
        "التواصل معك بخصوص رحلاتك وعروضنا الخاصة",
        "تحسين جودة خدماتنا وتطوير منصتنا",
        "الامتثال للمتطلبات القانونية والتنظيمية"
      ]
    },
    {
      title: "أمن البيانات",
      icon: Lock,
      color: "from-orange-500 to-red-600",
      content: "نستخدم تقنيات تشفير (SSL) متطورة وضوابط وصول صارمة لضمان حماية بياناتك من أي وصول غير مصرح به. أمن معلوماتك هو جزء لا يتجزأ من جودة خدماتنا. جميع خوادمنا محمية بجدران نارية متقدمة ونقوم بمراجعة أمنية دورية."
    },
    {
      title: "حقوقك القانونية",
      icon: Shield,
      color: "from-indigo-500 to-purple-600",
      items: [
        "الحق في الوصول إلى بياناتك وطلب نسخة منها",
        "الحق في تصحيح أي بيانات غير دقيقة فوراً",
        "الحق في طلب مسح البيانات (حق النسيان)",
        "الحق في سحب الموافقة على الرسائل الترويجية",
        "الحق في نقل بياناتك إلى مزود خدمة آخر",
        "الحق في الاعتراض على معالجة بياناتك لأغراض تسويقية"
      ]
    },
    {
      title: "مشاركة البيانات",
      icon: AlertTriangle,
      color: "from-amber-500 to-orange-600",
      items: [
        "لا نبيع بياناتك الشخصية لأي طرف ثالث مطلقاً",
        "قد نشارك البيانات مع شركاء الخدمة (فنادق، طيران) فقط لإتمام حجزك",
        "نشارك البيانات مع معالجي الدفع بشكل مشفر وآمن",
        "قد نفصح عن البيانات إذا طُلب منا ذلك قانونياً"
      ]
    }
  ];

  return (
    <PageLayout>
      <PageHeader
        badge="ملاذ آمن لبياناتك"
        badgeIcon={<Shield className="w-4 h-4 text-luxury-teal" />}
        title={
          <>
            سياسة <span className="text-gradient-teal">الخصوصية</span>
          </>
        }
        subtitle="نحن ملتزمون بحماية خصوصيتك وأمان بياناتك الشخصية وفقاً لأعلى المعايير العالمية"
      />

      {/* Last Updated */}
      <section className="py-8 -mt-10 relative z-20">
        <div className="container px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-luxury-cream/80 backdrop-blur-sm px-6 py-3 rounded-full border border-luxury-teal/20">
            <Sparkles className="w-4 h-4 text-luxury-teal" />
            <span className="text-sm font-semibold text-luxury-navy">آخر تحديث: يناير 2026</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            {/* Introduction Note */}
            <div className="mb-16 p-8 bg-blue-50 border-r-4 border-blue-500 rounded-2xl">
              <div className="flex items-start gap-4">
                <Eye className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">ملاحظة هامة</h3>
                  <p className="text-blue-800 leading-relaxed">
                    هذه السياسة تنطبق على جميع خدمات ترافليون بما في ذلك موقعنا الإلكتروني، تطبيق الموبايل، ومنصات التواصل الاجتماعي. باستخدامك لخدماتنا، فإنك توافق على هذه السياسة.
                  </p>
                </div>
              </div>
            </div>

            {/* Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {sections.map((section, i) => (
                <div key={i} className="card-3d p-8 hover:shadow-luxury transition-all duration-500 group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${section.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <section.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-luxury-navy mb-4">{section.title}</h3>
                  {section.content && (
                    <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                  )}
                  {section.items && (
                    <ul className="space-y-3">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-luxury-teal flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-luxury-navy leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Security Banner */}
            <div className="relative overflow-hidden rounded-3xl p-12 bg-gradient-to-br from-luxury-navy via-luxury-navy/95 to-luxury-teal/20 text-white mb-16">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-luxury-teal/10 rounded-full blur-[150px]" />
              <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-luxury-gold/10 rounded-full blur-[100px]" />
              
              <div className="relative z-10 text-center">
                <Fingerprint className="w-20 h-20 text-luxury-gold mx-auto mb-6 animate-pulse" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  نستخدم أعلى تقنيات <span className="text-luxury-gold">الأمان السحابي</span>
                </h2>
                <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8">
                  جميع المعاملات المالية ومعالجة البيانات تتم عبر خوادم مشفرة بنسبة 100% لضمان عدم وصول أي طرف ثالث لمعلوماتك الحساسة.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  {[
                    { icon: Lock, label: "تشفير AES-256" },
                    { icon: Shield, label: "متوافق مع GDPR" },
                    { icon: CheckCircle, label: "ISO 27001 معتمد" },
                    { icon: Lock, label: "SSL مُحدّث" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                      <item.icon className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-semibold">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cookies Policy Note */}
            <div className="mb-16 p-8 bg-amber-50 border-r-4 border-amber-500 rounded-2xl">
              <div className="flex items-start gap-4">
                <Database className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-amber-900 mb-2">سياسة ملفات الارتباط (Cookies)</h3>
                  <p className="text-amber-800 leading-relaxed mb-3">
                    نستخدم ملفات الارتباط لتحسين تجربتك على موقعنا. هذه الملفات تساعدنا في:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "تذكر تفضيلاتك وإعداداتك",
                      "تحليل كيفية استخدامك للموقع",
                      "عرض محتوى مخصص لك",
                      "تحسين أداء وسرعة الموقع"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-amber-800">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-luxury-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-luxury-teal/20">
                <Mail className="w-10 h-10 text-luxury-teal" />
              </div>
              <h3 className="text-3xl font-bold text-luxury-navy mb-4">لديك استفسار حول خصوصيتك؟</h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                فريق حماية البيانات لدينا جاهز للرد على جميع تساؤلاتك وطلباتك المتعلقة ببياناتك الشخصية
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:privacy@traveliun.com">
                  <Button className="btn-luxury px-10 py-6 text-lg rounded-full">
                    <Mail className="w-5 h-5 ml-2" />
                    تواصل عبر البريد
                  </Button>
                </a>
                <a href="https://api.whatsapp.com/send?phone=966569222111&text=استفسار عن سياسة الخصوصية" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="px-10 py-6 text-lg rounded-full border-luxury-teal text-luxury-teal hover:bg-luxury-teal/10">
                    <Phone className="w-5 h-5 ml-2" />
                    واتساب
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Privacy;
