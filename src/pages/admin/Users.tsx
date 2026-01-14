import { useState, useEffect } from "react";
import {
  Search,
  Users as UsersIcon,
  Edit,
  MoreVertical,
  Shield,
  Mail,
  Phone,
  Eye,
  Ban,
  UserCheck,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: string | null;
  status: string | null;
  created_at: string | null;
}

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers((data || []) as User[]);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("حدث خطأ في تحميل المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      loadUsers();
      toast.success(status === "active" ? "تم تفعيل المستخدم" : "تم إيقاف المستخدم");
    } catch (error) {
      toast.error("حدث خطأ في التحديث");
    }
  };

  const updateUserRole = async (id: string, role: string) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ role })
        .eq("id", id);

      if (error) throw error;
      loadUsers();
      toast.success("تم تحديث الصلاحية");
    } catch (error) {
      toast.error("حدث خطأ في التحديث");
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`;
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: "bg-red-100 text-red-700",
      agent: "bg-blue-100 text-blue-700",
      customer: "bg-green-100 text-green-700",
      partner: "bg-purple-100 text-purple-700",
    };
    const labels: Record<string, string> = {
      admin: "مدير",
      agent: "وكيل",
      customer: "عميل",
      partner: "شريك",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role] || styles.customer}`}>
        {labels[role] || "عميل"}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">نشط</span>;
    }
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">موقوف</span>;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">جاري تحميل المستخدمين...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UsersIcon className="w-7 h-7 text-primary" />
            إدارة المستخدمين
          </h1>
          <p className="text-muted-foreground">
            عرض وإدارة حسابات المستخدمين ({users.length} مستخدم)
          </p>
        </div>
        <Button variant="outline" onClick={loadUsers} aria-label="تحديث">
          <RefreshCw className="w-4 h-4 ml-2" />
          تحديث
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{users.length}</p>
            <p className="text-sm text-muted-foreground">إجمالي المستخدمين</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{users.filter(u => u.status === "active").length}</p>
            <p className="text-sm text-muted-foreground">نشط</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{users.filter(u => u.role === "admin" || u.role === "agent").length}</p>
            <p className="text-sm text-muted-foreground">فريق العمل</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{users.filter(u => u.role === "customer").length}</p>
            <p className="text-sm text-muted-foreground">عملاء</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو البريد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="الصلاحية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الصلاحيات</SelectItem>
                <SelectItem value="admin">مدير</SelectItem>
                <SelectItem value="agent">وكيل</SelectItem>
                <SelectItem value="customer">عميل</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="suspended">موقوف</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">المستخدم</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">التواصل</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الصلاحية</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الحجوزات</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">المصروفات</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الحالة</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-bold text-primary">
                            {user.first_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.first_name} {user.last_name}</p>
                          <p className="text-xs text-muted-foreground">
                            منذ {user.created_at ? new Date(user.created_at).toLocaleDateString("ar-SA") : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">{getRoleBadge(user.role || "customer")}</td>
                    <td className="py-4 px-4 text-sm font-medium">0</td>
                    <td className="py-4 px-4 text-sm font-medium">0 ر.س</td>
                    <td className="py-4 px-4">{getStatusBadge(user.status || "active")}</td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label="خيارات">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 ml-2" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 ml-2" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateUserRole(user.id, user.role === "admin" ? "customer" : "admin")}>
                            <Shield className="w-4 h-4 ml-2" />
                            {user.role === "admin" ? "إلغاء صلاحية المدير" : "جعله مدير"}
                          </DropdownMenuItem>
                          {user.status === "active" ? (
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => updateUserStatus(user.id, "suspended")}
                            >
                              <Ban className="w-4 h-4 ml-2" />
                              إيقاف الحساب
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              className="text-green-600"
                              onClick={() => updateUserStatus(user.id, "active")}
                            >
                              <UserCheck className="w-4 h-4 ml-2" />
                              تفعيل الحساب
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-16">
              <UsersIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-bold mb-2">لا يوجد مستخدمين</h3>
              <p className="text-muted-foreground">جرب كلمة بحث أخرى</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
