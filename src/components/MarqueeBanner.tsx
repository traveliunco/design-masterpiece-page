import { Plane, Building2, Globe, CreditCard, Target, Star, Shield, Gift } from "lucide-react";
import { useEffect, useRef } from "react";

const MarqueeBanner = ({ 
  className = "" 
}: {
  className?: string;
}) => {
  const items = [
    { icon: Plane, text: "رحلات سياحية مميزة" },
    { icon: Building2, text: "فنادق فاخرة" },
    { icon: Globe, text: "وجهات عالمية" },
    { icon: CreditCard, text: "تقسيط مريح" },
    { icon: Target, text: "خدمة 24/7" },
    { icon: Star, text: "أفضل الأسعار" },
    { icon: Shield, text: "حجز آمن" },
    { icon: Gift, text: "عروض حصرية" },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const speedRef = useRef(1);
  const lastScrollY = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      if (delta > 0) {
        speedRef.current = Math.min(speedRef.current + 0.5, 5);
      } else if (delta < 0) {
        speedRef.current = Math.max(speedRef.current - 0.5, -5);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const track1 = track1Ref.current;
    const track2 = track2Ref.current;
    if (!track1 || !track2) return;

    const animate = () => {
      const trackWidth = track1.offsetWidth;
      if (trackWidth === 0) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      posRef.current -= speedRef.current;

      // Wrap around seamlessly
      if (posRef.current <= -trackWidth) {
        posRef.current += trackWidth;
      } else if (posRef.current >= trackWidth) {
        posRef.current -= trackWidth;
      }

      // Two identical tracks side by side, shifted so one always fills the gap
      track1.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
      track2.style.transform = `translate3d(${posRef.current + trackWidth}px, 0, 0)`;

      // When going right (reverse), the second track goes behind
      if (posRef.current > 0) {
        track2.style.transform = `translate3d(${posRef.current - trackWidth}px, 0, 0)`;
      }

      speedRef.current += (1 - speedRef.current) * 0.015;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const ItemsList = () => (
    <>
      {items.map((item, index) => (
        <div 
          key={index}
          className="flex items-center gap-3 mx-8 text-white font-bold flex-shrink-0 cursor-default"
        >
          <item.icon className="w-5 h-5 text-cyan-200" />
          <span className="text-sm md:text-base tracking-wide">{item.text}</span>
          <span className="text-white/50 mx-4">•</span>
        </div>
      ))}
    </>
  );

  return (
    <div 
      ref={containerRef}
      className={`overflow-hidden bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 py-4 shadow-[0_4px_20px_rgba(20,184,166,0.3)] relative ${className}`}
    >
      <div 
        ref={track1Ref}
        className="flex whitespace-nowrap will-change-transform absolute top-0 bottom-0 items-center"
      >
        <ItemsList />
        <ItemsList />
      </div>
      <div 
        ref={track2Ref}
        className="flex whitespace-nowrap will-change-transform absolute top-0 bottom-0 items-center"
      >
        <ItemsList />
        <ItemsList />
      </div>
      {/* Invisible spacer to maintain height */}
      <div className="flex whitespace-nowrap invisible">
        <ItemsList />
      </div>
    </div>
  );
};

export default MarqueeBanner;
