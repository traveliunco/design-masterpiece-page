import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Sparkles, CheckCircle } from "lucide-react";
import honeymoonImg from "@/assets/honeymoon.jpg";

const HoneymoonSection = () => {
  const features = [
    "جناح ملكي VIP",
    "عشاء رومانسي خاص",
    "خدمات الكونسيرج",
    "جولات سياحية خاصة",
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-teal-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-cyan-500/20 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={honeymoonImg}
                alt="Romantic Getaway"
                loading="lazy"
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/60 to-transparent" />
              
              {/* Price Badge */}
              <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-xl">
                <div className="text-teal-600 text-xs font-bold mb-1">ابتداءً من</div>
                <div className="text-2xl font-bold text-gray-900">4,999 <span className="text-sm">ر.س</span></div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full">
              <Heart className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <span className="text-white/90 text-sm font-bold">شهر العسل</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              بداية <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">قصة حب</span> لا تنتهي
            </h2>

            <p className="text-white/70 text-lg leading-relaxed">
              نصمم لكم ذكرياتٍ تليق ببداية رحلتكم معاً، في أكثر الوجهات سحراً ورومانسية تحت النجوم.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-white/90 font-medium text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Link
              to="/honeymoon"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-teal-400 hover:to-cyan-400 transition-all duration-300 shadow-[0_8px_30px_rgba(20,184,166,0.4)]"
            >
              خطط لشهر العسل
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HoneymoonSection;