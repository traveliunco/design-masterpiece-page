import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { 
  Map, Home, Plane, Hotel, FileText, Users, Briefcase, 
  Shield, Gift, Star, ArrowRight, Globe, Heart, CreditCard,
  Building2, MapPin, Newspaper, Search, Phone
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { southeastAsiaCountries } from "@/data/southeast-asia";

// تعريف جميع الروابط بشكل مركزي لسهولة الصيانة
const allRoutes = {
  main: [
    { name: "الرئيسية", path: "/", icon: Home },
    { name: "عن ترافليون", path: "/about", icon: Building2 },
    { name: "تواصل معنا", path: "/contact", icon: Phone },
    { name: "خدمة العملاء", path: "/customer-support", icon: Users },
    { name: "البحث", path: "/search", icon: Search },
  ],
  services: [
    { name: "جميع الخدمات", path: "/services", icon: Star },
    { name: "البرامج السياحية", path: "/programs", icon: MapPin },
    { name: "برامج شهر العسل", path: "/honeymoon", icon: Heart },
    // { name: "تأجير السيارات", path: "/car-rental", icon: Briefcase }, /* HIDDEN */
    // { name: "التأشيرات", path: "/visas", icon: FileText }, /* HIDDEN */
    // { name: "تأمين السفر", path: "/insurance", icon: Shield }, /* HIDDEN */
  ],
  destinations: [
    { name: "جميع الوجهات", path: "/destinations", icon: Globe },
    { name: "العروض الخاصة", path: "/offers", icon: Gift },
    { name: "الكرة الأرضية التفاعلية", path: "/globe", icon: Globe },
  ],
  booking: [
    { name: "احجز رحلتك", path: "/booking", icon: FileText },
    { name: "حجوزاتي", path: "/my-bookings", icon: FileText },
    { name: "تابي - ادفع لاحقاً", path: "/tabby", icon: CreditCard },
    { name: "تمارا - التقسيط", path: "/tamara", icon: CreditCard },
    { name: "ضمان الخدمة", path: "/service-guarantee", icon: Shield },
    { name: "معلومات الخدمة", path: "/service-info", icon: FileText },
  ],
  loyalty: [
    { name: "برنامج الولاء", path: "/loyalty", icon: Gift },
  ],
  content: [
    { name: "المدونة", path: "/blog", icon: Newspaper },
  ],
  company: [
    { name: "الوظائف", path: "/careers", icon: Briefcase },
    { name: "سياسة الخصوصية", path: "/privacy", icon: Shield },
    { name: "الشروط والأحكام", path: "/terms", icon: FileText },
  ],
};

// توليد روابط الدول والمدن تلقائياً
const generateCountryRoutes = () => {
  return southeastAsiaCountries.map(country => ({
    name: country.nameAr,
    path: `/country/${country.id}`,
    icon: MapPin,
    cities: country.cities.map(city => ({
      name: city.nameAr,
      path: `/country/${country.id}/city/${city.id}`,
    }))
  }));
};

const Sitemap = () => {
  useSEO({
    title: "خريطة الموقع - ترافليون | جميع الصفحات والخدمات",
    description: "استعرض جميع صفحات وخدمات موقع ترافليون في مكان واحد - الوجهات، الخدمات، الحجوزات وأكثر",
    keywords: "خريطة الموقع, sitemap, صفحات الموقع, ترافليون",
  });

  const countryRoutes = generateCountryRoutes();

  const sections = [
    {
      title: "الصفحات الرئيسية",
      icon: Home,
      color: "from-teal-500 to-cyan-600",
      links: allRoutes.main
    },
    {
      title: "الخدمات",
      icon: Star,
      color: "from-emerald-500 to-teal-600",
      links: allRoutes.services
    },
    {
      title: "الوجهات",
      icon: Globe,
      color: "from-cyan-500 to-blue-600",
      links: allRoutes.destinations
    },
    {
      title: "الحجز والدفع",
      icon: CreditCard,
      color: "from-blue-500 to-indigo-600",
      links: allRoutes.booking
    },
    {
      title: "برامج الولاء",
      icon: Gift,
      color: "from-teal-500 to-emerald-600",
      links: allRoutes.loyalty
    },
    {
      title: "المحتوى",
      icon: Newspaper,
      color: "from-indigo-500 to-purple-600",
      links: allRoutes.content
    },
    {
      title: "معلومات الشركة",
      icon: Briefcase,
      color: "from-slate-600 to-slate-800",
      links: allRoutes.company
    },
  ];

  // حساب إجمالي الصفحات
  const totalPages = Object.values(allRoutes).reduce((acc, routes) => acc + routes.length, 0) 
    + countryRoutes.length 
    + countryRoutes.reduce((acc, country) => acc + country.cities.length, 0);

  return (
    <PageLayout>
      <PageHeader
        badge="جميع الصفحات"
        badgeIcon={<Map className="w-4 h-4 text-teal-500" />}
        title={<>خريطة <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">الموقع</span></>}
        subtitle={`استعرض جميع صفحات وخدمات ترافليون - ${totalPages} صفحة`}
      />

      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container px-4">
          {/* الأقسام الرئيسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {sections.map((section, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal-200 transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">{section.title}</h2>
                </div>
                <ul className="space-y-2">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link 
                        to={link.path} 
                        className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors group py-1"
                      >
                        <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                        <span className="text-sm">{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* قسم الدول والمدن */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8 flex items-center justify-center gap-3">
              <Globe className="w-6 h-6 text-teal-500" />
              الدول والمدن السياحية
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {countryRoutes.map((country, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal-200 transition-all duration-300">
                  <Link 
                    to={country.path}
                    className="flex items-center gap-3 mb-4 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-teal-600 transition-colors">
                      {country.name}
                    </h3>
                  </Link>
                  <ul className="space-y-1.5 pr-2 border-r-2 border-teal-100">
                    {country.cities.map((city, j) => (
                      <li key={j}>
                        <Link 
                          to={city.path}
                          className="flex items-center gap-2 text-gray-500 hover:text-teal-600 transition-colors text-sm py-0.5"
                        >
                          <span className="w-1 h-1 bg-teal-400 rounded-full" />
                          {city.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* إحصائيات سريعة */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: FileText, label: "صفحات", value: totalPages },
              { icon: Globe, label: "دول", value: countryRoutes.length },
              { icon: MapPin, label: "مدن", value: countryRoutes.reduce((acc, c) => acc + c.cities.length, 0) },
              { icon: Star, label: "خدمات", value: allRoutes.services.length },
            ].map((stat, i) => (
              <div key={i} className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-5 text-center text-white">
                <stat.icon className="w-7 h-7 mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Sitemap;

// تصدير الروابط لاستخدامها في أماكن أخرى
export { allRoutes, generateCountryRoutes };
