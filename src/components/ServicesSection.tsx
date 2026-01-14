import { Plane, Hotel, Car, Headphones, CreditCard, Shield, Users, Clock, Sparkles, MapPin, Star, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Plane,
    title: "تذاكر طيران",
    description: "حجز تذاكر طيران على جميع الخطوط العالمية بأفضل الأسعار مع توفير خيارات مرنة للحجز",
    gradient: "from-blue-500/20 to-cyan-500/20",
    path: "/flights"
  },
  {
    icon: Hotel,
    title: "فنادق فاخرة",
    description: "أفخم الفنادق والمنتجعات العالمية المختارة بعناية لضمان تجربة سكن استثنائية",
    gradient: "from-gold/20 to-yellow-600/20",
    path: "/hotels"
  },
  {
    icon: Car,
    title: "سيارات خاصة",
    description: "أحدث موديلات السيارات الفاخرة مع سائقين محترفين لاستقبالكم في جميع المطارات",
    gradient: "from-gray-700/20 to-gray-900/20",
    path: "/car-rental"
  },
  {
    icon: Users,
    title: "بكجات عائلية",
    description: "خطط سياحية شاملة وممتعة لكل أفراد العائلة تجمع بين الترفيه والراحة والخصوصية",
    gradient: "from-teal-500/20 to-emerald-500/20",
    path: "/programs"
  },
  {
    icon: CreditCard,
    title: "تقسيط مريح",
    description: "حلول دفع ذكية وتقسيط ميسر عبر تابي وتمارا لتسهيل رحلة أحلامك بدون فوائد",
    gradient: "from-purple-500/20 to-pink-500/20",
    path: "/tabby"
  },
  {
    icon: Clock,
    title: "مركز الدعم",
    description: "فريق دعم مختص متاح على مدار الساعة للإجابة على استفساراتكم في أي وقت وبكل لغات العالم",
    gradient: "from-orange-500/20 to-red-500/20",
    path: "/customer-support"
  },
  {
    icon: Shield,
    title: "ضمان الجودة",
    description: "نحن وكالة معتمدة ومرخصة نضمن لك أعلى معايير الخدمة والأمان في جميع رحلاتنا",
    gradient: "from-indigo-500/20 to-blue-600/20",
    path: "/service-guarantee"
  },
  {
    icon: Headphones,
    title: "دليل الخدمات",
    description: "نخبة من المرشدين المختصين لمرافقتكم في استكشاف تفاصيل الرحلة والوجهات",
    gradient: "from-emerald-400/20 to-teal-400/20",
    path: "/service-info"
  },
];

const ServicesSection = () => {
  return (
    <section className="py-24 md:py-40 bg-primary relative overflow-hidden">
      {/* Background Cinematography Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,rgba(212,175,55,0.1),transparent_40%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_90%_80%,rgba(212,175,55,0.08),transparent_40%)]" />
        {/* Animated Dust Particles Effect */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
      </div>

      <div className="container relative z-10 px-4">
        {/* Modern App-Style Header */}
        <div className="max-w-4xl mb-24 space-y-8 animate-reveal">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-20 bg-secondary" />
            <span className="text-secondary font-black tracking-[0.4em] uppercase text-xs">خدمات لا تُضاهى</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black text-white leading-[1.1] tracking-tighter">
            ارتقِ بتجربة سفرك <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-gold-light">إلى آفاق جديدة</span>
          </h2>
        </div>

        {/* High-End App Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.path}
              className={cn(
                "group relative bg-white/5 backdrop-blur-2xl rounded-[3rem] p-12 border border-white/10 transition-all duration-700 hover:-translate-y-4 hover:bg-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]",
                (index % 4) === 0 ? "animate-reveal" : (index % 4) === 1 ? "animate-reveal reveal-delay-1" : (index % 4) === 2 ? "animate-reveal reveal-delay-2" : "animate-reveal reveal-delay-3"
              )}
            >
              {/* Luxury Icon Frame */}
              <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center mb-10 border border-white/10 group-hover:bg-secondary group-hover:rotate-[15deg] transition-all duration-700 shadow-luxury">
                <service.icon className="w-10 h-10 text-secondary group-hover:text-primary transition-colors duration-700" />
              </div>
              
              <h3 className="text-3xl font-black text-white mb-6 group-hover:text-secondary transition-colors duration-500">
                {service.title}
              </h3>
              <p className="text-white/40 text-sm font-medium leading-loose group-hover:text-white/80 transition-colors duration-500">
                {service.description}
              </p>

              {/* Decorative App Dot */}
              <div className="absolute bottom-8 right-8 w-1.5 h-1.5 bg-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-ping" />
            </Link>
          ))}
        </div>

        {/* Global Excellence Banner: Premium App Finish */}
        <div className="mt-32 md:mt-48 relative overflow-hidden rounded-[4rem] bg-secondary/10 border border-white/5 p-12 md:p-24 animate-reveal">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-gold/10 to-transparent" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="space-y-6 text-center md:text-right">
              <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter">لماذا تختار ترافليون؟</h3>
              <p className="text-white/50 text-xl font-medium max-w-xl">
                ببساطة، لأننا نؤمن أن السفر ليس مجرد انتقال من مكان لآخر، بل هو رحلة لاكتشاف الذات وتسطير ذكريات لا تذبل.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 md:gap-12">
              {[
                { label: "جودة ملكية", icon: Award },
                { label: "دليل مختص", icon: Users },
                { label: "أمان تام", icon: Shield },
                { label: "سعر حصري", icon: Star },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-4 group cursor-default">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-secondary transition-all duration-500">
                    <item.icon className="w-8 h-8 text-secondary group-hover:scale-125 transition-transform" />
                  </div>
                  <span className="text-white/80 text-xs font-black uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;