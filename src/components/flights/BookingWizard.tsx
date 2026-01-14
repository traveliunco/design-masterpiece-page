import { useState } from "react";
import { 
  X, Check, CreditCard, User, Mail, Phone, Plane, Luggage, 
  Coffee, MapPin, ChevronRight, Shield, Clock, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FlightOffer, getAirlineInfo, TravelerInfo } from "@/services/amadeusService";
import { paymentService, calculateInstallmentPlans, PAYMENT_METHODS } from "@/services/paymentService";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BookingWizardProps {
  flight: FlightOffer;
  passengers: { adults: number; children: number; infants: number };
  onClose: () => void;
  onComplete: (bookingId: string) => void;
}

interface PassengerForm {
  type: "adult" | "child" | "infant";
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE";
  passport: string;
  passportExpiry: string;
  nationality: string;
}

const BookingWizard = ({ flight, passengers, onClose, onComplete }: BookingWizardProps) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Contact Info
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
  });
  
  // Passengers
  const totalPassengers = passengers.adults + passengers.children + passengers.infants;
  const [passengerForms, setPassengerForms] = useState<PassengerForm[]>(
    Array(totalPassengers).fill(null).map((_, i) => ({
      type: i < passengers.adults ? "adult" : i < passengers.adults + passengers.children ? "child" : "infant",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "MALE" as const,
      passport: "",
      passportExpiry: "",
      nationality: "SA",
    }))
  );
  
  // Services
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "", holder: "" });

  const formatTime = (dateTime: string) => new Date(dateTime).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
  const formatDuration = (d: string) => { const m = d.match(/PT(\d+)H(\d+)?M?/); return m ? `${m[1]}س ${m[2] || "0"}د` : d; };

  const services = [
    { id: "extra_bag", icon: Luggage, title: "حقيبة إضافية 23 كج", price: 150 },
    { id: "meal", icon: Coffee, title: "وجبة خاصة", price: 50 },
    { id: "seat", icon: MapPin, title: "اختيار المقعد", price: 75 },
  ];

  const totalPrice = parseFloat(flight.price.total) * totalPassengers + 
    selectedServices.reduce((sum, s) => sum + (services.find(x => x.id === s)?.price || 0), 0);

  const installments = calculateInstallmentPlans(totalPrice);

  const updatePassenger = (index: number, field: keyof PassengerForm, value: string) => {
    setPassengerForms(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const result = await paymentService.process({
        amount: totalPrice,
        currency: "SAR",
        method: paymentMethod as any,
        cardDetails: paymentMethod === "credit_card" ? {
          number: cardDetails.number,
          expiry: cardDetails.expiry,
          cvv: cardDetails.cvv,
          holderName: cardDetails.holder,
        } : undefined,
        bookingId: `BK${Date.now()}`,
        customerInfo: contactInfo,
      });

      if (result.success) {
        toast.success("تم الدفع بنجاح!");
        onComplete(result.transactionId);
      } else {
        toast.error(result.messageAr);
      }
    } catch (error) {
      toast.error("حدث خطأ في عملية الدفع");
    }
    setIsProcessing(false);
  };

  const steps = [
    { num: 1, title: "مراجعة الرحلة" },
    { num: 2, title: "بيانات المسافرين" },
    { num: 3, title: "الخدمات الإضافية" },
    { num: 4, title: "الدفع" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl my-8 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-luxury-teal to-emerald-600 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center justify-between text-white">
            <div>
              <h3 className="text-2xl font-bold">إتمام الحجز</h3>
              <p className="text-white/80">{steps[step - 1].title}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress */}
          <div className="flex items-center gap-2 mt-4">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  step >= s.num ? "bg-white text-luxury-teal" : "bg-white/30 text-white"
                )}>
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                {i < steps.length - 1 && (
                  <div className={cn("flex-1 h-1 mx-2", step > s.num ? "bg-white" : "bg-white/30")} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Step 1: Review Flight */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-4">
                {flight.itineraries.map((it, idx) => {
                  const first = it.segments[0];
                  const last = it.segments[it.segments.length - 1];
                  const airline = getAirlineInfo(first.carrierCode);
                  return (
                    <div key={idx} className={cn("flex items-center gap-4", idx > 0 && "mt-4 pt-4 border-t")}>
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                        {airline.logo ? <img src={airline.logo} className="w-8 h-8" /> : <Plane className="w-5 h-5 text-luxury-teal" />}
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <div className="text-center">
                          <div className="text-xl font-bold">{first.departure.iataCode}</div>
                          <div className="text-sm text-gray-500">{formatTime(first.departure.at)}</div>
                        </div>
                        <div className="flex-1 text-center">
                          <Plane className="w-5 h-5 text-luxury-teal mx-auto" />
                          <div className="text-xs text-gray-500">{formatDuration(it.duration)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold">{last.arrival.iataCode}</div>
                          <div className="text-sm text-gray-500">{formatTime(last.arrival.at)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-luxury-teal/10 rounded-2xl p-4">
                <div className="flex justify-between mb-2">
                  <span>سعر التذكرة × {totalPassengers}</span>
                  <span className="font-bold">{(parseFloat(flight.price.total) * totalPassengers).toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span>الإجمالي</span>
                  <span className="text-luxury-teal">{totalPrice.toLocaleString()} ر.س</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-bold">معلومات التواصل</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="الاسم الأول" value={contactInfo.firstName} onChange={e => setContactInfo(p => ({...p, firstName: e.target.value}))} />
                  <Input placeholder="اسم العائلة" value={contactInfo.lastName} onChange={e => setContactInfo(p => ({...p, lastName: e.target.value}))} />
                  <Input type="email" placeholder="البريد الإلكتروني" value={contactInfo.email} onChange={e => setContactInfo(p => ({...p, email: e.target.value}))} />
                  <Input placeholder="رقم الجوال" value={contactInfo.phone} onChange={e => setContactInfo(p => ({...p, phone: e.target.value}))} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Passengers */}
          {step === 2 && (
            <div className="space-y-6">
              {passengerForms.map((p, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-4">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-luxury-teal" />
                    المسافر {i + 1} ({p.type === "adult" ? "بالغ" : p.type === "child" ? "طفل" : "رضيع"})
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="الاسم الأول (كما في الجواز)" value={p.firstName} onChange={e => updatePassenger(i, "firstName", e.target.value)} />
                    <Input placeholder="اسم العائلة" value={p.lastName} onChange={e => updatePassenger(i, "lastName", e.target.value)} />
                    <Input type="date" placeholder="تاريخ الميلاد" value={p.dateOfBirth} onChange={e => updatePassenger(i, "dateOfBirth", e.target.value)} />
                    <select 
                      value={p.gender} 
                      onChange={e => updatePassenger(i, "gender", e.target.value)}
                      className="h-10 rounded-md border px-3"
                    >
                      <option value="MALE">ذكر</option>
                      <option value="FEMALE">أنثى</option>
                    </select>
                    <Input placeholder="رقم جواز السفر" value={p.passport} onChange={e => updatePassenger(i, "passport", e.target.value)} />
                    <Input type="date" placeholder="تاريخ انتهاء الجواز" value={p.passportExpiry} onChange={e => updatePassenger(i, "passportExpiry", e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Services */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-bold mb-4">اختر الخدمات الإضافية</h4>
              {services.map((srv) => (
                <label key={srv.id} className="flex items-center gap-4 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedServices.includes(srv.id)}
                    onChange={e => setSelectedServices(prev => e.target.checked ? [...prev, srv.id] : prev.filter(x => x !== srv.id))}
                    className="w-5 h-5 rounded"
                  />
                  <srv.icon className="w-6 h-6 text-luxury-teal" />
                  <span className="flex-1 font-medium">{srv.title}</span>
                  <span className="font-bold text-luxury-teal">+{srv.price} ر.س</span>
                </label>
              ))}
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-luxury-teal/10 rounded-2xl p-6">
                <div className="flex justify-between mb-2">
                  <span>سعر التذاكر</span>
                  <span>{(parseFloat(flight.price.total) * totalPassengers).toLocaleString()} ر.س</span>
                </div>
                {selectedServices.length > 0 && (
                  <div className="flex justify-between mb-2">
                    <span>الخدمات الإضافية</span>
                    <span>{selectedServices.reduce((s, x) => s + (services.find(y => y.id === x)?.price || 0), 0).toLocaleString()} ر.س</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold border-t pt-4 mt-4">
                  <span>الإجمالي</span>
                  <span className="text-luxury-teal">{totalPrice.toLocaleString()} ر.س</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold">اختر طريقة الدفع</h4>
                {PAYMENT_METHODS.filter(m => m.enabled).map((method) => (
                  <label 
                    key={method.id}
                    className={cn(
                      "flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all",
                      paymentMethod === method.type ? "border-luxury-teal bg-luxury-teal/5" : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === method.type}
                      onChange={() => setPaymentMethod(method.type)}
                      className="w-5 h-5"
                    />
                    <CreditCard className="w-6 h-6 text-gray-600" />
                    <div className="flex-1">
                      <div className="font-bold">{method.nameAr}</div>
                      <div className="text-sm text-gray-500">{method.descriptionAr}</div>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod === "credit_card" && (
                <div className="space-y-4 bg-gray-50 rounded-2xl p-4">
                  <Input placeholder="رقم البطاقة" value={cardDetails.number} onChange={e => setCardDetails(p => ({...p, number: e.target.value}))} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="MM/YY" value={cardDetails.expiry} onChange={e => setCardDetails(p => ({...p, expiry: e.target.value}))} />
                    <Input placeholder="CVV" type="password" value={cardDetails.cvv} onChange={e => setCardDetails(p => ({...p, cvv: e.target.value}))} />
                  </div>
                  <Input placeholder="اسم حامل البطاقة" value={cardDetails.holder} onChange={e => setCardDetails(p => ({...p, holder: e.target.value}))} />
                </div>
              )}

              {(paymentMethod === "tabby" || paymentMethod === "tamara") && installments.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h5 className="font-bold mb-3">خطط التقسيط المتاحة</h5>
                  {installments.filter(p => p.provider === paymentMethod).map((plan) => (
                    <div key={plan.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <span>{plan.installments} أقساط</span>
                      <span className="font-bold">{plan.amount.toLocaleString()} ر.س / شهر</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t flex gap-4 flex-shrink-0">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1">السابق</Button>
          )}
          {step < 4 ? (
            <Button onClick={() => setStep(s => s + 1)} className="flex-1 bg-luxury-teal">
              التالي <ChevronRight className="w-4 h-4 mr-2" />
            </Button>
          ) : (
            <Button onClick={handlePayment} disabled={isProcessing} className="flex-1 bg-luxury-gold hover:bg-yellow-600">
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin ml-2" /> : <Shield className="w-5 h-5 ml-2" />}
              {isProcessing ? "جاري المعالجة..." : "تأكيد الدفع"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingWizard;
