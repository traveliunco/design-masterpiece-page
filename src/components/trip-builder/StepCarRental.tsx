import { useEffect, useState } from 'react';
import { Car, Users, Briefcase, SkipForward, ChevronLeft, ChevronRight, UserCheck } from 'lucide-react';
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

const StepCarRental = ({ tripData, updateTrip, onNext, onPrev }: Props) => {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripBuilderService.getCarRentals().then(d => { setCars(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const selectCar = (car: any) => {
    const pricePerDay = tripData.carWithDriver ? (car.price_with_driver || car.price_per_day) : car.price_per_day;
    updateTrip({ carRentalId: car.id, carRentalName: car.name_ar, carRentalPricePerDay: pricePerDay });
  };

  const skip = () => {
    updateTrip({ carRentalId: null, carRentalName: '', carRentalPricePerDay: 0 });
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500/10 via-primary/5 to-transparent rounded-3xl p-6 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 flex items-center justify-center mb-3">
          <Car className="w-7 h-7 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-foreground">تأجير سيارة</h2>
        <p className="text-sm text-muted-foreground mt-1">اختياري - أضف سيارة لرحلتك</p>
      </div>

      {/* Driver toggle */}
      <div className="bg-card rounded-2xl border border-border p-1.5 flex gap-1.5">
        <button
          onClick={() => updateTrip({ carWithDriver: false })}
          className={cn(
            'flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2',
            !tripData.carWithDriver
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
              : 'text-muted-foreground hover:bg-muted/50'
          )}
        >
          <Car className="w-4 h-4" />
          بدون سائق
        </button>
        <button
          onClick={() => updateTrip({ carWithDriver: true })}
          className={cn(
            'flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2',
            tripData.carWithDriver
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
              : 'text-muted-foreground hover:bg-muted/50'
          )}
        >
          <UserCheck className="w-4 h-4" />
          مع سائق
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />)}
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-3xl border border-dashed border-border">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Car className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">لا توجد سيارات متاحة حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {cars.map((car: any) => {
            const isSelected = tripData.carRentalId === car.id;
            const price = tripData.carWithDriver ? (car.price_with_driver || car.price_per_day) : car.price_per_day;
            return (
              <button
                key={car.id}
                onClick={() => selectCar(car)}
                className={cn(
                  'rounded-2xl overflow-hidden transition-all duration-300 text-right',
                  isSelected
                    ? 'ring-[3px] ring-primary ring-offset-2 ring-offset-background shadow-lg shadow-primary/20'
                    : 'border border-border hover:shadow-md'
                )}
              >
                <div className="h-28 bg-muted">
                  {car.image_url && <img src={car.image_url} alt={car.name_ar} className="w-full h-full object-cover" />}
                </div>
                <div className="p-3 bg-card space-y-2">
                  <h4 className="font-bold text-sm text-foreground leading-tight">{car.name_ar}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-0.5 bg-muted px-1.5 py-0.5 rounded-md">
                      <Users className="w-2.5 h-2.5" />{car.seats}
                    </span>
                    <span className="flex items-center gap-0.5 bg-muted px-1.5 py-0.5 rounded-md">
                      <Briefcase className="w-2.5 h-2.5" />{car.bags}
                    </span>
                    <span className="bg-muted px-1.5 py-0.5 rounded-md">
                      {car.transmission === 'automatic' ? 'أوتو' : 'يدوي'}
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-lg font-black text-primary">{price?.toLocaleString()}</span>
                      <span className="text-[10px] text-muted-foreground mr-1">ر.س/يوم</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onPrev} className="rounded-xl h-12 px-4">
          <ChevronRight className="w-4 h-4 ml-1" />
          السابق
        </Button>
        <Button variant="ghost" onClick={skip} className="rounded-xl h-12 text-muted-foreground">
          <SkipForward className="w-4 h-4 ml-1" /> تخطي
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 rounded-xl h-12 bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20"
        >
          التالي: الإضافات
          <ChevronLeft className="w-4 h-4 mr-1" />
        </Button>
      </div>
    </div>
  );
};

export default StepCarRental;
