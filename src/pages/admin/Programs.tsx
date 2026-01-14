import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Plane,
  Eye,
  Star,
  Calendar,
  Users,
  DollarSign,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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

interface Program {
  id: string;
  name_ar: string;
  name_en: string;
  destination_id: string | null;
  program_type: string;
  duration_days: number;
  duration_nights: number;
  price: number;
  is_active: boolean;
  is_featured: boolean;
  average_rating: number | null;
  total_bookings: number | null;
  created_at: string;
  destination?: { name_ar: string } | null;
}

const AdminPrograms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("programs")
        .select(`
          *,
          destination:destinations(name_ar)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPrograms((data || []) as unknown as Program[]);
    } catch (error) {
      console.error("Error loading programs:", error);
      toast.error("حدث خطأ في تحميل البرامج");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا البرنامج؟")) return;

    try {
      const { error } = await supabase.from("programs").delete().eq("id", id);
      if (error) throw error;
      toast.success("تم حذف البرنامج بنجاح");
      loadPrograms();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("programs")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      loadPrograms();
      toast.success("تم تحديث الحالة");
    } catch (error) {
      toast.error("حدث خطأ في التحديث");
    }
  };

  const toggleFeatured = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from("programs")
        .update({ is_featured: !currentValue })
        .eq("id", id);

      if (error) throw error;
      loadPrograms();
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  const filteredPrograms = programs.filter((prog) => {
    const matchesSearch = prog.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prog.destination?.name_ar || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || prog.program_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      honeymoon: "bg-pink-100 text-pink-700",
      family: "bg-blue-100 text-blue-700",
      adventure: "bg-orange-100 text-orange-700",
      cultural: "bg-purple-100 text-purple-700",
      budget: "bg-green-100 text-green-700",
      beach: "bg-cyan-100 text-cyan-700",
      luxury: "bg-amber-100 text-amber-700",
    };
    const labels: Record<string, string> = {
      honeymoon: "شهر عسل",
      family: "عائلي",
      adventure: "مغامرة",
      cultural: "ثقافي",
      budget: "اقتصادي",
      beach: "شاطئي",
      luxury: "فاخر",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type] || "bg-gray-100 text-gray-700"}`}>
        {labels[type] || type}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">جاري تحميل البرامج...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Plane className="w-7 h-7 text-primary" />
            إدارة البرامج السياحية
          </h1>
          <p className="text-muted-foreground">
            إدارة البرامج والباقات السياحية ({programs.length} برنامج)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadPrograms} aria-label="تحديث">
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
          <Button asChild>
            <Link to="/admin/programs/new">
              <Plus className="w-4 h-4 ml-2" />
              إضافة برنامج جديد
            </Link>
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
                placeholder="بحث بالاسم أو الوجهة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="honeymoon">شهر عسل</SelectItem>
                <SelectItem value="family">عائلي</SelectItem>
                <SelectItem value="adventure">مغامرة</SelectItem>
                <SelectItem value="cultural">ثقافي</SelectItem>
                <SelectItem value="budget">اقتصادي</SelectItem>
                <SelectItem value="luxury">فاخر</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Programs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">البرنامج</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الوجهة</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">النوع</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">المدة</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">السعر</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">التقييم</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الحالة</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrograms.map((prog) => (
                  <tr key={prog.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {prog.is_featured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        )}
                        <div>
                          <p className="font-medium">{prog.name_ar}</p>
                          <p className="text-xs text-muted-foreground">{prog.name_en}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm">{prog.destination?.name_ar || "-"}</td>
                    <td className="py-4 px-4">{getTypeBadge(prog.program_type)}</td>
                    <td className="py-4 px-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {prog.duration_days} أيام / {prog.duration_nights} ليالي
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-primary">{prog.price?.toLocaleString()} ر.س</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm">{prog.average_rating || 0}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Switch
                        checked={prog.is_active}
                        onCheckedChange={() => toggleStatus(prog.id, prog.is_active)}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label="خيارات">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/programs/${prog.id}`} className="flex w-full">
                              <Eye className="w-4 h-4 ml-2" />
                              معاينة
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/programs/edit/${prog.id}`} className="flex w-full">
                              <Edit className="w-4 h-4 ml-2" />
                              تعديل
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleFeatured(prog.id, prog.is_featured)}>
                            <Star className={`w-4 h-4 ml-2 ${prog.is_featured ? "fill-yellow-500 text-yellow-500" : ""}`} />
                            {prog.is_featured ? "إلغاء التمييز" : "تمييز"}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={() => handleDelete(prog.id)}
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPrograms.length === 0 && (
            <div className="text-center py-16">
              <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-bold mb-2">لا توجد برامج</h3>
              <p className="text-muted-foreground">جرب كلمة بحث أخرى أو أضف برنامج جديد</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPrograms;
