import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, X, Phone, ChevronDown, Plane, Hotel, MapPin, Car, FileText, Shield, 
  User, LogOut, LogIn, Zap, Heart, Globe, Star, Gift, Building2, Users, 
  MessageSquare, Award, Briefcase, HelpCircle, Info
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();

  const getUserDisplayName = () => {
    if (!user) return null;
    const metadata = user.user_metadata;
    if (metadata?.first_name) {
      return metadata.first_name;
    }
    return user.email?.split('@')[0] || 'مستخدم';
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.paddingTop = "80px";
    return () => {
      document.body.style.paddingTop = "0";
    };
  }, []);

  // === MENU DATA WITH SUBMENUS ===
  const menuData = {
    destinations: {
      name: "الوجهات",
      items: [
        { name: "جميع الوجهات", path: "/destinations", icon: Globe, desc: "استعرض كل الوجهات السياحية" },
        { name: "ماليزيا", path: "/destinations/malaysia", icon: MapPin, desc: "كوالالمبور - لنكاوي - بينانج" },
        { name: "تركيا", path: "/destinations/turkey", icon: MapPin, desc: "اسطنبول - أنطاليا - كابادوكيا" },
        { name: "تايلاند", path: "/destinations/thailand", icon: MapPin, desc: "بانكوك - بوكيت - كرابي" },
        { name: "إندونيسيا", path: "/destinations/indonesia", icon: MapPin, desc: "بالي - جاكرتا - يوغياكرتا" },
        { name: "المالديف", path: "/destinations/maldives", icon: MapPin, desc: "جزر المالديف الساحرة" },
        { name: "جورجيا", path: "/destinations/georgia", icon: MapPin, desc: "تبليسي - باتومي - كازبيجي" },
      ]
    },
    services: {
      name: "الخدمات",
      items: [
        { name: "طيران أماديوس", path: "/amadeus-flights", icon: Zap, desc: "بحث مباشر وأسعار لحظية" },
        { name: "رحلات الطيران", path: "/flights", icon: Plane, desc: "احجز رحلتك بأفضل الأسعار" },
        { name: "الفنادق", path: "/hotels", icon: Hotel, desc: "فنادق ومنتجعات مميزة" },
        { name: "البرامج السياحية", path: "/programs", icon: MapPin, desc: "برامج متكاملة ومنظمة" },
        { name: "تأجير السيارات", path: "/car-rental", icon: Car, desc: "سيارات مع أو بدون سائق" },
        { name: "التأشيرات", path: "/visas", icon: FileText, desc: "خدمات تأشيرات سريعة" },
        { name: "التأمين", path: "/insurance", icon: Shield, desc: "تأمين سفر شامل" },
      ]
    },
    honeymoon: {
      name: "شهر العسل",
      items: [
        { name: "عروض شهر العسل", path: "/honeymoon", icon: Heart, desc: "باقات رومانسية مميزة" },
        { name: "المالديف للعرسان", path: "/honeymoon?dest=maldives", icon: Star, desc: "تجربة لا تُنسى" },
        { name: "بالي للأزواج", path: "/honeymoon?dest=bali", icon: Star, desc: "جنة استوائية رومانسية" },
        { name: "تركيا الرومانسية", path: "/honeymoon?dest=turkey", icon: Star, desc: "بين التاريخ والطبيعة" },
      ]
    },
    offers: {
      name: "العروض",
      items: [
        { name: "جميع العروض", path: "/offers", icon: Gift, desc: "تصفح أحدث العروض" },
        { name: "عروض الصيف", path: "/offers?type=summer", icon: Star, desc: "خصومات موسمية مميزة" },
        { name: "عروض العائلات", path: "/offers?type=family", icon: Users, desc: "باقات عائلية بأسعار خاصة" },
        { name: "عروض اللحظة الأخيرة", path: "/offers?type=lastminute", icon: Zap, desc: "فرص لا تتكرر" },
      ]
    },
    about: {
      name: "الشركة",
      items: [
        { name: "من نحن", path: "/about", icon: Info, desc: "تعرف على ترافليون" },
        { name: "تواصل معنا", path: "/contact", icon: MessageSquare, desc: "نحن هنا لمساعدتك" },
        { name: "فريق العمل", path: "/careers", icon: Briefcase, desc: "انضم لفريقنا" },
        { name: "ضمان الخدمة", path: "/service-guarantee", icon: Award, desc: "التزامنا بالجودة" },
        { name: "الدعم والمساعدة", path: "/customer-support", icon: HelpCircle, desc: "مركز المساعدة" },
      ]
    }
  };

  const isActive = (path: string) => location.pathname === path;
  const isMenuSectionActive = (items: { path: string }[]) => items.some(item => location.pathname === item.path || location.pathname.startsWith(item.path.split('?')[0]));

  // Dropdown Menu Component - Horizontal Grid Layout
  const NavDropdown = ({ menuKey, menu }: { menuKey: string; menu: typeof menuData.destinations }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1 ${
            isMenuSectionActive(menu.items)
              ? "bg-secondary text-secondary-foreground"
              : isScrolled
                ? "text-foreground hover:bg-muted hover:text-primary"
                : "text-primary-foreground hover:bg-white/20"
          }`}
        >
          {menu.name}
          <ChevronDown className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="w-auto min-w-[400px] max-w-[600px] p-3 bg-background/95 backdrop-blur-xl border shadow-xl"
      >
        <div className="grid grid-cols-2 gap-2">
          {menu.items.map(item => (
            <DropdownMenuItem key={item.path} asChild>
              <Link
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  isActive(item.path) ? "bg-primary/10" : "hover:bg-muted"
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${isActive(item.path) ? "bg-primary text-white" : "bg-muted"}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header
      className={`fixed top-4 left-4 right-4 z-50 transition-all duration-700 rounded-[2rem] border border-white/10 ${
        isScrolled
          ? "bg-primary/80 backdrop-blur-2xl py-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)] shadow-black/20"
          : "bg-primary/40 backdrop-blur-sm py-4"
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group transition-all duration-500 hover:scale-105">
          <div className="relative">
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-white animate-shimmer-text">
              ترافليون
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] block text-secondary leading-none">
              Traveliun
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-md rounded-full px-2 py-1 border border-white/10">
          {/* Home - Direct Link */}
          <Link
            to="/"
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-500 ${
              isActive("/")
                ? "bg-secondary text-secondary-foreground shadow-gold"
                : "text-white hover:bg-white/10"
            }`}
          >
            الرئيسية
          </Link>

          {/* Destinations Dropdown */}
          <NavDropdown menuKey="destinations" menu={menuData.destinations} />

          {/* Services Dropdown */}
          <NavDropdown menuKey="services" menu={menuData.services} />

          {/* Honeymoon Dropdown */}
          <NavDropdown menuKey="honeymoon" menu={menuData.honeymoon} />

          {/* Offers Dropdown */}
          <NavDropdown menuKey="offers" menu={menuData.offers} />

          {/* About Dropdown */}
          <NavDropdown menuKey="about" menu={menuData.about} />
        </nav>

        {/* CTA Button & User Section */}
        <div className="hidden lg:flex items-center gap-3">
          {/* User Status */}
          {!authLoading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded-full transition-all bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                  >
                    <Avatar className="w-8 h-8 border border-secondary shadow-gold">
                      <AvatarFallback className="text-sm font-bold bg-secondary text-secondary-foreground">
                        {getUserDisplayName()?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-bold max-w-[100px] truncate">
                      {getUserDisplayName()}
                    </span>
                    <ChevronDown className="w-4 h-4 text-secondary" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 bg-primary/95 backdrop-blur-2xl border-white/10 shadow-2xl">
                  <div className="px-4 py-3 border-b border-white/10 mb-2">
                    <p className="text-sm font-bold text-white">{getUserDisplayName()}</p>
                    <p className="text-xs text-secondary truncate font-mono">{user.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-white hover:bg-white/10">
                      <div className="p-2 bg-secondary/20 rounded-lg text-secondary">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm">لوحة التحكم</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-red-400 hover:bg-red-500/10 focus:text-red-400"
                  >
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm">تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button
                  className="rounded-full px-6 bg-white/10 border border-white/30 text-white hover:bg-white/20 hover:border-secondary transition-all"
                >
                  <LogIn className="w-4 h-4 ml-2 text-secondary" />
                  تسجيل الدخول
                </Button>
              </Link>
            )
          )}

          {/* WhatsApp Button */}
          <a
            href="https://api.whatsapp.com/send?phone=966569222111"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="احجز الآن عبر واتساب"
          >
            <Button
              className="bg-secondary hover:bg-gold-light text-secondary-foreground rounded-full px-8 shadow-gold transition-all duration-500 font-black"
            >
              <Phone className="w-4 h-4 ml-2 animate-bounce" />
              احجز الآن
            </Button>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg transition-colors hover:bg-white/20"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
        >
          {isMenuOpen ? (
            <X className={`w-6 h-6 ${isScrolled ? 'text-foreground' : 'text-primary-foreground'}`} />
          ) : (
            <Menu className={`w-6 h-6 ${isScrolled ? 'text-foreground' : 'text-primary-foreground'}`} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl shadow-xl border-t transition-all duration-300 ${isMenuOpen ? "opacity-100 visible max-h-[80vh] overflow-y-auto" : "opacity-0 invisible max-h-0"
          }`}
      >
        <nav className="container py-6 flex flex-col gap-2">
          {/* Home */}
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={`px-4 py-3 rounded-lg text-lg font-medium transition-all ${isActive("/")
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-muted"
              }`}
          >
            الرئيسية
          </Link>

          {/* Mobile Accordion Menus */}
          {Object.entries(menuData).map(([key, menu]) => (
            <div key={key} className="py-2 border-t border-border/50">
              <p className="px-4 py-2 text-sm font-bold text-primary flex items-center gap-2">
                {menu.name}
              </p>
              <div className="grid grid-cols-1 gap-1 px-2">
                {menu.items.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <div>
                      <span className="text-sm font-medium block">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* User Status in Mobile */}
          {!authLoading && (
            <div className="pt-4 mt-4 border-t">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-2 bg-muted rounded-lg">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary text-white font-bold">
                        {getUserDisplayName()?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{getUserDisplayName()}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-foreground hover:bg-muted rounded-lg"
                  >
                    <User className="w-5 h-5" />
                    لوحة التحكم
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut className="w-5 h-5" />
                    تسجيل الخروج
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-primary-foreground rounded-full font-medium"
                >
                  <LogIn className="w-5 h-5" />
                  تسجيل الدخول
                </Link>
              )}
            </div>
          )}

          <a
            href="https://api.whatsapp.com/send?phone=966569222111"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4"
            aria-label="احجز الآن عبر واتساب"
          >
            <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full">
              <Phone className="w-4 h-4 ml-2" />
              احجز الآن
            </Button>
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;