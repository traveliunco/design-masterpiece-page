import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Phone, Mail, MessageCircle, Clock, HelpCircle, Send, Sparkles, CheckCircle, Users, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSEO } from "@/hooks/useSEO";
import { useState } from "react";
import { toast } from "sonner";

const CustomerSupport = () => {
  useSEO({
    title: "خدمة العملاء - ترافليون",
    description: "نحن هنا لمساعدتك! تواصل مع فريق الدعم الفني على مدار الساعة",
    keywords: "دعم فني, خدمة عملاء, مساعدة, تواصل, ترافليون",
  });

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", category: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("تم إرسال رسالتك بنجاح! سنرد عليك خلال 24 ساعة.");
      setFormData({ name: "", email: "", phone: "", category: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactMethods = [
    { icon: Phone, title: "الهاتف", value: "+966 56 922 2111", link: "tel:+966569222111", desc: "متاح 24/7", color: "from-blue-500 to-cyan-600" },
    { icon: MessageCircle, title: "واتساب", value: "966569222111", link: "https://api.whatsapp.com/send?phone=966569222111", desc: "رد فوري", color: "from-emerald-500 to-teal-600" },
    { icon: Mail, title: "البريد", value: "support@traveliun.com", link: "mailto:support@traveliun.com", desc: "خلال 24 ساعة", color: "from-orange-500 to-red-600" },
  ];

  const faq = [
    { q: "كيف يمكنني تعديل حجزي؟", a: "يمكنك التواصل معنا عبر الواتساب أو الهاتف وسنساعدك فوراً. التعديلات ممكنة قبل 14 يوم من السفر." },
    { q: "ماذا لو احتجت إلغاء الحجز؟", a: "سياسة الإلغاء تعتمد على المدة المتبقية. يمكنك استرداد 90% قبل 30 يوم، و70% بين 15-30 يوم." },
    { q: "هل تقدمون تأشيرات السفر؟", a: "نعم! نقدم خدمة كاملة لاستخراج تأشيرات السفر لجميع الوجهات مع متابعة دورية." },
    { q: "كيف أدفع بال تقسيط؟", a: "نوفر التقسيط عبر تمارا وتابي بدون فوائد. اختر الخيار عند الدفع." },
    { q: "هل يمكنني إضافة تأمين السفر؟", a: "بالتأكيد! نوفر تأمين سفر شامل يغطي جميع الحالات الطبية والإلغاءات." },
  ];

  const features = [
    { icon: Clock, title: "دعم 24/7", desc: "فريقنا متاح على مدار الساعة" },
    { icon: Users, title: "فريق محترف", desc: "خبراء سياحة معتمدون" },
    { icon: Zap, title: "رد سريع", desc: "رد خلال دقائق عبر الواتساب" },
    { icon: Shield, title: "حماية كاملة", desc: "بياناتك آمنة 100%" },
  ];

  const categories = ["استفسار عام", "مشكلة في الحجز", "تعديل الحجز", "طلب إلغاء", "شكوى", "اقتراح"];

  return (
    <PageLayout>
      <PageHeader
        badge="نحن هنا لمساعدتك"
        badgeIcon={<HelpCircle className="w-4 h-4 text-luxury-teal" />}
        title={<>خدمة <span className="text-gradient-teal">العملاء</span></>}
        subtitle="فريقنا جاهز للإجابة على جميع استفساراتك وحل أي مشكلة على مدار الساعة"
      />

      {/* Contact Methods */}
      <section className="py-16 bg-gradient-to-b from-background via-luxury-cream/30 to-background -mt-10 relative z-20">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {contactMethods.map((method, i) => (
              <a key={i} href={method.link} target={method.title === "واتساب" ? "_blank" : undefined} rel={method.title === "واتساب" ? "noopener noreferrer" : undefined}>
                <div className="card-3d p-8 text-center hover:scale-105 transition-transform group cursor-pointer">
                  <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <method.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-luxury-navy mb-2">{method.title}</h3>
                  <p className="text-luxury-teal font-semibold mb-1">{method.value}</p>
                  <p className="text-sm text-muted-foreground">{method.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-luxury-cream/50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <Sparkles className="w-12 h-12 text-luxury-gold mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-luxury-navy mb-4">لماذا دعمنا مميز؟</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((feature, i) => (
              <div key={i} className="card-3d p-6 text-center">
                <feature.icon className="w-12 h-12 text-luxury-teal mx-auto mb-4" />
                <h3 className="font-bold text-luxury-navy mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gradient-to-b from-background to-luxury-cream/30">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-luxury-navy mb-4">أرسل لنا رسالة</h2>
              <p className="text-muted-foreground">سنرد عليك في أسرع وقت ممكن</p>
            </div>
            <form onSubmit={handleSubmit} className="card-3d p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-luxury-navy font-semibold">الاسم *</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-luxury-navy font-semibold">البريد الإلكتروني *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="h-12 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-luxury-navy font-semibold">رقم الجوال</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-luxury-navy font-semibold">نوع الاستفسار *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="اختر النوع" /></SelectTrigger>
                    <SelectContent>{categories.map((cat, i) => (<SelectItem key={i} value={cat}>{cat}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-luxury-navy font-semibold">الموضوع *</Label>
                <Input id="subject" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-luxury-navy font-semibold">الرسالة *</Label>
                <Textarea id="message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required rows={5} className="rounded-xl" placeholder="اكتب رسالتك هنا..." />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full btn-luxury py-6 text-lg rounded-xl">
                {isSubmitting ? "جاري الإرسال..." : <><Send className="w-5 h-5 ml-2" />إرسال الرسالة</>}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-luxury-cream/50">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-luxury-navy mb-4">الأسئلة الشائعة</h2>
              <p className="text-muted-foreground">ربما تجد إجابتك هنا</p>
            </div>
            <div className="space-y-4">
              {faq.map((item, i) => (
                <div key={i} className="card-3d p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-luxury-teal flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-luxury-navy mb-2 text-lg">{item.q}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-gradient-to-b from-background to-luxury-cream/30">
        <div className="container px-4">
          <div className="relative overflow-hidden rounded-3xl p-12 bg-gradient-to-br from-luxury-navy to-luxury-teal text-white text-center shadow-luxury max-w-4xl mx-auto">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-luxury-gold/10 rounded-full blur-[150px]" />
            <div className="relative z-10">
              <Phone className="w-16 h-16 mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl font-bold mb-4">حالة طارئة أثناء السفر؟</h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">خط ساخن متاح 24/7 لمساعدتك في أي موقف طارئ</p>
              <a href="tel:+966569222111">
                <Button size="lg" className="bg-white text-luxury-teal hover:bg-luxury-cream px-12 py-6 text-lg font-bold rounded-full shadow-xl">
                  <Phone className="w-5 h-5 ml-2" />
                  اتصل الآن: +966 56 922 2111
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CustomerSupport;
