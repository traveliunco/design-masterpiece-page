import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-resort.jpg";

const AuroraHero = () => {
  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden bg-aurora pt-20">
      {/* Decorative Aura */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-charcoal/5 to-transparent pointer-events-none" />

      <div className="container relative z-10 px-4 text-center space-y-16">
        {/* Editorial Subtitle */}
        <div className="flex flex-col items-center gap-4 animate-reveal">
          <div className="flex items-center gap-2 text-charcoal/40 font-modern font-black tracking-[0.5em] uppercase text-[10px]">
            <Sparkles className="w-3 h-3" />
            ترافليون - المجموعة الاستثنائية
          </div>
          <div className="w-px h-12 bg-charcoal/10" />
        </div>

        {/* Masterpiece Headline */}
        <div className="space-y-4 animate-reveal reveal-delay-1">
          <h1 className="font-editorial text-[12vw] md:text-[10rem] text-charcoal leading-[0.8] tracking-tighter">
            لحظاتٌ <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-aurora-indigo via-aurora-rose to-aurora-mint animate-pulse">لا تُنسى</span>
          </h1>
          <p className="font-modern text-xl md:text-3xl font-medium text-charcoal/60 max-w-2xl mx-auto leading-relaxed">
            نحن لا نخطط لرحلاتك، نحن نصمم فصولاً جديدة في قصة حياتك، في أجمل بقاع الأرض.
          </p>
        </div>

        {/* Cinematic Preview Frame */}
        <div className="relative w-full max-w-7xl mx-auto aspect-video md:aspect-[21/9] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] animate-reveal reveal-delay-2 group">
          <img 
            src={heroImage} 
            alt="The Grand Resort" 
            className="w-full h-full object-cover img-pan scale-105 group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
          
          {/* Internal Smart Widget */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 glass-modern p-1 rounded-full border border-white/20 px-10 py-4 shadow-2xl backdrop-blur-3xl animate-bounce">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-aurora-indigo" />
              <span className="text-xs font-black text-charcoal tracking-widest uppercase">اكتشف بورا بورا</span>
            </div>
            <div className="w-px h-6 bg-charcoal/10" />
            <div className="text-[10px] font-bold text-charcoal/60">ابتداءً من ٩,٩٩٩ ر.س</div>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-reveal reveal-delay-3">
          <Button className="btn-editorial shadow-2xl h-20 px-12 text-lg">
            ابدأ رحلتك الآن
            <ArrowLeft className="w-6 h-6 ml-4" />
          </Button>
          <Button variant="ghost" className="btn-editorial-outline h-20 px-12 text-lg">
             استعرض الكتالوج
          </Button>
        </div>
      </div>

      {/* Side Exploration Indicator */}
      <div className="absolute left-10 bottom-10 hidden xl:flex flex-col items-center gap-8 animate-reveal reveal-delay-3">
        <span className="vertical-text text-[10px] font-black tracking-[1em] uppercase text-charcoal/20">ترافليون الحصرية</span>
        <div className="w-[1px] h-32 bg-charcoal/10" />
      </div>
    </section>
  );
};

export default AuroraHero;
