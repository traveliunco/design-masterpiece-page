import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plane,
  Search,
  Calendar,
  ArrowLeftRight,
  MapPin,
  Clock,
  Users,
  Filter,
  Star,
  TrendingDown,
  Briefcase,
  Shield,
  Phone,
  ChevronDown,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAirports, useFlightOffers, useFeaturedFlights } from "@/hooks/useBookingSystem";

// بيانات افتراضية عند عدم وجود بيانات من قاعدة البيانات
const defaultFlights = [
  { id: "1", origin: "جدة", destination: "كوالالمبور", origin_code: "JED", dest_code: "KUL", price: 1899, date: "2025-01-15", airline: "الخطوط السعودية", duration: "9س 30د", direct: true, flag: "🇲🇾" },
  { id: "2", origin: "جدة", destination: "اسطنبول", origin_code: "JED", dest_code: "IST", price: 1499, date: "2025-01-20", airline: "الخطوط التركية", duration: "4س 15د", direct: true, flag: "🇹🇷" },
  { id: "3", origin: "الرياض", destination: "دبي", origin_code: "RUH", dest_code: "DXB", price: 599, date: "2025-01-10", airline: "طيران الإمارات", duration: "2س", direct: true, flag: "🇦🇪" },
  { id: "4", origin: "جدة", destination: "بانكوك", origin_code: "JED", dest_code: "BKK", price: 1699, date: "2025-01-25", airline: "طيران الإمارات", duration: "8س 45د", direct: false, flag: "🇹🇭" },
  { id: "5", origin: "الرياض", destination: "القاهرة", origin_code: "RUH", dest_code: "CAI", price: 899, date: "2025-01-18", airline: "الخطوط السعودية", duration: "2س 30د", direct: true, flag: "🇪🇬" },
  { id: "6", origin: "جدة", destination: "تبليسي", origin_code: "JED", dest_code: "TBS", price: 1299, date: "2025-02-01", airline: "الخطوط التركية", duration: "5س", direct: false, flag: "🇬🇪" },
];

const defaultAirports = [
  { code: "JED", city: "جدة", country: "السعودية" },
  { code: "RUH", city: "الرياض", country: "السعودية" },
  { code: "DMM", city: "الدمام", country: "السعودية" },
  { code: "MED", city: "المدينة", country: "السعودية" },
];

const Flights = () => {
  const [origin, setOrigin] = useState("JED");
  const [destination, setDestination] = useState("all");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [flightClass, setFlightClass] = useState("economy");
  const [directOnly, setDirectOnly] = useState(false);
  const [oneWay, setOneWay] = useState(false);

  // جلب البيانات من قاعدة البيانات
  const { data: airports, isLoading: loadingAirports } = useAirports();
  const { data: flights, isLoading: loadingFlights } = useFlightOffers({
    origin: origin !== "all" ? origin : undefined,
    destination: destination !== "all" ? destination : undefined,
    is_direct: directOnly || undefined,
  });
  const { data: featuredFlights } = useFeaturedFlights(6);

  // استخدام البيانات الافتراضية إذا لم تتوفر بيانات
  const displayFlights = flights?.length ? flights : defaultFlights;
  const displayAirports = airports?.length ? airports : defaultAirports;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSearch = () => {
    // البحث يتم تلقائياً عبر React Query
    console.log("Searching...", { origin, destination, departureDate, passengers });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary via-primary/90 to-primary/80 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <Plane className="w-4 h-4" />
              <span className="text-sm">أفضل العروض على رحلات الطيران</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              احجز رحلتك
              <br />
              <span className="text-secondary">بأفضل الأسعار</span>
            </h1>
            <p className="text-lg text-white/80">
              قارن الأسعار واحجز مباشرة مع أفضل شركات الطيران
            </p>
          </div>
        </div>
      </section>

      {/* Search Form */}
      <section className="py-8 -mt-16 relative z-20">
        <div className="container">
          <Card className="shadow-2xl border-0">
            <CardContent className="p-6">
              {/* Trip Type */}
              <div className="flex gap-4 mb-6">
                <Button
                  variant={!oneWay ? "default" : "outline"}
                  onClick={() => setOneWay(false)}
                  className="gap-2"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  ذهاب وعودة
                </Button>
                <Button
                  variant={oneWay ? "default" : "outline"}
                  onClick={() => setOneWay(true)}
                  className="gap-2"
                >
                  <Plane className="w-4 h-4" />
                  ذهاب فقط
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Origin */}
                <div className="space-y-2">
                  <Label>من</Label>
                  <Select value={origin} onValueChange={setOrigin}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="مدينة المغادرة" />
                    </SelectTrigger>
                    <SelectContent>
                      {displayAirports.map((airport: any) => (
                        <SelectItem key={airport.code || airport.iata_code} value={airport.code || airport.iata_code}>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{airport.code || airport.iata_code}</span>
                            <span>{airport.city || airport.city_ar}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Destination */}
                <div className="space-y-2">
                  <Label>إلى</Label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="الوجهة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الوجهات</SelectItem>
                      <SelectItem value="KUL">🇲🇾 كوالالمبور</SelectItem>
                      <SelectItem value="IST">🇹🇷 اسطنبول</SelectItem>
                      <SelectItem value="DXB">🇦🇪 دبي</SelectItem>
                      <SelectItem value="BKK">🇹🇭 بانكوك</SelectItem>
                      <SelectItem value="TBS">🇬🇪 تبليسي</SelectItem>
                      <SelectItem value="CAI">🇪🇬 القاهرة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dates */}
                <div className="space-y-2">
                  <Label>تاريخ المغادرة</Label>
                  <Input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label>تاريخ العودة</Label>
                  <Input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    disabled={oneWay}
                    min={departureDate || new Date().toISOString().split("T")[0]}
                    className="h-12"
                  />
                </div>

                {/* Passengers */}
                <div className="space-y-2">
                  <Label>المسافرون</Label>
                  <Select value={passengers} onValueChange={setPassengers}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 مسافر</SelectItem>
                      <SelectItem value="2">2 مسافرين</SelectItem>
                      <SelectItem value="3">3 مسافرين</SelectItem>
                      <SelectItem value="4">4 مسافرين</SelectItem>
                      <SelectItem value="5">5+ مسافرين</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Search */}
                <div className="flex items-end">
                  <Button className="w-full h-12 text-lg gap-2" onClick={handleSearch}>
                    <Search className="w-5 h-5" />
                    بحث
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-6 pt-6 mt-6 border-t">
                <div className="flex items-center gap-2">
                  <Switch id="direct" checked={directOnly} onCheckedChange={setDirectOnly} />
                  <Label htmlFor="direct" className="cursor-pointer">رحلات مباشرة فقط</Label>
                </div>
                <Select value={flightClass} onValueChange={setFlightClass}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">الدرجة السياحية</SelectItem>
                    <SelectItem value="business">درجة رجال الأعمال</SelectItem>
                    <SelectItem value="first">الدرجة الأولى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Flight Results */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <TrendingDown className="w-6 h-6 text-primary" />
                أفضل عروض الرحلات
              </h2>
              <p className="text-muted-foreground">
                {displayFlights.length} رحلة متاحة
              </p>
            </div>
          </div>

          {loadingFlights ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayFlights.map((flight: any, index: number) => (
                <Card key={flight.id || index} className="overflow-hidden hover:shadow-xl transition-all group">
                  <div className="h-3 bg-gradient-to-r from-primary via-secondary to-primary" />
                  <CardContent className="p-5">
                    {/* Route */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-lg font-bold">{flight.origin_code || flight.origin_airport?.iata_code}</p>
                          <p className="text-xs text-muted-foreground">{flight.origin || flight.origin_airport?.city_ar}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-px bg-border" />
                          <Plane className="w-4 h-4 text-primary -rotate-90" />
                          <div className="w-8 h-px bg-border" />
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{flight.dest_code || flight.destination_airport?.iata_code}</p>
                          <p className="text-xs text-muted-foreground">{flight.destination || flight.destination_airport?.city_ar}</p>
                        </div>
                      </div>
                      <span className="text-3xl">{flight.flag || "✈️"}</span>
                    </div>

                    {/* Details */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{flight.date || flight.departure_date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{flight.duration || `${Math.floor((flight.duration_minutes || 120) / 60)}س ${(flight.duration_minutes || 120) % 60}د`}</span>
                      </div>
                    </div>

                    {/* Airline & Type */}
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary">{flight.airline || flight.airline?.name_ar}</Badge>
                      {(flight.direct || flight.is_direct) && (
                        <Badge className="bg-green-100 text-green-700">مباشر</Badge>
                      )}
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">ابتداءً من</p>
                        <p className="text-2xl font-bold text-primary">
                          {formatPrice(flight.price || flight.price_adult)}
                        </p>
                      </div>
                      <Link to={`/booking?type=flight&id=${flight.id}`}>
                        <Button>احجز الآن</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Book With Us */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-12">لماذا تحجز معنا؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "ضمان أفضل سعر", desc: "نضمن لك أفضل سعر متاح", color: "bg-green-100 text-green-600" },
              { icon: Clock, title: "حجز سريع", desc: "احجز رحلتك في دقائق", color: "bg-blue-100 text-blue-600" },
              { icon: Briefcase, title: "أمتعة مجانية", desc: "حقيبة واحدة على الأقل", color: "bg-purple-100 text-purple-600" },
              { icon: Phone, title: "دعم 24/7", desc: "فريق دعم متاح دائماً", color: "bg-orange-100 text-orange-600" },
            ].map((item, index) => (
              <Card key={index} className="p-6 text-center">
                <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-white p-8 md:p-12 text-center">
            <Phone className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">تحتاج مساعدة في الحجز؟</h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              فريقنا متاح على مدار الساعة لمساعدتك في اختيار أفضل الرحلات
            </p>
            <a href="https://api.whatsapp.com/send?phone=966569222111" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary">تواصل واتساب</Button>
            </a>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Flights;
