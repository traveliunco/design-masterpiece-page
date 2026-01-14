import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, User, Home, Plane, Map, Info, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const AuroraNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "الرئيسية", path: "/", icon: Home },
    { name: "الوجهات", path: "/destinations", icon: Map },
    { name: "طيران رويال", path: "/flights", icon: Plane },
    { name: "من نحن", path: "/about", icon: Info },
  ];

  return (
    <>
      {/* Primary Floating Nav Hub */}
      <nav className={cn(
        "fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-1000",
        isScrolled ? "top-6" : "top-10"
      )}>
        <div className={cn(
          "flex items-center gap-2 p-2 rounded-full transition-all duration-1000",
          isScrolled 
            ? "glass-modern px-6 py-2 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border-charcoal/5" 
            : "bg-transparent px-2"
        )}>
          {/* Branded Logo Focus */}
          <Link to="/" className="flex items-center gap-3 px-4 py-2 rounded-full transition-all hover:bg-charcoal/5 group">
            <div className="relative">
              <span className="font-editorial text-2xl text-charcoal tracking-tighter">ترافليون</span>
              <div className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-aurora-indigo rounded-full animate-pulse" />
            </div>
            {!isScrolled && <span className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40 border-l border-charcoal/10 pl-3">المجموعة الاستثنائية</span>}
          </Link>

          {/* Desktop Intelligence Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500",
                  location.pathname === item.path 
                    ? "bg-charcoal text-white shadow-2xl" 
                    : "text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Primary Action Group */}
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-2 px-6 py-2 rounded-full bg-aurora-indigo text-white text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
               احجز الآن
               <Phone className="w-3 h-3" />
            </button>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 lg:hidden rounded-full border border-charcoal/10 flex items-center justify-center hover:bg-charcoal hover:text-white transition-all"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Luxury Fullscreen Menu Overlay */}
      <div className={cn(
        "fixed inset-0 z-[90] bg-white transition-all duration-1000 ease-in-out p-10 flex flex-col md:flex-row items-center",
        isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      )}>
         {/* Background Aurora */}
         <div className="absolute inset-0 bg-aurora opacity-50 pointer-events-none" />

         <div className="container relative z-10 grid md:grid-cols-2 gap-20 items-center">
            {/* Nav List */}
            <div className="space-y-8">
              {menuItems.map((item, i) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="group block overflow-hidden"
                >
                  <div 
                    className={cn(
                      "font-editorial text-5xl md:text-8xl text-charcoal transition-all duration-700 hover:translate-x-6",
                      isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                    )} 
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <span className="text-aurora-indigo group-hover:italic pr-4 opacity-0 group-hover:opacity-100 transition-all font-modern text-2xl font-black">/ 0{i+1}</span>
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>

            {/* Featured Section */}
            <div className={cn(
              "hidden md:block transition-all duration-1000",
              isMenuOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"
            )}>
              <div className="editorial-card p-10 space-y-8 bg-charcoal text-white">
                <div className="flex items-center gap-4 text-aurora-rose font-black tracking-[0.4em] uppercase text-xs">عرض الشهر الحصري</div>
                <h3 className="font-editorial text-6xl leading-none">سانتوريني <br /> رويال</h3>
                <p className="font-modern text-lg opacity-60">تجربة العمر في أجنحة معلقة بين السماء والبحر، مصممة لأصحاب الذوق الرفيع فقط.</p>
                <div className="pt-10">
                   <Link to="/destinations/santorini" className="btn-editorial bg-white text-charcoal">استعرض العرض</Link>
                </div>
              </div>
            </div>
         </div>

         {/* Bottom Footer Info */}
         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 px-10">
            <div className="flex items-center gap-6">
               <span className="text-[10px] font-black text-charcoal/40 tracking-[0.3em] uppercase">واتساب: +٩٦٦ ٥٦ ٩٢٢ ٢١١١</span>
               <div className="w-1.5 h-1.5 bg-aurora-mint rounded-full" />
               <span className="text-[10px] font-black text-charcoal/40 tracking-[0.3em] uppercase">الرياض، المملكة العربية السعودية</span>
            </div>
            <div className="flex items-center gap-6">
               <span className="text-[10px] font-black text-charcoal tracking-widest uppercase cursor-pointer hover:text-aurora-indigo transition-colors underline decoration-charcoal/10 underline-offset-8">سياسة الخصوصية</span>
               <span className="text-[10px] font-black text-charcoal tracking-widest uppercase cursor-pointer hover:text-aurora-indigo transition-colors underline decoration-charcoal/10 underline-offset-8">شروط الاستخدام</span>
            </div>
         </div>
      </div>
    </>
  );
};

export default AuroraNav;
