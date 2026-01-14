import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Expand, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const exhibitions = [
  {
    id: 1,
    name: "ملاذ جزر المالديف",
    region: "المحيط الهندي",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=2000",
    price: "١٢,٥٠٠",
    rating: "٥.٠"
  },
  {
    id: 2,
    name: "سحر قمم جورجيا",
    region: "القوقاز",
    image: "https://images.unsplash.com/photo-1565153205139-49f96b6134b1?auto=format&fit=crop&q=80&w=2000",
    price: "٧,٩٠٠",
    rating: "٤.٩"
  },
  {
    id: 3,
    name: "فينيسيا الإيطالية",
    region: "أوروبا",
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=2000",
    price: "١٥,٠٠٠",
    rating: "٥.٠"
  },
  {
    id: 4,
    name: "كوالالمبور الحديثة",
    region: "ماليزيا",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc183f27?auto=format&fit=crop&q=80&w=2000",
    price: "٦,٥٠٠",
    rating: "٤.٨"
  }
];

const LuxuryExhibition = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 md:py-40 bg-pearl overflow-hidden">
      <div className="container px-4">
        {/* Gallery Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-12">
          <div className="max-w-4xl space-y-8 animate-reveal">
            <div className="text-aurora-rose font-black tracking-[0.4em] uppercase text-xs">المعرض العالمي</div>
            <h2 className="font-editorial text-5xl md:text-9xl text-charcoal leading-none tracking-tighter">
              وجهاتٌ <br /> <span className="text-aurora-rose">بانتظارك</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-6 animate-reveal reveal-delay-1">
            <button 
              onClick={() => scroll('left')}
              title="السابق"
              className="w-16 h-16 rounded-full border border-charcoal/10 flex items-center justify-center hover:bg-charcoal hover:text-white transition-all duration-500"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
            <button 
              onClick={() => scroll('right')}
              title="التالي"
              className="w-16 h-16 rounded-full border border-charcoal/10 flex items-center justify-center hover:bg-charcoal hover:text-white transition-all duration-500"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Experimental Immersive Exhibition Rail */}
      <div 
        ref={scrollRef}
        className="flex gap-8 px-[10%] overflow-x-auto hide-scrollbar snap-x snap-mandatory"
      >
        {exhibitions.map((item, i) => (
          <div 
            key={item.id}
            className={cn(
              "flex-shrink-0 w-[85vw] md:w-[60vw] snap-center animate-reveal",
              i === 0 ? "reveal-delay-0" : i === 1 ? "reveal-delay-1" : i === 2 ? "reveal-delay-2" : "reveal-delay-3"
            )}
          >
            <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-[4rem] overflow-hidden shadow-2xl group cursor-none">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover img-pan"
              />
              
              {/* Artistic Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent flex flex-col md:flex-row items-end justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-aurora-rose">
                    <MapPin className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.region}</span>
                  </div>
                  <h3 className="font-editorial text-4xl md:text-7xl text-white leading-none tracking-tight">
                    {item.name}
                  </h3>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white mb-4">
                    <Star className="w-4 h-4 text-aurora-rose fill-aurora-rose" />
                    <span className="text-xs font-black">{item.rating}</span>
                  </div>
                  <div className="text-white space-y-1">
                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">يبدأ العرض من</span>
                    <div className="text-3xl font-black text-white">{item.price} <span className="text-xs font-medium opacity-60">ر.س</span></div>
                  </div>
                </div>
              </div>

              {/* Hover Cursor Effect (Simulated) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-700">
                   <Expand className="w-8 h-8 text-charcoal" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="container px-4 text-center mt-24 animate-reveal reveal-delay-2">
         <Link to="/destinations" className="btn-editorial-outline">عرض الكتالوج الكامل</Link>
      </div>
    </section>
  );
};

export default LuxuryExhibition;
