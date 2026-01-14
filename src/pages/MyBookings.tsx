import { useState, useEffect } from "react";
import { 
  Plane, Search, Calendar, Eye, X, Download, RefreshCw, 
  CheckCircle, Clock, XCircle, AlertCircle, Loader2, Filter,
  ChevronDown, ChevronUp, User, CreditCard, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSEO } from "@/hooks/useSEO";
import PageLayout from "@/layouts/PageLayout";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Booking {
  id: string;
  pnr: string;
  origin_code: string;
  origin_city: string;
  destination_code: string;
  destination_city: string;
  departure_date: string;
  return_date: string | null;
  total_passengers: number;
  total_price: number;
  currency: string;
  status: string;
  payment_status: string;
  contact_email: string;
  contact_first_name: string;
  contact_last_name: string;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  confirmed: { label: "مؤكد", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  ticketed: { label: "تم الإصدار", color: "bg-green-100 text-green-700", icon: CheckCircle },
  cancelled: { label: "ملغي", color: "bg-red-100 text-red-700", icon: XCircle },
  completed: { label: "مكتمل", color: "bg-gray-100 text-gray-700", icon: CheckCircle },
};

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  unpaid: { label: "غير مدفوع", color: "bg-red-100 text-red-700" },
  paid: { label: "مدفوع", color: "bg-green-100 text-green-700" },
  partial: { label: "مدفوع جزئياً", color: "bg-yellow-100 text-yellow-700" },
  refunded: { label: "مسترد", color: "bg-purple-100 text-purple-700" },
};

const MyBookings = () => {
  useSEO({
    title: "حجوزاتي | ترافليون",
    description: "إدارة حجوزات الطيران الخاصة بك",
  });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchPnr, setSearchPnr] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);

  // Demo bookings for testing
  const demoBookings: Booking[] = [
    {
      id: "1",
      pnr: "ABC123",
      origin_code: "RUH",
      origin_city: "الرياض",
      destination_code: "DXB",
      destination_city: "دبي",
      departure_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      return_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      total_passengers: 2,
      total_price: 2500,
      currency: "SAR",
      status: "confirmed",
      payment_status: "paid",
      contact_email: "user@example.com",
      contact_first_name: "محمد",
      contact_last_name: "أحمد",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      pnr: "XYZ789",
      origin_code: "JED",
      origin_city: "جدة",
      destination_code: "IST",
      destination_city: "إسطنبول",
      departure_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      return_date: null,
      total_passengers: 1,
      total_price: 3200,
      currency: "SAR",
      status: "pending",
      payment_status: "unpaid",
      contact_email: "user@example.com",
      contact_first_name: "سارة",
      contact_last_name: "علي",
      created_at: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Try to fetch from Supabase
      const { data, error } = await supabase
        .from("flight_bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || demoBookings);
    } catch (error) {
      // Use demo data if Supabase fails
      setBookings(demoBookings);
    }
    setLoading(false);
  };

  const filteredBookings = bookings.filter(b => {
    if (searchPnr && !b.pnr.toLowerCase().includes(searchPnr.toLowerCase())) return false;
    if (filterStatus && b.status !== filterStatus) return false;
    return true;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ar-SA", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("flight_bookings")
        .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
        .eq("id", bookingId);

      if (error) throw error;
      toast.success("تم إلغاء الحجز بنجاح");
      fetchBookings();
    } catch (error) {
      toast.error("حدث خطأ في إلغاء الحجز");
    }
  };

  return (
    <PageLayout>
      {/* Header */}
      <section className="bg-gradient-to-br from-luxury-navy to-[#0a3d5c] pt-32 pb-16">
        <div className="container px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">حجوزاتي</h1>
            <p className="text-xl text-white/70">إدارة ومتابعة جميع حجوزات الطيران</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container px-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="ابحث برقم الحجز (PNR)..."
                  value={searchPnr}
                  onChange={(e) => setSearchPnr(e.target.value)}
                  className="pr-10 w-64"
                />
              </div>
              
              <div className="flex items-center gap-2">
                {Object.entries(statusConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setFilterStatus(filterStatus === key ? null : key)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      filterStatus === key ? config.color : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    )}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={fetchBookings} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              تحديث
            </Button>
          </div>
        </div>
      </section>

      {/* Bookings List */}
      <section className="py-12">
        <div className="container px-4">
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-luxury-teal mx-auto mb-4" />
              <p className="text-gray-500">جاري تحميل الحجوزات...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-20">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">لا توجد حجوزات</h3>
              <p className="text-gray-500 mb-6">لم نجد أي حجوزات تطابق البحث</p>
              <Button onClick={() => window.location.href = "/amadeus-flights"} className="bg-luxury-teal">
                احجز رحلتك الآن
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => {
                const status = statusConfig[booking.status] || statusConfig.pending;
                const paymentStatus = paymentStatusConfig[booking.payment_status] || paymentStatusConfig.unpaid;
                const StatusIcon = status.icon;
                const isExpanded = expandedBooking === booking.id;

                return (
                  <div key={booking.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border">
                    {/* Main Row */}
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-6">
                        {/* PNR */}
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">رقم الحجز</div>
                          <div className="text-2xl font-bold text-luxury-teal">{booking.pnr}</div>
                        </div>

                        {/* Route */}
                        <div className="flex-1 flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold">{booking.origin_code}</div>
                            <div className="text-sm text-gray-500">{booking.origin_city}</div>
                          </div>
                          <div className="flex-1 flex items-center justify-center">
                            <div className="h-px bg-gray-300 flex-1" />
                            <Plane className="w-6 h-6 text-luxury-teal mx-2 rotate-[-90deg]" />
                            <div className="h-px bg-gray-300 flex-1" />
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">{booking.destination_code}</div>
                            <div className="text-sm text-gray-500">{booking.destination_city}</div>
                          </div>
                        </div>

                        {/* Date */}
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">تاريخ السفر</div>
                          <div className="font-bold">{formatDate(booking.departure_date)}</div>
                        </div>

                        {/* Passengers */}
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">المسافرين</div>
                          <div className="font-bold flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {booking.total_passengers}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">السعر</div>
                          <div className="text-xl font-bold text-luxury-gold">
                            {booking.total_price.toLocaleString()} {booking.currency}
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex flex-col gap-2">
                          <span className={cn("px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1", status.color)}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                          <span className={cn("px-3 py-1 rounded-full text-xs font-medium", paymentStatus.color)}>
                            {paymentStatus.label}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpandedBooking(isExpanded ? null : booking.id)}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t bg-gray-50 p-6">
                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <h4 className="font-bold mb-3 flex items-center gap-2">
                              <User className="w-5 h-5 text-luxury-teal" />
                              معلومات التواصل
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p><strong>الاسم:</strong> {booking.contact_first_name} {booking.contact_last_name}</p>
                              <p><strong>البريد:</strong> {booking.contact_email}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-bold mb-3 flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-luxury-teal" />
                              تفاصيل الرحلة
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p><strong>المغادرة:</strong> {formatDate(booking.departure_date)}</p>
                              {booking.return_date && (
                                <p><strong>العودة:</strong> {formatDate(booking.return_date)}</p>
                              )}
                              <p><strong>تاريخ الحجز:</strong> {formatDate(booking.created_at)}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-bold mb-3 flex items-center gap-2">
                              <CreditCard className="w-5 h-5 text-luxury-teal" />
                              الإجراءات
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              <Button size="sm" variant="outline" className="flex items-center gap-1">
                                <Download className="w-4 h-4" />
                                تحميل التذكرة
                              </Button>
                              {booking.status === "pending" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-300 hover:bg-red-50"
                                  onClick={() => handleCancelBooking(booking.id)}
                                >
                                  <X className="w-4 h-4 ml-1" />
                                  إلغاء الحجز
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default MyBookings;
