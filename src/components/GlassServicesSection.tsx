import { Plane, Hotel, Car, Shield, Users, CreditCard, MapPin, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
const services = [{
  icon: Plane,
  title: "حجوزات طيران عالمية",
  description: "تذاكر على جميع الخطوط الجوية العالمية بأفضل الأسعار المضمونة",
  gradient: "from-sky-500 to-blue-600",
  path: "/amadeus-flights",
  featured: true
}, {
  icon: Hotel,
  title: "فنادق ومنتجعات فاخرة",
  description: "أرقى الفنادق والمنتجعات المختارة بعناية لراحتك",
  gradient: "from-luxury-gold to-amber-600",
  path: "/hotels",
  featured: false
}, {
  icon: MapPin,
  title: "برامج سياحية متكاملة",
  description: "رحلات منظمة بدقة متناهية لأجمل الوجهات",
  gradient: "from-luxury-teal to-emerald-600",
  path: "/programs",
  featured: false
}, {
  icon: Car,
  title: "تأجير سيارات فاخرة",
  description: "أحدث موديلات السيارات مع سائقين محترفين",
  gradient: "from-slate-600 to-slate-800",
  path: "/car-rental",
  featured: false
}, {
  icon: CreditCard,
  title: "تقسيط مريح",
  description: "ادفع على دفعات ميسرة عبر تابي وتمارا بدون فوائد",
  gradient: "from-purple-500 to-violet-600",
  path: "/tabby",
  featured: false
}, {
  icon: Shield,
  title: "ضمان شامل",
  description: "حماية كاملة لرحلتك مع ضمان استرداد المبلغ",
  gradient: "from-rose-500 to-pink-600",
  path: "/service-guarantee",
  featured: false
}];
const GlassServicesSection = () => {
  return <section className="py-24 md:py-32 bg-gradient-to-b from-background via-luxury-cream/50 to-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-luxury-teal/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[150px]" />
      
      <div className="container px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 glass-premium rounded-full px-6 py-3 mb-6 animate-reveal">
            
            <span className="text-sm font-semibold text-luxury-navy">خدمات متميزة</span>
          </div>
          
          <h2 className="text-section text-luxury-navy mb-6 animate-reveal delay-100">
            كل ما تحتاجه <span className="text-gradient-teal">لرحلة مثالية</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-reveal delay-200">
            نقدم لك مجموعة متكاملة من الخدمات السياحية الفاخرة بأعلى معايير الجودة
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => <Link key={index} to={service.path} className={cn("group card-3d p-8 animate-reveal", service.featured && "md:col-span-2 lg:col-span-1")} style={{
          animationDelay: `${index * 0.1}s`
        }}>
              {/* Icon */}
              <div className={cn("w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3", service.gradient)}>
                <service.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-luxury-navy mb-3 group-hover:text-luxury-teal transition-colors">
                {service.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Link Indicator */}
              <div className="flex items-center gap-2 text-luxury-teal font-semibold opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                <span>اكتشف المزيد</span>
                <ArrowLeft className="w-4 h-4" />
              </div>

              {/* Hover Glow */}
              <div className={cn("absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl", `bg-gradient-to-br ${service.gradient}`)} style={{
            transform: 'scale(0.9)',
            opacity: 0.15
          }} />
            </Link>)}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-reveal delay-500">
          <Link to="/destinations">
            <button className="btn-luxury text-lg px-12 py-5 flex items-center gap-3 mx-auto">
              استعرض جميع الخدمات
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>;
};
export default GlassServicesSection;