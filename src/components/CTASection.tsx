import { Phone, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { homepageService } from "@/services/adminDataService";

interface CTAData {
  title: string;
  highlight: string;
  description: string;
  whatsappNumber: string;
  phoneNumber: string;
  workingHours: string;
}

const defaultCTA: CTAData = {
  title: "جاهز تبدأ",
  highlight: "رحلتك",
  description: "فريقنا جاهز لمساعدتك في التخطيط لرحلة أحلامك. تواصل معنا الآن واحصل على استشارة مجانية.",
  whatsappNumber: "966569222111",
  phoneNumber: "966569222111",
  workingHours: "نعمل على مدار الساعة 24/7",
};

const CTASection = () => {
  const [cta, setCTA] = useState<CTAData>(defaultCTA);

  useEffect(() => {
    homepageService.getCTASettings().then((data: unknown) => {
      if (data && typeof data === "object") {
        setCTA({ ...defaultCTA, ...(data as CTAData) });
      }
    }).catch(() => {});
  }, []);

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-luxury-teal/10 rounded-full blur-[150px]" />
      </div>

      <div className="container relative text-center px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {cta.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">{cta.highlight}</span>؟
          </h2>
          <p className="text-white/70 text-lg mb-10 leading-relaxed">
            {cta.description}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <a
              href={`https://api.whatsapp.com/send?phone=${cta.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              واتساب
            </a>
            <a
              href={`tel:+${cta.phoneNumber}`}
              className="inline-flex items-center justify-center gap-3 bg-luxury-teal hover:bg-luxury-teal/90 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              اتصل الآن
            </a>
          </div>

          {/* Working Hours */}
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/90 font-medium text-sm">{cta.workingHours}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;