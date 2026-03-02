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
  UserPlus,
  X,
  Lock,
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
import { useAuth } from "@/hooks/useAuth";
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
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Employee Dialog state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "employee" as string,
  });

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
    } catch {
      toast.error("حدث خطأ في التحديث");
    }
  };

  const updateUserRole = async (id: string, role: string) => {
    if (!isAdmin()) {
      toast.error("ليس لديك صلاحية لتغيير الأدوار");
      return;
    }
    try {
      const { error } = await supabase
        .from("users")
        .update({ role })
        .eq("id", id);

      if (error) throw error;
      loadUsers();
      toast.success("تم تحديث الصلاحية");
    } catch {
      toast.error("حدث خطأ في التحديث");
    }
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin()) {
      toast.error("فقط المدير يمكنه إنشاء حسابات جديدة");
      return;
    }
    if (!newUser.email || !newUser.password || !newUser.firstName) {
      toast.error("يرجى تعبئة الحقول المطلوبة");
      return;
    }
    if (newUser.password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setCreating(true);
    try {
      // 1. Create auth user via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            first_name: newUser.firstName,
            last_name: newUser.lastName,
            phone: newUser.phone,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) throw authError;

      // 2. Update the user's role in the users table
      if (authData.user) {
        // Wait a moment for the trigger to create the user record
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { error: updateError } = await supabase
          .from("users")
          .update({
            role: newUser.role,
            status: "active",
            first_name: newUser.firstName,
            last_name: newUser.lastName,
            phone: newUser.phone,
          })
          .eq("id", authData.user.id);

        if (updateError) {
          // If update fails, try insert
          await supabase.from("users").insert({
            id: authData.user.id,
            email: newUser.email,
            first_name: newUser.firstName,
            last_name: newUser.lastName,
            phone: newUser.phone,
            role: newUser.role,
            status: "active",
          });
        }
      }

      toast.success(`تم إنشاء حساب ${newUser.role === "admin" ? "المدير" : "الموظف"} بنجاح!`);
      setShowCreateDialog(false);
      setNewUser({ firstName: "", lastName: "", email: "", phone: "", password: "", role: "employee" });
      loadUsers();
    } catch (error: any) {
      console.error("Error creating user:", error);
      if (error?.message?.includes("already registered")) {
        toast.error("هذا البريد الإلكتروني مسجل مسبقاً");
      } else {
        toast.error("حدث خطأ في إنشاء الحساب: " + (error?.message || "خطأ غير معروف"));
      }
    } finally {
      setCreating(false);
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
      employee: "bg-blue-100 text-blue-700",
      agent: "bg-purple-100 text-purple-700",
      customer: "bg-green-100 text-green-700",
    };
    const labels: Record<string, string> = {
      admin: "مدير",
      employee: "موظف",
      agent: "وكيل",
      customer: "عميل",
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
            إدارة المستخدمين والصلاحيات
          </h1>
          <p className="text-muted-foreground">
            عرض وإدارة حسابات المستخدمين والموظفين ({users.length} مستخدم)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadUsers} aria-label="تحديث">
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
          {isAdmin() && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <UserPlus className="w-4 h-4 ml-2" />
              إضافة موظف
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{users.length}</p>
            <p className="text-sm text-muted-foreground">إجمالي</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-red-600">{users.filter(u => u.role === "admin").length}</p>
            <p className="text-sm text-muted-foreground">مدراء</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{users.filter(u => u.role === "employee").length}</p>
            <p className="text-sm text-muted-foreground">موظفين</p>
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
            <p className="text-3xl font-bold text-gray-500">{users.filter(u => u.status !== "active").length}</p>
            <p className="text-sm text-muted-foreground">موقوف</p>
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
                <SelectItem value="employee">موظف</SelectItem>
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
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الحالة</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">تاريخ الإنشاء</th>
                  {isAdmin() && (
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">إجراءات</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          user.role === "admin" ? "bg-red-100" : user.role === "employee" ? "bg-blue-100" : "bg-primary/10"
                        }`}>
                          <span className={`font-bold ${
                            user.role === "admin" ? "text-red-600" : user.role === "employee" ? "text-blue-600" : "text-primary"
                          }`}>
                            {user.first_name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.first_name} {user.last_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{user.email}</span>
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
                    <td className="py-4 px-4">{getStatusBadge(user.status || "active")}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString("ar-SA") : "—"}
                    </td>
                    {isAdmin() && (
                      <td className="py-4 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="خيارات">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => updateUserRole(user.id, "admin")}>
                              <Shield className="w-4 h-4 ml-2 text-red-500" />
                              جعله مدير
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateUserRole(user.id, "employee")}>
                              <UserCheck className="w-4 h-4 ml-2 text-blue-500" />
                              جعله موظف
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateUserRole(user.id, "customer")}>
                              <UsersIcon className="w-4 h-4 ml-2 text-green-500" />
                              جعله عميل
                            </DropdownMenuItem>
                            <hr className="my-1" />
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
                    )}
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

      {/* Create Employee Modal */}
      {showCreateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateDialog(false)}>
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-[hsl(175,84%,32%)] to-emerald-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">إضافة عضو فريق جديد</h2>
                    <p className="text-white/70 text-sm">إنشاء حساب موظف أو مدير</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowCreateDialog(false)} className="text-white hover:bg-white/20" aria-label="إغلاق">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateEmployee} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">الاسم الأول <span className="text-red-500">*</span></label>
                  <Input
                    required
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    placeholder="مثال: أحمد"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">الاسم الأخير</label>
                  <Input
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    placeholder="مثال: العمري"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="employee@traveliun.com"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  كلمة المرور <span className="text-red-500">*</span>
                </label>
                <Input
                  type="password"
                  required
                  minLength={6}
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="6 أحرف على الأقل"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    رقم الجوال
                  </label>
                  <Input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="05XXXXXXXX"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    الصلاحية <span className="text-red-500">*</span>
                  </label>
                  <select
                    title="الصلاحية"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full h-10 rounded-lg border border-border px-3 text-sm bg-background"
                  >
                    <option value="employee">موظف — البرامج والعروض</option>
                    <option value="admin">مدير — صلاحيات كاملة</option>
                  </select>
                </div>
              </div>

              {/* Role Description */}
              <div className={`p-4 rounded-xl text-sm ${
                newUser.role === "admin"
                  ? "bg-red-50 border border-red-200 text-red-700"
                  : "bg-blue-50 border border-blue-200 text-blue-700"
              }`}>
                {newUser.role === "admin" ? (
                  <p>⚠️ <strong>مدير:</strong> صلاحية كاملة للوصول لجميع أقسام لوحة التحكم بما فيها إدارة المستخدمين والإعدادات.</p>
                ) : (
                  <p>ℹ️ <strong>موظف:</strong> صلاحية محدودة — يستطيع إدارة البرامج والعروض والحجوزات فقط.</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1 h-12" disabled={creating}>
                  {creating ? (
                    <><Loader2 className="w-4 h-4 ml-2 animate-spin" /> جاري الإنشاء...</>
                  ) : (
                    <><UserPlus className="w-4 h-4 ml-2" /> إنشاء الحساب</>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)} className="h-12">
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
