import Nav3D from "@/components/Nav3D";
import PremiumHeroSection from "@/components/PremiumHeroSection";
import MarqueeBanner from "@/components/MarqueeBanner";
import WhyChooseUs from "@/components/WhyChooseUs";
import InteractiveDestinations from "@/components/InteractiveDestinations";
import ExclusiveDeals from "@/components/ExclusiveDeals";
import HoneymoonSection from "@/components/HoneymoonSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import PremiumFooter from "@/components/PremiumFooter";
import MobileNav from "@/components/MobileNav";
import AppSidebar from "@/components/AppSidebar";
import { useSEO } from "@/hooks/useSEO";

const IndexPremium = () => {
  useSEO({
    title: "ترافليون - أفضل شركة سياحة سعودية | رحلات استثنائية حول العالم",
    description: "اكتشف جمال العالم مع ترافليون. أفضل عروض السفر والسياحة في السعودية. حجوزات فورية، خدمة متميزة 24/7، وأسعار تنافسية لأكثر من 50 وجهة سياحية حول العالم.",
    keywords: "ترافليون, سياحة سعودية, حجز رحلات, سفر, ماليزيا, تركيا, تايلاند, شهر عسل, عروض سياحية, برامج سفر, حجز فنادق, رحلات عائلية",
  });

  return (
    <div className="min-h-screen bg-background">
      <Nav3D />
      
      <div className="flex">
        <div className="flex-1 min-w-0">
          <main className="overflow-hidden pb-20 lg:pb-0">
            <PremiumHeroSection />
            <MarqueeBanner />
            <WhyChooseUs />
            <InteractiveDestinations />
            <MarqueeBanner 
              className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-900" 
            />
            <HoneymoonSection />
            <TestimonialsSection />
            <CTASection />
          </main>
          <PremiumFooter />
        </div>
        <AppSidebar />
      </div>

      <MobileNav />
    </div>
  );
};

export default IndexPremium;
