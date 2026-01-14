import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, Users, MapPin, Phone, CreditCard, Check, ArrowLeft, ArrowRight } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { destinations } from "@/data/destinations";
import { createBooking, calculateTotalPrice } from "@/integrations/supabase/bookings";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useSEO } from "@/hooks/useSEO";

// بيانات البرامج المتاحة (يمكن استبدالها بجلب من قاعدة البيانات)
const programs = [
  { id: "prog-1", name: "برنامج ماليزيا الكلاسيكي", destination: "malaysia", days: 7, nights: 6, price: 3999 },
  { id: "prog-2", name: "برنامج ماليزيا شهر العسل", destination: "malaysia", days: 8, nights: 7, price: 5499 },
  { id: "prog-3", name: "برنامج تايلاند العائلي", destination: "thailand", days: 6, nights: 5, price: 4499 },
  { id: "prog-4", name: "برنامج تايلاند المغامرات", destination: "thailand", days: 10, nights: 9, price: 6999 },
  { id: "prog-5", name: "برنامج إندونيسيا بالي", destination: "indonesia", days: 7, nights: 6, price: 4999 },
  { id: "prog-6", name: "برنامج تركيا الشامل", destination: "turkey", days: 9, nights: 8, price: 4999 },
  { id: "prog-7", name: "برنامج جورجيا الساحر", destination: "georgia", days: 6, nights: 5, price: 2999 },
  { id: "prog-8", name: "برنامج المالديف الرومانسي", destination: "maldives", days: 5, nights: 4, price: 8999 },
];

const BookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedDestination = searchParams.get("destination");
  const { user, loading: authLoading } = useAuth();

  useSEO({
    title: "إكمال الحجز - ترافليون",
    description: "أكمل حجزك في خطوات بسيطة وسهلة مع ترافليون",
    keywords: "حجز, سياحة, سفر, برامج سياحية",
  });

  // Form State
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destinationId: preselectedDestination || "",
    programId: "",
    checkInDate: "",
    checkOutDate: "",
    adults: 2,
    children: 0,
    infants: 0,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  // Computed values
  const selectedProgram = programs.find((p) => p.id === formData.programId);
  const filteredPrograms = formData.destinationId
    ? programs.filter((p) => p.destination === formData.destinationId)
    : programs;

  const { subtotal, discount, total } = selectedProgram
    ? calculateTotalPrice(
        selectedProgram.price,
        formData.adults,
        formData.children,
        selectedProgram.price * 0.7,
        0
      )
    : { subtotal: 0, discount: 0, total: 0 };

  // Auto-calculate checkout date
  useEffect(() => {
    if (formData.checkInDate && selectedProgram) {
      const checkIn = new Date(formData.checkInDate);
      checkIn.setDate(checkIn.getDate() + selectedProgram.nights);
      setFormData((prev) => ({
        ...prev,
        checkOutDate: checkIn.toISOString().split("T")[0],
      }));
    }
  }, [formData.checkInDate, selectedProgram]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "destinationId") {
      setFormData((prev) => ({ ...prev, programId: "" }));
    }
  };

  const handleNumberChange = (name: string, delta: number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: Math.max(name === "adults" ? 1 : 0, (prev as any)[name] + delta),
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.destinationId || !formData.programId || !formData.checkInDate) {
          toast.error("يرجى اختيار الوجهة والبرنامج وتاريخ السفر");
          return false;
        }
        return true;
      case 2:
        if (formData.adults < 1) {
          toast.error("يجب أن يكون عدد البالغين 1 على الأقل");
          return false;
        }
        return true;
      case 3:
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
          toast.error("يرجى ملء جميع بيانات الاتصال المطلوبة");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    if (!user) {
      toast.error("يجب تسجيل الدخول لإتمام الحجز");
      navigate("/login?redirect=/booking");
      return;
    }

    setLoading(true);
    try {
      const booking = await createBooking({
        booking_reference: `TRV${Date.now().toString(36).toUpperCase()}`,
        user_id: user.id,
        booking_type: "program",
        program_id: null,
        check_in_date: formData.checkInDate,
        check_out_date: formData.checkOutDate,
        adults_count: formData.adults,
        children_count: formData.children,
        infants_count: formData.infants,
        subtotal: subtotal,
        discount_amount: discount,
        taxes: total * 0.15,
        service_fee: 50,
        total_amount: total + (total * 0.15) + 50,
        currency: "SAR",
        promo_discount: 0,
        points_earned: Math.floor(total / 10),
        points_redeemed: 0,
        points_value: 0,
        status: "pending",
        payment_status: "pending",
        special_requests: formData.specialRequests
          ? `${selectedProgram?.name || formData.programId} - ${formData.specialRequests}`
          : selectedProgram?.name || formData.programId,
        source: "website",
        agent_id: null,
        program_date_id: null,
        hotel_id: null,
        room_id: null,
        promo_code: null,
        internal_notes: `البرنامج المحلي: ${formData.programId}`,
        cancellation_reason: null,
        confirmed_at: null,
        cancelled_at: null,
        completed_at: null,
      });

      toast.success("تم إنشاء الحجز بنجاح!");
      navigate(`/booking/confirmation?ref=${booking.booking_reference}`);
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error("حدث خطأ في إنشاء الحجز: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-luxury-teal to-emerald-700 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-luxury-gold/20 rounded-full blur-[100px]" />
        </div>
        <div className="container px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            احجز رحلتك <span className="text-luxury-gold">الآن</span>
          </h1>
          <p className="text-white/80 text-lg">أكمل حجزك في خطوات بسيطة وسهلة</p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 -mt-16 relative z-20">
        <div className="container px-4">
          <div className="glass-premium rounded-3xl p-6 shadow-luxury">
            <div className="flex justify-center items-center gap-2 md:gap-4 flex-wrap">
              {[
                { num: 1, label: "البرنامج" },
                { num: 2, label: "المسافرين" },
                { num: 3, label: "البيانات" },
                { num: 4, label: "التأكيد" },
              ].map((s, i) => (
                <div key={s.num} className="flex items-center">
                  <div className={`flex flex-col md:flex-row items-center gap-2`}>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                        step >= s.num
                          ? "bg-luxury-teal text-white shadow-glow-teal"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                    </div>
                    <span className={`text-sm font-medium ${step >= s.num ? "text-luxury-teal" : "text-gray-400"}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < 3 && (
                    <div className={`w-8 md:w-16 h-1 mx-2 rounded ${step > s.num ? "bg-luxury-teal" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gradient-to-b from-background to-luxury-cream/30">
        <div className="container px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="card-3d p-8">
                {/* Step 1 */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-luxury-navy flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-luxury-teal" />
                      اختر وجهتك والبرنامج
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-luxury-navy font-semibold">الوجهة *</Label>
                        <Select value={formData.destinationId} onValueChange={(v) => handleSelectChange("destinationId", v)}>
                          <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="اختر الوجهة" /></SelectTrigger>
                          <SelectContent>
                            {destinations.map((d) => (
                              <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-luxury-navy font-semibold">البرنامج *</Label>
                        <Select value={formData.programId} onValueChange={(v) => handleSelectChange("programId", v)} disabled={!formData.destinationId}>
                          <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="اختر البرنامج" /></SelectTrigger>
                          <SelectContent>
                            {filteredPrograms.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name} ({p.days} أيام / {p.nights} ليالي)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-luxury-navy font-semibold">تاريخ السفر *</Label>
                        <Input
                          type="date"
                          name="checkInDate"
                          value={formData.checkInDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split("T")[0]}
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div>
                        <Label className="text-luxury-navy font-semibold">تاريخ العودة</Label>
                        <Input type="date" value={formData.checkOutDate} disabled className="h-12 rounded-xl bg-gray-100" />
                      </div>
                    </div>

                    {selectedProgram && (
                      <div className="p-6 bg-luxury-teal/10 rounded-2xl border border-luxury-teal/30">
                        <h3 className="font-bold text-lg text-luxury-navy mb-2">{selectedProgram.name}</h3>
                        <p className="text-muted-foreground mb-3">
                          {selectedProgram.days} أيام / {selectedProgram.nights} ليالي
                        </p>
                        <p className="text-2xl font-bold text-luxury-teal">
                          {selectedProgram.price.toLocaleString()} ر.س
                          <span className="text-sm font-normal text-muted-foreground mr-1">/ للشخص</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-luxury-navy flex items-center gap-2">
                      <Users className="w-6 h-6 text-luxury-teal" />
                      عدد المسافرين
                    </h2>

                    {[
                      { key: "adults", label: "البالغين", desc: "12 سنة فما فوق" },
                      { key: "children", label: "الأطفال", desc: "2-11 سنة" },
                      { key: "infants", label: "الرضع", desc: "أقل من سنتين" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-6 bg-luxury-cream/50 rounded-2xl">
                        <div>
                          <p className="font-bold text-luxury-navy">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleNumberChange(item.key, -1)}
                            disabled={item.key === "adults" ? formData.adults <= 1 : (formData as any)[item.key] <= 0}
                            className="rounded-full"
                          >
                            -
                          </Button>
                          <span className="w-12 text-center font-bold text-luxury-navy text-lg">
                            {(formData as any)[item.key]}
                          </span>
                          <Button type="button" variant="outline" size="icon" onClick={() => handleNumberChange(item.key, 1)} className="rounded-full">
                            +
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-luxury-navy flex items-center gap-2">
                      <Phone className="w-6 h-6 text-luxury-teal" />
                      بيانات الاتصال
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-luxury-navy font-semibold">الاسم الأول *</Label>
                        <Input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="أحمد" className="h-12 rounded-xl" />
                      </div>
                      <div>
                        <Label className="text-luxury-navy font-semibold">اسم العائلة *</Label>
                        <Input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="العمري" className="h-12 rounded-xl" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-luxury-navy font-semibold">البريد الإلكتروني *</Label>
                        <Input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" className="h-12 rounded-xl" />
                      </div>
                      <div>
                        <Label className="text-luxury-navy font-semibold">رقم الجوال *</Label>
                        <Input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+966 5XX XXX XXX" className="h-12 rounded-xl" />
                      </div>
                    </div>

                    <div>
                      <Label className="text-luxury-navy font-semibold">طلبات خاصة (اختياري)</Label>
                      <Textarea name="specialRequests" value={formData.specialRequests} onChange={handleInputChange} placeholder="أي طلبات خاصة..." rows={3} className="rounded-xl" />
                    </div>
                  </div>
                )}

                {/* Step 4 */}
                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-luxury-navy flex items-center gap-2">
                      <CreditCard className="w-6 h-6 text-luxury-teal" />
                      مراجعة وتأكيد الحجز
                    </h2>

                    <div className="space-y-4">
                      <div className="p-6 bg-luxury-cream/50 rounded-2xl">
                        <h3 className="font-bold text-luxury-navy mb-2">البرنامج</h3>
                        <p className="text-luxury-navy">{selectedProgram?.name}</p>
                        <p className="text-sm text-muted-foreground">{formData.checkInDate} إلى {formData.checkOutDate}</p>
                      </div>

                      <div className="p-6 bg-luxury-cream/50 rounded-2xl">
                        <h3 className="font-bold text-luxury-navy mb-2">المسافرين</h3>
                        <p className="text-luxury-navy">
                          {formData.adults} بالغ
                          {formData.children > 0 && ` + ${formData.children} طفل`}
                          {formData.infants > 0 && ` + ${formData.infants} رضيع`}
                        </p>
                      </div>

                      <div className="p-6 bg-luxury-cream/50 rounded-2xl">
                        <h3 className="font-bold text-luxury-navy mb-2">بيانات الاتصال</h3>
                        <p className="text-luxury-navy">{formData.firstName} {formData.lastName}</p>
                        <p className="text-sm text-muted-foreground">{formData.email}</p>
                        <p className="text-sm text-muted-foreground">{formData.phone}</p>
                      </div>
                    </div>

                    <div className="p-6 bg-luxury-teal/10 rounded-2xl border border-luxury-teal/30">
                      <p className="text-sm text-muted-foreground mb-2">
                        بالضغط على "تأكيد الحجز" فإنك توافق على الشروط والأحكام وسياسة الإلغاء
                      </p>
                      <Link to="/terms" className="text-luxury-teal hover:underline text-sm font-semibold">
                        قراءة الشروط والأحكام
                      </Link>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  {step > 1 && (
                    <Button variant="outline" onClick={prevStep} className="rounded-full px-6">
                      <ArrowRight className="w-4 h-4 ml-2" />
                      السابق
                    </Button>
                  )}
                  <div className="mr-auto">
                    {step < 4 ? (
                      <Button onClick={nextStep} className="btn-luxury rounded-full px-8">
                        التالي
                        <ArrowLeft className="w-4 h-4 mr-2" />
                      </Button>
                    ) : (
                      <Button onClick={handleSubmit} disabled={loading} className="btn-gold rounded-full px-8">
                        {loading ? "جاري الحجز..." : "تأكيد الحجز"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-1">
              <div className="card-3d p-6 sticky top-24">
                <h3 className="text-xl font-bold text-luxury-navy mb-6">ملخص الحجز</h3>
                {selectedProgram ? (
                  <>
                    <div className="pb-6 mb-6 border-b border-border">
                      <p className="font-bold text-luxury-navy mb-1">{selectedProgram.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedProgram.days} أيام / {selectedProgram.nights} ليالي
                      </p>
                    </div>

                    <div className="space-y-3 text-sm mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{formData.adults} بالغ × {selectedProgram.price.toLocaleString()}</span>
                        <span className="font-semibold text-luxury-navy">{(selectedProgram.price * formData.adults).toLocaleString()} ر.س</span>
                      </div>
                      {formData.children > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{formData.children} طفل × {(selectedProgram.price * 0.7).toLocaleString()}</span>
                          <span className="font-semibold text-luxury-navy">{(selectedProgram.price * 0.7 * formData.children).toLocaleString()} ر.س</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ضريبة القيمة المضافة (15%)</span>
                        <span className="font-semibold text-luxury-navy">{(total * 0.15).toLocaleString()} ر.س</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">رسوم الخدمة</span>
                        <span className="font-semibold text-luxury-navy">50 ر.س</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg text-luxury-navy">الإجمالي</span>
                        <span className="font-bold text-3xl text-luxury-teal">
                          {(total + total * 0.15 + 50).toLocaleString()} <span className="text-lg">ر.س</span>
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-12">اختر برنامجاً لعرض التفاصيل</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default BookingPage;
