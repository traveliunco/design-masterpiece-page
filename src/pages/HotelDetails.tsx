import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, Star, Check, Phone, Wifi, Coffee, Dumbbell, UtensilsCrossed, Car, Shield, Calendar, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";
import { useSEO } from "@/hooks/useSEO";
import { useState } from "react";
import { toast } from "sonner";

// Sample hotel data (would come from Supabase)
const sampleHotels = [
  {
    id: "1",
    name: "منتجع كونراد المالديف",
    destination: "جزر المالديف",
    rating: 4.9,
    reviews: 234,
    pricePerNight: 3500,
    images: ["🏨", "🏖️", "🏊"],
    description: "منتجع فاخر من فئة 5 نجوم يقع على شاطئ خاص في جزر المالديف الساحرة",
    features: ["واي فاي مجاني", "مسبح خاص", "إفطار مجاني", "صالة رياضية", "مطعم", "خدمة الغرف 24/7"],
    amenities: [
      { icon: Wifi, name: "واي فاي مجاني" },
      { icon: Coffee, name: "إفطار مجاني" },
      { icon: Dumbbell, name: "صالة رياضية" },
      { icon: UtensilsCrossed, name: "مطعم فاخر" },
      { icon: Car, name: "توصيل مطار مجاني" },
      { icon: Shield, name: "أمان 24/7" },
    ],
    rooms: [
      { type: "غرفة قياسية", price: 3500, features: ["سرير كينج", "إطلالة بحر", "30 م²"] },
      { type: "جناح ديلوكس", price: 5500, features: ["2 سرير", "شرفة خاصة", "50 م²"] },
      { type: "فيلا بمسبح خاص", price: 12000, features: ["مسبح خاص", "إطلالة بانورامية", "120 م²"] },
    ],
    policies: {
      checkIn: "15:00",
      checkOut: "12:00",
      cancellation: "إلغاء مجاني حتى 7 أيام قبل الوصول",
    },
  },
];

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hotel = sampleHotels.find(h => h.id === id) || sampleHotels[0];

  useSEO({
    title: `${hotel.name} - ترافليون`,
    description: hotel.description,
    keywords: `${hotel.destination}, فندق, ${hotel.name}`,
  });

  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    adults: 2,
    children: 0,
    selectedRoom: hotel.rooms[0],
  });

  const nights = bookingData.checkIn && bookingData.checkOut 
    ? Math.ceil((new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 1;
  const totalPrice = bookingData.selectedRoom.price * nights;

  const handleBooking = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      toast.error("يرجى اختيار تواريخ الإقامة");
      return;
    }
    toast.success("تم إضافة الفندق للحجز!");
    setTimeout(() => navigate("/booking"), 1500);
  };

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center gap-12">
          {hotel.images.map((img, i) => (
            <div key={i} className="text-9xl opacity-60">{img}</div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/95 via-luxury-navy/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 pb-16 z-10">
          <div className="container px-4">
            <div className="flex items-center gap-2 text-white/80 mb-4 text-sm">
              <Link to="/" className="hover:text-luxury-gold transition-colors">الرئيسية</Link>
              <span>/</span>
              <Link to="/hotels" className="hover:text-luxury-gold transition-colors">الفنادق</Link>
              <span>/</span>
              <span className="text-luxury-gold font-semibold">{hotel.name}</span>
            </div>
            <div className="flex items-center gap-3 text-white/90 mb-4">
              <MapPin className="w-6 h-6 text-luxury-gold" />
              <span className="text-lg font-semibold">{hotel.destination}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">{hotel.name}</h1>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-luxury-gold fill-luxury-gold" />)}
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-luxury-gold fill-luxury-gold" />
                <span className="text-white font-bold text-lg">{hotel.rating}</span>
                <span className="text-white/70">({hotel.reviews} تقييم)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <div className="card-3d p-8">
                <h2 className="text-3xl font-bold text-luxury-navy mb-6">عن الفندق</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">{hotel.description}</p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-luxury-cream/50 rounded-xl">
                      <amenity.icon className="w-5 h-5 text-luxury-teal" />
                      <span className="text-sm font-semibold text-luxury-navy">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rooms */}
              <div className="card-3d p-8">
                <h2 className="text-3xl font-bold text-luxury-navy mb-6">الغرف المتاحة</h2>
                <div className="space-y-6">
                  {hotel.rooms.map((room, i) => (
                    <div key={i} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${bookingData.selectedRoom.type === room.type ? 'border-luxury-teal bg-luxury-teal/5' : 'border-border hover:border-luxury-teal/50'}`} onClick={() => setBookingData({...bookingData, selectedRoom: room})}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-luxury-navy mb-2">{room.type}</h3>
                          <div className="flex flex-wrap gap-3">
                            {room.features.map((feature, j) => (
                              <span key={j} className="text-sm bg-luxury-cream px-3 py-1 rounded-full">{feature}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-luxury-teal">{room.price.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">ر.س / ليلة</div>
                        </div>
                      </div>
                      {bookingData.selectedRoom.type === room.type && (
                        <div className="flex items-center gap-2 text-luxury-teal text-sm font-semibold mt-4">
                          <Check className="w-4 h-4" />
                          محدد
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Policies */}
              <div className="card-3d p-8">
                <h2 className="text-3xl font-bold text-luxury-navy mb-6">سياسات الفندق</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-luxury-cream/50 rounded-xl">
                    <div className="font-bold text-luxury-navy mb-2">تسجيل الدخول</div>
                    <div className="text-muted-foreground">{hotel.policies.checkIn}</div>
                  </div>
                  <div className="p-4 bg-luxury-cream/50 rounded-xl">
                    <div className="font-bold text-luxury-navy mb-2">تسجيل الخروج</div>
                    <div className="text-muted-foreground">{hotel.policies.checkOut}</div>
                  </div>
                  <div className="md:col-span-2 p-4 bg-luxury-cream/50 rounded-xl">
                    <div className="font-bold text-luxury-navy mb-2">سياسة الإلغاء</div>
                    <div className="text-muted-foreground">{hotel.policies.cancellation}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="card-3d p-6">
                  <h3 className="font-bold text-luxury-navy mb-6 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-luxury-gold" />
                    احجز إقامتك
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">تاريخ الوصول</label>
                      <input type="date" value={bookingData.checkIn} onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})} min={new Date().toISOString().split("T")[0]} className="w-full p-3 border rounded-xl" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">تاريخ المغادرة</label>
                      <input type="date" value={bookingData.checkOut} onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})} min={bookingData.checkIn} className="w-full p-3 border rounded-xl" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">البالغين</label>
                      <select value={bookingData.adults} onChange={(e) => setBookingData({...bookingData, adults: Number(e.target.value)})} className="w-full p-3 border rounded-xl">
                        {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">الأطفال</label>
                      <select value={bookingData.children} onChange={(e) => setBookingData({...bookingData, children: Number(e.target.value)})} className="w-full p-3 border rounded-xl">
                        {[0,1,2].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="border-t pt-6 mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">{nights} ليلة × {bookingData.selectedRoom.price.toLocaleString()} ر.س</span>
                      <span className="font-semibold">{totalPrice.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-lg font-bold text-luxury-navy">الإجمالي</span>
                      <span className="text-3xl font-bold text-luxury-teal">{totalPrice.toLocaleString()} <span className="text-sm">ر.س</span></span>
                    </div>
                  </div>

                  <Button onClick={handleBooking} className="w-full btn-luxury py-6 text-lg rounded-xl mb-3">احجز الآن</Button>
                  
                  <a href="https://api.whatsapp.com/send?phone=966569222111" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full py-6 rounded-xl border-luxury-teal text-luxury-teal hover:bg-luxury-teal/10">
                      <Phone className="w-5 h-5 ml-2" />
                      استفسار
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default HotelDetails;
