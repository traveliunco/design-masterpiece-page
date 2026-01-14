import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Tag,
  Plus,
  Copy,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  Calendar,
  Percent,
  Users,
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Offer {
  id: string;
  code: string;
  name_ar: string | null;
  name_en: string | null;
  discount_type: string;
  discount_value: number;
  min_order_amount: number | null;
  usage_limit: number | null;
  used_count: number | null;
  valid_from: string;
  valid_until: string;
  is_active: boolean | null;
  created_at: string | null;
}

const AdminOffers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOffers((data || []) as Offer[]);
    } catch (error) {
      console.error("Error loading offers:", error);
      toast.error("حدث خطأ في تحميل العروض");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العرض؟")) return;

    try {
      const { error } = await supabase.from("promo_codes").delete().eq("id", id);
      if (error) throw error;
      toast.success("تم حذف العرض بنجاح");
      loadOffers();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean | null) => {
    try {
      const { error } = await supabase
        .from("promo_codes")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      loadOffers();
      toast.success("تم تحديث الحالة");
    } catch (error) {
      toast.error("حدث خطأ في التحديث");
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("تم نسخ الكود");
  };

  const getOfferStatus = (offer: Offer) => {
    const now = new Date();
    const start = new Date(offer.valid_from);
    const end = new Date(offer.valid_until);

    if (!offer.is_active) return "disabled";
    if (now < start) return "upcoming";
    if (now > end) return "expired";
    if (offer.usage_limit && (offer.used_count || 0) >= offer.usage_limit) return "exhausted";
    return "active";
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-100 text-green-700",
      disabled: "bg-gray-100 text-gray-700",
      expired: "bg-red-100 text-red-700",
      upcoming: "bg-blue-100 text-blue-700",
      exhausted: "bg-orange-100 text-orange-700",
    };
    const labels: Record<string, string> = {
      active: "نشط",
      disabled: "معطل",
      expired: "منتهي",
      upcoming: "قادم",
      exhausted: "استنفد",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch = 
      offer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offer.name_ar || "").toLowerCase().includes(searchTerm.toLowerCase());
    const status = getOfferStatus(offer);
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">جاري تحميل العروض...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Tag className="w-7 h-7 text-primary" />
            إدارة العروض والخصومات
          </h1>
          <p className="text-muted-foreground">
            إنشاء وإدارة أكواد الخصم ({offers.length} عرض)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadOffers} aria-label="تحديث">
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
          <Button asChild>
            <Link to="/admin/offers/new">
              <Plus className="w-4 h-4 ml-2" />
              إضافة عرض جديد
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{offers.length}</p>
            <p className="text-sm text-muted-foreground">إجمالي العروض</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">
              {offers.filter(o => getOfferStatus(o) === "active").length}
            </p>
            <p className="text-sm text-muted-foreground">نشط</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">
              {offers.reduce((sum, o) => sum + (o.used_count || 0), 0)}
            </p>
            <p className="text-sm text-muted-foreground">مرات الاستخدام</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-red-600">
              {offers.filter(o => getOfferStatus(o) === "expired").length}
            </p>
            <p className="text-sm text-muted-foreground">منتهي</p>
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
                placeholder="بحث بالكود أو الاسم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="disabled">معطل</SelectItem>
                <SelectItem value="expired">منتهي</SelectItem>
                <SelectItem value="upcoming">قادم</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Offers Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الكود</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الاسم</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الخصم</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الاستخدام</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الصلاحية</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الحالة</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">تفعيل</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map((offer) => (
                  <tr key={offer.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-1 rounded font-mono text-sm">{offer.code}</code>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => copyCode(offer.code)}
                          aria-label="نسخ الكود"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium">{offer.name_ar}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Percent className="w-4 h-4 text-primary" />
                        <span className="font-bold text-primary">
                          {offer.discount_value}{offer.discount_type === "percentage" ? "%" : " ر.س"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {offer.used_count || 0} / {offer.usage_limit || "∞"}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {new Date(offer.valid_until).toLocaleDateString("ar-SA")}
                      </div>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(getOfferStatus(offer))}</td>
                    <td className="py-4 px-4">
                      <Switch
                        checked={offer.is_active || false}
                        onCheckedChange={() => toggleStatus(offer.id, offer.is_active)}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" asChild aria-label="تعديل">
                          <Link to={`/admin/offers/edit/${offer.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-600"
                          onClick={() => handleDelete(offer.id)}
                          aria-label="حذف"
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

          {filteredOffers.length === 0 && (
            <div className="text-center py-16">
              <Tag className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-bold mb-2">لا توجد عروض</h3>
              <p className="text-muted-foreground">أضف عرض جديد للبدء</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOffers;
