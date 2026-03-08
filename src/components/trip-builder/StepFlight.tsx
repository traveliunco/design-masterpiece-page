import { useEffect, useState } from 'react';
import { Plane, Clock, Luggage, SkipForward } from 'lucide-react';
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

const StepFlight = ({ tripData, updateTrip, onNext, onPrev }: Props) => {
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripBuilderService.getFlightOffers().then(d => { setFlights(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const selectFlight = (flight: any) => {
    updateTrip({
      flightOfferId: flight.id,
      flightDetails: flight,
      flightPrice: flight.price_adult,
    });
  };

  const skipFlight = () => {
    updateTrip({ flightOfferId: null, flightDetails: null, flightPrice: 0 });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">اختر رحلة الطيران</h2>
        <p className="text-muted-foreground">اختياري - يمكنك تخطي هذه الخطوة</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />)}
        </div>
      ) : flights.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-2xl">
          <Plane className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">لا توجد رحلات متاحة حالياً</p>
        </div>
      ) : (
        <div className="space-y-3">
          {flights.map(flight => (
            <button
              key={flight.id}
              onClick={() => selectFlight(flight)}
              className={cn(
                'w-full p-4 rounded-xl border-2 transition-all duration-300 text-right flex items-center gap-4',
                tripData.flightOfferId === flight.id
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/40 bg-card'
              )}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Plane className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-foreground">{flight.airline?.name_ar || 'خطوط جوية'}</span>
                  {flight.flight_number && <span className="text-xs text-muted-foreground">{flight.flight_number}</span>}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{flight.origin?.city_ar || ''} → {flight.destination?.city_ar || ''}</span>
                  {flight.duration_minutes && (
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{Math.floor(flight.duration_minutes / 60)}س {flight.duration_minutes % 60}د</span>
                  )}
                  <span className="flex items-center gap-1"><Luggage className="w-3 h-3" />{flight.baggage_allowance}</span>
                </div>
              </div>
              <div className="text-left shrink-0">
                <p className="text-lg font-bold text-primary">{flight.price_adult?.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">ر.س / للفرد</p>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>السابق</Button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={skipFlight} className="text-muted-foreground">
            <SkipForward className="w-4 h-4 ml-1" /> تخطي
          </Button>
          <Button onClick={onNext} disabled={!tripData.flightOfferId} className="bg-primary text-primary-foreground px-8">
            التالي: اختيار الفندق
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepFlight;
