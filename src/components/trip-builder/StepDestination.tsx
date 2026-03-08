import { useEffect, useState } from 'react';
import { MapPin, Users, Baby, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { TripData } from '@/hooks/useTripBuilder';
import { tripBuilderService } from '@/services/tripBuilderService';

interface Props {
  tripData: TripData;
  updateTrip: (data: Partial<TripData>) => void;
  onNext: () => void;
}

const StepDestination = ({ tripData, updateTrip, onNext }: Props) => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripBuilderService.getDestinations().then(d => { setDestinations(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const canProceed = tripData.destinationId && tripData.checkInDate && tripData.checkOutDate;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">اختر وجهتك</h2>
        <p className="text-muted-foreground">حدد الوجهة، التواريخ، وعدد المسافرين</p>
      </div>

      {/* Destinations Grid */}
      <div>
        <h3 className="font-semibold mb-3 text-foreground">الوجهات المتاحة</h3>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {destinations.map(dest => (
              <button
                key={dest.id}
                onClick={() => updateTrip({ destinationId: dest.id, destinationName: dest.name_ar })}
                className={cn(
                  'relative h-40 rounded-xl overflow-hidden group transition-all duration-300 border-2',
                  tripData.destinationId === dest.id ? 'border-primary ring-4 ring-primary/20' : 'border-transparent hover:border-primary/50'
                )}
              >
                <img src={dest.cover_image} alt={dest.name_ar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 right-3 text-white text-right">
                  <p className="font-bold">{dest.name_ar}</p>
                  <p className="text-xs opacity-80">{dest.country_ar}</p>
                </div>
                {tripData.destinationId === dest.id && (
                  <div className="absolute top-2 left-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Date Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">تاريخ الوصول</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn('w-full justify-start text-right', !tripData.checkInDate && 'text-muted-foreground')}>
                <Calendar className="ml-2 h-4 w-4" />
                {tripData.checkInDate ? format(tripData.checkInDate, 'PPP', { locale: ar }) : 'اختر التاريخ'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarUI
                mode="single"
                selected={tripData.checkInDate || undefined}
                onSelect={(d) => d && updateTrip({ checkInDate: d })}
                disabled={(d) => d < new Date()}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">تاريخ المغادرة</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn('w-full justify-start text-right', !tripData.checkOutDate && 'text-muted-foreground')}>
                <Calendar className="ml-2 h-4 w-4" />
                {tripData.checkOutDate ? format(tripData.checkOutDate, 'PPP', { locale: ar }) : 'اختر التاريخ'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarUI
                mode="single"
                selected={tripData.checkOutDate || undefined}
                onSelect={(d) => d && updateTrip({ checkOutDate: d })}
                disabled={(d) => d <= (tripData.checkInDate || new Date())}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Passengers */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'بالغين', key: 'adultsCount' as const, icon: Users, min: 1, max: 9 },
          { label: 'أطفال', key: 'childrenCount' as const, icon: Users, min: 0, max: 6 },
          { label: 'رضع', key: 'infantsCount' as const, icon: Baby, min: 0, max: 4 },
        ].map(({ label, key, icon: Icon, min, max }) => (
          <div key={key} className="text-center">
            <label className="text-sm text-muted-foreground mb-2 block">{label}</label>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => updateTrip({ [key]: Math.max(min, tripData[key] - 1) })}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
              >-</button>
              <span className="text-lg font-bold text-foreground w-6 text-center">{tripData[key]}</span>
              <button
                onClick={() => updateTrip({ [key]: Math.min(max, tripData[key] + 1) })}
                className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90"
              >+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-start">
        <Button onClick={onNext} disabled={!canProceed} size="lg" className="bg-primary text-primary-foreground px-8">
          التالي: اختيار الطيران
        </Button>
      </div>
    </div>
  );
};

export default StepDestination;
