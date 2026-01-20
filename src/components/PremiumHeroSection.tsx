import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Play, MapPin, Calendar, Users, Sparkles, ArrowLeft, Award, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import heroVideo from "@/assets/malaysia.jpg"; // Will be video overlay

const PremiumHeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  const slides = [
    {
      title: "اكتشف",
      highlight: "جمال العالم",
      subtitle: "معنا",
      description: "رحلات استثنائية إلى أجمل الوجهات السياحية حول العالم",
      image: heroVideo,
      stats: { destinations: "50+", customers: "10,000+", rating: "4.9" }
    },
    {
      title: "رحلة",
      highlight: "أحلامك",
      subtitle: "تبدأ هنا",
      description: "برامج سياحية مخصصة تناسب جميع الأذواق والميزانيات",
      image: heroVideo,
      stats: { programs: "200+", countries: "25+", years: "15+" }
    },
    {
      title: "شهر عسل",
      highlight: "لا يُنسى",
      subtitle: "",
      description: "عروض رومانسية خاصة للعرسان في أفخم المنتجعات",
      image: heroVideo,
      stats: { honeymoon: "5000+", resorts: "100+", offers: "30%" }
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
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
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* Video Background Effect */}
      <div className="absolute inset-0">
        <div 
          className={cn("absolute inset-0 bg-cover bg-center transition-all duration-1000 bg-[image:var(--hero-bg)]")}
          style={{ "--hero-bg": `url(${currentData.image})` } as React.CSSProperties}
        />
        {/* Dark Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/95 via-cyan-900/80 to-blue-900/60" />
        
        {/* Animated Shapes - Interactive with mouse */}
        <div 
          className="absolute top-20 right-20 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl transition-transform duration-700 ease-out"
          style={{ 
            transform: `translate(${mousePosition.x * -40}px, ${mousePosition.y * -40}px)` 
          }}
        />
        <div 
          className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl transition-transform duration-500 ease-out"
          style={{ 
            transform: `translate(${mousePosition.x * 60}px, ${mousePosition.y * 60}px)` 
          }}
        />
        <div 
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl transition-transform duration-1000 ease-out"
          style={{ 
            transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * 30}px)` 
          }}
        />
        {/* Extra floating particles */}
        <div 
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl transition-transform duration-300 ease-out"
          style={{ 
            transform: `translate(${mousePosition.x * 80}px, ${mousePosition.y * -50}px)` 
          }}
        />
        <div 
          className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl transition-transform duration-800 ease-out"
          style={{ 
            transform: `translate(${mousePosition.x * -50}px, ${mousePosition.y * 70}px)` 
          }}
        />
      </div>

      {/* Content */}
      <div className="container relative h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="text-primary-foreground space-y-8 animate-fade-in">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-teal-500/20 backdrop-blur-sm px-6 py-3 rounded-full border border-teal-400/30">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <span className="text-sm font-medium">منصة السفر الأكثر ثقة في السعودية</span>
              <Award className="w-5 h-5 text-cyan-400" />
            </div>

            {/* Main Title */}
            <div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4">
                {currentData.title}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 animate-shimmer">
                  {currentData.highlight}
                </span>
                {currentData.subtitle && (
                  <span className="block text-4xl md:text-6xl">{currentData.subtitle}</span>
                )}
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-xl">
                {currentData.description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to="/destinations">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white px-8 py-6 text-lg rounded-full shadow-[0_8px_30px_rgba(20,184,166,0.4)] group"
                >
                  <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                  اكتشف الوجهات
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6 text-lg rounded-full backdrop-blur-sm"
                onClick={() => setIsVideoPlaying(true)}
              >
                <Play className="w-5 h-5 ml-2 fill-current" />
                شاهد الفيديو
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-primary-foreground/20">
              {Object.entries(currentData.stats).map(([key, value], index) => (
                <div key={key} className={cn("text-center animate-scale-in", index === 0 ? "[animation-delay:0s]" : index === 1 ? "[animation-delay:0.1s]" : "[animation-delay:0.2s]")}>
                  <div className="text-3xl md:text-4xl font-bold text-teal-400 mb-1">
                    {value}
                  </div>
                  <div className="text-sm text-primary-foreground/70 capitalize">
                    {key === "destinations" && "وجهة سياحية"}
                    {key === "customers" && "عميل سعيد"}
                    {key === "rating" && "تقييم العملاء"}
                    {key === "programs" && "برنامج سياحي"}
                    {key === "countries" && "دولة"}
                    {key === "years" && "سنة خبرة"}
                    {key === "honeymoon" && "زوجين"}
                    {key === "resorts" && "منتجع فاخر"}
                    {key === "offers" && "خصم"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Features Cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {[
              { icon: MapPin, title: "وجهات متنوعة", desc: "أكثر من 50 وجهة حول العالم", color: "bg-teal-500/20" },
              { icon: Calendar, title: "برامج مخصصة", desc: "خطط رحلتك كما تريد", color: "bg-cyan-500/20" },
              { icon: Users, title: "خدمة 24/7", desc: "فريق دعم متاح دائماً", color: "bg-blue-500/20" },
              { icon: Shield, title: "حجز آمن", desc: "ضمان استرداد كامل", color: "bg-teal-600/20" },
            ].map((feature, index) => (
              <div
                key={index}
                className={cn(
                  feature.color,
                  "backdrop-blur-sm p-6 rounded-2xl border border-primary-foreground/10 hover:scale-105 transition-all duration-300 animate-fade-in group cursor-pointer",
                  index === 0 ? "[animation-delay:0s]" : index === 1 ? "[animation-delay:0.15s]" : index === 2 ? "[animation-delay:0.3s]" : "[animation-delay:0.45s]"
                )}
              >
                <feature.icon className="w-10 h-10 text-primary-foreground mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-primary-foreground mb-2">{feature.title}</h3>
                <p className="text-primary-foreground/70">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-teal-400 w-12" 
                : "bg-primary-foreground/30 w-8 hover:bg-primary-foreground/50"
            }`}
            aria-label={`الذهاب إلى الشريحة ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full p-1">
          <div className="w-1 h-3 bg-teal-400 rounded-full mx-auto animate-pulse" />
        </div>
      </div>

      {/* Video Modal (placeholder) */}
      {isVideoPlaying && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setIsVideoPlaying(false)}
        >
          <div className="text-white text-center">
            <p className="text-2xl mb-4">سيتم إضافة الفيديو هنا</p>
            <Button onClick={() => setIsVideoPlaying(false)}>إغلاق</Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PremiumHeroSection;
