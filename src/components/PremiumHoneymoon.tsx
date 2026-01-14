import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Sparkles, Star, Gift, Crown } from "lucide-react";
import honeymoonImg from "@/assets/honeymoon.jpg";

const PremiumHoneymoon = () => {
  const features = [
    { icon: Crown, title: "جناح رئاسي VIP" },
    { icon: Heart, title: "عشاء رومانسي خاص" },
    { icon: Gift, title: "هدايا ترحيبية فاخرة" },
    { icon: Star, title: "خدمة كونسيرج ٢٤/٧" },
  ];

  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-luxury-cream via-white to-luxury-cream/50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-200/30 rounded-full blur-[200px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-luxury-gold/10 rounded-full blur-[150px]" />
      
      <div className="container px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Section */}
          <div className="relative animate-reveal">
            {/* Main Image */}
            <div className="relative rounded-[3rem] overflow-hidden shadow-luxury-lg">
              <img
                src={honeymoonImg}
                alt="Honeymoon Paradise"
                className="w-full aspect-[4/5] object-cover transition-transform duration-1000 hover:scale-105"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/60 via-transparent to-transparent" />
              
              {/* Floating Badge */}
              <div className="absolute top-6 left-6 glass-premium rounded-2xl px-5 py-3 flex items-center gap-3">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <span className="font-bold text-luxury-navy">الأكثر طلباً</span>
              </div>
            </div>

            {/* Floating Price Card */}
            <div className="absolute -bottom-6 -right-6 glass-premium rounded-3xl p-6 shadow-luxury animate-float">
              <div className="text-sm text-muted-foreground mb-1">ابتداءً من</div>
              <div className="text-4xl font-bold text-luxury-navy mb-1">
                4,999 <span className="text-lg">ر.س</span>
              </div>
              <div className="text-luxury-teal font-semibold text-sm">للشخصين • 5 ليالي</div>
            </div>

            {/* Decorative Hearts */}
            <div className="absolute -top-4 -left-4 floating" style={{ animationDelay: '1s' }}>
              <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center">
                <Heart className="w-8 h-8 text-rose-400" />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 glass-premium rounded-full px-6 py-3 animate-reveal">
              <Sparkles className="w-4 h-4 text-luxury-gold" />
              <span className="text-sm font-semibold text-luxury-navy">باقات شهر العسل</span>
            </div>

            <h2 className="heading-luxury text-4xl md:text-5xl lg:text-6xl text-luxury-navy leading-tight animate-reveal delay-100">
              بداية <span className="text-rose-500 italic">قصة حب</span>
              <br />لا تُنسى
            </h2>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg animate-reveal delay-200">
              دعنا نخطط لأجمل رحلة في حياتكم. باقات شهر عسل حصرية في أروع الوجهات الرومانسية حول العالم.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 animate-reveal delay-300">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm border border-border/50 hover:shadow-md hover:border-rose-200 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                    <feature.icon className="w-6 h-6 text-rose-500" />
                  </div>
                  <span className="font-semibold text-luxury-navy">{feature.title}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4 pt-4 animate-reveal delay-400">
              <Link to="/honeymoon">
                <button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  خطط لشهر العسل
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <Link to="/contact">
                <button className="btn-outline-luxury px-10 py-5 text-lg">
                  استشارة مجانية
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumHoneymoon;
