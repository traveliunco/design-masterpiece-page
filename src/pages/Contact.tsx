import { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Sparkles, Globe, Headset, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { useSEO } from "@/hooks/useSEO";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = `الاسم: ${formData.name}%0Aالبريد: ${formData.email}%0Aالهاتف: ${formData.phone}%0Aالموضوع: ${formData.subject}%0Aالرسالة: ${formData.message}`;
    window.open(`https://api.whatsapp.com/send?phone=966569222111&text=${whatsappMessage}`, "_blank");
  };

  useSEO({
    title: "تواصل معنا | ترافليون للسياحة",
    description: "تواصل مع ترافليون للسياحة. فريقنا جاهز للرد 24/7 عبر الواتساب أو الهاتف. اتصل بنا الآن لتخطيط رحلتك الفاخرة.",
    keywords: "تواصل معنا, اتصل بنا, واتساب, خدمة عملاء, ترافليون, حجز رحلات",
  });

  return (
    <PageLayout>
      {/* Hero Section */}
      <PageHeader
        badge="دعم فني على مدار الساعة"
        badgeIcon={<Headset className="w-4 h-4 text-luxury-gold" />}
        title="تواصل معنا"
        subtitle="استفسار بسيط أو تخطيط لرحلة العمر؟ فريق خبراء السفر لدينا مستعد لتحويل أحلامك إلى حقيقة."
      />

      {/* Main Content */}
      <section className="py-24 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="card-3d p-10 md:p-12">
                <h2 className="text-2xl font-bold text-luxury-navy mb-8 flex items-center gap-4">
                  <div className="w-12 h-12 bg-luxury-teal/10 rounded-xl flex items-center justify-center">
                    <Send className="w-6 h-6 text-luxury-teal" />
                  </div>
                  أرسل رسالة فورية
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">الاسم الكريم</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white border border-border h-14 rounded-xl px-5 focus:border-luxury-teal focus:ring-2 focus:ring-luxury-teal/20 transition-all outline-none"
                        placeholder="الاسم الثلاثي"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">رقم الجوال</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white border border-border h-14 rounded-xl px-5 focus:border-luxury-teal focus:ring-2 focus:ring-luxury-teal/20 transition-all outline-none"
                        placeholder="+966"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">البريد الإلكتروني</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-border h-14 rounded-xl px-5 focus:border-luxury-teal transition-all outline-none"
                      placeholder="example@email.com"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">موضوع الرسالة</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      title="موضوع الرسالة"
                      className="w-full bg-white border border-border h-14 rounded-xl px-5 focus:border-luxury-teal transition-all outline-none appearance-none"
                    >
                      <option value="">ما الذي يدور ببالك؟</option>
                      <option value="حجز رحلة فاخرة">حجز رحلة فاخرة</option>
                      <option value="شهر العسل">برامج شهر العسل</option>
                      <option value="استفسار تجاري">استفسار تجاري / تعاون</option>
                      <option value="اقتراح أو تطوير">اقتراح أو تطوير</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">كيف يمكننا خدمتك؟</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white border border-border rounded-2xl p-5 focus:border-luxury-teal transition-all outline-none resize-none"
                      placeholder="اكتب تفاصيل استفسارك هنا..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-luxury h-16 text-lg flex items-center justify-center gap-3"
                  >
                    إرسال عبر الواتساب
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-5 space-y-6">
              {/* Global Presence */}
              <div className="glass-premium rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-luxury-teal/10 rounded-xl flex items-center justify-center">
                    <Globe className="w-7 h-7 text-luxury-teal" />
                  </div>
                  <h3 className="text-xl font-bold text-luxury-navy">فروعنا العالمية</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <MapPin className="w-5 h-5 text-luxury-teal flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-luxury-navy">المقر الرئيسي - المدينة</h4>
                      <p className="text-muted-foreground text-sm">الإسكان، شارع الهجرة، المدينة المنورة</p>
                    </div>
                  </div>
                  <div className="flex gap-4 opacity-60">
                    <MapPin className="w-5 h-5 text-luxury-teal flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-luxury-navy">فرع الرياض (قريباً)</h4>
                      <p className="text-muted-foreground text-sm">طريق الملك فهد</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Channels */}
              <a 
                href="https://api.whatsapp.com/send?phone=966569222111" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-4 p-6 card-3d hover:shadow-glow-teal transition-all group"
              >
                <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-7 h-7 text-green-500" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">تحدث مباشرة عبر</div>
                  <div className="text-lg font-bold text-luxury-navy">واتساب</div>
                </div>
              </a>

              <a 
                href="mailto:booking@traveliun.com" 
                className="flex items-center gap-4 p-6 card-3d hover:shadow-luxury transition-all group"
              >
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-7 h-7 text-blue-500" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">راسلنا عبر</div>
                  <div className="text-lg font-bold text-luxury-navy">بريد الحجوزات</div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-6 glass-premium rounded-3xl border-green-500/20 bg-green-50">
                <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-green-500 rounded-xl animate-ping opacity-20" />
                  <Clock className="w-7 h-7 text-green-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-bold text-green-600">متاحون الآن</span>
                  </div>
                  <div className="text-lg font-bold text-luxury-navy">خدمة 24/7</div>
                </div>
              </div>

              {/* Quote */}
              <div className="text-center p-8">
                <Sparkles className="w-10 h-10 text-luxury-gold mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground italic">
                  "نحن لا نبيع تذاكر، بل نصنع قصصاً تستحق أن تُروى."
                </p>
                <div className="font-bold text-luxury-teal mt-2">إدارة ترافليون</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
