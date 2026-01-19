import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import { getSoutheastAsiaCountries } from "@/data/southeast-asia";

const AdminSoutheastAsiaCountries = () => {
  const [countries] = useState(getSoutheastAsiaCountries());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    description: "",
    coverImage: "",
    currency: "",
    language: "",
    visa: "",
    bestSeason: "",
    climate: "",
    budget: "",
  });

  const handleEdit = (country: any) => {
    setEditingId(country.id);
    setFormData({
      nameAr: country.nameAr,
      nameEn: country.nameEn,
      description: country.description,
      coverImage: country.coverImage,
      currency: country.currency,
      language: country.language,
      visa: country.visa,
      bestSeason: country.bestSeason,
      climate: country.climate,
      budget: country.budget,
    });
  };

  const handleSave = () => {
    // TODO: Implement Supabase save functionality
    console.log("Saving country:", formData);
    setEditingId(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الدولة؟")) {
      // TODO: Implement Supabase delete functionality
      console.log("Deleting country:", id);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      nameAr: "",
      nameEn: "",
      flag: "",
      description: "",
      coverImage: "",
      currency: "",
      language: "",
      visa: "",
      bestSeason: "",
      climate: "",
      budget: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">إدارة دول جنوب شرق آسيا</h1>
          <p className="text-gray-600 mt-2">إضافة وتعديل دول المنطقة</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-5 h-5" />
          إضافة دولة جديدة
        </Button>
      </div>

      {/* نموذج الإنشاء/التعديل */}
      {(isCreating || editingId) && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {isCreating ? "إضافة دولة جديدة" : "تعديل الدولة"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* الاسم بالعربية */}
            <div className="space-y-2">
              <Label htmlFor="nameAr">الاسم بالعربية *</Label>
              <Input
                id="nameAr"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                placeholder="مثال: تايلاند"
              />
            </div>

            {/* الاسم بالإنجليزية */}
            <div className="space-y-2">
              <Label htmlFor="nameEn">الاسم بالإنجليزية *</Label>
              <Input
                id="nameEn"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                placeholder="Thailand"
              />
            </div>

            {/* العملة */}
            <div className="space-y-2">
              <Label htmlFor="currency">العملة *</Label>
              <Input
                id="currency"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                placeholder="بات تايلاندي (THB)"
              />
            </div>

            {/* اللغة */}
            <div className="space-y-2">
              <Label htmlFor="language">اللغة *</Label>
              <Input
                id="language"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                placeholder="التايلاندية"
              />
            </div>

            {/* التأشيرة */}
            <div className="space-y-2">
              <Label htmlFor="visa">التأشيرة *</Label>
              <Input
                id="visa"
                value={formData.visa}
                onChange={(e) => setFormData({ ...formData, visa: e.target.value })}
                placeholder="تأشيرة عند الوصول"
              />
            </div>

            {/* أفضل موسم */}
            <div className="space-y-2">
              <Label htmlFor="bestSeason">أفضل موسم *</Label>
              <Input
                id="bestSeason"
                value={formData.bestSeason}
                onChange={(e) => setFormData({ ...formData, bestSeason: e.target.value })}
                placeholder="نوفمبر - فبراير"
              />
            </div>

            {/* المناخ */}
            <div className="space-y-2">
              <Label htmlFor="climate">المناخ *</Label>
              <Input
                id="climate"
                value={formData.climate}
                onChange={(e) => setFormData({ ...formData, climate: e.target.value })}
                placeholder="استوائي حار ورطب"
              />
            </div>

            {/* الميزانية */}
            <div className="space-y-2">
              <Label htmlFor="budget">الميزانية اليومية *</Label>
              <Input
                id="budget"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="50-150 دولار"
              />
            </div>

            {/* رابط صورة الغلاف */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="coverImage">رابط صورة الغلاف *</Label>
              <Input
                id="coverImage"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://example.com/cover.jpg"
              />
              {formData.coverImage && (
                <img src={formData.coverImage} alt="Preview" className="w-full h-48 object-cover rounded-lg mt-2" />
              )}
            </div>

            {/* الوصف */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">الوصف *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="اكتب وصفاً شاملاً عن الدولة..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-5 h-5" />
              حفظ
            </Button>
            <Button variant="outline" onClick={() => {
              setIsCreating(false);
              setEditingId(null);
            }}>
              إلغاء
            </Button>
          </div>
        </Card>
      )}

      {/* قائمة الدول */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {countries.map((country) => (
          <Card key={country.id} className="overflow-hidden hover:shadow-xl transition-all">
            <div className="relative h-48">
              <img
                src={country.coverImage}
                alt={country.nameAr}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{country.nameAr}</h3>
                <p className="text-gray-500">{country.nameEn}</p>
              </div>

              <p className="text-gray-600 line-clamp-2">{country.description}</p>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">العملة:</span>
                  <p className="font-medium">{country.currency}</p>
                </div>
                <div>
                  <span className="text-gray-500">المدن:</span>
                  <p className="font-medium">{country.cities.length} مدن</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleEdit(country)}
                >
                  <Edit className="w-4 h-4" />
                  تعديل
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleDelete(country.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {countries.length === 0 && !isCreating && (
        <Card className="p-12 text-center">
          <p className="text-gray-500 text-lg">لا توجد دول مضافة بعد</p>
          <Button onClick={handleCreate} className="mt-4 gap-2">
            <Plus className="w-5 h-5" />
            إضافة أول دولة
          </Button>
        </Card>
      )}
    </div>
  );
};

export default AdminSoutheastAsiaCountries;
