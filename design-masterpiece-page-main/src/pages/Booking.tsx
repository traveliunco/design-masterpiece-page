// src/pages/Booking.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Program = Database["public"]["Tables"]["programs"]["Row"];
type Hotel = Database["public"]["Tables"]["hotels"]["Row"];

type BookingForm = {
  bookingType: "program" | "hotel_only";
  programId?: string;
  hotelId?: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
};

const BookingPage = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [form, setForm] = useState<BookingForm>({
    bookingType: "program",
    checkInDate: "",
    checkOutDate: "",
    adults: 1,
    children: 0,
  });
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Load programs & hotels once
  useEffect(() => {
    const fetchData = async () => {
      const { data: progData, error: progErr } = await supabase
        .from("programs")
        .select("*");
      if (!progErr && progData) setPrograms(progData as Program[]);

      const { data: hotelData, error: hotelErr } = await supabase
        .from("hotels")
        .select("*");
      if (!hotelErr && hotelData) setHotels(hotelData as Hotel[]);
    };
    fetchData();
  }, []);

  // Simple price calculation (demo purpose)
  useEffect(() => {
    let total = 0;
    if (form.bookingType === "program" && form.programId) {
      const prog = programs.find((p) => p.id === form.programId);
      if (prog) total = Number(prog.base_price);
    } else if (form.bookingType === "hotel_only" && form.hotelId) {
      const hotel = hotels.find((h) => h.id === form.hotelId);
      if (hotel) total = Number(hotel.average_rating) * 100; // placeholder logic
    }
    // Add per‑person surcharge
    total += form.adults * 100 + form.children * 50;
    setPrice(total);
  }, [form, programs, hotels]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "adults" || name === "children" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload: any = {
      booking_type: form.bookingType,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      check_in_date: form.checkInDate,
      check_out_date: form.checkOutDate,
      adults_count: form.adults,
      children_count: form.children,
      subtotal: price,
      total_amount: price,
      currency: "SAR",
      status: "pending",
      payment_status: "pending",
    };
    if (form.bookingType === "program") payload.program_id = form.programId;
    if (form.bookingType === "hotel_only") payload.hotel_id = form.hotelId;

    const { data, error } = await supabase.from("bookings").insert([payload]);
    setLoading(false);
    if (error) {
      alert("خطأ في إنشاء الحجز: " + error.message);
    } else {
      // redirect to a confirmation page (placeholder)
      navigate("/bookings/confirmation");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-12">
        <h1 className="text-3xl font-bold text-primary-foreground mb-8 text-center">
          حجز رحلتك
        </h1>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-card p-6 rounded-xl shadow-lg">
          {/* Booking type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">نوع الحجز</label>
            <Select name="bookingType" value={form.bookingType} onValueChange={(v) => setForm((p) => ({ ...p, bookingType: v as any }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر نوع الحجز" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="program">برنامج سياحي</SelectItem>
                <SelectItem value="hotel_only">فندق فقط</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional selects */}
          {form.bookingType === "program" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">البرنامج</label>
              <Select name="programId" value={form.programId || ""} onValueChange={(v) => setForm((p) => ({ ...p, programId: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر برنامج" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {form.bookingType === "hotel_only" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">الفندق</label>
              <Select name="hotelId" value={form.hotelId || ""} onValueChange={(v) => setForm((p) => ({ ...p, hotelId: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر فندق" />
                </SelectTrigger>
                <SelectContent>
                  {hotels.map((h) => (
                    <SelectItem key={h.id} value={h.id}>
                      {h.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">تاريخ الدخول</label>
              <Input type="date" name="checkInDate" value={form.checkInDate} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">تاريخ الخروج</label>
              <Input type="date" name="checkOutDate" value={form.checkOutDate} onChange={handleChange} required />
            </div>
          </div>

          {/* Travelers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">عدد البالغين</label>
              <Input type="number" name="adults" min={1} value={form.adults} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">عدد الأطفال</label>
              <Input type="number" name="children" min={0} value={form.children} onChange={handleChange} />
            </div>
          </div>

          {/* Price preview */}
          <div className="text-center text-xl font-semibold text-primary-foreground">
            السعر الإجمالي: <span className="text-primary">{price.toLocaleString()} SAR</span>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "جاري الحجز..." : "إرسال الحجز"}
          </Button>
        </form>
        <div className="mt-8 text-center">
          <Link to="/" className="text-primary hover:underline">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingPage;
