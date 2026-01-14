import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Plane, Search, Calendar, Users, ChevronDown, ArrowLeftRight, 
  PlaneTakeoff, PlaneLanding, X, Loader2, MapPin, Star, TrendingUp, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { searchLocations, Location } from "@/services/amadeusService";

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface SearchFormData {
  tripType: "roundTrip" | "oneWay";
  cabinClass: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  origin: Airport | null;
  destination: Airport | null;
  departureDate: string;
  returnDate: string;
  passengers: { adults: number; children: number; infants: number };
  directOnly: boolean;
}

interface Props {
  onSearch: (data: SearchFormData) => void;
  isSearching?: boolean;
}

const popularDestinations = [
  { code: "DXB", city: "دبي", country: "الإمارات", trending: true },
  { code: "IST", city: "إسطنبول", country: "تركيا", trending: true },
  { code: "KUL", city: "كوالالمبور", country: "ماليزيا" },
  { code: "BKK", city: "بانكوك", country: "تايلاند" },
  { code: "CAI", city: "القاهرة", country: "مصر" },
  { code: "LHR", city: "لندن", country: "بريطانيا" },
];

const popularAirports: Airport[] = [
  { code: "RUH", name: "مطار الملك خالد الدولي", city: "الرياض", country: "السعودية" },
  { code: "JED", name: "مطار الملك عبدالعزيز الدولي", city: "جدة", country: "السعودية" },
  { code: "DMM", name: "مطار الملك فهد الدولي", city: "الدمام", country: "السعودية" },
  { code: "DXB", name: "مطار دبي الدولي", city: "دبي", country: "الإمارات" },
  { code: "IST", name: "مطار إسطنبول", city: "إسطنبول", country: "تركيا" },
  { code: "KUL", name: "مطار كوالالمبور الدولي", city: "كوالالمبور", country: "ماليزيا" },
  { code: "BKK", name: "مطار سوفارنابومي", city: "بانكوك", country: "تايلاند" },
  { code: "CAI", name: "مطار القاهرة الدولي", city: "القاهرة", country: "مصر" },
];

const TiketStyleSearch = ({ onSearch, isSearching = false }: Props) => {
  const [tripType, setTripType] = useState<"roundTrip" | "oneWay">("roundTrip");
  const [cabinClass, setCabinClass] = useState<SearchFormData["cabinClass"]>("ECONOMY");
  const [origin, setOrigin] = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
  const [directOnly, setDirectOnly] = useState(false);
  
  const [activeField, setActiveField] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [airports, setAirports] = useState<Airport[]>(popularAirports);
  const [isLoadingAirports, setIsLoadingAirports] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const classOptions = [
    { value: "ECONOMY", label: "Economy", labelAr: "اقتصادية" },
    { value: "PREMIUM_ECONOMY", label: "Premium Economy", labelAr: "اقتصادية مميزة" },
    { value: "BUSINESS", label: "Business", labelAr: "رجال الأعمال" },
    { value: "FIRST", label: "First Class", labelAr: "الدرجة الأولى" },
  ];

  const handleAirportSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setAirports(popularAirports);
      return;
    }
    setIsLoadingAirports(true);
    try {
      const results = await searchLocations(query);
      const mapped = results.map((loc: Location) => ({
        code: loc.iataCode,
        name: loc.name,
        city: loc.address?.cityName || loc.name,
        country: loc.address?.countryName || "",
      }));
      setAirports(mapped.length > 0 ? mapped : popularAirports);
    } catch {
      setAirports(popularAirports);
    }
    setIsLoadingAirports(false);
  }, []);

  const swapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const today = new Date().toISOString().split('T')[0];
  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveField(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if ((activeField === "origin" || activeField === "destination") && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [activeField]);

  const handleSubmit = () => {
    onSearch({ tripType, cabinClass, origin, destination, departureDate, returnDate, passengers, directOnly });
  };

  const selectPopularDestination = (code: string) => {
    const airport = popularAirports.find(a => a.code === code) || { code, name: code, city: code, country: "" };
    if (activeField === "origin") setOrigin(airport);
    else setDestination(airport);
    setActiveField(null);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Main Search Card - Tiket Style */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Trip Type Tabs - Tiket Style */}
        <div className="flex border-b">
          {[
            { type: "roundTrip" as const, label: "ذهاب وعودة", icon: "↔" },
            { type: "oneWay" as const, label: "ذهاب فقط", icon: "→" },
          ].map((item) => (
            <button
              key={item.type}
              onClick={() => setTripType(item.type)}
              className={cn(
                "flex-1 py-4 px-6 font-semibold text-sm transition-all relative",
                tripType === item.type
                  ? "text-[#0064D2] bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <span className="flex items-center justify-center gap-2">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </span>
              {tripType === item.type && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0064D2]" />
              )}
            </button>
          ))}
        </div>

        {/* Search Fields - Tiket Style */}
        <div className="p-5">
          <div className="flex flex-col lg:flex-row gap-3">
            
            {/* From Field */}
            <div className="flex-1 relative">
              <div 
                onClick={() => { setActiveField("origin"); setSearchQuery(""); setAirports(popularAirports); }}
                className={cn(
                  "border-2 rounded-xl p-4 cursor-pointer transition-all",
                  activeField === "origin" ? "border-[#0064D2] bg-blue-50" : "border-gray-200 hover:border-[#0064D2]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <PlaneTakeoff className="w-5 h-5 text-[#0064D2]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 font-medium">From</div>
                    {origin ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-800">{origin.city}</span>
                        <span className="text-sm text-[#0064D2] font-semibold">{origin.code}</span>
                      </div>
                    ) : (
                      <div className="text-gray-400">اختر مدينة المغادرة</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex items-center justify-center lg:-mx-4 z-10">
              <button
                onClick={swapAirports}
                className="w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-[#0064D2] hover:bg-blue-50 transition-all shadow-sm"
              >
                <ArrowLeftRight className="w-4 h-4 text-[#0064D2]" />
              </button>
            </div>

            {/* To Field */}
            <div className="flex-1 relative">
              <div 
                onClick={() => { setActiveField("destination"); setSearchQuery(""); setAirports(popularAirports); }}
                className={cn(
                  "border-2 rounded-xl p-4 cursor-pointer transition-all",
                  activeField === "destination" ? "border-[#0064D2] bg-blue-50" : "border-gray-200 hover:border-[#0064D2]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <PlaneLanding className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 font-medium">To</div>
                    {destination ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-800">{destination.city}</span>
                        <span className="text-sm text-[#0064D2] font-semibold">{destination.code}</span>
                      </div>
                    ) : (
                      <div className="text-gray-400 flex items-center gap-1">
                        <span>إلى أين تريد الذهاب؟</span>
                        <span className="text-xs">✨</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Departure Date */}
            <div className="flex-1">
              <div 
                onClick={() => setActiveField("departure")}
                className={cn(
                  "border-2 rounded-xl p-4 cursor-pointer transition-all",
                  activeField === "departure" ? "border-[#0064D2] bg-blue-50" : "border-gray-200 hover:border-[#0064D2]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 font-medium">Departure</div>
                    <input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      min={today}
                      className="w-full bg-transparent text-lg font-bold text-gray-800 border-none focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>
                {!departureDate && (
                  <div className="mt-1 text-xs text-green-600 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>Better deals available!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Return Date (if round trip) */}
            {tripType === "roundTrip" && (
              <div className="flex-1">
                <div 
                  onClick={() => setActiveField("return")}
                  className={cn(
                    "border-2 rounded-xl p-4 cursor-pointer transition-all",
                    activeField === "return" ? "border-[#0064D2] bg-blue-50" : "border-gray-200 hover:border-[#0064D2]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 font-medium">Return</div>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        min={departureDate || today}
                        className="w-full bg-transparent text-lg font-bold text-gray-800 border-none focus:outline-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Passengers & Class */}
            <div className="flex-1 relative">
              <div 
                onClick={() => setActiveField(activeField === "passengers" ? null : "passengers")}
                className={cn(
                  "border-2 rounded-xl p-4 cursor-pointer transition-all h-full",
                  activeField === "passengers" ? "border-[#0064D2] bg-blue-50" : "border-gray-200 hover:border-[#0064D2]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 font-medium">Passengers & Class</div>
                    <div className="text-lg font-bold text-gray-800">
                      {totalPassengers} Pax, {classOptions.find(c => c.value === cabinClass)?.label}
                    </div>
                  </div>
                  <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", activeField === "passengers" && "rotate-180")} />
                </div>
              </div>

              {/* Passengers Dropdown */}
              {activeField === "passengers" && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border z-50 p-4 animate-in fade-in slide-in-from-top-2">
                  <h4 className="font-bold text-gray-800 mb-4">Passengers</h4>
                  
                  {[
                    { key: "adults", label: "Adults", desc: "12 years and above", min: 1, max: 9 },
                    { key: "children", label: "Children", desc: "2-11 years", min: 0, max: 8 },
                    { key: "infants", label: "Infants", desc: "Below 2 years", min: 0, max: 4 },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <div className="font-semibold text-gray-800">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.desc}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setPassengers(p => ({ ...p, [item.key]: Math.max(item.min, p[item.key as keyof typeof p] - 1) }))}
                          disabled={passengers[item.key as keyof typeof passengers] <= item.min}
                          className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#0064D2] hover:text-[#0064D2] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-gray-800">
                          {passengers[item.key as keyof typeof passengers]}
                        </span>
                        <button
                          onClick={() => setPassengers(p => ({ ...p, [item.key]: Math.min(item.max, p[item.key as keyof typeof p] + 1) }))}
                          className="w-8 h-8 rounded-full border-2 border-[#0064D2] bg-[#0064D2] text-white flex items-center justify-center hover:bg-blue-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}

                  <h4 className="font-bold text-gray-800 mt-4 mb-3">Cabin Class</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {classOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setCabinClass(opt.value as any)}
                        className={cn(
                          "px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all text-right",
                          cabinClass === opt.value
                            ? "border-[#0064D2] bg-blue-50 text-[#0064D2]"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        {opt.labelAr}
                      </button>
                    ))}
                  </div>

                  <Button 
                    onClick={() => setActiveField(null)} 
                    className="w-full mt-4 bg-[#0064D2] hover:bg-blue-700"
                  >
                    Done
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Direct Flights & Search Button */}
          <div className="flex items-center justify-between mt-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                directOnly ? "bg-[#0064D2] border-[#0064D2]" : "border-gray-300"
              )}>
                {directOnly && <Check className="w-3 h-3 text-white" />}
              </div>
              <input
                type="checkbox"
                checked={directOnly}
                onChange={(e) => setDirectOnly(e.target.checked)}
                className="sr-only"
              />
              <span className="text-sm font-medium text-gray-700">Direct flights only</span>
            </label>

            <Button
              onClick={handleSubmit}
              disabled={isSearching || !origin || !destination || !departureDate}
              className="h-12 px-8 bg-[#FF5E1F] hover:bg-[#E54E10] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Searching...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Let's Search
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Airport Selection Modal */}
      {(activeField === "origin" || activeField === "destination") && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl animate-in zoom-in-95">
            {/* Header */}
            <div className="p-5 border-b bg-gradient-to-r from-[#0064D2] to-[#0052A3]">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h3 className="text-xl font-bold">
                    {activeField === "origin" ? "Where are you flying from?" : "Where are you going?"}
                  </h3>
                </div>
                <button onClick={() => setActiveField(null)} className="p-2 hover:bg-white/20 rounded-full text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Search Input */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search city or airport..."
                  value={searchQuery}
                  onChange={(e) => handleAirportSearch(e.target.value)}
                  className="w-full h-12 pr-12 pl-4 rounded-xl border-2 border-gray-200 focus:border-[#0064D2] focus:ring-2 focus:ring-blue-100 transition-all"
                  autoFocus
                />
                {isLoadingAirports && (
                  <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0064D2] animate-spin" />
                )}
              </div>
            </div>

            {/* Popular Destinations - Tiket Style Chips */}
            {!searchQuery && (
              <div className="p-4 border-b bg-gray-50">
                <div className="text-xs font-bold text-gray-500 uppercase mb-3">Popular Destinations</div>
                <div className="flex flex-wrap gap-2">
                  {popularDestinations.map((dest) => (
                    <button
                      key={dest.code}
                      onClick={() => selectPopularDestination(dest.code)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                        dest.trending
                          ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      )}
                    >
                      {dest.trending && <TrendingUp className="w-3 h-3" />}
                      <span>{dest.city}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Airport List */}
            <div className="overflow-y-auto max-h-[40vh]">
              {airports.map((airport, idx) => (
                <button
                  key={`${airport.code}-${idx}`}
                  onClick={() => {
                    if (activeField === "origin") setOrigin(airport);
                    else setDestination(airport);
                    setActiveField(null);
                  }}
                  className="w-full p-4 hover:bg-blue-50 text-right flex items-center gap-4 transition-all border-b"
                >
                  <div className="w-12 h-12 bg-[#0064D2] rounded-xl flex items-center justify-center text-white font-bold">
                    {airport.code}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800">{airport.city}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {airport.name}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">{airport.country}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TiketStyleSearch;
