/**
 * صفحة تعديل البرنامج - لوحة التحكم
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  Plane,
  Loader2,
  Plus,
  X,
  Calendar,
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
];

interface Destination {
  id: string;
  name_ar: string;
}

const AdminProgramEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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
    description_ar: "",
    description_en: "",
    is_active: true,
    is_featured: false,
    includes: [] as string[],
    excludes: [] as string[],
  });
  const [newInclude, setNewInclude] = useState("");
  const [newExclude, setNewExclude] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load destinations
      const { data: destData } = await supabase
        .from("destinations")
        .select("id, name_ar")
        .eq("is_active", true);
      
      setDestinations(destData || []);

      // Load program
      if (id) {
        const { data, error } = await supabase
          .from("programs")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data) {
          setFormData({
            destination_id: data.destination_id || "",
            name_ar: data.name_ar || "",
            name_en: data.name_en || "",
            program_type: data.program_type || "",
            duration_days: data.duration_days || 7,
            duration_nights: data.duration_nights || 6,
            price: data.price || data.base_price || 0,
            description_ar: data.description_ar || "",
            description_en: data.description_en || "",
            is_active: data.is_active ?? true,
            is_featured: data.is_featured ?? false,
            includes: data.includes || [],
            excludes: data.excludes || [],
          });
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("حدث خطأ في تحميل البيانات");
      navigate("/admin/programs");
    } finally {
      setLoading(false);
    }
  };

  const addInclude = () => {
    if (newInclude.trim()) {
      setFormData(prev => ({ ...prev, includes: [...prev.includes, newInclude.trim()] }));
      setNewInclude("");
    }
  };

  const addExclude = () => {
    if (newExclude.trim()) {
      setFormData(prev => ({ ...prev, excludes: [...prev.excludes, newExclude.trim()] }));
      setNewExclude("");
    }
  };

  const removeItem = (type: "includes" | "excludes", index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name_ar || !formData.destination_id || !formData.program_type) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("programs")
        .update({
          destination_id: formData.destination_id,
          name_ar: formData.name_ar,
          name_en: formData.name_en,
          program_type: formData.program_type,
          duration_days: formData.duration_days,
          duration_nights: formData.duration_nights,
          price: formData.price,
          base_price: formData.price,
          description_ar: formData.description_ar,
          description_en: formData.description_en,
          is_active: formData.is_active,
          is_featured: formData.is_featured,
          includes: formData.includes,
          excludes: formData.excludes,
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("تم تحديث البرنامج بنجاح");
      navigate("/admin/programs");
    } catch (error: unknown) {
      console.error("Error updating program:", error);
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/programs")} aria-label="رجوع">
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Plane className="w-6 h-6 text-primary" />
            تعديل البرنامج
          </h1>
          <p className="text-muted-foreground">تعديل: {formData.name_ar}</p>
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
                    <Label>اسم البرنامج (عربي) *</Label>
                    <Input
                      value={formData.name_ar}
                      onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                      placeholder="برنامج ماليزيا الساحر"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>اسم البرنامج (إنجليزي)</Label>
                    <Input
                      value={formData.name_en}
                      onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                      placeholder="Malaysia Magic Program"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>الوجهة *</Label>
                    <Select 
                      value={formData.destination_id} 
                      onValueChange={(v) => setFormData({ ...formData, destination_id: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="اختر الوجهة" /></SelectTrigger>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                </div>

                <div className="space-y-2">
                  <Label>الوصف (عربي)</Label>
                  <Textarea
                    value={formData.description_ar}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                    rows={4}
                  />
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
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInclude())}
                  />
                  <Button type="button" onClick={addInclude} aria-label="إضافة">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.includes.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded">
                      <span className="text-sm">✓ {item}</span>
                      <button type="button" onClick={() => removeItem("includes", index)} aria-label="حذف">
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
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addExclude())}
                  />
                  <Button type="button" onClick={addExclude} aria-label="إضافة">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.excludes.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-red-50 p-2 rounded">
                      <span className="text-sm">✗ {item}</span>
                      <button type="button" onClick={() => removeItem("excludes", index)} aria-label="حذف">
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
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
                  <Label>نشط</Label>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>مميز</Label>
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(v) => setFormData({ ...formData, is_featured: v })}
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

export default AdminProgramEdit;
