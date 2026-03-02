import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Save, Loader2, Plus, X, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { type Service, getServices, saveServices } from "./Services";

const iconOptions = [
  { value: "MapPin", label: "📍 موقع" },
  { value: "Heart", label: "❤️ قلب" },
  { value: "Tag", label: "🏷️ عرض" },
  { value: "Car", label: "🚗 سيارة" },
  { value: "FileText", label: "📋 مستند" },
  { value: "Shield", label: "🛡️ حماية" },
  { value: "Plane", label: "✈️ طيران" },
  { value: "Hotel", label: "🏨 فندق" },
  { value: "Users", label: "👥 مجموعة" },
  { value: "CreditCard", label: "💳 بطاقة" },
  { value: "Calendar", label: "📅 تقويم" },
  { value: "Star", label: "⭐ نجمة" },
  { value: "Globe", label: "🌍 عالمي" },
  { value: "Camera", label: "📷 كاميرا" },
  { value: "Headphones", label: "🎧 دعم" },
  { value: "Clock", label: "⏰ ساعة" },
];

const colorOptions = [
  { value: "from-emerald-500 to-teal-600", label: "أخضر زمردي" },
  { value: "from-rose-500 to-pink-600", label: "وردي" },
  { value: "from-amber-500 to-orange-600", label: "برتقالي" },
  { value: "from-blue-500 to-indigo-600", label: "أزرق" },
  { value: "from-indigo-500 to-purple-600", label: "بنفسجي" },
  { value: "from-teal-500 to-cyan-600", label: "تركوازي" },
  { value: "from-orange-500 to-red-600", label: "أحمر" },
  { value: "from-cyan-500 to-blue-600", label: "سماوي" },
  { value: "from-gray-600 to-gray-800", label: "رمادي" },
];

const emojiOptions = ["🗺️", "💑", "🏷️", "🚗", "📋", "🛡️", "✈️", "🏨", "👥", "💳", "🌍", "📷", "🎧", "⏰", "🎁", "🏖️", "⛰️", "🚢"];

const ServiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [form, setForm] = useState<Omit<Service, "id" | "created_at" | "updated_at" | "order">>({
    title: "",
    description: "",
    icon: "MapPin",
    color: "from-emerald-500 to-teal-600",
    path: "/",
    features: [],
    emoji: "🗺️",
    is_active: true,
  });

  useEffect(() => {
    if (isEditing) {
      const services = getServices();
      const service = services.find(s => s.id === id);
      if (service) {
        setForm({
          title: service.title,
          description: service.description,
          icon: service.icon,
          color: service.color,
          path: service.path,
          features: service.features,
          emoji: service.emoji,
          is_active: service.is_active,
        });
      } else {
        toast.error("الخدمة غير موجودة");
        navigate("/admin/services");
      }
    }
  }, [id, isEditing, navigate]);

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setForm(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
    setNewFeature("");
  };

  const removeFeature = (index: number) => {
    setForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.path) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setSaving(true);
    try {
      const services = getServices();

      if (isEditing) {
        const updated = services.map(s =>
          s.id === id
            ? { ...s, ...form, updated_at: new Date().toISOString() }
            : s
        );
        saveServices(updated);
        toast.success("تم تحديث الخدمة بنجاح");
      } else {
        const newService: Service = {
          ...form,
          id: Date.now().toString(),
          order: services.length + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        saveServices([...services, newService]);
        toast.success("تم إضافة الخدمة بنجاح");
      }

      navigate("/admin/services");
    } catch {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/admin/services")} aria-label="رجوع">
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-primary" />
            {isEditing ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "تعديل بيانات الخدمة" : "أضف خدمة جديدة تظهر في صفحة الخدمات"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">معاينة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border max-w-[300px] mx-auto">
              <div className={`h-28 bg-gradient-to-br ${form.color} flex items-center justify-center`}>
                <span className="text-5xl">{form.emoji}</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{form.title || "اسم الخدمة"}</h3>
                <p className="text-sm text-muted-foreground mb-3">{form.description || "وصف الخدمة"}</p>
                <div className="flex flex-wrap gap-1">
                  {form.features.slice(0, 3).map((f, i) => (
                    <span key={i} className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">{f}</span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">المعلومات الأساسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">اسم الخدمة *</label>
              <Input
                value={form.title}
                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="مثال: البرامج السياحية"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">الوصف *</label>
              <textarea
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="وصف مختصر للخدمة..."
                className="w-full min-h-[100px] p-3 rounded-lg border bg-background text-sm resize-none focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">رابط الصفحة *</label>
              <Input
                value={form.path}
                onChange={e => setForm(prev => ({ ...prev, path: e.target.value }))}
                placeholder="/programs"
                dir="ltr"
                className="text-left font-mono"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">المظهر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">الأيقونة</label>
                <Select value={form.icon} onValueChange={v => setForm(prev => ({ ...prev, icon: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">اللون</label>
                <Select value={form.color} onValueChange={v => setForm(prev => ({ ...prev, color: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded bg-gradient-to-br ${opt.value}`} />
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">الإيموجي</label>
              <div className="flex flex-wrap gap-2">
                {emojiOptions.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, emoji }))}
                    className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                      form.emoji === emoji ? "bg-primary/20 ring-2 ring-primary scale-110" : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">المميزات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={e => setNewFeature(e.target.value)}
                placeholder="أضف ميزة جديدة..."
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
              />
              <Button type="button" onClick={addFeature} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {form.features.length > 0 ? (
              <div className="space-y-2">
                {form.features.map((f, i) => (
                  <div key={i} className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-2">
                    <span className="text-sm">{f}</span>
                    <button type="button" onClick={() => removeFeature(i)} className="text-red-500 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">لم تتم إضافة مميزات بعد</p>
            )}
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold">حالة الخدمة</h3>
                <p className="text-sm text-muted-foreground">هل تريد إظهار الخدمة في الموقع؟</p>
              </div>
              <Switch
                checked={form.is_active}
                onCheckedChange={v => setForm(prev => ({ ...prev, is_active: v }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/services")}>
            إلغاء
          </Button>
          <Button type="submit" disabled={saving} className="min-w-[140px]">
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 ml-2" />
                {isEditing ? "حفظ التعديلات" : "إضافة الخدمة"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
