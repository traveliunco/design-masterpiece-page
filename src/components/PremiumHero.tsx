import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Sparkles, 
  MapPin, 
  Star,
  Play,
  Shield,
  Clock,
  Users
} from "lucide-react";
import heroImage from "@/assets/hero-resort.jpg";
import HeroSearch from "./HeroSearch";

const PremiumHero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-luxury-navy via-[#0a4b5c] to-luxury-navy">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Luxury Resort" 
          className="w-full h-full object-cover scale-110 animate-[pulse_20s_ease-in-out_infinite]"
        />
        {/* Lighter Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-navy/50 via-luxury-navy/40 to-luxury-navy/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-navy/60 via-transparent to-[#0a4b5c]/40" />
      </div>

      {/* Vibrant Light Effects */}
      <div className="absolute top-1/4 right-10 w-96 h-96 rounded-full bg-luxury-teal/35 blur-[130px] floating animate-pulse" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] rounded-full bg-luxury-gold/30 blur-[150px] floating-subtle" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-400/20 blur-[170px]" />
      
      {/* Animated Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Floating Glass Cards */}

      {/* Main Content */}
      <div className="relative z-10 container px-4 pt-32 pb-20 min-h-screen flex flex-col justify-center">
        {/* Title Section - Right Aligned */}
        <div className="text-right mb-12 max-w-3xl mr-0">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-3 glass-dark rounded-full px-6 py-3 mb-8 animate-reveal">
            <Sparkles className="w-4 h-4 text-luxury-gold" />
            <span className="text-white/80 text-sm font-medium">الوكالة الرائدة في السعودية</span>
            <div className="w-2 h-2 bg-luxury-gold rounded-full animate-pulse" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 animate-reveal delay-100 leading-tight">
            رحلات <span className="text-gradient-gold">استثنائية</span>
            <br />
            <span className="text-gradient-teal">تفوق</span> التوقعات
          </h1>

          {/* Description */}
          <p className="text-xl text-white/70 mb-0 leading-relaxed animate-reveal delay-200">
            نحول أحلامك إلى واقع مع خدمات سفر فاخرة وتجارب لا تُنسى في أجمل وجهات العالم
          </p>
        </div>

        {/* Advanced Search Component - Full Width */}
        <div className="w-full mb-12 animate-reveal delay-300 relative z-50">
          <HeroSearch />
        </div>

        {/* Quick Stats - Centered */}
        <div className="flex flex-wrap items-center justify-center gap-8 animate-reveal delay-400 relative z-10">
          <div className="text-center">
            <div className="text-3xl font-bold text-luxury-gold mb-1">+٥٠٠٠</div>
            <div className="text-white/60 text-sm">عميل سعيد</div>
          </div>
          <div className="w-px h-12 bg-white/20" />
          <div className="text-center">
            <div className="text-3xl font-bold text-luxury-teal mb-1">+١٠٠</div>
            <div className="text-white/60 text-sm">وجهة سياحية</div>
          </div>
          <div className="w-px h-12 bg-white/20" />
          <div className="text-center">
            <div className="text-3xl font-bold text-luxury-gold mb-1">٤.٩</div>
            <div className="text-white/60 text-sm">تقييم العملاء</div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default PremiumHero;
