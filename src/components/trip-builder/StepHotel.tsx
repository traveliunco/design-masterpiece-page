import { useEffect, useState } from 'react';
import { Hotel, Star, BedDouble, SkipForward } from 'lucide-react';
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
    tripBuilderService.getHotels().then(d => { setHotels(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

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
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">اختر الفندق والغرفة</h2>
        <p className="text-muted-foreground">اختياري - اختر فندقك المفضل ثم نوع الغرفة</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />)}
        </div>
      ) : hotels.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-2xl">
          <Hotel className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">لا توجد فنادق متاحة حالياً</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotels.map(hotel => (
              <button
                key={hotel.id}
                onClick={() => selectHotel(hotel)}
                className={cn(
                  'rounded-xl overflow-hidden border-2 transition-all text-right',
                  selectedHotel === hotel.id ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/40'
                )}
              >
                <div className="h-32 bg-muted">
                  {hotel.main_image && <img src={hotel.main_image} alt={hotel.name_ar} className="w-full h-full object-cover" />}
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-foreground">{hotel.name_ar}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span>{hotel.city_ar}</span>
                    {hotel.star_rating && (
                      <span className="flex items-center gap-0.5">
                        {Array.from({ length: hotel.star_rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-secondary text-secondary" />)}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Rooms */}
          {selectedHotel && rooms.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-foreground mb-3">اختر الغرفة</h3>
              <div className="space-y-3">
                {rooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => selectRoom(room)}
                    className={cn(
                      'w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 text-right',
                      tripData.roomId === room.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 bg-card'
                    )}
                  >
                    <BedDouble className="w-8 h-8 text-primary shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-foreground">{room.name_ar}</p>
                      <p className="text-xs text-muted-foreground">{room.bed_type || ''} · حتى {room.max_adults} بالغين</p>
                    </div>
                    <div className="text-left shrink-0">
                      <p className="text-lg font-bold text-primary">{room.price_per_night?.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">ر.س / ليلة</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>السابق</Button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={skip} className="text-muted-foreground"><SkipForward className="w-4 h-4 ml-1" /> تخطي</Button>
          <Button onClick={onNext} disabled={selectedHotel && !tripData.roomId ? true : false} className="bg-primary text-primary-foreground px-8">
            التالي: السيارة
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepHotel;
