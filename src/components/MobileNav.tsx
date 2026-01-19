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

  if (isAdmin) return null;

  const items: InteractiveMenuItem[] = [
    { label: 'الرئيسية', icon: Home, onClick: () => navigate('/') },
    { label: 'الوجهات', icon: MapPin, onClick: () => navigate('/destinations') },
    { label: 'طيران', icon: Plane, onClick: () => navigate('/amadeus-flights') },
    { label: 'فنادق', icon: Building2, onClick: () => navigate('/hotels') },
    { label: 'حسابي', icon: User, onClick: () => navigate('/login') },
  ];

  const getActiveIndex = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path.startsWith('/destinations')) return 1;
    if (path.startsWith('/amadeus-flights')) return 2;
    if (path.startsWith('/hotels')) return 3;
    if (path.startsWith('/login')) return 4;
    return 0;
  };

  return (
    <div className={cn(
      "md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-[var(--z-navigation-mobile)]",
      "transition-all duration-300",
      isMobileMenuOpen ? "opacity-0 pointer-events-none translate-y-4" : "opacity-100 pointer-events-auto translate-y-0"
    )}>
      <InteractiveMenu items={items} activeIndex={getActiveIndex()} />
    </div>
  );
};

export default MobileNav;
