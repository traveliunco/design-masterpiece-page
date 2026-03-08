import { Check, MapPin, Plane, Hotel, Car, Sparkles, FileText } from 'lucide-react';

const steps = [
  { label: 'الوجهة', icon: MapPin },
  { label: 'الطيران', icon: Plane },
  { label: 'الفندق', icon: Hotel },
  { label: 'السيارة', icon: Car },
  { label: 'إضافات', icon: Sparkles },
  { label: 'الملخص', icon: FileText },
];

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const StepIndicator = ({ currentStep, onStepClick }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-between w-full max-w-3xl mx-auto mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={index} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => index <= currentStep && onStepClick(index)}
              disabled={index > currentStep}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                index <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary text-primary-foreground'
                    : isCurrent
                    ? 'bg-secondary text-secondary-foreground ring-4 ring-secondary/30'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${isCurrent ? 'text-secondary-foreground' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </button>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 transition-all ${index < currentStep ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
