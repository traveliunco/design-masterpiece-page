import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    name: "أحمد الغامدي",
    location: "الرياض",
    text: "تجربة رائعة مع ترافليون! كانت رحلة شهر العسل في ماليزيا من أجمل الذكريات. شكراً على الخدمة المميزة.",
    rating: 5,
  },
  {
    id: 2,
    name: "سارة العتيبي",
    location: "جدة",
    text: "حجزت لعائلتي رحلة إلى تركيا وكانت التجربة ممتازة. الفريق محترف والخدمة راقية جداً.",
    rating: 5,
  },
  {
    id: 3,
    name: "محمد القحطاني",
    location: "المدينة المنورة",
    text: "أفضل وكالة سياحية تعاملت معها. الأسعار منافسة والخدمة على مدار الساعة. أنصح الجميع بهم.",
    rating: 5,
  },
  {
    id: 4,
    name: "نورة الشمري",
    location: "الدمام",
    text: "رحلة إندونيسيا كانت فوق التوقعات! الفنادق فاخرة والجولات منظمة بشكل ممتاز.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="bg-pearl relative overflow-hidden">
      <div className="container relative px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block bg-aurora-indigo/10 text-aurora-indigo px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 animate-reveal">
            آراء العملاء
          </span>
          <h2 className="font-editorial text-5xl md:text-8xl text-charcoal mb-6 animate-reveal reveal-delay-1">
            عملاؤنا <span className="text-aurora-indigo italic">يخبروكم</span>
          </h2>
          <p className="text-charcoal/60 text-xl font-modern font-medium max-w-2xl mx-auto animate-reveal reveal-delay-2">
            اطلع على آراء العملاء وستلاحظ أننا دائماً في الصدارة بتفانينا في العمل والالتزام بالمواعيد
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={cn(
                "bg-white border border-border/40 rounded-[2rem] p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-reveal",
                index === 0 ? "reveal-delay-1" : index === 1 ? "reveal-delay-2" : index === 2 ? "reveal-delay-3" : "reveal-delay-3"
              )}
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-aurora-indigo/20 mb-6" />

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-aurora-rose fill-aurora-rose" />
                ))}
              </div>

              {/* Text */}
              <p className="text-charcoal/70 mb-8 leading-relaxed font-modern">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-charcoal/5 rounded-full flex items-center justify-center">
                  <span className="text-charcoal font-black text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-charcoal">{testimonial.name}</div>
                  <div className="text-sm text-charcoal/40">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-20 flex flex-wrap justify-center items-center gap-12 animate-reveal reveal-delay-3">
          <div className="text-center">
            <div className="text-4xl font-black text-aurora-indigo mb-2">4.8</div>
            <div className="flex gap-1 justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-aurora-rose fill-aurora-rose" />
              ))}
            </div>
            <div className="text-sm text-charcoal/40 font-bold">Google Reviews</div>
          </div>
          <div className="h-12 w-px bg-charcoal/10 hidden md:block" />
          <div className="text-center">
            <div className="text-2xl font-black text-charcoal mb-2">مرخصة</div>
            <div className="text-sm text-charcoal/40 font-bold">وزارة السياحة</div>
          </div>
          <div className="h-12 w-px bg-charcoal/10 hidden md:block" />
          <div className="text-center">
            <div className="text-2xl font-black text-charcoal mb-2">معروف</div>
            <div className="text-sm text-charcoal/40 font-bold">التجارة السعودية</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;