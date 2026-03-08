import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { tripBuilderService } from '@/services/tripBuilderService';
import {
  Plane, Hotel, Car, Shield, Calendar, Users, Baby,
  Star, Check, ChevronLeft, Minus, Plus, MapPin, Clock,
  Sparkles, Package, ArrowLeft, ArrowLeftRight, X, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';
import { ar } from 'date-fns/locale';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface ReadyPackage {
  id: string;
  title_ar: string;
  description_ar: string;
  cover_image: string;
  destination_name_ar: string;
  country_ar: string;
  duration_nights: number;
  base_price_per_person: number;
  includes_flight: boolean;
  includes_hotel: boolean;
  includes_car: boolean;
  includes_insurance: boolean;
  includes_visa: boolean;
  hotel_name_ar: string;
  room_type_ar: string;
  flight_description_ar: string;
  car_description_ar: string;
  highlights: string[];
  badge: string;
  is_featured: boolean;
  destination_id: string;
  // new FK fields
  flight_offer_id: string | null;
  car_rental_id: string | null;
  default_room_id: string | null;
  default_hotel_id: string | null;
}

// ---- Customization state ----
interface SelectedFlight {
  id: string;
  price_adult: number;
  flight_number: string | null;
  departure_date: string;
  airline?: { name_ar: string; logo_url: string | null } | null;
  origin?: { city_ar: string } | null;
  destination?: { city_ar: string } | null;
  departure_time: string | null;
  arrival_time: string | null;
  is_direct: boolean | null;
}

interface SelectedHotel {
  id: string;
  name_ar: string;
  star_rating: number | null;
  rating: number | null;
  main_image: string | null;
  city_ar: string;
  country_ar: string;
}

interface SelectedRoom {
  id: string;
  name_ar: string;
  price_per_night: number;
  bed_type: string | null;
  includes_breakfast: boolean | null;
  hotel_id: string;
}

interface SelectedCar {
  id: string;
  name_ar: string;
  price_per_day: number;
  category: string | null;
  seats: number | null;
  image_url: string | null;
}

const ReadyPackages = () => {
  const [packages, setPackages] = useState<ReadyPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState<ReadyPackage | null>(null);

  // Booking form state
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Customization state
  const [selectedFlight, setSelectedFlight] = useState<SelectedFlight | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<SelectedHotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<SelectedRoom | null>(null);
  const [selectedCar, setSelectedCar] = useState<SelectedCar | null>(null);

  // Sheet state
  const [sheetType, setSheetType] = useState<'flight' | 'hotel' | 'car' | null>(null);
  const [sheetData, setSheetData] = useState<any[]>([]);
  const [sheetLoading, setSheetLoading] = useState(false);
  const [roomsForHotel, setRoomsForHotel] = useState<any[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [showRoomPicker, setShowRoomPicker] = useState<string | null>(null); // hotelId

  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    const { data, error } = await supabase
      .from('ready_packages' as any)
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    if (!error && data) {
      setPackages((data as any[]).map(p => ({
        ...p,
        highlights: Array.isArray(p.highlights) ? p.highlights : JSON.parse(p.highlights || '[]'),
      })));
    }
    setLoading(false);
  };

  // Load defaults when package selected
  const loadDefaults = useCallback(async (pkg: ReadyPackage) => {
    // Load default flight
    if (pkg.flight_offer_id) {
      const { data } = await supabase
        .from('flight_offers')
        .select('*, airline:airlines(*), origin:airports!flight_offers_origin_airport_id_fkey(*), destination:airports!flight_offers_destination_airport_id_fkey(*)')
        .eq('id', pkg.flight_offer_id)
        .single();
      if (data) setSelectedFlight(data as any);
    } else {
      setSelectedFlight(null);
    }

    // Load default hotel + room
    if (pkg.default_hotel_id) {
      const { data } = await supabase
        .from('hotels')
        .select('id, name_ar, star_rating, rating, main_image, city_ar, country_ar')
        .eq('id', pkg.default_hotel_id)
        .single();
      if (data) setSelectedHotel(data as any);
    } else {
      setSelectedHotel(null);
    }

    if (pkg.default_room_id) {
      const { data } = await supabase
        .from('hotel_rooms')
        .select('id, name_ar, price_per_night, bed_type, includes_breakfast, hotel_id')
        .eq('id', pkg.default_room_id)
        .single();
      if (data) setSelectedRoom(data as any);
    } else {
      setSelectedRoom(null);
    }

    // Load default car
    if (pkg.car_rental_id) {
      const { data } = await supabase
        .from('car_rentals')
        .select('id, name_ar, price_per_day, category, seats, image_url')
        .eq('id', pkg.car_rental_id)
        .single();
      if (data) setSelectedCar(data as any);
    } else {
      setSelectedCar(null);
    }
  }, []);

  const selectPackage = (pkg: ReadyPackage) => {
    setSelectedPkg(pkg);
    setCheckInDate(addDays(new Date(), 14));
    setCheckOutDate(addDays(new Date(), 14 + pkg.duration_nights));
    setSubmitted(false);
    loadDefaults(pkg);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open change sheet
  const openSheet = async (type: 'flight' | 'hotel' | 'car') => {
    setSheetType(type);
    setSheetLoading(true);
    setSheetData([]);
    try {
      if (type === 'flight') {
        const data = await tripBuilderService.getFlightOffers();
        setSheetData(data);
      } else if (type === 'hotel') {
        const data = await tripBuilderService.getHotels();
        setSheetData(data);
      } else if (type === 'car') {
        const data = await tripBuilderService.getCarRentals();
        setSheetData(data);
      }
    } catch { /* empty */ }
    setSheetLoading(false);
  };

  const selectFlightFromSheet = (f: any) => {
    setSelectedFlight(f);
    setSheetType(null);
  };

  const selectHotelFromSheet = async (h: any) => {
    setSelectedHotel(h);
    setShowRoomPicker(h.id);
    setRoomsLoading(true);
    try {
      const rooms = await tripBuilderService.getHotelRooms(h.id);
      setRoomsForHotel(rooms);
    } catch { setRoomsForHotel([]); }
    setRoomsLoading(false);
  };

  const selectRoomFromPicker = (r: any) => {
    setSelectedRoom(r);
    setShowRoomPicker(null);
    setSheetType(null);
  };

  const selectCarFromSheet = (c: any) => {
    setSelectedCar(c);
    setSheetType(null);
  };

  const removeCar = () => setSelectedCar(null);

  // Dynamic price calc
  const totalPassengers = adults + children;
  const nights = checkInDate && checkOutDate
    ? Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)))
    : selectedPkg?.duration_nights || 0;

  const hasRealPricing = !!(selectedFlight || selectedRoom);

  const flightTotal = selectedFlight ? selectedFlight.price_adult * totalPassengers : 0;
  const hotelTotal = selectedRoom ? selectedRoom.price_per_night * nights : 0;
  const carTotal = selectedCar ? selectedCar.price_per_day * nights : 0;

  const subtotal = hasRealPricing
    ? flightTotal + hotelTotal + carTotal
    : (selectedPkg ? selectedPkg.base_price_per_person * totalPassengers : 0);
  const taxes = subtotal * 0.15;
  const total = subtotal + taxes;

  const handleSubmit = async () => {
    if (!customerName || !customerEmail || !customerPhone) {
      toast.error('يرجى ملء جميع بيانات التواصل');
      return;
    }
    if (!checkInDate || !checkOutDate) {
      toast.error('يرجى تحديد تواريخ الرحلة');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('dynamic_packages').insert({
        destination: selectedPkg!.destination_name_ar,
        destination_id: selectedPkg!.destination_id,
        check_in_date: checkInDate.toISOString().split('T')[0],
        check_out_date: checkOutDate.toISOString().split('T')[0],
        adults_count: adults,
        children_count: children,
        infants_count: infants,
        flight_offer_id: selectedFlight?.id || null,
        hotel_id: selectedHotel?.id || null,
        room_id: selectedRoom?.id || null,
        car_rental_id: selectedCar?.id || null,
        subtotal,
        taxes,
        total_price: total,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        notes: `بكج جاهز: ${selectedPkg!.title_ar}\n${notes}`,
        status: 'pending',
        session_id: crypto.randomUUID(),
        extras: {
          ready_package_id: selectedPkg!.id,
          includes_flight: selectedPkg!.includes_flight,
          includes_hotel: selectedPkg!.includes_hotel,
          includes_car: selectedPkg!.includes_car,
          includes_insurance: selectedPkg!.includes_insurance,
        },
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success('تم إرسال طلب الحجز بنجاح!');
    } catch {
      toast.error('حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  // ========= RENDER: Selection Sheets =========
  const renderSheet = () => (
    <Sheet open={!!sheetType} onOpenChange={() => setSheetType(null)}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl overflow-auto p-0">
        <SheetHeader className="p-5 pb-3 border-b border-border sticky top-0 bg-background z-10">
          <SheetTitle className="text-right font-black">
            {sheetType === 'flight' ? 'اختر رحلة الطيران' : sheetType === 'hotel' ? 'اختر الفندق' : 'اختر السيارة'}
          </SheetTitle>
        </SheetHeader>

        <div className="p-4 space-y-3">
          {sheetLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">جاري التحميل...</p>
            </div>
          ) : sheetData.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">لا توجد خيارات متاحة حالياً</div>
          ) : sheetType === 'flight' ? (
            sheetData.map((f: any) => (
              <button
                key={f.id}
                onClick={() => selectFlightFromSheet(f)}
                className={cn(
                  'w-full text-right rounded-2xl border-2 p-4 transition-all',
                  selectedFlight?.id === f.id
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/30 hover:bg-muted/30'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {f.airline?.logo_url && <img src={f.airline.logo_url} className="w-6 h-6 rounded" alt="" />}
                    <span className="font-bold text-sm text-foreground">{f.airline?.name_ar || 'غير محدد'}</span>
                  </div>
                  <span className="text-lg font-black text-primary">{f.price_adult?.toLocaleString()} ر.س</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{f.origin?.city_ar || '---'}</span>
                  <Plane className="w-3 h-3 rotate-180" />
                  <span>{f.destination?.city_ar || '---'}</span>
                  {f.is_direct && <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-md font-medium">مباشرة</span>}
                </div>
                {f.departure_time && (
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {f.departure_date} · {f.departure_time}
                  </p>
                )}
              </button>
            ))
          ) : sheetType === 'hotel' ? (
            showRoomPicker ? (
              <div className="space-y-3">
                <button onClick={() => setShowRoomPicker(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4" /> العودة للفنادق
                </button>
                <h4 className="font-bold text-foreground">اختر نوع الغرفة</h4>
                {roomsLoading ? (
                  <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : roomsForHotel.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">لا توجد غرف متاحة</p>
                ) : roomsForHotel.map((r: any) => (
                  <button
                    key={r.id}
                    onClick={() => selectRoomFromPicker(r)}
                    className={cn(
                      'w-full text-right rounded-2xl border-2 p-4 transition-all',
                      selectedRoom?.id === r.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-sm text-foreground">{r.name_ar}</p>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
                          {r.bed_type && <span>{r.bed_type}</span>}
                          {r.includes_breakfast && <span className="text-emerald-600">☕ إفطار</span>}
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-black text-primary">{r.price_per_night?.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">ر.س/ليلة</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              sheetData.map((h: any) => (
                <button
                  key={h.id}
                  onClick={() => selectHotelFromSheet(h)}
                  className={cn(
                    'w-full text-right rounded-2xl border-2 p-4 transition-all',
                    selectedHotel?.id === h.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  )}
                >
                  <div className="flex gap-3">
                    {h.main_image && (
                      <img src={h.main_image} className="w-16 h-16 rounded-xl object-cover shrink-0" alt="" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-foreground truncate">{h.name_ar}</p>
                      <p className="text-[11px] text-muted-foreground">{h.city_ar} · {h.country_ar}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {h.star_rating && Array.from({ length: h.star_rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                        {h.rating > 0 && <span className="text-[10px] text-muted-foreground mr-1">{h.rating}</span>}
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-muted-foreground shrink-0 mt-2" />
                  </div>
                </button>
              ))
            )
          ) : (
            // Car
            sheetData.map((c: any) => (
              <button
                key={c.id}
                onClick={() => selectCarFromSheet(c)}
                className={cn(
                  'w-full text-right rounded-2xl border-2 p-4 transition-all',
                  selectedCar?.id === c.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                )}
              >
                <div className="flex gap-3">
                  {c.image_url && <img src={c.image_url} className="w-16 h-16 rounded-xl object-cover shrink-0" alt="" />}
                  <div className="flex-1">
                    <p className="font-bold text-sm text-foreground">{c.name_ar}</p>
                    <p className="text-[11px] text-muted-foreground">{c.category} · {c.seats} مقاعد</p>
                  </div>
                  <div className="text-left shrink-0">
                    <p className="text-lg font-black text-primary">{c.price_per_day?.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">ر.س/يوم</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  // ========= RENDER: Customization cards =========
  const renderCustomizationSection = () => (
    <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
      <h3 className="font-black text-foreground flex items-center gap-2">
        <ArrowLeftRight className="w-5 h-5 text-primary" />
        تخصيص البكج
      </h3>
      <p className="text-xs text-muted-foreground">يمكنك تغيير أي عنصر من عناصر البكج بأسعار فعلية</p>

      {/* Flight */}
      {selectedPkg!.includes_flight && (
        <div className="rounded-xl border-2 border-border p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Plane className="w-4 h-4 text-blue-500" />
              </div>
              <span className="font-bold text-sm text-foreground">الطيران</span>
            </div>
            <Button size="sm" variant="outline" className="rounded-lg text-xs h-8" onClick={() => openSheet('flight')}>
              <ArrowLeftRight className="w-3 h-3 ml-1" /> تغيير
            </Button>
          </div>
          {selectedFlight ? (
            <div className="bg-blue-500/5 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-xs text-foreground">{selectedFlight.airline?.name_ar || 'رحلة طيران'}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {selectedFlight.origin?.city_ar} → {selectedFlight.destination?.city_ar}
                  </p>
                </div>
                <p className="font-black text-sm text-primary">{selectedFlight.price_adult.toLocaleString()} ر.س<span className="text-[10px] font-normal text-muted-foreground">/فرد</span></p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 text-center">
              {selectedPkg!.flight_description_ar || 'لم يتم اختيار رحلة - اضغط تغيير'}
            </p>
          )}
        </div>
      )}

      {/* Hotel */}
      {selectedPkg!.includes_hotel && (
        <div className="rounded-xl border-2 border-border p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Hotel className="w-4 h-4 text-amber-600" />
              </div>
              <span className="font-bold text-sm text-foreground">الفندق</span>
            </div>
            <Button size="sm" variant="outline" className="rounded-lg text-xs h-8" onClick={() => openSheet('hotel')}>
              <ArrowLeftRight className="w-3 h-3 ml-1" /> تغيير
            </Button>
          </div>
          {selectedHotel && selectedRoom ? (
            <div className="bg-amber-500/5 rounded-lg p-3">
              <div className="flex gap-3">
                {selectedHotel.main_image && (
                  <img src={selectedHotel.main_image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs text-foreground truncate">{selectedHotel.name_ar}</p>
                  <p className="text-[10px] text-muted-foreground">{selectedRoom.name_ar}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {selectedHotel.star_rating && Array.from({ length: selectedHotel.star_rating }).map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="font-black text-sm text-primary shrink-0">{selectedRoom.price_per_night.toLocaleString()} ر.س<span className="text-[10px] font-normal text-muted-foreground">/ليلة</span></p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 text-center">
              {selectedPkg!.hotel_name_ar || 'لم يتم اختيار فندق - اضغط تغيير'}
            </p>
          )}
        </div>
      )}

      {/* Car */}
      <div className="rounded-xl border-2 border-border p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Car className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="font-bold text-sm text-foreground">السيارة</span>
          </div>
          <div className="flex items-center gap-1">
            {selectedCar && (
              <Button size="sm" variant="ghost" className="rounded-lg text-xs h-8 text-destructive" onClick={removeCar}>
                <X className="w-3 h-3" />
              </Button>
            )}
            <Button size="sm" variant="outline" className="rounded-lg text-xs h-8" onClick={() => openSheet('car')}>
              <ArrowLeftRight className="w-3 h-3 ml-1" /> {selectedCar ? 'تغيير' : 'إضافة'}
            </Button>
          </div>
        </div>
        {selectedCar ? (
          <div className="bg-emerald-500/5 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedCar.image_url && <img src={selectedCar.image_url} className="w-10 h-10 rounded-lg object-cover" alt="" />}
                <div>
                  <p className="font-semibold text-xs text-foreground">{selectedCar.name_ar}</p>
                  <p className="text-[10px] text-muted-foreground">{selectedCar.category} · {selectedCar.seats} مقاعد</p>
                </div>
              </div>
              <p className="font-black text-sm text-primary">{selectedCar.price_per_day.toLocaleString()} ر.س<span className="text-[10px] font-normal text-muted-foreground">/يوم</span></p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 text-center">
            {selectedPkg?.includes_car ? selectedPkg.car_description_ar : 'اختياري - اضغط إضافة'}
          </p>
        )}
      </div>
    </div>
  );

  // ========= RENDER: Price breakdown =========
  const renderPriceBreakdown = () => (
    <div className="space-y-2">
      {selectedFlight && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>✈️ طيران ({totalPassengers} × {selectedFlight.price_adult.toLocaleString()})</span>
          <span>{flightTotal.toLocaleString()} ر.س</span>
        </div>
      )}
      {selectedRoom && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>🏨 فندق ({nights} × {selectedRoom.price_per_night.toLocaleString()})</span>
          <span>{hotelTotal.toLocaleString()} ر.س</span>
        </div>
      )}
      {selectedCar && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>🚗 سيارة ({nights} × {selectedCar.price_per_day.toLocaleString()})</span>
          <span>{carTotal.toLocaleString()} ر.س</span>
        </div>
      )}
      {!hasRealPricing && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>المجموع ({totalPassengers} × {selectedPkg!.base_price_per_person.toLocaleString()})</span>
          <span>{subtotal.toLocaleString()} ر.س</span>
        </div>
      )}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>الضريبة 15%</span>
        <span>{taxes.toLocaleString()} ر.س</span>
      </div>
      <div className="bg-gradient-to-l from-primary/10 to-secondary/10 rounded-xl p-3 mt-3">
        <div className="flex justify-between items-center">
          <span className="font-bold text-sm text-foreground">الإجمالي</span>
          <span className="text-xl font-black text-primary">{total.toLocaleString()} ر.س</span>
        </div>
      </div>
    </div>
  );

  // ========= DETAIL VIEW =========
  if (selectedPkg) {
    if (submitted) {
      return (
        <div className="min-h-screen bg-background pt-20 pb-8" dir="rtl">
          <Helmet><title>{selectedPkg.title_ar} | ترافليون</title></Helmet>
          <div className="container mx-auto px-4 max-w-lg text-center py-20 space-y-5">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Check className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-foreground">تم إرسال طلبك بنجاح!</h2>
            <p className="text-muted-foreground">سيتواصل معك فريقنا خلال 24 ساعة لتأكيد الحجز</p>
            <div className="bg-primary/10 rounded-2xl py-4 px-6 inline-block">
              <p className="text-2xl font-black text-primary">{total.toLocaleString()} ر.س</p>
            </div>
            <div className="pt-6 flex gap-3 justify-center">
              <Button variant="outline" onClick={() => { setSelectedPkg(null); setSubmitted(false); }} className="rounded-xl">
                العودة للبكجات
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background pt-20 pb-8" dir="rtl">
        <Helmet><title>{selectedPkg.title_ar} | ترافليون</title></Helmet>
        {renderSheet()}
        <div className="container mx-auto px-4 max-w-5xl">
          <button
            onClick={() => setSelectedPkg(null)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة للبكجات الجاهزة
          </button>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-6">
              {/* Hero */}
              <div className="relative rounded-3xl overflow-hidden h-56 lg:h-72">
                <img src={selectedPkg.cover_image} alt={selectedPkg.title_ar} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  {selectedPkg.badge && (
                    <span className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-lg mb-2 inline-block">
                      {selectedPkg.badge}
                    </span>
                  )}
                  <h1 className="text-2xl font-black">{selectedPkg.title_ar}</h1>
                  <p className="text-sm text-white/80 mt-1">{selectedPkg.description_ar}</p>
                </div>
              </div>

              {/* Customization Section */}
              {renderCustomizationSection()}

              {/* Highlights */}
              {selectedPkg.highlights.length > 0 && (
                <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
                  <h3 className="font-black text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-secondary" />
                    أبرز النشاطات
                  </h3>
                  <div className="space-y-2">
                    {selectedPkg.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-sm text-foreground">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
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
                          checkInDate ? 'border-primary/30 bg-primary/5 text-foreground font-medium' : 'border-border text-muted-foreground'
                        )}>
                          <Calendar className="w-4 h-4" />
                          {checkInDate ? format(checkInDate, 'dd MMM yyyy', { locale: ar }) : 'اختر'}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarUI
                          mode="single"
                          selected={checkInDate || undefined}
                          onSelect={(d) => {
                            if (d) {
                              setCheckInDate(d);
                              setCheckOutDate(addDays(d, selectedPkg.duration_nights));
                            }
                          }}
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
                          checkOutDate ? 'border-primary/30 bg-primary/5 text-foreground font-medium' : 'border-border text-muted-foreground'
                        )}>
                          <Calendar className="w-4 h-4" />
                          {checkOutDate ? format(checkOutDate, 'dd MMM yyyy', { locale: ar }) : 'اختر'}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarUI
                          mode="single"
                          selected={checkOutDate || undefined}
                          onSelect={(d) => d && setCheckOutDate(d)}
                          disabled={(d) => d <= (checkInDate || new Date())}
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 inline ml-1" />
                  {nights} ليالي / {nights + 1} أيام
                </p>
              </div>

              {/* Passengers */}
              <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  المسافرون
                </h3>
                {[
                  { label: 'بالغين', desc: '+12 سنة', value: adults, set: setAdults, min: 1, max: 9 },
                  { label: 'أطفال', desc: '2-12 سنة', value: children, set: setChildren, min: 0, max: 6 },
                  { label: 'رضع', desc: 'أقل من سنتين', value: infants, set: setInfants, min: 0, max: 4 },
                ].map(({ label, desc, value, set, min, max }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-foreground">{label}</p>
                      <p className="text-[11px] text-muted-foreground">{desc}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => set(Math.max(min, value - 1))}
                        disabled={value <= min}
                        className={cn('w-9 h-9 rounded-xl flex items-center justify-center transition-all',
                          value <= min ? 'bg-muted text-muted-foreground/40' : 'bg-muted hover:bg-muted/80 text-foreground'
                        )}
                      ><Minus className="w-4 h-4" /></button>
                      <span className="text-lg font-bold text-foreground w-6 text-center">{value}</span>
                      <button
                        onClick={() => set(Math.min(max, value + 1))}
                        disabled={value >= max}
                        className={cn('w-9 h-9 rounded-xl flex items-center justify-center transition-all',
                          value >= max ? 'bg-primary/30 text-primary/50' : 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                        )}
                      ><Plus className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact form */}
              <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary rounded-full" />
                  بيانات التواصل
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground mb-1 block">الاسم الكامل *</label>
                    <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="محمد أحمد" className="rounded-xl h-12" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground mb-1 block">البريد الإلكتروني *</label>
                      <Input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="email@example.com" className="rounded-xl h-12" />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground mb-1 block">رقم الجوال *</label>
                      <Input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="+966 5XX" className="rounded-xl h-12" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground mb-1 block">ملاحظات إضافية</label>
                    <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="أي طلبات خاصة..." rows={3} className="rounded-xl" />
                  </div>
                </div>
              </div>

              {/* Submit on mobile */}
              {isMobile && (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full h-14 rounded-2xl bg-secondary text-secondary-foreground text-base font-black shadow-lg shadow-secondary/25"
                >
                  {submitting ? 'جاري الإرسال...' : `تأكيد الحجز · ${total.toLocaleString()} ر.س`}
                </Button>
              )}
            </div>

            {/* Sidebar - Price summary */}
            {!isMobile && (
              <div className="w-80 shrink-0">
                <div className="bg-card rounded-3xl border border-border p-5 sticky top-24 shadow-xl shadow-black/5 space-y-4">
                  <h3 className="font-black text-foreground flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-secondary/15 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-secondary" />
                    </div>
                    ملخص الحجز
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <span className="flex-1 text-foreground">{selectedPkg.destination_name_ar}</span>
                      <span className="text-xs text-muted-foreground">{nights} ليالي</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="flex-1 text-foreground">{totalPassengers} مسافرين</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-dashed border-border">
                    {renderPriceBreakdown()}
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full h-14 rounded-2xl bg-secondary text-secondary-foreground text-base font-black shadow-lg shadow-secondary/25 mt-4"
                  >
                    {submitting ? 'جاري الإرسال...' : 'تأكيد الحجز'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ========= LISTING VIEW =========
  return (
    <>
      <Helmet>
        <title>بكجات جاهزة | ترافليون</title>
        <meta name="description" content="اختر من بكجاتنا الجاهزة وخصصها حسب رغبتك - غيّر الفندق والطيران والسيارة بأسعار فعلية" />
      </Helmet>

      <div className="min-h-screen bg-background pt-20 pb-8" dir="rtl">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent rounded-3xl p-8 text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary/15 flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-foreground">بكجات جاهزة</h1>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              اختر البكج وخصّصه كما تريد - غيّر الفندق، الطيران، والسيارة بأسعار فعلية
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <Button variant="outline" className="rounded-xl" onClick={() => navigate('/trip-builder')}>
                أو صمم رحلتك بنفسك
                <ChevronLeft className="w-4 h-4 mr-1" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-bold text-foreground">لا توجد بكجات متاحة حالياً</p>
              <p className="text-muted-foreground mt-1">جرب تصميم رحلتك بنفسك</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {packages.map(pkg => (
                <button
                  key={pkg.id}
                  onClick={() => selectPackage(pkg)}
                  className="rounded-2xl overflow-hidden bg-card border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 text-right group"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img src={pkg.cover_image} alt={pkg.title_ar} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {pkg.badge && (
                      <span className="absolute top-3 right-3 bg-secondary text-secondary-foreground text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg">
                        {pkg.badge}
                      </span>
                    )}
                    <div className="absolute bottom-3 right-3 text-white">
                      <p className="text-xs text-white/70">{pkg.country_ar}</p>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md rounded-lg px-2.5 py-1 text-white text-[11px] font-bold">
                      <Clock className="w-3 h-3 inline ml-1" />
                      {pkg.duration_nights} ليالي
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="font-black text-foreground leading-tight">{pkg.title_ar}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{pkg.description_ar}</p>

                    <div className="flex items-center gap-2 flex-wrap">
                      {pkg.includes_flight && (
                        <span className="flex items-center gap-1 text-[10px] bg-blue-500/10 text-blue-600 px-2 py-1 rounded-lg font-medium">
                          <Plane className="w-3 h-3" /> طيران
                        </span>
                      )}
                      {pkg.includes_hotel && (
                        <span className="flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-600 px-2 py-1 rounded-lg font-medium">
                          <Hotel className="w-3 h-3" /> فندق
                        </span>
                      )}
                      {pkg.includes_car && (
                        <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-lg font-medium">
                          <Car className="w-3 h-3" /> سيارة
                        </span>
                      )}
                      {pkg.includes_insurance && (
                        <span className="flex items-center gap-1 text-[10px] bg-purple-500/10 text-purple-600 px-2 py-1 rounded-lg font-medium">
                          <Shield className="w-3 h-3" /> تأمين
                        </span>
                      )}
                    </div>

                    <div className="flex items-end justify-between pt-2 border-t border-border">
                      <div>
                        <p className="text-[10px] text-muted-foreground">يبدأ من</p>
                        <p className="text-xl font-black text-primary">{pkg.base_price_per_person.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">ر.س / للفرد</p>
                      </div>
                      <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-primary/20">
                        خصّص واحجز
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReadyPackages;
