import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Bell, User, Search } from "lucide-react";
import Nav3D from "@/components/Nav3D";
import PremiumFooter from "@/components/PremiumFooter";
import MobileNav from "@/components/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  pageTitle?: string;
  hideBackButton?: boolean;
}

const PAGE_TITLES: Record<string, string> = {
  "/destinations": "الوجهات",
  "/programs": "البرامج",
  "/hotels": "الفنادق",
  "/flights": "الطيران",
  "/offers": "العروض",
  "/contact": "تواصل معنا",
  "/about": "من نحن",
  "/services": "خدماتنا",
  "/blog": "المدونة",
  "/honeymoon": "شهر العسل",
  "/booking": "الحجز",
  "/my-bookings": "حجوزاتي",
  "/search": "البحث",
  "/careers": "الوظائف",
  "/loyalty": "الولاء",
  "/privacy": "الخصوصية",
  "/terms": "الشروط",
  "/sitemap": "خريطة الموقع",
  "/visas": "التأشيرات",
  "/insurance": "التأمين",
  "/car-rental": "تأجير السيارات",
  "/ready-packages": "باقات جاهزة",
  "/trip-builder": "مصمم الرحلات",
  "/login": "تسجيل الدخول",
  "/register": "إنشاء حساب",
  "/forgot-password": "استعادة كلمة المرور",
  "/reset-password": "تعيين كلمة المرور",
  "/globe": "استكشاف العالم",
};

const MobileHeader = ({ title, hideBack }: { title: string; hideBack?: boolean }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          {!hideBack && (
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-muted/60 flex items-center justify-center"
            >
              <ArrowRight className="w-5 h-5 text-foreground" />
            </button>
          )}
          <h1 className="text-lg font-bold text-foreground truncate">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-muted/60 flex items-center justify-center">
            <Bell className="w-4.5 h-4.5 text-foreground" />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <User className="w-4.5 h-4.5 text-primary" />
          </button>
        </div>
      </div>
    </header>
  );
};

const MobileFooter = () => (
  <footer className="bg-muted/30 border-t border-border/50 px-4 py-6 pb-24 text-center">
    <img src="/traveliun-logo.png" alt="Traveliun" className="h-8 mx-auto mb-3 opacity-60" />
    <p className="text-xs text-muted-foreground">© 2026 ترافليون. جميع الحقوق محفوظة</p>
  </footer>
);

const PageLayout = ({ children, className = "", pageTitle, hideBackButton }: PageLayoutProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();

  const resolvedTitle = pageTitle || PAGE_TITLES[location.pathname] || "ترافليون";

  if (isMobile) {
    return (
      <div className={`min-h-screen bg-background overflow-x-hidden ${className}`}>
        <MobileHeader title={resolvedTitle} hideBack={hideBackButton} />
        <main className="pb-0">{children}</main>
        <MobileFooter />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background overflow-x-hidden ${className}`}>
      <Nav3D />
      <main className="pb-0">{children}</main>
      <PremiumFooter />
      <MobileNav />
    </div>
  );
};

export default PageLayout;
