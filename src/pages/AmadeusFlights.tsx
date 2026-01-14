import { useState } from "react";
import { Plane, Shield, Clock, Star, RefreshCw, Filter, AlertCircle, Loader2, Globe, Zap, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";
import PageLayout from "@/layouts/PageLayout";
import FlightSearchForm, { SearchFormData } from "@/components/flights/FlightSearchForm";
import FlightResultCard from "@/components/flights/FlightResultCard";
import BookingWizard from "@/components/flights/BookingWizard";
import { searchFlights, FlightOffer } from "@/services/amadeusService";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type SortOption = "price" | "duration" | "departure";

const AmadeusFlights = () => {
  useSEO({
    title: "حجز الطيران - نظام الحجز العالمي | ترافليون",
    description: "احجز رحلتك مباشرة من نظام الحجز العالمي Amadeus. أسعار حقيقية، حجز فوري، وتأكيد مباشر.",
    keywords: "حجز طيران, تذاكر طيران, رحلات جوية, Amadeus, ترافليون",
  });

  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [searchData, setSearchData] = useState<SearchFormData | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("price");
  const [filterStops, setFilterStops] = useState<number | null>(null);

  const handleSearch = async (data: SearchFormData) => {
    if (!data.origin || !data.destination || !data.departureDate) {
      toast.error("الرجاء تعبئة جميع الحقول المطلوبة");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setSearchData(data);

    try {
      const results = await searchFlights({
        originLocationCode: data.origin.code,
        destinationLocationCode: data.destination.code,
        departureDate: data.departureDate,
        returnDate: data.tripType === "roundTrip" ? data.returnDate : undefined,
        adults: data.passengers.adults,
        children: data.passengers.children,
        infants: data.passengers.infants,
        travelClass: data.cabinClass,
        currencyCode: "SAR",
        max: 30,
      });
      setFlights(results);
      if (results.length === 0) {
        toast.info("لا توجد رحلات متاحة لهذا المسار");
      } else {
        toast.success(`تم العثور على ${results.length} رحلة`);
      }
    } catch (error) {
      toast.error("حدث خطأ في البحث");
    }
    setIsSearching(false);
  };

  const handleSelectFlight = (flight: FlightOffer) => {
    setSelectedFlight(flight);
    setShowBooking(true);
  };

  const handleBookingComplete = (bookingId: string) => {
    setShowBooking(false);
    toast.success(`تم إنشاء الحجز بنجاح! رقم المعاملة: ${bookingId}`);
  };

  // Sort flights
  const sortedFlights = [...flights].sort((a, b) => {
    if (sortBy === "price") return parseFloat(a.price.total) - parseFloat(b.price.total);
    if (sortBy === "duration") {
      const dA = a.itineraries[0].duration;
      const dB = b.itineraries[0].duration;
      return dA.localeCompare(dB);
    }
    return new Date(a.itineraries[0].segments[0].departure.at).getTime() - 
           new Date(b.itineraries[0].segments[0].departure.at).getTime();
  });

  // Filter flights
  const filteredFlights = filterStops !== null
    ? sortedFlights.filter(f => f.itineraries[0].segments.length - 1 === filterStops)
    : sortedFlights;

  return (
    <PageLayout>
      {/* Header */}
      <section className="relative bg-gradient-to-br from-luxury-navy via-[#0a3d5c] to-luxury-navy pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-luxury-teal/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-luxury-gold/10 rounded-full blur-[120px]" />
        </div>
        
        <div className="container px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Plane className="w-5 h-5 text-luxury-gold" />
              <span className="text-white/80 text-sm font-medium">نظام الحجز العالمي - Amadeus GDS</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              احجز رحلتك <span className="text-luxury-gold">الآن</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              أسعار حقيقية ولحظية من أكثر من 500 شركة طيران حول العالم
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-6xl mx-auto">
            <FlightSearchForm onSearch={handleSearch} isSearching={isSearching} />
          </div>
        </div>
      </section>

      {/* Results */}
      {hasSearched && (
        <section className="py-12 bg-gray-50 min-h-[400px]">
          <div className="container px-4">
            {isSearching ? (
              <div className="text-center py-20">
                <Loader2 className="w-16 h-16 animate-spin text-luxury-teal mx-auto mb-4" />
                <p className="text-xl text-gray-600">جاري البحث عن أفضل الرحلات...</p>
                <p className="text-gray-400 mt-2">يتم الاتصال بـ Amadeus GDS</p>
              </div>
            ) : filteredFlights.length > 0 ? (
              <>
                {/* Filters & Sort */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">{filteredFlights.length} رحلة متاحة</h2>
                  <div className="flex items-center gap-4">
                    {/* Sort */}
                    <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow">
                      {[
                        { key: "price" as SortOption, label: "السعر" },
                        { key: "duration" as SortOption, label: "المدة" },
                        { key: "departure" as SortOption, label: "المغادرة" },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => setSortBy(opt.key)}
                          className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            sortBy === opt.key ? "bg-luxury-teal text-white" : "hover:bg-gray-100"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    
                    {/* Filter Stops */}
                    <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow">
                      {[
                        { value: null, label: "الكل" },
                        { value: 0, label: "مباشر" },
                        { value: 1, label: "1 توقف" },
                      ].map((opt) => (
                        <button
                          key={opt.value ?? "all"}
                          onClick={() => setFilterStops(opt.value)}
                          className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            filterStops === opt.value ? "bg-luxury-gold text-white" : "hover:bg-gray-100"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Flight Cards */}
                <div className="space-y-4">
                  {filteredFlights.map((flight) => (
                    <FlightResultCard key={flight.id} flight={flight} onSelect={handleSelectFlight} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">لا توجد رحلات متاحة</h3>
                <p className="text-gray-500">جرب تغيير التواريخ أو المسار</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features */}
      {!hasSearched && (
        <section className="py-16 bg-white">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">لماذا تحجز معنا؟</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                نربطك مباشرة بأنظمة الحجز العالمية لتحصل على أفضل الأسعار والخيارات
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: Zap, title: "أسعار لحظية", desc: "أسعار حقيقية من Amadeus", color: "from-blue-500 to-cyan-500" },
                { icon: Globe, title: "+500 شركة طيران", desc: "أكبر شبكة عالمية", color: "from-emerald-500 to-teal-500" },
                { icon: Shield, title: "حجز آمن", desc: "حماية كاملة لبياناتك", color: "from-orange-500 to-red-500" },
                { icon: Clock, title: "تأكيد فوري", desc: "تذكرتك خلال دقائق", color: "from-purple-500 to-pink-500" },
              ].map((item, idx) => (
                <div key={idx} className="text-center p-6 rounded-2xl hover:shadow-lg transition-all group">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br text-white", item.color)}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking Wizard Modal */}
      {showBooking && selectedFlight && searchData && (
        <BookingWizard
          flight={selectedFlight}
          passengers={searchData.passengers}
          onClose={() => setShowBooking(false)}
          onComplete={handleBookingComplete}
        />
      )}
    </PageLayout>
  );
};

export default AmadeusFlights;
