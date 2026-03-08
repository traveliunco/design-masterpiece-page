import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane, Search, Calendar, X, Download, RefreshCw,
  CheckCircle, Clock, XCircle, AlertCircle, Loader2,
  ChevronDown, ChevronUp, User, CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSEO } from "@/hooks/useSEO";
import PageLayout from "@/layouts/PageLayout";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
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
  useSEO({ title: "حجوزاتي | ترافليون", description: "إدارة حجوزات الطيران الخاصة بك" });

  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchPnr, setSearchPnr] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("flight_bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch {
      setBookings([]);
    }
    setLoading(false);
  };

  const filteredBookings = bookings.filter(b => {
    if (searchPnr && !b.pnr.toLowerCase().includes(searchPnr.toLowerCase())) return false;
    if (filterStatus && b.status !== filterStatus) return false;
    return true;
  });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("ar-SA", { weekday: "short", year: "numeric", month: "short", day: "numeric" });

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("flight_bookings")
        .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
        .eq("id", bookingId);
      if (error) throw error;
      toast.success("تم إلغاء الحجز بنجاح");
      fetchBookings();
    } catch {
      toast.error("حدث خطأ في إلغاء الحجز");
    }
  };

  return (
    <PageLayout pageTitle="حجوزاتي">
      {/* Header */}
      <section className="bg-gradient-to-br from-luxury-navy to-[#0a3d5c] pt-4 md:pt-32 pb-8 md:pb-16">
        <div className="container px-4">
          <div className="text-center text-white">
            <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4">حجوزاتي</h1>
            <p className="text-sm md:text-xl text-white/70">إدارة ومتابعة جميع حجوزات الطيران</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 md:py-8 bg-muted/30 border-b">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="ابحث برقم الحجز..." value={searchPnr} onChange={e => setSearchPnr(e.target.value)} className="pr-10" />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {Object.entries(statusConfig).map(([key, config]) => (
                  <button key={key} onClick={() => setFilterStatus(filterStatus === key ? null : key)}
                    className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                      filterStatus === key ? config.color : "bg-muted text-muted-foreground hover:bg-muted/80")}>
                    {config.label}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={fetchBookings} variant="outline" size="sm" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> تحديث
            </Button>
          </div>
        </div>
      </section>

      {/* Bookings List */}
      <section className="py-6 md:py-12">
        <div className="container px-4">
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">جاري تحميل الحجوزات...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-20">
              <AlertCircle className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">لا توجد حجوزات</h3>
              <p className="text-muted-foreground mb-6">
                {bookings.length === 0 ? "لم تقم بأي حجز بعد" : "لم نجد حجوزات تطابق البحث"}
              </p>
              <Button onClick={() => navigate("/amadeus-flights")}>احجز رحلتك الآن</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map(booking => {
                const status = statusConfig[booking.status] || statusConfig.pending;
                const paymentStatus = paymentStatusConfig[booking.payment_status] || paymentStatusConfig.unpaid;
                const StatusIcon = status.icon;
                const isExpanded = expandedBooking === booking.id;

                return (
                  <div key={booking.id} className="bg-card rounded-2xl shadow-sm overflow-hidden border">
                    <div className="p-4 md:p-6">
                      <div className="flex flex-wrap items-center gap-4 md:gap-6">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">رقم الحجز</div>
                          <div className="text-lg md:text-2xl font-bold text-primary">{booking.pnr}</div>
                        </div>
                        <div className="flex-1 flex items-center gap-3 md:gap-4">
                          <div className="text-center">
                            <div className="text-lg md:text-2xl font-bold">{booking.origin_code}</div>
                            <div className="text-xs text-muted-foreground">{booking.origin_city}</div>
                          </div>
                          <div className="flex-1 flex items-center justify-center">
                            <div className="h-px bg-border flex-1" />
                            <Plane className="w-5 h-5 text-primary mx-2 rotate-[-90deg]" />
                            <div className="h-px bg-border flex-1" />
                          </div>
                          <div className="text-center">
                            <div className="text-lg md:text-2xl font-bold">{booking.destination_code}</div>
                            <div className="text-xs text-muted-foreground">{booking.destination_city}</div>
                          </div>
                        </div>
                        <div className="text-center hidden md:block">
                          <div className="text-xs text-muted-foreground mb-1">تاريخ السفر</div>
                          <div className="font-bold text-sm">{formatDate(booking.departure_date)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">السعر</div>
                          <div className="text-lg font-bold text-primary">{booking.total_price.toLocaleString()} {booking.currency}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1", status.color)}>
                            <StatusIcon className="w-3 h-3" />{status.label}
                          </span>
                          <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", paymentStatus.color)}>{paymentStatus.label}</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setExpandedBooking(isExpanded ? null : booking.id)}>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="border-t bg-muted/30 p-4 md:p-6">
                        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                          <div>
                            <h4 className="font-bold mb-2 flex items-center gap-2"><User className="w-4 h-4 text-primary" /> معلومات التواصل</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>الاسم:</strong> {booking.contact_first_name} {booking.contact_last_name}</p>
                              <p><strong>البريد:</strong> {booking.contact_email}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2 flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> تفاصيل الرحلة</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>المغادرة:</strong> {formatDate(booking.departure_date)}</p>
                              {booking.return_date && <p><strong>العودة:</strong> {formatDate(booking.return_date)}</p>}
                              <p><strong>المسافرين:</strong> {booking.total_passengers}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2 flex items-center gap-2"><CreditCard className="w-4 h-4 text-primary" /> الإجراءات</h4>
                            <div className="flex flex-wrap gap-2">
                              <Button size="sm" variant="outline"><Download className="w-4 h-4 ml-1" /> تحميل التذكرة</Button>
                              {booking.status === "pending" && (
                                <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10"
                                  onClick={() => handleCancelBooking(booking.id)}>
                                  <X className="w-4 h-4 ml-1" /> إلغاء
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
