import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Save, MapPin } from "lucide-react";
import { getAllCities, getSoutheastAsiaCountries } from "@/data/southeast-asia";

const AdminSoutheastAsiaCities = () => {
  const [cities] = useState(getAllCities());
  const [countries] = useState(getSoutheastAsiaCountries());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("all");

  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    description: "",
    image: "",
    coordinates: { lat: 0, lng: 0 },
    bestTimeToVisit: "",
    averageTemp: { summer: "", winter: "" },
    accommodation: { budget: "", midRange: "", luxury: "" },
    highlights: [] as string[],
  });

  const filteredCities = selectedCountry === "all" 
    ? cities 
    : cities.filter(city => {
        const country = countries.find(c => c.cities.some(ct => ct.id === city.id));
        return country?.id === selectedCountry;
      });

  const handleEdit = (city: any) => {
    setEditingId(city.id);
    setFormData({
      nameAr: city.nameAr,
      nameEn: city.nameEn,
      description: city.description,
      image: city.image,
      coordinates: city.coordinates,
      bestTimeToVisit: city.bestTimeToVisit,
      averageTemp: city.averageTemp,
      accommodation: city.accommodation,
      highlights: city.highlights,
    });
  };

  const handleSave = () => {
    // TODO: Implement Supabase save functionality
    console.log("Saving city:", formData);
    setEditingId(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه المدينة؟")) {
      // TODO: Implement Supabase delete functionality
      console.log("Deleting city:", id);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      nameAr: "",
      nameEn: "",
      description: "",
      image: "",
      coordinates: { lat: 0, lng: 0 },
      bestTimeToVisit: "",
      averageTemp: { summer: "", winter: "" },
      accommodation: { budget: "", midRange: "", luxury: "" },
      highlights: [],
    });
  };

  const handleHighlightAdd = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ""] });
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData({ ...formData, highlights: newHighlights });
  };

  const handleHighlightRemove = (index: number) => {
    const newHighlights = formData.highlights.filter((_, i) => i !== index);
    setFormData({ ...formData, highlights: newHighlights });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">إدارة مدن جنوب شرق آسيا</h1>
          <p className="text-gray-600 mt-2">إضافة وتعديل المدن السياحية</p>
        </div>
        <div className="flex gap-3 items-center">
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="تصفية حسب الدولة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الدول</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country.id} value={country.id}>
                  {country.flag} {country.nameAr}
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

      {/* نموذج الإنشاء/التعديل */}
      {(isCreating || editingId) && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {isCreating ? "إضافة مدينة جديدة" : "تعديل المدينة"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* الاسم بالعربية */}
            <div className="space-y-2">
              <Label htmlFor="nameAr">الاسم بالعربية *</Label>
              <Input
                id="nameAr"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                placeholder="مثال: بانكوك"
              />
            </div>

            {/* الاسم بالإنجليزية */}
            <div className="space-y-2">
              <Label htmlFor="nameEn">الاسم بالإنجليزية *</Label>
              <Input
                id="nameEn"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                placeholder="Bangkok"
              />
            </div>

            {/* الإحداثيات */}
            <div className="space-y-2">
              <Label htmlFor="lat">خط العرض (Latitude) *</Label>
              <Input
                id="lat"
                type="number"
                step="0.0001"
                value={formData.coordinates.lat}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  coordinates: { ...formData.coordinates, lat: parseFloat(e.target.value) } 
                })}
                placeholder="13.7563"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lng">خط الطول (Longitude) *</Label>
              <Input
                id="lng"
                type="number"
                step="0.0001"
                value={formData.coordinates.lng}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  coordinates: { ...formData.coordinates, lng: parseFloat(e.target.value) } 
                })}
                placeholder="100.5018"
              />
            </div>

            {/* أفضل وقت للزيارة */}
            <div className="space-y-2">
              <Label htmlFor="bestTime">أفضل وقت للزيارة *</Label>
              <Input
                id="bestTime"
                value={formData.bestTimeToVisit}
                onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                placeholder="نوفمبر - فبراير"
              />
            </div>

            {/* درجة الحرارة - الصيف */}
            <div className="space-y-2">
              <Label htmlFor="tempSummer">درجة الحرارة - الصيف *</Label>
              <Input
                id="tempSummer"
                value={formData.averageTemp.summer}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  averageTemp: { ...formData.averageTemp, summer: e.target.value } 
                })}
                placeholder="28-35°C"
              />
            </div>

            {/* درجة الحرارة - الشتاء */}
            <div className="space-y-2">
              <Label htmlFor="tempWinter">درجة الحرارة - الشتاء *</Label>
              <Input
                id="tempWinter"
                value={formData.averageTemp.winter}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  averageTemp: { ...formData.averageTemp, winter: e.target.value } 
                })}
                placeholder="20-28°C"
              />
            </div>

            {/* الإقامة - اقتصادي */}
            <div className="space-y-2">
              <Label htmlFor="accBudget">الإقامة - اقتصادي *</Label>
              <Input
                id="accBudget"
                value={formData.accommodation.budget}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  accommodation: { ...formData.accommodation, budget: e.target.value } 
                })}
                placeholder="15-30$"
              />
            </div>

            {/* الإقامة - متوسط */}
            <div className="space-y-2">
              <Label htmlFor="accMid">الإقامة - متوسط *</Label>
              <Input
                id="accMid"
                value={formData.accommodation.midRange}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  accommodation: { ...formData.accommodation, midRange: e.target.value } 
                })}
                placeholder="50-100$"
              />
            </div>

            {/* الإقامة - فاخر */}
            <div className="space-y-2">
              <Label htmlFor="accLux">الإقامة - فاخر *</Label>
              <Input
                id="accLux"
                value={formData.accommodation.luxury}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  accommodation: { ...formData.accommodation, luxury: e.target.value } 
                })}
                placeholder="150-500$"
              />
            </div>

            {/* رابط الصورة */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image">رابط الصورة *</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/city.jpg"
              />
              {formData.image && (
                <img src={formData.image} alt="Preview" className="w-full h-48 object-cover rounded-lg mt-2" />
              )}
            </div>

            {/* الوصف */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">الوصف *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="اكتب وصفاً شاملاً عن المدينة..."
                rows={4}
              />
            </div>

            {/* أبرز المعالم */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <Label>أبرز المعالم</Label>
                <Button type="button" size="sm" variant="outline" onClick={handleHighlightAdd}>
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة معلم
                </Button>
              </div>
              <div className="space-y-2">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={highlight}
                      onChange={(e) => handleHighlightChange(index, e.target.value)}
                      placeholder="اسم المعلم"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleHighlightRemove(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
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

      {/* قائمة المدن */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCities.map((city) => {
          const country = countries.find(c => c.cities.some(ct => ct.id === city.id));
          
          return (
            <Card key={city.id} className="overflow-hidden hover:shadow-xl transition-all">
              <div className="relative h-48">
                <img
                  src={city.image}
                  alt={city.nameAr}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-primary" />
                  <span className="text-xs font-medium">{city.coordinates.lat.toFixed(2)}°, {city.coordinates.lng.toFixed(2)}°</span>
                </div>
                {country && (
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="text-lg">{country.flag}</span>
                    <span className="text-xs font-medium">{country.nameAr}</span>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{city.nameAr}</h3>
                  <p className="text-gray-500">{city.nameEn}</p>
                </div>

                <p className="text-gray-600 line-clamp-2">{city.description}</p>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">أفضل وقت:</span>
                    <p className="font-medium">{city.bestTimeToVisit}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">المعالم:</span>
                    <p className="font-medium">{city.highlights.length} معلم</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleEdit(city)}
                  >
                    <Edit className="w-4 h-4" />
                    تعديل
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleDelete(city.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredCities.length === 0 && !isCreating && (
        <Card className="p-12 text-center">
          <p className="text-gray-500 text-lg">لا توجد مدن مضافة بعد</p>
          <Button onClick={handleCreate} className="mt-4 gap-2">
            <Plus className="w-5 h-5" />
            إضافة أول مدينة
          </Button>
        </Card>
      )}
    </div>
  );
};

export default AdminSoutheastAsiaCities;
