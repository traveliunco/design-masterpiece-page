import { useState } from "react";
import {
  Phone, Mail, MapPin, Clock, MessageCircle, Send, Sparkles,
  Globe, Headset, ArrowLeft, Instagram, CheckCircle, Plane
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import { useSEO } from "@/hooks/useSEO";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    travelers: "",
    destination: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const msg = `*رسالة جديدة من الموقع*%0A──────────%0A👤 الاسم: ${formData.name}%0A📧 البريد: ${formData.email}%0A📱 الهاتف: ${formData.phone}%0A📋 الموضوع: ${formData.subject}%0A🌍 الوجهة: ${formData.destination || "غير محدد"}%0A👥 عدد المسافرين: ${formData.travelers || "غير محدد"}%0A──────────%0A💬 الرسالة:%0A${formData.message}`;
    window.open(`https://api.whatsapp.com/send?phone=966569222111&text=${msg}`, "_blank");
    toast.success("تم فتح الواتساب! أرسل رسالتك وسنرد عليك فوراً");
    setSending(false);
  };

  useSEO({
    title: "تواصل معنا | ترافليون للسياحة والسفر",
    description: "تواصل مع ترافليون. فريقنا جاهز 24/7 عبر الواتساب أو الهاتف. المدينة المنورة — رقم: 0569222111",
    keywords: "تواصل معنا, اتصل بنا, واتساب, ترافليون, حجز رحلات, المدينة المنورة",
  });

  const quickLinks = [
    {
      icon: MessageCircle,
      title: "واتساب",
      subtitle: "الأسرع — رد خلال دقائق",
      value: "966569222111",
      href: "https://api.whatsapp.com/send?phone=966569222111",
      color: "bg-green-500",
      bgLight: "bg-green-50",
    },
    {
      icon: Phone,
      title: "اتصل بنا",
      subtitle: "خط الحجوزات المباشر",
      value: "0569222111",
      href: "tel:+966569222111",
      color: "bg-blue-500",
      bgLight: "bg-blue-50",
    },
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      subtitle: "للاستفسارات التجارية",
      value: "booking@traveliun.com",
      href: "mailto:booking@traveliun.com",
      color: "bg-purple-500",
      bgLight: "bg-purple-50",
    },
    {
      icon: Instagram,
      title: "انستقرام",
      subtitle: "تابع عروضنا اليومية",
      value: "@traveliun",
      href: "https://www.instagram.com/traveliun/",
      color: "bg-pink-500",
      bgLight: "bg-pink-50",
    },
  ];

  const faqs = [
    { q: "كيف أحجز رحلة مع ترافليون؟", a: "تواصل معنا عبر الواتساب أو النموذج أعلاه وسيقوم فريقنا بتصميم برنامج مخصص لك حسب رغباتك وميزانيتك." },
    { q: "هل يمكنني الدفع بالتقسيط؟", a: "نعم! نوفر خيارات الدفع عبر تابي (4 دفعات بدون فوائد) وتمارا (تقسيط مرن حتى 6 أشهر)." },
    { q: "هل الحجز مضمون؟", a: "بالطبع! نحن مرخصون من وزارة السياحة ومسجلون في منصة معروف مع ضمان استرداد في حال إلغاء الرحلة." },
    { q: "ما هي أوقات الدوام الرسمي؟", a: "خدمة العملاء متوفرة 24/7 عبر الواتساب. الدوام الرسمي: السبت - الخميس، 9 صباحاً - 11 مساءً." },
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <PageHeader
        badge="نحن هنا لمساعدتك"
        badgeIcon={<Headset className="w-4 h-4 text-luxury-gold" />}
        title="تواصل معنا"
        subtitle="استفسار بسيط أو تخطيط لرحلة العمر؟ فريق خبراء السفر جاهز لتحويل أحلامك إلى حقيقة — تواصل الآن!"
      />

      {/* Quick Contact Channels */}
      <section className="py-16 bg-gradient-to-b from-background to-luxury-cream/30">
        <div className="container px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, i) => (
              <a key={i} href={link.href} target="_blank" rel="noopener noreferrer"
                 className={`${link.bgLight} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group border border-transparent hover:border-opacity-20`}>
                <div className={`w-12 h-12 ${link.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <link.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-luxury-navy mb-1">{link.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">{link.subtitle}</p>
                <p className="text-sm font-bold text-luxury-teal" dir="ltr">{link.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content: Form + Info */}
      <section className="py-24 bg-gradient-to-b from-luxury-cream/30 via-background to-luxury-cream/30">
        <div className="container px-4">
          <div className="grid lg:grid-cols-12 gap-16 items-start">

            {/* Form */}
            <div className="lg:col-span-7">
              <div className="card-3d p-10 md:p-12">
                <h2 className="text-2xl font-bold text-luxury-navy mb-2 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  راسلنا الآن
                </h2>
                <p className="text-muted-foreground mb-8">النموذج يُرسل مباشرة عبر الواتساب — ستحصل على رد خلال دقائق!</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-luxury-navy">الاسم الكريم <span className="text-red-400">*</span></label>
                      <input type="text" required value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-50 border border-border h-14 rounded-xl px-5 focus:border-[hsl(175,84%,32%)] focus:ring-2 focus:ring-[hsl(175,84%,32%)]/20 transition-all outline-none"
                        placeholder="الاسم الثلاثي" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-luxury-navy">رقم الجوال <span className="text-red-400">*</span></label>
                      <input type="tel" required value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-gray-50 border border-border h-14 rounded-xl px-5 focus:border-[hsl(175,84%,32%)] focus:ring-2 focus:ring-[hsl(175,84%,32%)]/20 transition-all outline-none"
                        placeholder="+966 5XX XXX XXXX" dir="ltr" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-luxury-navy">البريد الإلكتروني</label>
                      <input type="email" value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-gray-50 border border-border h-14 rounded-xl px-5 focus:border-[hsl(175,84%,32%)] transition-all outline-none"
                        placeholder="example@email.com" dir="ltr" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-luxury-navy">الموضوع <span className="text-red-400">*</span></label>
                      <select required value={formData.subject} title="موضوع الرسالة"
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-gray-50 border border-border h-14 rounded-xl px-5 focus:border-[hsl(175,84%,32%)] transition-all outline-none appearance-none">
                        <option value="">اختر الموضوع</option>
                        <option value="حجز رحلة سياحية">حجز رحلة سياحية</option>
                        <option value="برنامج شهر العسل">برنامج شهر العسل</option>
                        <option value="رحلة عائلية">رحلة عائلية مخصصة</option>
                        <option value="حجز فنادق">حجز فنادق فقط</option>
                        <option value="استفسار عام">استفسار عام</option>
                        <option value="تعاون تجاري">تعاون تجاري / شراكة</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-luxury-navy">الوجهة المرغوبة</label>
                      <select value={formData.destination} title="الوجهة"
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        className="w-full bg-gray-50 border border-border h-14 rounded-xl px-5 focus:border-[hsl(175,84%,32%)] transition-all outline-none appearance-none">
                        <option value="">اختر الوجهة (اختياري)</option>
                        <option value="ماليزيا">🇲🇾 ماليزيا</option>
                        <option value="تايلاند">🇹🇭 تايلاند</option>
                        <option value="إندونيسيا">🇮🇩 إندونيسيا</option>
                        <option value="تركيا">🇹🇷 تركيا</option>
                        <option value="جورجيا">🇬🇪 جورجيا</option>
                        <option value="سنغافورة">🇸🇬 سنغافورة</option>
                        <option value="المالديف">🇲🇻 المالديف</option>
                        <option value="وجهة أخرى">وجهة أخرى</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-luxury-navy">عدد المسافرين</label>
                      <select value={formData.travelers} title="عدد المسافرين"
                        onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                        className="w-full bg-gray-50 border border-border h-14 rounded-xl px-5 focus:border-[hsl(175,84%,32%)] transition-all outline-none appearance-none">
                        <option value="">اختر (اختياري)</option>
                        <option value="شخص واحد">شخص واحد</option>
                        <option value="شخصان (زوجين)">شخصان (زوجين)</option>
                        <option value="3-4 أشخاص">3-4 أشخاص</option>
                        <option value="5-7 أشخاص">5-7 أشخاص</option>
                        <option value="8+ أشخاص (مجموعة)">8+ أشخاص (مجموعة)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-luxury-navy">تفاصيل الاستفسار <span className="text-red-400">*</span></label>
                    <textarea required rows={5} value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-gray-50 border border-border rounded-2xl p-5 focus:border-[hsl(175,84%,32%)] focus:ring-2 focus:ring-[hsl(175,84%,32%)]/20 transition-all outline-none resize-none"
                      placeholder="اكتب تفاصيل رحلتك أو استفسارك هنا — التواريخ المفضلة، الميزانية التقريبية، أي متطلبات خاصة..." />
                  </div>

                  <Button type="submit" disabled={sending}
                    className="w-full btn-luxury h-16 text-lg flex items-center justify-center gap-3">
                    <MessageCircle className="w-5 h-5" />
                    إرسال عبر الواتساب
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Side Info */}
            <div className="lg:col-span-5 space-y-6">
              {/* Office Info */}
              <div className="glass-premium rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Globe className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-luxury-navy">مكاتبنا</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-luxury-navy">المقر الرئيسي — المدينة المنورة</h4>
                      <p className="text-muted-foreground text-sm">حي الإسكان، شارع الهجرة</p>
                      <a href="https://maps.app.goo.gl/Zpme8UFbSHoZT3hz6" target="_blank" rel="noopener noreferrer"
                         className="text-luxury-teal text-xs font-medium hover:underline mt-1 inline-block">
                        فتح في خرائط جوجل ←
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Plane className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-luxury-navy">فرق العمل الدولية</h4>
                      <p className="text-muted-foreground text-sm">كوالالمبور • بانكوك • إسطنبول • تبليسي</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="glass-premium rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-luxury-navy">ساعات العمل</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground">السبت — الخميس</span>
                    <span className="font-bold text-luxury-navy">9:00 ص — 11:00 م</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground">الجمعة</span>
                    <span className="font-bold text-luxury-navy">4:00 م — 11:00 م</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">واتساب</span>
                    <span className="font-bold text-green-600">24/7 متاح دائماً</span>
                  </div>
                </div>
              </div>

              {/* Online Status */}
              <div className="flex items-center gap-4 p-6 rounded-2xl bg-green-50 border border-green-200/50">
                <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-green-500 rounded-xl animate-ping opacity-20" />
                  <Headset className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-bold text-green-700">متاحون الآن للرد</span>
                  </div>
                  <p className="text-sm text-green-600">متوسط وقت الرد: أقل من 5 دقائق</p>
                </div>
              </div>

              {/* Quote */}
              <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-[hsl(222,47%,11%)] to-[hsl(222,47%,18%)] relative overflow-hidden">
                <div className="absolute inset-0 bg-[hsl(175,84%,32%)]/5 rounded-full blur-[100px] -top-20" />
                <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-4 opacity-60 relative z-10" />
                <p className="text-white/80 italic relative z-10">"كل رحلة تبدأ برسالة واحدة — أرسل لنا وسنصنع لك رحلة العمر."</p>
                <p className="text-amber-400 font-bold mt-3 relative z-10">إدارة ترافليون</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-luxury-cream/50">
        <div className="container px-4">
          <SectionTitle badge="أسئلة شائعة" title="نجيب على" highlight="تساؤلاتك" />
          <div className="max-w-3xl mx-auto grid gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="card-3d p-8 group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-luxury-navy text-lg mb-2">{faq.q}</h4>
                    <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-0">
        <div className="w-full h-[400px] bg-gray-200 relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3629.2!2d39.62!3d24.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDI4JzEyLjAiTiAzOcKwMzcnMTIuMCJF!5e0!3m2!1sar!2ssa!4v1700000000000!5m2!1sar!2ssa"
            width="100%"
            height="100%"
            loading="lazy"
            title="موقع ترافليون على الخريطة"
            className="border-0"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute bottom-6 right-6 glass-premium rounded-2xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-luxury-navy text-sm">ترافليون للسياحة</p>
              <p className="text-xs text-muted-foreground">المدينة المنورة — حي الإسكان</p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
