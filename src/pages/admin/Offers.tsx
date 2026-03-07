import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Tag,
  Plus,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  Calendar,
  MapPin,
  Flame,
  Star,
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
  title_ar: string;
  title_en: string | null;
  slug: string;
  offer_type: string;
  destination: string | null;
  cover_image: string | null;
  original_price: number;
  discounted_price: number;
  discount_percentage: number;
  duration: string | null;
  valid_until: string | null;
  is_hot: boolean;
  is_active: boolean;
  is_featured: boolean;
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
      const { data, error } = await (supabase as any)
        .from("special_offers")
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
      const { error } = await (supabase as any).from("special_offers").delete().eq("id", id);
      if (error) throw error;
      toast.success("تم حذف العرض بنجاح");
      loadOffers();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from("special_offers")
        .update({ is_active: !currentStatus })
        .eq("id", id);
      if (error) throw error;
      loadOffers();
      toast.success("تم تحديث الحالة");
    } catch (error) {
      toast.error("حدث خطأ في التحديث");
    }
  };

  const offerTypeLabels: Record<string, string> = {
    seasonal: "موسمي", flash: "فلاش", honeymoon: "شهر عسل",
    family: "عائلي", lastminute: "لحظة أخيرة", earlybird: "حجز مبكر",
    group: "مجموعات", weekend: "نهاية أسبوع",
  };

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.title_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offer.destination || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && offer.is_active) ||
      (statusFilter === "inactive" && !offer.is_active) ||
      (statusFilter === "featured" && offer.is_featured) ||
      (statusFilter === "hot" && offer.is_hot);
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
            إدارة عروض السفر الخاصة المعروضة للعملاء ({offers.length} عرض)
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
            <p className="text-3xl font-bold text-amber-600">
              {offers.filter(o => o.is_hot).length}
            </p>
            <p className="text-sm text-muted-foreground">عروض ساخنة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-red-600">
              {offers.filter(o => !o.is_active).length}
            </p>
            <p className="text-sm text-muted-foreground">غير نشط</p>
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
                placeholder="بحث بالاسم أو الوجهة..."
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
                <SelectItem value="all">جميع العروض</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="featured">مميز</SelectItem>
                <SelectItem value="hot">ساخن 🔥</SelectItem>
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
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">العرض</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">النوع</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الوجهة</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">السعر</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الخصم</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">صالح حتى</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">تفعيل</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map((offer) => (
                  <tr key={offer.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {offer.cover_image ? (
                          <img src={offer.cover_image} alt="" className="w-12 h-10 object-cover rounded-lg flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-10 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center">
                            <Tag className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium line-clamp-1">{offer.title_ar}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {offer.is_hot && <span className="text-xs text-red-500 font-bold">🔥 ساخن</span>}
                            {offer.is_featured && <span className="text-xs text-amber-500 font-bold">⭐ مميز</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {offerTypeLabels[offer.offer_type] || offer.offer_type}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {offer.destination || "—"}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-primary">{offer.discounted_price.toLocaleString()} ر.س</p>
                        {offer.original_price > offer.discounted_price && (
                          <p className="text-xs text-muted-foreground line-through">{offer.original_price.toLocaleString()} ر.س</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-red-600">{offer.discount_percentage}%</span>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      {offer.valid_until ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {new Date(offer.valid_until).toLocaleDateString("ar-SA")}
                        </div>
                      ) : "—"}
                    </td>
                    <td className="py-4 px-4">
                      <Switch
                        checked={offer.is_active}
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
