import { useState, useRef, useEffect } from "react";
import { X, ChevronRight, MapPin, Star, Calendar, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
interface Offer {
  id: string;
  title: string;
  destination: string;
  price: string;
  oldPrice?: string;
  image: string;
  rating: number;
  duration: string;
  badge?: string;
}
const FloatingOffersWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({
    x: 20,
    y: window.innerHeight - 120
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0
  });
  const widgetRef = useRef<HTMLDivElement>(null);
  const offers: Offer[] = [{
    id: "1",
    title: "جزر المالديف",
    destination: "المالديف - منتجع فاخر",
    price: "٩,٩٩٩ ر.س",
    oldPrice: "١٤,٩٩٩ ر.س",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8",
    rating: 4.9,
    duration: "٧ أيام / ٦ ليالي",
    badge: "خصم ٣٣٪"
  }, {
    id: "2",
    title: "سانتوريني اليونان",
    destination: "اليونان - جزيرة سانتوريني",
    price: "٧,٤٩٩ ر.س",
    oldPrice: "٩,٩٩٩ ر.س",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e",
    rating: 4.8,
    duration: "٥ أيام / ٤ ليالي",
    badge: "عرض محدود"
  }, {
    id: "3",
    title: "بالي إندونيسيا",
    destination: "إندونيسيا - بالي",
    price: "٥,٩٩٩ ر.س",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    rating: 4.7,
    duration: "٦ أيام / ٥ ليالي",
    badge: "HOT"
  }];
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".widget-drag-handle")) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Keep within viewport bounds
      const maxX = window.innerWidth - (widgetRef.current?.offsetWidth || 0);
      const maxY = window.innerHeight - (widgetRef.current?.offsetHeight || 0);
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);
  return <>
      {/* Floating Button */}
      {!isOpen && <div ref={widgetRef} className="fixed z-50 cursor-move" style={{
      left: `${position.x}px`,
      top: `${position.y}px`
    }} onMouseDown={handleMouseDown}>
          <button onClick={() => setIsOpen(true)} className="widget-drag-handle glass-premium rounded-2xl px-6 py-4 shadow-luxury border border-white/20 hover:scale-105 transition-all group">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="w-6 h-6 text-luxury-gold animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              </div>
              <div className="text-right">
                <div className="font-bold text-sm text-primary">عروض حصرية</div>
                <div className="text-xs text-primary">اطلع على أحدث العروض</div>
              </div>
              <ChevronRight className="w-5 h-5 text-luxury-gold group-hover:-translate-x-1 transition-transform" />
            </div>
          </button>
        </div>}

      {/* Expanded Panel */}
      {isOpen && <div ref={widgetRef} className="fixed z-50" style={{
      left: `${position.x}px`,
      top: `${position.y}px`
    }} onMouseDown={handleMouseDown}>
          <div className="glass-premium rounded-3xl shadow-luxury border border-white/20 w-[380px] max-h-[600px] overflow-hidden">
            {/* Header - Draggable */}
            <div className="widget-drag-handle cursor-move bg-gradient-to-r from-luxury-gold/20 to-luxury-teal/20 p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-luxury-gold" />
                  <div>
                    <h3 className="text-white font-bold text-lg">عروض حصرية</h3>
                    <p className="text-white/60 text-xs">أفضل العروض السياحية</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-white/70 hover:text-white" />
                </button>
              </div>
            </div>

            {/* Offers List - Scrollable */}
            <div className="overflow-y-auto max-h-[500px] p-4 space-y-4">
              {offers.map((offer, index) => <Link key={offer.id} to={`/offers#${offer.id}`} className="block group" style={{
            animationDelay: `${index * 100}ms`
          }}>
                  <div className="relative overflow-hidden rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-luxury-gold/50 hover:shadow-glow-gold">
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden">
                      <img src={offer.image} alt={offer.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy via-luxury-navy/50 to-transparent" />
                      
                      {/* Badge */}
                      {offer.badge && <div className="absolute top-3 left-3 bg-luxury-gold text-luxury-navy px-3 py-1 rounded-full text-xs font-bold">
                          {offer.badge}
                        </div>}

                      {/* Rating */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-luxury-navy/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
                        <span className="text-white text-xs font-bold">{offer.rating}</span>
                      </div>

                      {/* Title */}
                      <div className="absolute bottom-3 right-3 left-3">
                        <h4 className="text-white font-bold text-lg mb-1">{offer.title}</h4>
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{offer.destination}</span>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-white/60 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{offer.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-luxury-gold font-bold text-xl">{offer.price}</div>
                          {offer.oldPrice && <div className="text-white/40 text-sm line-through">{offer.oldPrice}</div>}
                        </div>
                        <div className="bg-luxury-gold/20 text-luxury-gold px-4 py-2 rounded-xl text-sm font-semibold group-hover:bg-luxury-gold group-hover:text-luxury-navy transition-colors">
                          احجز الآن
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>)}

              {/* View All */}
              <Link to="/offers" className="block p-4 text-center bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-luxury-teal transition-all group">
                <div className="flex items-center justify-center gap-2 text-luxury-teal font-semibold">
                  <span>عرض جميع العروض</span>
                  <ChevronRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </div>}
    </>;
};
export default FloatingOffersWidget;