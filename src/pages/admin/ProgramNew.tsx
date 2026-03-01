import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  Plane,
  Calendar,
  Plus,
  X,
  Loader2,
  Globe,
  Image,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const programTypes = [
  { value: "honeymoon", label: "شهر عسل" },
  { value: "family", label: "عائلي" },
  { value: "adventure", label: "مغامرة" },
  { value: "cultural", label: "ثقافي" },
  { value: "budget", label: "اقتصادي" },
  { value: "luxury", label: "فاخر" },
  { value: "beach", label: "شاطئي" },
];

interface Destination {
  id: string;
  name_ar: string;
}

const AdminProgramNew = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [formData, setFormData] = useState({
    destination_id: "",
    name_ar: "",
    name_en: "",
    program_type: "",
    duration_days: 7,
    duration_nights: 6,
    price: 0,
    original_price: 0,
    description_ar: "",
    description_en: "",
    cover_image: "",
    is_active: true,
    is_featured: false,
    includes: [] as string[],
    excludes: [] as string[],
    highlights: [] as string[],
    countries: [] as string[],
    gallery: [] as string[],
    itinerary: [] as { day: number; title: string; description: string }[],
  });
  const [newInclude, setNewInclude] = useState("");
  const [newExclude, setNewExclude] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from("destinations")
        .select("id, name_ar")
        .eq("is_active", true)
        .order("name_ar");

      if (error) throw error;
      setDestinations(data || []);
    } catch (error) {
      console.error("Error loading destinations:", error);
      toast.error("حدث خطأ في تحميل الوجهات");
    } finally {
      setLoading(false);
    }
  };

  const addListItem = (field: "includes" | "excludes" | "highlights" | "countries" | "gallery", value: string, setter: (v: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
      setter("");
    }
  };

  const removeListItem = (field: "includes" | "excludes" | "highlights" | "countries" | "gallery", index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const addItineraryDay = () => {
    const nextDay = formData.itinerary.length + 1;
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: nextDay, title: "", description: "" }],
    }));
  };

  const updateItineraryDay = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeItineraryDay = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index).map((item, i) => ({ ...item, day: i + 1 })),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name_ar || !formData.program_type) {
      toast.error("يرجى ملء الاسم ونوع البرنامج على الأقل");
      return;
    }

    setSaving(true);
    try {
      const slug = formData.name_ar.toLowerCase().replace(/\s+/g, "-").replace(/[^\u0621-\u064A0-9-]/g, "");
      
      const insertData: Record<string, any> = {
        destination_id: formData.destination_id || null,
        name_ar: formData.name_ar,
        name_en: formData.name_en,
        slug,
        program_type: formData.program_type,
        duration_days: formData.duration_days,
        duration_nights: formData.duration_nights,
        base_price: formData.price,
        original_price: formData.original_price || null,
        description_ar: formData.description_ar,
        description_en: formData.description_en,
        cover_image: formData.cover_image || "/assets/default-program.jpg",
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        includes: formData.includes,
        excludes: formData.excludes,
        highlights: formData.highlights,
        countries: formData.countries,
        gallery: formData.gallery,
        itinerary: formData.itinerary,
      };

      const { error } = await supabase.from("programs").insert(insertData);

      if (error) throw error;

      toast.success("تم إضافة البرنامج بنجاح");
      navigate("/admin/programs");
    } catch (error: unknown) {
      console.error("Error saving program:", error);
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء الحفظ";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/programs">
          <Button variant="ghost" size="icon" aria-label="العودة للبرامج">
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Plane className="w-6 h-6 text-primary" />
            إضافة برنامج جديد
          </h1>
          <p className="text-muted-foreground">أضف برنامج سياحي جديد بكافة التفاصيل</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>المعلومات الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>اسم البرنامج (عربي) *</Label>
                    <Input
                      value={formData.name_ar}
                      onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                      placeholder="برنامج ماليزيا الساحر 7 أيام"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>اسم البرنامج (إنجليزي)</Label>
                    <Input
                      value={formData.name_en}
                      onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                      placeholder="Malaysia Magic 7 Days"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>الوجهة الرئيسية</Label>
                    <Select
                      value={formData.destination_id}
                      onValueChange={(v) => setFormData({ ...formData, destination_id: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="اختر الوجهة (اختياري)" /></SelectTrigger>
                      <SelectContent>
                        {destinations.map(d => (
                          <SelectItem key={d.id} value={d.id}>{d.name_ar}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>نوع البرنامج *</Label>
                    <Select
                      value={formData.program_type}
                      onValueChange={(v) => setFormData({ ...formData, program_type: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="اختر النوع" /></SelectTrigger>
                      <SelectContent>
                        {programTypes.map(t => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> عدد الأيام
                    </Label>
                    <Input
                      type="number"
                      value={formData.duration_days}
                      onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>عدد الليالي</Label>
                    <Input
                      type="number"
                      value={formData.duration_nights}
                      onChange={(e) => setFormData({ ...formData, duration_nights: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>السعر (ر.س)</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>السعر الأصلي (قبل الخصم)</Label>
                    <Input
                      type="number"
                      value={formData.original_price}
                      onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) || 0 })}
                      placeholder="اتركه 0 إذا لا يوجد خصم"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>الوصف (عربي)</Label>
                    <Textarea
                      value={formData.description_ar}
                      onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                      rows={4}
                      placeholder="وصف تفصيلي للبرنامج..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>الوصف (إنجليزي)</Label>
                    <Textarea
                      value={formData.description_en}
                      onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                      rows={4}
                      placeholder="Detailed description..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Countries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  الدول المشمولة (متعدد الدول)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    placeholder="اسم الدولة (مثال: ماليزيا، تايلاند...)"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addListItem("countries", newCountry, setNewCountry))}
                  />
                  <Button type="button" onClick={() => addListItem("countries", newCountry, setNewCountry)} aria-label="إضافة">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.countries.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
                      <Globe className="w-4 h-4" />
                      <span className="text-sm font-medium">{item}</span>
                      <button type="button" onClick={() => removeListItem("countries", index)} aria-label="حذف">
                        <X className="w-4 h-4 text-red-500 hover:text-red-700" />
                      </button>
                    </div>
                  ))}
                </div>
                {formData.countries.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    أضف الدول التي يشملها البرنامج
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  الأبرز والمحطات الرئيسية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    placeholder="كوالالمبور، جنتنق هايلاند..."
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addListItem("highlights", newHighlight, setNewHighlight))}
                  />
                  <Button type="button" onClick={() => addListItem("highlights", newHighlight, setNewHighlight)} aria-label="إضافة">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.highlights.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-2 rounded-lg">
                      <span className="text-sm font-medium">{item}</span>
                      <button type="button" onClick={() => removeListItem("highlights", index)} aria-label="حذف">
                        <X className="w-4 h-4 text-red-500 hover:text-red-700" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cover Image & Gallery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-purple-600" />
                  الصور
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>رابط صورة الغلاف</Label>
                  <Input
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    placeholder="https://example.com/cover.jpg"
                  />
                  {formData.cover_image && (
                    <img src={formData.cover_image} alt="غلاف" className="w-full h-40 object-cover rounded-lg mt-2" />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>معرض الصور</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      placeholder="رابط الصورة..."
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addListItem("gallery", newGalleryUrl, setNewGalleryUrl))}
                    />
                    <Button type="button" onClick={() => addListItem("gallery", newGalleryUrl, setNewGalleryUrl)} aria-label="إضافة">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {formData.gallery.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt={`gallery-${index}`} className="w-full h-24 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeListItem("gallery", index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="حذف"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Includes */}
            <Card>
              <CardHeader>
                <CardTitle>يشمل البرنامج</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newInclude}
                    onChange={(e) => setNewInclude(e.target.value)}
                    placeholder="الإقامة في فندق 5 نجوم..."
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addListItem("includes", newInclude, setNewInclude))}
                  />
                  <Button type="button" onClick={() => addListItem("includes", newInclude, setNewInclude)} aria-label="إضافة">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.includes.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded">
                      <span className="text-sm">✓ {item}</span>
                      <button type="button" onClick={() => removeListItem("includes", index)} aria-label="حذف">
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Excludes */}
            <Card>
              <CardHeader>
                <CardTitle>لا يشمل البرنامج</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newExclude}
                    onChange={(e) => setNewExclude(e.target.value)}
                    placeholder="التأشيرة..."
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addListItem("excludes", newExclude, setNewExclude))}
                  />
                  <Button type="button" onClick={() => addListItem("excludes", newExclude, setNewExclude)} aria-label="إضافة">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.excludes.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-red-50 p-2 rounded">
                      <span className="text-sm">✗ {item}</span>
                      <button type="button" onClick={() => removeListItem("excludes", index)} aria-label="حذف">
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Itinerary */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>برنامج الرحلة (يوم بيوم)</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addItineraryDay}>
                  <Plus className="w-4 h-4 ml-1" />
                  إضافة يوم
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.itinerary.map((day, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">اليوم {day.day}</span>
                      <button type="button" onClick={() => removeItineraryDay(index)} aria-label="حذف اليوم">
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                    <Input
                      value={day.title}
                      onChange={(e) => updateItineraryDay(index, "title", e.target.value)}
                      placeholder="عنوان اليوم (مثال: الوصول والاستقبال)"
                    />
                    <Textarea
                      value={day.description}
                      onChange={(e) => updateItineraryDay(index, "description", e.target.value)}
                      placeholder="وصف النشاطات والجولات..."
                      rows={3}
                    />
                  </div>
                ))}
                {formData.itinerary.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    اضغط "إضافة يوم" لبدء إضافة برنامج الرحلة يوم بيوم
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>الإعدادات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>نشط (ظاهر للزوار)</Label>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>مميز ⭐</Label>
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(v) => setFormData({ ...formData, is_featured: v })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>ملخص البرنامج</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الدول</span>
                  <span className="font-medium">{formData.countries.length || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المدة</span>
                  <span className="font-medium">{formData.duration_days} أيام / {formData.duration_nights} ليالي</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">السعر</span>
                  <span className="font-medium">{formData.price.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">يشمل</span>
                  <span className="font-medium">{formData.includes.length} عنصر</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الأيام المُفصّلة</span>
                  <span className="font-medium">{formData.itinerary.length} يوم</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الصور</span>
                  <span className="font-medium">{formData.gallery.length + (formData.cover_image ? 1 : 0)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
                  حفظ البرنامج
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full mt-2" 
                  onClick={() => navigate("/admin/programs")}
                >
                  إلغاء
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminProgramNew;
