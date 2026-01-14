import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const PremiumNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "الوجهات", path: "/destinations" },
    { name: "البرامج السياحية", path: "/programs" },
    { name: "الطيران", path: "/amadeus-flights" },
    { name: "الفنادق", path: "/hotels" },
    { name: "من نحن", path: "/about" },
  ];

  return (
    <>
      {/* Premium Floating Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "py-3" : "py-6"
      )}>
        <div className="container px-4">
          <div className={cn(
            "flex items-center justify-between rounded-full px-6 py-3 transition-all duration-500",
            isScrolled 
              ? "glass-nav shadow-luxury" 
              : "bg-white/10 backdrop-blur-md border border-white/20"
          )}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-luxury-teal to-teal-600 flex items-center justify-center shadow-glow-teal group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-luxury-gold rounded-full animate-pulse shadow-glow-gold" />
              </div>
              <div>
                <span className={cn(
                  "text-2xl font-bold transition-colors",
                  isScrolled ? "text-luxury-navy" : "text-white"
                )}>ترافليون</span>
                <span className={cn(
                  "text-[10px] block tracking-[0.3em] uppercase transition-colors",
                  isScrolled ? "text-luxury-teal" : "text-white/70"
                )}>TRAVELIUN</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                    location.pathname === link.path
                      ? "bg-luxury-teal text-white shadow-glow-teal"
                      : isScrolled 
                        ? "text-luxury-navy hover:bg-luxury-teal/10 hover:text-luxury-teal"
                        : "text-white/90 hover:bg-white/10"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTA & Mobile Menu */}
            <div className="flex items-center gap-3">
              <a
                href="https://api.whatsapp.com/send?phone=966569222111"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 btn-gold rounded-full px-6 py-3"
              >
                <Phone className="w-4 h-4" />
                <span className="font-semibold">احجز الآن</span>
              </a>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  "lg:hidden w-12 h-12 rounded-full flex items-center justify-center transition-all",
                  isScrolled 
                    ? "bg-luxury-navy text-white" 
                    : "glass-button text-white"
                )}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Premium Mobile Menu */}
      <div className={cn(
        "fixed inset-0 z-40 lg:hidden transition-all duration-500",
        isMobileMenuOpen 
          ? "opacity-100 pointer-events-auto" 
          : "opacity-0 pointer-events-none"
      )}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-luxury-navy/95 backdrop-blur-xl"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Menu Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-8">
          <div className="space-y-6 text-center">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block text-3xl font-bold text-white hover:text-luxury-gold transition-all",
                  isMobileMenuOpen ? "animate-reveal" : ""
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <a
            href="https://api.whatsapp.com/send?phone=966569222111"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 btn-gold rounded-full px-10 py-5 text-lg"
          >
            <Phone className="w-5 h-5 inline-block ml-2" />
            احجز رحلتك الآن
          </a>
        </div>
      </div>
    </>
  );
};

export default PremiumNav;
