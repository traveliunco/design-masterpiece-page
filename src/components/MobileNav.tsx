import { NavLink, useLocation } from "react-router-dom";
import { Home, MapPin, Plane, Building2, User } from "lucide-react";

const MobileNav = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
      <div className="glass-nav rounded-3xl px-4 py-3 flex items-center justify-around shadow-luxury">
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-luxury-teal text-white shadow-glow-teal' : 'text-luxury-navy/70 hover:text-luxury-teal'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">الرئيسية</span>
        </NavLink>

        <NavLink 
          to="/destinations" 
          className={({ isActive }) => `flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-luxury-teal text-white shadow-glow-teal' : 'text-luxury-navy/70 hover:text-luxury-teal'}`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] font-semibold">الوجهات</span>
        </NavLink>

        <NavLink 
          to="/amadeus-flights" 
          className={({ isActive }) => `flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 relative ${isActive ? 'bg-luxury-teal text-white shadow-glow-teal' : 'text-luxury-navy/70 hover:text-luxury-teal'}`}
        >
          <div className="relative">
            <Plane className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-luxury-gold rounded-full animate-pulse" />
          </div>
          <span className="text-[10px] font-semibold">طيران</span>
        </NavLink>

        <NavLink 
          to="/hotels" 
          className={({ isActive }) => `flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-luxury-teal text-white shadow-glow-teal' : 'text-luxury-navy/70 hover:text-luxury-teal'}`}
        >
          <Building2 className="w-5 h-5" />
          <span className="text-[10px] font-semibold">فنادق</span>
        </NavLink>

        <NavLink 
          to="/login" 
          className={({ isActive }) => `flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-luxury-teal text-white shadow-glow-teal' : 'text-luxury-navy/70 hover:text-luxury-teal'}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold">حسابي</span>
        </NavLink>
      </div>
    </div>
  );
};

export default MobileNav;
