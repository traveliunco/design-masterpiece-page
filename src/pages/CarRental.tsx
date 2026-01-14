import { useState } from "react";
import { Link } from "react-router-dom";
import { Car, MapPin, Users, Shield, Clock, Phone, Star, Fuel, Settings, Search, Sparkles, CheckCircle, User } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSEO } from "@/hooks/useSEO";

const carCategories = [
  { id: "economy", name: "اقتصادية", icon: "🚗", priceFrom: 150 },
  { id: "sedan", name: "سيدان", icon: "🚙", priceFrom: 200 },
  { id: "suv", name: "SUV", icon: "🚐", priceFrom: 300 },
  { id: "luxury", name: "فاخرة", icon: "🏎️", priceFrom: 500 },
  { id: "van", name: "فان عائلي", icon: "🚌", priceFrom: 350 },
  { id: "bus", name: "باص سياحي", icon: "🚍", priceFrom: 800 },
];

const cars = [
  { id: 1, name: "تويوتا كامري", category: "sedan", seats: 5, bags: 3, transmission: "أوتوماتيك", fuel: "بنزين", pricePerDay: 200, priceWithDriver: 350, rating: 4.8, image: "🚗", features: ["تكييف", "بلوتوث", "GPS"] },
  { id: 2, name: "هيونداي سوناتا", category: "sedan", seats: 5, bags: 3, transmission: "أوتوماتيك", fuel: "بنزين", pricePerDay: 180, priceWithDriver: 320, rating: 4.7, image: "🚙", features: ["تكييف", "بلوتوث", "كاميرا خلفية"] },
  { id: 3, name: "تويوتا لاند كروزر", category: "suv", seats: 7, bags: 5, transmission: "أوتوماتيك", fuel: "بنزين", pricePerDay: 450, priceWithDriver: 600, rating: 4.9, image: "🚐", features: ["دفع رباعي", "تكييف خلفي", "شاشة"] },
  { id: 4, name: "مرسيدس E-Class", category: "luxury", seats: 5, bags: 3, transmission: "أوتوماتيك", fuel: "بنزين", pricePerDay: 600, priceWithDriver: 800, rating: 5.0, image: "🏎️", features: ["جلد", "مساج", "واي فاي"] },
  { id: 5, name: "تويوتا هايس", category: "van", seats: 12, bags: 10, transmission: "أوتوماتيك", fuel: "ديزل", pricePerDay: 400, priceWithDriver: 550, rating: 4.6, image: "🚌", features: ["تكييف", "مقاعد مريحة", "شاحن USB"] },
  { id: 6, name: "هيونداي كونا", category: "economy", seats: 5, bags: 2, transmission: "أوتوماتيك", fuel: "بنزين", pricePerDay: 150, priceWithDriver: 280, rating: 4.5, image: "🚗", features: ["تكييف", "بلوتوث"] },
];

const cities = [
  { code: "KUL", name: "كوالالمبور", country: "ماليزيا" },
  { code: "BKK", name: "بانكوك", country: "تايلاند" },
  { code: "IST", name: "اسطنبول", country: "تركيا" },
  { code: "TBS", name: "تبليسي", country: "جورجيا" },
  { code: "DPS", name: "بالي", country: "إندونيسيا" },
];

const CarRental = () => {
  useSEO({
    title: "تأجير السيارات مع أو بدون سائق - ترافليون",
    description: "استمتع برحلتك مع سيارات حديثة وسائقين محترفين في أفضل الوجهات السياحية",
    keywords: "تأجيرسيارات, سيارة مع سائق, تأجير سيارات فاخرة",
  });

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [withDriver, setWithDriver] = useState("with");
  const [city, setCity] = useState("all");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const filteredCars = cars.filter((car) => {
    if (selectedCategory !== "all" && car.category !== selectedCategory) return false;
    return true;
  });

  return (
    <PageLayout>
      <PageHeader
        badge="سيارات فاخرة في أفضل الوجهات"
        badgeIcon={<Car className="w-4 h-4 text-orange-400" />}
        title={<>تأجير السيارات <span className="text-gradient-orange">مع أو بدون سائق</span></>}
        subtitle="استمتع برحلتك مع سيارات حديثة وسائقين محترفين"
        gradientFrom="from-orange-500"
        gradientTo="to-red-600"
      />

      {/* Search Form */}
      <section className="py-8 -mt-10 relative z-20">
        <div className="container px-4">
          <div className="glass-premium rounded-3xl p-8 shadow-luxury">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="space-y-2">
                <Label className="text-luxury-navy font-semibold">المدينة</Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="اختر المدينة" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المدن</SelectItem>
                    {cities.map((c) => (<SelectItem key={c.code} value={c.code}>{c.name} - {c.country}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-luxury-navy font-semibold">تاريخ الاستلام</Label>
                <Input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-luxury-navy font-semibold">تاريخ الإرجاع</Label>
                <Input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} min={pickupDate || new Date().toISOString().split("T")[0]} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-luxury-navy font-semibold">نوع السيارة</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="جميع الأنواع" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    {carCategories.map((cat) => (<SelectItem key={cat.id} value={cat.id}>{cat.icon} {cat.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full h-12 btn-luxury text-lg rounded-xl"><Search className="w-5 h-5 ml-2" />بحث</Button>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 pt-4 border-t border-border">
              <RadioGroup value={withDriver} onValueChange={setWithDriver} className="flex gap-6">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="with" id="with" />
                  <Label htmlFor="with" className="cursor-pointer flex items-center gap-2 font-semibold"><User className="w-4 h-4" />مع سائق</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="without" id="without" />
                  <Label htmlFor="without" className="cursor-pointer flex items-center gap-2 font-semibold"><Settings className="w-4 h-4" />بدون سائق</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gradient-to-b from-background to-luxury-cream/30">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-luxury-navy text-center mb-10">فئات السيارات</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {carCategories.map((cat) => (
              <div key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`card-3d p-6 text-center cursor-pointer transition-all hover:scale-105 ${selectedCategory === cat.id ? "ring-2 ring-luxury-teal shadow-glow-teal" : ""}`}>
                <span className="text-5xl block mb-3">{cat.icon}</span>
                <p className="font-bold text-luxury-navy mb-1">{cat.name}</p>
                <p className="text-sm text-muted-foreground">من {cat.priceFrom} ر.س/يوم</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <section className="py-16 bg-luxury-cream/50">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-luxury-navy mb-10">السيارات المتاحة ({filteredCars.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <div key={car.id} className="card-3d overflow-hidden hover:shadow-luxury transition-all group">
                <div className="h-40 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <span className="text-7xl group-hover:scale-110 transition-transform">{car.image}</span>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-luxury-navy mb-1">{car.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{carCategories.find((c) => c.id === car.category)?.name}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold text-sm">{car.rating}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { icon: Users, value: car.seats },
                      { icon: Settings, value: car.transmission },
                      { icon: Fuel, value: car.fuel },
                      { icon: Car, value: `${car.bags} حقائب` }
                    ].map((spec, i) => (
                      <div key={i} className="text-center p-2 bg-luxury-cream/50 rounded-lg">
                        <spec.icon className="w-4 h-4 mx-auto mb-1 text-luxury-teal" />
                        <span className="text-xs text-luxury-navy">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {car.features.map((feature, i) => (
                      <span key={i} className="text-xs bg-luxury-teal/10 text-luxury-teal px-2 py-1 rounded-full font-semibold">{feature}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">{withDriver === "with" ? "مع سائق" : "بدون سائق"}</p>
                      <p className="text-2xl font-bold text-luxury-teal">{withDriver === "with" ? car.priceWithDriver : car.pricePerDay} <span className="text-sm">ر.س/يوم</span></p>
                    </div>
                    <Button className="btn-luxury">احجز الآن</Button>
                  </div>
                </CardContent>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-b from-background to-luxury-cream/30">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-luxury-navy text-center mb-12">لماذا تختارنا؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Car, title: "سيارات حديثة", desc: "أسطول من السيارات الحديثة والمعتنى بها", color: "from-blue-500 to-cyan-600" },
              { icon: User, title: "سائقين محترفين", desc: "سائقين ذوي خبرة ويتحدثون العربية", color: "from-emerald-500 to-teal-600" },
              { icon: Shield, title: "تأمين شامل", desc: "تأمين شامل على جميع السيارات", color: "from-purple-500 to-pink-600" },
              { icon: Clock, title: "خدمة 24/7", desc: "دعم متواصل على مدار الساعة", color: "from-orange-500 to-red-600" },
            ].map((feature, index) => (
              <div key={index} className="card-3d p-8 text-center hover:scale-105 transition-transform">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-luxury-navy mb-2 text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-16 bg-luxury-cream/50">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-luxury-navy text-center mb-10 flex items-center justify-center gap-3">
            <MapPin className="w-8 h-8 text-luxury-teal" />متوفر في هذه المدن
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {cities.map((c) => (
              <div key={c.code} className="card-3d p-6 text-center hover:shadow-luxury transition-all cursor-pointer group">
                <p className="font-bold text-lg text-luxury-navy mb-1 group-hover:text-luxury-teal transition-colors">{c.name}</p>
                <p className="text-sm text-muted-foreground">{c.country}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-b from-background to-luxury-cream/30">
        <div className="container px-4">
          <div className="relative overflow-hidden rounded-3xl p-12 bg-gradient-to-br from-orange-500 to-red-600 text-white text-center shadow-luxury">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-[150px]" />
            <div className="relative z-10">
              <Phone className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">تحتاج عرض سعر خاص؟</h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">تواصل معنا للحصول على عروض خاصة للمجموعات والرحلات الطويلة</p>
              <a href="https://api.whatsapp.com/send?phone=966569222111&text=استفسار عن تأجير سيارات" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 px-12 py-6 text-lg font-bold rounded-full shadow-xl">
                  <Phone className="w-5 h-5 ml-2" />تواصل عبر واتساب
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CarRental;
