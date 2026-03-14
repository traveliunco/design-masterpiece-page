import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, MapPin, Plane, Gift, User, Heart } from "lucide-react";
import { useNavigation } from "@/contexts/NavigationContext";
import { mobileHomepageService, MobileBottomNavItem } from "@/services/adminDataService";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobileMenuOpen } = useNavigation();
  const isAdmin = location.pathname.startsWith('/admin');
  
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navItems, setNavItems] = useState<MobileBottomNavItem[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const data = mobileHomepageService.getData();
    const activeNav = (data.bottomNav || []).filter(item => item.is_active).sort((a, b) => a.order - b.order);
    
    if (activeNav.length === 0) {
      setNavItems([
        { id: '1', icon: "🏠", label: "الرئيسية", path: "/", is_active: true, order: 1 },
        { id: '2', icon: "🗺️", label: "الدول", path: "/destinations", is_active: true, order: 2 },
        { id: '3', icon: "🎁", label: "العروض", path: "/offers", is_active: true, order: 3 },
        { id: '4', icon: "👤", label: "حسابي", path: "/login", is_active: true, order: 4 },
      ]);
    } else {
      setNavItems(activeNav);
    }
  }, [location.pathname]);

  if (isAdmin) return null;

  const getActiveIndex = () => {
    const path = location.pathname;
    return navItems.findIndex(item => {
      if (item.path === '/' && path !== '/') return false;
      if (item.path === '/m' && path !== '/m') return false;
      return path.startsWith(item.path);
    });
  };

  const activeIdx = getActiveIndex() !== -1 ? getActiveIndex() : 0; // Default to first if none match


  return (
    <div className={cn(
      "md:hidden fixed bottom-0 left-0 right-0 z-[var(--z-navigation-mobile)]",
      "transition-transform duration-400 ease-out will-change-transform",
      (!isVisible || isMobileMenuOpen) ? "translate-y-[120%]" : "translate-y-0"
    )}>
      <div className="bg-white/90 backdrop-blur-2xl border-t border-gray-200/60 shadow-[0_-4px_30px_rgba(0,0,0,0.08)] rounded-t-3xl px-1 pt-1.5 pb-[env(safe-area-inset-bottom,8px)]">
        {/* Swipe indicator */}
        <div className="mx-auto w-10 h-1 bg-gray-300/60 rounded-full mb-1.5" />
        
        <div className="flex items-end justify-around">
          {navItems.map((item, index) => {
            const isActive = activeIdx === index;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                title={item.label}
                aria-label={item.label}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-300 min-w-[56px]",
                  isActive 
                    ? "text-teal-600" 
                    : "text-gray-400 active:scale-90"
                )}
              >
                <div className={cn(
                  "relative p-1.5 rounded-xl transition-all duration-300",
                  isActive && "bg-teal-50"
                )}>
                  <span className={cn(
                    "text-xl transition-all duration-300 block",
                    isActive ? "scale-110" : "grayscale opacity-70"
                  )}>
                    {item.icon}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-500 rounded-full" />
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-all duration-300",
                  isActive ? "text-teal-600 font-bold" : "text-gray-400"
                )}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
