import { useEffect, useState } from 'react';
import { Car, Users, Briefcase, SkipForward } from 'lucide-react';
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
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">تأجير سيارة</h2>
        <p className="text-muted-foreground">اختياري - أضف سيارة لرحلتك</p>
      </div>

      {/* Driver toggle */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => updateTrip({ carWithDriver: false })}
          className={cn('px-4 py-2 rounded-lg text-sm transition-all', !tripData.carWithDriver ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}
        >بدون سائق</button>
        <button
          onClick={() => updateTrip({ carWithDriver: true })}
          className={cn('px-4 py-2 rounded-lg text-sm transition-all', tripData.carWithDriver ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}
        >مع سائق</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />)}
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-2xl">
          <Car className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">لا توجد سيارات متاحة حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cars.map((car: any) => (
            <button
              key={car.id}
              onClick={() => selectCar(car)}
              className={cn(
                'p-4 rounded-xl border-2 transition-all text-right',
                tripData.carRentalId === car.id ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/40 bg-card'
              )}
            >
              {car.image_url && <img src={car.image_url} alt={car.name_ar} className="w-full h-28 object-cover rounded-lg mb-3" />}
              <h4 className="font-bold text-foreground">{car.name_ar}</h4>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{car.seats} مقاعد</span>
                <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{car.bags} حقائب</span>
                <span>{car.transmission === 'automatic' ? 'أوتوماتيك' : 'يدوي'}</span>
              </div>
              <div className="mt-3 flex justify-between items-end">
                <span className="text-lg font-bold text-primary">
                  {(tripData.carWithDriver ? (car.price_with_driver || car.price_per_day) : car.price_per_day)?.toLocaleString()} ر.س
                </span>
                <span className="text-xs text-muted-foreground">/ يوم</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>السابق</Button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={skip} className="text-muted-foreground"><SkipForward className="w-4 h-4 ml-1" /> تخطي</Button>
          <Button onClick={onNext} className="bg-primary text-primary-foreground px-8">التالي: الإضافات</Button>
        </div>
      </div>
    </div>
  );
};

export default StepCarRental;
