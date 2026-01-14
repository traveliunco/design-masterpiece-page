import { useEffect, useState } from "react";
import {
  CalendarCheck,
  TrendingUp,
  Users,
  DollarSign,
  MapPin,
  Plane,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  Eye,
  Clock,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Stat Card Component
const StatCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: React.ElementType;
  color: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          <div className={`flex items-center gap-1 mt-2 text-sm ${
            changeType === "up" ? "text-green-600" : "text-red-600"
          }`}>
            {changeType === "up" ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            <span>{change}</span>
            <span className="text-muted-foreground">من الشهر الماضي</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Recent Bookings Table
const RecentBookings = () => {
  const bookings = [
    { id: "TRV251229001", customer: "أحمد محمد", destination: "ماليزيا", date: "2025-01-15", status: "confirmed", amount: "5,999" },
    { id: "TRV251228045", customer: "سارة أحمد", destination: "تايلاند", date: "2025-01-20", status: "pending", amount: "4,499" },
    { id: "TRV251228032", customer: "محمد علي", destination: "تركيا", date: "2025-02-01", status: "confirmed", amount: "3,999" },
    { id: "TRV251227089", customer: "فاطمة خالد", destination: "المالديف", date: "2025-01-25", status: "processing", amount: "12,999" },
    { id: "TRV251227056", customer: "عبدالله سعد", destination: "جورجيا", date: "2025-02-10", status: "confirmed", amount: "2,999" },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      cancelled: "bg-red-100 text-red-700",
    };
    const labels: Record<string, string> = {
      confirmed: "مؤكد",
      pending: "في الانتظار",
      processing: "قيد المعالجة",
      cancelled: "ملغي",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>أحدث الحجوزات</CardTitle>
        <Link to="/admin/bookings">
          <Button variant="outline" size="sm">عرض الكل</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">رقم الحجز</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">العميل</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">الوجهة</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">التاريخ</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">الحالة</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">المبلغ</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-3 px-2 text-sm font-medium">{booking.id}</td>
                  <td className="py-3 px-2 text-sm">{booking.customer}</td>
                  <td className="py-3 px-2 text-sm">{booking.destination}</td>
                  <td className="py-3 px-2 text-sm text-muted-foreground">{booking.date}</td>
                  <td className="py-3 px-2">{getStatusBadge(booking.status)}</td>
                  <td className="py-3 px-2 text-sm font-medium">{booking.amount} ر.س</td>
                  <td className="py-3 px-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

// Popular Destinations Chart
const PopularDestinations = () => {
  const destinations = [
    { name: "ماليزيا", bookings: 156, percentage: 35 },
    { name: "تايلاند", bookings: 124, percentage: 28 },
    { name: "تركيا", bookings: 89, percentage: 20 },
    { name: "المالديف", bookings: 45, percentage: 10 },
    { name: "جورجيا", bookings: 31, percentage: 7 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>الوجهات الأكثر طلباً</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {destinations.map((dest) => (
          <div key={dest.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{dest.name}</span>
              <span className="text-sm text-muted-foreground">{dest.bookings} حجز</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full bg-primary rounded-full transition-all progress-${dest.percentage}`}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Recent Messages
const RecentMessages = () => {
  const messages = [
    { name: "عبدالرحمن", subject: "استفسار عن برنامج ماليزيا", time: "منذ 5 دقائق", unread: true },
    { name: "نورة السعيد", subject: "تعديل موعد الحجز", time: "منذ 30 دقيقة", unread: true },
    { name: "خالد العتيبي", subject: "طلب فاتورة", time: "منذ ساعة", unread: false },
    { name: "هند محمد", subject: "شكوى على الخدمة", time: "منذ 3 ساعات", unread: false },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>الرسائل الأخيرة</CardTitle>
        <Link to="/admin/messages">
          <Button variant="outline" size="sm">عرض الكل</Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg ${
              msg.unread ? "bg-primary/5" : ""
            }`}
          >
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">
                {msg.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{msg.name}</p>
                <span className="text-xs text-muted-foreground">{msg.time}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{msg.subject}</p>
            </div>
            {msg.unread && (
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Quick Actions
const QuickActions = () => {
  const actions = [
    { name: "إضافة حجز", icon: CalendarCheck, path: "/admin/bookings/new", color: "bg-green-500" },
    { name: "إضافة وجهة", icon: MapPin, path: "/admin/destinations/new", color: "bg-blue-500" },
    { name: "إضافة برنامج", icon: Plane, path: "/admin/programs/new", color: "bg-purple-500" },
    { name: "إرسال إشعار", icon: MessageSquare, path: "/admin/notifications/new", color: "bg-orange-500" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>إجراءات سريعة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Link
              key={action.name}
              to={action.path}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium">{action.name}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
interface DashboardBooking {
  id: string;
  booking_reference: string;
  booking_type: string;
  status: string | null;
  total_amount: number;
  user_id: string;
}

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    bookingsCount: 0,
    revenue: 0,
    usersCount: 0,
    destinationsCount: 0,
    recentBookings: [] as DashboardBooking[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    loadDashboardData();
    return () => clearInterval(timer);
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const { count: bookingsCount } = await supabase.from("bookings").select("*", { count: 'exact', head: true });
      const { count: usersCount } = await supabase.from("users").select("*", { count: 'exact', head: true });
      const { count: destinationsCount } = await supabase.from("destinations").select("*", { count: 'exact', head: true });
      
      // Fetch revenue
      const { data: revenueData } = await supabase.from("bookings").select("total_amount").eq("status", "confirmed");
      const totalRevenue = revenueData?.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0) || 0;

      // Fetch recent bookings
      const { data: recentBookings } = await supabase
        .from("bookings")
        .select("id, booking_reference, booking_type, status, total_amount, user_id")
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        bookingsCount: bookingsCount || 0,
        revenue: totalRevenue,
        usersCount: usersCount || 0,
        destinationsCount: destinationsCount || 0,
        recentBookings: (recentBookings || []) as DashboardBooking[],
      });
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground animate-pulse">جاري تحضير البيانات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">مرحباً بك في لوحة التحكم 👋</h1>
          <p className="text-muted-foreground mt-1">
            إليك نظرة عامة على أداء عملك اليوم
          </p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{currentTime.toLocaleDateString('ar-SA', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي الحجوزات"
          value={stats.bookingsCount.toString()}
          change="+12.5%"
          changeType="up"
          icon={CalendarCheck}
          color="bg-blue-500"
        />
        <StatCard
          title="الإيرادات المؤكدة"
          value={`${stats.revenue.toLocaleString()} ر.س`}
          change="+8.2%"
          changeType="up"
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="إجمالي العملاء"
          value={stats.usersCount.toString()}
          change="+15.3%"
          changeType="up"
          icon={Users}
          color="bg-purple-500"
        />
        <StatCard
          title="الوجهات النشطة"
          value={stats.destinationsCount.toString()}
          change="+2.4%"
          changeType="up"
          icon={MapPin}
          color="bg-orange-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>أحدث الحجوزات</CardTitle>
              <Link to="/admin/bookings">
                <Button variant="outline" size="sm">عرض الكل</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">رقم الحجز</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">العميل</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">النوع</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">الحالة</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">المبلغ</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">إجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-2 text-sm font-mono">{booking.booking_reference}</td>
                        <td className="py-3 px-2 text-sm">عميل</td>
                        <td className="py-3 px-2 text-sm uppercase">{booking.booking_type}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {booking.status === 'confirmed' ? 'مؤكد' : 'معلق'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-sm font-medium">{Number(booking.total_amount).toLocaleString()} ر.س</td>
                        <td className="py-3 px-2">
                          <Link to={`/admin/bookings?search=${booking.booking_reference}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {stats.recentBookings.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-muted-foreground text-sm">
                          لا توجد حجوزات حديثة
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <QuickActions />
          <PopularDestinations />
        </div>
      </div>

      {/* Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentMessages />
        
        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>النشاط الأخير</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "حجز جديد", detail: "أحمد محمد حجز رحلة إلى ماليزيا", time: "منذ 10 دقائق", color: "bg-green-500" },
                { action: "دفعة مستلمة", detail: "تم استلام 5,999 ر.س من سارة أحمد", time: "منذ 25 دقيقة", color: "bg-blue-500" },
                { action: "تقييم جديد", detail: "محمد علي أضاف تقييم 5 نجوم", time: "منذ ساعة", color: "bg-yellow-500" },
                { action: "رسالة جديدة", detail: "استفسار من خالد العتيبي", time: "منذ ساعتين", color: "bg-purple-500" },
              ].map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.color} mt-2`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
