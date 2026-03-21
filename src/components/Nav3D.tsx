import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, X, Phone, ChevronDown, Sparkles, 
  Plane, Hotel, MapPin, Calendar, Heart, 
  CreditCard, Shield, Users, ArrowLeft,
  DollarSign, Globe, Search, User, MapPinned, Package,
  Instagram, Twitter, Facebook
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/contexts/NavigationContext";
import { navService, systemSettingsService, type NavLink } from "@/services/adminDataService";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useSystemSettings } from "@/hooks/useSystemSettings";

// Mega Menu Data
const megaMenuItems = {
  countries: {
    title: "الدول والمدن السياحية",
    countries: [
      {
        name: "ماليزيا",
        path: "/country/malaysia",
        cities: [
          { name: "كوالالمبور", path: "/country/malaysia/city/kuala-lumpur" },
          { name: "بينانغ", path: "/country/malaysia/city/penang" },
          { name: "لانغكاوي", path: "/country/malaysia/city/langkawi" },
          { name: "كوتا كينابالو", path: "/country/malaysia/city/kota-kinabalu" }
        ]
      },
      {
        name: "تايلاند",
        path: "/country/thailand",
        cities: [
          { name: "بانكوك", path: "/country/thailand/city/bangkok" },
          { name: "بوكيت", path: "/country/thailand/city/phuket" },
          { name: "تشيانغ ماي", path: "/country/thailand/city/chiang-mai" },
          { name: "باتايا", path: "/country/thailand/city/pattaya" }
        ]
      },
      {
        name: "إندونيسيا",
        path: "/country/indonesia",
        cities: [
          { name: "بالي", path: "/country/indonesia/city/bali" },
          { name: "جاكرتا", path: "/country/indonesia/city/jakarta" },
          { name: "يوغياكارتا", path: "/country/indonesia/city/yogyakarta" },
          { name: "ميدون", path: "/country/indonesia/city/medan" }
        ]
      },
      {
        name: "سنغافورة",
        path: "/country/singapore",
        cities: [
          { name: "سنغافورة", path: "/country/singapore/city/singapore" }
        ]
      },
      {
        name: "فيتنام",
        path: "/country/vietnam",
        cities: [
          { name: "هانوي", path: "/country/vietnam/city/hanoi" },
          { name: "هو تشي مينه", path: "/country/vietnam/city/ho-chi-minh" },
          { name: "هالونغ", path: "/country/vietnam/city/ha-long" },
          { name: "دا نانغ", path: "/country/vietnam/city/da-nang" }
        ]
      },
      {
        name: "الفلبين",
        path: "/country/philippines",
        cities: [
          { name: "مانيلا", path: "/country/philippines/city/manila" },
          { name: "سيبو", path: "/country/philippines/city/cebu" },
          { name: "بوراكاي", path: "/country/philippines/city/boracay" },
          { name: "بالاوان", path: "/country/philippines/city/palawan" }
        ]
      },
      {
        name: "تركيا",
        path: "/country/turkey",
        cities: [
          { name: "إسطنبول", path: "/country/turkey/city/istanbul" },
          { name: "أنطاليا", path: "/country/turkey/city/antalya" },
          { name: "كبادوكيا", path: "/country/turkey/city/cappadocia" },
          { name: "بورصة", path: "/country/turkey/city/bursa" }
        ]
      }
    ]
  },
  services: {
    title: "خدماتنا",
    items: [
      { name: "حجز الطيران", icon: Plane, path: "/flights", desc: "أفضل أسعار تذاكر الطيران" },
      { name: "حجز الفنادق", icon: Hotel, path: "/hotels", desc: "فنادق مختارة بعناية" },
      { name: "البرامج السياحية", icon: Calendar, path: "/programs", desc: "برامج شاملة ومتكاملة" },
      { name: "شهر العسل", icon: Heart, path: "/honeymoon", desc: "باقات رومانسية مميزة" },
      { name: "العروض الخاصة", icon: Sparkles, path: "/offers", desc: "خصومات حصرية", hot: true },
      { name: "صمم رحلتك", icon: MapPinned, path: "/trip-builder", desc: "بكج سفر مخصص بالكامل", hot: true },
    ]
  },
  more: {
    title: "المزيد",
    items: [
      { name: "الكرة الأرضية", icon: Globe, path: "/globe", desc: "استكشف العالم ثلاثي الأبعاد" },
      { name: "المدونة", icon: MapPinned, path: "/blog", desc: "مقالات ونصائح السفر" },
      { name: "تقسيط تابي", icon: CreditCard, path: "/tabby", desc: "ادفع على 4 دفعات" },
      { name: "تقسيط تمارا", icon: CreditCard, path: "/tamara", desc: "قسّط مشترياتك" },
      { name: "برنامج الولاء", icon: Heart, path: "/loyalty", desc: "اكسب النقاط" },
      { name: "دعم العملاء", icon: Phone, path: "/customer-support", desc: "نحن هنا لمساعدتك" },
      { name: "ضمان الخدمة", icon: Shield, path: "/service-guarantee", desc: "جودة مضمونة" },
      { name: "الوظائف", icon: Users, path: "/careers", desc: "انضم لفريقنا" },
      { name: "من نحن", icon: Users, path: "/about", desc: "تعرف علينا" },
      { name: "تواصل معنا", icon: Phone, path: "/contact", desc: "راسلنا" },
      { name: "خريطة الموقع", icon: MapPin, path: "/sitemap", desc: "جميع الصفحات" },
    ]
  }
};

const Nav3D = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useNavigation();
  const { favorites, favoriteCities, favoriteDestinations, favoriteOffers, favoritesCount, destinationsCount, offersCount, citiesCount, removeFavorite } = useFavorites();
  const navigateRouter = useNavigate();
  const { user } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showFavPanel, setShowFavPanel] = useState<'cities' | 'destinations' | 'offers' | null>(null);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [currency, setCurrency] = useState<'SAR' | 'USD' | 'EUR'>('SAR');
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);

  // إعدادات النظام الحية
  const sysSettings = useSystemSettings();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // ✅ روابط القائمة من localStorage (تتحدث عند كل تنقل)
  const [navLinks, setNavLinks] = useState<NavLink[]>(() => navService.getNavLinks());
  useEffect(() => {
    setNavLinks(navService.getNavLinks());
  }, [location.pathname]);
  const activeNavLinks = navLinks.filter(l => l.is_active).sort((a, b) => a.order - b.order);



  const handleDropdownToggle = (key: string) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  return (
    <>
      {/* Top Bar */}
      {sysSettings.header.showTopBar && (
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-teal-600 to-cyan-500 text-white text-xs py-2 px-4 flex items-center justify-between z-[calc(var(--z-navigation)+1)] shadow-md">
          <div className="flex-1 text-center font-bold tracking-wide animate-pulse-slow">
            {sysSettings.header.topBarText}
          </div>
          {sysSettings.header.topBarPhone && (
            <div className="hidden md:flex items-center gap-2 text-white" dir="ltr">
              <Phone className="w-3.5 h-3.5" />
              <span className="font-semibold">{sysSettings.header.topBarPhone}</span>
            </div>
          )}
        </div>
      )}

      {/* 3D Navigation Bar */}
      <nav
        ref={navRef}
        className={cn(
          "fixed left-0 right-0 transition-all duration-500",
          sysSettings.header.showTopBar ? "top-8" : "top-0",
          "z-[var(--z-navigation)]"
        )}
      >
        <div className="w-full">
          <div
            className={cn(
              "relative flex items-center justify-between px-6 py-3 transition-all duration-500",
              // Unified Glass Effect
              isScrolled
                ? "bg-white/95 backdrop-blur-md shadow-lg"
                : "bg-gradient-to-r from-luxury-navy/90 via-luxury-navy/80 to-luxury-navy/90 backdrop-blur-sm",
              // 3D Transform
              "transform-gpu"
            )}
          >
            {/* 3D Bottom Shadow Layer */}
            <div
              className={cn(
                "absolute inset-x-6 -bottom-4 h-12 rounded-[2rem] blur-2xl transition-opacity duration-500",
                isScrolled ? "bg-luxury-navy/5 opacity-40" : "bg-black/20 opacity-0"
              )}
              style={{ transform: "translateZ(-20px)" }}
            />

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group relative z-10">
              <div className="relative transform-gpu transition-all duration-500 group-hover:scale-110">
                {/* 3D Animated Logo Container */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden
                    bg-gradient-to-br from-primary via-teal-500 to-teal-600
                    shadow-[0_8px_30px_rgba(20,184,166,0.5),0_0_60px_rgba(20,184,166,0.3)]
                    animate-[float3d_4s_ease-in-out_infinite]
                    group-hover:shadow-[0_12px_40px_rgba(20,184,166,0.7),0_0_80px_rgba(20,184,166,0.4)]
                    transition-all duration-500"
                  style={{
                    transformStyle: 'preserve-3d',
                    animation: 'float3d 4s ease-in-out infinite, rotate3d 8s linear infinite',
                  }}
                >
                  {/* Inner glow layer */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent rounded-2xl" />
                  
                  {/* Logo image */}
                  <img 
                    src="/logo-white.png" 
                    alt="Traveliun Logo" 
                    className="w-10 h-10 object-contain relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                    style={{
                      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))',
                    }}
                  />
                  
                  {/* Shine effect */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-[shine_3s_ease-in-out_infinite]"
                    style={{ transform: 'translateX(-100%)' }}
                  />
                </div>
                
                {/* Floating particles around logo */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-luxury-gold rounded-full animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-[pulse_2.5s_ease-in-out_infinite_0.5s] shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                <div className="absolute top-1/2 -right-2 w-1.5 h-1.5 bg-white rounded-full animate-[pulse_3s_ease-in-out_infinite_1s] shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </div>
              <div>
                <span className={cn(
                  "text-2xl font-bold transition-colors duration-300",
                  isScrolled ? "text-luxury-navy" : "text-white drop-shadow-lg"
                )}>
                  {sysSettings.header.siteName}
                </span>
                <span className={cn(
                  "text-[10px] block tracking-[0.3em] uppercase transition-colors duration-300",
                  isScrolled ? "text-luxury-teal" : "text-white/70"
                )}>
                  {sysSettings.header.siteNameEn}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 relative z-10">
              {activeNavLinks.map((link) => (
                <div key={link.path} className="relative">
                  {link.hasDropdown ? (
                    <button
                      onClick={() => handleDropdownToggle(link.dropdownKey!)}
                      aria-expanded={activeDropdown === link.dropdownKey}
                      aria-haspopup="true"
                      aria-label={`${link.name} قائمة`}
                      className={cn(
                        "flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                        activeDropdown === link.dropdownKey
                          ? "bg-luxury-teal text-white shadow-[0_4px_20px_rgba(20,184,166,0.4)]"
                          : isScrolled
                            ? "text-luxury-navy hover:bg-luxury-teal/10 hover:text-luxury-teal"
                            : "text-white/90 hover:bg-white/10"
                      )}
                    >
                      {link.name}
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform duration-300",
                        activeDropdown === link.dropdownKey && "rotate-180"
                      )} />
                    </button>
                  ) : (
                    <Link
                      to={link.path}
                      className={cn(
                        "px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 block",
                        location.pathname === link.path
                          ? "bg-luxury-teal text-white shadow-[0_4px_20px_rgba(20,184,166,0.4)]"
                          : isScrolled
                            ? "text-luxury-navy hover:bg-luxury-teal/10 hover:text-luxury-teal"
                            : "text-white/90 hover:bg-white/10"
                      )}
                    >
                      {link.name}
                    </Link>
                  )}

                  {/* Mega Dropdown */}
                  {link.hasDropdown && activeDropdown === link.dropdownKey && (
                    <div
                      className={cn(
                        "absolute top-full mt-3 p-8 rounded-[2.5rem]",
                        "bg-white/95 backdrop-blur-xl border border-white/20",
                        "shadow-[0_40px_100px_rgba(0,0,0,0.15),0_15px_40px_rgba(0,0,0,0.1)]",
                        "animate-reveal",
                        link.dropdownKey === "countries" 
                          ? "fixed left-0 right-0 mx-auto w-[95vw] lg:w-[1200px] max-w-[calc(100vw-2rem)]" 
                          : link.dropdownKey === "more"
                            ? "fixed left-0 right-0 mx-auto w-[95vw] lg:w-[900px] max-w-[calc(100vw-2rem)]"
                            : "absolute right-0 w-96"
                      )}
                    >
                      {/* Arrow */}
                      <div className={cn(
                        "absolute -top-2 w-4 h-4 bg-white rotate-45 border-t border-l border-white/20",
                        link.dropdownKey === "countries" ? "hidden md:block right-1/2 translate-x-1/2" : "right-8"
                      )} />

                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-luxury-navy flex items-center gap-3">
                          <div className="w-3 h-3 bg-luxury-teal rounded-full animate-pulse" />
                          {megaMenuItems[link.dropdownKey as keyof typeof megaMenuItems]?.title}
                        </h3>
                        {link.dropdownKey === "countries" && (
                          <Link 
                            to="/destinations" 
                            className="text-luxury-teal text-sm font-semibold hover:underline"
                            onClick={() => setActiveDropdown(null)}
                          >
                            عرض الكل
                          </Link>
                        )}
                      </div>

                      <div className={cn(
                        link.dropdownKey === "countries" 
                          ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6" 
                          : link.dropdownKey === "more"
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                            : "space-y-4"
                      )}>
                        {link.dropdownKey === "countries" ? (
                          megaMenuItems.countries?.countries.map((country, i) => (
                            <div key={i} className="flex flex-col space-y-4">
                              {/* Country Header */}
                              <Link
                                to={country.path}
                                onClick={() => setActiveDropdown(null)}
                                className="group flex flex-col items-center gap-2 p-2 rounded-2xl hover:bg-luxury-teal/5 transition-all text-center"
                              >
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-luxury-teal/10 to-luxury-teal/20 flex items-center justify-center group-hover:from-luxury-teal group-hover:to-luxury-gold transition-all duration-500 shadow-sm">
                                  <MapPin className="w-6 h-6 text-luxury-teal group-hover:text-white" />
                                </div>
                                <span className="font-bold text-luxury-navy group-hover:text-luxury-teal transition-colors text-base">
                                  {country.name}
                                </span>
                              </Link>

                              {/* Cities List */}
                              <div className="flex flex-col gap-1.5">
                                {country.cities.map((city, j) => (
                                  <Link
                                    key={j}
                                    to={city.path}
                                    onClick={() => setActiveDropdown(null)}
                                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-luxury-teal hover:bg-luxury-teal/5 rounded-lg transition-all flex items-center gap-2 group/city"
                                  >
                                    <div className="w-1 h-1 rounded-full bg-gray-300 group-hover/city:bg-luxury-teal transition-colors" />
                                    {city.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          ('items' in (megaMenuItems[link.dropdownKey as keyof typeof megaMenuItems] || {}) ? (megaMenuItems[link.dropdownKey as keyof typeof megaMenuItems] as any).items : []).map((item: any, i: number) => (
                            <Link
                              key={i}
                              to={item.path}
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-luxury-teal/10 transition-all group border border-transparent hover:border-luxury-teal/20"
                            >
                              {typeof item.icon === "string" ? (
                                <span className="text-2xl">{item.icon}</span>
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-luxury-teal/10 flex items-center justify-center group-hover:bg-luxury-teal group-hover:text-white transition-all duration-500">
                                  <item.icon className="w-6 h-6 text-luxury-teal group-hover:text-white" />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-luxury-navy group-hover:text-luxury-teal transition-colors">
                                    {item.name}
                                  </span>
                                  {"hot" in item && item.hot && (
                                    <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full animate-bounce">HOT</span>
                                  )}
                                </div>
                                {"desc" in item && (
                                  <span className="text-xs text-muted-foreground">{item.desc}</span>
                                )}
                              </div>
                              <ArrowLeft className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA & Mobile Toggle */}
            <div className="flex items-center gap-2 relative z-10">
              {/* Search */}
              {sysSettings.header.showSearchBar && (
                <button
                  onClick={() => navigateRouter('/search')}
                  className={cn(
                    "hidden md:flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
                    isScrolled
                      ? "text-luxury-navy hover:bg-luxury-teal/10 hover:text-luxury-teal"
                      : "text-white/90 hover:bg-white/10"
                  )}
                  title="بحث"
                  aria-label="بحث في الموقع"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}

              {/* Currency Switcher */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => {
                    const currencies: ('SAR' | 'USD' | 'EUR')[] = ['SAR', 'USD', 'EUR'];
                    const currentIndex = currencies.indexOf(currency);
                    setCurrency(currencies[(currentIndex + 1) % currencies.length]);
                  }}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300",
                    isScrolled
                      ? "text-luxury-navy hover:bg-luxury-teal/10 hover:text-luxury-teal"
                      : "text-white/90 hover:bg-white/10"
                  )}
                  title="تبديل العملة"
                  aria-label={`تبديل العملة. الحالية: ${currency}`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>{currency}</span>
                </button>
              </div>

              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className={cn(
                  "hidden md:flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300",
                  isScrolled
                    ? "text-luxury-navy hover:bg-luxury-teal/10 hover:text-luxury-teal"
                    : "text-white/90 hover:bg-white/10"
                )}
                title="تبديل اللغة"
                aria-label={`تبديل اللغة. الحالية: ${language === 'ar' ? 'العربية' : 'English'}`}
                >
                <Globe className="w-4 h-4" />
                <span>{language === 'ar' ? 'EN' : 'عر'}</span>
              </button>

              {/* Saved Places - Destinations */}
              <button
                onClick={() => {
                  if (destinationsCount > 0) {
                    setShowFavPanel(showFavPanel === 'destinations' ? null : 'destinations');
                  } else {
                    navigateRouter('/destinations');
                  }
                }}
                className={cn(
                  "hidden md:flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 relative",
                  destinationsCount > 0
                    ? (isScrolled ? "text-emerald-600 hover:bg-emerald-50" : "text-emerald-400 hover:bg-white/10")
                    : (isScrolled ? "text-luxury-navy hover:bg-luxury-teal/10 hover:text-luxury-teal" : "text-white/90 hover:bg-white/10")
                )}
                title={destinationsCount > 0 ? `الوجهات المفضلة (${destinationsCount})` : "تصفح الوجهات"}
                aria-label="الوجهات المفضلة"
              >
                <MapPinned className="w-5 h-5" />
                {destinationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{destinationsCount}</span>
                )}
              </button>

              {/* Saved Offers */}
              <button
                onClick={() => {
                  if (offersCount > 0) {
                    setShowFavPanel(showFavPanel === 'offers' ? null : 'offers');
                  } else {
                    navigateRouter('/offers');
                  }
                }}
                className={cn(
                  "hidden md:flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 relative",
                  offersCount > 0
                    ? (isScrolled ? "text-orange-600 hover:bg-orange-50" : "text-orange-400 hover:bg-white/10")
                    : (isScrolled ? "text-luxury-navy hover:bg-luxury-teal/10 hover:text-luxury-teal" : "text-white/90 hover:bg-white/10")
                )}
                title={offersCount > 0 ? `العروض المفضلة (${offersCount})` : "تصفح العروض"}
                aria-label="العروض المفضلة"
              >
                <Package className="w-5 h-5" />
                {offersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{offersCount}</span>
                )}
              </button>

              {/* Favorite Cities */}
              {citiesCount > 0 && (
                <button
                  onClick={() => setShowFavPanel(showFavPanel === 'cities' ? null : 'cities')}
                  className={cn(
                    "hidden md:flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 relative",
                    isScrolled
                      ? "text-red-500 hover:bg-red-50"
                      : "text-red-400 hover:bg-white/10"
                  )}
                  title="المدن المفضلة"
                  aria-label="المدن المفضلة"
                >
                  <Heart className="w-5 h-5 fill-current" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {citiesCount}
                  </span>
                </button>
              )}

              {/* User Profile / Login */}
              {sysSettings.header.showLoginButton && (
                <button
                  onClick={() => navigateRouter(user ? "/my-bookings" : "/login")}
                  className={cn(
                    "hidden md:flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 relative",
                    user
                      ? (isScrolled
                          ? "text-luxury-teal bg-luxury-teal/10 hover:bg-luxury-teal hover:text-white"
                          : "text-teal-300 bg-white/10 hover:bg-white/20")
                      : (isScrolled
                          ? "text-luxury-navy hover:bg-luxury-teal/10 hover:text-luxury-teal"
                          : "text-white/90 hover:bg-white/10")
                  )}
                  title={user ? `مرحباً ${user.email?.split("@")[0]} - حجوزاتي` : "تسجيل الدخول"}
                  aria-label={user ? "فتح حجوزاتي" : "تسجيل الدخول"}
                >
                  <User className="w-5 h-5" />
                  {user && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-teal-400 rounded-full border-2 border-white" />
                  )}
                </button>
              )}

              <a
                href="https://api.whatsapp.com/send?phone=966569222111"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "hidden sm:flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300",
                  "bg-gradient-to-r from-teal-500 to-cyan-500 text-white",
                  "shadow-[0_4px_20px_rgba(20,184,166,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]",
                  "hover:shadow-[0_8px_30px_rgba(20,184,166,0.5)] hover:scale-105",
                  "transform-gpu"
                )}
                aria-label="تواصل معنا عبر واتساب للحجز"
              >
                <Phone className="w-4 h-4" />
                <span>احجز الآن</span>
              </a>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة الرئيسية"}
                aria-expanded={isMobileMenuOpen}
                className={cn(
                  "lg:hidden w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                  "transform-gpu hover:scale-105",
                  isScrolled
                    ? "bg-luxury-navy text-white shadow-lg"
                    : "bg-white/20 backdrop-blur-sm text-white border border-white/30"
                )}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Favorites Panel Dropdown */}
      {showFavPanel && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowFavPanel(null)} />
          <div className="fixed top-20 left-4 md:left-auto md:right-48 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up">
            <div className={cn("p-4 flex items-center justify-between", showFavPanel === 'cities' ? 'bg-gradient-to-r from-red-500 to-pink-500' : showFavPanel === 'destinations' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-orange-500 to-amber-500')}>
              <h3 className="text-white font-bold flex items-center gap-2">
                {showFavPanel === 'cities' && <><Heart className="w-5 h-5 fill-current" />المدن المفضلة ({citiesCount})</>}
                {showFavPanel === 'destinations' && <><MapPinned className="w-5 h-5" />الوجهات المفضلة ({destinationsCount})</>}
                {showFavPanel === 'offers' && <><Package className="w-5 h-5" />العروض المفضلة ({offersCount})</>}
              </h3>
              <button onClick={() => setShowFavPanel(null)} className="text-white/80 hover:text-white" title="إغلاق">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {(showFavPanel === 'cities' ? favoriteCities : showFavPanel === 'destinations' ? favoriteDestinations : favoriteOffers).map((fav) => (
                <div key={fav.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                  {fav.image && (
                    <img src={fav.image} alt={fav.nameAr} className="w-12 h-12 rounded-xl object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => {
                        if (fav.type === 'city') navigateRouter(`/country/${fav.countryId}/city/${fav.id}`);
                        else if (fav.type === 'destination') navigateRouter(`/country/${fav.id}`);
                        else navigateRouter('/offers');
                        setShowFavPanel(null);
                      }}
                      className="text-gray-800 font-semibold text-sm hover:text-primary transition-colors truncate block w-full text-right"
                    >
                      {fav.nameAr}
                    </button>
                    {fav.type === 'offer' && fav.price && (
                      <span className="text-xs text-emerald-600 font-bold">{fav.price.toLocaleString()} ر.س</span>
                    )}
                    {fav.type === 'offer' && fav.destination && (
                      <span className="text-xs text-muted-foreground mr-2">📍 {fav.destination}</span>
                    )}
                  </div>
                  <button
                    onClick={() => removeFavorite(fav.id, fav.type)}
                    className="w-8 h-8 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition-all flex-shrink-0"
                    title="إزالة من المفضلة"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Mobile Menu - Full Screen 3D */}
      <div
        className={cn(
          "fixed inset-0 lg:hidden transition-all duration-500",
          "z-[var(--z-navigation-mobile)]",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-luxury-navy/95 backdrop-blur-xl"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={cn(
            "relative h-full flex flex-col pt-24 pb-12 px-8 overflow-y-auto no-scrollbar",
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Mobile Main Links */}
          <div className="space-y-2 mb-6">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4 px-4 text-center md:text-right">القائمة الرئيسية</p>
            {activeNavLinks
              .filter(link => !link.hasDropdown || link.path !== "#")
              .map((link, index) => (
              <Link
                key={link.path + index}
                to={link.hasDropdown && link.path === "#" ? (link.dropdownKey === 'services' ? '/programs' : link.dropdownKey === 'countries' ? '/destinations' : '/') : link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-4 text-2xl font-black text-white py-4 px-6 rounded-2xl transition-all duration-500",
                  "hover:bg-white/10 hover:scale-105 active:scale-95",
                  "transform-gpu",
                  location.pathname === link.path && "bg-white/10"
                )}
                style={{
                  transitionDelay: `${index * 50}ms`,
                  transform: isMobileMenuOpen ? "translateX(0)" : "translateX(20px)"
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-400">
                  {link.dropdownKey === 'services' ? <Sparkles className="w-5 h-5" /> : link.dropdownKey === 'countries' ? <MapPin className="w-5 h-5" /> : link.name === 'الرئيسية' ? <Plane className="w-5 h-5" /> : link.path === '/offers' ? <Heart className="w-5 h-5" /> : link.path === '/programs' ? <Calendar className="w-5 h-5" /> : link.path === '/flights' ? <Plane className="w-5 h-5" /> : link.path === '/hotels' ? <Hotel className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                </div>
                <span>{link.name}</span>
              </Link>
            ))}

            {/* Additional mobile links for dropdown-only items */}
            {[
              { name: "البرامج السياحية", path: "/programs", icon: "📋" },
              { name: "حجز الطيران", path: "/flights", icon: "✈️" },
              { name: "حجز الفنادق", path: "/hotels", icon: "🏨" },
              { name: "العروض الخاصة", path: "/offers", icon: "🎁" },
              { name: "شهر العسل", path: "/honeymoon", icon: "💕" },
            ].filter(item => !activeNavLinks.some(l => l.path === item.path)).map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 text-xl font-bold text-white/80 py-3 px-6 rounded-2xl hover:bg-white/10 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <span className="text-lg">{item.icon}</span>
                </div>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* More Services Section */}
          <div className="mb-6">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4 px-4 text-center md:text-right">المزيد من الخدمات</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "الكرة الأرضية", path: "/globe", icon: "🌍" },
                { name: "المدونة", path: "/blog", icon: "📝" },
                // { name: "السيارات", path: "/car-rental", icon: "🚗" }, /* HIDDEN */
                // { name: "التأشيرات", path: "/visas", icon: "🛂" }, /* HIDDEN */
                // { name: "التأمين", path: "/insurance", icon: "🛡️" }, /* HIDDEN */
                { name: "تابي", path: "/tabby", icon: "💳" },
                { name: "الولاء", path: "/loyalty", icon: "💎" },
                { name: "الدعم", path: "/customer-support", icon: "🎧" },
                { name: "من نحن", path: "/about", icon: "ℹ️" },
              ].map((item, idx) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center gap-1 hover:bg-white/10 transition-all active:scale-95"
                  style={{ transitionDelay: `${(navLinks.length + idx) * 30}ms` }}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-white text-[10px] font-bold text-center">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Destinations Quick Access */}
          <div className="mb-10">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4 px-4 text-center md:text-right">وجهات مختارة</p>
            <div className="grid grid-cols-2 gap-3">
              {['ماليزيا', 'تايلاند', 'إندونيسيا', 'تركيا'].map((country, idx) => (
                <Link
                  key={country}
                  to={`/country/${country === 'ماليزيا' ? 'malaysia' : country === 'تايلاند' ? 'thailand' : country === 'إندونيسيا' ? 'indonesia' : 'turkey'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition-all active:scale-95"
                  style={{ transitionDelay: `${(navLinks.length + idx) * 50}ms` }}
                >
                  <span className="text-2xl">{country === 'ماليزيا' ? '🇲🇾' : country === 'تايلاند' ? '🇹🇭' : country === 'إندونيسيا' ? '🇮🇩' : '🇹🇷'}</span>
                  <span className="text-white text-sm font-bold">{country}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-6">
            <a
              href="https://api.whatsapp.com/send?phone=966569222111"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-center gap-3 w-full py-5 rounded-3xl font-black text-lg transition-all",
                "bg-gradient-to-r from-teal-500 to-cyan-500 text-white",
                "shadow-[0_8px_30px_rgba(20,184,166,0.5)]",
                "hover:scale-105 active:scale-95 transform-gpu"
              )}
            >
              <Phone className="w-6 h-6" />
              تحدث مع مستشار السفر
            </a>

            {/* Social Icons */}
            <div className="flex justify-center gap-4">
              {[
                { Icon: Instagram, url: "https://instagram.com/traveliun", label: "Instagram" },
                { Icon: Twitter, url: "https://twitter.com/traveliun", label: "Twitter" },
                { Icon: Facebook, url: "https://facebook.com/traveliun", label: "Facebook" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                >
                  <social.Icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            <p className="text-center text-white/30 text-[10px] tracking-widest font-medium">
              © {new Date().getFullYear()} TRAVELIUN. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Nav3D);
