import Nav3D from "@/components/Nav3D";
import PremiumHero from "@/components/PremiumHero";
import GlassServicesSection from "@/components/GlassServicesSection";
import DestinationsShowcase from "@/components/DestinationsShowcase";
import PremiumHoneymoon from "@/components/PremiumHoneymoon";
import FeaturedSection from "@/components/FeaturedSection";
import GlassTestimonials from "@/components/GlassTestimonials";
import PremiumCTA from "@/components/PremiumCTA";
import PremiumFooter from "@/components/PremiumFooter";
import MobileNav from "@/components/MobileNav";
import FloatingOffersWidget from "@/components/FloatingOffersWidget";
import MouseEffect from "@/components/MouseEffect";
import FrontendSidebar from "@/components/FrontendSidebar";
import { useSEO } from "@/hooks/useSEO";

const Index = () => {
  useSEO({
    title: "ترافليون - رحلات فاخرة تفوق التوقعات | أفضل وكالة سياحة في السعودية",
    description: "ترافليون للسفر والسياحة - اكتشف أجمل الوجهات السياحية حول العالم مع خدمات فاخرة، برامج متكاملة، وتجارب لا تُنسى. احجز رحلتك الآن!",
    keywords: "ترافليون, سياحة, سفر, حجز طيران, فنادق, شهر عسل, ماليزيا, تايلاند, تركيا, المالديف, السعودية",
  });

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* 3D Navigation */}
      <Nav3D />
      
      <main className="pb-20 md:pb-0">
        {/* Hero Section - Immersive Entry */}
        <PremiumHero />

        {/* Services - Glass Cards Grid */}
        <GlassServicesSection />

        {/* Destinations - Horizontal Showcase */}
        <DestinationsShowcase />

        {/* Honeymoon - Premium Feature */}
        <PremiumHoneymoon />

        {/* Featured Section - Destinations, Offers & Programs */}
        <FeaturedSection />

        {/* Testimonials - Social Proof */}
        <GlassTestimonials />

        {/* CTA - Conversion */}
        <PremiumCTA />
      </main>

      {/* Footer */}
      <PremiumFooter />
      
      {/* Mobile Navigation Dock */}
      <MobileNav />
      
      {/* Floating Offers Widget */}
      <FloatingOffersWidget />
      
      {/* Advanced Mouse Effect */}
      <MouseEffect />
      
      {/* Frontend Sidebar */}
      <FrontendSidebar />
    </div>
  );
};

export default Index;