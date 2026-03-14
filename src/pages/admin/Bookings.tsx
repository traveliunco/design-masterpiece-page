import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CalendarCheck,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Booking {
  id: string;
  booking_reference: string;
  booking_type: string;
  status: string;
  payment_status: string;
  check_in_date: string;
  check_out_date: string;
  adults_count: number;
  children_count: number;
  total_amount: number;
  created_at: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
}

const AdminBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          user:users(id, first_name, last_name, email, phone)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings((data || []) as unknown as Booking[]);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("حدث خطأ في تحميل الحجوزات");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const customerName = booking.user ? `${booking.user.first_name} ${booking.user.last_name}` : "عميل غير معروف";
    const matchesSearch =
      booking.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || booking.payment_status === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      cancelled: "bg-red-100 text-red-700",
      completed: "bg-gray-100 text-gray-700",
    };
    const labels: Record<string, string> = {
      confirmed: "مؤكد",
      pending: "في الانتظار",
      processing: "قيد المعالجة",
      cancelled: "ملغي",
      completed: "مكتمل",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPaymentBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      partial: "bg-orange-100 text-orange-700",
      refunded: "bg-gray-100 text-gray-700",
      failed: "bg-red-100 text-red-700",
    };
    const labels: Record<string, string> = {
      paid: "مدفوع",
      pending: "غير مدفوع",
      partial: "جزئي",
      refunded: "مسترد",
      failed: "فشل",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      loadBookings();
      toast.success("تم تحديث حالة الحجز");
    } catch (error) {
      toast.error("حدث خطأ في التحديث");
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الحجز؟")) return;

    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", id);

      if (error) throw error;
      loadBookings();
      toast.success("تم حذف الحجز");
    } catch (error) {
      toast.error("حدث خطأ في الحذف");
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarCheck className="w-7 h-7 text-primary" />
            إدارة الحجوزات
          </h1>
          <p className="text-muted-foreground">
            عرض وإدارة جميع الحجوزات ({filteredBookings.length} حجز)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
          <Button size="sm">
            <CalendarCheck className="w-4 h-4 ml-2" />
            إضافة حجز
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث برقم الحجز، العميل، أو الوجهة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="حالة الحجز" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="confirmed">مؤكد</SelectItem>
                <SelectItem value="processing">قيد المعالجة</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="حالة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="paid">مدفوع</SelectItem>
                <SelectItem value="pending">غير مدفوع</SelectItem>
                <SelectItem value="partial">جزئي</SelectItem>
                <SelectItem value="refunded">مسترد</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" aria-label="تحديث">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">جاري تحميل الحجوزات...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">رقم الحجز</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">العميل</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">النوع / المرجع</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">التاريخ</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">المسافرين</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الحالة</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الدفع</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">المبلغ</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm font-medium text-primary">
                          {booking.booking_reference}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-sm">{booking.user?.full_name || "عميل خارجي"}</p>
                          <p className="text-xs text-muted-foreground">{booking.user?.phone || "-"}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-sm uppercase">{booking.booking_type}</p>
                          <p className="text-xs text-muted-foreground">ID: {booking.id.slice(0, 8)}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm">{booking.check_in_date}</p>
                          <p className="text-xs text-muted-foreground">إلى {booking.check_out_date}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {booking.adults_count} بالغ
                        {booking.children_count > 0 && ` + ${booking.children_count} طفل`}
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(booking.status)}</td>
                      <td className="py-4 px-4">{getPaymentBadge(booking.payment_status)}</td>
                      <td className="py-4 px-4 font-medium text-sm">
                        {booking.total_amount?.toLocaleString()} ر.س
                      </td>
                      <td className="py-4 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="خيارات">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "confirmed")}>
                              <Eye className="w-4 h-4 ml-2" />
                              تأكيد الحجز
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "processing")}>
                              <Edit className="w-4 h-4 ml-2" />
                              قيد المعالجة
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "completed")}>
                              <CalendarCheck className="w-4 h-4 ml-2" />
                              مكتمل
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "cancelled")}>
                              <Trash2 className="w-4 h-4 ml-2 text-orange-600" />
                              إلغاء
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => deleteBooking(booking.id)}>
                              <Trash2 className="w-4 h-4 ml-2" />
                              حذف نهائي
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredBookings.length === 0 && (
            <div className="text-center py-20">
              <CalendarCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-bold mb-2">لا توجد حجوزات لعرضها</h3>
              <p className="text-muted-foreground">لم يتم العثور على أي بيانات مطابقة لخيارات البحث</p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              عرض 1-{filteredBookings.length} من {bookings.length} حجز
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                السابق
              </Button>
              <Button variant="outline" size="sm" disabled>
                التالي
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBookings;
