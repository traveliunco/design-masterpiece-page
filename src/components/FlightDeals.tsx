import { useState } from "react";
import { Plane, ArrowLeft, Calendar, TrendingDown, ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCheapestFlights, useSpecialOffers } from "@/hooks/useTravelpayouts";
import { generateFlightLink, IATA_CODES, FlightPrice } from "@/services/travelpayouts";

const FlightDeals = () => {
  const [origin, setOrigin] = useState("JED");
  
  const { data: flightsData, isLoading, error } = useCheapestFlights({
    origin,
    limit: 12,
    currency: "SAR",
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-SA", {
      day: "numeric",
      month: "short",
    });
  };

  const getDestinationName = (code: string) => {
    return IATA_CODES[code as keyof typeof IATA_CODES]?.name || code;
  };

  // Group flights by destination
  const groupedFlights = flightsData?.data?.reduce((acc, flight) => {
    if (!acc[flight.destination]) {
      acc[flight.destination] = flight;
    } else if (flight.price < acc[flight.destination].price) {
      acc[flight.destination] = flight;
    }
    return acc;
  }, {} as Record<string, FlightPrice>);

  const flights = groupedFlights ? Object.values(groupedFlights).slice(0, 8) : [];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <TrendingDown className="w-8 h-8 text-primary" />
              أفضل أسعار الطيران
            </h2>
            <p className="text-muted-foreground">
              اكتشف أرخص الرحلات من مدينتك
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">المغادرة من:</span>
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JED">جدة</SelectItem>
                <SelectItem value="RUH">الرياض</SelectItem>
                <SelectItem value="DMM">الدمام</SelectItem>
                <SelectItem value="MED">المدينة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="mr-3">جاري البحث عن أفضل الأسعار...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500">حدث خطأ أثناء جلب البيانات</p>
            <p className="text-sm text-muted-foreground mt-2">
              يرجى التحقق من اتصال الإنترنت والمحاولة مجدداً
            </p>
          </div>
        )}

        {/* Flights Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {flights.map((flight, index) => (
              <Card 
                key={`${flight.destination}-${index}`}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
                <CardContent className="p-4">
                  {/* Route */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="text-center">
                        <p className="font-bold">{IATA_CODES[origin as keyof typeof IATA_CODES]?.name}</p>
                        <p className="text-xs text-muted-foreground">{origin}</p>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <div className="w-8 h-px bg-border" />
                        <Plane className="w-4 h-4 rotate-[-90deg]" />
                        <div className="w-8 h-px bg-border" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold">{getDestinationName(flight.destination)}</p>
                        <p className="text-xs text-muted-foreground">{flight.destination}</p>
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(flight.departure_at)}</span>
                    {flight.return_at && (
                      <>
                        <ArrowLeft className="w-3 h-3" />
                        <span>{formatDate(flight.return_at)}</span>
                      </>
                    )}
                  </div>

                  {/* Airline */}
                  <p className="text-xs text-muted-foreground mb-3">
                    الناقل: {flight.airline}
                  </p>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">ابتداءً من</p>
                      <p className="text-xl font-bold text-primary">
                        {formatPrice(flight.price)}
                      </p>
                    </div>
                    <a
                      href={generateFlightLink(
                        origin,
                        flight.destination,
                        flight.departure_at,
                        flight.return_at
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" className="gap-1">
                        احجز الآن
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && flights.length === 0 && (
          <div className="text-center py-20">
            <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">لم يتم العثور على رحلات حالياً</p>
          </div>
        )}

        {/* View More */}
        {flights.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              عرض المزيد من العروض
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FlightDeals;
