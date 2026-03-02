import { useState, useEffect, useRef } from "react";
import {
  Search, Home, Plus, Edit, Trash2, Loader2, RefreshCw,
  Eye, EyeOff, GripVertical, Star, Image as ImageIcon,
  Upload, X, MessageSquare, BarChart3, Layout, Phone, Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { homepageService } from "@/services/adminDataService";

// ═══════════ TYPES ═══════════
export interface HeroSlide {
  id: string;
  title: string;
  highlight: string;
  subtitle: string;
  description: string;
  image: string;
  stats: Record<string, string>;
  is_active: boolean;
  order: number;
}

export interface HomeFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  order: number;
}

export interface HomeStat {
  id: string;
  number: string;
  label: string;
  order: number;
}

export interface HomeTestimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  order: number;
}

export interface CTAData {
  title: string;
  highlight: string;
  description: string;
  whatsappNumber: string;
  phoneNumber: string;
  workingHours: string;
}

export interface HomepageData {
  heroSlides: HeroSlide[];
  features: HomeFeature[];
  stats: HomeStat[];
  testimonials: HomeTestimonial[];
  cta: CTAData;
}

// ═══════════ DEFAULT DATA ═══════════
const defaultData: HomepageData = {
  heroSlides: [
    { id: "1", title: "اكتشف", highlight: "العالم", subtitle: "معنا", description: "رحلات استثنائية إلى أجمل الوجهات السياحية حول العالم", image: "/assets/malaysia.jpg", stats: { "وجهة": "50+", "عميل": "10,000+", "تقييم": "4.9" }, is_active: true, order: 1 },
    { id: "2", title: "رحلة", highlight: "أحلامك", subtitle: "تبدأ هنا", description: "برامج سياحية مخصصة تناسب جميع الأذواق والميزانيات", image: "/assets/malaysia.jpg", stats: { "برنامج": "200+", "دولة": "25+", "سنة خبرة": "15+" }, is_active: true, order: 2 },
    { id: "3", title: "شهر عسل", highlight: "لا يُنسى", subtitle: "", description: "عروض رومانسية خاصة للعرسان في أفخم المنتجعات", image: "/assets/malaysia.jpg", stats: { "شهر عسل": "5000+", "منتجع": "100+", "خصم حتى": "30%" }, is_active: true, order: 3 },
  ],
  features: [
    { id: "1", icon: "Shield", title: "حجز آمن ومضمون", description: "نظام دفع آمن 100% مع ضمان استرداد كامل", color: "text-teal-500", bgColor: "bg-gradient-to-br from-teal-500/20 to-cyan-500/10", order: 1 },
    { id: "2", icon: "Trophy", title: "15 سنة من التميز", description: "خبرة طويلة في تنظيم أفضل الرحلات السياحية", color: "text-cyan-500", bgColor: "bg-gradient-to-br from-cyan-500/20 to-blue-500/10", order: 2 },
    { id: "3", icon: "HeartHandshake", title: "خدمة عملاء متميزة", description: "فريق محترف متاح 24/7 لخدمتك", color: "text-blue-500", bgColor: "bg-gradient-to-br from-blue-500/20 to-indigo-500/10", order: 3 },
    { id: "4", icon: "Clock", title: "أسعار تنافسية", description: "أفضل الأسعار مع عروض حصرية طوال العام", color: "text-emerald-500", bgColor: "bg-gradient-to-br from-emerald-500/20 to-teal-500/10", order: 4 },
    { id: "5", icon: "Globe", title: "وجهات متنوعة", description: "أكثر من 50 وجهة سياحية حول العالم", color: "text-indigo-500", bgColor: "bg-gradient-to-br from-indigo-500/20 to-blue-500/10", order: 5 },
    { id: "6", icon: "ThumbsUp", title: "تجربة استثنائية", description: "كل تفصيلة مصممة لراحتك وسعادتك", color: "text-teal-600", bgColor: "bg-gradient-to-br from-teal-600/20 to-emerald-500/10", order: 6 },
  ],
  stats: [
    { id: "1", number: "10,000+", label: "عميل سعيد", order: 1 },
    { id: "2", number: "50+", label: "وجهة سياحية", order: 2 },
    { id: "3", number: "98%", label: "نسبة الرضا", order: 3 },
    { id: "4", number: "15+", label: "سنة خبرة", order: 4 },
  ],
  testimonials: [
    { id: "1", name: "أحمد الغامدي", location: "الرياض", text: "تجربة رائعة مع ترافليون! كانت رحلة شهر العسل في ماليزيا من أجمل الذكريات. شكراً على الخدمة المميزة.", rating: 5, order: 1 },
    { id: "2", name: "سارة العتيبي", location: "جدة", text: "حجزت لعائلتي رحلة إلى تركيا وكانت التجربة ممتازة. الفريق محترف والخدمة راقية جداً.", rating: 5, order: 2 },
    { id: "3", name: "محمد القحطاني", location: "المدينة المنورة", text: "أفضل وكالة سياحية تعاملت معها. الأسعار منافسة والخدمة على مدار الساعة. أنصح الجميع بهم.", rating: 5, order: 3 },
    { id: "4", name: "نورة الشمري", location: "الدمام", text: "رحلة إندونيسيا كانت فوق التوقعات! الفنادق فاخرة والجولات منظمة بشكل ممتاز.", rating: 5, order: 4 },
  ],
  cta: {
    title: "جاهز تبدأ",
    highlight: "رحلتك",
    description: "فريقنا جاهز لمساعدتك في التخطيط لرحلة أحلامك. تواصل معنا الآن واحصل على استشارة مجانية.",
    whatsappNumber: "966569222111",
    phoneNumber: "966569222111",
    workingHours: "نعمل على مدار الساعة 24/7",
  },
};

const STORAGE_KEY = "traveliun_homepage";

export const getHomepageData = (): HomepageData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(stored);
};

export const saveHomepageData = (data: HomepageData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// ═══════════ ICON OPTIONS ═══════════
const iconOptions = [
  { value: "Shield", label: "🛡️ حماية" }, { value: "Trophy", label: "🏆 كأس" },
  { value: "HeartHandshake", label: "🤝 خدمة" }, { value: "Clock", label: "⏰ ساعة" },
  { value: "Globe", label: "🌍 عالمي" }, { value: "ThumbsUp", label: "👍 إعجاب" },
  { value: "Star", label: "⭐ نجمة" }, { value: "Heart", label: "❤️ قلب" },
  { value: "MapPin", label: "📍 موقع" }, { value: "Users", label: "👥 مجموعة" },
  { value: "CheckCircle", label: "✅ تحقق" }, { value: "Plane", label: "✈️ طيران" },
];

const colorOptions = [
  "text-teal-500", "text-cyan-500", "text-blue-500", "text-emerald-500",
  "text-indigo-500", "text-teal-600", "text-rose-500", "text-amber-500",
  "text-purple-500", "text-green-500",
];

// ═══════════ MAIN COMPONENT ═══════════
const AdminHomepage = () => {
  const [data, setData] = useState<HomepageData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [dragItem, setDragItem] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [heroSlides, features, stats, testimonials, cta] = await Promise.all([
          homepageService.getHeroSlides(),
          homepageService.getFeatures(),
          homepageService.getStats(),
          homepageService.getTestimonials(),
          homepageService.getCTASettings(),
        ]);
        const loaded: HomepageData = {
          heroSlides: (heroSlides as any[]).map((s, i) => ({ ...s, order: s.display_order || s.order || i + 1 })),
          features: (features as any[]).map((f, i) => ({ ...f, order: f.display_order || f.order || i + 1, bgColor: f.bg_color || f.bgColor || '' })),
          stats: (stats as any[]).map((s, i) => ({ ...s, order: s.display_order || s.order || i + 1 })),
          testimonials: (testimonials as any[]).map((t, i) => ({ ...t, order: t.display_order || t.order || i + 1 })),
          cta: cta as CTAData,
        };
        if (loaded.heroSlides.length > 0 || loaded.features.length > 0) {
          setData(loaded);
        } else {
          setData(getHomepageData());
        }
      } catch {
        setData(getHomepageData());
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const save = (newData: HomepageData) => {
    setData(newData);
    saveHomepageData(newData);
    // Sync CTA to Supabase
    homepageService.saveCTASettings(newData.cta).catch(() => {});
  };

  // ═══ DRAG & DROP ═══
  const handleDragStart = (id: string) => setDragItem(id);
  const handleDragEnd = () => setDragItem(null);
  const reorder = <T extends { id: string; order: number }>(items: T[], dragId: string, targetId: string): T[] => {
    if (dragId === targetId) return items;
    const arr = [...items];
    const di = arr.findIndex(i => i.id === dragId);
    const ti = arr.findIndex(i => i.id === targetId);
    if (di === -1 || ti === -1) return items;
    const [moved] = arr.splice(di, 1);
    arr.splice(ti, 0, moved);
    arr.forEach((item, i) => item.order = i + 1);
    return arr;
  };

  // ═══════════ HERO SLIDES ═══════════
  const [slideForm, setSlideForm] = useState({ title: "", highlight: "", subtitle: "", description: "", image: "", stats: {} as Record<string, string> });
  const [editingSlide, setEditingSlide] = useState<string | null>(null);
  const [newStatKey, setNewStatKey] = useState("");
  const [newStatVal, setNewStatVal] = useState("");
  const slideFileRef = useRef<HTMLInputElement>(null);

  const handleSlideImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setSlideForm(p => ({ ...p, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const saveSlide = () => {
    if (!slideForm.title && !slideForm.highlight) { toast.error("أدخل العنوان"); return; }
    if (editingSlide) {
      save({ ...data, heroSlides: data.heroSlides.map(s => s.id === editingSlide ? { ...s, ...slideForm } : s) });
      const updated = data.heroSlides.find(s => s.id === editingSlide);
      if (updated) homepageService.upsertHeroSlide({ ...updated, ...slideForm }).catch(() => {});
      setEditingSlide(null);
      toast.success("تم تحديث السلايد");
    } else {
      const newSlide = { ...slideForm, id: Date.now().toString(), is_active: true, order: data.heroSlides.length + 1 };
      save({ ...data, heroSlides: [...data.heroSlides, newSlide] });
      homepageService.upsertHeroSlide(newSlide).catch(() => {});
      toast.success("تم إضافة السلايد");
    }
    setSlideForm({ title: "", highlight: "", subtitle: "", description: "", image: "", stats: {} });
  };

  const editSlide = (s: HeroSlide) => {
    setEditingSlide(s.id);
    setSlideForm({ title: s.title, highlight: s.highlight, subtitle: s.subtitle, description: s.description, image: s.image, stats: { ...s.stats } });
  };

  const toggleSlide = (id: string) => {
    save({ ...data, heroSlides: data.heroSlides.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s) });
    toast.success("تم تحديث الحالة");
  };

  const deleteSlide = (id: string) => {
    if (!confirm("حذف هذا السلايد؟")) return;
    save({ ...data, heroSlides: data.heroSlides.filter(s => s.id !== id) });
    homepageService.deleteHeroSlide(id).catch(() => {});
    toast.success("تم الحذف");
  };

  const addStat = () => {
    if (!newStatKey || !newStatVal) return;
    setSlideForm(p => ({ ...p, stats: { ...p.stats, [newStatKey]: newStatVal } }));
    setNewStatKey(""); setNewStatVal("");
  };

  const removeStat = (key: string) => {
    const { [key]: _, ...rest } = slideForm.stats;
    setSlideForm(p => ({ ...p, stats: rest }));
  };

  // ═══════════ FEATURES ═══════════
  const [featureForm, setFeatureForm] = useState({ icon: "Shield", title: "", description: "", color: "text-teal-500" });
  const [editingFeature, setEditingFeature] = useState<string | null>(null);

  const saveFeature = () => {
    if (!featureForm.title) { toast.error("أدخل العنوان"); return; }
    if (editingFeature) {
      save({ ...data, features: data.features.map(f => f.id === editingFeature ? { ...f, ...featureForm, bgColor: `bg-gradient-to-br from-${featureForm.color.split('-')[1]}-500/20 to-${featureForm.color.split('-')[1]}-500/10` } : f) });
      setEditingFeature(null);
      toast.success("تم التحديث");
    } else {
      save({ ...data, features: [...data.features, { ...featureForm, id: Date.now().toString(), bgColor: `bg-gradient-to-br from-${featureForm.color.split('-')[1]}-500/20 to-${featureForm.color.split('-')[1]}-500/10`, order: data.features.length + 1 }] });
      toast.success("تم الإضافة");
    }
    setFeatureForm({ icon: "Shield", title: "", description: "", color: "text-teal-500" });
  };

  const editFeature = (f: HomeFeature) => {
    setEditingFeature(f.id);
    setFeatureForm({ icon: f.icon, title: f.title, description: f.description, color: f.color });
  };

  const deleteFeature = (id: string) => {
    save({ ...data, features: data.features.filter(f => f.id !== id) });
    homepageService.deleteFeature(id).catch(() => {});
    toast.success("تم الحذف");
  };

  // ═══════════ STATS ═══════════
  const [statForm, setStatForm] = useState({ number: "", label: "" });
  const [editingStat, setEditingStat] = useState<string | null>(null);

  const saveStat = () => {
    if (!statForm.number || !statForm.label) { toast.error("املأ الحقول"); return; }
    if (editingStat) {
      save({ ...data, stats: data.stats.map(s => s.id === editingStat ? { ...s, ...statForm } : s) });
      setEditingStat(null);
      toast.success("تم التحديث");
    } else {
      save({ ...data, stats: [...data.stats, { ...statForm, id: Date.now().toString(), order: data.stats.length + 1 }] });
      toast.success("تم الإضافة");
    }
    setStatForm({ number: "", label: "" });
  };

  const editStat = (s: HomeStat) => { setEditingStat(s.id); setStatForm({ number: s.number, label: s.label }); };
  const deleteStat = (id: string) => { save({ ...data, stats: data.stats.filter(s => s.id !== id) }); homepageService.deleteStat(id).catch(() => {}); toast.success("تم الحذف"); };

  // ═══════════ TESTIMONIALS ═══════════
  const [testForm, setTestForm] = useState({ name: "", location: "", text: "", rating: 5 });
  const [editingTest, setEditingTest] = useState<string | null>(null);

  const saveTestimonial = () => {
    if (!testForm.name || !testForm.text) { toast.error("املأ الحقول"); return; }
    if (editingTest) {
      save({ ...data, testimonials: data.testimonials.map(t => t.id === editingTest ? { ...t, ...testForm } : t) });
      setEditingTest(null);
      toast.success("تم التحديث");
    } else {
      save({ ...data, testimonials: [...data.testimonials, { ...testForm, id: Date.now().toString(), order: data.testimonials.length + 1 }] });
      toast.success("تم الإضافة");
    }
    setTestForm({ name: "", location: "", text: "", rating: 5 });
  };

  const editTest = (t: HomeTestimonial) => { setEditingTest(t.id); setTestForm({ name: t.name, location: t.location, text: t.text, rating: t.rating }); };
  const deleteTest = (id: string) => { save({ ...data, testimonials: data.testimonials.filter(t => t.id !== id) }); homepageService.deleteTestimonial(id).catch(() => {}); toast.success("تم الحذف"); };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" /><p className="text-muted-foreground">جاري التحميل...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Home className="w-7 h-7 text-primary" />إدارة الصفحة الرئيسية</h1>
          <p className="text-muted-foreground">{data.heroSlides.length} سلايد • {data.features.length} ميزة • {data.stats.length} إحصائية • {data.testimonials.length} تقييم</p>
        </div>
        <Button variant="outline" onClick={() => { setData(getHomepageData()); toast.success("تم التحديث"); }}>
          <RefreshCw className="w-4 h-4 ml-2" />تحديث
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero" className="gap-1 text-xs md:text-sm"><Layers className="w-4 h-4" />الهيرو</TabsTrigger>
          <TabsTrigger value="features" className="gap-1 text-xs md:text-sm"><Star className="w-4 h-4" />المميزات</TabsTrigger>
          <TabsTrigger value="stats" className="gap-1 text-xs md:text-sm"><BarChart3 className="w-4 h-4" />الإحصائيات</TabsTrigger>
          <TabsTrigger value="testimonials" className="gap-1 text-xs md:text-sm"><MessageSquare className="w-4 h-4" />التقييمات</TabsTrigger>
          <TabsTrigger value="cta" className="gap-1 text-xs md:text-sm"><Phone className="w-4 h-4" />CTA</TabsTrigger>
        </TabsList>

        {/* ═══ TAB: HERO SLIDES ═══ */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">{editingSlide ? "تعديل السلايد" : "إضافة سلايد جديد"}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <input ref={slideFileRef} type="file" accept="image/*" onChange={handleSlideImage} className="hidden" />
              {/* Image */}
              <div className="flex gap-4 items-start">
                <div className="w-40 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0 cursor-pointer group relative" onClick={() => slideFileRef.current?.click()}>
                  {slideForm.image ? (
                    <img src={slideForm.image} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Upload className="w-6 h-6 text-muted-foreground" /></div>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <Input value={slideForm.title} onChange={e => setSlideForm({...slideForm, title: e.target.value})} placeholder="العنوان" />
                    <Input value={slideForm.highlight} onChange={e => setSlideForm({...slideForm, highlight: e.target.value})} placeholder="الكلمة المميزة" />
                    <Input value={slideForm.subtitle} onChange={e => setSlideForm({...slideForm, subtitle: e.target.value})} placeholder="العنوان الفرعي" />
                  </div>
                  <Input value={slideForm.description} onChange={e => setSlideForm({...slideForm, description: e.target.value})} placeholder="الوصف" />
                </div>
              </div>
              {/* Stats */}
              <div>
                <label className="text-sm font-medium mb-2 block">الإحصائيات</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {Object.entries(slideForm.stats).map(([key, val]) => (
                    <span key={key} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs flex items-center gap-1">
                      {key}: {val}
                      <button onClick={() => removeStat(key)} className="text-red-500 ml-1"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={newStatKey} onChange={e => setNewStatKey(e.target.value)} placeholder="العنوان (مثال: وجهة)" className="w-32" />
                  <Input value={newStatVal} onChange={e => setNewStatVal(e.target.value)} placeholder="القيمة (مثال: 50+)" className="w-32" />
                  <Button type="button" variant="outline" size="sm" onClick={addStat}><Plus className="w-4 h-4" /></Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={saveSlide}>{editingSlide ? "حفظ التعديل" : "إضافة السلايد"}</Button>
                {editingSlide && <Button variant="ghost" onClick={() => { setEditingSlide(null); setSlideForm({ title: "", highlight: "", subtitle: "", description: "", image: "", stats: {} }); }}>إلغاء</Button>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0 divide-y">
              {data.heroSlides.sort((a, b) => a.order - b.order).map(slide => (
                <div key={slide.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 cursor-grab" draggable
                  onDragStart={() => handleDragStart(slide.id)} onDragEnd={handleDragEnd}
                  onDragOver={e => { e.preventDefault(); if (dragItem) save({ ...data, heroSlides: reorder(data.heroSlides, dragItem, slide.id) }); }}>
                  <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="w-20 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {slide.image && <img src={slide.image} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold">{slide.title} <span className="text-primary">{slide.highlight}</span> {slide.subtitle}</p>
                    <p className="text-xs text-muted-foreground truncate">{slide.description}</p>
                    <div className="flex gap-1 mt-1">
                      {Object.entries(slide.stats).map(([k, v]) => (
                        <span key={k} className="bg-muted px-2 py-0.5 rounded text-xs">{k}: {v}</span>
                      ))}
                    </div>
                  </div>
                  <Switch checked={slide.is_active} onCheckedChange={() => toggleSlide(slide.id)} />
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => editSlide(slide)} aria-label="تعديل"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteSlide(slide.id)} aria-label="حذف"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ TAB: FEATURES ═══ */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">{editingFeature ? "تعديل الميزة" : "إضافة ميزة"}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <select value={featureForm.icon} onChange={e => setFeatureForm({...featureForm, icon: e.target.value})} className="border rounded-lg px-3 py-2 text-sm bg-background" title="الأيقونة">
                  {iconOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <Input value={featureForm.title} onChange={e => setFeatureForm({...featureForm, title: e.target.value})} placeholder="العنوان" />
                <Input value={featureForm.description} onChange={e => setFeatureForm({...featureForm, description: e.target.value})} placeholder="الوصف" />
                <div className="flex gap-2">
                  <select value={featureForm.color} onChange={e => setFeatureForm({...featureForm, color: e.target.value})} className="border rounded-lg px-3 py-2 text-sm bg-background flex-1" title="اللون">
                    {colorOptions.map(c => <option key={c} value={c}>{c.replace("text-", "").replace("-500", "").replace("-600", "")}</option>)}
                  </select>
                  <Button onClick={saveFeature} size="sm">{editingFeature ? "حفظ" : <Plus className="w-4 h-4" />}</Button>
                  {editingFeature && <Button variant="ghost" size="sm" onClick={() => { setEditingFeature(null); setFeatureForm({ icon: "Shield", title: "", description: "", color: "text-teal-500" }); }}>إلغاء</Button>}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-0 divide-y">
              {data.features.sort((a, b) => a.order - b.order).map(f => (
                <div key={f.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 cursor-grab" draggable
                  onDragStart={() => handleDragStart(f.id)} onDragEnd={handleDragEnd}
                  onDragOver={e => { e.preventDefault(); if (dragItem) save({ ...data, features: reorder(data.features, dragItem, f.id) }); }}>
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <div className={`w-10 h-10 rounded-xl ${f.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-lg ${f.color}`}>✦</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold">{f.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{f.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => editFeature(f)} aria-label="تعديل"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteFeature(f.id)} aria-label="حذف"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ TAB: STATS ═══ */}
        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">{editingStat ? "تعديل الإحصائية" : "إضافة إحصائية"}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input value={statForm.number} onChange={e => setStatForm({...statForm, number: e.target.value})} placeholder="الرقم (مثال: 10,000+)" className="w-40" />
                <Input value={statForm.label} onChange={e => setStatForm({...statForm, label: e.target.value})} placeholder="العنوان (مثال: عميل سعيد)" className="flex-1" />
                <Button onClick={saveStat}>{editingStat ? "حفظ" : <Plus className="w-4 h-4" />}</Button>
                {editingStat && <Button variant="ghost" onClick={() => { setEditingStat(null); setStatForm({ number: "", label: "" }); }}>إلغاء</Button>}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-0 divide-y">
              {data.stats.sort((a, b) => a.order - b.order).map(s => (
                <div key={s.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 cursor-grab" draggable
                  onDragStart={() => handleDragStart(s.id)} onDragEnd={handleDragEnd}
                  onDragOver={e => { e.preventDefault(); if (dragItem) save({ ...data, stats: reorder(data.stats, dragItem, s.id) }); }}>
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold text-lg">{s.number}</div>
                  <p className="flex-1 font-medium">{s.label}</p>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => editStat(s)} aria-label="تعديل"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteStat(s.id)} aria-label="حذف"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ TAB: TESTIMONIALS ═══ */}
        <TabsContent value="testimonials" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">{editingTest ? "تعديل التقييم" : "إضافة تقييم"}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input value={testForm.name} onChange={e => setTestForm({...testForm, name: e.target.value})} placeholder="الاسم" />
                <Input value={testForm.location} onChange={e => setTestForm({...testForm, location: e.target.value})} placeholder="المدينة" />
              </div>
              <textarea value={testForm.text} onChange={e => setTestForm({...testForm, text: e.target.value})} placeholder="نص التقييم..." className="w-full min-h-[80px] p-3 rounded-lg border bg-background text-sm resize-none" />
              <div className="flex items-end gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">التقييم</label>
                  <div className="flex gap-1 mt-1">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} type="button" onClick={() => setTestForm({...testForm, rating: s})}>
                        <Star className={`w-5 h-5 ${s <= testForm.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1" />
                <Button onClick={saveTestimonial}>{editingTest ? "حفظ" : "إضافة"}</Button>
                {editingTest && <Button variant="ghost" onClick={() => { setEditingTest(null); setTestForm({ name: "", location: "", text: "", rating: 5 }); }}>إلغاء</Button>}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-0 divide-y">
              {data.testimonials.sort((a, b) => a.order - b.order).map(t => (
                <div key={t.id} className="p-4 hover:bg-muted/30 cursor-grab" draggable
                  onDragStart={() => handleDragStart(t.id)} onDragEnd={handleDragEnd}
                  onDragOver={e => { e.preventDefault(); if (dragItem) save({ ...data, testimonials: reorder(data.testimonials, dragItem, t.id) }); }}>
                  <div className="flex items-start gap-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div><p className="font-bold">{t.name}</p><p className="text-xs text-muted-foreground">{t.location}</p></div>
                        <div className="flex items-center gap-1">
                          <div className="flex mr-2">{[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />)}</div>
                          <Button variant="ghost" size="icon" onClick={() => editTest(t)} aria-label="تعديل"><Edit className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteTest(t.id)} aria-label="حذف"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">"{t.text}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ TAB: CTA ═══ */}
        <TabsContent value="cta">
          <Card>
            <CardHeader><CardTitle className="text-base">إعدادات قسم التواصل (CTA)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">العنوان</label>
                  <Input value={data.cta.title} onChange={e => save({ ...data, cta: { ...data.cta, title: e.target.value } })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">الكلمة المميزة</label>
                  <Input value={data.cta.highlight} onChange={e => save({ ...data, cta: { ...data.cta, highlight: e.target.value } })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">الوصف</label>
                <textarea value={data.cta.description} onChange={e => save({ ...data, cta: { ...data.cta, description: e.target.value } })} className="w-full min-h-[80px] p-3 rounded-lg border bg-background text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">رقم الواتساب</label>
                  <Input value={data.cta.whatsappNumber} onChange={e => save({ ...data, cta: { ...data.cta, whatsappNumber: e.target.value } })} dir="ltr" className="text-left font-mono" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">رقم الهاتف</label>
                  <Input value={data.cta.phoneNumber} onChange={e => save({ ...data, cta: { ...data.cta, phoneNumber: e.target.value } })} dir="ltr" className="text-left font-mono" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">ساعات العمل</label>
                <Input value={data.cta.workingHours} onChange={e => save({ ...data, cta: { ...data.cta, workingHours: e.target.value } })} />
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground">يتم حفظ التغييرات تلقائياً</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminHomepage;
