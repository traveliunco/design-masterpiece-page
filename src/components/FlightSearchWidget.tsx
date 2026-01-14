/**
 * مكون البحث عن رحلات الطيران
 * يستخدم Amadeus API للبحث الحقيقي
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Search, ArrowLeftRight, Calendar, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    useFlightSearch,
    useLocationSearch,
    formatFlightDuration,
    formatFlightTime,
    formatPrice,
    getAirlineName,
    getCityName,
} from '@/hooks/useAmadeus';

// المطارات الشائعة
const popularAirports = [
    { code: 'RUH', name: 'الرياض', country: 'السعودية' },
    { code: 'JED', name: 'جدة', country: 'السعودية' },
    { code: 'DMM', name: 'الدمام', country: 'السعودية' },
    { code: 'MED', name: 'المدينة المنورة', country: 'السعودية' },
    { code: 'KUL', name: 'كوالالمبور', country: 'ماليزيا' },
    { code: 'BKK', name: 'بانكوك', country: 'تايلاند' },
    { code: 'IST', name: 'إسطنبول', country: 'تركيا' },
    { code: 'DXB', name: 'دبي', country: 'الإمارات' },
    { code: 'CGK', name: 'جاكرتا', country: 'إندونيسيا' },
    { code: 'MLE', name: 'ماليه', country: 'المالديف' },
];

interface FlightSearchWidgetProps {
    onSelectFlight?: (flight: any) => void;
    compact?: boolean;
}

export const FlightSearchWidget = ({ onSelectFlight, compact = false }: FlightSearchWidgetProps) => {
    const navigate = useNavigate();
    const [origin, setOrigin] = useState('RUH');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [passengers, setPassengers] = useState('1');
    const [travelClass, setTravelClass] = useState<'ECONOMY' | 'BUSINESS'>('ECONOMY');
    const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');

    const { flights, loading, error, search } = useFlightSearch();

    const handleSearch = async () => {
        if (!origin || !destination || !departureDate) {
            return;
        }

        await search({
            originLocationCode: origin,
            destinationLocationCode: destination,
            departureDate,
            returnDate: tripType === 'roundtrip' ? returnDate : undefined,
            adults: parseInt(passengers),
            travelClass,
            max: 10,
        });
    };

    const swapLocations = () => {
        const temp = origin;
        setOrigin(destination);
        setDestination(temp);
    };

    // الحصول على تاريخ الغد كحد أدنى
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <div className="space-y-6">
            {/* نموذج البحث */}
            <Card className="shadow-xl border-0">
                <CardContent className="p-6">
                    {/* نوع الرحلة */}
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setTripType('roundtrip')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tripType === 'roundtrip'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            ذهاب وعودة
                        </button>
                        <button
                            onClick={() => setTripType('oneway')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tripType === 'oneway'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            ذهاب فقط
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                        {/* من */}
                        <div className="space-y-2">
                            <Label>من</Label>
                            <Select value={origin} onValueChange={setOrigin}>
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="مدينة المغادرة" />
                                </SelectTrigger>
                                <SelectContent>
                                    {popularAirports.map((airport) => (
                                        <SelectItem key={airport.code} value={airport.code}>
                                            {airport.code} - {airport.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* زر التبديل */}
                        <div className="flex items-end justify-center">
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full h-12 w-12"
                                onClick={swapLocations}
                            >
                                <ArrowLeftRight className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* إلى */}
                        <div className="space-y-2">
                            <Label>إلى</Label>
                            <Select value={destination} onValueChange={setDestination}>
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="مدينة الوصول" />
                                </SelectTrigger>
                                <SelectContent>
                                    {popularAirports.map((airport) => (
                                        <SelectItem key={airport.code} value={airport.code}>
                                            {airport.code} - {airport.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* تاريخ الذهاب */}
                        <div className="space-y-2">
                            <Label>تاريخ الذهاب</Label>
                            <Input
                                type="date"
                                value={departureDate}
                                onChange={(e) => setDepartureDate(e.target.value)}
                                min={minDate}
                                className="h-12"
                            />
                        </div>

                        {/* تاريخ العودة */}
                        {tripType === 'roundtrip' && (
                            <div className="space-y-2">
                                <Label>تاريخ العودة</Label>
                                <Input
                                    type="date"
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    min={departureDate || minDate}
                                    className="h-12"
                                />
                            </div>
                        )}

                        {/* المسافرون */}
                        <div className="space-y-2">
                            <Label>المسافرون</Label>
                            <Select value={passengers} onValueChange={setPassengers}>
                                <SelectTrigger className="h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                                        <SelectItem key={n} value={n.toString()}>
                                            {n} مسافر
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* درجة السفر وزر البحث */}
                    <div className="flex flex-col md:flex-row gap-4 mt-6">
                        <Select value={travelClass} onValueChange={(v: any) => setTravelClass(v)}>
                            <SelectTrigger className="w-full md:w-48 h-12">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ECONOMY">الدرجة السياحية</SelectItem>
                                <SelectItem value="BUSINESS">درجة رجال الأعمال</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            onClick={handleSearch}
                            disabled={loading || !destination || !departureDate}
                            className="flex-1 h-12 text-lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                                    جاري البحث...
                                </>
                            ) : (
                                <>
                                    <Search className="w-5 h-5 ml-2" />
                                    بحث عن رحلات
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* رسالة الخطأ */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                    <p>{error}</p>
                </div>
            )}

            {/* نتائج البحث */}
            {flights.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold">
                        تم العثور على {flights.length} رحلة
                    </h3>

                    {flights.map((flight, index) => (
                        <Card
                            key={flight.id || index}
                            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => onSelectFlight?.(flight)}
                        >
                            <CardContent className="p-0">
                                <div className="flex flex-col lg:flex-row">
                                    {/* معلومات الرحلة */}
                                    <div className="flex-1 p-6">
                                        {flight.itineraries.map((itinerary, itinIndex) => (
                                            <div key={itinIndex} className="mb-4 last:mb-0">
                                                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                                                    <Plane className="w-4 h-4" />
                                                    {itinIndex === 0 ? 'رحلة الذهاب' : 'رحلة العودة'}
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    {/* المغادرة */}
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold">
                                                            {formatFlightTime(itinerary.segments[0].departure.at)}
                                                        </p>
                                                        <p className="font-medium">
                                                            {itinerary.segments[0].departure.iataCode}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {getCityName(itinerary.segments[0].departure.iataCode)}
                                                        </p>
                                                    </div>

                                                    {/* المدة */}
                                                    <div className="flex-1 mx-6 text-center">
                                                        <div className="relative">
                                                            <div className="h-px bg-border" />
                                                            <div className="absolute inset-x-0 -top-3 text-center">
                                                                <span className="bg-card px-2 text-sm text-muted-foreground">
                                                                    {formatFlightDuration(itinerary.duration)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-2">
                                                            {itinerary.segments.length === 1
                                                                ? 'مباشر'
                                                                : `${itinerary.segments.length - 1} توقف`}
                                                        </p>
                                                    </div>

                                                    {/* الوصول */}
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold">
                                                            {formatFlightTime(
                                                                itinerary.segments[itinerary.segments.length - 1].arrival.at
                                                            )}
                                                        </p>
                                                        <p className="font-medium">
                                                            {itinerary.segments[itinerary.segments.length - 1].arrival.iataCode}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {getCityName(
                                                                itinerary.segments[itinerary.segments.length - 1].arrival.iataCode
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* شركة الطيران */}
                                                <div className="flex items-center gap-2 mt-3 text-sm">
                                                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                                        <Plane className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <span>{getAirlineName(itinerary.segments[0].carrierCode)}</span>
                                                    <span className="text-muted-foreground">
                                                        {itinerary.segments[0].carrierCode}
                                                        {itinerary.segments[0].number}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* السعر */}
                                    <div className="bg-muted/50 p-6 flex flex-col justify-center items-center lg:w-56 border-t lg:border-t-0 lg:border-r">
                                        <p className="text-3xl font-bold text-primary">
                                            {formatPrice(flight.price.total, flight.price.currency)}
                                        </p>
                                        <p className="text-sm text-muted-foreground mb-4">للشخص الواحد</p>
                                        <Button
                                            className="w-full"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // تخزين بيانات الرحلة للحجز
                                                const bookingData = {
                                                    type: 'flight',
                                                    origin: origin,
                                                    destination: destination,
                                                    departureDate: departureDate,
                                                    returnDate: returnDate,
                                                    passengers: passengers,
                                                    price: flight.price.total,
                                                    currency: flight.price.currency,
                                                    flightDetails: flight,
                                                };
                                                sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
                                                navigate('/flight-booking');
                                            }}
                                        >
                                            احجز الآن
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* لا توجد نتائج */}
            {!loading && flights.length === 0 && destination && departureDate && (
                <div className="text-center py-12">
                    <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">ابحث عن رحلتك</h3>
                    <p className="text-muted-foreground">
                        اختر وجهتك وتاريخ السفر ثم اضغط على زر البحث
                    </p>
                </div>
            )}
        </div>
    );
};

export default FlightSearchWidget;
