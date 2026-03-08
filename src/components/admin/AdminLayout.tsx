import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  MapPin,
  Plane,
  Hotel,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Tag,
  CreditCard,
  BarChart3,
  FileText,
  Star,
  Bot,
  Briefcase,
  Heart,
  Home,
  Globe,
  Building2,
  Layout,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type NavItem = {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
  children?: { name: string; path: string }[];
  allowedRoles?: string[]; // undefined = admin only, ['all'] = everyone
};

const navItems: NavItem[] = [
  { name: "لوحة التحكم", path: "/admin", icon: LayoutDashboard, allowedRoles: ["all"] },
  { name: "الصفحة الرئيسية", path: "/admin/homepage", icon: Home },
  { name: "القائمة العلوية", path: "/admin/nav-menu", icon: Layout },
  { name: "الموبايل", path: "/admin/mobile-homepage", icon: Smartphone },
  { name: "الحجوزات", path: "/admin/bookings", icon: CalendarCheck, badge: 5, allowedRoles: ["all"] },
  { 
    name: "الوجهات", 
    path: "/admin/destinations", 
    icon: MapPin,
    children: [
      { name: "جميع الوجهات", path: "/admin/destinations" },
      { name: "إضافة وجهة", path: "/admin/destinations/new" },
    ]
  },
  { 
    name: "البرامج", 
    path: "/admin/programs", 
    icon: Plane,
    allowedRoles: ["all"],
    children: [
      { name: "جميع البرامج", path: "/admin/programs" },
      { name: "إضافة برنامج", path: "/admin/programs/new" },
    ]
  },
  { name: "الرحلات", path: "/admin/flights", icon: Plane },
  { name: "الفنادق", path: "/admin/hotels", icon: Hotel },
  { name: "العروض", path: "/admin/offers", icon: Tag, allowedRoles: ["all"] },
  { name: "البكجات الجاهزة", path: "/admin/ready-packages", icon: Building2, allowedRoles: ["all"] },
  {
    name: "الدول والمدن",
    path: "/admin/southeast-asia-countries",
    icon: Globe,
    children: [
      { name: "إدارة الدول", path: "/admin/southeast-asia-countries" },
      { name: "إدارة المدن", path: "/admin/southeast-asia-cities" },
      { name: "نقل البيانات", path: "/admin/seed-countries" },
    ],
  },
  { 
    name: "الخدمات", 
    path: "/admin/services", 
    icon: Briefcase,
    children: [
      { name: "جميع الخدمات", path: "/admin/services" },
      { name: "إضافة خدمة", path: "/admin/services/new" },
    ]
  },
  { 
    name: "شهر العسل", 
    path: "/admin/honeymoon", 
    icon: Heart,
    children: [
      { name: "إدارة الصفحة", path: "/admin/honeymoon" },
      { name: "إضافة باقة", path: "/admin/honeymoon/packages/new" },
    ]
  },
  { name: "المدفوعات", path: "/admin/payments", icon: CreditCard },
  { name: "التقييمات", path: "/admin/reviews", icon: Star },
  { name: "المستخدمين", path: "/admin/users", icon: Users },
  { name: "الرسائل", path: "/admin/messages", icon: MessageSquare, badge: 3 },
  { name: "التقارير", path: "/admin/reports", icon: BarChart3 },
  { 
    name: "المدونة", 
    path: "/admin/blog", 
    icon: FileText,
    children: [
      { name: "جميع المقالات", path: "/admin/blog" },
      { name: "إضافة مقالة", path: "/admin/blog/new" },
    ]
  },
  { name: "الذكاء الاصطناعي", path: "/admin/ai-settings", icon: Bot },
  { name: "الإعدادات", path: "/admin/settings", icon: Settings },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, userRole, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Filter nav items based on user role
  // إذا userRole=null (لا يزال يتحمّل) أو admin → نعرض كل القوائم
  const filteredNavItems = navItems.filter((item) => {
    if (userRole === null || isAdmin()) return true; // null = جاري التحميل أو admin = يرى الكل
    if (!item.allowedRoles) return false; // no allowedRoles = admin only
    return item.allowedRoles.includes("all") || item.allowedRoles.includes(userRole || "");
  });

  const getRoleBadge = () => {
    if (userRole === "admin") return { label: "مدير عام", color: "bg-red-500" };
    if (userRole === "moderator") return { label: "موظف", color: "bg-blue-500" };
    return { label: "مستخدم", color: "bg-green-500" };
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("تم تسجيل الخروج بنجاح");
    navigate("/login");
  };

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (item: NavItem) => {
    if (item.children) {
      return item.children.some((child) => location.pathname.startsWith(child.path));
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex" dir="rtl">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 bg-card border-l shadow-xl transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } hidden lg:block`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          {sidebarOpen && (
            <Link to="/admin" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">ترافليون</span>
              <span className={`text-xs text-white px-2 py-0.5 rounded ${getRoleBadge().color}`}>{getRoleBadge().label}</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-auto"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {filteredNavItems.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isParentActive(item)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-right">{item.name}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            expandedItems.includes(item.name) ? "rotate-180" : ""
                          }`}
                        />
                      </>
                    )}
                  </button>
                  {sidebarOpen && expandedItems.includes(item.name) && (
                    <div className="mr-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive(child.path)
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-right">{item.name}</span>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-card">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full hover:bg-red-50 text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <aside className="fixed inset-y-0 right-0 w-64 bg-card shadow-xl">
            <div className="h-16 flex items-center justify-between px-4 border-b">
              <span className="text-xl font-bold text-primary">ترافليون</span>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <nav className="p-4 space-y-1">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "lg:mr-64" : "lg:mr-20"
        }`}
      >
        {/* Top Bar */}
        <header className="h-16 bg-card border-b sticky top-0 z-40 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="relative hidden md:block">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث..."
                className="w-64 pr-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.email?.split("@")[0] || "Admin"}</p>
                <p className="text-xs text-muted-foreground">مدير</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
