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

const TripBuilder = () => {
  const {
    currentStep, tripData, updateTrip,
    nextStep, prevStep, goToStep,
    getNights, getTotalPassengers, getSubtotal, getTaxes, getTotal,
  } = useTripBuilder();

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

      <div className="min-h-screen bg-background pt-24 pb-16" dir="rtl">
        <div className="container mx-auto px-4">
          <StepIndicator currentStep={currentStep} onStepClick={goToStep} />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {renderStep()}
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 shrink-0">
              <TripSidebar
                tripData={tripData}
                getNights={getNights}
                getTotalPassengers={getTotalPassengers}
                getSubtotal={getSubtotal}
                getTaxes={getTaxes}
                getTotal={getTotal}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TripBuilder;
