import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  MapPin,
  Package,
  Plane,
  Hotel,
  Tag,
  Heart,
  Phone,
  Info,
  FileText,
  Menu,
  X,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
};

const navItems: NavItem[] = [
  { name: "الرئيسية", path: "/", icon: Home },
  { name: "الوجهات السياحية", path: "/destinations", icon: MapPin, badge: "جديد" },
  { name: "البرامج السياحية", path: "/programs", icon: Package },
  { name: "حجز الطيران", path: "/amadeus-flights", icon: Plane },
  { name: "الفنادق", path: "/hotels", icon: Hotel },
  { name: "العروض الخاصة", path: "/offers", icon: Tag, badge: "خصم" },
  { name: "شهر العسل", path: "/honeymoon", icon: Heart },
  { name: "المدونة", path: "/blog", icon: FileText },
  { name: "من نحن", path: "/about", icon: Info },
  { name: "تواصل معنا", path: "/contact", icon: Phone },
];

const FrontendSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Toggle Button - Fixed */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed top-1/2 -translate-y-1/2 z-[200] p-3 rounded-l-2xl transition-all duration-300",
          "bg-gradient-to-br from-luxury-teal to-emerald-600 text-white shadow-lg",
          "hover:shadow-xl hover:scale-105",
          isOpen ? "right-72" : "right-0"
        )}
        title={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[190]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-[195] w-72 bg-white/95 backdrop-blur-xl border-l border-gray-200/50 shadow-2xl transition-transform duration-500 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-center border-b border-gray-100 bg-gradient-to-r from-luxury-teal/10 to-luxury-gold/10">
          <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <img 
              src="/traveliun-logo.png" 
              alt="Traveliun Logo" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <span className="text-2xl font-bold text-luxury-navy">ترافليون</span>
              <span className="block text-[10px] tracking-[0.2em] text-luxury-teal uppercase">TRAVELIUN</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 overflow-y-auto h-[calc(100vh-180px)]">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group",
                      active
                        ? "bg-gradient-to-r from-luxury-teal to-emerald-500 text-white shadow-lg shadow-luxury-teal/30"
                        : "text-luxury-navy/70 hover:bg-luxury-teal/10 hover:text-luxury-navy"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                      active 
                        ? "bg-white/20" 
                        : "bg-luxury-teal/10 group-hover:bg-luxury-teal/20"
                    )}>
                      <Icon className={cn(
                        "w-6 h-6 transition-transform group-hover:scale-110", 
                        active ? "text-white" : "text-luxury-teal"
                      )} />
                    </div>
                    <span className="font-medium flex-1 text-base">{item.name}</span>
                    {item.badge && (
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold",
                        active 
                          ? "bg-white/20 text-white" 
                          : "bg-luxury-gold/20 text-luxury-gold"
                      )}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronLeft className={cn(
                      "w-5 h-5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0",
                      active && "opacity-100 translate-x-0"
                    )} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gradient-to-r from-luxury-gold/5 to-luxury-teal/5">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-luxury-navy/60 text-sm mb-2">
              <Sparkles className="w-4 h-4 text-luxury-gold" />
              <span>رحلات استثنائية تفوق التوقعات</span>
            </div>
            <div className="text-xs text-luxury-navy/40">
              © 2025 ترافليون - جميع الحقوق محفوظة
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FrontendSidebar;
