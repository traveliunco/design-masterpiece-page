/**
 * مكون البحث عن الرحلات - نمط Skyscanner
 * يدعم: رحلات طيران | فنادق | تأجير سيارات
 */

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  Building2,
  Car,
  ArrowLeftRight,
  ChevronDown,
  Search,
  Plus,
  Minus,
  X,
  MapPin,
  CalendarDays } from
"lucide-react";
import { cn } from "@/lib/utils";

// بيانات المطارات
const airports = [
{ code: "RUH", city: "الرياض", name: "مطار الملك خالد", country: "المملكة العربية السعودية" },
{ code: "JED", city: "جدة", name: "مطار الملك عبدالعزيز", country: "المملكة العربية السعودية" },
{ code: "DMM", city: "الدمام", name: "مطار الملك فهد", country: "المملكة العربية السعودية" },
{ code: "MED", city: "المدينة المنورة", name: "مطار الأمير محمد بن عبدالعزيز", country: "المملكة العربية السعودية" },
{ code: "AHB", city: "أبها", name: "مطار أبها الدولي", country: "المملكة العربية السعودية" },
{ code: "TIF", city: "الطائف", name: "مطار الطائف الدولي", country: "المملكة العربية السعودية" },
{ code: "DXB", city: "دبي", name: "مطار دبي الدولي", country: "الإمارات" },
{ code: "AUH", city: "أبوظبي", name: "مطار زايد الدولي", country: "الإمارات" },
{ code: "DOH", city: "الدوحة", name: "مطار حمد الدولي", country: "قطر" },
{ code: "KWI", city: "الكويت", name: "مطار الكويت الدولي", country: "الكويت" },
{ code: "BAH", city: "المنامة", name: "مطار البحرين الدولي", country: "البحرين" },
{ code: "MCT", city: "مسقط", name: "مطار مسقط الدولي", country: "عُمان" },
{ code: "CAI", city: "القاهرة", name: "مطار القاهرة الدولي", country: "مصر" },
{ code: "AMM", city: "عمّان", name: "مطار الملكة علياء الدولي", country: "الأردن" },
{ code: "BEY", city: "بيروت", name: "مطار رفيق الحريري", country: "لبنان" },
{ code: "IST", city: "إسطنبول", name: "مطار إسطنبول", country: "تركيا" },
{ code: "KUL", city: "كوالالمبور", name: "مطار كوالالمبور الدولي", country: "ماليزيا" },
{ code: "BKK", city: "بانكوك", name: "مطار سوفارنابومي", country: "تايلاند" },
{ code: "SIN", city: "سنغافورة", name: "مطار تشانغي", country: "سنغافورة" },
{ code: "CGK", city: "جاكرتا", name: "مطار سوكارنو هاتا", country: "إندونيسيا" },
{ code: "MLE", city: "ماليه", name: "مطار المالديف الدولي", country: "المالديف" },
{ code: "LHR", city: "لندن", name: "مطار هيثرو", country: "المملكة المتحدة" },
{ code: "CDG", city: "باريس", name: "مطار شارل ديغول", country: "فرنسا" },
{ code: "JFK", city: "نيويورك", name: "مطار جون كيندي الدولي", country: "الولايات المتحدة" }];


type TripType = "roundtrip" | "oneway" | "multicity";
type Tab = "flights" | "hotels" | "cars";

interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
}

interface SkyscannerSearchProps {
  variant?: "hero" | "page" | "mobile" | "banner";
  className?: string;
}

const SkyscannerSearch = ({ variant = "hero", className }: SkyscannerSearchProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("flights");
  const [tripType, setTripType] = useState<TripType>("roundtrip");
  const [origin, setOrigin] = useState<(typeof airports)[0] | null>(airports[0]);
  const [destination, setDestination] = useState<(typeof airports)[0] | null>(null);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState<PassengerCount>({ adults: 1, children: 0, infants: 0 });
  const [cabinClass, setCabinClass] = useState<"ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST">("ECONOMY");
  const [directOnly, setDirectOnly] = useState(false);
  const [addHotel, setAddHotel] = useState(false);

  // dropdowns visibility
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [showPassengers, setShowPassengers] = useState(false);
  const [originQuery, setOriginQuery] = useState("");
  const [destQuery, setDestQuery] = useState("");

  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);
  const passRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(e.target as Node)) setShowOriginDropdown(false);
      if (destRef.current && !destRef.current.contains(e.target as Node)) setShowDestDropdown(false);
      if (passRef.current && !passRef.current.contains(e.target as Node)) setShowPassengers(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredOrigins = airports.filter(
    (a) =>
    a.city.includes(originQuery) ||
    a.code.toLowerCase().includes(originQuery.toLowerCase()) ||
    a.country.includes(originQuery)
  );
  const filteredDests = airports.filter(
    (a) =>
    a.city.includes(destQuery) ||
    a.code.toLowerCase().includes(destQuery.toLowerCase()) ||
    a.country.includes(destQuery)
  );

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;
  const cabinLabels: Record<string, string> = {
    ECONOMY: "اقتصادية",
    PREMIUM_ECONOMY: "اقتصادية ممتازة",
    BUSINESS: "رجال الأعمال",
    FIRST: "الدرجة الأولى"
  };

  const swapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    setOriginQuery("");
    setDestQuery("");
  };

  const adjustPassenger = (key: keyof PassengerCount, delta: number) => {
    setPassengers((prev) => {
      const next = prev[key] + delta;
      if (key === "adults" && next < 1) return prev;
      if (next < 0) return prev;
      if (totalPassengers + delta > 9) return prev;
      return { ...prev, [key]: next };
    });
  };

  const handleSearch = () => {
    if (!origin || !destination) return;
    const params = new URLSearchParams({
      from: origin.code,
      to: destination.code,
      dep: departureDate,
      ret: tripType === "roundtrip" ? returnDate : "",
      adults: String(passengers.adults),
      children: String(passengers.children),
      infants: String(passengers.infants),
      class: cabinClass,
      direct: directOnly ? "1" : "0"
    });
    navigate(`/flights?${params.toString()}`);
  };

  const today = new Date().toISOString().split("T")[0];

  const isMobile = variant === "mobile";
  const isHero = variant === "hero";
  const isBanner = variant === "banner";

  const containerCls = cn(
    "rounded-2xl overflow-visible",
    isHero ?
    "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl" :
    isBanner ?
    "bg-white shadow-2xl" :
    isMobile ?
    "bg-white shadow-lg border border-gray-100" :
    "bg-white shadow-xl border border-gray-200",
    className
  );

  const textColor = isHero ? "text-white" : "text-gray-800";
  const mutedText = isHero ? "text-white/70" : "text-gray-500";
  const inputBg = isHero ?
  "bg-white/10 border-white/20 text-white placeholder-white/50 hover:bg-white/20 focus-within:bg-white/20" :
  "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 hover:bg-white hover:border-primary/50 focus-within:bg-white focus-within:border-primary";
  const tabActiveCls = isHero ?
  "bg-white/20 text-white border-white/30" :
  "bg-primary/10 text-primary border-primary/20";
  const tabInactiveCls = isHero ?
  "text-white/70 hover:bg-white/10 border-transparent" :
  "text-gray-600 hover:bg-gray-100 border-transparent";

  return (
    <div className={containerCls}>
      {/* Tabs: Flights / Hotels / Cars */}
      <div className={cn("p-3 border-b py-[10px] px-[10px] flex items-center justify-center gap-[9px]", isHero ? "border-white/10" : "border-gray-100")}>
        {([
        { id: "flights", icon: Plane, label: "رحلات طيران" },
        { id: "hotels", icon: Building2, label: "فنادق" },
        { id: "cars", icon: Car, label: "السيارات" }] as
        {id: Tab;icon: React.ElementType;label: string;}[]).map(({ id, icon: Icon, label }) =>
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200",
            activeTab === id ? tabActiveCls : tabInactiveCls
          )}>
          
            <Icon className="w-4 h-4" />
            <span className={isMobile ? "hidden xs:inline" : ""}>{label}</span>
          </button>
        )}
      </div>

      <div className={cn(isBanner ? "px-5 pt-3 pb-5" : "p-4 space-y-4")}>
        {/* Flight search body */}
        {activeTab === "flights" &&
        <>
            {/* Trip type + direct toggle */}
            <div className={cn("flex items-center gap-3 flex-wrap", isBanner ? "pb-3" : "")}>
              {([
            { value: "roundtrip", label: "ذهاب وإياب" },
            { value: "oneway", label: "ذهاب فقط" },
            { value: "multicity", label: "متعدد المدن" }] as
            {value: TripType;label: string;}[]).map(({ value, label }) =>
            <button
              key={value}
              onClick={() => setTripType(value)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all",
                tripType === value ?
                isHero ?
                "bg-teal-400/30 text-teal-300 border border-teal-400/50" :
                "bg-primary/10 text-primary border border-primary/30" :
                cn(mutedText, "hover:opacity-80")
              )}>
              
                  <span
                className={cn(
                  "w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center",
                  tripType === value ?
                  isHero ? "border-teal-300" : "border-primary" :
                  isHero ? "border-white/40" : "border-gray-400"
                )}>
                
                    {tripType === value &&
                <span className={cn("w-1.5 h-1.5 rounded-full block", isHero ? "bg-teal-300" : "bg-primary")} />
                }
                  </span>
                  {label}
                </button>
            )}

              {/* Direct flights toggle */}
              <label className={cn("flex items-center gap-2 text-sm cursor-pointer mr-auto", mutedText)}>
                <div
                onClick={() => setDirectOnly(!directOnly)}
                className={cn(
                  "w-10 h-5 rounded-full relative transition-colors cursor-pointer",
                  directOnly ?
                  isHero ? "bg-teal-400" : "bg-primary" :
                  isHero ? "bg-white/20" : "bg-gray-200"
                )}>
                
                  <span
                  className={cn(
                    "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200",
                    directOnly ? "right-0.5" : "left-0.5"
                  )} />
                
                </div>
                رحلات مباشرة فقط
              </label>
            </div>

            {/* ── BANNER LAYOUT: one-row horizontal Skyscanner style ─────── */}
            {isBanner ?
          <div className="flex items-stretch rounded-2xl border-2 border-gray-200 overflow-visible hover:border-primary/40 transition-colors">
                {/* Origin */}
                <div ref={originRef} className="relative flex-1 min-w-0">
                  <div
                className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors h-full"
                onClick={() => {setShowOriginDropdown(true);setShowDestDropdown(false);setShowPassengers(false);}}>
                
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 font-medium mb-0.5">المغادرة من</p>
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {origin ? <>{origin.city} <span className="font-normal text-gray-500">({origin.code})</span></> : <span className="text-gray-400 font-normal">مدينة أو مطار</span>}
                      </p>
                    </div>
                    {origin &&
                <button onClick={(e) => {e.stopPropagation();setOrigin(null);setOriginQuery("");}} className="text-gray-400 hover:text-gray-600 flex-shrink-0" aria-label="مسح المغادرة"><X className="w-4 h-4" /></button>
                }
                  </div>
                  {showOriginDropdown &&
              <AirportDropdown query={originQuery} setQuery={setOriginQuery} airports={filteredOrigins} onSelect={(a) => {setOrigin(a);setShowOriginDropdown(false);setOriginQuery("");}} isHero={false} exclude={destination?.code} />
              }
                </div>

                {/* Swap button */}
                <div className="flex items-center px-1 border-x border-gray-200 bg-white">
                  <button
                onClick={swapLocations}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 hover:rotate-180 transition-all duration-300 text-gray-500"
                aria-label="تبديل المطارات">
                
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Destination */}
                <div ref={destRef} className="relative flex-1 min-w-0">
                  <div
                className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors h-full"
                onClick={() => {setShowDestDropdown(true);setShowOriginDropdown(false);setShowPassengers(false);}}>
                
                    <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 font-medium mb-0.5">الوصول إلى</p>
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {destination ? <>{destination.city} <span className="font-normal text-gray-500">({destination.code})</span></> : <span className="text-gray-400 font-normal">مدينة أو مطار</span>}
                      </p>
                    </div>
                    {destination &&
                <button onClick={(e) => {e.stopPropagation();setDestination(null);setDestQuery("");}} className="text-gray-400 hover:text-gray-600 flex-shrink-0" aria-label="مسح الوجهة"><X className="w-4 h-4" /></button>
                }
                  </div>
                  {showDestDropdown &&
              <AirportDropdown query={destQuery} setQuery={setDestQuery} airports={filteredDests} onSelect={(a) => {setDestination(a);setShowDestDropdown(false);setDestQuery("");}} isHero={false} exclude={origin?.code} />
              }
                </div>

                {/* Departure date */}
                <div className="flex-1 min-w-0 border-x border-gray-200">
                  <div className="flex items-center gap-3 px-5 py-4 h-full">
                    <CalendarDays className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium mb-0.5">تاريخ الذهاب</p>
                      <input
                    type="date" value={departureDate} min={today}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-gray-800 outline-none cursor-pointer"
                    aria-label="تاريخ المغادرة" />
                  
                    </div>
                  </div>
                </div>

                {/* Return date (roundtrip only) */}
                {tripType === "roundtrip" &&
            <div className="flex-1 min-w-0 border-l border-gray-200">
                    <div className="flex items-center gap-3 px-5 py-4 h-full">
                      <CalendarDays className="w-5 h-5 text-teal-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-medium mb-0.5">تاريخ العودة</p>
                        <input
                    type="date" value={returnDate} min={departureDate || today}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-gray-800 outline-none cursor-pointer"
                    aria-label="تاريخ العودة" />
                  
                      </div>
                    </div>
                  </div>
            }

                {/* Passengers */}
                <div ref={passRef} className="relative border-x border-gray-200">
                  <button
                onClick={() => {setShowPassengers(!showPassengers);setShowOriginDropdown(false);setShowDestDropdown(false);}}
                className="flex items-center gap-2 px-5 py-4 h-full hover:bg-gray-50 transition-colors whitespace-nowrap">
                
                    <svg className="w-5 h-5 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">المسافرون</p>
                      <p className="text-sm font-bold text-gray-800">
                        {totalPassengers} {totalPassengers === 1 ? "بالغ" : "مسافرون"}
                        <span className="text-xs font-normal text-gray-500 mr-1">, {cabinLabels[cabinClass]}</span>
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </button>
                  {showPassengers &&
              <PassengersDropdown passengers={passengers} cabinClass={cabinClass} cabinLabels={cabinLabels} onAdjust={adjustPassenger} onCabinChange={setCabinClass} onClose={() => setShowPassengers(false)} isHero={false} />
              }
                </div>

                {/* Search button */}
                <button
              onClick={handleSearch}
              disabled={!origin || !destination}
              className={cn(
                "px-8 flex items-center gap-2 font-bold text-base transition-all rounded-l-none rounded-r-2xl",
                !origin || !destination ?
                "bg-gray-200 text-gray-400 cursor-not-allowed" :
                "bg-gradient-to-br from-primary via-teal-500 to-cyan-500 text-white hover:opacity-90 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
              )}>
              
                  <Search className="w-5 h-5" />
                  بحث
                </button>
              </div> : (

          /* ── STANDARD GRID LAYOUT (hero / mobile / page) ────────────── */
          <>
              <div className={cn(
              "grid gap-2",
              isMobile ? "grid-cols-1" : tripType === "roundtrip" ? "grid-cols-1 md:grid-cols-[1fr_auto_1fr_1fr_1fr]" : "grid-cols-1 md:grid-cols-[1fr_auto_1fr_1fr]"
            )}>
                {/* Origin */}
                <div ref={originRef} className="relative">
                  <div
                  className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all", inputBg)}
                  onClick={() => {setShowOriginDropdown(true);setShowDestDropdown(false);setShowPassengers(false);}}>
                  
                    <MapPin className={cn("w-4 h-4 flex-shrink-0", isHero ? "text-teal-300" : "text-primary")} />
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-xs font-medium mb-0.5", mutedText)}>نقطة المغادرة</p>
                      {origin ?
                    <p className={cn("text-sm font-semibold truncate", textColor)}>{origin.city} <span className={cn("text-xs font-normal", mutedText)}>({origin.code})</span></p> :

                    <p className={cn("text-sm", mutedText)}>من</p>
                    }
                    </div>
                    {origin &&
                  <button onClick={(e) => {e.stopPropagation();setOrigin(null);setOriginQuery("");}} className={cn("flex-shrink-0", mutedText)} aria-label="مسح المغادرة"><X className="w-3.5 h-3.5" /></button>
                  }
                  </div>
                  {showOriginDropdown &&
                <AirportDropdown query={originQuery} setQuery={setOriginQuery} airports={filteredOrigins} onSelect={(a) => {setOrigin(a);setShowOriginDropdown(false);setOriginQuery("");}} isHero={isHero} exclude={destination?.code} />
                }
                </div>

                {/* Swap */}
                <div className={cn("flex items-center justify-center", isMobile && "hidden")}>
                  <button
                  onClick={swapLocations}
                  className={cn("w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:scale-110 hover:rotate-180 duration-300", isHero ? "border-white/30 bg-white/10 text-white" : "border-gray-200 bg-white text-gray-600")}
                  aria-label="تبديل المطارات">
                  
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Destination */}
                <div ref={destRef} className="relative">
                  <div
                  className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all", inputBg)}
                  onClick={() => {setShowDestDropdown(true);setShowOriginDropdown(false);setShowPassengers(false);}}>
                  
                    <MapPin className={cn("w-4 h-4 flex-shrink-0", isHero ? "text-cyan-300" : "text-primary")} />
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-xs font-medium mb-0.5", mutedText)}>الوجهة</p>
                      {destination ?
                    <p className={cn("text-sm font-semibold truncate", textColor)}>{destination.city} <span className={cn("text-xs font-normal", mutedText)}>({destination.code})</span></p> :

                    <p className={cn("text-sm", mutedText)}>إلى</p>
                    }
                    </div>
                    {destination &&
                  <button onClick={(e) => {e.stopPropagation();setDestination(null);setDestQuery("");}} className={cn("flex-shrink-0", mutedText)} aria-label="مسح الوجهة"><X className="w-3.5 h-3.5" /></button>
                  }
                  </div>
                  {showDestDropdown &&
                <AirportDropdown query={destQuery} setQuery={setDestQuery} airports={filteredDests} onSelect={(a) => {setDestination(a);setShowDestDropdown(false);setDestQuery("");}} isHero={isHero} exclude={origin?.code} />
                }
                </div>

                {/* Departure date */}
                <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border transition-all", inputBg)}>
                  <CalendarDays className={cn("w-4 h-4 flex-shrink-0", isHero ? "text-teal-300" : "text-primary")} />
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-xs font-medium mb-0.5", mutedText)}>تاريخ المغادرة</p>
                    <input type="date" value={departureDate} min={today} onChange={(e) => setDepartureDate(e.target.value)} className={cn("w-full bg-transparent text-sm font-semibold outline-none", departureDate ? textColor : mutedText)} aria-label="تاريخ المغادرة" />
                  </div>
                </div>

                {/* Return date */}
                {tripType === "roundtrip" &&
              <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border transition-all", inputBg)}>
                    <CalendarDays className={cn("w-4 h-4 flex-shrink-0", isHero ? "text-cyan-300" : "text-primary")} />
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-xs font-medium mb-0.5", mutedText)}>رحلة العودة</p>
                      <input type="date" value={returnDate} min={departureDate || today} onChange={(e) => setReturnDate(e.target.value)} className={cn("w-full bg-transparent text-sm font-semibold outline-none", returnDate ? textColor : mutedText)} aria-label="تاريخ العودة" />
                    </div>
                  </div>
              }
              </div>

              {/* Passengers + Class + Add hotel row */}
              <div className="flex flex-wrap items-center gap-3">
                <div ref={passRef} className="relative">
                  <button
                  onClick={() => {setShowPassengers(!showPassengers);setShowOriginDropdown(false);setShowDestDropdown(false);}}
                  className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all", inputBg)}>
                  
                    <svg className={cn("w-4 h-4", isHero ? "text-teal-300" : "text-primary")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span className={cn("font-medium", textColor)}>
                      {totalPassengers} {totalPassengers === 1 ? "بالغ" : "مسافرون"}
                      {passengers.children > 0 && `, ${passengers.children} طفل`}
                      {passengers.infants > 0 && `, ${passengers.infants} رضيع`}
                    </span>
                    <span className={cn("text-xs", mutedText)}>, {cabinLabels[cabinClass]}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5", mutedText)} />
                  </button>
                  {showPassengers &&
                <PassengersDropdown passengers={passengers} cabinClass={cabinClass} cabinLabels={cabinLabels} onAdjust={adjustPassenger} onCabinChange={setCabinClass} onClose={() => setShowPassengers(false)} isHero={isHero} />
                }
                </div>

                <label className={cn("flex items-center gap-2 text-sm cursor-pointer", mutedText)}>
                  <input type="checkbox" checked={addHotel} onChange={(e) => setAddHotel(e.target.checked)} className="w-4 h-4 rounded accent-primary" />
                  <Building2 className="w-4 h-4" />
                  أضف فندقًا
                </label>

                <button
                onClick={handleSearch}
                disabled={!origin || !destination}
                className={cn(
                  "mr-auto flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg",
                  !origin || !destination ?
                  "opacity-50 cursor-not-allowed bg-gray-300 text-gray-500" :
                  "bg-gradient-to-r from-primary to-teal-500 hover:from-primary/90 hover:to-teal-400 text-white hover:shadow-primary/30 hover:scale-105 active:scale-95"
                )}>
                
                  <Search className="w-4 h-4" />
                  بحث
                </button>
              </div>
            </>)
          }
          </>
        }

        {/* Hotels tab */}
        {activeTab === "hotels" &&
        <HotelSearchForm isHero={isHero} isBanner={isBanner} textColor={textColor} mutedText={mutedText} inputBg={inputBg} navigate={navigate} today={today} />
        }

        {/* Cars tab */}
        {activeTab === "cars" &&
        <CarSearchForm isHero={isHero} isBanner={isBanner} textColor={textColor} mutedText={mutedText} inputBg={inputBg} navigate={navigate} today={today} />
        }
      </div>
    </div>);

};

// ─── Airport Dropdown ─────────────────────────────────────────────────────────
type AirportItem = {code: string;city: string;name: string;country: string;};

const AirportDropdown = ({
  query,
  setQuery,
  airports: airportList,
  onSelect,
  isHero,
  exclude







}: {query: string;setQuery: (q: string) => void;airports: AirportItem[];onSelect: (a: AirportItem) => void;isHero: boolean;exclude?: string;}) => {
  const list = airportList;

  return (
    <div className={cn(
      "absolute top-full mt-2 left-0 z-50 w-72 rounded-xl shadow-2xl overflow-hidden border",
      isHero ? "bg-gray-900/95 backdrop-blur-xl border-white/20" : "bg-white border-gray-200"
    )}>
      <div className={cn("p-3 border-b", isHero ? "border-white/10" : "border-gray-100")}>
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن مدينة أو مطار..."
          aria-label="ابحث عن مدينة أو مطار"
          className={cn(
            "w-full text-sm px-3 py-2 rounded-lg outline-none",
            isHero ? "bg-white/10 text-white placeholder-white/50 border border-white/20" : "bg-gray-100 text-gray-800 placeholder-gray-400"
          )} />
        
      </div>
      <div className="max-h-56 overflow-y-auto">
        {list.filter((a) => a.code !== exclude).slice(0, 8).map((airport) =>
        <button
          key={airport.code}
          aria-label={`اختر ${airport.city} (${airport.code})`}
          onClick={() => onSelect(airport)}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 text-right transition-colors",
            isHero ? "hover:bg-white/10 text-white" : "hover:bg-gray-50 text-gray-800"
          )}>
          
            <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0",
            isHero ? "bg-teal-500/20 text-teal-300" : "bg-primary/10 text-primary"
          )}>
              {airport.code}
            </div>
            <div className="flex-1 min-w-0 text-right">
              <p className="font-medium text-sm truncate">{airport.city}</p>
              <p className={cn("text-xs truncate", isHero ? "text-white/60" : "text-gray-500")}>{airport.name}</p>
            </div>
            <span className={cn("text-xs flex-shrink-0", isHero ? "text-white/40" : "text-gray-400")}>{airport.country}</span>
          </button>
        )}
        {list.filter((a) => a.code !== exclude).length === 0 &&
        <p className={cn("text-center py-4 text-sm", isHero ? "text-white/60" : "text-gray-500")}>
            لا توجد نتائج
          </p>
        }
      </div>
    </div>);

};

// ─── Passengers Dropdown ──────────────────────────────────────────────────────
const PassengersDropdown = ({
  passengers,
  cabinClass,
  cabinLabels,
  onAdjust,
  onCabinChange,
  onClose,
  isHero








}: {passengers: PassengerCount;cabinClass: string;cabinLabels: Record<string, string>;onAdjust: (key: keyof PassengerCount, delta: number) => void;onCabinChange: (c: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST") => void;onClose: () => void;isHero: boolean;}) => {
  const rows: {key: keyof PassengerCount;label: string;sub: string;}[] = [
  { key: "adults", label: "بالغون", sub: "12 سنة وما فوق" },
  { key: "children", label: "أطفال", sub: "2-11 سنة" },
  { key: "infants", label: "رضّع", sub: "أقل من سنتين" }];


  return (
    <div className={cn(
      "absolute top-full mt-2 left-0 z-50 w-72 rounded-xl shadow-2xl border",
      isHero ? "bg-gray-900/95 backdrop-blur-xl border-white/20" : "bg-white border-gray-200"
    )}>
      <div className="p-4 space-y-4">
        {rows.map(({ key, label, sub }) =>
        <div key={key} className="flex items-center justify-between">
            <div>
              <p className={cn("text-sm font-medium", isHero ? "text-white" : "text-gray-800")}>{label}</p>
              <p className={cn("text-xs", isHero ? "text-white/50" : "text-gray-500")}>{sub}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
              onClick={() => onAdjust(key, -1)}
              className={cn(
                "w-8 h-8 rounded-full border flex items-center justify-center transition-colors",
                isHero ? "border-white/20 text-white hover:bg-white/10" : "border-gray-200 text-gray-600 hover:bg-gray-100"
              )}
              aria-label={`تقليل ${label}`}>
              
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className={cn("w-5 text-center text-sm font-bold", isHero ? "text-white" : "text-gray-800")}>
                {passengers[key]}
              </span>
              <button
              onClick={() => onAdjust(key, 1)}
              className={cn(
                "w-8 h-8 rounded-full border flex items-center justify-center transition-colors",
                isHero ? "border-white/20 text-white hover:bg-white/10" : "border-gray-200 text-gray-600 hover:bg-gray-100"
              )}
              aria-label={`زيادة ${label}`}>
              
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <div className={cn("border-t pt-4", isHero ? "border-white/10" : "border-gray-100")}>
          <p className={cn("text-xs font-medium mb-2", isHero ? "text-white/70" : "text-gray-600")}>درجة المقصورة</p>
          <div className="grid grid-cols-2 gap-2">
            {(["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"] as const).map((c) =>
            <button
              key={c}
              onClick={() => onCabinChange(c)}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                cabinClass === c ?
                isHero ?
                "bg-teal-500/30 border-teal-400 text-teal-300" :
                "bg-primary/10 border-primary text-primary" :
                isHero ?
                "border-white/20 text-white/60 hover:bg-white/10" :
                "border-gray-200 text-gray-600 hover:bg-gray-50"
              )}>
              
                {cabinLabels[c]}
              </button>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-teal-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          
          تم
        </button>
      </div>
    </div>);

};

// ─── Hotel Search Form ────────────────────────────────────────────────────────
const HotelSearchForm = ({
  isHero, isBanner, textColor, mutedText, inputBg, navigate, today
}: {isHero: boolean;isBanner?: boolean;textColor: string;mutedText: string;inputBg: string;navigate: ReturnType<typeof useNavigate>;today: string;}) => {
  const [dest, setDest] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);

  return (
    <div className="grid gap-3 grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr]">
      <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border transition-all", inputBg)}>
        <Building2 className={cn("w-4 h-4 flex-shrink-0", isHero ? "text-teal-300" : "text-primary")} />
        <div className="flex-1">
          <p className={cn("text-xs font-medium mb-0.5", mutedText)}>الوجهة</p>
          <input
            type="text"
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            placeholder="مدينة أو فندق..."
            aria-label="وجهة الفندق"
            className={cn("w-full bg-transparent text-sm font-semibold outline-none", dest ? textColor : mutedText)} />
          
        </div>
      </div>
      <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border transition-all", inputBg)}>
        <CalendarDays className={cn("w-4 h-4", isHero ? "text-teal-300" : "text-primary")} />
        <div className="flex-1">
          <p className={cn("text-xs font-medium mb-0.5", mutedText)}>تسجيل الدخول</p>
          <input type="date" min={today} value={checkIn} aria-label="تاريخ تسجيل الدخول" onChange={(e) => setCheckIn(e.target.value)} className={cn("w-full bg-transparent text-sm font-semibold outline-none", checkIn ? textColor : mutedText)} />
        </div>
      </div>
      <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border transition-all", inputBg)}>
        <CalendarDays className={cn("w-4 h-4", isHero ? "text-cyan-300" : "text-primary")} />
        <div className="flex-1">
          <p className={cn("text-xs font-medium mb-0.5", mutedText)}>تسجيل الخروج</p>
          <input type="date" min={checkIn || today} value={checkOut} aria-label="تاريخ تسجيل الخروج" onChange={(e) => setCheckOut(e.target.value)} className={cn("w-full bg-transparent text-sm font-semibold outline-none", checkOut ? textColor : mutedText)} />
        </div>
      </div>
      <div className="flex gap-2">
        <div className={cn("flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border transition-all", inputBg)}>
          <div className="flex-1">
            <p className={cn("text-xs font-medium mb-0.5", mutedText)}>غرف/ضيوف</p>
            <p className={cn("text-sm font-semibold", textColor)}>{rooms} غرفة, {guests} ضيف</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/hotels?dest=${encodeURIComponent(dest)}&in=${checkIn}&out=${checkOut}&rooms=${rooms}&guests=${guests}`)}
          disabled={!dest}
          aria-label="بحث عن فنادق"
          title="بحث"
          className={cn(
            "px-5 rounded-xl font-semibold text-sm transition-all",
            !dest ? "opacity-50 bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-primary to-teal-500 text-white hover:opacity-90"
          )}>
          
          <Search className="w-4 h-4" />
        </button>
      </div>
    </div>);

};

// ─── Car Search Form ──────────────────────────────────────────────────────────
const CarSearchForm = ({
  isHero, isBanner, textColor, mutedText, inputBg, navigate, today
}: {isHero: boolean;isBanner?: boolean;textColor: string;mutedText: string;inputBg: string;navigate: ReturnType<typeof useNavigate>;today: string;}) => {
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturn] = useState("");

  return (
    <div className="grid gap-3 grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto]">
      <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border transition-all", inputBg)}>
        <MapPin className={cn("w-4 h-4", isHero ? "text-teal-300" : "text-primary")} />
        <div className="flex-1">
          <p className={cn("text-xs font-medium mb-0.5", mutedText)}>موقع الاستلام</p>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="المدينة أو المطار..."
            className={cn("w-full bg-transparent text-sm font-semibold outline-none", location ? textColor : mutedText)} />
          
        </div>
      </div>
      <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border transition-all", inputBg)}>
        <CalendarDays className={cn("w-4 h-4", isHero ? "text-teal-300" : "text-primary")} />
        <div className="flex-1">
          <p className={cn("text-xs font-medium mb-0.5", mutedText)}>تاريخ الاستلام</p>
          <input type="date" min={today} value={pickupDate} aria-label="تاريخ استلام السيارة" onChange={(e) => setPickupDate(e.target.value)} className={cn("w-full bg-transparent text-sm font-semibold outline-none", pickupDate ? textColor : mutedText)} />
        </div>
      </div>
      <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border transition-all", inputBg)}>
        <CalendarDays className={cn("w-4 h-4", isHero ? "text-cyan-300" : "text-primary")} />
        <div className="flex-1">
          <p className={cn("text-xs font-medium mb-0.5", mutedText)}>تاريخ الإعادة</p>
          <input type="date" min={pickupDate || today} value={returnDate} aria-label="تاريخ إعادة السيارة" onChange={(e) => setReturn(e.target.value)} className={cn("w-full bg-transparent text-sm font-semibold outline-none", returnDate ? textColor : mutedText)} />
        </div>
      </div>
      <button
        onClick={() => navigate(`/car-rental?loc=${encodeURIComponent(location)}&pickup=${pickupDate}&return=${returnDate}`)}
        disabled={!location}
        className={cn(
          "px-6 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all",
          !location ? "opacity-50 bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-primary to-teal-500 text-white hover:opacity-90"
        )}>
        
        <Search className="w-4 h-4" />
        <span>بحث</span>
      </button>
    </div>);

};

export default SkyscannerSearch;