import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Save,
  Image,
  Upload,
  Globe,
  Star,
  Plus,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import ImageUploader from "@/components/ui/image-uploader";
import { useImageUpload } from "@/hooks/useImageUpload";

const regions = [
  { value: "asia", label: "آسيا" },
  { value: "europe", label: "أوروبا" },
  { value: "middle_east", label: "الشرق الأوسط" },
  { value: "africa", label: "أفريقيا" },
  { value: "americas", label: "الأمريكتين" },
];

const AdminDestinationNew = () => {
  const navigate = useNavigate();
  const [loading, setSaving] = useState(false);
  const { uploadImage, deleteImage, uploading } = useImageUpload("destinations");
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    slug: "",
    region: "",
    descriptionAr: "",
    descriptionEn: "",
    shortDescriptionAr: "",
    coverImage: "/assets/default.jpg",
    isActive: true,
    isFeatured: false,
    rating: "4.5",
    highlights: [] as string[],
  });
  const [newHighlight, setNewHighlight] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from English name
    if (name === "nameEn") {
      const slug = value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()],
      }));
      setNewHighlight("");
    }
  };

  const removeHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nameAr || !formData.nameEn || !formData.region) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setSaving(true);
    try {
      // Save to Supabase
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { data, error } = await supabase
        .from("destinations")
        .insert([
          {
            name_ar: formData.nameAr,
            name_en: formData.nameEn,
            slug: formData.slug,
            country_ar: formData.nameAr, // Using name as country for now
            country_en: formData.nameEn,
            region_ar: formData.region,
            region_en: formData.region,
            description_ar: formData.descriptionAr,
            description_en: formData.descriptionEn,
            short_description_ar: formData.shortDescriptionAr,
            cover_image: formData.coverImage,
            is_active: formData.isActive,
            is_featured: formData.isFeatured,
            average_rating: parseFloat(formData.rating),
            // highlights can be added as tags
            tags: formData.highlights,
          },
        ])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        toast.error(`خطأ في الحفظ: ${error.message}`);
        return;
      }

      toast.success("تم إضافة الوجهة بنجاح");
      navigate("/admin/destinations");
    } catch (error) {
      console.error("Error saving destination:", error);
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/destinations">
          <Button variant="ghost" size="icon" aria-label="العودة للوجهات">
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="w-7 h-7 text-primary" />
            إضافة وجهة جديدة
          </h1>
          <p className="text-muted-foreground">أضف وجهة سياحية جديدة للموقع</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>المعلومات الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nameAr">اسم الوجهة (عربي) *</Label>
                    <Input
                      id="nameAr"
                      name="nameAr"
                      placeholder="مثال: ماليزيا"
                      value={formData.nameAr}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nameEn">اسم الوجهة (إنجليزي) *</Label>
                    <Input
                      id="nameEn"
                      name="nameEn"
                      placeholder="Example: Malaysia"
                      value={formData.nameEn}
                      onChange={handleInputChange}
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="slug">الرابط (Slug)</Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      dir="ltr"
                      placeholder="malaysia"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>المنطقة *</Label>
                    <Select
                      value={formData.region}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, region: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المنطقة" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region.value} value={region.value}>
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescriptionAr">الوصف المختصر (عربي)</Label>
                  <Textarea
                    id="shortDescriptionAr"
                    name="shortDescriptionAr"
                    placeholder="وصف مختصر للوجهة..."
                    value={formData.shortDescriptionAr}
                    onChange={handleInputChange}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descriptionAr">الوصف الكامل (عربي)</Label>
                  <Textarea
                    id="descriptionAr"
                    name="descriptionAr"
                    placeholder="وصف تفصيلي للوجهة..."
                    value={formData.descriptionAr}
                    onChange={handleInputChange}
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
              <CardHeader>
                <CardTitle>أبرز المميزات</CardTitle>
                <CardDescription>أضف مميزات الوجهة التي تظهر في الصفحة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="مثال: شواطئ خلابة"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                  />
                  <Button type="button" onClick={addHighlight}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.highlights.map((highlight, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {highlight}
                      <button 
                        type="button" 
                        onClick={() => removeHighlight(index)}
                        aria-label="حذف الميزة"
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle>صورة الغلاف</CardTitle>
                <CardDescription>ارفع صورة جذابة للوجهة السياحية</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  value={formData.coverImage}
                  onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
                  onUpload={uploadImage}
                  onDelete={deleteImage}
                  uploading={uploading}
                  aspectRatio="video"
                  label="صورة الغلاف الرئيسية"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <Card>
              <CardHeader>
                <CardTitle>النشر</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>نشط</Label>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isActive: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>مميز</Label>
                  <Switch
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isFeatured: checked }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>التقييم</Label>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, rating: e.target.value }))
                      }
                      className="w-20"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  <Save className="w-4 h-4 ml-2" />
                  {loading ? "جاري الحفظ..." : "حفظ الوجهة"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminDestinationNew;
