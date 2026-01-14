import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Hotel, Star, MapPin, Search, Wifi, Waves, Dumbbell, UtensilsCrossed,
  Shield, Clock, Phone, CheckCircle, Loader2, ArrowLeft
} from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useHotels, useFeaturedHotels } from "@/hooks/useBookingSystem";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";

const defaultHotels = [
  { id: "1", name_ar: "فندق شانغريلا كوالالمبور", city_ar: "كوالالمبور", country_ar: "ماليزيا", star_rating: 5, rating: 9.2, price: 850, image: "🏨", amenities: ["wifi", "pool", "spa", "restaurant"], hotel_type: "hotel", reviews_count: 124 },
  { id: "2", name_ar: "منتجع أنانتارا بالي", city_ar: "بالي", country_ar: "إندونيسيا", star_rating: 5, rating: 9.5, price: 1200, image: "🏝️", amenities: ["wifi", "pool", "spa", "beach"], hotel_type: "resort", reviews_count: 89 },
  { id: "3", name_ar: "فندق رافلز اسطنبول", city_ar: "اسطنبول", country_ar: "تركيا", star_rating: 5, rating: 9.3, price: 950, image: "🕌", amenities: ["wifi", "pool", "spa", "restaurant"], hotel_type: "hotel", reviews_count: 156 },
  { id: "4", name_ar: "نيكي بيتش دبي", city_ar: "دبي", country_ar: "الإمارات", star_rating: 5, rating: 9.0, price: 1100, image: "🌴", amenities: ["wifi", "pool", "beach", "restaurant"], hotel_type: "resort", reviews_count: 78 },
  { id: "5", name_ar: "فندق الفورسيزونز بانكوك", city_ar: "بانكوك", country_ar: "تايلاند", star_rating: 5, rating: 9.4, price: 780, image: "🏯", amenities: ["wifi", "pool", "spa", "gym"], hotel_type: "hotel", reviews_count: 203 },
  { id: "6", name_ar: "منتجع فيلا المالديف", city_ar: "مالي", country_ar: "المالديف", star_rating: 5, rating: 9.8, price: 2500, image: "🏝️", amenities: ["wifi", "pool", "beach", "spa"], hotel_type: "villa", reviews_count: 45 },
];

const hotelCategories = [
  { id: "all", name: "الكل", icon: "🏨" },
  { id: "hotel", name: "فنادق", icon: "🏢" },
  { id: "resort", name: "منتجعات", icon: "🏖️" },
  { id: "villa", name: "فلل", icon: "🏡" },
];

const destinations = [
  { code: "KL", name: "كوالالمبور", flag: "🇲🇾" },
  { code: "BK", name: "بانكوك", flag: "🇹🇭" },
  { code: "IS", name: "اسطنبول", flag: "🇹🇷" },
  { code: "BL", name: "بالي", flag: "🇮🇩" },
  { code: "ML", name: "المالديف", flag: "🇲🇻" },
];

const Hotels = () => {
  const [destination, setDestination] = useState("all");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [rooms, setRooms] = useState("1");
  const [hotelType, setHotelType] = useState("all");

  useSEO({
    title: "حجز الفنادق - أفضل العروض الفندقية",
    description: "احجز فندقك بأفضل الأسعار مع ترافليون. فنادق 5 نجوم في ماليزيا، تايلاند، تركيا، المالديف والمزيد.",
    keywords: "حجز فنادق, فنادق ماليزيا, فنادق تايلاند, منتجعات, حجز فندق",
  });

  const { data: hotels, isLoading } = useHotels({
    city: destination !== "all" ? destination : undefined,
    hotel_type: hotelType !== "all" ? hotelType : undefined,
  });

  const displayHotels = hotels?.length ? hotels : defaultHotels;

  const renderStars = (count: number) => {
    return Array(count).fill(null).map((_, i) => (
      <Star key={i} className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
    ));
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, React.ReactNode> = {
      wifi: <Wifi className="w-4 h-4" />,
      pool: <Waves className="w-4 h-4" />,
      spa: <Dumbbell className="w-4 h-4" />,
      restaurant: <UtensilsCrossed className="w-4 h-4" />,
      gym: <Dumbbell className="w-4 h-4" />,
      beach: <Waves className="w-4 h-4" />,
    };
    return icons[amenity] || null;
  };

  return (
    <PageLayout>
      <PageHeader
        badge="أفضل الفنادق والمنتجعات"
        badgeIcon={<Hotel className="w-4 h-4 text-luxury-gold" />}
        title="احجز فندقك بأفضل الأسعار"
        subtitle="فنادق ومنتجعات مختارة بعناية في أجمل الوجهات حول العالم"
      />

      {/* Search Form */}
      <section className="py-8 -mt-10 relative z-20">
        <div className="container px-4">
          <div className="glass-premium rounded-3xl p-6 shadow-luxury">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <Label className="text-luxury-navy font-semibold">الوجهة</Label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="اختر الوجهة" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الوجهات</SelectItem>
                    {destinations.map((d) => (<SelectItem key={d.code} value={d.name}>{d.flag} {d.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-luxury-navy font-semibold">تاريخ الوصول</Label>
                <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-luxury-navy font-semibold">تاريخ المغادرة</Label>
                <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-luxury-navy font-semibold">الغرف</Label>
                <Select value={rooms} onValueChange={setRooms}>
                  <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 غرفة</SelectItem>
                    <SelectItem value="2">2 غرفتين</SelectItem>
                    <SelectItem value="3">3 غرف</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-luxury-navy font-semibold">الضيوف</Label>
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 ضيف</SelectItem>
                    <SelectItem value="2">2 ضيوف</SelectItem>
                    <SelectItem value="3">3 ضيوف</SelectItem>
                    <SelectItem value="4">4 ضيوف</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full h-12 btn-luxury gap-2">
                  <Search className="w-5 h-5" />بحث
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8">
        <div className="container px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {hotelCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setHotelType(cat.id)}
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-semibold transition-all",
                  hotelType === cat.id
                    ? "bg-luxury-teal text-white shadow-glow-teal"
                    : "bg-white text-luxury-navy/70 hover:bg-luxury-teal/10 border border-border"
                )}
              >
                <span className="ml-2">{cat.icon}</span>{cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-12 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <h2 className="text-2xl font-bold text-luxury-navy mb-8">
            {displayHotels.length} فندق متاح
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-luxury-teal" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayHotels.map((hotel: any) => (
                <div key={hotel.id} className="group card-3d overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-luxury-teal/10 to-luxury-gold/10 flex items-center justify-center relative">
                    <span className="text-7xl">{hotel.image || hotel.main_image || "🏨"}</span>
                    {hotel.is_featured && (
                      <Badge className="absolute top-3 right-3 bg-luxury-gold text-luxury-navy">مميز</Badge>
                    )}
                  </div>
                  <div className="p-6 bg-white">
                    <div className="flex items-center gap-1 mb-2">{renderStars(hotel.star_rating || 5)}</div>
                    <h3 className="font-bold text-lg text-luxury-navy mb-1 group-hover:text-luxury-teal transition-colors">{hotel.name_ar}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                      <MapPin className="w-3 h-3" />{hotel.city_ar}، {hotel.country_ar}
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      {(hotel.amenities || []).slice(0, 4).map((amenity: string, i: number) => (
                        <span key={i} className="p-1.5 bg-luxury-teal/10 rounded-full text-luxury-teal">{getAmenityIcon(amenity)}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded-full font-bold">{hotel.rating}</span>
                        <span className="text-xs text-muted-foreground">({hotel.reviews_count} تقييم)</span>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground">من</p>
                        <p className="text-lg font-bold text-luxury-teal">{hotel.price || 500} ر.س<span className="text-xs text-muted-foreground">/ليلة</span></p>
                      </div>
                    </div>
                    <Link to={`/booking?type=hotel&hotel=${hotel.id}`} className="block mt-4">
                      <Button className="w-full btn-luxury">احجز الآن</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-luxury-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-luxury-teal/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-luxury-gold/10 rounded-full blur-[100px]" />
        </div>
        <div className="container px-4 relative z-10">
          <h2 className="text-section text-white text-center mb-12">لماذا تحجز معنا؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "أفضل سعر مضمون", desc: "نضمن لك الحصول على أفضل سعر" },
              { icon: CheckCircle, title: "إلغاء مجاني", desc: "إلغاء مجاني لمعظم الحجوزات" },
              { icon: Clock, title: "تأكيد فوري", desc: "احصل على تأكيد حجزك فوراً" },
              { icon: Phone, title: "دعم 24/7", desc: "فريق دعم متاح دائماً" },
            ].map((f, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 glass-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-8 h-8 text-luxury-gold" />
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/60 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-background to-luxury-cream/30">
        <div className="container px-4 text-center">
          <Phone className="w-12 h-12 text-luxury-teal mx-auto mb-4" />
          <h2 className="text-section text-luxury-navy mb-4">تحتاج مساعدة؟</h2>
          <p className="text-muted-foreground mb-8">فريقنا جاهز لمساعدتك في اختيار أفضل الفنادق</p>
          <a href="https://api.whatsapp.com/send?phone=966569222111" target="_blank" rel="noopener noreferrer">
            <Button className="btn-gold px-10 py-5 text-lg">تواصل واتساب</Button>
          </a>
        </div>
      </section>
    </PageLayout>
  );
};

export default Hotels;
