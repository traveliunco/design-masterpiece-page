import { Star, Quote, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    name: "أحمد الغامدي",
    location: "الرياض",
    avatar: "أ",
    text: "تجربة استثنائية مع ترافليون! كانت رحلة شهر العسل في المالديف من أجمل الذكريات. الفريق اهتم بأدق التفاصيل.",
    rating: 5,
    verified: true,
  },
  {
    id: 2,
    name: "سارة العتيبي",
    location: "جدة",
    avatar: "س",
    text: "حجزت لعائلتي رحلة إلى تركيا وكانت التجربة ممتازة. التنظيم رائع والفنادق فاخرة والجولات منظمة بشكل احترافي.",
    rating: 5,
    verified: true,
  },
  {
    id: 3,
    name: "محمد القحطاني",
    location: "الدمام",
    avatar: "م",
    text: "أفضل وكالة سياحية تعاملت معها. الأسعار منافسة والخدمة على مدار الساعة. أنصح الجميع بالتعامل معهم.",
    rating: 5,
    verified: true,
  },
];

const stats = [
  { value: "٤.٩", label: "تقييم عام", sublabel: "Google Reviews" },
  { value: "+١٠K", label: "عميل سعيد", sublabel: "منذ ٢٠١٨" },
  { value: "٩٥٪", label: "نسبة الرضا", sublabel: "استطلاع العملاء" },
];

const GlassTestimonials = () => {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-background via-luxury-cream/30 to-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-luxury-teal/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-luxury-gold/5 rounded-full blur-[100px]" />
      
      <div className="container px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 glass-premium rounded-full px-6 py-3 mb-6 animate-reveal">
            <Star className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
            <span className="text-sm font-semibold text-luxury-navy">آراء عملائنا</span>
          </div>
          
          <h2 className="heading-modern text-4xl md:text-5xl lg:text-6xl text-luxury-navy mb-6 animate-reveal delay-100">
            ماذا يقول <span className="text-gradient-teal">عملاؤنا</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-reveal delay-200">
            نفتخر بثقة آلاف العملاء الذين اختاروا ترافليون لرحلاتهم
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={cn(
                "text-center glass-premium rounded-3xl px-10 py-8 animate-reveal",
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl md:text-5xl font-bold text-luxury-teal mb-2">
                {stat.value}
              </div>
              <div className="text-luxury-navy font-semibold">{stat.label}</div>
              <div className="text-muted-foreground text-sm">{stat.sublabel}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={cn(
                "card-3d p-8 animate-reveal"
              )}
              style={{ animationDelay: `${(index + 3) * 0.1}s` }}
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-luxury-teal/20 mb-6" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-luxury-gold fill-luxury-gold" />
                ))}
              </div>

              {/* Text */}
              <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-luxury-teal to-emerald-600 flex items-center justify-center text-white font-bold text-xl">
                  {testimonial.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-luxury-navy">{testimonial.name}</span>
                    {testimonial.verified && (
                      <CheckCircle className="w-4 h-4 text-luxury-teal" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-8 mt-16 pt-16 border-t border-border/50">
          {[
            { name: "مرخصة من وزارة السياحة", icon: "🏛️" },
            { name: "عضو IATA", icon: "✈️" },
            { name: "شهادة ISO 9001", icon: "🏆" },
          ].map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-muted-foreground animate-reveal"
              style={{ animationDelay: `${(index + 6) * 0.1}s` }}
            >
              <span className="text-2xl">{badge.icon}</span>
              <span className="font-medium">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlassTestimonials;
