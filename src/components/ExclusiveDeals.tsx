import { Link } from "react-router-dom";
import { Percent, Sparkles, Clock, ArrowLeft } from "lucide-react";

const EXCLUSIVE_DEALS = [
  {
    id: 1,
    title: "خصم 25% على أول حجز فندقي",
    description: "استمتع بخصم حصري على حجزك الأول في أفضل الفنادق",
    discount: "25%",
    code: "WELCOME25",
    gradient: "from-primary to-blue-600",
    icon: Sparkles,
    link: "/hotels",
    expiry: "عرض محدود",
  },
  {
    id: 2,
    title: "وفّر حتى 500 ر.س على الطيران",
    description: "على رحلاتك الدولية الأولى مع ترافليون",
    discount: "500 ر.س",
    code: "FLY500",
    gradient: "from-emerald-600 to-teal-500",
    icon: Percent,
    link: "/flights",
    expiry: "ينتهي قريباً",
  },
  {
    id: 3,
    title: "باقة شهر عسل بخصم 30%",
    description: "رحلة أحلامك بأسعار لا تُقاوم للأزواج الجدد",
    discount: "30%",
    code: "HONEY30",
    gradient: "from-rose-500 to-pink-600",
    icon: Sparkles,
    link: "/honeymoon",
    expiry: "عرض موسمي",
  },
  {
    id: 4,
    title: "خصم 20% على البرامج السياحية",
    description: "استكشف وجهات جديدة بأسعار مميزة للمسافرين الجدد",
    discount: "20%",
    code: "TRIP20",
    gradient: "from-amber-500 to-orange-500",
    icon: Clock,
    link: "/programs",
    expiry: "لفترة محدودة",
  },
];

const ExclusiveDeals = () => {
  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-foreground">عروض حصرية للمستخدمين الجدد</h2>
              <p className="text-sm text-muted-foreground">وفّر أكثر في رحلتك الأولى معنا</p>
            </div>
          </div>
          <Link
            to="/offers"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            عرض الكل
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Deals Grid - horizontal scrollable on mobile, grid on desktop */}
        <div className="flex gap-4 overflow-x-auto pb-4 lg:pb-0 lg:grid lg:grid-cols-4 scrollbar-hide snap-x snap-mandatory">
          {EXCLUSIVE_DEALS.map((deal) => {
            const Icon = deal.icon;
            return (
              <Link
                key={deal.id}
                to={deal.link}
                className="min-w-[280px] lg:min-w-0 snap-start group"
              >
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${deal.gradient} p-5 h-[180px] flex flex-col justify-between transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-lg`}>
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/20" />
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/15" />
                  </div>

                  {/* Top row */}
                  <div className="relative flex items-start justify-between">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs text-white font-medium mb-2">
                        <Clock className="w-3 h-3" />
                        {deal.expiry}
                      </div>
                      <h3 className="text-white font-bold text-base leading-snug">{deal.title}</h3>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 mr-3">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Bottom row */}
                  <div className="relative flex items-end justify-between">
                    <p className="text-white/80 text-xs max-w-[70%] leading-relaxed">{deal.description}</p>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-white font-extrabold text-2xl leading-none">{deal.discount}</span>
                      <span className="bg-white/25 backdrop-blur-sm rounded-md px-2 py-0.5 text-[10px] text-white font-mono tracking-wider">
                        {deal.code}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile "View All" */}
        <Link
          to="/offers"
          className="sm:hidden flex items-center justify-center gap-1.5 mt-4 text-sm font-medium text-primary"
        >
          عرض جميع العروض
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default ExclusiveDeals;
