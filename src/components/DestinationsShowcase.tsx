import { useRef } from "react";
import { ArrowLeft, ArrowRight, Star, MapPin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

import malaysiaImg from "@/assets/malaysia.jpg";
import thailandImg from "@/assets/thailand.jpg";
import turkeyImg from "@/assets/turkey.jpg";
import indonesiaImg from "@/assets/indonesia.jpg";
import maldivesImg from "@/assets/maldives.jpg";
import georgiaImg from "@/assets/georgia.jpg";

const destinations = [
  {
    id: 1,
    slug: "malaysia",
    name: "ماليزيا",
    tagline: "جنة استوائية",
    image: malaysiaImg,
    price: "3,499",
    duration: "7 أيام",
    rating: 4.9,
  },
  {
    id: 2,
    slug: "thailand",
    name: "تايلاند",
    tagline: "أرض الابتسامات",
    image: thailandImg,
    price: "2,999",
    duration: "6 أيام",
    rating: 4.8,
  },
  {
    id: 3,
    slug: "turkey",
    name: "تركيا",
    tagline: "حيث التاريخ يلتقي الحداثة",
    image: turkeyImg,
    price: "4,299",
    duration: "8 أيام",
    rating: 4.9,
  },
  {
    id: 4,
    slug: "indonesia",
    name: "إندونيسيا",
    tagline: "سحر الطبيعة",
    image: indonesiaImg,
    price: "3,799",
    duration: "7 أيام",
    rating: 4.7,
  },
  {
    id: 5,
    slug: "maldives",
    name: "المالديف",
    tagline: "جنة على الأرض",
    image: maldivesImg,
    price: "9,999",
    duration: "5 أيام",
    rating: 5.0,
  },
  {
    id: 6,
    slug: "georgia",
    name: "جورجيا",
    tagline: "جوهرة القوقاز",
    image: georgiaImg,
    price: "2,799",
    duration: "6 أيام",
    rating: 4.8,
  },
];

const DestinationsShowcase = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 md:py-32 bg-luxury-navy relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-luxury-teal/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-luxury-gold/10 rounded-full blur-[150px]" />
      
      <div className="container px-4 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="inline-flex items-center gap-3 glass-dark rounded-full px-6 py-3 mb-6 animate-reveal">
              <MapPin className="w-4 h-4 text-luxury-gold" />
              <span className="text-sm font-medium text-white/80">وجهاتنا المميزة</span>
            </div>
            
            <h2 className="text-section text-white mb-4 animate-reveal delay-100">
              اكتشف <span className="text-gradient-gold">أجمل الوجهات</span>
            </h2>
            
            <p className="text-xl text-white/60 max-w-xl animate-reveal delay-200">
              وجهات مختارة بعناية لتناسب جميع الأذواق والميزانيات
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-4 animate-reveal delay-300">
            <button
              onClick={() => scroll('right')}
              title="السابق"
              className="w-14 h-14 rounded-full glass-button flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('left')}
              title="التالي"
              className="w-14 h-14 rounded-full bg-luxury-gold text-luxury-navy flex items-center justify-center hover:bg-luxury-gold/90 transition-all shadow-glow-gold"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Destinations Carousel */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 snap-x snap-mandatory"
        >
          {destinations.map((dest, index) => (
            <Link
              key={dest.id}
              to={`/destinations/${dest.slug}`}
              className={cn(
                "group flex-shrink-0 w-[320px] md:w-[380px] snap-center animate-reveal"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative rounded-[2rem] overflow-hidden aspect-[3/4] card-3d">
                {/* Image */}
                <img 
                  src={dest.image} 
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy via-luxury-navy/30 to-transparent" />
                
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 glass-dark rounded-full px-4 py-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
                  <span className="text-white font-bold text-sm">{dest.rating}</span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-luxury-gold text-sm font-medium mb-2 block">{dest.tagline}</span>
                  <h3 className="text-2xl font-bold text-white mb-3">{dest.name}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{dest.duration}</span>
                    </div>
                    <div>
                      <span className="text-white/50 text-xs">ابتداءً من</span>
                      <div className="text-luxury-gold font-bold text-xl">{dest.price} ر.س</div>
                    </div>
                  </div>
                  
                  {/* Hover CTA */}
                  <div className="mt-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <div className="btn-gold rounded-full py-3 text-center text-sm font-semibold">
                      استكشف الباقة
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12 animate-reveal delay-500">
          <Link 
            to="/destinations"
            className="inline-flex items-center gap-3 text-white/70 hover:text-luxury-gold transition-colors font-semibold"
          >
            <span>عرض جميع الوجهات</span>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DestinationsShowcase;
