import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
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

  const getStartDate = () => {
    const now = new Date();
    const startDate = new Date();
    if (period === "7days") startDate.setDate(now.getDate() - 7);
    else if (period === "30days") startDate.setDate(now.getDate() - 30);
    else if (period === "90days") startDate.setDate(now.getDate() - 90);
    else if (period === "year") startDate.setFullYear(now.getFullYear() - 1);
    return startDate;
  };

  const loadReports = async () => {
    setLoading(true);
    try {
      const startDate = getStartDate();
      const startISO = startDate.toISOString();

      // Parallel fetches
      const [
        bookingsRes,
        confirmedRes,
        profilesRes,
        destinationsRes,
        paymentsRes,
        allBookingsRes,
      ] = await Promise.all([
        supabase.from("bookings").select("*", { count: "exact" }).gte("created_at", startISO),
        supabase.from("bookings").select("total_amount").eq("status", "confirmed").gte("created_at", startISO),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("destinations").select("*", { count: "exact", head: true }),
        supabase.from("payments").select("payment_method, amount").eq("status", "completed").gte("created_at", startISO),
        // For monthly aggregation and top destinations
        supabase.from("bookings").select("created_at, total_amount, program_id, status").gte("created_at", startISO),
      ]);

      const totalRevenue = confirmedRes.data?.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0) || 0;

      // Aggregate payments by method
      const paymentsByMethod: Record<string, number> = {};
      paymentsRes.data?.forEach(p => {
        paymentsByMethod[p.payment_method] = (paymentsByMethod[p.payment_method] || 0) + Number(p.amount || 0);
      });

      // Monthly aggregation
      const monthlyMap: Record<string, { count: number; revenue: number }> = {};
      allBookingsRes.data?.forEach(b => {
        const date = new Date(b.created_at);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (!monthlyMap[key]) monthlyMap[key] = { count: 0, revenue: 0 };
        monthlyMap[key].count++;
        if (b.status === "confirmed") monthlyMap[key].revenue += Number(b.total_amount) || 0;
      });
      const bookingsByMonth = Object.entries(monthlyMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, data]) => ({ month, ...data }));

      // Top destinations via program_id counts
      const programCounts: Record<string, number> = {};
      allBookingsRes.data?.forEach(b => {
        if (b.program_id) {
          programCounts[b.program_id] = (programCounts[b.program_id] || 0) + 1;
        }
      });

      // Fetch program names for top programs
      const topProgramIds = Object.entries(programCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id]) => id);

      let topDestinations: { name: string; bookings: number }[] = [];
      if (topProgramIds.length > 0) {
        const { data: programs } = await supabase
          .from("programs")
          .select("id, name_ar")
          .in("id", topProgramIds);

        topDestinations = topProgramIds.map(pid => {
          const prog = programs?.find(p => p.id === pid);
          return { name: prog?.name_ar || "برنامج محذوف", bookings: programCounts[pid] };
        });
      }

      // If no program-linked bookings, show top destinations by total_reviews
      if (topDestinations.length === 0) {
        const { data: dests } = await supabase
          .from("destinations")
          .select("name_ar, total_reviews")
          .eq("is_active", true)
          .order("total_reviews", { ascending: false })
          .limit(5);
        topDestinations = dests?.map(d => ({ name: d.name_ar, bookings: d.total_reviews || 0 })) || [];
      }

      setStats({
        totalBookings: bookingsRes.count || 0,
        totalRevenue,
        totalUsers: profilesRes.count || 0,
        totalDestinations: destinationsRes.count || 0,
        bookingsByMonth,
        topDestinations,
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
    const csvRows = [
      ["التقرير", "القيمة"],
      ["إجمالي الحجوزات", stats.totalBookings.toString()],
      ["إجمالي الإيرادات (ر.س)", stats.totalRevenue.toString()],
      ["إجمالي العملاء", stats.totalUsers.toString()],
      ["إجمالي الوجهات", stats.totalDestinations.toString()],
      [],
      ["الشهر", "عدد الحجوزات", "الإيرادات (ر.س)"],
      ...stats.bookingsByMonth.map(m => [m.month, m.count.toString(), m.revenue.toString()]),
      [],
      ["الوجهة/البرنامج", "عدد الحجوزات"],
      ...stats.topDestinations.map(d => [d.name, d.bookings.toString()]),
      [],
      ["طريقة الدفع", "المبلغ (ر.س)"],
      ...stats.revenueByPaymentMethod.map(p => [p.method, p.amount.toString()]),
    ];

    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `traveliun-report-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("تم تصدير التقرير الشامل");
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

  const getMonthLabel = (month: string) => {
    const [y, m] = month.split("-");
    const months = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
    return `${months[parseInt(m) - 1]} ${y}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">جاري تحميل التقارير...</p>
      </div>
    );
  }

  const maxMonthlyCount = Math.max(...stats.bookingsByMonth.map(m => m.count), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-primary" />
            التقارير والإحصائيات
          </h1>
          <p className="text-muted-foreground">تحليل أداء الأعمال والمبيعات</p>
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
          <Button variant="outline" onClick={loadReports}>
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
          <Button onClick={exportReport}>
            <Download className="w-4 h-4 ml-2" />
            تصدير CSV
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

      {/* Monthly Bookings Chart */}
      {stats.bookingsByMonth.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>الحجوزات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-48">
              {stats.bookingsByMonth.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold text-primary">{m.count}</span>
                  <div
                    className="w-full bg-primary/80 rounded-t-md transition-all min-h-[4px]"
                    style={{ height: `${(m.count / maxMonthlyCount) * 100}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground text-center leading-tight">
                    {getMonthLabel(m.month).split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Destinations */}
        <Card>
          <CardHeader>
            <CardTitle>الأكثر حجزاً</CardTitle>
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
              <div className="text-center py-8 text-muted-foreground">لا توجد بيانات كافية</div>
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
              <div className="text-center py-8 text-muted-foreground">لا توجد بيانات كافية</div>
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
              <p className="text-sm text-muted-foreground">الأكثر طلباً</p>
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
