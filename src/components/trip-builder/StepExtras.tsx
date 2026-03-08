import { useEffect, useState } from 'react';
import { Shield, FileCheck, MapPin, Clock, SkipForward } from 'lucide-react';
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
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">خدمات إضافية</h2>
        <p className="text-muted-foreground">أضف تأمين سفر، فيزا، أو جولات سياحية</p>
      </div>

      {/* Insurance & Visa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={toggleInsurance}
          className={cn(
            'p-5 rounded-xl border-2 transition-all text-right',
            tripData.extras.insurance ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 bg-card'
          )}
        >
          <Shield className={cn('w-8 h-8 mb-2', tripData.extras.insurance ? 'text-primary' : 'text-muted-foreground')} />
          <h4 className="font-bold text-foreground">تأمين السفر</h4>
          <p className="text-xs text-muted-foreground mt-1">تغطية شاملة لحالات الطوارئ</p>
          <p className="text-lg font-bold text-primary mt-2">{tripData.extras.insurancePrice} ر.س <span className="text-xs text-muted-foreground font-normal">/ للفرد</span></p>
        </button>

        <button
          onClick={toggleVisa}
          className={cn(
            'p-5 rounded-xl border-2 transition-all text-right',
            tripData.extras.visa ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 bg-card'
          )}
        >
          <FileCheck className={cn('w-8 h-8 mb-2', tripData.extras.visa ? 'text-primary' : 'text-muted-foreground')} />
          <h4 className="font-bold text-foreground">خدمة الفيزا</h4>
          <p className="text-xs text-muted-foreground mt-1">نتولى إجراءات التأشيرة بالكامل</p>
          <p className="text-lg font-bold text-primary mt-2">{tripData.extras.visaPrice} ر.س <span className="text-xs text-muted-foreground font-normal">/ للفرد</span></p>
        </button>
      </div>

      {/* Tour Activities */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">جولات وأنشطة سياحية</h3>
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />)}</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 bg-muted/50 rounded-2xl">
            <MapPin className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-sm">لا توجد جولات متاحة حالياً</p>
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
                    'w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 text-right',
                    isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 bg-card'
                  )}
                >
                  {act.image_url ? (
                    <img src={act.image_url} alt={act.name_ar} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-foreground">{act.name_ar}</p>
                    {act.duration_hours && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> {act.duration_hours} ساعات
                      </p>
                    )}
                  </div>
                  <div className="text-left shrink-0">
                    <p className="text-lg font-bold text-primary">{act.price_per_person?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">ر.س / فرد</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>السابق</Button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onNext} className="text-muted-foreground"><SkipForward className="w-4 h-4 ml-1" /> تخطي</Button>
          <Button onClick={onNext} className="bg-primary text-primary-foreground px-8">التالي: الملخص</Button>
        </div>
      </div>
    </div>
  );
};

export default StepExtras;
