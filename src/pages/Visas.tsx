import { useState } from "react";
import { FileText, Clock, CheckCircle, Search, Globe, Phone, Calendar } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";

const visas = [
  { id: 1, country: "ماليزيا", flag: "🇲🇾", type: "سياحية", duration: "90 يوم", processingDays: "1-3", price: 0, status: "free" },
  { id: 2, country: "تركيا", flag: "🇹🇷", type: "إلكترونية", duration: "90 يوم", processingDays: "1", price: 200, status: "e-visa" },
  { id: 3, country: "تايلاند", flag: "🇹🇭", type: "عند الوصول", duration: "30 يوم", processingDays: "0", price: 75, status: "on-arrival" },
  { id: 4, country: "إندونيسيا", flag: "🇮🇩", type: "عند الوصول", duration: "30 يوم", processingDays: "0", price: 130, status: "on-arrival" },
  { id: 5, country: "جورجيا", flag: "🇬🇪", type: "سياحية", duration: "365 يوم", processingDays: "0", price: 0, status: "free" },
  { id: 6, country: "أذربيجان", flag: "🇦🇿", type: "إلكترونية", duration: "30 يوم", processingDays: "3-5", price: 100, status: "e-visa" },
  { id: 7, country: "المالديف", flag: "🇲🇻", type: "سياحية", duration: "30 يوم", processingDays: "0", price: 0, status: "free" },
  { id: 8, country: "مصر", flag: "🇪🇬", type: "عند الوصول", duration: "30 يوم", processingDays: "0", price: 95, status: "on-arrival" },
];

const packages = [
  { id: 1, name: "خدمة عادية", processingTime: "5-7 أيام", price: 150, features: ["استلام المستندات", "تقديم الطلب", "متابعة"] },
  { id: 2, name: "خدمة سريعة", processingTime: "2-3 أيام", price: 300, features: ["استلام", "تقديم عاجل", "متابعة", "توصيل"], popular: true },
  { id: 3, name: "خدمة VIP", processingTime: "24-48 ساعة", price: 500, features: ["استلام من موقعك", "تقديم فوري", "توصيل عاجل"] },
];

const Visas = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useSEO({
    title: "خدمات التأشيرات - تأشيرات سريعة لأكثر من 50 دولة",
    description: "نوفر لك جميع أنواع التأشيرات بأسرع وقت. تأشيرات سياحية، إلكترونية، وعند الوصول.",
    keywords: "تأشيرات, فيزا, تأشيرة سياحية, تأشيرة إلكترونية",
  });

  const filteredVisas = visas.filter((visa) => {
    if (searchQuery && !visa.country.includes(searchQuery)) return false;
    if (selectedStatus !== "all" && visa.status !== selectedStatus) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "free": return <Badge className="bg-green-500">بدون تأشيرة</Badge>;
      case "e-visa": return <Badge className="bg-blue-500">إلكترونية</Badge>;
      case "on-arrival": return <Badge className="bg-orange-500">عند الوصول</Badge>;
      default: return <Badge>مسبقة</Badge>;
    }
  };

  return (
    <PageLayout>
      <PageHeader
        badge="خدمات التأشيرات لأكثر من 50 دولة"
        badgeIcon={<FileText className="w-4 h-4 text-purple-400" />}
        title="خدمات التأشيرات السريعة"
        subtitle="نوفر لك جميع أنواع التأشيرات بأسرع وقت وأفضل سعر"
      />

      {/* Search & Filter */}
      <section className="py-8 -mt-10 relative z-20">
        <div className="container px-4">
          <div className="glass-premium rounded-3xl p-6 shadow-luxury">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="ابحث عن دولة..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pr-10 h-12 rounded-xl" />
              </div>
              <div className="flex flex-wrap gap-2">
                {[{ id: "all", label: "الكل" }, { id: "free", label: "مجانية" }, { id: "e-visa", label: "إلكترونية" }, { id: "on-arrival", label: "عند الوصول" }].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedStatus(f.id)}
                    className={cn(
                      "px-5 py-2.5 rounded-full text-sm font-semibold transition-all",
                      selectedStatus === f.id ? "bg-luxury-teal text-white" : "bg-white text-luxury-navy/70 border border-border hover:bg-luxury-teal/10"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visas Grid */}
      <section className="py-12 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVisas.map((visa) => (
              <div key={visa.id} className="card-3d overflow-hidden">
                <div className="h-24 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                  <span className="text-6xl">{visa.flag}</span>
                </div>
                <div className="p-5 bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-luxury-navy">{visa.country}</h3>
                    {getStatusBadge(visa.status)}
                  </div>
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-muted-foreground" /><span>{visa.type}</span></div>
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /><span>{visa.duration}</span></div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground" /><span>{visa.processingDays} أيام</span></div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <p className="text-xl font-bold text-luxury-teal">{visa.price === 0 ? "مجاناً" : `${visa.price} ر.س`}</p>
                    <Button size="sm" className="btn-luxury">التفاصيل</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredVisas.length === 0 && (
            <div className="text-center py-20"><Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" /><p>لم يتم العثور على نتائج</p></div>
          )}
        </div>
      </section>

      {/* Service Packages */}
      <section className="py-20 bg-luxury-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-luxury-gold/10 rounded-full blur-[100px]" />
        </div>
        <div className="container px-4 relative z-10">
          <h2 className="text-section text-white text-center mb-12">باقات الخدمة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {packages.map((pkg) => (
              <div key={pkg.id} className={cn("glass-dark rounded-3xl overflow-hidden", pkg.popular && "ring-2 ring-luxury-gold")}>
                {pkg.popular && <div className="bg-luxury-gold text-luxury-navy px-4 py-2 text-sm text-center font-bold">الأكثر طلباً</div>}
                <div className="p-8">
                  <h3 className="text-xl font-bold text-white text-center mb-2">{pkg.name}</h3>
                  <p className="text-center text-white/60 mb-4">{pkg.processingTime}</p>
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-white">{pkg.price}</span>
                    <span className="text-white/60"> ر.س</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((f, i) => <li key={i} className="flex items-center gap-2 text-white/80"><CheckCircle className="w-5 h-5 text-luxury-gold" />{f}</li>)}
                  </ul>
                  <Button className={cn("w-full", pkg.popular ? "btn-gold" : "btn-outline-luxury text-white border-white/30")}>اطلب الآن</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gradient-to-b from-background to-luxury-cream/30">
        <div className="container px-4 max-w-3xl">
          <h2 className="text-section text-luxury-navy text-center mb-12">الأسئلة الشائعة</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="1" className="card-3d px-6"><AccordionTrigger className="text-luxury-navy font-bold">ما هي المستندات المطلوبة؟</AccordionTrigger><AccordionContent className="text-muted-foreground">جواز سفر صالح 6 أشهر، صور شخصية، وحجز فندق وتذاكر.</AccordionContent></AccordionItem>
            <AccordionItem value="2" className="card-3d px-6"><AccordionTrigger className="text-luxury-navy font-bold">كم تستغرق المعالجة؟</AccordionTrigger><AccordionContent className="text-muted-foreground">الإلكترونية 1-3 أيام، المسبقة 5-15 يوم عمل.</AccordionContent></AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-indigo-700 text-white text-center">
        <Phone className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-section mb-4">استفسار عن تأشيرة؟</h2>
        <a href="https://api.whatsapp.com/send?phone=966569222111" target="_blank" rel="noopener noreferrer">
          <Button className="btn-gold px-10 py-5 text-lg">تواصل واتساب</Button>
        </a>
      </section>
    </PageLayout>
  );
};

export default Visas;
