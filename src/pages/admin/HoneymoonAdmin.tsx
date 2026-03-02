import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Heart, Plus, Edit, Trash2, Loader2, RefreshCw,
  Eye, EyeOff, GripVertical, Star, MapPin, Calendar,
  MessageSquare, ChevronUp, ChevronDown, Image as ImageIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { honeymoonService } from "@/services/adminDataService";

// ═══════════ TYPES ═══════════
export interface HoneymoonPackage {
  id: string;
  destination: string;
  title: string;
  emoji: string;
  description: string;
  image: string;
  duration: string;
  price: string;
  oldPrice: string;
  features: string[];
  rating: number;
  reviews: number;
  badge: string;
  is_active: boolean;
  order: number;
}

export interface HoneymoonFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  order: number;
}

export interface HoneymoonTestimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  destination: string;
  order: number;
}

export interface HoneymoonData {
  packages: HoneymoonPackage[];
  features: HoneymoonFeature[];
  testimonials: HoneymoonTestimonial[];
}

// ═══════════ DEFAULT DATA ═══════════
const defaultData: HoneymoonData = {
  packages: [
    { id: "1", destination: "المالديف", title: "جنة العشاق", emoji: "🏝️", description: "فيلا خاصة فوق الماء في أجمل جزر المالديف مع عشاء رومانسي تحت النجوم وسبا للزوجين", image: "/assets/maldives.jpg", duration: "5 أيام / 4 ليالي", price: "12,999", oldPrice: "15,999", features: ["فيلا خاصة فوق الماء", "عشاء رومانسي على الشاطئ", "سبا وتدليك للزوجين", "رحلة غطس بالشعاب المرجانية", "استقبال VIP من المطار"], rating: 4.9, reviews: 127, badge: "الأكثر طلباً", is_active: true, order: 1 },
    { id: "2", destination: "بالي - إندونيسيا", title: "سحر الجزيرة", emoji: "🌺", description: "أفخم المنتجعات وسط حقول الأرز والغابات الاستوائية مع جولات طبيعية مذهلة", image: "/assets/indonesia.jpg", duration: "7 أيام / 6 ليالي", price: "8,999", oldPrice: "11,499", features: ["منتجع 5 نجوم وسط الطبيعة", "جولة معابد بالي المقدسة", "مساج بالي التقليدي", "عشاء في مطعم فوق الجرف", "جلسة يوغا صباحية"], rating: 4.8, reviews: 203, badge: "أفضل قيمة", is_active: true, order: 2 },
    { id: "3", destination: "بوكيت - تايلاند", title: "لؤلؤة أندامان", emoji: "🌊", description: "شواطئ ذهبية ومياه فيروزية في أجمل جزر تايلاند مع فلل شاطئية خاصة", image: "/assets/thailand.jpg", duration: "6 أيام / 5 ليالي", price: "6,999", oldPrice: "8,999", features: ["فيلا شاطئية خاصة", "رحلة جزر فاي فاي", "مساج تايلاندي أصيل", "عشاء على اليخت", "جولة بالقارب الزجاجي"], rating: 4.7, reviews: 185, badge: "خصم 22%", is_active: true, order: 3 },
    { id: "4", destination: "لنكاوي - ماليزيا", title: "أرض الأساطير", emoji: "🦅", description: "جزيرة الأحلام بغاباتها الكثيفة وشواطئها البكر ومنتجعاتها الفاخرة", image: "/assets/malaysia.jpg", duration: "5 أيام / 4 ليالي", price: "5,499", oldPrice: "7,299", features: ["منتجع فاخر على البحر", "تلفريك لنكاوي السماوي", "عشاء رومانسي على الشاطئ", "جولة غابات المانغروف", "جسر السماء المعلق"], rating: 4.8, reviews: 156, badge: "الأكثر اقتصادية", is_active: true, order: 4 },
  ],
  features: [
    { id: "1", icon: "Heart", title: "تزيين الغرفة", description: "ورود حمراء وشموع عطرية وديكور رومانسي خاص", color: "bg-rose-500", order: 1 },
    { id: "2", icon: "Gift", title: "هدايا ترحيبية", description: "سلة فواكه استوائية وشوكولاتة فاخرة", color: "bg-amber-500", order: 2 },
    { id: "3", icon: "UtensilsCrossed", title: "عشاء رومانسي", description: "عشاء خاص على ضوء الشموع فوق الشاطئ", color: "bg-pink-500", order: 3 },
    { id: "4", icon: "Camera", title: "جلسة تصوير", description: "مصور محترف يوثق أجمل لحظاتكم", color: "bg-purple-500", order: 4 },
    { id: "5", icon: "Star", title: "استقبال VIP", description: "استقبال خاص من المطار بسيارة فاخرة", color: "bg-teal-500", order: 5 },
    { id: "6", icon: "Shield", title: "تأمين شامل", description: "تأمين سفر شامل طوال فترة الرحلة", color: "bg-blue-500", order: 6 },
  ],
  testimonials: [
    { id: "1", name: "أحمد و سارة", location: "الرياض", text: "كانت أفضل رحلة في حياتنا! كل شيء كان مرتب بشكل مثالي من الفندق للجولات. شكراً ترافليون ❤️", rating: 5, destination: "المالديف", order: 1 },
    { id: "2", name: "عبدالله و نورة", location: "جدة", text: "باقة شهر العسل كانت فوق التوقعات. الفيلا على البحر مباشرة والعشاء الرومانسي كان لا يُنسى!", rating: 5, destination: "بالي", order: 2 },
    { id: "3", name: "خالد و ريم", location: "الدمام", text: "تنظيم ممتاز وخدمة عملاء رائعة. استمتعنا بكل لحظة. ننصح كل عريس وعروسة بترافليون!", rating: 5, destination: "بوكيت", order: 3 },
  ],
};

const STORAGE_KEY = "traveliun_honeymoon";

export const getHoneymoonData = (): HoneymoonData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(stored);
};

export const saveHoneymoonData = (data: HoneymoonData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// ═══════════ ICON & COLOR OPTIONS ═══════════
const iconOptions = [
  { value: "Heart", label: "❤️ قلب" }, { value: "Gift", label: "🎁 هدية" },
  { value: "UtensilsCrossed", label: "🍴 طعام" }, { value: "Camera", label: "📷 كاميرا" },
  { value: "Star", label: "⭐ نجمة" }, { value: "Shield", label: "🛡️ حماية" },
  { value: "MapPin", label: "📍 موقع" }, { value: "Plane", label: "✈️ طيران" },
  { value: "Car", label: "🚗 سيارة" }, { value: "Clock", label: "⏰ ساعة" },
  { value: "Users", label: "👥 مجموعة" }, { value: "Headphones", label: "🎧 دعم" },
];

const colorOptions = [
  { value: "bg-rose-500", label: "وردي" }, { value: "bg-amber-500", label: "ذهبي" },
  { value: "bg-pink-500", label: "زهري" }, { value: "bg-purple-500", label: "بنفسجي" },
  { value: "bg-teal-500", label: "تركوازي" }, { value: "bg-blue-500", label: "أزرق" },
  { value: "bg-emerald-500", label: "أخضر" }, { value: "bg-orange-500", label: "برتقالي" },
  { value: "bg-red-500", label: "أحمر" }, { value: "bg-indigo-500", label: "نيلي" },
];

const emojiOptions = ["🏝️", "🌺", "🌊", "🦅", "💑", "🌴", "🏖️", "🌅", "🗺️", "💎", "🌸", "🦋", "🐚", "🎭", "⛱️", "🚢"];

// ═══════════ MAIN COMPONENT ═══════════
const AdminHoneymoon = () => {
  const [data, setData] = useState<HoneymoonData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [dragItem, setDragItem] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [packages, features, testimonials] = await Promise.all([
          honeymoonService.getPackages(),
          honeymoonService.getFeatures(),
          honeymoonService.getTestimonials(),
        ]);
        const loaded: HoneymoonData = {
          packages: (packages as any[]).map((p, i) => ({ ...p, order: p.display_order || p.order || i + 1, oldPrice: p.old_price || p.oldPrice || '' })),
          features: (features as any[]).map((f, i) => ({ ...f, order: f.display_order || f.order || i + 1, color: f.bg_color || f.color || '' })),
          testimonials: (testimonials as any[]).map((t, i) => ({ ...t, order: t.display_order || t.order || i + 1 })),
        };
        if (loaded.packages.length > 0 || loaded.features.length > 0) {
          setData(loaded);
        } else {
          setData(getHoneymoonData());
        }
      } catch {
        setData(getHoneymoonData());
      }
      setLoading(false);
    };
    load();
  }, []);

  const save = (newData: HoneymoonData) => {
    setData(newData);
    saveHoneymoonData(newData);
  };

  // ═══ DRAG & DROP ═══
  const handleDragStart = (id: string) => setDragItem(id);
  const handleDragEnd = () => setDragItem(null);

  const handleDragOver = (e: React.DragEvent, targetId: string, type: "packages" | "features" | "testimonials") => {
    e.preventDefault();
    if (!dragItem || dragItem === targetId) return;
    const items = [...data[type]];
    const dragIdx = items.findIndex(i => i.id === dragItem);
    const targetIdx = items.findIndex(i => i.id === targetId);
    if (dragIdx === -1 || targetIdx === -1) return;
    const [moved] = items.splice(dragIdx, 1);
    items.splice(targetIdx, 0, moved);
    items.forEach((item, i) => item.order = i + 1);
    save({ ...data, [type]: items });
  };

  // إذا حذفنا package
  const deletePackage = (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الباقة؟")) return;
    save({ ...data, packages: data.packages.filter(p => p.id !== id) });
    honeymoonService.deletePackage(id).catch(() => {});
    toast.success("تم حذف الباقة");
  };

  const togglePackage = (id: string) => {
    const pkg = data.packages.find(p => p.id === id);
    save({
      ...data,
      packages: data.packages.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p)
    });
    if (pkg) honeymoonService.upsertPackage({ ...pkg, is_active: !pkg.is_active }).catch(() => {});
    toast.success("تم تحديث الحالة");
  };

  // ═══ FEATURES CRUD ═══
  const [featureForm, setFeatureForm] = useState({ icon: "Heart", title: "", description: "", color: "bg-rose-500" });
  const [editingFeature, setEditingFeature] = useState<string | null>(null);

  const saveFeature = () => {
    if (!featureForm.title) { toast.error("أدخل اسم الخدمة"); return; }
    if (editingFeature) {
      save({
        ...data,
        features: data.features.map(f => f.id === editingFeature
          ? { ...f, ...featureForm }
          : f)
      });
      setEditingFeature(null);
      toast.success("تم تحديث الخدمة");
    } else {
      const newFeature: HoneymoonFeature = {
        ...featureForm,
        id: Date.now().toString(),
        order: data.features.length + 1
      };
      save({ ...data, features: [...data.features, newFeature] });
      toast.success("تم إضافة الخدمة");
    }
    setFeatureForm({ icon: "Heart", title: "", description: "", color: "bg-rose-500" });
  };

  const editFeature = (f: HoneymoonFeature) => {
    setEditingFeature(f.id);
    setFeatureForm({ icon: f.icon, title: f.title, description: f.description, color: f.color });
  };

  const deleteFeature = (id: string) => {
    save({ ...data, features: data.features.filter(f => f.id !== id) });
    honeymoonService.deleteFeature(id).catch(() => {});
    toast.success("تم حذف الخدمة");
  };

  // ═══ TESTIMONIALS CRUD ═══
  const [testimonialForm, setTestimonialForm] = useState({ name: "", location: "", text: "", rating: 5, destination: "" });
  const [editingTestimonial, setEditingTestimonial] = useState<string | null>(null);

  const saveTestimonial = () => {
    if (!testimonialForm.name || !testimonialForm.text) { toast.error("أدخل الاسم والتقييم"); return; }
    if (editingTestimonial) {
      save({
        ...data,
        testimonials: data.testimonials.map(t => t.id === editingTestimonial
          ? { ...t, ...testimonialForm }
          : t)
      });
      setEditingTestimonial(null);
      toast.success("تم تحديث التقييم");
    } else {
      const newT: HoneymoonTestimonial = {
        ...testimonialForm,
        id: Date.now().toString(),
        order: data.testimonials.length + 1
      };
      save({ ...data, testimonials: [...data.testimonials, newT] });
      toast.success("تم إضافة التقييم");
    }
    setTestimonialForm({ name: "", location: "", text: "", rating: 5, destination: "" });
  };

  const editTestimonial = (t: HoneymoonTestimonial) => {
    setEditingTestimonial(t.id);
    setTestimonialForm({ name: t.name, location: t.location, text: t.text, rating: t.rating, destination: t.destination });
  };

  const deleteTestimonial = (id: string) => {
    save({ ...data, testimonials: data.testimonials.filter(t => t.id !== id) });
    honeymoonService.deleteTestimonial(id).catch(() => {});
    toast.success("تم حذف التقييم");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-500" />
            إدارة صفحة شهر العسل
          </h1>
          <p className="text-muted-foreground">
            تعديل الباقات والخدمات والتقييمات ({data.packages.length} باقة • {data.features.length} خدمة • {data.testimonials.length} تقييم)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setData(getHoneymoonData()); toast.success("تم التحديث"); }} aria-label="تحديث">
            <RefreshCw className="w-4 h-4 ml-2" />تحديث
          </Button>
          <Button onClick={() => navigate("/admin/honeymoon/packages/new")}>
            <Plus className="w-4 h-4 ml-2" />إضافة باقة
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-rose-500">{data.packages.length}</p>
          <p className="text-sm text-muted-foreground">الباقات</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{data.packages.filter(p => p.is_active).length}</p>
          <p className="text-sm text-muted-foreground">نشطة</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{data.features.length}</p>
          <p className="text-sm text-muted-foreground">الخدمات المتضمنة</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-amber-600">{data.testimonials.length}</p>
          <p className="text-sm text-muted-foreground">التقييمات</p>
        </CardContent></Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="packages" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="packages" className="gap-2"><Heart className="w-4 h-4" />الباقات</TabsTrigger>
          <TabsTrigger value="features" className="gap-2"><Star className="w-4 h-4" />الخدمات المتضمنة</TabsTrigger>
          <TabsTrigger value="testimonials" className="gap-2"><MessageSquare className="w-4 h-4" />التقييمات</TabsTrigger>
        </TabsList>

        {/* ═══════════ TAB: PACKAGES ═══════════ */}
        <TabsContent value="packages">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="py-3 px-3 text-right text-sm font-medium text-muted-foreground w-10"></th>
                      <th className="py-3 px-3 text-right text-sm font-medium text-muted-foreground">الصورة</th>
                      <th className="py-3 px-3 text-right text-sm font-medium text-muted-foreground">الباقة</th>
                      <th className="py-3 px-3 text-right text-sm font-medium text-muted-foreground">السعر</th>
                      <th className="py-3 px-3 text-right text-sm font-medium text-muted-foreground">المدة</th>
                      <th className="py-3 px-3 text-right text-sm font-medium text-muted-foreground">التقييم</th>
                      <th className="py-3 px-3 text-right text-sm font-medium text-muted-foreground">الحالة</th>
                      <th className="py-3 px-3 text-right text-sm font-medium text-muted-foreground">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.packages.sort((a, b) => a.order - b.order).map(pkg => (
                      <tr
                        key={pkg.id}
                        className="border-b last:border-0 hover:bg-muted/30 cursor-grab active:cursor-grabbing"
                        draggable
                        onDragStart={() => handleDragStart(pkg.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOver(e, pkg.id, "packages")}
                      >
                        <td className="py-3 px-3">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                        </td>
                        <td className="py-3 px-3">
                          <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted">
                            <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{pkg.emoji}</span>
                            <div>
                              <p className="font-bold">{pkg.title}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{pkg.destination}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <p className="text-sm line-through text-muted-foreground">{pkg.oldPrice} ر.س</p>
                          <p className="font-bold text-rose-500">{pkg.price} ر.س</p>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-sm flex items-center gap-1"><Calendar className="w-3 h-3" />{pkg.duration}</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-sm">{pkg.rating}</span>
                            <span className="text-xs text-muted-foreground">({pkg.reviews})</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <Switch checked={pkg.is_active} onCheckedChange={() => togglePackage(pkg.id)} />
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/honeymoon/packages/edit/${pkg.id}`)} aria-label="تعديل">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deletePackage(pkg.id)} aria-label="حذف">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.packages.length === 0 && (
                <div className="text-center py-16">
                  <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <h3 className="text-lg font-bold">لا توجد باقات</h3>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════ TAB: FEATURES ═══════════ */}
        <TabsContent value="features" className="space-y-4">
          {/* Add/Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{editingFeature ? "تعديل الخدمة" : "إضافة خدمة متضمنة"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <select
                  value={featureForm.icon}
                  onChange={e => setFeatureForm({...featureForm, icon: e.target.value})}
                  className="border rounded-lg px-3 py-2 text-sm bg-background"
                  title="الأيقونة"
                >
                  {iconOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <Input
                  value={featureForm.title}
                  onChange={e => setFeatureForm({...featureForm, title: e.target.value})}
                  placeholder="اسم الخدمة"
                />
                <Input
                  value={featureForm.description}
                  onChange={e => setFeatureForm({...featureForm, description: e.target.value})}
                  placeholder="الوصف"
                />
                <div className="flex gap-2">
                  <select
                    value={featureForm.color}
                    onChange={e => setFeatureForm({...featureForm, color: e.target.value})}
                    className="border rounded-lg px-3 py-2 text-sm bg-background flex-1"
                    title="اللون"
                  >
                    {colorOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <Button onClick={saveFeature} size="sm">
                    {editingFeature ? "حفظ" : <Plus className="w-4 h-4" />}
                  </Button>
                  {editingFeature && (
                    <Button variant="ghost" size="sm" onClick={() => { setEditingFeature(null); setFeatureForm({ icon: "Heart", title: "", description: "", color: "bg-rose-500" }); }}>
                      إلغاء
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features List */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {data.features.sort((a, b) => a.order - b.order).map(feat => (
                  <div
                    key={feat.id}
                    className="flex items-center gap-4 p-4 hover:bg-muted/30 cursor-grab active:cursor-grabbing"
                    draggable
                    onDragStart={() => handleDragStart(feat.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, feat.id, "features")}
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className={`w-10 h-10 rounded-xl ${feat.color} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-sm">✦</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold">{feat.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{feat.description}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => editFeature(feat)} aria-label="تعديل">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteFeature(feat.id)} aria-label="حذف">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════ TAB: TESTIMONIALS ═══════════ */}
        <TabsContent value="testimonials" className="space-y-4">
          {/* Add/Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{editingTestimonial ? "تعديل التقييم" : "إضافة تقييم جديد"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <Input
                  value={testimonialForm.name}
                  onChange={e => setTestimonialForm({...testimonialForm, name: e.target.value})}
                  placeholder="الاسم (مثال: أحمد و سارة)"
                />
                <Input
                  value={testimonialForm.location}
                  onChange={e => setTestimonialForm({...testimonialForm, location: e.target.value})}
                  placeholder="المدينة (مثال: الرياض)"
                />
              </div>
              <textarea
                value={testimonialForm.text}
                onChange={e => setTestimonialForm({...testimonialForm, text: e.target.value})}
                placeholder="نص التقييم..."
                className="w-full min-h-[80px] p-3 rounded-lg border bg-background text-sm resize-none mb-3"
              />
              <div className="flex gap-3 items-end">
                <div>
                  <label className="text-xs text-muted-foreground">التقييم</label>
                  <div className="flex gap-1 mt-1">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} type="button" onClick={() => setTestimonialForm({...testimonialForm, rating: s})}>
                        <Star className={`w-5 h-5 ${s <= testimonialForm.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <Input
                  value={testimonialForm.destination}
                  onChange={e => setTestimonialForm({...testimonialForm, destination: e.target.value})}
                  placeholder="الوجهة"
                  className="flex-1"
                />
                <Button onClick={saveTestimonial}>{editingTestimonial ? "حفظ" : "إضافة"}</Button>
                {editingTestimonial && (
                  <Button variant="ghost" onClick={() => { setEditingTestimonial(null); setTestimonialForm({ name: "", location: "", text: "", rating: 5, destination: "" }); }}>إلغاء</Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Testimonials List */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {data.testimonials.sort((a, b) => a.order - b.order).map(t => (
                  <div
                    key={t.id}
                    className="p-4 hover:bg-muted/30 cursor-grab active:cursor-grabbing"
                    draggable
                    onDragStart={() => handleDragStart(t.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, t.id, "testimonials")}
                  >
                    <div className="flex items-start gap-3">
                      <GripVertical className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-bold">{t.name}</p>
                            <p className="text-xs text-muted-foreground">{t.location} • {t.destination}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="flex mr-3">
                              {[...Array(t.rating)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                              ))}
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => editTestimonial(t)} aria-label="تعديل">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteTestimonial(t.id)} aria-label="حذف">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminHoneymoon;
