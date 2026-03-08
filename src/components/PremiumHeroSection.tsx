import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Play, Plane, ArrowLeft, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import heroVideo from "@/assets/malaysia.jpg";
import { homepageService } from "@/services/adminDataService";
import SkyscannerSearch from "@/components/SkyscannerSearch";

interface Slide {
  title: string;
  highlight: string;
  subtitle: string;
  description: string;
  image: string;
  stats: Record<string, string>;
}

const PremiumHeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  const defaultSlides: Slide[] = [
    {
      title: "اكتشف", highlight: "العالم", subtitle: "معنا",
      description: "رحلات استثنائية إلى أجمل الوجهات السياحية حول العالم",
      image: heroVideo,
      stats: { "وجهة": "50+", "عميل": "10,000+", "تقييم": "4.9" }
    },
    {
      title: "رحلة", highlight: "أحلامك", subtitle: "تبدأ هنا",
      description: "برامج سياحية مخصصة تناسب جميع الأذواق والميزانيات",
      image: heroVideo,
      stats: { "برنامج": "200+", "دولة": "25+", "سنة خبرة": "15+" }
    },
    {
      title: "شهر عسل", highlight: "لا يُنسى", subtitle: "",
      description: "عروض رومانسية خاصة للعرسان في أفخم المنتجعات",
      image: heroVideo,
      stats: { "شهر عسل": "5000+", "منتجع": "100+", "خصم حتى": "30%" }
    },
  ];

  const [slides, setSlides] = useState<Slide[]>(defaultSlides);

  // ✅ جلب السلايدات من Supabase/localStorage
  useEffect(() => {
    homepageService.getHeroSlides().then((data: unknown[]) => {
      if (data && data.length > 0) {
        const mapped: Slide[] = (data as Array<Record<string, unknown>>)
          .filter(s => s.is_active !== false)
          .sort((a, b) => ((a.display_order as number || a.order as number || 0) - (b.display_order as number || b.order as number || 0)))
          .map(s => ({
            title: (s.title as string) || "",
            highlight: (s.highlight as string) || "",
            subtitle: (s.subtitle as string) || "",
            description: (s.description as string) || "",
            image: (s.image as string) || heroVideo,
            stats: (s.stats as Record<string, string>) || {}
          }));
        if (mapped.length > 0) setSlides(mapped);
      }
    }).catch(() => {});
  }, []);


  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const currentData = slides[currentSlide];

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Video Background Effect */}
      <div className="absolute inset-0">
        <div 
          className={cn("absolute inset-0 bg-cover bg-center transition-all duration-1000 bg-[image:var(--hero-bg)]")}
          style={{ "--hero-bg": `url(${currentData.image})` } as React.CSSProperties}
        />
        {/* Dark Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary))]/90 via-[hsl(var(--primary))]/70 to-[hsl(180,40%,15%)]/90" />
        
        {/* Animated Shapes */}
        <div 
          className="absolute top-20 right-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl transition-transform duration-700 ease-out"
          style={{ transform: `translate(${mousePosition.x * -40}px, ${mousePosition.y * -40}px)` }}
        />
        <div 
          className="absolute bottom-20 left-20 w-80 h-80 bg-accent/15 rounded-full blur-3xl transition-transform duration-500 ease-out"
          style={{ transform: `translate(${mousePosition.x * 60}px, ${mousePosition.y * 60}px)` }}
        />
        <div 
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl transition-transform duration-300 ease-out"
          style={{ transform: `translate(${mousePosition.x * 80}px, ${mousePosition.y * -50}px)` }}
        />
      </div>

      {/* Centered Content */}
      <div className="container relative flex-1 flex flex-col items-center justify-center text-center py-24 pt-32 z-10">
        <div className="w-full max-w-4xl mx-auto animate-fade-in space-y-8">
          
          {/* Premium Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <Plane className="w-5 h-5 text-primary-foreground/80" />
              <span className="text-sm font-medium text-primary-foreground/90">منصة السفر الأكثر ثقة في السعودية</span>
              <Shield className="w-5 h-5 text-primary-foreground/80" />
            </div>
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-primary-foreground">
              {currentData.title}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-[hsl(40,80%,70%)] to-secondary animate-shimmer">
                {currentData.highlight}
              </span>
              {currentData.subtitle && <span> {currentData.subtitle}</span>}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/75 max-w-2xl mx-auto leading-relaxed">
              {currentData.description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link to="/destinations">
              <Button 
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg rounded-full shadow-lg group transition-all font-bold"
              >
                <Plane className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                اكتشف الوجهات
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-md border border-white/30 text-primary-foreground hover:bg-white/20 px-8 py-6 text-lg rounded-full shadow-lg transition-all"
              onClick={() => setIsVideoPlaying(true)}
            >
              <Play className="w-5 h-5 ml-2 fill-current" />
              شاهد الفيديو
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-8 max-w-xl mx-auto">
            {Object.entries(currentData.stats).map(([key, value], index) => (
              <div key={key} className={cn("text-center animate-scale-in", index === 0 ? "[animation-delay:0s]" : index === 1 ? "[animation-delay:0.1s]" : "[animation-delay:0.2s]")}>
                <div className="text-3xl md:text-4xl font-bold text-accent mb-1">
                  {value}
                </div>
                <div className="text-sm text-primary-foreground/60 capitalize">
                  {!["destinations","customers","rating","programs","countries","years","honeymoon","resorts","offers"].includes(key) ? key : 
                    key === "destinations" ? "وجهة سياحية" :
                    key === "customers" ? "عميل سعيد" :
                    key === "rating" ? "تقييم العملاء" :
                    key === "programs" ? "برنامج سياحي" :
                    key === "countries" ? "دولة" :
                    key === "years" ? "سنة خبرة" :
                    key === "honeymoon" ? "زوجين" :
                    key === "resorts" ? "منتجع فاخر" : "خصم"
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative z-20 container pb-8 px-4 lg:px-8 animate-fade-in [animation-delay:0.4s]">
        <SkyscannerSearch variant="banner" />
      </div>

      {/* Slide Indicators — centered bottom */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-accent w-10" 
                : "bg-primary-foreground/30 w-6 hover:bg-primary-foreground/50"
            }`}
            aria-label={`الذهاب إلى الشريحة ${index + 1}`}
          />
        ))}
      </div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsVideoPlaying(false)}
        >
          <button
            onClick={() => setIsVideoPlaying(false)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all z-10"
            title="إغلاق"
          >
            <X className="w-6 h-6" />
          </button>
          <div 
            className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/LUCM2Sk0J6M?autoplay=1&rel=0"
              title="فيديو ترافليون"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default PremiumHeroSection;
