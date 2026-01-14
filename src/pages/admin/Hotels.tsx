/**
 * صفحة إدارة الفنادق - لوحة التحكم
 */

import { useState, useEffect } from "react";
import {
  Hotel,
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  Loader2,
  MapPin,
  Bed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface HotelData {
  id: string;
  name_ar: string;
  name_en: string;
  city_ar: string;
  city_en: string;
  country_ar: string;
  country_en: string;
  address?: string;
  star_rating: number;
  hotel_type: string;
  description_ar?: string;
  main_image?: string;
  phone?: string;
  email?: string;
  rating: number;
  reviews_count: number;
  is_featured: boolean;
  is_active: boolean;
}

const AdminHotelsPage = () => {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<HotelData | null>(null);

  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    city_ar: "",
    city_en: "",
    country_ar: "",
    country_en: "",
    address: "",
    star_rating: 5,
    hotel_type: "hotel",
    description_ar: "",
    main_image: "",
    phone: "",
    email: "",
    rating: 0,
    reviews_count: 0,
    is_featured: false,
    is_active: true,
  });

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("hotels")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHotels(data || []);
    } catch (error) {
      console.error("Error loading hotels:", error);
      toast.error("حدث خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name_ar || !formData.city_ar || !formData.country_ar) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }

    setSaving(true);
    try {
      if (editingHotel) {
        const { error } = await supabase
          .from("hotels")
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq("id", editingHotel.id);

        if (error) throw error;
        toast.success("تم تحديث الفندق بنجاح");
      } else {
        const { error } = await supabase
          .from("hotels")
          .insert(formData);

        if (error) throw error;
        toast.success("تم إضافة الفندق بنجاح");
      }

      setIsDialogOpen(false);
      resetForm();
      loadHotels();
    } catch (error: any) {
      console.error("Error saving:", error);
      toast.error(error.message || "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الفندق؟")) return;

    try {
      const { error } = await supabase
        .from("hotels")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;
      toast.success("تم حذف الفندق");
      loadHotels();
    } catch (error) {
      toast.error("حدث خطأ في الحذف");
    }
  };

  const handleEdit = (hotel: HotelData) => {
    setEditingHotel(hotel);
    setFormData({
      name_ar: hotel.name_ar || "",
      name_en: hotel.name_en || "",
      city_ar: hotel.city_ar || "",
      city_en: hotel.city_en || "",
      country_ar: hotel.country_ar || "",
      country_en: hotel.country_en || "",
      address: hotel.address || "",
      star_rating: hotel.star_rating || 5,
      hotel_type: hotel.hotel_type || "hotel",
      description_ar: hotel.description_ar || "",
      main_image: hotel.main_image || "",
      phone: hotel.phone || "",
      email: hotel.email || "",
      rating: hotel.rating || 0,
      reviews_count: hotel.reviews_count || 0,
      is_featured: hotel.is_featured ?? false,
      is_active: hotel.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingHotel(null);
    setFormData({
      name_ar: "",
      name_en: "",
      city_ar: "",
      city_en: "",
      country_ar: "",
      country_en: "",
      address: "",
      star_rating: 5,
      hotel_type: "hotel",
      description_ar: "",
      main_image: "",
      phone: "",
      email: "",
      rating: 0,
      reviews_count: 0,
      is_featured: false,
      is_active: true,
    });
  };

  const filteredHotels = hotels.filter((h) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      h.name_ar?.toLowerCase().includes(search) ||
      h.city_ar?.toLowerCase().includes(search) ||
      h.country_ar?.toLowerCase().includes(search)
    );
  });

  const renderStars = (count: number) => {
    return Array(count).fill(null).map((_, i) => (
      <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Hotel className="w-6 h-6 text-primary" />
            إدارة الفنادق
          </h1>
          <p className="text-muted-foreground">إضافة وتعديل الفنادق والمنتجعات</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة فندق
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingHotel ? "تعديل الفندق" : "إضافة فندق جديد"}</DialogTitle>
              <DialogDescription>أدخل تفاصيل الفندق</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name AR */}
              <div className="space-y-2">
                <Label>اسم الفندق (عربي) *</Label>
                <Input
                  value={formData.name_ar}
                  onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  placeholder="فندق..."
                />
              </div>

              {/* Name EN */}
              <div className="space-y-2">
                <Label>اسم الفندق (إنجليزي)</Label>
                <Input
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  placeholder="Hotel..."
                />
              </div>

              {/* City AR */}
              <div className="space-y-2">
                <Label>المدينة (عربي) *</Label>
                <Input
                  value={formData.city_ar}
                  onChange={(e) => setFormData({ ...formData, city_ar: e.target.value })}
                  placeholder="كوالالمبور"
                />
              </div>

              {/* City EN */}
              <div className="space-y-2">
                <Label>المدينة (إنجليزي)</Label>
                <Input
                  value={formData.city_en}
                  onChange={(e) => setFormData({ ...formData, city_en: e.target.value })}
                  placeholder="Kuala Lumpur"
                />
              </div>

              {/* Country AR */}
              <div className="space-y-2">
                <Label>الدولة (عربي) *</Label>
                <Input
                  value={formData.country_ar}
                  onChange={(e) => setFormData({ ...formData, country_ar: e.target.value })}
                  placeholder="ماليزيا"
                />
              </div>

              {/* Country EN */}
              <div className="space-y-2">
                <Label>الدولة (إنجليزي)</Label>
                <Input
                  value={formData.country_en}
                  onChange={(e) => setFormData({ ...formData, country_en: e.target.value })}
                  placeholder="Malaysia"
                />
              </div>

              {/* Star Rating */}
              <div className="space-y-2">
                <Label>تصنيف النجوم</Label>
                <Select value={formData.star_rating.toString()} onValueChange={(v) => setFormData({ ...formData, star_rating: parseInt(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">⭐ نجمة واحدة</SelectItem>
                    <SelectItem value="2">⭐⭐ نجمتان</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ 3 نجوم</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ 4 نجوم</SelectItem>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ 5 نجوم</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Hotel Type */}
              <div className="space-y-2">
                <Label>نوع الإقامة</Label>
                <Select value={formData.hotel_type} onValueChange={(v) => setFormData({ ...formData, hotel_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">فندق</SelectItem>
                    <SelectItem value="resort">منتجع</SelectItem>
                    <SelectItem value="apartment">شقة فندقية</SelectItem>
                    <SelectItem value="villa">فيلا</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label>رقم الهاتف</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+60..."
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="info@hotel.com"
                />
              </div>

              {/* Main Image */}
              <div className="col-span-2 space-y-2">
                <Label>رابط الصورة الرئيسية</Label>
                <Input
                  value={formData.main_image}
                  onChange={(e) => setFormData({ ...formData, main_image: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              {/* Description */}
              <div className="col-span-2 space-y-2">
                <Label>الوصف</Label>
                <Textarea
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  rows={4}
                  placeholder="وصف الفندق..."
                />
              </div>

              {/* Switches */}
              <div className="col-span-2 flex flex-wrap gap-6 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Switch
                    id="featured"
                    checked={formData.is_featured}
                    onCheckedChange={(v) => setFormData({ ...formData, is_featured: v })}
                  />
                  <Label htmlFor="featured">فندق مميز</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="active"
                    checked={formData.is_active}
                    onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
                  />
                  <Label htmlFor="active">نشط</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
                {editingHotel ? "تحديث" : "إضافة"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{hotels.filter(h => h.is_active).length}</div>
            <p className="text-sm text-muted-foreground">الفنادق النشطة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{hotels.filter(h => h.is_featured).length}</div>
            <p className="text-sm text-muted-foreground">الفنادق المميزة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{hotels.filter(h => h.star_rating === 5).length}</div>
            <p className="text-sm text-muted-foreground">فنادق 5 نجوم</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{hotels.filter(h => h.hotel_type === 'resort').length}</div>
            <p className="text-sm text-muted-foreground">المنتجعات</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="بحث عن فندق..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الفندق</TableHead>
              <TableHead>الموقع</TableHead>
              <TableHead>التصنيف</TableHead>
              <TableHead>النوع</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHotels.map((hotel) => (
              <TableRow key={hotel.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Hotel className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{hotel.name_ar}</p>
                      <p className="text-xs text-muted-foreground">{hotel.name_en}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    {hotel.city_ar}، {hotel.country_ar}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-0.5">
                    {renderStars(hotel.star_rating || 5)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {hotel.hotel_type === 'hotel' ? 'فندق' : 
                     hotel.hotel_type === 'resort' ? 'منتجع' :
                     hotel.hotel_type === 'apartment' ? 'شقة' : 'فيلا'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {hotel.is_featured && <Badge className="bg-yellow-500">مميز</Badge>}
                    {hotel.is_active ? (
                      <Badge className="bg-green-500">نشط</Badge>
                    ) : (
                      <Badge variant="secondary">غير نشط</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(hotel)} title="تعديل">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(hotel.id)} title="حذف">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredHotels.length === 0 && (
          <div className="text-center py-12">
            <Hotel className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد فنادق</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminHotelsPage;
