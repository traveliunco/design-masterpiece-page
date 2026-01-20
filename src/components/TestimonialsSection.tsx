import { Star, Quote, CheckCircle } from "lucide-react";
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
    <section className="py-20 md:py-32 bg-gray-50 relative overflow-hidden">
      <div className="container relative px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-luxury-navy/5 px-5 py-2 rounded-full mb-6">
            <Star className="w-4 h-4 text-teal-500 fill-teal-500" />
            <span className="text-sm font-bold text-luxury-navy">آراء العملاء</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-luxury-navy mb-6">
            عملاؤنا <span className="text-luxury-teal">يخبروكم</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            اطلع على آراء العملاء وستلاحظ أننا دائماً في الصدارة بتفانينا في العمل والالتزام بالمواعيد
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-luxury-teal/30 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-teal-500 fill-teal-500" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 bg-luxury-navy/10 rounded-full flex items-center justify-center">
                  <span className="text-luxury-navy font-bold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-luxury-navy text-sm">{testimonial.name}</div>
                  <div className="text-xs text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 mb-1">4.8</div>
              <div className="flex gap-0.5 justify-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-teal-500 fill-teal-500" />
                ))}
              </div>
              <div className="text-xs text-gray-500">Google Reviews</div>
            </div>
            <div className="h-10 w-px bg-gray-200 hidden md:block" />
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center mb-1">
                <CheckCircle className="w-5 h-5 text-luxury-teal" />
                <span className="text-lg font-bold text-luxury-navy">مرخصة</span>
              </div>
              <div className="text-xs text-gray-500">وزارة السياحة</div>
            </div>
            <div className="h-10 w-px bg-gray-200 hidden md:block" />
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center mb-1">
                <CheckCircle className="w-5 h-5 text-luxury-teal" />
                <span className="text-lg font-bold text-luxury-navy">معروف</span>
              </div>
              <div className="text-xs text-gray-500">التجارة السعودية</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;