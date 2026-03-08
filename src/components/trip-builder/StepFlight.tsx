import { useEffect, useState } from 'react';
import { Plane, Clock, Luggage, SkipForward, ChevronLeft, ChevronRight } from 'lucide-react';
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
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500/10 via-primary/5 to-transparent rounded-3xl p-6 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/15 flex items-center justify-center mb-3">
          <Plane className="w-7 h-7 text-blue-500" />
        </div>
        <h2 className="text-xl font-bold text-foreground">اختر رحلة الطيران</h2>
        <p className="text-sm text-muted-foreground mt-1">اختياري - يمكنك تخطي هذه الخطوة</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : flights.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-3xl border border-dashed border-border">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Plane className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">لا توجد رحلات متاحة حالياً</p>
        </div>
      ) : (
        <div className="space-y-3">
          {flights.map(flight => {
            const isSelected = tripData.flightOfferId === flight.id;
            return (
              <button
                key={flight.id}
                onClick={() => selectFlight(flight)}
                className={cn(
                  'w-full rounded-2xl border-2 transition-all duration-300 text-right overflow-hidden',
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/15'
                    : 'border-border hover:border-primary/30 bg-card hover:shadow-md'
                )}
              >
                {/* Airline strip */}
                <div className={cn(
                  'px-4 py-2 flex items-center justify-between text-xs',
                  isSelected ? 'bg-primary/10' : 'bg-muted/50'
                )}>
                  <span className="font-bold text-foreground">{flight.airline?.name_ar || 'خطوط جوية'}</span>
                  {flight.flight_number && (
                    <span className="bg-background/80 px-2 py-0.5 rounded-lg text-muted-foreground">{flight.flight_number}</span>
                  )}
                </div>

                <div className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                      <span>{flight.origin?.city_ar || ''}</span>
                      <div className="flex-1 flex items-center gap-1">
                        <div className="h-px flex-1 bg-border" />
                        <Plane className="w-3.5 h-3.5 text-primary -rotate-90" />
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <span>{flight.destination?.city_ar || ''}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-2">
                      {flight.duration_minutes && (
                        <span className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-lg">
                          <Clock className="w-3 h-3" />
                          {Math.floor(flight.duration_minutes / 60)}س {flight.duration_minutes % 60}د
                        </span>
                      )}
                      <span className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-lg">
                        <Luggage className="w-3 h-3" />
                        {flight.baggage_allowance}
                      </span>
                    </div>
                  </div>
                  <div className="text-left shrink-0 pr-2">
                    <p className="text-xl font-black text-primary leading-tight">{flight.price_adult?.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">ر.س / للفرد</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="bg-primary/10 px-4 py-1.5 text-center text-xs font-bold text-primary">
                    ✓ تم الاختيار
                  </div>
                )}
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
        <Button variant="ghost" onClick={skipFlight} className="rounded-xl h-12 text-muted-foreground">
          <SkipForward className="w-4 h-4 ml-1" /> تخطي
        </Button>
        <Button
          onClick={onNext}
          disabled={!tripData.flightOfferId}
          className="flex-1 rounded-xl h-12 bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20"
        >
          التالي: اختيار الفندق
          <ChevronLeft className="w-4 h-4 mr-1" />
        </Button>
      </div>
    </div>
  );
};

export default StepFlight;
