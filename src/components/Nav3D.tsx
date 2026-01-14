import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, X, Phone, ChevronDown, Sparkles, 
  Plane, Hotel, MapPin, Calendar, Heart, 
  CreditCard, Shield, Users, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mega Menu Data
const megaMenuItems = {
  destinations: {
    title: "الوجهات السياحية",
    items: [
      { name: "ماليزيا", icon: "🇲🇾", path: "/destinations/malaysia", hot: true },
      { name: "تايلاند", icon: "🇹🇭", path: "/destinations/thailand" },
      { name: "تركيا", icon: "🇹🇷", path: "/destinations/turkey", hot: true },
      { name: "إندونيسيا", icon: "🇮🇩", path: "/destinations/indonesia" },
      { name: "المالديف", icon: "🇲🇻", path: "/destinations/maldives" },
      { name: "جورجيا", icon: "🇬🇪", path: "/destinations/georgia" },
    ]
  },
  services: {
    title: "خدماتنا",
    items: [
      { name: "حجز الطيران", icon: Plane, path: "/amadeus-flights", desc: "جميع الخطوط العالمية" },
      { name: "الفنادق", icon: Hotel, path: "/hotels", desc: "أفضل العروض الفندقية" },
      { name: "البرامج السياحية", icon: Calendar, path: "/programs", desc: "رحلات متكاملة" },
      { name: "شهر العسل", icon: Heart, path: "/honeymoon", desc: "باقات رومانسية" },
    ]
  },
  more: {
    title: "المزيد",
    items: [
      { name: "المدونة", icon: "📝", path: "/blog" },
      { name: "تقسيط تابي", icon: CreditCard, path: "/tabby" },
      { name: "ضمان الجودة", icon: Shield, path: "/service-guarantee" },
      { name: "من نحن", icon: Users, path: "/about" },
    ]
  }
};

const Nav3D = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);

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

  const navLinks = [
    { name: "الرئيسية", path: "/", hasDropdown: false },
    { name: "الوجهات", path: "/destinations", hasDropdown: true, dropdownKey: "destinations" },
    { name: "الخدمات", path: "/services", hasDropdown: true, dropdownKey: "services" },
    { name: "البرامج", path: "/programs", hasDropdown: false },
    { name: "شهر العسل", path: "/honeymoon", hasDropdown: false },
    { name: "العروض", path: "/offers", hasDropdown: false },
    { name: "الشركة", path: "/about", hasDropdown: false },
    { name: "تواصل معنا", path: "/contact", hasDropdown: false },
  ];

  const handleDropdownToggle = (key: string) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  return (
    <>
      {/* 3D Navigation Bar */}
      <nav
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
          isScrolled ? "py-2" : "py-3 md:py-4"
        )}
      >
        <div className="container px-3 md:px-4">
          <div
            className={cn(
              "relative flex items-center justify-between rounded-2xl md:rounded-[2rem] px-4 md:px-6 py-3 md:py-4 transition-all duration-500",
              // Enhanced Glass Effect for better visibility
              isScrolled
                ? "bg-white/95 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.15),0_4px_12px_rgba(0,0,0,0.1)] border border-gray-200/50"
                : "bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
              // 3D Transform
              "transform-gpu"
            )}
          >
            {/* 3D Bottom Shadow Layer */}
            <div
              className={cn(
                "absolute inset-x-4 -bottom-2 h-8 rounded-[2rem] blur-xl transition-opacity duration-500",
                isScrolled ? "bg-luxury-navy/10 opacity-60" : "bg-black/20 opacity-40"
              )}
              style={{ transform: "translateZ(-20px)" }}
            />

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group relative z-10">
              <div className="relative transform-gpu transition-all duration-500 group-hover:scale-110">
                {/* Logo Container with 3D effect */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 overflow-hidden",
                    "bg-white/95 backdrop-blur-sm",
                    "shadow-[0_4px_20px_rgba(20,184,166,0.3)]"
                  )}
                  style={{
                    transform: "perspective(100px) rotateX(5deg) rotateY(-5deg)",
                  }}
                >
                  <img 
                    src="/traveliun-logo.png" 
                    alt="Traveliun Logo" 
                    className="w-full h-full object-contain p-1.5"
                  />
                </div>
                {/* Glow Indicator */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-luxury-gold rounded-full animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.6)]" />
              </div>
              <div>
                <span className={cn(
                  "text-2xl font-bold transition-colors duration-300",
                  isScrolled ? "text-luxury-navy" : "text-white drop-shadow-lg"
                )}>
                  ترافليون
                </span>
                <span className={cn(
                  "text-[10px] block tracking-[0.3em] uppercase transition-colors duration-300",
                  isScrolled ? "text-luxury-teal" : "text-white/70"
                )}>
                  TRAVELIUN
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 relative z-10">
              {navLinks.map((link) => (
                <div key={link.path} className="relative">
                  {link.hasDropdown ? (
                    <button
                      onClick={() => handleDropdownToggle(link.dropdownKey!)}
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
                        "absolute top-full right-0 mt-3 w-72 md:w-80 p-4 md:p-6 rounded-2xl md:rounded-3xl",
                        "bg-white border border-gray-100",
                        "shadow-[0_20px_60px_rgba(0,0,0,0.2),0_8px_24px_rgba(0,0,0,0.12)]",
                        "animate-reveal"
                      )}
                    >
                      {/* Arrow */}
                      <div className="absolute -top-2 right-8 w-4 h-4 bg-white rotate-45 border-t border-l border-white/50" />
                      
                      <h3 className="text-sm font-bold text-luxury-navy mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-luxury-teal rounded-full" />
                        {megaMenuItems[link.dropdownKey as keyof typeof megaMenuItems]?.title}
                      </h3>
                      
                      <div className="space-y-2">
                        {megaMenuItems[link.dropdownKey as keyof typeof megaMenuItems]?.items.map((item, i) => (
                          <Link
                            key={i}
                            to={item.path}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-luxury-teal/10 transition-all group"
                          >
                            {typeof item.icon === "string" ? (
                              <span className="text-2xl">{item.icon}</span>
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-luxury-teal/10 flex items-center justify-center group-hover:bg-luxury-teal group-hover:text-white transition-all">
                                <item.icon className="w-5 h-5 text-luxury-teal group-hover:text-white" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-luxury-navy group-hover:text-luxury-teal transition-colors">
                                  {item.name}
                                </span>
                                {"hot" in item && item.hot && (
                                  <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full">HOT</span>
                                )}
                              </div>
                              {"desc" in item && (
                                <span className="text-xs text-muted-foreground">{item.desc}</span>
                              )}
                            </div>
                            <ArrowLeft className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA & Mobile Toggle */}
            <div className="flex items-center gap-3 relative z-10">
              <a
                href="https://api.whatsapp.com/send?phone=966569222111"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "hidden sm:flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300",
                  "bg-gradient-to-r from-luxury-gold to-amber-500 text-luxury-navy",
                  "shadow-[0_4px_20px_rgba(234,179,8,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]",
                  "hover:shadow-[0_8px_30px_rgba(234,179,8,0.5)] hover:scale-105",
                  "transform-gpu"
                )}
              >
                <Phone className="w-4 h-4" />
                <span>احجز الآن</span>
              </a>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  "lg:hidden w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                  "transform-gpu hover:scale-105",
                  isScrolled
                    ? "bg-luxury-navy text-white shadow-lg"
                    : "bg-white/20 backdrop-blur-sm text-white border border-white/30"
                )}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen 3D */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-500",
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
            "relative h-full flex flex-col items-center justify-center p-8 transition-all duration-700",
            isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
          style={{ perspective: "1000px" }}
        >
          <div className="space-y-4 text-center w-full max-w-sm">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block text-2xl font-bold text-white py-4 px-6 rounded-2xl transition-all duration-500",
                  "hover:bg-white/10 hover:scale-105",
                  "transform-gpu"
                )}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  transform: isMobileMenuOpen
                    ? `perspective(500px) rotateX(0deg) translateZ(0)`
                    : `perspective(500px) rotateX(-20deg) translateZ(-50px)`,
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile CTA */}
          <a
            href="https://api.whatsapp.com/send?phone=966569222111"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mt-12 flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg transition-all",
              "bg-gradient-to-r from-luxury-gold to-amber-500 text-luxury-navy",
              "shadow-[0_8px_30px_rgba(234,179,8,0.5)]",
              "hover:scale-105 transform-gpu"
            )}
          >
            <Phone className="w-5 h-5" />
            احجز رحلتك الآن
          </a>
        </div>
      </div>
    </>
  );
};

export default Nav3D;
