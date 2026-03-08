import { Check, MapPin, Plane, Hotel, Car, Sparkles, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className="relative mb-10">
      {/* Progress bar background */}
      <div className="absolute top-5 left-4 right-4 h-1 bg-muted rounded-full z-0" />
      <div
        className="absolute top-5 right-4 h-1 bg-gradient-to-l from-primary to-secondary rounded-full z-0 transition-all duration-500"
        style={{ width: `${(currentStep / (steps.length - 1)) * (100 - 8)}%` }}
      />

      <div className="relative z-10 flex items-start justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isAccessible = index <= currentStep;

          return (
            <button
              key={index}
              onClick={() => isAccessible && onStepClick(index)}
              disabled={!isAccessible}
              className={cn(
                'flex flex-col items-center gap-1.5 transition-all duration-300 group',
                isAccessible ? 'cursor-pointer' : 'cursor-not-allowed'
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm',
                  isCompleted
                    ? 'bg-primary text-primary-foreground shadow-primary/30 shadow-md'
                    : isCurrent
                    ? 'bg-secondary text-secondary-foreground shadow-secondary/40 shadow-lg scale-110'
                    : 'bg-muted/80 text-muted-foreground'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={cn(
                'text-[10px] font-semibold transition-all leading-tight',
                isCurrent ? 'text-secondary' : isCompleted ? 'text-primary' : 'text-muted-foreground/60'
              )}>
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
