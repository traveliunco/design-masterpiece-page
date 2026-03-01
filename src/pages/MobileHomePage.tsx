import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, Bell, User, Plane, Building2, MapPin, Car,
  Gift, Percent, Star, ChevronLeft, CreditCard, Shield,
  Headphones, Clock, ChevronDown, Heart, Globe
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";

// بيانات العروض
const deals = [
  {
    id: 1,
    title: "خصم 30% على الفنادق",
    subtitle: "عروض الشتاء الحصرية",
    gradient: "from-teal-500 via-emerald-500 to-green-500",
    icon: Building2,
  },
  {
    id: 2,
    title: "طيران بأقل الأسعار",
    subtitle: "وفر حتى 50%",
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    icon: Plane,
  },
  {
    id: 3,
    title: "باقات شهر العسل",
    subtitle: "تجربة لا تُنسى",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    icon: Heart,
  },
];

// بيانات الوجهات الشائعة
const popularDestinations = [
  {
    id: 1,
    name: "كوالالمبور",
    slug: "kuala-lumpur",
    countrySlug: "malaysia",
    country: "ماليزيا",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop",
    price: "من 2,499 ر.س",
    rating: 4.8,
  },
  {
    id: 2,
    name: "إسطنبول",
    slug: "istanbul",
    countrySlug: "turkey",
    country: "تركيا",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=300&fit=crop",
    price: "من 1,899 ر.س",
    rating: 4.9,
  },
  {
    id: 3,
    name: "بانكوك",
    slug: "bangkok",
    countrySlug: "thailand",
    country: "تايلاند",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=300&fit=crop",
    price: "من 2,199 ر.س",
    rating: 4.7,
  },
  {
    id: 4,
    name: "بالي",
    slug: "bali",
    countrySlug: "indonesia",
    country: "إندونيسيا",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop",
    price: "من 2,899 ر.س",
    rating: 4.9,
  },
  {
    id: 5,
    name: "سنغافورة",
    slug: "singapore",
    countrySlug: "singapore",
    country: "سنغافورة",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop",
    price: "من 3,299 ر.س",
    rating: 4.8,
  },
];

// أزرار الخدمات السريعة
const quickActions = [
  { icon: Plane, label: "طيران", path: "/amadeus-flights", color: "bg-gradient-to-br from-blue-500 to-cyan-500" },
  { icon: Building2, label: "فنادق", path: "/hotels", color: "bg-gradient-to-br from-teal-500 to-emerald-500" },
  { icon: MapPin, label: "جولات", path: "/programs", color: "bg-gradient-to-br from-cyan-500 to-blue-500" },
  // { icon: Car, label: "سيارات", path: "/car-rental", color: "bg-gradient-to-br from-emerald-500 to-teal-500" }, /* HIDDEN */
  // { icon: Globe, label: "تأشيرات", path: "/visas", color: "bg-gradient-to-br from-blue-600 to-indigo-500" }, /* HIDDEN */
  { icon: CreditCard, label: "تقسيط", path: "/tabby", color: "bg-gradient-to-br from-teal-600 to-cyan-500" },
  { icon: Gift, label: "عروض", path: "/offers", color: "bg-gradient-to-br from-indigo-500 to-blue-500" },
  { icon: Heart, label: "شهر عسل", path: "/honeymoon", color: "bg-gradient-to-br from-cyan-600 to-teal-500" },
];

// المميزات
const features = [
  { icon: Shield, title: "ضمان أفضل سعر", desc: "أسعار تنافسية" },
  { icon: Headphones, title: "دعم 24/7", desc: "خدمة متواصلة" },
  { icon: Clock, title: "حجز فوري", desc: "تأكيد مباشر" },
  { icon: CreditCard, title: "دفع آمن", desc: "حماية كاملة" },
];

const MobileHomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useSEO({
    title: "ترافليون - احجز رحلتك بسهولة | فنادق، طيران، جولات",
    description: "احجز رحلتك مع ترافليون. أفضل العروض على الطيران والفنادق والجولات السياحية. خدمة 24/7 وضمان أفضل الأسعار.",
    keywords: "ترافليون, حجز طيران, حجز فنادق, سياحة, سفر, عروض سياحية",
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/logo-white.png" 
              alt="ترافليون" 
              className="w-8 h-8 object-contain"
            />
            <span className="font-bold text-lg text-gray-900">ترافليون</span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button 
              title="الإشعارات"
              aria-label="الإشعارات"
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link 
              to="/login" 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <User className="w-5 h-5 text-gray-600" />
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div 
            className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-3 cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={() => navigate('/search')}
          >
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="إلى أين تريد السفر؟"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24">
        {/* Quick Actions Grid */}
        <section className="px-4 py-5">
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  action.color
                )}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">{action.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Deals Banner Carousel */}
        <section className="px-4 py-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">عروض حصرية</h2>
            <Link to="/offers" className="text-sm text-primary font-medium flex items-center gap-1">
              عرض الكل
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className={cn(
                  "flex-shrink-0 w-[280px] p-5 rounded-2xl bg-gradient-to-br text-white snap-start",
                  deal.gradient
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/80 text-sm mb-1">{deal.subtitle}</p>
                    <h3 className="text-xl font-bold">{deal.title}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <deal.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <Link 
                  to="/offers" 
                  className="mt-4 px-4 py-2 bg-white/20 rounded-full text-sm font-medium hover:bg-white/30 transition-colors inline-block"
                >
                  احجز الآن
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="px-4 py-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">الوجهات الأكثر شعبية</h2>
            <Link to="/destinations" className="text-sm text-primary font-medium flex items-center gap-1">
              عرض الكل
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory">
            {popularDestinations.map((dest) => (
              <Link
                key={dest.id}
                to={`/country/${dest.countrySlug}/city/${dest.slug}`}
                className="flex-shrink-0 w-[160px] rounded-2xl bg-white shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 snap-start group"
              >
                <div className="relative h-[120px] overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-medium">{dest.rating}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-gray-900">{dest.name}</h3>
                  <p className="text-xs text-gray-500">{dest.country}</p>
                  <p className="text-sm font-bold text-primary mt-1">{dest.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="px-4 py-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">لماذا ترافليون؟</h2>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-teal-500/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Download App Banner */}
        <section className="px-4 py-5">
          <div className="bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 rounded-3xl p-6 text-white shadow-[0_10px_40px_rgba(20,184,166,0.3)]">
            <h3 className="text-xl font-bold mb-2">حمّل تطبيق ترافليون</h3>
            <p className="text-gray-300 text-sm mb-4">
              احصل على عروض حصرية وإشعارات فورية عبر التطبيق
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                title="تحميل من App Store"
                aria-label="تحميل تطبيق ترافليون من App Store"
                className="flex-1 py-3 bg-white text-gray-900 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors text-center"
                onClick={(e) => { e.preventDefault(); alert('قريباً على App Store!'); }}
              >
                App Store
              </a>
              <a 
                href="#" 
                title="تحميل من Google Play"
                aria-label="تحميل تطبيق ترافليون من Google Play"
                className="flex-1 py-3 bg-white text-gray-900 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors text-center"
                onClick={(e) => { e.preventDefault(); alert('قريباً على Google Play!'); }}
              >
                Google Play
              </a>
            </div>
          </div>
        </section>

        {/* Footer Links */}
        <section className="px-4 py-6 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link 
              to="/privacy" 
              className="text-sm text-gray-500 hover:text-primary transition-colors"
            >
              سياسة الخصوصية
            </Link>
            <span className="text-gray-300">|</span>
            <Link 
              to="/terms" 
              className="text-sm text-gray-500 hover:text-primary transition-colors"
            >
              الشروط والأحكام
            </Link>
            <span className="text-gray-300">|</span>
            <Link 
              to="/sitemap" 
              className="text-sm text-gray-500 hover:text-primary transition-colors"
            >
              خريطة الموقع
            </Link>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            © 2026 ترافليون. جميع الحقوق محفوظة
          </p>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-white via-teal-50/50 to-white border-t border-teal-100 px-2 py-2 z-50 shadow-[0_-4px_20px_rgba(20,184,166,0.1)]">
        <div className="flex items-center justify-around">
          {[
            { icon: Globe, label: "استكشف", path: "/m", active: true },
            { icon: Plane, label: "طيران", path: "/amadeus-flights", active: false },
            { icon: Building2, label: "فنادق", path: "/hotels", active: false },
            { icon: Gift, label: "عروض", path: "/offers", active: false },
            { icon: User, label: "حسابي", path: "/login", active: false },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors",
                item.active 
                  ? "text-primary" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <item.icon className={cn(
                "w-6 h-6",
                item.active && "text-primary"
              )} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MobileHomePage;
