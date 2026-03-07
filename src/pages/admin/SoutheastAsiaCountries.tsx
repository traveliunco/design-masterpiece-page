import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Plus, Edit, Trash2, Save, X, Globe, Search, Eye, EyeOff,
  MapPin, DollarSign, Calendar, Wind, Landmark, Tag
} from "lucide-react";
import {
  getAllCountriesAdmin,
  createCountry,
  updateCountry,
  deleteCountry,
  TourCountry,
} from "@/services/countriesService";

const emptyForm: Omit<TourCountry, "created_at" | "updated_at"> = {
  id: "",
  name_ar: "",
  name_en: "",
  description: "",
  cover_image: "",
  flag_emoji: "🌍",
  currency: "",
  language: "",
  visa: "",
  best_season: "",
  trip_duration: "",
  climate: "",
  budget: "",
  coordinates_lat: undefined,
  coordinates_lng: undefined,
  highlights: [],
  is_active: true,
  display_order: 0,
};

const AdminCountriesManager = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState(emptyForm);
  const [newHighlight, setNewHighlight] = useState("");

  // جلب الدول
  const { data: countries = [], isLoading } = useQuery({
    queryKey: ["admin-tour-countries"],
    queryFn: getAllCountriesAdmin,
  });

  // إنشاء دولة
  const createMutation = useMutation({
    mutationFn: createCountry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tour-countries"] });
      toast.success("تم إضافة الدولة بنجاح ✅");
      setIsCreating(false);
      setFormData(emptyForm);
    },
    onError: (err: any) => {
      toast.error(`خطأ: ${err.message}`);
    },
  });

  // تحديث دولة
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<TourCountry> }) =>
      updateCountry(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tour-countries"] });
      toast.success("تم حفظ التعديلات بنجاح ✅");
      setEditingId(null);
      setFormData(emptyForm);
    },
    onError: (err: any) => {
      toast.error(`خطأ: ${err.message}`);
    },
  });

  // حذف دولة
  const deleteMutation = useMutation({
    mutationFn: deleteCountry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tour-countries"] });
      toast.success("تم حذف الدولة بنجاح");
    },
    onError: (err: any) => {
      toast.error(`خطأ: ${err.message}`);
    },
  });

  const handleEdit = (country: TourCountry) => {
    setEditingId(country.id);
    setIsCreating(false);
    setFormData({
      id: country.id,
      name_ar: country.name_ar,
      name_en: country.name_en,
      description: country.description || "",
      cover_image: country.cover_image || "",
      flag_emoji: country.flag_emoji || "🌍",
      currency: country.currency || "",
      language: country.language || "",
      visa: country.visa || "",
      best_season: country.best_season || "",
      trip_duration: country.trip_duration || "",
      climate: country.climate || "",
      budget: country.budget || "",
      coordinates_lat: country.coordinates_lat,
      coordinates_lng: country.coordinates_lng,
      highlights: country.highlights || [],
      is_active: country.is_active ?? true,
      display_order: country.display_order || 0,
    });
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSave = () => {
    if (!formData.name_ar || !formData.name_en) {
      toast.error("يرجى ملء الاسم بالعربية والإنجليزية");
      return;
    }
    if (!formData.id) {
      toast.error("يرجى ملء المعرّف الفريد (slug)");
      return;
    }

    if (isCreating) {
      createMutation.mutate(formData);
    } else if (editingId) {
      updateMutation.mutate({ id: editingId, updates: formData });
    }
  };

  const handleDelete = (id: string, nameAr: string) => {
    if (confirm(`هل أنت متأكد من حذف "${nameAr}"؟ سيؤدي ذلك إلى حذف جميع مدنها أيضاً.`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleHighlightAdd = () => {
    if (newHighlight.trim()) {
      setFormData({ ...formData, highlights: [...(formData.highlights || []), newHighlight.trim()] });
      setNewHighlight("");
    }
  };

  const handleHighlightRemove = (index: number) => {
    const updated = (formData.highlights || []).filter((_, i) => i !== index);
    setFormData({ ...formData, highlights: updated });
  };

  const filteredCountries = countries.filter(
    (c) =>
      c.name_ar.includes(searchQuery) ||
      c.name_en.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* الرأس */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            إدارة الدول السياحية
          </h1>
          <p className="text-gray-600 mt-1">
            {countries.length} دولة مسجّلة في قاعدة البيانات
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {/* بحث */}
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث عن دولة..."
              className="pr-9 w-48"
            />
          </div>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-5 h-5" />
            إضافة دولة جديدة
          </Button>
        </div>
      </div>

      {/* نموذج الإنشاء/التعديل */}
      {(isCreating || editingId) && (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isCreating ? "✨ إضافة دولة جديدة" : `✏️ تعديل: ${formData.name_ar}`}
            </h2>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* المعرّف */}
            <div className="space-y-2">
              <Label htmlFor="id">المعرّف (Slug) *</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                placeholder="thailand"
                disabled={!!editingId}
                className={editingId ? "bg-gray-100" : ""}
              />
              {isCreating && (
                <p className="text-xs text-gray-500">حروف إنجليزية صغيرة بدون مسافات</p>
              )}
            </div>

            {/* الاسم عربي */}
            <div className="space-y-2">
              <Label htmlFor="name_ar">الاسم بالعربية *</Label>
              <Input
                id="name_ar"
                value={formData.name_ar}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                placeholder="تايلاند"
              />
            </div>

            {/* الاسم إنجليزي */}
            <div className="space-y-2">
              <Label htmlFor="name_en">الاسم بالإنجليزية *</Label>
              <Input
                id="name_en"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                placeholder="Thailand"
              />
            </div>

            {/* الإيموجي */}
            <div className="space-y-2">
              <Label htmlFor="flag_emoji">علم / إيموجي</Label>
              <Input
                id="flag_emoji"
                value={formData.flag_emoji}
                onChange={(e) => setFormData({ ...formData, flag_emoji: e.target.value })}
                placeholder="🇹🇭"
              />
            </div>

            {/* العملة */}
            <div className="space-y-2">
              <Label htmlFor="currency">العملة</Label>
              <Input
                id="currency"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                placeholder="بات تايلاندي (THB)"
              />
            </div>

            {/* اللغة */}
            <div className="space-y-2">
              <Label htmlFor="language">اللغة</Label>
              <Input
                id="language"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                placeholder="التايلاندية"
              />
            </div>

            {/* التأشيرة */}
            <div className="space-y-2">
              <Label htmlFor="visa">التأشيرة</Label>
              <Input
                id="visa"
                value={formData.visa}
                onChange={(e) => setFormData({ ...formData, visa: e.target.value })}
                placeholder="فيزا عند الوصول - 30 يوم"
              />
            </div>

            {/* أفضل موسم */}
            <div className="space-y-2">
              <Label htmlFor="best_season">أفضل موسم</Label>
              <Input
                id="best_season"
                value={formData.best_season}
                onChange={(e) => setFormData({ ...formData, best_season: e.target.value })}
                placeholder="نوفمبر - أبريل"
              />
            </div>

            {/* مدة الرحلة */}
            <div className="space-y-2">
              <Label htmlFor="trip_duration">مدة الرحلة المثالية</Label>
              <Input
                id="trip_duration"
                value={formData.trip_duration}
                onChange={(e) => setFormData({ ...formData, trip_duration: e.target.value })}
                placeholder="7-14 يوم"
              />
            </div>

            {/* المناخ */}
            <div className="space-y-2">
              <Label htmlFor="climate">المناخ</Label>
              <Input
                id="climate"
                value={formData.climate}
                onChange={(e) => setFormData({ ...formData, climate: e.target.value })}
                placeholder="استوائي حار رطب"
              />
            </div>

            {/* الميزانية */}
            <div className="space-y-2">
              <Label htmlFor="budget">الميزانية اليومية</Label>
              <Input
                id="budget"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="150-300 دولار"
              />
            </div>

            {/* الترتيب */}
            <div className="space-y-2">
              <Label htmlFor="display_order">ترتيب العرض</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>

            {/* الإحداثيات */}
            <div className="space-y-2">
              <Label>خط العرض (Lat)</Label>
              <Input
                type="number"
                step="0.0001"
                value={formData.coordinates_lat || ""}
                onChange={(e) => setFormData({ ...formData, coordinates_lat: parseFloat(e.target.value) || undefined })}
                placeholder="13.7563"
              />
            </div>

            <div className="space-y-2">
              <Label>خط الطول (Lng)</Label>
              <Input
                type="number"
                step="0.0001"
                value={formData.coordinates_lng || ""}
                onChange={(e) => setFormData({ ...formData, coordinates_lng: parseFloat(e.target.value) || undefined })}
                placeholder="100.5018"
              />
            </div>

            {/* الحالة */}
            <div className="space-y-2 flex items-center gap-3 pt-6">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(val) => setFormData({ ...formData, is_active: val })}
              />
              <Label>الدولة مفعّلة ومرئية</Label>
            </div>

            {/* صورة الغلاف */}
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label htmlFor="cover_image">رابط صورة الغلاف</Label>
              <Input
                id="cover_image"
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
              {formData.cover_image && (
                <img
                  src={formData.cover_image}
                  alt="معاينة"
                  className="w-full h-40 object-cover rounded-xl mt-2 border"
                />
              )}
            </div>

            {/* الوصف */}
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="اكتب وصفاً جذاباً عن الدولة..."
                rows={3}
              />
            </div>

            {/* أبرز المزايا */}
            <div className="space-y-3 md:col-span-2 lg:col-span-3">
              <Label>أبرز مزايا الدولة</Label>
              <div className="flex gap-2">
                <Input
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="مثال: شواطئ بوكيت الساحرة"
                  onKeyDown={(e) => e.key === "Enter" && handleHighlightAdd()}
                />
                <Button type="button" variant="outline" onClick={handleHighlightAdd}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.highlights || []).map((h, i) => (
                  <Badge key={i} variant="secondary" className="gap-1 text-sm py-1 px-3">
                    {h}
                    <button onClick={() => handleHighlightRemove(i)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t">
            <Button onClick={handleSave} disabled={isSaving} className="gap-2 min-w-32">
              <Save className="w-5 h-5" />
              {isSaving ? "جاري الحفظ..." : "حفظ"}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              إلغاء
            </Button>
          </div>
        </Card>
      )}

      {/* التحميل */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          <span className="mr-3 text-gray-600">جاري تحميل الدول...</span>
        </div>
      )}

      {/* قائمة الدول */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCountries.map((country) => (
            <Card key={country.id} className="overflow-hidden hover:shadow-xl transition-all group">
              {/* صورة الغلاف */}
              <div className="relative h-44">
                {country.cover_image ? (
                  <img
                    src={country.cover_image}
                    alt={country.name_ar}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                    <Globe className="w-16 h-16 text-blue-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 right-3 text-white">
                  <p className="text-2xl font-bold">{country.flag_emoji} {country.name_ar}</p>
                  <p className="text-sm opacity-80">{country.name_en}</p>
                </div>
                {/* حالة التفعيل */}
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold ${
                  country.is_active ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                }`}>
                  {country.is_active ? "مفعّل" : "مخفي"}
                </div>
              </div>

              <div className="p-4 space-y-3">
                {/* معلومات سريعة */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {country.currency && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <DollarSign className="w-3 h-3" />
                      <span className="truncate">{country.currency}</span>
                    </div>
                  )}
                  {country.best_season && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span className="truncate">{country.best_season}</span>
                    </div>
                  )}
                  {country.visa && (
                    <div className="flex items-center gap-1 text-gray-600 col-span-2">
                      <Landmark className="w-3 h-3" />
                      <span className="truncate">{country.visa}</span>
                    </div>
                  )}
                </div>

                {country.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">{country.description}</p>
                )}

                {/* أزرار التحكم */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={() => handleEdit(country)}
                  >
                    <Edit className="w-4 h-4" />
                    تعديل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    title="معاينة صفحة الدولة"
                    onClick={() => window.open(`/country/${country.id}`, "_blank")}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleDelete(country.id, country.name_ar)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {filteredCountries.length === 0 && !isCreating && (
            <div className="col-span-full">
              <Card className="p-12 text-center">
                <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  {searchQuery ? "لا توجد نتائج للبحث" : "لا توجد دول مضافة بعد"}
                </p>
                {!searchQuery && (
                  <Button onClick={handleCreate} className="mt-4 gap-2">
                    <Plus className="w-5 h-5" />
                    إضافة أول دولة
                  </Button>
                )}
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCountriesManager;
