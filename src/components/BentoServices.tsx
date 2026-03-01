import { Plane, Hotel, Car, Shield, Users, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  {
    icon: Users,
    title: "برامج سياحية",
    description: "رحلات متكاملة ومنظمة بأعلى معايير الجودة والرفاهية.",
    className: "md:col-span-2 md:row-span-2 bg-charcoal text-white",
    size: "large"
  },
  {
    icon: Sparkles,
    title: "وجهات مميزة",
    description: "أجمل الوجهات السياحية حول العالم مختارة بعناية.",
    className: "md:col-span-1 md:row-span-1 border border-border/40",
    size: "small"
  },
  {
    icon: Car,
    title: "تنقل فاخر",
    description: "أسطول من السيارات المصفحة والفارهة تحت تصرفك.",
    className: "md:col-span-1 md:row-span-2 bg-pearl",
    size: "medium"
  },
  {
    icon: Users,
    title: "تنفيذ الرحلات",
    description: "فريق مختص لإدارة كل ثانية في رحلتك.",
    className: "md:col-span-1 md:row-span-1 border border-border/40",
    size: "small"
  },
  {
    icon: Shield,
    title: "أمان واستشارة",
    description: "خدمات أمنية واستباقية لضمان سلامتك في كل وجهة.",
    className: "md:col-span-1 md:row-span-1 bg-aurora-indigo/5 border border-aurora-indigo/20",
    size: "small"
  }
];

const BentoServices = () => {
  return (
    <section className="py-24 md:py-40 bg-white">
      <div className="container px-4">
        {/* Editorial Title */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-12">
          <div className="max-w-3xl space-y-8 animate-reveal">
            <h2 className="font-editorial text-5xl md:text-8xl text-charcoal leading-none tracking-tighter">
              خدماتٌ <br /> <span className="text-aurora-indigo italic">تُصاغ</span> بعناية
            </h2>
            <p className="font-modern text-xl md:text-2xl text-charcoal/40 font-medium max-w-xl">
              نحن نؤمن بأن الرفاهية تكمن في التفاصيل الصغيرة غير المرئية، تلك التي تشعر بها ولا تراها.
            </p>
          </div>
          <div className="flex items-center gap-4 text-charcoal font-black text-xs tracking-[0.2em] uppercase cursor-pointer group animate-reveal reveal-delay-1">
             استكشف المزايا
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-4 transition-transform text-aurora-indigo" />
          </div>
        </div>

        {/* Masterpiece Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-none md:grid-rows-2 gap-6 md:h-[800px]">
          {items.map((item, i) => (
            <div 
              key={i} 
              className={cn(
                "group relative rounded-[3rem] p-10 flex flex-col justify-between transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 animate-reveal",
                item.className,
                i === 0 ? "reveal-delay-1" : i === 1 ? "reveal-delay-2" : "reveal-delay-3"
              )}
            >
              <div className="space-y-8">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center border border-current opacity-60 group-hover:opacity-100 transition-opacity",
                  item.size === 'large' ? 'w-20 h-20' : ''
                )}>
                  <item.icon className={cn("w-8 h-8", item.size === 'large' ? 'w-10 h-10' : '')} />
                </div>
                <h3 className={cn(
                  "font-modern font-black tracking-tighter leading-none",
                  item.size === 'large' ? 'text-4xl md:text-6xl mb-6' : 'text-2xl mb-4'
                )}>
                  {item.title}
                </h3>
                <p className={cn(
                  "font-modern font-medium opacity-60 max-w-xs",
                  item.size === 'large' ? 'text-xl leading-relaxed' : 'text-sm'
                )}>
                  {item.description}
                </p>
              </div>

              {/* Interaction Hint */}
              <div className="mt-8 flex items-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                <span className="text-[10px] font-black uppercase tracking-widest">التفاصيل الكاملة</span>
                <Sparkles className="w-4 h-4 text-aurora-indigo" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoServices;
