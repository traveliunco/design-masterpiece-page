import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Briefcase, Heart, TrendingUp, Users, Globe, Award, Send, MapPin, Clock, DollarSign, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSEO } from "@/hooks/useSEO";
import { useState } from "react";
import { toast } from "sonner";

const Careers = () => {
  useSEO({
    title: "الوظائف - انضم لفريق ترافليون",
    description: "استكشف الفرص الوظيفية في ترافليون وكن جزءاً من رحلة النجاح في عالم السياحة والسفر",
    keywords: "وظائف, فرص عمل, ترافليون, سياحة, سفر, توظيف",
  });

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", position: "", experience: "", linkedin: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("تم إرسال طلبك بنجاح! سنتواصل معك قريباً.");
      setFormData({ name: "", email: "", phone: "", position: "", experience: "", linkedin: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  const values = [
    { icon: Heart, title: "الشغف", desc: "نحب ما نفعله ونسعى لإسعاد عملائنا", color: "from-rose-500 to-pink-600" },
    { icon: TrendingUp, title: "الابتكار", desc: "نبتكر حلولاً سياحية عصرية", color: "from-blue-500 to-cyan-600" },
    { icon: Users, title: "فريق واحد", desc: "نعمل معاً لتحقيق الأفضل", color: "from-emerald-500 to-teal-600" },
    { icon: Globe, title: "عالمية", desc: "نفكر بشكل عالمي ونعمل محلياً", color: "from-purple-500 to-indigo-600" },
  ];

  const openPositions = [
    { title: "مسؤول حجوزات سياحية", department: "المبيعات", location: "الرياض", type: "دوام كامل", salary: "تنافسي" },
    { title: "مصمم جرافيك", department: "التسويق", location: "عن بعد", type: "دوام كامل", salary: "حسب الخبرة" },
    { title: "مطور ويب Full Stack", department: "التقنية", location: "جدة", type: "دوام كامل", salary: "15,000 - 25,000 ر.س" },
    { title: "مسؤول تسويق رقمي", department: "التسويق", location: "الرياض", type: "دوام كامل", salary: "8,000 - 15,000 ر.س" },
    { title: "منسق رحلات", department: "العمليات", location: "الدمام", type: "دوام كامل", salary: "6,000 - 10,000 ر.س" },
    { title: "مندوب مبيعات", department: "المبيعات", location: "متعدد", type: "دوام كامل", salary: "عمولة + راتب أساسي" },
  ];

  const benefits = [
    "تأمين صحي شامل لك ولعائلتك",
    "خصومات حصرية على جميع رحلاتنا",
    "بيئة عمل مرنة وداعمة",
    "فرص تطوير مهني مستمر",
    "مكافآت أداء سنوية",
    "إجازات سنوية مدفوعة",
  ];

  return (
    <PageLayout>
      <PageHeader
        badge="ابنِ معنا مستقبلك المهني"
        badgeIcon={<Briefcase className="w-4 h-4 text-luxury-teal" />}
        title={<>انضم لفريق <span className="text-gradient-teal">ترافليون</span></>}
        subtitle="كن جزءاً من رحلة النجاح في عالم السياحة والسفر. نبحث عن أشخاص متحمسين لصنع تجارب سفر استثنائية"
      />

      {/* Values */}
      <section className="py-16 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-section text-luxury-navy mb-4">قيمنا الأساسية</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">ما يجعلنا مميزين</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={i} className="card-3d p-8 text-center hover:scale-105 transition-transform group">
                <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-luxury-navy mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-luxury-cream/50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <Sparkles className="w-12 h-12 text-luxury-gold mx-auto mb-4" />
            <h2 className="text-section text-luxury-navy mb-4">الوظائف المتاحة</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">انضم إلينا في إحدى هذه الفرص</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {openPositions.map((job, i) => (
              <div key={i} className="card-3d p-6 hover:shadow-luxury transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-luxury-navy mb-1 group-hover:text-luxury-teal transition-colors">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.department}</p>
                  </div>
                  <Award className="w-6 h-6 text-luxury-gold" />
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-luxury-teal" />
                    <span className="text-luxury-navy">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-luxury-teal" />
                    <span className="text-luxury-navy">{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-luxury-teal" />
                    <span className="text-luxury-navy">{job.salary}</span>
                  </div>
                </div>
                <Button className="w-full btn-luxury">قدّم الآن</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gradient-to-b from-background to-luxury-cream/30">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-section text-luxury-navy mb-4">المزايا الوظيفية</h2>
              <p className="text-lg text-muted-foreground">نهتم براحتك ونجاحك</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-luxury-cream/50 rounded-xl border border-luxury-teal/20">
                  <CheckCircle className="w-5 h-5 text-luxury-teal flex-shrink-0" />
                  <span className="text-sm font-semibold text-luxury-navy">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-luxury-cream/50">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-luxury-navy mb-4">قدّم طلبك الآن</h2>
              <p className="text-muted-foreground">أرسل سيرتك الذاتية وسنتواصل معك قريباً</p>
            </div>
            <form onSubmit={handleSubmit} className="card-3d p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-luxury-navy font-semibold">الاسم الكامل *</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-luxury-navy font-semibold">البريد الإلكتروني *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="h-12 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-luxury-navy font-semibold">رقم الجوال *</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-luxury-navy font-semibold">الوظيفة المرغوبة *</Label>
                  <Select value={formData.position} onValueChange={(value) => setFormData({...formData, position: value})}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="اختر الوظيفة" /></SelectTrigger>
                    <SelectContent>{openPositions.map((job, i) => (<SelectItem key={i} value={job.title}>{job.title}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-luxury-navy font-semibold">سنوات الخبرة *</Label>
                  <Select value={formData.experience} onValueChange={(value) => setFormData({...formData, experience: value})}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="اختر سنوات الخبرة" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">أقل من سنة</SelectItem>
                      <SelectItem value="1-3">1-3 سنوات</SelectItem>
                      <SelectItem value="3-5">3-5 سنوات</SelectItem>
                      <SelectItem value="5+">أكثر من 5 سنوات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-luxury-navy font-semibold">رابط LinkedIn (اختياري)</Label>
                  <Input id="linkedin" type="url" value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} className="h-12 rounded-xl" placeholder="https://linkedin.com/in/..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-luxury-navy font-semibold">نبذة عنك *</Label>
                <Textarea id="message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required rows={4} className="rounded-xl" placeholder="أخبرنا عن خبراتك ولماذا تريد الانضمام لترافليون..." />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full btn-luxury py-6 text-lg rounded-xl">
                {isSubmitting ? "جاري الإرسال..." : <><Send className="w-5 h-5 ml-2" />إرسال الطلب</>}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-b from-background to-luxury-cream/30">
        <div className="container px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Users className="w-16 h-16 text-luxury-teal mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-luxury-navy mb-4">لم تجد الوظيفة المناسبة؟</h2>
            <p className="text-xl text-muted-foreground mb-8">أرسل سيرتك الذاتية وسنتواصل معك عند توفر وظيفة مناسبة</p>
            <a href="mailto:hr@traveliun.com">
              <Button className="btn-luxury px-12 py-6 text-lg rounded-full">تواصل مع قسم الموارد البشرية</Button>
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Careers;
