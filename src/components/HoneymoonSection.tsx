import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";
import honeymoonImg from "@/assets/honeymoon.jpg";

const HoneymoonSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Visual Showcase (App Style) */}
          <div className="relative group animate-reveal">
            <div className="relative p-2 bg-gradient-to-tr from-aurora-rose/40 via-aurora-indigo/20 to-aurora-mint/40 rounded-[4rem] shadow-2xl">
              <img
                src={honeymoonImg}
                alt="Romantic Getaway"
                loading="lazy"
                className="w-full h-[600px] object-cover rounded-[3.5rem] transition-transform duration-1000 group-hover:scale-105"
              />
              
              {/* Premium Floating Badge */}
              <div className="absolute -bottom-10 -right-10 bg-charcoal/95 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl animate-float">
                <div className="text-aurora-rose text-xs font-black uppercase tracking-[0.3em] mb-2">رحلة العمر</div>
                <div className="text-4xl font-black text-white mb-1">4,999 <span className="text-sm">ر.س</span></div>
                <div className="text-[10px] text-white/40 font-bold">باقة شاملة للنخبة</div>
              </div>

              {/* Decorative Hearts */}
              <div className="absolute top-10 left-10 w-20 h-20 bg-aurora-rose/20 rounded-full blur-3xl animate-pulse" />
            </div>
          </div>

          {/* Luxury Content Section */}
          <div className="space-y-12 animate-reveal reveal-delay-2">
            <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-3 rounded-full">
              <Heart className="w-5 h-5 text-aurora-rose fill-aurora-rose" />
              <span className="text-white text-sm font-black tracking-widest uppercase">ملاذ العشاق الحصري</span>
            </div>

            <h2 className="font-editorial text-6xl md:text-8xl text-white leading-tight">
              بداية <br /> <span className="text-aurora-rose italic">قصة حب</span> لا تنتهي
            </h2>

            <p className="text-white/60 text-xl font-modern font-medium leading-[2] max-w-xl">
              نصمم لكم ذكرياتٍ تليق ببداية رحلتكم معاً، في أكثر الوجهات سحراً ورومانسية تحت النجوم، حيث الفخامة هي لغتكم الوحيدة.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "جناح ملكي VIP",
                "عشاء رومانسي خاص",
                "خدمات الكونسيرج",
                "جولات سياحية خاصة",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-aurora-rose/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-aurora-rose/20 flex items-center justify-center text-aurora-rose">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-white font-bold">{feature}</span>
                </div>
              ))}
            </div>

            <Link
              to="/honeymoon"
              className="group relative inline-flex items-center gap-6 bg-aurora-rose text-white px-16 py-8 rounded-[2.5rem] font-black text-2xl transition-all duration-500 hover:scale-105 shadow-2xl mt-8"
            >
              خطط لشهر العسل
              <ArrowLeft className="w-8 h-8 group-hover:-translate-x-4 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HoneymoonSection;