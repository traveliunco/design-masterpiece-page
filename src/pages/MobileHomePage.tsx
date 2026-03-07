import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, User, Plane, Building2, Gift, Star } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";
import { mobileHomepageService, type MobileHomepageData } from "@/services/adminDataService";
import SkyscannerSearch from "@/components/SkyscannerSearch";

const MobileHomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [destSlideIndex, setDestSlideIndex] = useState(0);
  const [data, setData] = useState<MobileHomepageData>(mobileHomepageService.getData());

  // تحديث البيانات عند كل تحميل
  useEffect(() => {
    setData(mobileHomepageService.getData());
  }, []);

  const activeDeals = data.deals.filter((d) => d.is_active).sort((a, b) => a.order - b.order);
  const activeDestinations = data.destinations.filter((d) => d.is_active).sort((a, b) => a.order - b.order);
  const activeQuickActions = data.quickActions.filter((q) => q.is_active).sort((a, b) => a.order - b.order);
  const activeFeatures = data.features.filter((f) => f.is_active).sort((a, b) => a.order - b.order);
  const activeBottomNav = data.bottomNav.filter((n) => n.is_active).sort((a, b) => a.order - b.order);

  // Auto-slide destinations
  useEffect(() => {
    if (activeDestinations.length === 0) return;
    const timer = setInterval(() => {
      setDestSlideIndex((prev) => (prev + 1) % activeDestinations.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [activeDestinations.length]);

  useSEO({
    title: `${data.heroTitle || "ترافليون"} - احجز رحلتك بسهولة | فنادق، طيران، جولات`,
    description: "احجز رحلتك مع ترافليون. أفضل العروض على الطيران والفنادق والجولات السياحية. خدمة 24/7 وضمان أفضل الأسعار.",
    keywords: "ترافليون, حجز طيران, حجز فنادق, سياحة, سفر, عروض سياحية"
  });

  const handleSearch = () => {
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo-white.png" alt="ترافليون" className="w-8 h-8 object-contain" />
            <span className="font-bold text-lg text-gray-900">{data.heroTitle || "ترافليون"}</span>
          </Link>
          <div className="flex items-center gap-3">
            <button title="الإشعارات" aria-label="الإشعارات" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Link to="/login" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <User className="w-5 h-5 text-gray-600" />
            </Link>
          </div>
        </div>
        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-3 cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => navigate('/search')}>
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder={data.searchPlaceholder || "إلى أين تريد السفر؟"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500" />
            
          </div>
        </div>
      </header>

      <main className="pb-24">
        {/* Flight Search Widget - Skyscanner Style */}
        <section className="pt-4 pb-2 py-0 px-0">
          <SkyscannerSearch variant="mobile" />
        </section>

        {/* Quick Actions Grid */}
        {activeQuickActions.length > 0 &&
        <section className="px-4 py-5">
            <div className={cn("grid gap-3", activeQuickActions.length <= 3 ? "grid-cols-3" : "grid-cols-4")}>
              {activeQuickActions.map((action) =>
            <Link key={action.id} to={action.path} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 active:scale-95">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl", action.color)}>
                    {action.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-700">{action.label}</span>
                </Link>
            )}
            </div>
          </section>
        }

        {/* Deals Banner Carousel */}
        {activeDeals.length > 0 &&
        <section className="px-4 py-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">عروض حصرية</h2>
              <Link to="/offers" className="text-sm text-primary font-medium flex items-center gap-1">عرض الكل</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory">
              {activeDeals.map((deal) =>
            <Link
              key={deal.id}
              to={deal.link || "/offers"}
              className={cn("flex-shrink-0 w-[280px] p-5 rounded-2xl bg-gradient-to-br text-white snap-start", deal.gradient)}>
              
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white/80 text-sm mb-1">{deal.subtitle}</p>
                      <h3 className="text-xl font-bold">{deal.title}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">{deal.icon}</div>
                  </div>
                  <span className="mt-4 px-4 py-2 bg-white/20 rounded-full text-sm font-medium hover:bg-white/30 transition-colors inline-block">احجز الآن</span>
                </Link>
            )}
            </div>
          </section>
        }

        {/* Popular Destinations - Auto Slider */}
        {activeDestinations.length > 0 &&
        <section className="py-5">
            <div className="flex items-center justify-between mb-4 px-4">
              <h2 className="text-lg font-bold text-gray-900">الوجهات الأكثر شعبية</h2>
              <Link to="/destinations" className="text-sm text-primary font-medium">عرض الكل</Link>
            </div>
            <div className="relative overflow-hidden">
              <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(${destSlideIndex * 170}px)` }}>
                {activeDestinations.map((dest) =>
              <Link key={dest.id} to={`/country/${dest.countrySlug}/city/${dest.slug}`} className="flex-shrink-0 w-[160px] mx-[5px] rounded-2xl bg-white shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    <div className="relative h-[120px] overflow-hidden">
                      <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
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
              )}
              </div>
            </div>
            <div className="flex justify-center gap-1.5 mt-3">
              {activeDestinations.map((_, i) =>
            <button key={i} onClick={() => setDestSlideIndex(i)} className={cn("h-1.5 rounded-full transition-all duration-300", i === destSlideIndex ? "bg-primary w-5" : "bg-gray-300 w-1.5")} aria-label={`الشريحة ${i + 1}`} />
            )}
            </div>
          </section>
        }

        {/* Features */}
        {activeFeatures.length > 0 &&
        <section className="px-4 py-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">لماذا ترافليون؟</h2>
            <div className="grid grid-cols-2 gap-3">
              {activeFeatures.map((feature) =>
            <div key={feature.id} className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-teal-500/10 flex items-center justify-center text-xl">{feature.icon}</div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-xs text-gray-500">{feature.desc}</p>
                  </div>
                </div>
            )}
            </div>
          </section>
        }

        {/* App Banner */}
        {data.appBanner.is_visible &&
        <section className="px-4 py-5">
            <div className="bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 rounded-3xl p-6 text-white shadow-[0_10px_40px_rgba(20,184,166,0.3)]">
              <h3 className="text-xl font-bold mb-2">{data.appBanner.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{data.appBanner.description}</p>
              <div className="flex gap-3">
                <a href={data.appBanner.appStoreLink || "#"} title={data.appBanner.appStoreLabel} aria-label={`تحميل تطبيق ترافليون من ${data.appBanner.appStoreLabel}`} className="flex-1 py-3 bg-white text-gray-900 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors text-center" onClick={(e) => {if (!data.appBanner.appStoreLink || data.appBanner.appStoreLink === "#") {e.preventDefault();alert("قريباً!");}}}>
                  {data.appBanner.appStoreLabel}
                </a>
                <a href={data.appBanner.playStoreLink || "#"} title={data.appBanner.playStoreLabel} aria-label={`تحميل تطبيق ترافليون من ${data.appBanner.playStoreLabel}`} className="flex-1 py-3 bg-white text-gray-900 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors text-center" onClick={(e) => {if (!data.appBanner.playStoreLink || data.appBanner.playStoreLink === "#") {e.preventDefault();alert("قريباً!");}}}>
                  {data.appBanner.playStoreLabel}
                </a>
              </div>
            </div>
          </section>
        }

        {/* Footer Links */}
        <section className="px-4 py-6 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-primary transition-colors">سياسة الخصوصية</Link>
            <span className="text-gray-300">|</span>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-primary transition-colors">الشروط والأحكام</Link>
            <span className="text-gray-300">|</span>
            <Link to="/sitemap" className="text-sm text-gray-500 hover:text-primary transition-colors">خريطة الموقع</Link>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">© 2026 ترافليون. جميع الحقوق محفوظة</p>
        </section>
      </main>

      {/* Bottom Navigation — ديناميكية */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-white via-teal-50/50 to-white border-t border-teal-100 px-2 py-2 z-50 shadow-[0_-4px_20px_rgba(20,184,166,0.1)]">
        <div className="flex items-center justify-around">
          {activeBottomNav.map((item, index) =>
          <Link key={item.id} to={item.path} className={cn("flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors", index === 0 ? "text-primary" : "text-gray-500 hover:text-gray-700")}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )}
        </div>
      </nav>
    </div>);

};

export default MobileHomePage;