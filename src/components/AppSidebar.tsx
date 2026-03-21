import { Link, useLocation } from "react-router-dom";
import {
  Home,
  CalendarCheck,
  MapPin,
  Package,
  Plane,
  Building2,
  Gift,
  Box,
  Compass,
  Briefcase,
  Heart,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "الرئيسية", icon: Home },
  { path: "/my-bookings", label: "الحجوزات", icon: CalendarCheck },
  { path: "/destinations", label: "الوجهات", icon: MapPin },
  { path: "/programs", label: "البرامج", icon: Package },
  { path: "/flights", label: "الرحلات", icon: Plane },
  { path: "/hotels", label: "الفنادق", icon: Building2 },
  { path: "/offers", label: "العروض", icon: Gift },
  { path: "/ready-packages", label: "باقات جاهزة", icon: Box },
  { path: "/trip-builder", label: "مصمم الرحلات", icon: Compass },
  { path: "/services", label: "الخدمات", icon: Briefcase },
  { path: "/honeymoon", label: "شهر العسل", icon: Heart },
];

const AppSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="hidden lg:flex flex-col w-[200px] min-w-[200px] bg-background border-l border-border/50 h-screen sticky top-0 pt-20 overflow-y-auto z-40">
      <nav className="flex flex-col gap-0.5 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <Icon
                className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                  active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AppSidebar;
