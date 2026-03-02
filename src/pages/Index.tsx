import { lazy, Suspense } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const MobileHomePage = lazy(() => import("./MobileHomePage"));
const IndexPremium = lazy(() => import("./IndexPremium"));

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      {isMobile ? <MobileHomePage /> : <IndexPremium />}
    </Suspense>
  );
};

export default Index;
