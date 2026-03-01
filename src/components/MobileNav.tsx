import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, MapPin, Plane, Building2, User } from "lucide-react";
import { InteractiveMenu, InteractiveMenuItem } from "./ui/modern-mobile-menu";
import { useNavigation } from "@/contexts/NavigationContext";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobileMenuOpen } = useNavigation();
  const isAdmin = location.pathname.startsWith('/admin');
  
  // Scroll Logic
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide on scroll down, show on scroll up
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

  if (isAdmin) return null;

  const items: InteractiveMenuItem[] = [
    { label: 'الرئيسية', icon: Home, onClick: () => navigate('/') },
    { label: 'الوجهات', icon: MapPin, onClick: () => navigate('/destinations') },
    { label: 'البرامج', icon: Plane, onClick: () => navigate('/programs') },
    { label: 'العروض', icon: Building2, onClick: () => navigate('/offers') },
    { label: 'حسابي', icon: User, onClick: () => navigate('/login') },
  ];

  const getActiveIndex = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path.startsWith('/destinations')) return 1;
    if (path.startsWith('/programs')) return 2;
    if (path.startsWith('/offers')) return 3;
    if (path.startsWith('/login')) return 4;
    return 0;
  };

  return (
    <div className={cn(
      "md:hidden fixed bottom-0 left-0 right-0 z-[var(--z-navigation-mobile)]",
      "transition-transform duration-500 ease-in-out will-change-transform",
      (!isVisible || isMobileMenuOpen) ? "translate-y-[120%]" : "translate-y-0"
    )}>
        {/* Glassy Bar Wrapper */}
        <div className="bg-white/80 backdrop-blur-xl border-t border-white/40 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] rounded-t-[2rem] px-2 pt-2 pb-4">
           {/* Center stripe/indicator for 'swipe' or just aesthetic */}
           <div className="mx-auto w-12 h-1 bg-gray-300/50 rounded-full mb-2" />
           
           <InteractiveMenu 
              items={items} 
              activeIndex={getActiveIndex()} 
              // Overriding default Menu styles to fit the bar
              className="!w-full !justify-around !bg-transparent !border-0 !shadow-none !p-0 !gap-0 !rounded-none" 
           />
        </div>
    </div>
  );
};

export default MobileNav;
