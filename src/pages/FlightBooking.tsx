import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Plane, Calendar, Users, MapPin, CreditCard, Shield, CheckCircle, ArrowRight, Clock, Luggage, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSEO } from "@/hooks/useSEO";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const FlightBooking = () => {
  useSEO({
    title: "حجز طيران - ترافليون",
    description: "احجز تذاكر الطيران الخاصة بك مع أفضل الأسعار والخدمات",
    keywords: "حجز طيران, تذاكر طيران, رحلات جوية",
  });

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [flightData, setFlightData] = useState({
    tripType: "roundtrip",
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
    adults: "1",
    children: "0",
    infants: "0",
    class: "economy",
    // Passenger details
    passengerName: "",
    passengerEmail: "",
    passengerPhone: "",
    passportNumber: "",
  });

  const handleSearch = () => {
    if (!flightData.from || !flightData.to || !flightData.departDate) {
      toast.error("يرجى إكمال جميع الحقول المطلوبة");
      return;
    }
    setStep(2);
  };

  const handleBooking = () => {
    if (!flightData.passengerName || !flightData.passengerEmail || !flightData.passengerPhone) {
      toast.error("يرجى إكمال بيانات المسافر");
      return;
    }
    toast.success("تم إرسال طلب الحجز! سنتواصل معك قريباً.");
    setTimeout(() => navigate("/"), 2000);
  };

  const steps = [
    { number: 1, title: "تفاصيل الرحلة", icon: Plane },
    { number: 2, title: "بيانات المسافر", icon: Users },
    { number: 3, title: "الدفع", icon: CreditCard },
  ];

  const popularRoutes = [
    { from: "الرياض", to: "دبي", price: "450 ر.س" },
    { from: "جدة", to: "القاهرة", price: "850 ر.س" },
    { from: "الدمام", to: "اسطنبول", price: "1,200 ر.س" },
  ];

  return (
    <PageLayout>
      <PageHeader
        badge="رحلات جوية مريحة"
        badgeIcon={<Plane className="w-4 h-4 text-luxury-teal" />}
        title={<>حجز <span className="text-gradient-teal">تذاكر الطيران</span></>}
        subtitle="احجز رحلتك بأفضل الأسعار مع خدمة عملاء متميزة"
      />

      {/* Progress Steps */}
      <section className="py-8 -mt-10 relative z-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step >= s.number ? 'bg-luxury-teal text-white' : 'bg-gray-200 text-gray-400'} transition-all`}>
                      {step > s.number ? <CheckCircle className="w-6 h-6" /> : <s.icon className="w-6 h-6" />}
                    </div>
                    <span className={`text-sm mt-2 font-semibold ${step >= s.number ? 'text-luxury-teal' : 'text-gray-400'}`}>{s.title}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-4 ${step > s.number ? 'bg-luxury-teal' : 'bg-gray-200'} transition-all`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <div className="card-3d p-8">
                  {step === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-luxury-navy mb-6">تفاصيل الرحلة</h2>
                      
                      <RadioGroup value={flightData.tripType} onValueChange={(value) => setFlightData({...flightData, tripType: value})}>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="roundtrip" id="roundtrip" />
                            <Label htmlFor="roundtrip" className="cursor-pointer">ذهاب وعودة</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="oneway" id="oneway" />
                            <Label htmlFor="oneway" className="cursor-pointer">ذهاب فقط</Label>
                          </div>
                        </div>
                      </RadioGroup>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-luxury-navy font-semibold">من *</Label>
                          <Input placeholder="مطار المغادرة" value={flightData.from} onChange={(e) => setFlightData({...flightData, from: e.target.value})} className="h-12 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-luxury-navy font-semibold">إلى *</Label>
                          <Input placeholder="مطار الوصول" value={flightData.to} onChange={(e) => setFlightData({...flightData, to: e.target.value})} className="h-12 rounded-xl" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-luxury-navy font-semibold">تاريخ المغادرة *</Label>
                          <Input type="date" value={flightData.departDate} onChange={(e) => setFlightData({...flightData, departDate: e.target.value})} min={new Date().toISOString().split("T")[0]} className="h-12 rounded-xl" />
                        </div>
                        {flightData.tripType === "roundtrip" && (
                          <div className="space-y-2">
                            <Label className="text-luxury-navy font-semibold">تاريخ العودة *</Label>
                            <Input type="date" value={flightData.returnDate} onChange={(e) => setFlightData({...flightData, returnDate: e.target.value})} min={flightData.departDate} className="h-12 rounded-xl" />
                          </div>
                        )}
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label className="text-luxury-navy font-semibold">البالغين</Label>
                          <Select value={flightData.adults} onValueChange={(value) => setFlightData({...flightData, adults: value})}>
                            <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent>{[1,2,3,4,5,6,7,8,9].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-luxury-navy font-semibold">الأطفال (2-11)</Label>
                          <Select value={flightData.children} onValueChange={(value) => setFlightData({...flightData, children: value})}>
                            <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent>{[0,1,2,3,4].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-luxury-navy font-semibold">الرضع (أقل من 2)</Label>
                          <Select value={flightData.infants} onValueChange={(value) => setFlightData({...flightData, infants: value})}>
                            <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent>{[0,1,2].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-luxury-navy font-semibold">الدرجة</Label>
                        <Select value={flightData.class} onValueChange={(value) => setFlightData({...flightData, class: value})}>
                          <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="economy">الاقتصادية</SelectItem>
                            <SelectItem value="business">رجال الأعمال</SelectItem>
                            <SelectItem value="first">الأولى</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button onClick={handleSearch} className="w-full btn-luxury py-6 text-lg rounded-xl">
                        بحث عن رحلات
                        <ArrowRight className="w-5 h-5 mr-2" />
                      </Button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-luxury-navy mb-6">بيانات المسافر الرئيسي</h2>
                      
                      <div className="space-y-2">
                        <Label className="text-luxury-navy font-semibold">الاسم الكامل *</Label>
                        <Input placeholder="كما في جواز السفر" value={flightData.passengerName} onChange={(e) => setFlightData({...flightData, passengerName: e.target.value})} className="h-12 rounded-xl" />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-luxury-navy font-semibold">البريد الإلكتروني *</Label>
                          <Input type="email" value={flightData.passengerEmail} onChange={(e) => setFlightData({...flightData, passengerEmail: e.target.value})} className="h-12 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-luxury-navy font-semibold">رقم الجوال *</Label>
                          <Input type="tel" value={flightData.passengerPhone} onChange={(e) => setFlightData({...flightData, passengerPhone: e.target.value})} className="h-12 rounded-xl" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-luxury-navy font-semibold">رقم جواز السفر</Label>
                        <Input placeholder="اختياري" value={flightData.passportNumber} onChange={(e) => setFlightData({...flightData, passportNumber: e.target.value})} className="h-12 rounded-xl" />
                      </div>

                      <div className="flex gap-4">
                        <Button variant="outline" onClick={() => setStep(1)} className="flex-1 py-6 rounded-xl">رجوع</Button>
                        <Button onClick={handleBooking} className="flex-1 btn-luxury py-6 rounded-xl">إتمام الحجز</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  {/* Popular Routes */}
                  <div className="card-3d p-6">
                    <h3 className="font-bold text-luxury-navy mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-luxury-gold" />
                      الرحلات الأكثر طلباً
                    </h3>
                    <div className="space-y-3">
                      {popularRoutes.map((route, i) => (
                        <div key={i} className="p-3 bg-luxury-cream/50 rounded-xl">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-luxury-navy">{route.from} → {route.to}</span>
                          </div>
                          <p className="text-luxury-teal font-bold">{route.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="card-3d p-6">
                    <h3 className="font-bold text-luxury-navy mb-4">مزايا الحجز معنا</h3>
                    <ul className="space-y-3">
                      {[
                        { icon: Shield, text: "ضمان أفضل سعر" },
                        { icon: Clock, text: "تأكيد فوري للحجز" },
                        { icon: Luggage, text: "تعديل مجاني لـ24 ساعة" },
                        { icon: Users, text: "دعم 24/7" },
                      ].map((benefit, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <benefit.icon className="w-5 h-5 text-luxury-teal flex-shrink-0" />
                          <span className="text-sm text-luxury-navy">{benefit.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default FlightBooking;
