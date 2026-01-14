import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Wallet, Smartphone, Calendar, Check, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "react-router-dom";

const TamaraPage = () => {
  useSEO({
    title: "الدفع بالتقسيط مع تمارا - ترافليون",
    description: "قسّم مبلغ رحلتك على دفعات ميسّرة مع تمارا بدون فوائد",
    keywords: "تمارا, تقسيط, دفع مرن",
  });

  const benefits = [
    { title: "قسّم فواتيرك", desc: "قسّم مبلغ رحلتك على 3 دفعات ميسرة جداً" },
    { title: "صفر فوائد", desc: "كل اللي تدفعه هو سعر رحلتك الأساسي فقط" },
    { title: "سجل بضغطة", desc: "عملية تسجيل سريعة برقم الجوال والهوية" },
  ];

  const steps = [
    { icon: Wallet, label: "اختر باقتك", sub: "عند اختيار باقة أحلامك، توجه لصفحة الدفع" },
    { icon: Smartphone, label: "اختر تمارا", sub: "اختر خيار الدفع بتمارا من قائمة طرق الدفع" },
    { icon: Calendar, label: "ادفع بمرونة", sub: "أدخل بياناتك وسيتم تقسيم المبلغ فوراً" },
  ];

  return (
    <PageLayout>
      <PageHeader
        badge="خيارات دفع مرنة"
        badgeIcon={<Sparkles className="w-4 h-4 text-orange-400" />}
        title={
          <>
            ريّح ميزانيتك <span className="text-gradient-orange">وقسّمها مع تمارا</span>
          </>
        }
        subtitle="ترافليون وتمارا يجتمعان ليمنحاك تجربة حجز لا مثيل لها. سافر لأي وجهة وادفع بالتقسيط"
      />

      {/* Benefits */}
      <section className="py-16 bg-gradient-to-b from-background via-orange-50/30 to-background">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((item, i) => (
              <div key={i} className="card-3d p-8 text-center hover:scale-105 transition-transform">
                <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Check className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-luxury-navy mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-luxury-cream/50">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-section text-luxury-navy mb-4">بسيطة.. ولا يبي لها شيء!</h2>
            <p className="text-xl text-muted-foreground">خطوات بسيطة لإتمام حجزك بتمارا</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-luxury flex items-center justify-center mx-auto mb-6 group hover:bg-gradient-to-br hover:from-orange-400 hover:to-rose-400 transition-all">
                  <step.icon className="w-10 h-10 text-orange-500 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-2xl font-bold text-luxury-navy mb-3">{step.label}</h4>
                <p className="text-muted-foreground max-w-[250px] mx-auto">{step.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-background to-orange-50/30">
        <div className="container px-4 text-center">
          <Sparkles className="w-12 h-12 text-orange-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
            احجز رحلتك القادمة الآن <br className="hidden md:block" /> وعيش اللحظة!
          </h2>
          <Link to="/programs">
            <Button className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white text-xl font-bold px-16 py-8 rounded-full shadow-2xl hover:scale-110 transition-all">
              استعرض الرحلات الآن
              <ArrowLeft className="w-6 h-6 mr-3" />
            </Button>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default TamaraPage;
