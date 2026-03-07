import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Plus, Edit, Trash2, Save, X, MapPin, Search, Eye
} from "lucide-react";
import {
  getAllCountriesAdmin,
  getAllCitiesAdmin,
  createCity,
  updateCity,
  deleteCity,
  TourCity,
} from "@/services/countriesService";

const emptyForm: Omit<TourCity, "created_at" | "updated_at"> = {
  id: "",
  country_id: "",
  name_ar: "",
  name_en: "",
  description: "",
  image: "",
  best_time: "",
  average_temp: "",
  accommodation: "",
  coordinates_lat: undefined,
  coordinates_lng: undefined,
  attractions: [],
  highlights: [],
  is_active: true,
  display_order: 0,
};

const AdminCitiesManager = () => {
  const queryClient = useQueryClient();
  const [editingKey, setEditingKey] = useState<{ cityId: string; countryId: string } | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [formData, setFormData] = useState(emptyForm);
  const [newAttraction, setNewAttraction] = useState("");
  const [newHighlight, setNewHighlight] = useState("");

  const { data: countries = [] } = useQuery({
    queryKey: ["admin-tour-countries"],
    queryFn: getAllCountriesAdmin,
  });

  const { data: cities = [], isLoading } = useQuery({
    queryKey: ["admin-tour-cities"],
    queryFn: getAllCitiesAdmin,
  });

  const createMutation = useMutation({
    mutationFn: createCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tour-cities"] });
      toast.success("تم إضافة المدينة بنجاح ✅");
      setIsCreating(false);
      setFormData(emptyForm);
    },
    onError: (err: any) => toast.error(`خطأ: ${err.message}`),
  });

  const updateMutation = useMutation({
    mutationFn: ({ cityId, countryId, updates }: { cityId: string; countryId: string; updates: Partial<TourCity> }) =>
      updateCity(cityId, countryId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tour-cities"] });
      toast.success("تم حفظ التعديلات بنجاح ✅");
      setEditingKey(null);
      setFormData(emptyForm);
    },
    onError: (err: any) => toast.error(`خطأ: ${err.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ cityId, countryId }: { cityId: string; countryId: string }) =>
      deleteCity(cityId, countryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tour-cities"] });
      toast.success("تم حذف المدينة");
    },
    onError: (err: any) => toast.error(`خطأ: ${err.message}`),
  });

  const handleEdit = (city: TourCity) => {
    setEditingKey({ cityId: city.id, countryId: city.country_id });
    setIsCreating(false);
    setFormData({ ...city });
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingKey(null);
    setFormData(emptyForm);
  };

  const handleSave = () => {
    if (!formData.name_ar || !formData.name_en) {
      toast.error("يرجى ملء الاسم بالعربية والإنجليزية");
      return;
    }
    if (!formData.id) {
      toast.error("يرجى ملء المعرّف الفريد");
      return;
    }
    if (!formData.country_id) {
      toast.error("يرجى اختيار الدولة");
      return;
    }

    if (isCreating) {
      createMutation.mutate(formData);
    } else if (editingKey) {
      updateMutation.mutate({ cityId: editingKey.cityId, countryId: editingKey.countryId, updates: formData });
    }
  };

  const handleDelete = (city: TourCity) => {
    if (confirm(`هل أنت متأكد من حذف "${city.name_ar}"؟`)) {
      deleteMutation.mutate({ cityId: city.id, countryId: city.country_id });
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingKey(null);
    setFormData(emptyForm);
  };

  // مساعدات للقوائم
  const addToList = (field: "attractions" | "highlights", value: string) => {
    if (value.trim()) {
      setFormData({ ...formData, [field]: [...(formData[field] || []), value.trim()] });
    }
  };

  const removeFromList = (field: "attractions" | "highlights", index: number) => {
    setFormData({ ...formData, [field]: (formData[field] || []).filter((_, i) => i !== index) });
  };

  const filteredCities = cities.filter((c) => {
    const matchCountry = filterCountry === "all" || c.country_id === filterCountry;
    const matchSearch =
      !searchQuery ||
      c.name_ar.includes(searchQuery) ||
      c.name_en.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCountry && matchSearch;
  });

  const getCountryName = (countryId: string) =>
    countries.find((c) => c.id === countryId)?.name_ar || countryId;

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* الرأس */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <MapPin className="w-8 h-8 text-primary" />
            إدارة المدن السياحية
          </h1>
          <p className="text-gray-600 mt-1">
            {cities.length} مدينة مسجّلة في قاعدة البيانات
          </p>
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          {/* بحث */}
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث عن مدينة..."
              className="pr-9 w-44"
            />
          </div>
          {/* تصفية حسب الدولة */}
          <Select value={filterCountry} onValueChange={setFilterCountry}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="كل الدول" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الدول</SelectItem>
              {countries.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.flag_emoji} {c.name_ar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-5 h-5" />
            إضافة مدينة جديدة
          </Button>
        </div>
      </div>

      {/* نموذج الإضافة/التعديل */}
      {(isCreating || editingKey) && (
        <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50 border-green-200 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isCreating ? "✨ إضافة مدينة جديدة" : `✏️ تعديل: ${formData.name_ar}`}
            </h2>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* الدولة */}
            <div className="space-y-2">
              <Label>الدولة *</Label>
              <Select
                value={formData.country_id}
                onValueChange={(val) => setFormData({ ...formData, country_id: val })}
                disabled={!!editingKey}
              >
                <SelectTrigger className={editingKey ? "bg-gray-100" : ""}>
                  <SelectValue placeholder="اختر الدولة" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.flag_emoji} {c.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* المعرّف */}
            <div className="space-y-2">
              <Label>المعرّف (Slug) *</Label>
              <Input
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                placeholder="bangkok"
                disabled={!!editingKey}
                className={editingKey ? "bg-gray-100" : ""}
              />
            </div>

            {/* الاسم عربي */}
            <div className="space-y-2">
              <Label>الاسم بالعربية *</Label>
              <Input
                value={formData.name_ar}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                placeholder="بانكوك"
              />
            </div>

            {/* الاسم إنجليزي */}
            <div className="space-y-2">
              <Label>الاسم بالإنجليزية *</Label>
              <Input
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                placeholder="Bangkok"
              />
            </div>

            {/* أفضل وقت */}
            <div className="space-y-2">
              <Label>أفضل وقت للزيارة</Label>
              <Input
                value={formData.best_time}
                onChange={(e) => setFormData({ ...formData, best_time: e.target.value })}
                placeholder="نوفمبر - فبراير"
              />
            </div>

            {/* درجة الحرارة */}
            <div className="space-y-2">
              <Label>متوسط درجة الحرارة</Label>
              <Input
                value={formData.average_temp}
                onChange={(e) => setFormData({ ...formData, average_temp: e.target.value })}
                placeholder="28-33°C"
              />
            </div>

            {/* الإقامة */}
            <div className="space-y-2">
              <Label>نطاق أسعار الإقامة</Label>
              <Input
                value={formData.accommodation}
                onChange={(e) => setFormData({ ...formData, accommodation: e.target.value })}
                placeholder="فنادق 4-5 نجوم من 80-200 دولار"
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

            {/* الترتيب */}
            <div className="space-y-2">
              <Label>ترتيب العرض</Label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              />
            </div>

            {/* الحالة */}
            <div className="flex items-center gap-3 pt-6">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(val) => setFormData({ ...formData, is_active: val })}
              />
              <Label>المدينة مفعّلة</Label>
            </div>

            {/* الصورة */}
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label>رابط الصورة</Label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
              {formData.image && (
                <img src={formData.image} alt="معاينة" className="w-full h-40 object-cover rounded-xl mt-2 border" />
              )}
            </div>

            {/* الوصف */}
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label>الوصف</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="اكتب وصفاً جذاباً عن المدينة..."
                rows={3}
              />
            </div>

            {/* المعالم السياحية */}
            <div className="space-y-3 md:col-span-2 lg:col-span-3">
              <Label>المعالم السياحية</Label>
              <div className="flex gap-2">
                <Input
                  value={newAttraction}
                  onChange={(e) => setNewAttraction(e.target.value)}
                  placeholder="مثال: القصر الكبير"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addToList("attractions", newAttraction);
                      setNewAttraction("");
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={() => { addToList("attractions", newAttraction); setNewAttraction(""); }}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.attractions || []).map((a, i) => (
                  <Badge key={i} variant="outline" className="gap-1 text-sm py-1 px-3">
                    {a}
                    <button onClick={() => removeFromList("attractions", i)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* أبرز مزايا */}
            <div className="space-y-3 md:col-span-2 lg:col-span-3">
              <Label>أبرز مزايا المدينة</Label>
              <div className="flex gap-2">
                <Input
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="مثال: الشواطئ الذهبية"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addToList("highlights", newHighlight);
                      setNewHighlight("");
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={() => { addToList("highlights", newHighlight); setNewHighlight(""); }}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.highlights || []).map((h, i) => (
                  <Badge key={i} variant="secondary" className="gap-1 text-sm py-1 px-3">
                    {h}
                    <button onClick={() => removeFromList("highlights", i)} className="hover:text-red-500">
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
            <Button variant="outline" onClick={handleCancel}>إلغاء</Button>
          </div>
        </Card>
      )}

      {/* تحميل */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          <span className="mr-3 text-gray-600">جاري تحميل المدن...</span>
        </div>
      )}

      {/* قائمة المدن */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCities.map((city) => (
            <Card key={`${city.country_id}-${city.id}`} className="overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-36">
                {city.image ? (
                  <img
                    src={city.image}
                    alt={city.name_ar}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-teal-200 flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-teal-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                {/* شارة الدولة */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-medium">
                  {getCountryName(city.country_id)}
                </div>
                {/* الحالة */}
                <div className={`absolute top-2 left-2 w-2 h-2 rounded-full ${city.is_active ? "bg-green-400" : "bg-gray-400"}`} />
              </div>

              <div className="p-3 space-y-2">
                <div>
                  <h3 className="font-bold text-gray-800">{city.name_ar}</h3>
                  <p className="text-xs text-gray-500">{city.name_en}</p>
                </div>
                {city.description && (
                  <p className="text-xs text-gray-600 line-clamp-2">{city.description}</p>
                )}
                <div className="text-xs text-gray-500 flex gap-2">
                  {city.attractions && <span>🎯 {city.attractions.length} معلم</span>}
                  {city.best_time && <span>📅 {city.best_time}</span>}
                </div>

                <div className="flex gap-1 pt-1 border-t">
                  <Button variant="outline" size="sm" className="flex-1 h-7 text-xs gap-1" onClick={() => handleEdit(city)}>
                    <Edit className="w-3 h-3" />
                    تعديل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2"
                    title="معاينة صفحة المدينة"
                    onClick={() => window.open(`/country/${city.country_id}/city/${city.id}`, "_blank")}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-7 px-2"
                    title="حذف المدينة"
                    onClick={() => handleDelete(city)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {filteredCities.length === 0 && !isCreating && (
            <div className="col-span-full">
              <Card className="p-12 text-center">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {searchQuery || filterCountry !== "all" ? "لا توجد نتائج" : "لا توجد مدن مضافة بعد"}
                </p>
                {!searchQuery && filterCountry === "all" && (
                  <Button onClick={handleCreate} className="mt-4 gap-2">
                    <Plus className="w-5 h-5" />
                    إضافة أول مدينة
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

export default AdminCitiesManager;
