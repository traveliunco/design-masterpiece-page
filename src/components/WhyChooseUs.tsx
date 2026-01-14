import { Shield, Award, HeartHandshake, Clock, Globe, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const WhyChooseUs = () => {
  const features = [
    {
      icon: Shield,
      title: "حجز آمن ومضمون",
      description: "نظام دفع آمن 100% مع ضمان استرداد كامل",
      gradient: "from-blue-500 to-cyan-500",
      benefits: ["تشفير SSL", "دفع آمن", "ضمان الاسترداد"]
    },
    {
      icon: Award,
      title: "15 سنة من التميز",
      description: "خبرة طويلة في تنظيم أفضل الرحلات السياحية",
      gradient: "from-secondary to-gold",
      benefits: ["10,000+ عميل", "98% رضا", "جوائز عالمية"]
    },
    {
      icon: HeartHandshake,
      title: "خدمة عملاء متميزة",
      description: "فريق محترف متاح 24/7 لخدمتك",
      gradient: "from-rose-500 to-pink-500",
      benefits: ["دعم فوري", "استشارات مجانية", "متابعة مستمرة"]
    },
    {
      icon: Clock,
      title: "أسعار تنافسية",
      description: "أفضل الأسعار مع عروض حصرية طوال العام",
      gradient: "from-green-500 to-emerald-500",
      benefits: ["خصومات حصرية", "عروض موسمية", "لا رسوم خفية"]
    },
    {
      icon: Globe,
      title: "وجهات متنوعة",
      description: "أكثر من 50 وجهة سياحية حول العالم",
      gradient: "from-purple-500 to-indigo-500",
      benefits: ["50+ وجهة", "برامج مخصصة", "رحلات فاخرة"]
    },
    {
      icon: Sparkles,
      title: "تجربة استثنائية",
      description: "كل تفصيلة مصممة لراحتك وسعادتك",
      gradient: "from-amber-500 to-orange-500",
      benefits: ["VIP services", "مرشدين محترفين", "فنادق فاخرة"]
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-muted via-background to-muted relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-gold/20 to-accent/20 rounded-full blur-3xl animate-float [animation-delay:2s]" />

      <div className="container relative">
        {/* Section Header */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">لماذا ترافليون؟</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold">
            نجعل
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-gold mx-3">
              أحلامك
            </span>
            حقيقة
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نفخر بكوننا الخيار الأول للمسافرين السعوديين، بفضل التزامنا بالتميز والجودة في كل تفصيلة
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn("group relative animate-fade-in", index === 0 ? "[animation-delay:0s]" : index === 1 ? "[animation-delay:0.1s]" : index === 2 ? "[animation-delay:0.2s]" : index === 3 ? "[animation-delay:0.3s]" : index === 4 ? "[animation-delay:0.4s]" : "[animation-delay:0.5s]")}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`} />
              
              {/* Card */}
              <div className="relative bg-card p-8 rounded-3xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-500 hover:shadow-2xl h-full">
                {/* Icon */}
                <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-br p-0.5 mb-6 group-hover:scale-110 transition-transform duration-500", feature.gradient)}>
                  <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
                    <feature.icon className={cn("w-8 h-8 text-primary group-hover:scale-110 transition-transform")} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Benefits List */}
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, i) => (
                    <li 
                      key={i}
                      className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors"
                    >
                      <CheckCircle2 className={`w-4 h-4 text-primary flex-shrink-0 group-hover:scale-110 transition-transform`} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Decorative Element */}
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-primary/5 to-secondary/5 group-hover:scale-150 transition-transform duration-700 blur-xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "10,000+", label: "عميل سعيد" },
            { number: "50+", label: "وجهة سياحية" },
            { number: "98%", label: "نسبة الرضا" },
            { number: "15+", label: "سنة خبرة" },
          ].map((stat, index) => (
            <div
              key={index}
              className={cn("text-center p-6 bg-card rounded-2xl border border-border hover:border-primary/30 transition-all hover:shadow-lg animate-scale-in", index === 0 ? "[animation-delay:0s]" : index === 1 ? "[animation-delay:0.1s]" : index === 2 ? "[animation-delay:0.2s]" : "[animation-delay:0.3s]")}
            >
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
