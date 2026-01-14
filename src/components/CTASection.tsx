import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, ArrowLeft } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 md:py-40 bg-charcoal relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-aurora-indigo/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-aurora-rose/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative text-center px-4">
        <div className="max-w-4xl mx-auto space-y-10">
          <h2 className="font-editorial text-5xl md:text-8xl text-white leading-tight animate-reveal">
            جاهز تبدأ <br /><span className="text-aurora-indigo italic">رحلتك</span>؟
          </h2>
          <p className="text-white/60 text-xl md:text-2xl font-modern font-medium max-w-2xl mx-auto leading-relaxed animate-reveal reveal-delay-1">
            فريقنا جاهز لمساعدتك في التخطيط لرحلة أحلامك. تواصل معنا الآن واحصل على استشارة مجانية.
          </p>

          <div className="flex flex-wrap justify-center gap-6 animate-reveal reveal-delay-2">
            <a
              href="https://api.whatsapp.com/send?phone=966569222111"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white rounded-full px-12 py-8 text-xl font-black"
              >
                <MessageCircle className="w-6 h-6 ml-3" />
                واتساب
              </Button>
            </a>
            <a href="tel:+966569222111">
              <Button
                size="lg"
                className="bg-aurora-indigo hover:bg-aurora-indigo/90 text-white rounded-full px-12 py-8 text-xl font-black"
              >
                <Phone className="w-6 h-6 ml-3" />
                اتصل الآن
              </Button>
            </a>
          </div>

          {/* Working Hours */}
          <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-full px-8 py-4 border border-white/10 animate-reveal reveal-delay-3">
            <div className="w-3 h-3 bg-aurora-mint rounded-full animate-pulse" />
            <span className="text-white font-bold">نعمل على مدار الساعة 24/7</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;