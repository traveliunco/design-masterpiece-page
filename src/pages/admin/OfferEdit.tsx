/**
 * صفحة تعديل عرض السفر - لوحة التحكم
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Tag,
  ArrowRight,
  Calendar,
  Flame,
  Star,
  Loader2,
  ImageIcon,
  Globe,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const offerTypeLabels: Record<string, string> = {
  seasonal: "موسمي",
  flash: "عرض خاطف",
  honeymoon: "شهر عسل",
  family: "عائلي",
  lastminute: "اللحظة الأخيرة",
  earlybird: "الحجز المبكر",
  group: "مجموعات",
  weekend: "عطلة نهاية الأسبوع",
};

const AdminOfferEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newHighlight, setNewHighlight] = useState("");
  const [newInclude, setNewInclude] = useState("");
  const [newCountry, setNewCountry] = useState("");

  const [formData, setFormData] = useState({
    title_ar: "",
    title_en: "",
    slug: "",
    offer_type: "seasonal",
    destination: "",
    cover_image: "",
    description_ar: "",
    original_price: 0,
    discounted_price: 0,
    discount_percentage: 0,
    duration: "",
    valid_until: "",
    is_hot: false,
    is_active: true,
    is_featured: false,
    countries: [] as string[],
    highlights: [] as string[],
    includes: [] as string[],
    terms: "",
  });

  useEffect(() => {
    if (id) loadOffer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const calcDiscount = (original: number, discounted: number) => {
    if (original > 0 && discounted > 0 && discounted < original) {
      return Math.round(((original - discounted) / original) * 100);
    }
    return 0;
  };

  const loadOffer = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("special_offers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          title_ar: data.title_ar || "",
          title_en: data.title_en || "",
          slug: data.slug || "",
          offer_type: data.offer_type || "seasonal",
          destination: data.destination || "",
          cover_image: data.cover_image || "",
          description_ar: data.description_ar || "",
          original_price: data.original_price || 0,
          discounted_price: data.discounted_price || 0,
          discount_percentage: data.discount_percentage || 0,
          duration: data.duration || "",
          valid_until: data.valid_until ? data.valid_until.split("T")[0] : "",
          is_hot: data.is_hot ?? false,
          is_active: data.is_active ?? true,
          is_featured: data.is_featured ?? false,
          countries: data.countries || [],
          highlights: data.highlights || [],
          includes: data.includes || [],
          terms: data.terms || "",
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
    if (!formData.title_ar || !formData.destination || !formData.original_price || !formData.discounted_price || !formData.valid_until) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setSaving(true);
    try {
      const { error } = await (supabase as any)
        .from("special_offers")
        .update({
          title_ar: formData.title_ar,
          title_en: formData.title_en || null,
          slug: formData.slug || null,
          offer_type: formData.offer_type,
          destination: formData.destination,
          cover_image: formData.cover_image || null,
          description_ar: formData.description_ar || null,
          original_price: formData.original_price,
          discounted_price: formData.discounted_price,
          discount_percentage: formData.discount_percentage || calcDiscount(formData.original_price, formData.discounted_price),
          duration: formData.duration || null,
          valid_until: formData.valid_until,
          is_hot: formData.is_hot,
          is_active: formData.is_active,
          is_featured: formData.is_featured,
          countries: formData.countries.length ? formData.countries : null,
          highlights: formData.highlights.length ? formData.highlights : null,
          includes: formData.includes.length ? formData.includes : null,
          terms: formData.terms || null,
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

  const addItem = (list: string[], item: string, key: "highlights" | "includes" | "countries") => {
    const trimmed = item.trim();
    if (trimmed && !list.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, [key]: [...prev[key], trimmed] }));
    }
  };

  const removeItem = (key: "highlights" | "includes" | "countries", value: string) => {
    setFormData((prev) => ({ ...prev, [key]: prev[key].filter((i) => i !== value) }));
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
            تعديل عرض السفر
          </h1>
          <p className="text-muted-foreground">تعديل: {formData.title_ar}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات العرض الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>عنوان العرض (عربي) *</Label>
                  <Input
                    value={formData.title_ar}
                    onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>عنوان العرض (إنجليزي)</Label>
                  <Input
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نوع العرض</Label>
                  <Select value={formData.offer_type} onValueChange={(v) => setFormData({ ...formData, offer_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(offerTypeLabels).map(([val, label]) => (
                        <SelectItem key={val} value={val}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>الوجهة / الدولة *</Label>
                  <Input
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>وصف العرض</Label>
                <Textarea
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> رابط صورة الغلاف</Label>
                <Input
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  dir="ltr"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>التسعير والخصم</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>السعر الأصلي (ر.س) *</Label>
                  <Input
                    type="number"
                    value={formData.original_price || ""}
                    onChange={(e) => {
                      const original = parseFloat(e.target.value) || 0;
                      setFormData((prev) => ({
                        ...prev,
                        original_price: original,
                        discount_percentage: calcDiscount(original, prev.discounted_price),
                      }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>السعر بعد الخصم (ر.س) *</Label>
                  <Input
                    type="number"
                    value={formData.discounted_price || ""}
                    onChange={(e) => {
                      const discounted = parseFloat(e.target.value) || 0;
                      setFormData((prev) => ({
                        ...prev,
                        discounted_price: discounted,
                        discount_percentage: calcDiscount(prev.original_price, discounted),
                      }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>نسبة الخصم (%)</Label>
                  <Input
                    type="number"
                    value={formData.discount_percentage || ""}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>مدة الرحلة</Label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="7 ليالي / 8 أيام"
                />
              </div>
            </CardContent>
          </Card>

          {/* Validity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                صلاحية العرض
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>تاريخ انتهاء العرض *</Label>
                <Input
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Highlights */}
          <Card>
            <CardHeader>
              <CardTitle>أبرز مميزات العرض</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="مثال: تأشيرة مجانية"
                  onKeyDown={(e) => { if (e.key === "Enter") { addItem(formData.highlights, newHighlight, "highlights"); setNewHighlight(""); } }}
                />
                <Button type="button" size="icon" variant="outline" onClick={() => { addItem(formData.highlights, newHighlight, "highlights"); setNewHighlight(""); }} aria-label="إضافة ميزة">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.highlights.map((h) => (
                  <Badge key={h} variant="secondary" className="gap-1">
                    {h}
                    <button onClick={() => removeItem("highlights", h)} aria-label={`حذف ${h}`}><X className="w-3 h-3" /></button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Includes */}
          <Card>
            <CardHeader>
              <CardTitle>ما يشمله العرض</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newInclude}
                  onChange={(e) => setNewInclude(e.target.value)}
                  placeholder="مثال: طيران ذهاب وعودة"
                  onKeyDown={(e) => { if (e.key === "Enter") { addItem(formData.includes, newInclude, "includes"); setNewInclude(""); } }}
                />
                <Button type="button" size="icon" variant="outline" onClick={() => { addItem(formData.includes, newInclude, "includes"); setNewInclude(""); }} aria-label="إضافة بند">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.includes.map((inc) => (
                  <Badge key={inc} variant="outline" className="gap-1">
                    {inc}
                    <button onClick={() => removeItem("includes", inc)} aria-label={`حذف ${inc}`}><X className="w-3 h-3" /></button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Countries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" />الدول المشمولة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  placeholder="مثال: ماليزيا"
                  onKeyDown={(e) => { if (e.key === "Enter") { addItem(formData.countries, newCountry, "countries"); setNewCountry(""); } }}
                />
                <Button type="button" size="icon" variant="outline" onClick={() => { addItem(formData.countries, newCountry, "countries"); setNewCountry(""); }} aria-label="إضافة دولة">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.countries.map((c) => (
                  <Badge key={c} className="gap-1">
                    {c}
                    <button onClick={() => removeItem("countries", c)} aria-label={`حذف ${c}`}><X className="w-3 h-3" /></button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Terms */}
          <Card>
            <CardHeader>
              <CardTitle>الشروط والأحكام</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات العرض</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">تفعيل العرض</Label>
                <Switch id="is_active" checked={formData.is_active} onCheckedChange={(v) => setFormData({ ...formData, is_active: v })} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_hot" className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" /> عرض ساخن
                </Label>
                <Switch id="is_hot" checked={formData.is_hot} onCheckedChange={(v) => setFormData({ ...formData, is_hot: v })} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured" className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" /> عرض مميز
                </Label>
                <Switch id="is_featured" checked={formData.is_featured} onCheckedChange={(v) => setFormData({ ...formData, is_featured: v })} />
              </div>
            </CardContent>
          </Card>

          {formData.original_price > 0 && formData.discounted_price > 0 && (
            <Card>
              <CardHeader><CardTitle>ملخص الأسعار</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">السعر الأصلي</span>
                  <span className="line-through">{formData.original_price.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">السعر بعد الخصم</span>
                  <span className="text-green-600 font-bold">{formData.discounted_price.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">نسبة الخصم</span>
                  <span className="text-primary font-bold">{formData.discount_percentage}%</span>
                </div>
              </CardContent>
            </Card>
          )}

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
