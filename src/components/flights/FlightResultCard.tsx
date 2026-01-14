import { Plane, Clock, Luggage, Coffee, Wifi, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlightOffer, getAirlineInfo } from "@/services/amadeusService";
import { cn } from "@/lib/utils";

interface FlightResultCardProps {
  flight: FlightOffer;
  onSelect: (flight: FlightOffer) => void;
}

const FlightResultCard = ({ flight, onSelect }: FlightResultCardProps) => {
  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+)H(\d+)?M?/);
    if (match) return `${match[1]}س ${match[2] || "0"}د`;
    return duration;
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString("ar-SA", { weekday: "short", day: "numeric", month: "short" });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100">
      {flight.itineraries.map((itinerary, idx) => {
        const firstSeg = itinerary.segments[0];
        const lastSeg = itinerary.segments[itinerary.segments.length - 1];
        const airlineInfo = getAirlineInfo(firstSeg.carrierCode);
        
        return (
          <div key={idx} className={cn("flex flex-col md:flex-row md:items-center gap-6", idx > 0 && "mt-6 pt-6 border-t")}>
            {/* Airline */}
            <div className="md:w-32 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                {airlineInfo.logo ? (
                  <img src={airlineInfo.logo} alt={airlineInfo.name} className="w-10 h-10 object-contain" />
                ) : (
                  <Plane className="w-6 h-6 text-luxury-teal" />
                )}
              </div>
              <div>
                <div className="font-bold text-sm">{airlineInfo.nameAr}</div>
                <div className="text-xs text-gray-500">{firstSeg.carrierCode}{firstSeg.number}</div>
              </div>
            </div>

            {/* Flight Details */}
            <div className="flex-1 flex items-center justify-between gap-4">
              {/* Departure */}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{formatTime(firstSeg.departure.at)}</div>
                <div className="text-lg font-medium text-gray-600">{firstSeg.departure.iataCode}</div>
                <div className="text-xs text-gray-400">{formatDate(firstSeg.departure.at)}</div>
              </div>

              {/* Duration & Stops */}
              <div className="flex-1 text-center px-4">
                <div className="text-sm text-gray-500 mb-1">{formatDuration(itinerary.duration)}</div>
                <div className="relative flex items-center justify-center">
                  <div className="flex-1 h-px bg-gray-300" />
                  <div className="mx-2 w-3 h-3 rounded-full bg-luxury-teal" />
                  {itinerary.segments.length > 1 && (
                    <>
                      {itinerary.segments.slice(1).map((_, i) => (
                        <div key={i} className="mx-1 w-2 h-2 rounded-full bg-gray-400" />
                      ))}
                    </>
                  )}
                  <Plane className="mx-2 w-4 h-4 text-luxury-teal rotate-[-90deg]" />
                  <div className="flex-1 h-px bg-gray-300" />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {itinerary.segments.length === 1 ? (
                    <span className="text-green-600 font-medium">مباشر</span>
                  ) : (
                    <span>{itinerary.segments.length - 1} توقف</span>
                  )}
                </div>
              </div>

              {/* Arrival */}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{formatTime(lastSeg.arrival.at)}</div>
                <div className="text-lg font-medium text-gray-600">{lastSeg.arrival.iataCode}</div>
                <div className="text-xs text-gray-400">{formatDate(lastSeg.arrival.at)}</div>
              </div>
            </div>

            {/* Price & Book */}
            {idx === 0 && (
              <div className="md:w-48 text-center md:text-left">
                <div className="text-3xl font-bold text-luxury-teal">
                  {parseFloat(flight.price.total).toLocaleString()} <span className="text-sm">ر.س</span>
                </div>
                <div className="text-xs text-gray-500 mb-3">للشخص الواحد</div>
                <Button
                  onClick={() => onSelect(flight)}
                  className="w-full bg-luxury-gold hover:bg-yellow-600 text-white font-bold"
                >
                  احجز الآن
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </div>
            )}
          </div>
        );
      })}

      {/* Services */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
        {flight.travelerPricings[0]?.fareDetailsBySegment[0]?.includedCheckedBags && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Luggage className="w-4 h-4" />
            <span>
              {flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.weight 
                ? `${flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.weight} كج`
                : `${flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity} حقيبة`}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Coffee className="w-4 h-4" /><span>وجبة</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Wifi className="w-4 h-4" /><span>واي فاي</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mr-auto">
          <Clock className="w-4 h-4" />
          <span>آخر موعد حجز: {flight.lastTicketingDate}</span>
        </div>
      </div>
    </div>
  );
};

export default FlightResultCard;
