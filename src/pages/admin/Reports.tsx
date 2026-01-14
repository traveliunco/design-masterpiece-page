import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CalendarCheck,
  MapPin,
  Download,
  Loader2,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReportStats {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  totalDestinations: number;
  bookingsByMonth: { month: string; count: number; revenue: number }[];
  topDestinations: { name: string; bookings: number }[];
  revenueByPaymentMethod: { method: string; amount: number }[];
}

const AdminReports = () => {
  const [period, setPeriod] = useState("30days");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReportStats>({
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalDestinations: 0,
    bookingsByMonth: [],
    topDestinations: [],
    revenueByPaymentMethod: [],
  });

  useEffect(() => {
    loadReports();
  }, [period]);

  const loadReports = async () => {
    setLoading(true);
    try {
      // Get date range based on period
      const now = new Date();
      let startDate = new Date();
      if (period === "7days") startDate.setDate(now.getDate() - 7);
      else if (period === "30days") startDate.setDate(now.getDate() - 30);
      else if (period === "90days") startDate.setDate(now.getDate() - 90);
      else if (period === "year") startDate.setFullYear(now.getFullYear() - 1);

      // Fetch bookings
      const { data: bookings, count: bookingsCount } = await supabase
        .from("bookings")
        .select("*", { count: "exact" })
        .gte("created_at", startDate.toISOString());

      // Fetch confirmed bookings for revenue
      const { data: confirmedBookings } = await supabase
        .from("bookings")
        .select("total_amount")
        .eq("status", "confirmed")
        .gte("created_at", startDate.toISOString());

      const totalRevenue = confirmedBookings?.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0) || 0;

      // Fetch users count
      const { count: usersCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      // Fetch destinations count
      const { count: destinationsCount } = await supabase
        .from("destinations")
        .select("*", { count: "exact", head: true });

      // Fetch top destinations
      const { data: destinations } = await supabase
        .from("destinations")
        .select("name_ar, total_bookings")
        .order("total_bookings", { ascending: false })
        .limit(5);

      // Fetch payments by method
      const { data: payments } = await supabase
        .from("payments")
        .select("payment_method, amount")
        .eq("payment_status", "completed")
        .gte("created_at", startDate.toISOString());

      // Aggregate payments by method
      const paymentsByMethod: Record<string, number> = {};
      payments?.forEach(p => {
        paymentsByMethod[p.payment_method] = (paymentsByMethod[p.payment_method] || 0) + (p.amount || 0);
      });

      setStats({
        totalBookings: bookingsCount || 0,
        totalRevenue,
        totalUsers: usersCount || 0,
        totalDestinations: destinationsCount || 0,
        bookingsByMonth: [], // Would need more complex query
        topDestinations: destinations?.map(d => ({ name: d.name_ar, bookings: d.total_bookings || 0 })) || [],
        revenueByPaymentMethod: Object.entries(paymentsByMethod).map(([method, amount]) => ({ method, amount })),
      });
    } catch (error) {
      console.error("Error loading reports:", error);
      toast.error("حدث خطأ في تحميل التقارير");
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // Create CSV data
    const csvData = [
      ["التقرير", "القيمة"],
      ["إجمالي الحجوزات", stats.totalBookings.toString()],
      ["إجمالي الإيرادات", stats.totalRevenue.toString()],
      ["إجمالي العملاء", stats.totalUsers.toString()],
      ["إجمالي الوجهات", stats.totalDestinations.toString()],
    ];

    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `traveliun-report-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("تم تصدير التقرير");
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      credit_card: "بطاقة ائتمان",
      bank_transfer: "تحويل بنكي",
      cash: "نقدي",
      tabby: "Tabby",
      tamara: "Tamara",
    };
    return labels[method] || method;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">جاري تحميل التقارير...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-primary" />
            التقارير والإحصائيات
          </h1>
          <p className="text-muted-foreground">
            تحليل أداء الأعمال والمبيعات
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 ml-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">آخر 7 أيام</SelectItem>
              <SelectItem value="30days">آخر 30 يوم</SelectItem>
              <SelectItem value="90days">آخر 90 يوم</SelectItem>
              <SelectItem value="year">السنة الماضية</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadReports} aria-label="تحديث">
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
          <Button onClick={exportReport}>
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الحجوزات</p>
                <p className="text-3xl font-bold mt-1">{stats.totalBookings}</p>
                <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CalendarCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">الإيرادات</p>
                <p className="text-3xl font-bold mt-1">{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">ر.س</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">العملاء</p>
                <p className="text-3xl font-bold mt-1">{stats.totalUsers}</p>
                <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+8%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">الوجهات</p>
                <p className="text-3xl font-bold mt-1">{stats.totalDestinations}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Destinations */}
        <Card>
          <CardHeader>
            <CardTitle>الوجهات الأكثر حجزاً</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.topDestinations.length > 0 ? (
              stats.topDestinations.map((dest, index) => (
                <div key={dest.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{dest.name}</span>
                      <span className="text-sm text-muted-foreground">{dest.bookings} حجز</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(dest.bookings / (stats.topDestinations[0]?.bookings || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد بيانات كافية
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>الإيرادات حسب طريقة الدفع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.revenueByPaymentMethod.length > 0 ? (
              stats.revenueByPaymentMethod.map((item) => (
                <div key={item.method} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">{getPaymentMethodLabel(item.method)}</span>
                  <span className="text-lg font-bold text-primary">{item.amount.toLocaleString()} ر.س</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد بيانات كافية
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Insights */}
      <Card>
        <CardHeader>
          <CardTitle>نظرة سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {stats.totalBookings > 0 ? Math.round(stats.totalRevenue / stats.totalBookings) : 0}
              </p>
              <p className="text-sm text-muted-foreground">متوسط قيمة الحجز</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {stats.totalUsers > 0 ? (stats.totalBookings / stats.totalUsers).toFixed(1) : 0}
              </p>
              <p className="text-sm text-muted-foreground">معدل الحجز/عميل</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {stats.topDestinations[0]?.name || "-"}
              </p>
              <p className="text-sm text-muted-foreground">الوجهة الأكثر طلباً</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {stats.revenueByPaymentMethod[0] ? getPaymentMethodLabel(stats.revenueByPaymentMethod[0].method) : "-"}
              </p>
              <p className="text-sm text-muted-foreground">طريقة الدفع الأكثر</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
