import { useState, useEffect, useRef, memo } from "react";
import { Link } from "react-router-dom";
import { Play, Plane, ArrowLeft, Shield, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-resort.jpg";
import heroImage2 from "@/assets/turkey.jpg";
import heroImage3 from "@/assets/maldives.jpg";
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
  const sectionRef = useRef<HTMLElement>(null);

  const defaultSlides: Slide[] = [
    {
      title: "اكتشف", highlight: "العالم", subtitle: "معنا",
      description: "رحلات استثنائية إلى أجمل الوجهات السياحية حول العالم مع أفضل الأسعار والخدمات",
      image: heroImage,
      stats: { "وجهة": "50+", "عميل": "10,000+", "تقييم": "4.9" }
    },
    {
      title: "رحلة", highlight: "أحلامك", subtitle: "تبدأ هنا",
      description: "برامج سياحية مخصصة تناسب جميع الأذواق والميزانيات",
      image: heroImage2,
      stats: { "برنامج": "200+", "دولة": "25+", "سنة خبرة": "15+" }
    },
    {
      title: "شهر عسل", highlight: "لا يُنسى", subtitle: "",
      description: "عروض رومانسية خاصة للعرسان في أفخم المنتجعات العالمية",
      image: heroImage3,
      stats: { "شهر عسل": "5000+", "منتجع": "100+", "خصم حتى": "30%" }
    },
  ];

  const [slides, setSlides] = useState<Slide[]>(defaultSlides);

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
            image: (s.image as string) || heroImage,
            stats: (s.stats as Record<string, string>) || {}
          }));
        if (mapped.length > 0) setSlides(mapped);
      }
    }).catch(() => {});
  }, []);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentData = slides[currentSlide];

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background Images with crossfade */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-opacity duration-1000",
              i === currentSlide ? "opacity-100" : "opacity-0"
            )}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}
        {/* Premium Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary))]/80 via-[hsl(var(--primary))]/60 to-[hsl(180,30%,10%)]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* Floating light orbs */}
      <div className="absolute top-20 right-[10%] w-72 h-72 bg-secondary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-32 left-[10%] w-96 h-96 bg-accent/15 rounded-full blur-[140px] animate-pulse [animation-delay:3s]" />

      {/* Content */}
      <div className="container relative flex-1 flex flex-col items-center justify-center text-center pt-28 pb-12 z-10">
        <div className="w-full max-w-5xl mx-auto space-y-8">

          {/* Trust Badge */}
          <div className="flex justify-center animate-fade-in">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/15 shadow-lg">
              <div className="flex -space-x-1.5 rtl:space-x-reverse">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full bg-secondary/90 border-2 border-primary flex items-center justify-center">
                    <Star className="w-3 h-3 text-primary-foreground fill-primary-foreground" />
                  </div>
                ))}
              </div>
              <span className="text-xs font-bold text-primary-foreground/80 tracking-wide">
                منصة السفر الأكثر ثقة في السعودية
              </span>
              <Shield className="w-4 h-4 text-secondary" />
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-5 animate-fade-in [animation-delay:0.15s]">
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.1] text-primary-foreground tracking-tight">
              {currentData.title}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-secondary via-[hsl(40,85%,65%)] to-secondary">
                {currentData.highlight}
              </span>
              {currentData.subtitle && <span className="block md:inline"> {currentData.subtitle}</span>}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/65 max-w-2xl mx-auto leading-relaxed font-medium">
              {currentData.description}
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-3xl mx-auto animate-fade-in [animation-delay:0.3s]">
            <SkyscannerSearch variant="hero" />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in [animation-delay:0.4s]">
            <Link to="/destinations">
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-10 py-7 text-lg rounded-2xl shadow-[0_8px_30px_rgba(212,175,55,0.4)] group transition-all font-bold hover:shadow-[0_12px_40px_rgba(212,175,55,0.5)] hover:scale-[1.03]"
              >
                <Plane className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                اكتشف الوجهات
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              className="bg-white/8 backdrop-blur-md border-2 border-white/25 text-primary-foreground hover:bg-white/15 hover:border-secondary/50 px-10 py-7 text-lg rounded-2xl shadow-lg transition-all hover:scale-[1.03]"
              onClick={() => setIsVideoPlaying(true)}
            >
              <Play className="w-5 h-5 ml-2 fill-current" />
              شاهد الفيديو
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 md:gap-12 pt-4 animate-fade-in [animation-delay:0.5s]">
            {Object.entries(currentData.stats).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-secondary mb-0.5">
                  {value}
                </div>
                <div className="text-xs text-primary-foreground/50 font-semibold tracking-wide">
                  {key}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              index === currentSlide
                ? "bg-secondary w-10"
                : "bg-primary-foreground/25 w-5 hover:bg-primary-foreground/40"
            )}
            aria-label={`الشريحة ${index + 1}`}
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

export default memo(PremiumHeroSection);
