import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Gift, Star, Award, Plane, Hotel, ShoppingBag, Crown, Sparkles, TrendingUp, Users, Zap, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Loyalty = () => {
  useSEO({
    title: "برنامج الولاء - نقاط ترافليون",
    description: "اكسب نقاط مع كل حجز واستبدلها بخصومات حصرية وترقيات مجانية على رحلاتك القادمة",
    keywords: "برنامج ولاء, نقاط مكافآت, خصومات سفر, مكافآت ترافليون",
  });

  const [points, setPoints] = useState(2450);
  const nextTier = 5000;
  const progress = (points / nextTier) * 100;

  const tiers = [
    { name: "برونزي", min: 0, color: "from-amber-700 to-amber-900", benefits: ["5% خصم على الحجوزات", "نقاط مضاعفة في عيد ميلادك"] },
    { name: "فضي", min: 5000, color: "from-gray-400 to-gray-600", benefits: ["10% خصم", "أولوية في خدمة العملاء", "إلغاء مجاني حتى 48 ساعة"] },
    { name: "ذهبي", min: 15000, color: "from-yellow-400 to-yellow-600", benefits: ["15% خصم", "ترقية الغرفة مجاناً", "صالة كبار الشخصيات", "نقاط 1.5x"] },
    { name: "بلاتيني", min: 30000, color: "from-purple-400 to-purple-600", benefits: ["20% خصم", "مرافق مجاني", "كونسيرج شخصي", "نقاط 2x", "هدايا حصرية"] },
  ];

  const howToEarn = [
    { icon: Plane, title: "احجز رحلة", points: "100 نقطة لكل 1000 ر.س", color: "from-blue-500 to-cyan-600" },
    { icon: Hotel, title: "احجز فندق", points: "80 نقطة لكل 1000 ر.س", color: "from-emerald-500 to-teal-600" },
    { icon: ShoppingBag, title: "برامج سياحية", points: "120 نقطة لكل 1000 ر.س", color: "from-orange-500 to-red-600" },
    { icon: Users, title: "دعوة أصدقاء", points: "500 نقطة لكل صديق", color: "from-pink-500 to-rose-600" },
    { icon: Star, title: "تقييم رحلتك", points: "50 نقطة لكل تقييم", color: "from-purple-500 to-indigo-600" },
  ];

  const howToRedeem = [
    { value: "1000 نقطة", discount: "خصم 50 ر.س" },
    { value: "2500 نقطة", discount: "خصم 150 ر.س" },
    { value: "5000 نقطة", discount: "خصم 350 ر.س" },
    { value: "10000 نقطة", discount: "خصم 800 ر.س" },
  ];

  return (
    <PageLayout>
      <PageHeader
        badge="اكسب واستبدل"
        badgeIcon={<Gift className="w-4 h-4 text-luxury-gold" />}
        title={<>برنامج <span className="text-gradient-gold">الولاء</span></>}
        subtitle="كل حجز يقربك من مكافآت حصرية وخصومات مذهلة على رحلاتك القادمة"
      />

      {/* Points Balance Section */}
      <section className="py-8 -mt-10 relative z-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-luxury-navy to-luxury-teal shadow-luxury">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-luxury-gold/10 rounded-full blur-[100px]" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-white/70 text-sm mb-1">رصيدك الحالي</p>
                    <p className="text-5xl font-bold text-white">{points.toLocaleString()}</p>
                    <p className="text-luxury-gold text-sm mt-1">نقطة ترافليون</p>
                  </div>
                  <Crown className="w-16 h-16 text-luxury-gold" />
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-white/80 mb-2">
                    <span>التقدم للمستوى التالي</span>
                    <span>{nextTier - points} نقطة متبقية</span>
                  </div>
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-luxury-gold rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <p className="text-white/60 text-sm">المستوى القادم: <strong className="text-white">فضي</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-16 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-section text-luxury-navy mb-4">مستويات العضوية</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              كلما سافرت أكثر، كلما حصلت على مكافآت أفضل
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {tiers.map((tier, i) => (
              <div key={i} className="card-3d p-6 hover:scale-105 transition-transform group">
                <div className={`w-16 h-16 bg-gradient-to-br ${tier.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform`}>
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-luxury-navy text-center mb-2">{tier.name}</h3>
                <p className="text-center text-sm text-muted-foreground mb-6">ابتداءً من {tier.min.toLocaleString()} نقطة</p>
                <ul className="space-y-2">
                  {tier.benefits.map((benefit, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-luxury-teal flex-shrink-0 mt-0.5" />
                      <span className="text-luxury-navy">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Earn */}
      <section className="py-16 bg-luxury-cream/50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <Sparkles className="w-12 h-12 text-luxury-gold mx-auto mb-4" />
            <h2 className="text-section text-luxury-navy mb-4">كيف تكسب النقاط؟</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              طرق متعددة لتجميع النقاط بسرعة
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {howToEarn.map((method, i) => (
              <div key={i} className="card-3d p-6 text-center hover:scale-105 transition-transform group">
                <div className={`w-14 h-14 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <method.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-luxury-navy mb-2">{method.title}</h3>
                <p className="text-sm text-luxury-teal font-semibold">{method.points}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Redeem */}
      <section className="py-16 bg-gradient-to-b from-background to-luxury-cream/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <TrendingUp className="w-12 h-12 text-luxury-teal mx-auto mb-4" />
            <h2 className="text-section text-luxury-navy mb-4">استبدل نقاطك</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              حوّل نقاطك إلى خصومات فورية على حجوزاتك
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {howToRedeem.map((option, i) => (
              <div key={i} className="card-3d p-6 text-center hover:shadow-luxury transition-all">
                <p className="text-2xl font-bold text-luxury-teal mb-2">{option.value}</p>
                <div className="w-8 h-0.5 bg-luxury-gold mx-auto mb-2" />
                <p className="text-sm font-semibold text-luxury-navy">{option.discount}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Highlight */}
      <section className="py-16 bg-luxury-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-luxury-gold/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-luxury-teal/10 rounded-full blur-[100px]" />
        </div>
        <div className="container px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Zap className="w-16 h-16 text-luxury-gold mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl font-bold text-white mb-6">مزايا حصرية لأعضاء الولاء</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[
                { title: "خصومات دائمة", desc: "حتى 20% على جميع الحجوزات" },
                { title: "نقاط لا تنتهي", desc: "صلاحية النقاط 3 سنوات" },
                { title: "عروض حصرية", desc: "الوصول المبكر لأفضل العروض" },
              ].map((benefit, i) => (
                <div key={i} className="glass-dark rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-white/70">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-b from-background to-luxury-cream/30">
        <div className="container px-4 text-center">
          <h2 className="text-4xl font-bold text-luxury-navy mb-6">ابدأ في جمع النقاط اليوم!</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            سجل الآن واحصل على 500 نقطة ترحيبية مجاناً
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button className="btn-gold px-12 py-6 text-lg rounded-full">
                <Gift className="w-5 h-5 ml-2" />
                سجل واحصل على نقاط
              </Button>
            </Link>
            <Link to="/programs">
              <Button variant="outline" className="px-12 py-6 text-lg rounded-full border-luxury-teal text-luxury-teal hover:bg-luxury-teal/10">
                تصفح الرحلات
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Loyalty;
