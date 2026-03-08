import { useEffect, useState } from 'react';
import { Shield, FileCheck, MapPin, Clock, SkipForward, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TripData } from '@/hooks/useTripBuilder';
import { tripBuilderService } from '@/services/tripBuilderService';

interface Props {
  tripData: TripData;
  updateTrip: (data: Partial<TripData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepExtras = ({ tripData, updateTrip, onNext, onPrev }: Props) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripBuilderService.getTourActivities().then(d => { setActivities(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const toggleActivity = (act: any) => {
    const exists = tripData.selectedActivities.find(a => a.id === act.id);
    if (exists) {
      updateTrip({ selectedActivities: tripData.selectedActivities.filter(a => a.id !== act.id) });
    } else {
      updateTrip({ selectedActivities: [...tripData.selectedActivities, { id: act.id, name: act.name_ar, price: act.price_per_person }] });
    }
  };

  const toggleInsurance = () => {
    updateTrip({ extras: { ...tripData.extras, insurance: !tripData.extras.insurance } });
  };

  const toggleVisa = () => {
    updateTrip({ extras: { ...tripData.extras, visa: !tripData.extras.visa } });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-500/10 via-primary/5 to-transparent rounded-3xl p-6 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/15 flex items-center justify-center mb-3">
          <Shield className="w-7 h-7 text-purple-500" />
        </div>
        <h2 className="text-xl font-bold text-foreground">خدمات إضافية</h2>
        <p className="text-sm text-muted-foreground mt-1">أضف تأمين سفر، فيزا، أو جولات سياحية</p>
      </div>

      {/* Insurance & Visa */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={toggleInsurance}
          className={cn(
            'p-4 rounded-2xl border-2 transition-all text-right relative overflow-hidden',
            tripData.extras.insurance
              ? 'border-primary bg-primary/5 shadow-md shadow-primary/15'
              : 'border-border hover:border-primary/30 bg-card'
          )}
        >
          {tripData.extras.insurance && (
            <CheckCircle2 className="absolute top-2 left-2 w-5 h-5 text-primary" />
          )}
          <div className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center mb-3',
            tripData.extras.insurance ? 'bg-primary/15' : 'bg-muted'
          )}>
            <Shield className={cn('w-5 h-5', tripData.extras.insurance ? 'text-primary' : 'text-muted-foreground')} />
          </div>
          <h4 className="font-bold text-sm text-foreground">تأمين السفر</h4>
          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">تغطية شاملة للطوارئ</p>
          <p className="text-base font-black text-primary mt-2">
            {tripData.extras.insurancePrice} <span className="text-[10px] text-muted-foreground font-normal">ر.س/فرد</span>
          </p>
        </button>

        <button
          onClick={toggleVisa}
          className={cn(
            'p-4 rounded-2xl border-2 transition-all text-right relative overflow-hidden',
            tripData.extras.visa
              ? 'border-primary bg-primary/5 shadow-md shadow-primary/15'
              : 'border-border hover:border-primary/30 bg-card'
          )}
        >
          {tripData.extras.visa && (
            <CheckCircle2 className="absolute top-2 left-2 w-5 h-5 text-primary" />
          )}
          <div className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center mb-3',
            tripData.extras.visa ? 'bg-primary/15' : 'bg-muted'
          )}>
            <FileCheck className={cn('w-5 h-5', tripData.extras.visa ? 'text-primary' : 'text-muted-foreground')} />
          </div>
          <h4 className="font-bold text-sm text-foreground">خدمة الفيزا</h4>
          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">نتولى إجراءات التأشيرة</p>
          <p className="text-base font-black text-primary mt-2">
            {tripData.extras.visaPrice} <span className="text-[10px] text-muted-foreground font-normal">ر.س/فرد</span>
          </p>
        </button>
      </div>

      {/* Tour Activities */}
      <div>
        <h3 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-primary rounded-full" />
          جولات وأنشطة سياحية
        </h3>
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />)}</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-3xl border border-dashed border-border">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-3">
              <MapPin className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">لا توجد جولات متاحة حالياً</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((act: any) => {
              const isSelected = tripData.selectedActivities.some(a => a.id === act.id);
              return (
                <button
                  key={act.id}
                  onClick={() => toggleActivity(act)}
                  className={cn(
                    'w-full rounded-2xl border-2 transition-all flex items-center gap-3 text-right overflow-hidden',
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/30 bg-card'
                  )}
                >
                  {act.image_url ? (
                    <img src={act.image_url} alt={act.name_ar} className="w-20 h-20 object-cover shrink-0" />
                  ) : (
                    <div className="w-20 h-20 bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-7 h-7 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 py-3 min-w-0">
                    <p className="font-bold text-sm text-foreground">{act.name_ar}</p>
                    {act.duration_hours && (
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> {act.duration_hours} ساعات
                      </p>
                    )}
                  </div>
                  <div className="text-left shrink-0 pl-3 pr-1">
                    <p className="text-base font-black text-primary">{act.price_per_person?.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">ر.س/فرد</p>
                  </div>
                  {isSelected && (
                    <div className="w-8 shrink-0 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onPrev} className="rounded-xl h-12 px-4">
          <ChevronRight className="w-4 h-4 ml-1" />
          السابق
        </Button>
        <Button variant="ghost" onClick={onNext} className="rounded-xl h-12 text-muted-foreground">
          <SkipForward className="w-4 h-4 ml-1" /> تخطي
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 rounded-xl h-12 bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20"
        >
          التالي: الملخص
          <ChevronLeft className="w-4 h-4 mr-1" />
        </Button>
      </div>
    </div>
  );
};

export default StepExtras;
