import { Phone, MessageCircle, ArrowLeft, Sparkles, Clock } from "lucide-react";

const PremiumCTA = () => {
  return (
    <section className="py-24 md:py-32 bg-luxury-navy relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-luxury-teal/20 rounded-full blur-[200px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-luxury-gold/15 rounded-full blur-[180px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="container px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 glass-dark rounded-full px-6 py-3 mb-8 animate-reveal">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/80 text-sm font-medium">متاحون الآن للمساعدة</span>
            <Clock className="w-4 h-4 text-luxury-gold" />
          </div>

          {/* Headline */}
          <h2 className="heading-modern text-4xl md:text-5xl lg:text-7xl text-white mb-8 animate-reveal delay-100">
            جاهز تبدأ
            <br />
            <span className="text-gradient-gold">رحلة أحلامك؟</span>
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed animate-reveal delay-200">
            فريقنا من خبراء السفر جاهز لمساعدتك في التخطيط لرحلة لا تُنسى.
            تواصل معنا الآن واحصل على استشارة مجانية.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 animate-reveal delay-300">
            <a
              href="https://api.whatsapp.com/send?phone=966569222111"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-10 py-6 rounded-full font-bold text-xl flex items-center justify-center gap-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                <MessageCircle className="w-6 h-6" />
                تواصل عبر واتساب
              </button>
            </a>
            <a href="tel:+966569222111" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto btn-gold px-10 py-6 rounded-full text-xl flex items-center justify-center gap-4">
                <Phone className="w-6 h-6" />
                اتصل الآن
              </button>
            </a>
          </div>

          {/* Working Hours */}
          <div className="inline-flex items-center gap-4 glass-dark rounded-full px-8 py-4 animate-reveal delay-400">
            <Sparkles className="w-5 h-5 text-luxury-gold" />
            <span className="text-white font-medium">نعمل على مدار الساعة ٢٤/٧ لخدمتك</span>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="hsl(220, 20%, 97%)"/>
        </svg>
      </div>
    </section>
  );
};

export default PremiumCTA;
