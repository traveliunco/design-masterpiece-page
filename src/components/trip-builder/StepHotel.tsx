import { useEffect, useState } from 'react';
import { Hotel, Star, BedDouble, SkipForward, ChevronLeft, ChevronRight } from 'lucide-react';
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

const StepHotel = ({ tripData, updateTrip, onNext, onPrev }: Props) => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState<string | null>(tripData.hotelId);

  useEffect(() => {
    setLoading(true);
    tripBuilderService.getHotels(tripData.cityName || undefined, tripData.countryName || undefined)
      .then(d => { setHotels(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [tripData.cityName, tripData.countryName]);

  useEffect(() => {
    if (selectedHotel) {
      tripBuilderService.getHotelRooms(selectedHotel).then(setRooms);
    }
  }, [selectedHotel]);

  const selectHotel = (hotel: any) => {
    setSelectedHotel(hotel.id);
    updateTrip({ hotelId: hotel.id, hotelName: hotel.name_ar, roomId: null, roomName: '', hotelPricePerNight: 0 });
    setRooms([]);
  };

  const selectRoom = (room: any) => {
    updateTrip({ roomId: room.id, roomName: room.name_ar, hotelPricePerNight: room.price_per_night });
  };

  const skip = () => {
    updateTrip({ hotelId: null, hotelName: '', roomId: null, roomName: '', hotelPricePerNight: 0 });
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500/10 via-secondary/5 to-transparent rounded-3xl p-6 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/15 flex items-center justify-center mb-3">
          <Hotel className="w-7 h-7 text-amber-600" />
        </div>
        <h2 className="text-xl font-bold text-foreground">اختر الفندق والغرفة</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {tripData.cityName ? `فنادق في ${tripData.cityName}` : tripData.countryName ? `فنادق في ${tripData.countryName}` : 'اختياري - اختر فندقك المفضل'}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="h-44 rounded-2xl bg-muted animate-pulse" />)}
        </div>
      ) : hotels.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-3xl border border-dashed border-border">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Hotel className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">لا توجد فنادق متاحة في {tripData.cityName || tripData.countryName || 'هذه الوجهة'}</p>
          <p className="text-xs text-muted-foreground mt-2">يمكنك تخطي هذه الخطوة وسيتم ترتيب الفندق لاحقاً</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            {hotels.map(hotel => (
              <button
                key={hotel.id}
                onClick={() => selectHotel(hotel)}
                className={cn(
                  'rounded-2xl overflow-hidden transition-all duration-300 text-right',
                  selectedHotel === hotel.id
                    ? 'ring-[3px] ring-primary ring-offset-2 ring-offset-background shadow-lg shadow-primary/20'
                    : 'hover:shadow-md border border-border'
                )}
              >
                <div className="h-28 bg-muted relative">
                  {hotel.main_image && <img src={hotel.main_image} alt={hotel.name_ar} className="w-full h-full object-cover" />}
                  {hotel.star_rating && (
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-0.5 flex items-center gap-0.5">
                      {Array.from({ length: hotel.star_rating }).map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-secondary text-secondary" />
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-3 bg-card">
                  <h4 className="font-bold text-sm text-foreground leading-tight">{hotel.name_ar}</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{hotel.city_ar}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Rooms */}
          {selectedHotel && rooms.length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-primary" />
                اختر الغرفة
              </h3>
              {rooms.map(room => (
                <button
                  key={room.id}
                  onClick={() => selectRoom(room)}
                  className={cn(
                    'w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 text-right',
                    tripData.roomId === room.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/30 bg-card'
                  )}
                >
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                    tripData.roomId === room.id ? 'bg-primary/15' : 'bg-muted'
                  )}>
                    <BedDouble className={cn('w-6 h-6', tripData.roomId === room.id ? 'text-primary' : 'text-muted-foreground')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground">{room.name_ar}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{room.bed_type || ''} · حتى {room.max_adults} بالغين</p>
                  </div>
                  <div className="text-left shrink-0">
                    {room.original_price && room.original_price > room.price_per_night && (
                      <p className="text-[10px] text-muted-foreground line-through">{room.original_price?.toLocaleString()}</p>
                    )}
                    <p className="text-lg font-black text-primary">{room.price_per_night?.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">ر.س / ليلة</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
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
          disabled={selectedHotel && !tripData.roomId ? true : false}
          className="flex-1 rounded-xl h-12 bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20"
        >
          التالي: السيارة
          <ChevronLeft className="w-4 h-4 mr-1" />
        </Button>
      </div>
    </div>
  );
};

export default StepHotel;
