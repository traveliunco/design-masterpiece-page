/**
 * صفحة تعديل العرض - لوحة التحكم
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Tag,
  ArrowRight,
  Calendar,
  Percent,
  DollarSign,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface Offer {
  id: string;
  code: string;
  name_ar: string | null;
  name_en: string | null;
  description: string | null;
  discount_type: string;
  discount_value: number;
  min_order_amount: number | null;
  usage_limit: number | null;
  used_count: number | null;
  valid_from: string;
  valid_until: string;
  is_active: boolean | null;
}

const AdminOfferEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    code: "",
    name_ar: "",
    name_en: "",
    description: "",
    discount_type: "percentage",
    discount_value: 0,
    min_order_amount: 0,
    usage_limit: 100,
    used_count: 0,
    valid_from: "",
    valid_until: "",
    is_active: true,
  });

  useEffect(() => {
    if (id) {
      loadOffer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadOffer = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          code: data.code || "",
          name_ar: data.name_ar || "",
          name_en: data.name_en || "",
          description: data.description || "",
          discount_type: data.discount_type || "percentage",
          discount_value: data.discount_value || 0,
          min_order_amount: data.min_order_amount || 0,
          usage_limit: data.usage_limit || 100,
          used_count: data.used_count || 0,
          valid_from: data.valid_from ? data.valid_from.split("T")[0] : "",
          valid_until: data.valid_until ? data.valid_until.split("T")[0] : "",
          is_active: data.is_active ?? true,
        });
      }
    } catch (error) {
      console.error("Error loading offer:", error);
      toast.error("حدث خطأ في تحميل البيانات");
      navigate("/admin/offers");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name_ar || !formData.discount_value || !formData.code) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("promo_codes")
        .update({
          code: formData.code,
          name_ar: formData.name_ar,
          name_en: formData.name_en,
          description: formData.description,
          discount_type: formData.discount_type,
          discount_value: formData.discount_value,
          min_order_amount: formData.min_order_amount,
          usage_limit: formData.usage_limit,
          valid_from: formData.valid_from,
          valid_until: formData.valid_until,
          is_active: formData.is_active,
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("تم تحديث العرض بنجاح");
      navigate("/admin/offers");
    } catch (error: unknown) {
      console.error("Error:", error);
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ";
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/offers")} aria-label="رجوع">
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Tag className="w-6 h-6 text-primary" />
            تعديل العرض
          </h1>
          <p className="text-muted-foreground">تعديل: {formData.name_ar}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معلومات العرض</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اسم العرض (عربي) *</Label>
                  <Input
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>اسم العرض (إنجليزي)</Label>
                  <Input
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>وصف العرض</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تفاصيل الخصم</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نوع الخصم</Label>
                  <Select value={formData.discount_type} onValueChange={(v) => setFormData({ ...formData, discount_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
                      <SelectItem value="fixed">مبلغ ثابت (ر.س)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>قيمة الخصم *</Label>
                  <div className="relative">
                    {formData.discount_type === "percentage" ? (
                      <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    ) : (
                      <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    )}
                    <Input
                      type="number"
                      value={formData.discount_value}
                      onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })}
                      className="pr-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>الحد الأدنى للحجز</Label>
                  <Input
                    type="number"
                    value={formData.min_order_amount}
                    onChange={(e) => setFormData({ ...formData, min_order_amount: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>الحد الأقصى للاستخدام</Label>
                  <Input
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: parseInt(e.target.value) || 100 })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                فترة الصلاحية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>تاريخ البداية</Label>
                  <Input
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>تاريخ النهاية</Label>
                  <Input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>كود الخصم</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>الكود *</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="font-mono"
                />
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">تم استخدامه</p>
                <p className="text-2xl font-bold">{formData.used_count} / {formData.usage_limit}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Label>تفعيل العرض</Label>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Button className="w-full" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
                حفظ التغييرات
              </Button>
              <Button variant="outline" className="w-full mt-2" onClick={() => navigate("/admin/offers")}>
                إلغاء
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminOfferEdit;
