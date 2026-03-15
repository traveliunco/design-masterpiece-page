import { useEffect, useState } from 'react';
import { MapPin, Users, Calendar, ChevronLeft, Minus, Plus, Globe, Building2 } from 'lucide-react';
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
  const [cityAirports, setCityAirports] = useState<any[]>([]);
  const [originAirports, setOriginAirports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    Promise.all([
      tripBuilderService.getDestinations(),
      tripBuilderService.getOriginAirports(),
    ]).then(([dests, origins]) => {
      setDestinations(dests);
      setOriginAirports(origins);
      // Set default origin to Riyadh
      const riyadh = origins.find((a: any) => a.iata_code === 'RUH');
      if (riyadh && !tripData.originAirportId) {
        updateTrip({ originAirportId: riyadh.id, originCityName: riyadh.city_ar });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Load city airports when destination (country) is selected
  useEffect(() => {
    if (tripData.countryName) {
      setLoadingCities(true);
      tripBuilderService.getAirportsByCountry(tripData.countryName).then(airports => {
        setCityAirports(airports);
        // Auto-select if only one city
        if (airports.length === 1) {
          updateTrip({
            cityName: airports[0].city_ar,
            destinationAirportId: airports[0].id,
          });
        }
        setLoadingCities(false);
      }).catch(() => setLoadingCities(false));
    }
  }, [tripData.countryName]);

  const selectDestination = (dest: any) => {
    updateTrip({
      destinationId: dest.id,
      destinationName: dest.name_ar,
      countryName: dest.country_ar,
      // Reset city when changing country
      cityName: '',
      destinationAirportId: null,
    });
  };

  const selectCity = (airport: any) => {
    updateTrip({
      cityName: airport.city_ar,
      destinationAirportId: airport.id,
    });
  };

  const selectOrigin = (airport: any) => {
    updateTrip({
      originAirportId: airport.id,
      originCityName: airport.city_ar,
    });
  };

  const canProceed = tripData.destinationId && tripData.checkInDate && tripData.checkOutDate;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent rounded-3xl p-6 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/15 flex items-center justify-center mb-3">
          <Globe className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">اختر وجهتك</h2>
        <p className="text-sm text-muted-foreground mt-1">حدد الدولة، المدينة، التواريخ، وعدد المسافرين</p>
      </div>

      {/* Origin City */}
      <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          مدينة المغادرة
        </h3>
        <div className="flex gap-2 flex-wrap">
          {originAirports.map(airport => (
            <button
              key={airport.id}
              onClick={() => selectOrigin(airport)}
              className={cn(
                'px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                tripData.originAirportId === airport.id
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {airport.city_ar}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations (Countries) */}
      <div>
        <h3 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-primary rounded-full" />
          اختر الدولة
        </h3>
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1,2,3,4].map(i => <div key={i} className="h-36 rounded-2xl bg-muted animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {destinations.map(dest => (
              <button
                key={dest.id}
                onClick={() => selectDestination(dest)}
                className={cn(
                  'relative h-36 rounded-2xl overflow-hidden group transition-all duration-300',
                  tripData.destinationId === dest.id
                    ? 'ring-[3px] ring-primary ring-offset-2 ring-offset-background shadow-lg shadow-primary/20'
                    : 'hover:shadow-md'
                )}
              >
                <img src={dest.cover_image} alt={dest.name_ar} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 right-0 left-0 p-3 text-right">
                  <p className="font-bold text-white text-sm leading-tight">{dest.name_ar}</p>
                  <p className="text-[11px] text-white/70">{dest.country_ar}</p>
                </div>
                {tripData.destinationId === dest.id && (
                  <div className="absolute top-2 left-2 w-7 h-7 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                    <MapPin className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* City Selection (from airports) */}
      {tripData.destinationId && cityAirports.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            اختر المدينة
          </h3>
          {loadingCities ? (
            <div className="h-12 rounded-xl bg-muted animate-pulse" />
          ) : (
            <div className="flex gap-2 flex-wrap">
              {cityAirports.map(airport => (
                <button
                  key={airport.id}
                  onClick={() => selectCity(airport)}
                  className={cn(
                    'px-5 py-3 rounded-xl text-sm font-bold transition-all',
                    tripData.destinationAirportId === airport.id
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  )}
                >
                  {airport.city_ar}
                  <span className="text-[10px] opacity-70 mr-1">({airport.iata_code})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Date Pickers */}
      <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          تواريخ الرحلة
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-medium text-muted-foreground mb-1 block">الوصول</label>
            <Popover>
              <PopoverTrigger asChild>
                <button className={cn(
                  'w-full h-12 rounded-xl border-2 flex items-center justify-center gap-2 text-sm transition-all',
                  tripData.checkInDate
                    ? 'border-primary/30 bg-primary/5 text-foreground font-medium'
                    : 'border-border text-muted-foreground hover:border-primary/30'
                )}>
                  <Calendar className="w-4 h-4" />
                  {tripData.checkInDate ? format(tripData.checkInDate, 'dd MMM', { locale: ar }) : 'اختر'}
                </button>
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
            <label className="text-[11px] font-medium text-muted-foreground mb-1 block">المغادرة</label>
            <Popover>
              <PopoverTrigger asChild>
                <button className={cn(
                  'w-full h-12 rounded-xl border-2 flex items-center justify-center gap-2 text-sm transition-all',
                  tripData.checkOutDate
                    ? 'border-primary/30 bg-primary/5 text-foreground font-medium'
                    : 'border-border text-muted-foreground hover:border-primary/30'
                )}>
                  <Calendar className="w-4 h-4" />
                  {tripData.checkOutDate ? format(tripData.checkOutDate, 'dd MMM', { locale: ar }) : 'اختر'}
                </button>
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
      </div>

      {/* Passengers */}
      <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          المسافرون
        </h3>
        {[
          { label: 'بالغين', desc: '+12 سنة', key: 'adultsCount' as const, min: 1, max: 9 },
          { label: 'أطفال', desc: '2-12 سنة', key: 'childrenCount' as const, min: 0, max: 6 },
          { label: 'رضع', desc: 'أقل من سنتين', key: 'infantsCount' as const, min: 0, max: 4 },
        ].map(({ label, desc, key, min, max }) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-foreground">{label}</p>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateTrip({ [key]: Math.max(min, tripData[key] - 1) })}
                disabled={tripData[key] <= min}
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center transition-all',
                  tripData[key] <= min ? 'bg-muted text-muted-foreground/40' : 'bg-muted hover:bg-muted/80 text-foreground'
                )}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-bold text-foreground w-6 text-center">{tripData[key]}</span>
              <button
                onClick={() => updateTrip({ [key]: Math.min(max, tripData[key] + 1) })}
                disabled={tripData[key] >= max}
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center transition-all',
                  tripData[key] >= max ? 'bg-primary/30 text-primary/50' : 'bg-primary text-primary-foreground shadow-sm shadow-primary/30 hover:shadow-md'
                )}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Next Button */}
      <Button
        onClick={onNext}
        disabled={!canProceed}
        size="lg"
        className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-base font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
      >
        التالي: اختيار الطيران
        <ChevronLeft className="w-5 h-5 mr-2" />
      </Button>
    </div>
  );
};

export default StepDestination;
