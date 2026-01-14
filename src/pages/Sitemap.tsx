import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Map, Home, Plane, Hotel, FileText, HelpCircle, Users, Phone, Briefcase, Shield, Gift, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";

const Sitemap = () => {
  useSEO({
    title: "خريطة الموقع - ترافليون",
    description: "استعرض جميع صفحات وخدمات موقع ترافليون في مكان واحد",
    keywords: "خريطة الموقع, sitemap, صفحات الموقع",
  });

  const sections = [
    {
      title: "الصفحات الرئيسية",
      icon: Home,
      color: "from-blue-500 to-cyan-600",
      links: [
        { name: "الرئيسية", path: "/" },
        { name: "عن ترافليون", path: "/about" },
        { name: "تواصل معنا", path: "/contact" },
        { name: "خدمة العملاء", path: "/customer-support" },
      ]
    },
    {
      title: "الخدمات",
      icon: Star,
      color: "from-emerald-500 to-teal-600",
      links: [
        { name: "جميع الخدمات", path: "/services" },
        { name: "حجز طيران", path: "/flights" },
        { name: "حجز فنادق", path: "/hotels" },
        { name: "البرامج السياحية", path: "/programs" },
        { name: "برامج شهر العسل", path: "/honeymoon" },
        { name: "تأجير سيارات", path: "/car-rental" },
        { name: "التأشيرات", path: "/visas" },
        { name: "تأمين السفر", path: "/insurance" },
      ]
    },
    {
      title: "الوجهات",
      icon: Plane,
      color: "from-orange-500 to-red-600",
      links: [
        { name: "جميع الوجهات", path: "/destinations" },
        { name: "العروض الخاصة", path: "/offers" },
      ]
    },
    {
      title: "الحجز والدفع",
      icon: FileText,
      color: "from-purple-500 to-pink-600",
      links: [
        { name: "احجز رحلتك", path: "/booking" },
        { name: "الدفع بالتقسيط - تابي", path: "/tabby" },
        { name: "الدفع بالتقسيط - تمارا", path: "/tamara" },
        { name: "ضمان الخدمة", path: "/service-guarantee" },
      ]
    },
    {
      title: "برامج الولاء",
      icon: Gift,
      color: "from-amber-500 to-yellow-600",
      links: [
        { name: "برنامج الولاء", path: "/loyalty" },
      ]
    },
    {
      title: "معلومات الشركة",
      icon: Briefcase,
      color: "from-indigo-500 to-purple-600",
      links: [
        { name: "الوظائف", path: "/careers" },
        { name: "سياسة الخصوصية", path: "/privacy" },
        { name: "الشروط والأحكام", path: "/terms" },
      ]
    },
  ];

  return (
    <PageLayout>
      <PageHeader
        badge="جميع الصفحات"
        badgeIcon={<Map className="w-4 h-4 text-luxury-teal" />}
        title={<>خريطة <span className="text-gradient-teal">الموقع</span></>}
        subtitle="استعرض جميع صفحات وخدمات ترافليون في مكان واحد"
      />

      <section className="py-16 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {sections.map((section, i) => (
              <div key={i} className="card-3d p-6 hover:shadow-luxury transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-luxury-navy">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link to={link.path} className="flex items-center gap-2 text-luxury-navy hover:text-luxury-teal transition-colors group">
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Plane, label: "وجهات", value: "50+" },
              { icon: Hotel, label: "فنادق", value: "1000+" },
              { icon: Users, label: "عملاء سعداء", value: "10K+" },
              { icon: Star, label: "تقييم", value: "4.9/5" },
            ].map((stat, i) => (
              <div key={i} className="card-3d p-6 text-center">
                <stat.icon className="w-8 h-8 text-luxury-teal mx-auto mb-3" />
                <div className="text-3xl font-bold text-luxury-navy mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Sitemap;
