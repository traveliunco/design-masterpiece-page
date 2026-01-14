/**
 * صفحة تعديل الوجهة - لوحة التحكم
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Loader2,
  Plus,
  X,
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

const regions = [
  { value: "asia", label: "آسيا" },
  { value: "europe", label: "أوروبا" },
  { value: "middle_east", label: "الشرق الأوسط" },
  { value: "africa", label: "أفريقيا" },
  { value: "americas", label: "الأمريكتين" },
];

const AdminDestinationEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    slug: "",
    region_ar: "",
    description_ar: "",
    description_en: "",
    short_description_ar: "",
    cover_image: "",
    is_active: true,
    is_featured: false,
    average_rating: 4.5,
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    loadDestination();
  }, [id]);

  const loadDestination = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          name_ar: data.name_ar || "",
          name_en: data.name_en || "",
          slug: data.slug || "",
          region_ar: data.region_ar || "",
          description_ar: data.description_ar || "",
          description_en: data.description_en || "",
          short_description_ar: data.short_description_ar || "",
          cover_image: data.cover_image || "",
          is_active: data.is_active ?? true,
          is_featured: data.is_featured ?? false,
          average_rating: data.average_rating || 4.5,
          tags: data.tags || [],
        });
      }
    } catch (error) {
      console.error("Error loading destination:", error);
      toast.error("حدث خطأ في تحميل البيانات");
      navigate("/admin/destinations");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === "name_en") {
      const slug = value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name_ar || !formData.name_en) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("destinations")
        .update({
          name_ar: formData.name_ar,
          name_en: formData.name_en,
          slug: formData.slug,
          region_ar: formData.region_ar,
          region_en: formData.region_ar,
          description_ar: formData.description_ar,
          description_en: formData.description_en,
          short_description_ar: formData.short_description_ar,
          cover_image: formData.cover_image,
          is_active: formData.is_active,
          is_featured: formData.is_featured,
          average_rating: formData.average_rating,
          tags: formData.tags,
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("تم تحديث الوجهة بنجاح");
      navigate("/admin/destinations");
    } catch (error: unknown) {
      console.error("Error updating destination:", error);
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/destinations")} aria-label="رجوع">
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            تعديل الوجهة
          </h1>
          <p className="text-muted-foreground">تعديل بيانات: {formData.name_ar}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>المعلومات الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>الاسم بالعربي *</Label>
                    <Input
                      name="name_ar"
                      value={formData.name_ar}
                      onChange={handleInputChange}
                      placeholder="ماليزيا"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>الاسم بالإنجليزي *</Label>
                    <Input
                      name="name_en"
                      value={formData.name_en}
                      onChange={handleInputChange}
                      placeholder="Malaysia"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>الرابط (Slug)</Label>
                    <Input
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>المنطقة</Label>
                    <Select 
                      value={formData.region_ar} 
                      onValueChange={(v) => setFormData({ ...formData, region_ar: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="اختر المنطقة" /></SelectTrigger>
                      <SelectContent>
                        {regions.map(r => (
                          <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>وصف قصير</Label>
                  <Input
                    name="short_description_ar"
                    value={formData.short_description_ar}
                    onChange={handleInputChange}
                    placeholder="وصف مختصر للوجهة..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>الوصف بالعربي</Label>
                  <Textarea
                    name="description_ar"
                    value={formData.description_ar}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="وصف تفصيلي للوجهة..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>الوصف بالإنجليزي</Label>
                  <Textarea
                    name="description_en"
                    value={formData.description_en}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Description in English..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>العلامات (Tags)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="أضف علامة..."
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} aria-label="إضافة علامة">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(index)} aria-label="حذف العلامة">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>الصورة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>رابط صورة الغلاف</Label>
                  <Input
                    name="cover_image"
                    value={formData.cover_image}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>
                {formData.cover_image && (
                  <img 
                    src={formData.cover_image} 
                    alt="Preview" 
                    className="w-full h-40 object-cover rounded-lg"
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الإعدادات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>نشطة</Label>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>مميزة</Label>
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(v) => setFormData({ ...formData, is_featured: v })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>التقييم</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.average_rating}
                    onChange={(e) => setFormData({ ...formData, average_rating: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
                  حفظ التغييرات
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full mt-2" 
                  onClick={() => navigate("/admin/destinations")}
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

export default AdminDestinationEdit;
