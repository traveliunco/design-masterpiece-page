import { Plane, Building2, Globe, CreditCard, Target, Star, Shield, Gift } from "lucide-react";

const MarqueeBanner = ({ 
  speed = "normal",
  direction = "left",
  className = "" 
}: {
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
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

  const speedClass = {
    slow: "animate-[marquee_40s_linear_infinite]",
    normal: "animate-[marquee_25s_linear_infinite]",
    fast: "animate-[marquee_15s_linear_infinite]",
  };

  const directionClass = direction === "right" ? "direction-reverse" : "";

  return (
    <div className={`overflow-hidden bg-gradient-to-r from-secondary via-gold to-secondary py-4 shadow-lg ${className}`}>
      <div 
        className={`flex whitespace-nowrap ${speedClass[speed]} ${directionClass}`}
      >
        {/* Triple duplicate for seamless continuous loop */}
        {[...items, ...items, ...items, ...items].map((item, index) => (
          <div 
            key={index}
            className="flex items-center gap-3 mx-8 text-white font-bold flex-shrink-0 group cursor-default"
          >
            <item.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-125" />
            <span className="text-sm md:text-base tracking-wide uppercase">{item.text}</span>
            <span className="text-white/30 mx-4 font-light">|</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeBanner;
