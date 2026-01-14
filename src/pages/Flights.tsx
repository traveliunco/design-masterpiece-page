/**
 * صفحة رحلات الطيران
 * مُحدّثة للتكامل مع Amadeus API
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plane, Search, Calendar, Clock, Loader2, Filter, Sparkles } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FlightSearchWidget from "@/components/FlightSearchWidget";
import { supabase } from "@/integrations/supabase/client";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";

interface Airport {
  id: string;
  name_ar: string;
  iata_code: string;
  city_ar: string;
}

interface FlightOffer {
  id: string;
  departure_date: string;
  return_date?: string;
  departure_time?: string;
  arrival_time?: string;
  flight_number?: string;
  flight_class: string;
  is_direct: boolean;
  duration_minutes?: number;
  price_adult: number;
  original_price?: number;
  available_seats: number;
  baggage_allowance?: string;
  meal_included: boolean;
  is_featured: boolean;
  origin_airport?: Airport;
  destination_airport?: Airport;
  airline?: { id: string; name_ar: string; iata_code: string; logo_url?: string };
}

const Flights = () => {
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({ origin: "", destination: "", date: "", passengers: "1", class: "economy" });

  useSEO({
    title: "حجز تذاكر الطيران - أفضل الأسعار",
    description: "احجز تذاكر طيران بأفضل الأسعار مع ترافليون. رحلات إلى ماليزيا، تايلاند، تركيا وجميع أنحاء العالم.",
    keywords: "تذاكر طيران, حجز طيران, رحلات جوية, أسعار الطيران",
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: flightsData } = await supabase
        .from("flight_offers")
        .select(`*, origin_airport:airports!origin_airport_id(id, name_ar, iata_code, city_ar), destination_airport:airports!destination_airport_id(id, name_ar, iata_code, city_ar), airline:airlines!airline_id(id, name_ar, iata_code, logo_url)`)
        .eq("is_active", true).order("departure_date", { ascending: true }).limit(20);
      const { data: airportsData } = await supabase.from("airports").select("id, name_ar, iata_code, city_ar").eq("is_active", true).order("city_ar");
      if (flightsData) setFlights(flightsData);
      if (airportsData) setAirports(airportsData);
    } catch (error) { console.error("Error loading data:", error); }
    finally { setLoading(false); }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR", minimumFractionDigits: 0 }).format(price);
  const formatDuration = (minutes?: number) => { if (!minutes) return "-"; const hours = Math.floor(minutes / 60); const mins = minutes % 60; return `${hours}س ${mins}د`; };
  const getClassLabel = (flightClass: string) => ({ economy: "السياحية", business: "رجال الأعمال", first: "الأولى" }[flightClass] || flightClass);

  return (
    <PageLayout>
      <PageHeader
        badge="رحلات إلى جميع أنحاء العالم"
        badgeIcon={<Plane className="w-4 h-4 text-luxury-gold" />}
        title="احجز رحلتك بأفضل الأسعار"
        subtitle="رحلات طيران إلى جميع أنحاء العالم مع أفضل شركات الطيران"
      />

      {/* Search Form */}
      <section className="py-8 -mt-10 relative z-20">
        <div className="container px-4">
          <div className="glass-premium rounded-3xl p-6 shadow-luxury">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label className="text-luxury-navy font-semibold">من</Label>
                <Select value={searchParams.origin} onValueChange={(v) => setSearchParams({ ...searchParams, origin: v })}>
                  <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="مدينة المغادرة" /></SelectTrigger>
                  <SelectContent>{airports.map((a) => <SelectItem key={a.id} value={a.id}>{a.iata_code} - {a.city_ar}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-luxury-navy font-semibold">إلى</Label>
                <Select value={searchParams.destination} onValueChange={(v) => setSearchParams({ ...searchParams, destination: v })}>
                  <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="مدينة الوصول" /></SelectTrigger>
                  <SelectContent>{airports.map((a) => <SelectItem key={a.id} value={a.id}>{a.iata_code} - {a.city_ar}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-luxury-navy font-semibold">التاريخ</Label>
                <Input type="date" value={searchParams.date} onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-luxury-navy font-semibold">المسافرين</Label>
                <Select value={searchParams.passengers} onValueChange={(v) => setSearchParams({ ...searchParams, passengers: v })}>
                  <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{[1,2,3,4,5,6,7,8].map((n) => <SelectItem key={n} value={n.toString()}>{n} مسافر</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full h-12 btn-luxury gap-2"><Search className="w-4 h-4" />بحث</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amadeus API Search */}
      <section className="py-16 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-luxury-gold/10 text-luxury-gold px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" /><span className="text-sm font-medium">مدعوم بـ Amadeus API</span>
            </div>
            <h2 className="text-section text-luxury-navy mb-2">بحث مباشر عن الرحلات</h2>
            <p className="text-muted-foreground">أسعار حقيقية ولحظية من شركات الطيران العالمية</p>
          </div>
          <FlightSearchWidget onSelectFlight={(flight) => console.log('Selected flight:', flight)} />
        </div>
      </section>

      {/* Flights List */}
      <section className="py-16 bg-luxury-cream/20">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-luxury-navy">الرحلات المتاحة</h2>
            <Button variant="outline" className="gap-2"><Filter className="w-4 h-4" />تصفية</Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-luxury-teal" /></div>
          ) : flights.length === 0 ? (
            <div className="card-3d py-20 text-center">
              <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-luxury-navy mb-2">لا توجد رحلات متاحة حالياً</h3>
              <p className="text-muted-foreground mb-4">يرجى التواصل معنا لحجز رحلتك</p>
              <Link to="/contact"><Button className="btn-luxury">تواصل معنا</Button></Link>
            </div>
          ) : (
            <div className="space-y-4">
              {flights.map((flight) => (
                <div key={flight.id} className="card-3d overflow-hidden hover:shadow-luxury transition-all">
                  <div className="flex flex-col lg:flex-row">
                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-luxury-teal/10 rounded-full flex items-center justify-center"><Plane className="w-5 h-5 text-luxury-teal" /></div>
                          <div><p className="font-medium text-luxury-navy">{flight.airline?.name_ar || "شركة الطيران"}</p><p className="text-xs text-muted-foreground">{flight.flight_number}</p></div>
                        </div>
                        <div className="flex gap-2">
                          {flight.is_featured && <Badge className="bg-luxury-gold text-luxury-navy">عرض مميز</Badge>}
                          {flight.is_direct && <Badge variant="outline">مباشر</Badge>}
                          <Badge variant="secondary">{getClassLabel(flight.flight_class)}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-center"><p className="text-2xl font-bold text-luxury-navy">{flight.departure_time || "--:--"}</p><p className="font-medium">{flight.origin_airport?.iata_code}</p><p className="text-sm text-muted-foreground">{flight.origin_airport?.city_ar}</p></div>
                        <div className="flex-1 mx-6">
                          <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <div className="h-px bg-border flex-1" /><div className="text-center"><Clock className="w-4 h-4 mx-auto mb-1" /><p className="text-xs">{formatDuration(flight.duration_minutes)}</p></div><div className="h-px bg-border flex-1" />
                          </div>
                        </div>
                        <div className="text-center"><p className="text-2xl font-bold text-luxury-navy">{flight.arrival_time || "--:--"}</p><p className="font-medium">{flight.destination_airport?.iata_code}</p><p className="text-sm text-muted-foreground">{flight.destination_airport?.city_ar}</p></div>
                      </div>
                      <div className="flex items-center gap-6 mt-4 pt-4 border-t text-sm text-muted-foreground">
                        <div className="flex items-center gap-1"><Calendar className="w-4 h-4" />{flight.departure_date}</div>
                        {flight.baggage_allowance && <span>🧳 {flight.baggage_allowance}</span>}
                        {flight.meal_included && <span>🍽️ وجبة مشمولة</span>}
                        <span>💺 {flight.available_seats} مقعد متاح</span>
                      </div>
                    </div>
                    <div className="bg-luxury-cream/50 p-6 flex flex-col justify-center items-center lg:w-64 border-t lg:border-t-0 lg:border-r border-border">
                      {flight.original_price && flight.original_price > flight.price_adult && <p className="text-sm text-muted-foreground line-through">{formatPrice(flight.original_price)}</p>}
                      <p className="text-3xl font-bold text-luxury-teal">{formatPrice(flight.price_adult)}</p>
                      <p className="text-sm text-muted-foreground mb-4">للشخص الواحد</p>
                      <Link to={`/booking?type=flight&id=${flight.id}`} className="w-full"><Button className="w-full btn-luxury">احجز الآن</Button></Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-luxury-navy relative overflow-hidden">
        <div className="absolute inset-0"><div className="absolute top-0 right-0 w-[400px] h-[400px] bg-luxury-teal/10 rounded-full blur-[150px]" /><div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-luxury-gold/10 rounded-full blur-[100px]" /></div>
        <div className="container px-4 text-center relative z-10">
          <h2 className="text-section text-white mb-4">لم تجد رحلتك المناسبة؟</h2>
          <p className="text-xl text-white/60 mb-8">تواصل معنا وسنساعدك في إيجاد أفضل الخيارات لرحلتك</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact"><Button className="btn-gold px-10 py-5 text-lg">تواصل معنا</Button></Link>
            <a href="https://wa.me/966569222111" target="_blank" rel="noopener noreferrer"><Button className="btn-outline-luxury px-10 py-5 text-lg text-white border-white/30 hover:bg-white hover:text-luxury-navy">واتساب</Button></a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Flights;
