import Header from "@/components/Header";
import PremiumHeroSection from "@/components/PremiumHeroSection";
import MarqueeBanner from "@/components/MarqueeBanner";
import WhyChooseUs from "@/components/WhyChooseUs";
import InteractiveDestinations from "@/components/InteractiveDestinations";
import HoneymoonSection from "@/components/HoneymoonSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";

const Index = () => {
  useSEO({
    title: "ترافليون - أفضل شركة سياحة سعودية | رحلات استثنائية حول العالم",
    description: "اكتشف جمال العالم مع ترافليون. أفضل عروض السفر والسياحة في السعودية. حجوزات فورية، خدمة متميزة 24/7، وأسعار تنافسية لأكثر من 50 وجهة سياحية حول العالم.",
    keywords: "ترافليون, سياحة سعودية, حجز رحلات, سفر, ماليزيا, تركيا, تايلاند, شهر عسل, عروض سياحية, برامج سفر, حجز فنادق, رحلات عائلية",
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="overflow-hidden">
        {/* Hero Section - Full Screen Premium */}
        <PremiumHeroSection />

        {/* Animated Marquee Banner - Gold Theme */}
        <MarqueeBanner speed="normal" direction="left" />

        {/* Why Choose Us Section */}
        <WhyChooseUs />

        {/* Interactive Destinations with 3D Effects */}
        <InteractiveDestinations />

        {/* Second Marquee - Teal Theme, Opposite Direction */}
        <MarqueeBanner 
          speed="slow" 
          direction="right" 
          className="bg-gradient-to-r from-primary via-teal-600 to-primary" 
        />

        {/* Honeymoon Section - Premium */}
        <HoneymoonSection />

        {/* Testimonials - Social Proof */}
        <TestimonialsSection />

        {/* Final CTA */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
