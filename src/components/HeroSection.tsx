import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Phone, 
  Sparkles, 
  Award, 
  Users, 
  Building2, 
  Globe, 
  MessageSquare, 
  Plane, 
  CreditCard,
  MapPin,
  Star,
  ChevronDown
} from "lucide-react";
import heroImage from "@/assets/hero-resort.jpg";

const HeroSection = () => {
  return (
    <>
      {/* ===== HERO SECTION - Cinematic Masterpiece ===== */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Background Layer: High-End Visuals */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Traveliun Luxury" 
            loading="eager"
            className="w-full h-full object-cover scale-110 animate-[zoom-out_20s_ease-in-out_infinite]" 
          />
          {/* Multi-layered Cinema Grade Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-teal-900/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
        </div>

        {/* Dynamic Interactive Elements (Floating Objects) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Royal Glows */}
          <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[150px] animate-pulse [animation-delay:2s]" />
          
          {/* Animated Golden Lines */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-white/5 rounded-full animate-rotate-slow opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1500px] h-[1500px] border border-secondary/5 rounded-full animate-rotate-slow [animation-direction:reverse] opacity-20" />
        </div>

        {/* Content Area: Typography & CTA */}
        <div className="relative z-10 container mx-auto px-4 text-center mt-20">
          <div className="max-w-6xl mx-auto space-y-10 md:space-y-16">
            
            {/* Premium Achievement Badge */}
            <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-2xl px-8 py-3 rounded-full border border-white/10 shadow-[0_0_50px_rgba(212,175,55,0.15)] animate-reveal">
              <div className="flex -space-x-3 rtl:space-x-reverse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-primary bg-secondary/80 flex items-center justify-center text-[10px] font-black">
                    <Star className="w-3 h-3 text-white fill-white" />
                  </div>
                ))}
              </div>
              <span className="text-xs md:text-sm font-black tracking-widest text-white/90 uppercase">
                الوجهة الأولى للسياحة الفاخرة في المملكة
              </span>
              <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
            </div>

            {/* Typography Masterpiece */}
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black leading-none animate-reveal reveal-delay-1 tracking-tighter">
                <span className="block text-white">تحلّق في</span>
                <span className="relative inline-block mt-4 italic">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-gold-light to-secondary animate-gradient-text">
                    عالم الخيال
                  </span>
                  <div className="absolute -bottom-4 left-0 right-0 h-3 bg-secondary/30 blur-sm rounded-full" />
                </span>
              </h1>
              
              <p className="text-xl md:text-3xl font-medium text-white/60 max-w-3xl mx-auto leading-relaxed animate-reveal reveal-delay-2">
                نصنع لك لحظاتٍ خالدة في أجمل بقاع الأرض، حيث تذوب الحدود بين الواقع والأحلام
              </p>
            </div>

            {/* Premium CTA Dashboard */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-10 animate-reveal reveal-delay-3 pb-20">
              <a 
                href="https://api.whatsapp.com/send?phone=966569222111" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative w-full md:w-auto"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-gold-light rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500" />
                <Button className="relative w-full md:w-auto bg-secondary text-secondary-foreground rounded-full px-12 py-10 text-2xl font-black shadow-gold transition-all duration-500 hover:scale-105">
                  <Phone className="w-8 h-8 ml-4 group-hover:rotate-12 transition-transform" />
                  اكتشف عرضك الخاص
                </Button>
              </a>
              
              <Link to="/destinations" className="w-full md:w-auto group">
                <Button 
                  variant="outline" 
                  className="w-full md:w-auto bg-white/5 border-2 border-white/20 text-white hover:bg-white/10 hover:border-secondary rounded-full px-12 py-10 text-2xl font-black backdrop-blur-xl transition-all duration-500"
                >
                  <Globe className="w-8 h-8 ml-4 group-hover:animate-spin-slow" />
                  استعرض الوجهات
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Cinematic Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 animate-bounce">
          <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-secondary to-transparent" />
          <span className="text-[10px] font-bold text-secondary tracking-[0.5em] uppercase vertical-text">تصفح المزيد</span>
        </div>
      </section>

      {/* ===== STATS SECTION - Luxury Data Visualization ===== */}
      <section id="stats" className="relative bg-teal-dark py-24 md:py-32 overflow-hidden border-t border-white/5">
        {/* Artistic Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-secondary font-black tracking-[0.3em] uppercase text-sm animate-reveal">أرقام تتحدث عن جودتنا</h3>
            <div className="w-20 h-1 bg-secondary mx-auto rounded-full animate-reveal reveal-delay-1" />
          </div>

          {/* Stats Display Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 max-w-7xl mx-auto">
            {[
              { number: "4000+", label: "عميل يثق بنا", icon: Users },
              { number: "120+", label: "شريك فندقي", icon: Building2 },
              { number: "50+", label: "وجهة سحرية", icon: Globe },
              { number: "24/7", label: "رفيق في رحلتك", icon: MessageSquare },
            ].map((stat, index) => (
              <div 
                key={index} 
                className="group relative bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/10 transition-all duration-700 hover:-translate-y-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
              >
                {/* Visual Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-br from-secondary/40 to-transparent rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-700" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-3xl bg-secondary/10 flex items-center justify-center mb-8 group-hover:scale-125 group-hover:bg-secondary transition-all duration-700 shadow-luxury">
                    <stat.icon className="w-10 h-10 text-secondary group-hover:text-primary transition-colors duration-700" />
                  </div>
                  
                  <div className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tighter group-hover:text-secondary transition-colors duration-300">
                    {stat.number}
                  </div>
                  
                  <div className="text-sm font-bold text-white/40 tracking-[0.2em] uppercase group-hover:text-white/80 transition-colors">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MARQUEE SECTION ===== */}
      <section className="relative bg-gradient-to-r from-secondary via-gold to-secondary py-4 md:py-6 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 md:gap-12 mx-3 md:mx-6 text-secondary-foreground">
              <div className="flex items-center gap-2 md:gap-3 font-bold text-sm md:text-lg">
                <Plane className="w-4 h-4 md:w-6 md:h-6" />
                <span>رحلات سياحية مميزة</span>
              </div>
              <span className="opacity-40 font-light text-lg md:text-2xl">|</span>
              <div className="flex items-center gap-2 md:gap-3 font-bold text-sm md:text-lg">
                <Building2 className="w-4 h-4 md:w-6 md:h-6" />
                <span>فنادق فاخرة</span>
              </div>
              <span className="opacity-40 font-light text-lg md:text-2xl">|</span>
              <div className="flex items-center gap-2 md:gap-3 font-bold text-sm md:text-lg">
                <Globe className="w-4 h-4 md:w-6 md:h-6" />
                <span>وجهات عالمية</span>
              </div>
              <span className="opacity-40 font-light text-lg md:text-2xl">|</span>
              <div className="flex items-center gap-2 md:gap-3 font-bold text-sm md:text-lg">
                <CreditCard className="w-4 h-4 md:w-6 md:h-6" />
                <span>تقسيط مريح</span>
              </div>
              <span className="opacity-40 font-light text-lg md:text-2xl">|</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default HeroSection;