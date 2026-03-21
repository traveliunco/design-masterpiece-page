import Nav3D from "@/components/Nav3D";
import PremiumHeroSection from "@/components/PremiumHeroSection";
import MarqueeBanner from "@/components/MarqueeBanner";
import WhyChooseUs from "@/components/WhyChooseUs";
import InteractiveDestinations from "@/components/InteractiveDestinations";
import HoneymoonSection from "@/components/HoneymoonSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import PremiumFooter from "@/components/PremiumFooter";
import MobileNav from "@/components/MobileNav";
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
      
      <main className="overflow-hidden pb-20 md:pb-0">
        {/* Hero Section - Full Screen Premium */}
        <PremiumHeroSection />

        {/* Animated Marquee Banner - Gold Theme */}
        <MarqueeBanner />

        {/* Why Choose Us Section */}
        <WhyChooseUs />

        {/* Interactive Destinations with 3D Effects */}
        <InteractiveDestinations />

        {/* Second Marquee - Teal Theme */}
        <MarqueeBanner 
          className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-900" 
        />

        {/* Honeymoon Section - Premium */}
        <HoneymoonSection />

        {/* Testimonials - Social Proof */}
        <TestimonialsSection />

        {/* Final CTA */}
        <CTASection />
      </main>

      <PremiumFooter />
      <MobileNav />
    </div>
  );
};

export default IndexPremium;
