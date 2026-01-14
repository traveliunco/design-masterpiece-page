import { ReactNode } from "react";
import Nav3D from "@/components/Nav3D";
import PremiumFooter from "@/components/PremiumFooter";
import MobileNav from "@/components/MobileNav";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageLayout - مكون التخطيط الموحد لجميع الصفحات
 * يتضمن: شريط التنقل + المحتوى + الفوتر + تنقل الموبايل
 */
const PageLayout = ({ children, className = "" }: PageLayoutProps) => {
  return (
    <div className={`min-h-screen bg-background overflow-x-hidden ${className}`}>
      {/* 3D Navigation */}
      <Nav3D />
      
      {/* Page Content */}
      <main className="pb-20 md:pb-0">
        {children}
      </main>

      {/* Footer */}
      <PremiumFooter />
      
      {/* Mobile Navigation Dock */}
      <MobileNav />
    </div>
  );
};

export default PageLayout;
