import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, Calendar, Users, MapPin, Download, Phone, Mail, Home, Sparkles } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import { Button } from "@/components/ui/button";
import { getBookingByReference } from "@/integrations/supabase/bookings";
import type { Booking } from "@/integrations/supabase/bookings";
import { useSEO } from "@/hooks/useSEO";

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("ref");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: "تأكيد الحجز - ترافليون",
    description: "تم استلام حجزك بنجاح",
    keywords: "تأكيد حجز, حجز, سياحة",
  });

  useEffect(() => {
    const fetchBooking = async () => {
      if (!reference) {
        setLoading(false);
        return;
      }

      try {
        const data = await getBookingByReference(reference);
        setBooking(data);
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [reference]);

  if (loading) {
    return (
      <PageLayout>
        <div className="container py-32 text-center">
          <div className="w-16 h-16 border-4 border-luxury-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل تفاصيل الحجز...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Success Hero */}
      <section className="relative py-20 bg-gradient-to-br from-emerald-500 to-teal-700 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-luxury-gold/20 rounded-full blur-[100px]" />
        </div>
        <div className="container px-4 relative z-10 text-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-teal">
            <Check className="w-14 h-14 text-emerald-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            تم استلام حجزك بنجاح! 🎉
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            شكراً لاختيارك ترافليون. سيتواصل معك أحد ممثلي خدمة العملاء خلال 24 ساعة لتأكيد الحجز.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 -mt-16 relative z-20">
        <div className="container px-4 max-w-4xl">
          {/* Booking Reference */}
          <div className="card-3d p-8 text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-luxury-teal/10 text-luxury-teal px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">رقم الحجز المرجعي</span>
            </div>
            <p className="text-5xl font-bold text-luxury-teal tracking-wider mb-4">
              {reference || booking?.booking_reference || "---"}
            </p>
            <p className="text-sm text-muted-foreground">
              يرجى الاحتفاظ بهذا الرقم للمراجعة
            </p>
          </div>

          {/* Booking Details */}
          {booking && (
            <div className="card-3d p-8 mb-8">
              <h2 className="text-2xl font-bold text-luxury-navy mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-luxury-teal" />
                تفاصيل الحجز
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 bg-luxury-cream/30 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-luxury-teal" />
                    <p className="font-bold text-luxury-navy">تاريخ السفر</p>
                  </div>
                  <p className="text-muted-foreground pr-8">
                    {new Date(booking.check_in_date).toLocaleDateString('ar-SA', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="p-5 bg-luxury-cream/30 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-luxury-teal" />
                    <p className="font-bold text-luxury-navy">تاريخ العودة</p>
                  </div>
                  <p className="text-muted-foreground pr-8">
                    {new Date(booking.check_out_date).toLocaleDateString('ar-SA', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="p-5 bg-luxury-cream/30 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-luxury-teal" />
                    <p className="font-bold text-luxury-navy">عدد المسافرين</p>
                  </div>
                  <p className="text-muted-foreground pr-8">
                    {booking.adults_count} بالغ
                    {booking.children_count > 0 && ` + ${booking.children_count} طفل`}
                    {booking.infants_count > 0 && ` + ${booking.infants_count} رضيع`}
                  </p>
                </div>

                <div className="p-5 bg-luxury-cream/30 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-luxury-teal" />
                    <p className="font-bold text-luxury-navy">نوع الحجز</p>
                  </div>
                  <p className="text-muted-foreground pr-8">
                    {booking.booking_type === 'program' ? 'برنامج سياحي' : 'فندق فقط'}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-bold text-luxury-navy">المبلغ الإجمالي</span>
                  <span className="text-3xl font-bold text-luxury-teal">
                    {booking.total_amount.toLocaleString()} <span className="text-lg">{booking.currency}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  <p className="text-sm text-muted-foreground">
                    حالة الحجز: <span className="text-yellow-600 font-semibold">في انتظار التأكيد</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="card-3d p-8 mb-8">
            <h2 className="text-2xl font-bold text-luxury-navy mb-6">الخطوات التالية</h2>
            <div className="space-y-5">
              {[
                "سيتصل بك أحد ممثلي خدمة العملاء لتأكيد الحجز",
                "سيتم إرسال رابط الدفع عبر الواتساب أو البريد الإلكتروني",
                "بعد إتمام الدفع، ستتلقى تأكيد الحجز النهائي",
                "قبل موعد السفر بأسبوع، سنرسل لك برنامج الرحلة التفصيلي",
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-luxury-teal rounded-full flex items-center justify-center flex-shrink-0 shadow-glow-teal">
                    <span className="text-sm font-bold text-white">{index + 1}</span>
                  </div>
                  <p className="text-luxury-navy leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="card-3d p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-luxury-navy mb-2">تواصل معنا</h3>
              <p className="text-sm text-muted-foreground mb-4">
                للاستفسارات أو تعديل الحجز
              </p>
              <a href="https://api.whatsapp.com/send?phone=966569222111" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Phone className="w-4 h-4 ml-2" />
                  واتساب: 966569222111
                </Button>
              </a>
            </div>

            <div className="card-3d p-6 text-center">
              <div className="w-16 h-16 bg-luxury-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-luxury-teal" />
              </div>
              <h3 className="font-bold text-luxury-navy mb-2">البريد الإلكتروني</h3>
              <p className="text-sm text-muted-foreground mb-4">
                سنرسل لك تفاصيل الحجز
              </p>
              <a href="mailto:booking@traveliun.com">
                <Button variant="outline" className="w-full border-luxury-teal text-luxury-teal hover:bg-luxury-teal/10">
                  <Mail className="w-4 h-4 ml-2" />
                  booking@traveliun.com
                </Button>
              </a>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link to="/">
              <Button className="btn-luxury px-10 py-5 text-lg">
                <Home className="w-5 h-5 ml-2" />
                العودة إلى الصفحة الرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default BookingConfirmation;
