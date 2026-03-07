import { Shield, Trophy, HeartHandshake, Clock, Globe, ThumbsUp, Star, Heart, MapPin, Users, CheckCircle2, Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { homepageService } from "@/services/adminDataService";

// خريطة الأيقونات
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield, Trophy, HeartHandshake, Clock, Globe, ThumbsUp,
  Star, Heart, MapPin, Users, CheckCircle: CheckCircle2, Plane,
};


const WhyChooseUs = () => {
  const defaultFeatures = [
    { id: "1", icon: "Shield", title: "حجز آمن ومضمون", description: "نظام دفع آمن 100% مع ضمان استرداد كامل", color: "text-teal-500", bgColor: "bg-gradient-to-br from-teal-500/20 to-cyan-500/10" },
    { id: "2", icon: "Trophy", title: "15 سنة من التميز", description: "خبرة طويلة في تنظيم أفضل الرحلات السياحية", color: "text-cyan-500", bgColor: "bg-gradient-to-br from-cyan-500/20 to-blue-500/10" },
    { id: "3", icon: "HeartHandshake", title: "خدمة عملاء متميزة", description: "فريق محترف متاح 24/7 لخدمتك", color: "text-blue-500", bgColor: "bg-gradient-to-br from-blue-500/20 to-indigo-500/10" },
    { id: "4", icon: "Clock", title: "أسعار تنافسية", description: "أفضل الأسعار مع عروض حصرية طوال العام", color: "text-emerald-500", bgColor: "bg-gradient-to-br from-emerald-500/20 to-teal-500/10" },
    { id: "5", icon: "Globe", title: "وجهات متنوعة", description: "أكثر من 50 وجهة سياحية حول العالم", color: "text-indigo-500", bgColor: "bg-gradient-to-br from-indigo-500/20 to-blue-500/10" },
    { id: "6", icon: "ThumbsUp", title: "تجربة استثنائية", description: "كل تفصيلة مصممة لراحتك وسعادتك", color: "text-teal-600", bgColor: "bg-gradient-to-br from-teal-600/20 to-emerald-500/10" },
  ];
  const defaultStats = [
    { id: "1", number: "10,000+", label: "عميل سعيد" },
    { id: "2", number: "50+", label: "وجهة سياحية" },
    { id: "3", number: "98%", label: "نسبة الرضا" },
    { id: "4", number: "15+", label: "سنة خبرة" },
  ];

  const [features, setFeatures] = useState(defaultFeatures);
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    // جلب المميزات
    homepageService.getFeatures().then((data: unknown[]) => {
      if (data && data.length > 0) {
        setFeatures((data as typeof defaultFeatures).map((f, i) => ({ ...defaultFeatures[0], ...f, id: String(f.id || i) })));
      }
    }).catch(() => {});
    // جلب الإحصائيات
    homepageService.getStats().then((data: unknown[]) => {
      if (data && data.length > 0) {
        setStats((data as typeof defaultStats).map((s, i) => ({ ...defaultStats[0], ...s, id: String(s.id || i) })));
      }
    }).catch(() => {});
  }, []);

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50 relative">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-luxury-navy/5 px-5 py-2 rounded-full mb-6">
            <Trophy className="w-4 h-4 text-teal-500" />
            <span className="text-sm font-bold text-luxury-navy">لماذا ترافليون؟</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-luxury-navy mb-6">
            نجعل <span className="text-luxury-teal">أحلامك</span> حقيقة
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            نفخر بكوننا الخيار الأول للمسافرين السعوديين، بفضل التزامنا بالتميز والجودة في كل تفصيلة
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-luxury-teal/30 transition-all duration-500 hover:-translate-y-1"
            >
              <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-6", feature.bgColor)}>
                <feature.icon className={cn("w-7 h-7", feature.color)} />
              </div>
              <h3 className="text-xl font-bold text-luxury-navy mb-3 group-hover:text-luxury-teal transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 rounded-3xl p-8 md:p-12 shadow-[0_10px_50px_rgba(20,184,166,0.3)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-cyan-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
