/**
 * صفحة إضافة عرض جديد - لوحة التحكم
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const AdminOfferNew = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    code: "",
    name_ar: "",
    name_en: "",
    description_ar: "",
    discount_type: "percentage",
    discount_value: 0,
    min_amount: 0,
    max_uses: 100,
    start_date: "",
    end_date: "",
    is_active: true,
  });

  const handleSave = async () => {
    if (!formData.name_ar || !formData.discount_value || !formData.start_date || !formData.end_date) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (!formData.code) {
      toast.error("يرجى إدخال أو توليد كود الخصم");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("offers")
        .insert({
          code: formData.code,
          name_ar: formData.name_ar,
          name_en: formData.name_en,
          description_ar: formData.description_ar,
          discount_type: formData.discount_type,
          discount_value: formData.discount_value,
          min_amount: formData.min_amount,
          max_uses: formData.max_uses,
          used_count: 0,
          start_date: formData.start_date,
          end_date: formData.end_date,
          is_active: formData.is_active,
        });

      if (error) throw error;

      toast.success("تم إضافة العرض بنجاح");
      navigate("/admin/offers");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  const generatePromoCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "TRV";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

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
            إضافة عرض جديد
          </h1>
          <p className="text-muted-foreground">أضف عرض ترويجي أو كود خصم جديد</p>
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
                    placeholder="خصم 20% على رحلات ماليزيا"
                  />
                </div>
                <div className="space-y-2">
                  <Label>اسم العرض (إنجليزي)</Label>
                  <Input
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    placeholder="20% Off Malaysia Trips"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>وصف العرض (عربي)</Label>
                <Textarea
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  rows={3}
                  placeholder="وصف مفصل للعرض..."
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
                      placeholder={formData.discount_type === "percentage" ? "20" : "500"}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>الحد الأدنى للحجز</Label>
                  <Input
                    type="number"
                    value={formData.min_amount}
                    onChange={(e) => setFormData({ ...formData, min_amount: parseFloat(e.target.value) || 0 })}
                    placeholder="2000"
                  />
                </div>

                <div className="space-y-2">
                  <Label>عدد مرات الاستخدام</Label>
                  <Input
                    type="number"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({ ...formData, max_uses: parseInt(e.target.value) || 100 })}
                    placeholder="100"
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
                  <Label>تاريخ البداية *</Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>تاريخ النهاية *</Label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
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
                <Label>كود الخصم *</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="SUMMER20"
                    className="font-mono"
                  />
                  <Button type="button" variant="outline" onClick={generatePromoCode}>
                    توليد
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Label htmlFor="active">تفعيل العرض</Label>
                <Switch
                  id="active"
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
                حفظ العرض
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

export default AdminOfferNew;
