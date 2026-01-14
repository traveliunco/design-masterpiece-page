import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  MapPin,
  Eye,
  Star,
  Globe,
  Image,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminDestinations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDestinations(data || []);
    } catch (error) {
      console.error("Error loading destinations:", error);
      toast.error("حدث خطأ في تحميل الوجهات");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الوجهة؟")) return;

    try {
      const { error } = await supabase.from("destinations").delete().eq("id", id);
      if (error) throw error;
      toast.success("تم حذف الوجهة بنجاح");
      loadDestinations();
    } catch (error) {
      console.error("Error deleting destination:", error);
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("destinations")
        .update({ is_active: !currentStatus })
        .eq("id", id);
      
      if (error) throw error;
      loadDestinations();
    } catch (error) {
      toast.error("حدث خطأ في تحديث الحالة");
    }
  };

  const filteredDestinations = destinations.filter((dest) =>
    dest.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dest.region_ar && dest.region_ar.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="w-7 h-7 text-primary" />
            إدارة الوجهات
          </h1>
          <p className="text-muted-foreground">
            إدارة الوجهات السياحية ({destinations.length} وجهة)
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/destinations/new">
            <Plus className="w-4 h-4 ml-2" />
            إضافة وجهة جديدة
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو المنطقة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="4" rx="1" />
                  <rect x="3" y="10" width="18" height="4" rx="1" />
                  <rect x="3" y="16" width="18" height="4" rx="1" />
                </svg>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDestinations.map((dest) => (
            <Card key={dest.id} className="overflow-hidden group">
              <div className="relative aspect-[4/3]">
                <img
                  src={dest.cover_image || "/placeholder.jpg"}
                  alt={dest.name_ar}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 right-3 flex gap-2">
                  {dest.is_featured && (
                    <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                      مميز
                    </span>
                  )}
                  <button 
                    onClick={() => toggleStatus(dest.id, dest.is_active)}
                    className={`text-xs px-2 py-1 rounded-full ${
                    dest.is_active ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}>
                    {dest.is_active ? "نشط" : "معطل"}
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white text-lg font-bold">{dest.name_ar}</h3>
                  <p className="text-white/80 text-sm">{dest.region_ar}</p>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{dest.average_rating || 0}</span>
                    <span className="text-xs text-muted-foreground">({dest.total_reviews || 0})</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {dest.slug}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {dest.starting_price || 0} ر.س
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 ml-2" />
                        معاينة
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/destinations/edit/${dest.id}`} className="flex w-full">
                          <Edit className="w-4 h-4 ml-2" />
                          تعديل
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(dest.id)}>
                        <Trash2 className="w-4 h-4 ml-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && !loading && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الوجهة</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">المنطقة</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">التقييم</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">السعر الابتدائي</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الحالة</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDestinations.map((dest) => (
                    <tr key={dest.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={dest.cover_image || "/placeholder.jpg"}
                            alt={dest.name_ar}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium">{dest.name_ar}</p>
                            <p className="text-xs text-muted-foreground">{dest.name_en}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm">{dest.region_ar}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm">{dest.average_rating || 0}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium">{dest.starting_price || 0} ر.س</td>
                      <td className="py-4 px-4">
                        <Switch 
                          checked={dest.is_active} 
                          onCheckedChange={() => toggleStatus(dest.id, dest.is_active)}
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/admin/destinations/edit/${dest.id}`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600"
                            onClick={() => handleDelete(dest.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      
      {!loading && filteredDestinations.length === 0 && (
        <div className="text-center py-20">
          <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="text-xl font-bold mb-2">لا توجد وجهات مطابقة</h3>
          <p className="text-muted-foreground">جرب كلمة بحث أخرى أو أضف وجهة جديدة</p>
        </div>
      )}
    </div>
  );
};

export default AdminDestinations;
