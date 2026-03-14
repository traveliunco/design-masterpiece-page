import { useTripBuilder } from '@/hooks/useTripBuilder';
import StepIndicator from '@/components/trip-builder/StepIndicator';
import TripSidebar from '@/components/trip-builder/TripSidebar';
import StepDestination from '@/components/trip-builder/StepDestination';
import StepFlight from '@/components/trip-builder/StepFlight';
import StepHotel from '@/components/trip-builder/StepHotel';
import StepCarRental from '@/components/trip-builder/StepCarRental';
import StepExtras from '@/components/trip-builder/StepExtras';
import StepSummary from '@/components/trip-builder/StepSummary';
import { Helmet } from 'react-helmet';
import { useIsMobile } from '@/hooks/use-mobile';
import Nav3D from '@/components/Nav3D';
import PremiumFooter from '@/components/PremiumFooter';
import MobileNav from '@/components/MobileNav';

const TripBuilder = () => {
  const {
    currentStep, tripData, updateTrip,
    nextStep, prevStep, goToStep,
    getNights, getTotalPassengers, getSubtotal, getTaxes, getTotal,
  } = useTripBuilder();
  const isMobile = useIsMobile();

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepDestination tripData={tripData} updateTrip={updateTrip} onNext={nextStep} />;
      case 1: return <StepFlight tripData={tripData} updateTrip={updateTrip} onNext={nextStep} onPrev={prevStep} />;
      case 2: return <StepHotel tripData={tripData} updateTrip={updateTrip} onNext={nextStep} onPrev={prevStep} />;
      case 3: return <StepCarRental tripData={tripData} updateTrip={updateTrip} onNext={nextStep} onPrev={prevStep} />;
      case 4: return <StepExtras tripData={tripData} updateTrip={updateTrip} onNext={nextStep} onPrev={prevStep} />;
      case 5: return <StepSummary tripData={tripData} updateTrip={updateTrip} onPrev={prevStep} getNights={getNights} getTotalPassengers={getTotalPassengers} getSubtotal={getSubtotal} getTaxes={getTaxes} getTotal={getTotal} />;
      default: return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>صمم رحلتك | ترافليون</title>
        <meta name="description" content="صمم بكج سفرك المخصص - اختر الوجهة والطيران والفندق والسيارة والأنشطة بنفسك" />
      </Helmet>

      <Nav3D />

      <div className="min-h-screen bg-background pt-20 pb-8" dir="rtl">
        <div className="container mx-auto px-4 max-w-5xl">
          <StepIndicator currentStep={currentStep} onStepClick={goToStep} />

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {renderStep()}
            </div>

            {/* Sidebar - hidden on mobile, shown on desktop */}
            {!isMobile && (
              <div className="w-80 shrink-0">
                <TripSidebar
                  tripData={tripData}
                  getNights={getNights}
                  getTotalPassengers={getTotalPassengers}
                  getSubtotal={getSubtotal}
                  getTaxes={getTaxes}
                  getTotal={getTotal}
                />
              </div>
            )}
          </div>

          {/* Mobile floating total */}
          {isMobile && getSubtotal() > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border p-4 z-50 safe-area-bottom">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-muted-foreground">الإجمالي</p>
                  <p className="text-xl font-black text-primary">{getTotal().toLocaleString()} ر.س</p>
                </div>
                <div className="text-[10px] text-muted-foreground text-left">
                  شامل الضريبة
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <PremiumFooter />
      <MobileNav />
    </>
  );
};

export default TripBuilder;
