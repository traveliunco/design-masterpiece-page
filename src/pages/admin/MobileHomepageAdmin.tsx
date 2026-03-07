/**
 * MobileHomepageAdmin.tsx
 * صفحة إدارة شاملة للصفحة الرئيسية للموبايل
 * تتحكم في: السلايدات، الوجهات، الإجراءات السريعة، المميزات، بانر التطبيق، القائمة السفلية
 */
import { useState, useEffect } from "react";
import {
  Smartphone, Save, RotateCcw, Plus, Trash2, Edit, GripVertical,
  Eye, EyeOff, ExternalLink, ChevronDown, Check, X, Star,
  Image as ImageIcon, Zap, Layout, Navigation, Gift, Type
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  mobileHomepageService,
  defaultMobileData,
  type MobileHomepageData,
  type MobileDeal,
  type MobileDestination,
  type MobileQuickAction,
  type MobileFeature,
  type MobileBottomNavItem,
} from "@/services/adminDataService";

// ─── تابات الأقسام ───
const SECTIONS = [
  { id: "hero", label: "الهيدر", icon: Type },
  { id: "deals", label: "العروض (سلايدات)", icon: Gift },
  { id: "destinations", label: "الوجهات", icon: Layout },
  { id: "quickActions", label: "الإجراءات السريعة", icon: Zap },
  { id: "features", label: "المميزات", icon: Star },
  { id: "appBanner", label: "بانر التطبيق", icon: Smartphone },
  { id: "bottomNav", label: "القائمة السفلية", icon: Navigation },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

// ─── تدرجات الألوان ───
const GRADIENTS = [
  "from-teal-500 via-emerald-500 to-green-500",
  "from-blue-500 via-cyan-500 to-teal-500",
  "from-cyan-500 via-blue-500 to-indigo-500",
  "from-purple-500 via-pink-500 to-rose-500",
  "from-orange-500 via-amber-500 to-yellow-500",
  "from-red-500 via-rose-500 to-pink-500",
  "from-indigo-500 via-purple-500 to-violet-500",
];

const QUICK_COLORS = [
  "bg-gradient-to-br from-teal-600 to-cyan-500",
  "bg-gradient-to-br from-indigo-500 to-blue-500",
  "bg-gradient-to-br from-cyan-600 to-teal-500",
  "bg-gradient-to-br from-emerald-500 to-teal-400",
  "bg-gradient-to-br from-purple-600 to-pink-500",
  "bg-gradient-to-br from-orange-500 to-amber-400",
];

const EMOJIS = ["✈️","🏨","🌴","💑","🎁","💳","🌐","⚡","🛡️","🎧","👤","🗺️","🏖️","🎯","🌍","🇦🇪","🇸🇦"];

// ─── Section Header ───
const SectionHeader = ({ title, icon: Icon, count }: { title: string; icon: React.ElementType; count?: number }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div>
      <h2 className="text-lg font-bold">{title}</h2>
      {count !== undefined && <p className="text-xs text-muted-foreground">{count} عنصر</p>}
    </div>
  </div>
);

// ─── Main Component ───
const MobileHomepageAdmin = () => {
  const [data, setData] = useState<MobileHomepageData>(mobileHomepageService.getData());
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [dragId, setDragId] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setData(mobileHomepageService.getData());
  }, []);

  const update = (newData: MobileHomepageData) => {
    setData(newData);
    setHasChanges(true);
  };

  const saveAll = () => {
    mobileHomepageService.saveData(data);
    setHasChanges(false);
    toast.success("✅ تم حفظ إعدادات الموبايل");
  };

  const resetAll = () => {
    if (!confirm("إعادة تعيين جميع إعدادات الموبايل للقيم الافتراضية؟")) return;
    mobileHomepageService.resetToDefault();
    setData(defaultMobileData);
    setHasChanges(false);
    toast.success("تم الإعادة للافتراضي");
  };

  // ─── Drag & Drop ───
  const handleDrag = <T extends { id: string; order: number }>(
    arr: T[], targetId: string, setArr: (a: T[]) => void
  ) => {
    if (!dragId || dragId === targetId) return;
    const from = arr.findIndex(i => i.id === dragId);
    const to = arr.findIndex(i => i.id === targetId);
    if (from === -1 || to === -1) return;
    const copy = [...arr];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    copy.forEach((i, idx) => { i.order = idx + 1; });
    setArr(copy);
  };

  // ─── Toggle Active ───
  const toggleItem = <T extends { id: string; is_active: boolean }>(
    arr: T[], id: string
  ) => arr.map(i => i.id === id ? { ...i, is_active: !i.is_active } : i);

  // ─── Delete ───
  const deleteItem = <T extends { id: string }>(arr: T[], id: string) =>
    arr.filter(i => i.id !== id);

  // ─── Add ───
  const genId = () => Date.now().toString();

  // ════════════════════════════════════════
  // ─── SECTIONS RENDERERS ───
  // ════════════════════════════════════════

  const renderHero = () => (
    <div className="space-y-4">
      <SectionHeader title="إعدادات الهيدر" icon={Type} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">اسم الموقع في الهيدر</label>
          <Input value={data.heroTitle || ""} onChange={e => update({ ...data, heroTitle: e.target.value })} placeholder="ترافليون" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">العبارة التعريفية</label>
          <Input value={data.heroSubtitle || ""} onChange={e => update({ ...data, heroSubtitle: e.target.value })} placeholder="احجز رحلتك بسهولة" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium mb-1 block">نص مربع البحث (Placeholder)</label>
          <Input value={data.searchPlaceholder || ""} onChange={e => update({ ...data, searchPlaceholder: e.target.value })} placeholder="إلى أين تريد السفر؟" />
        </div>
      </div>
    </div>
  );

  const renderDeals = () => {
    const addDeal = () => {
      const newDeal: MobileDeal = { id: genId(), title: "عنوان جديد", subtitle: "وصف قصير", gradient: GRADIENTS[0], icon: "🎁", link: "/offers", is_active: true, order: data.deals.length + 1 };
      update({ ...data, deals: [...data.deals, newDeal] });
    };
    return (
      <div>
        <SectionHeader title="بطاقات العروض (سلايدات)" icon={Gift} count={data.deals.length} />
        <div className="space-y-3 mb-4">
          {data.deals.sort((a,b)=>a.order-b.order).map(deal => (
            <Card key={deal.id} draggable onDragStart={() => setDragId(deal.id)} onDragEnd={() => setDragId(null)} onDragOver={e => { e.preventDefault(); handleDrag(data.deals, deal.id, d => update({ ...data, deals: d })); }} className={!deal.is_active ? "opacity-50" : ""}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab flex-shrink-0" />
                  <span className="text-2xl">{deal.icon}</span>
                  <div className="flex-1 font-semibold">{deal.title}</div>
                  <Switch checked={deal.is_active} onCheckedChange={() => update({ ...data, deals: toggleItem(data.deals, deal.id) })} />
                  <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8" onClick={() => { if(confirm("حذف العرض؟")) update({ ...data, deals: deleteItem(data.deals, deal.id) }); }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">العنوان الرئيسي</label>
                    <Input value={deal.title} onChange={e => update({ ...data, deals: data.deals.map(d => d.id === deal.id ? { ...d, title: e.target.value } : d) })} className="h-8 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">العنوان الثانوي</label>
                    <Input value={deal.subtitle} onChange={e => update({ ...data, deals: data.deals.map(d => d.id === deal.id ? { ...d, subtitle: e.target.value } : d) })} className="h-8 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">الرابط</label>
                    <Input value={deal.link} onChange={e => update({ ...data, deals: data.deals.map(d => d.id === deal.id ? { ...d, link: e.target.value } : d) })} className="h-8 text-sm" dir="ltr" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">الأيقونة (emoji)</label>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {EMOJIS.slice(0,10).map(e => (
                        <button key={e} onClick={() => update({ ...data, deals: data.deals.map(d => d.id === deal.id ? { ...d, icon: e } : d) })} className={`text-lg p-0.5 rounded ${deal.icon === e ? "bg-primary/20 ring-1 ring-primary" : "hover:bg-muted"}`}>{e}</button>
                      ))}
                    </div>
                    <Input value={deal.icon} onChange={e => update({ ...data, deals: data.deals.map(d => d.id === deal.id ? { ...d, icon: e.target.value } : d) })} className="h-8 text-sm text-center" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted-foreground mb-1 block">لون التدرج</label>
                    <div className="flex flex-wrap gap-2">
                      {GRADIENTS.map(g => (
                        <button key={g} onClick={() => update({ ...data, deals: data.deals.map(d => d.id === deal.id ? { ...d, gradient: g } : d) })} className={`w-10 h-6 rounded-full bg-gradient-to-r ${g} ${deal.gradient === g ? "ring-2 ring-offset-1 ring-primary" : ""}`} title={g} />
                      ))}
                    </div>
                  </div>
                </div>
                {/* معاينة */}
                <div className={`rounded-xl p-3 bg-gradient-to-br text-white text-sm flex items-center gap-3 ${deal.gradient}`}>
                  <span className="text-2xl">{deal.icon}</span>
                  <div><p className="font-bold">{deal.title}</p><p className="text-white/80 text-xs">{deal.subtitle}</p></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button onClick={addDeal} className="gap-2"><Plus className="w-4 h-4" />إضافة عرض</Button>
      </div>
    );
  };

  const renderDestinations = () => {
    const addDest = () => {
      const nd: MobileDestination = { id: genId(), name: "وجهة جديدة", slug: "new-dest", countrySlug: "new", country: "الدولة", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop", price: "من 1,000 ر.س", rating: 4.5, is_active: true, order: data.destinations.length + 1 };
      update({ ...data, destinations: [...data.destinations, nd] });
    };
    return (
      <div>
        <SectionHeader title="الوجهات الشعبية" icon={Layout} count={data.destinations.length} />
        <div className="space-y-3 mb-4">
          {data.destinations.sort((a,b)=>a.order-b.order).map(dest => (
            <Card key={dest.id} draggable onDragStart={() => setDragId(dest.id)} onDragEnd={() => setDragId(null)} onDragOver={e => { e.preventDefault(); handleDrag(data.destinations, dest.id, d => update({ ...data, destinations: d })); }} className={!dest.is_active ? "opacity-50" : ""}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                  <img src={dest.image} alt={dest.name} className="w-12 h-10 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{dest.name}</p>
                    <p className="text-xs text-muted-foreground">{dest.country}</p>
                  </div>
                  <Switch checked={dest.is_active} onCheckedChange={() => update({ ...data, destinations: toggleItem(data.destinations, dest.id) })} />
                  <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8" onClick={() => { if(confirm("حذف الوجهة؟")) update({ ...data, destinations: deleteItem(data.destinations, dest.id) }); }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div><label className="text-xs text-muted-foreground mb-0.5 block">الاسم</label><Input value={dest.name} onChange={e => update({ ...data, destinations: data.destinations.map(d => d.id === dest.id ? { ...d, name: e.target.value } : d) })} className="h-8 text-sm" /></div>
                  <div><label className="text-xs text-muted-foreground mb-0.5 block">الدولة</label><Input value={dest.country} onChange={e => update({ ...data, destinations: data.destinations.map(d => d.id === dest.id ? { ...d, country: e.target.value } : d) })} className="h-8 text-sm" /></div>
                  <div><label className="text-xs text-muted-foreground mb-0.5 block">السعر</label><Input value={dest.price} onChange={e => update({ ...data, destinations: data.destinations.map(d => d.id === dest.id ? { ...d, price: e.target.value } : d) })} className="h-8 text-sm" /></div>
                  <div><label className="text-xs text-muted-foreground mb-0.5 block">التقييم</label><Input type="number" min="1" max="5" step="0.1" value={dest.rating} onChange={e => update({ ...data, destinations: data.destinations.map(d => d.id === dest.id ? { ...d, rating: parseFloat(e.target.value) } : d) })} className="h-8 text-sm" /></div>
                  <div><label className="text-xs text-muted-foreground mb-0.5 block">Slug المدينة</label><Input value={dest.slug} dir="ltr" onChange={e => update({ ...data, destinations: data.destinations.map(d => d.id === dest.id ? { ...d, slug: e.target.value } : d) })} className="h-8 text-sm" /></div>
                  <div><label className="text-xs text-muted-foreground mb-0.5 block">Slug الدولة</label><Input value={dest.countrySlug} dir="ltr" onChange={e => update({ ...data, destinations: data.destinations.map(d => d.id === dest.id ? { ...d, countrySlug: e.target.value } : d) })} className="h-8 text-sm" /></div>
                  <div className="md:col-span-2"><label className="text-xs text-muted-foreground mb-0.5 block">رابط الصورة</label><Input value={dest.image} dir="ltr" onChange={e => update({ ...data, destinations: data.destinations.map(d => d.id === dest.id ? { ...d, image: e.target.value } : d) })} className="h-8 text-sm" /></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button onClick={addDest} className="gap-2"><Plus className="w-4 h-4" />إضافة وجهة</Button>
      </div>
    );
  };

  const renderQuickActions = () => {
    const add = () => {
      const n: MobileQuickAction = { id: genId(), label: "جديد", icon: "🔗", path: "/", color: QUICK_COLORS[0], is_active: true, order: data.quickActions.length + 1 };
      update({ ...data, quickActions: [...data.quickActions, n] });
    };
    return (
      <div>
        <SectionHeader title="الإجراءات السريعة (شبكة الأزرار)" icon={Zap} count={data.quickActions.length} />
        <div className="space-y-3 mb-4">
          {data.quickActions.sort((a,b)=>a.order-b.order).map(qa => (
            <Card key={qa.id} draggable onDragStart={() => setDragId(qa.id)} onDragEnd={() => setDragId(null)} onDragOver={e => { e.preventDefault(); handleDrag(data.quickActions, qa.id, q => update({ ...data, quickActions: q })); }} className={!qa.is_active ? "opacity-50" : ""}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl ${qa.color}`}>{qa.icon}</div>
                  <div className="flex-1 font-semibold text-sm">{qa.label}</div>
                  <Switch checked={qa.is_active} onCheckedChange={() => update({ ...data, quickActions: toggleItem(data.quickActions, qa.id) })} />
                  <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8" onClick={() => { if(confirm("حذف الزر؟")) update({ ...data, quickActions: deleteItem(data.quickActions, qa.id) }); }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-xs text-muted-foreground mb-0.5 block">الاسم</label><Input value={qa.label} onChange={e => update({ ...data, quickActions: data.quickActions.map(q => q.id === qa.id ? { ...q, label: e.target.value } : q) })} className="h-8 text-sm" /></div>
                  <div><label className="text-xs text-muted-foreground mb-0.5 block">المسار</label><Input value={qa.path} dir="ltr" onChange={e => update({ ...data, quickActions: data.quickActions.map(q => q.id === qa.id ? { ...q, path: e.target.value } : q) })} className="h-8 text-sm" /></div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-0.5 block">الأيقونة</label>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {EMOJIS.map(e => <button key={e} onClick={() => update({ ...data, quickActions: data.quickActions.map(q => q.id === qa.id ? { ...q, icon: e } : q) })} className={`text-lg p-0.5 rounded ${qa.icon === e ? "bg-primary/20 ring-1 ring-primary" : "hover:bg-muted"}`}>{e}</button>)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-0.5 block">اللون</label>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_COLORS.map(c => <button key={c} onClick={() => update({ ...data, quickActions: data.quickActions.map(q => q.id === qa.id ? { ...q, color: c } : q) })} className={`w-10 h-6 rounded-full ${c} ${qa.color === c ? "ring-2 ring-offset-1 ring-primary" : ""}`} title={c} />)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button onClick={add} className="gap-2"><Plus className="w-4 h-4" />إضافة زر</Button>
      </div>
    );
  };

  const renderFeatures = () => {
    const add = () => {
      const n: MobileFeature = { id: genId(), icon: "⭐", title: "ميزة جديدة", desc: "وصف المميزة", is_active: true, order: data.features.length + 1 };
      update({ ...data, features: [...data.features, n] });
    };
    return (
      <div>
        <SectionHeader title="المميزات (لماذا ترافليون؟)" icon={Star} count={data.features.length} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {data.features.sort((a,b)=>a.order-b.order).map(feat => (
            <Card key={feat.id} draggable onDragStart={() => setDragId(feat.id)} onDragEnd={() => setDragId(null)} onDragOver={e => { e.preventDefault(); handleDrag(data.features, feat.id, f => update({ ...data, features: f })); }} className={!feat.is_active ? "opacity-50" : ""}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                  <span className="text-2xl">{feat.icon}</span>
                  <span className="flex-1 font-semibold text-sm">{feat.title}</span>
                  <Switch checked={feat.is_active} onCheckedChange={() => update({ ...data, features: toggleItem(data.features, feat.id) })} />
                  <Button variant="ghost" size="icon" className="text-red-500 h-7 w-7" onClick={() => { if(confirm("حذف؟")) update({ ...data, features: deleteItem(data.features, feat.id) }); }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <div className="flex gap-1 flex-wrap mb-1">
                  {EMOJIS.map(e => <button key={e} onClick={() => update({ ...data, features: data.features.map(f => f.id === feat.id ? { ...f, icon: e } : f) })} className={`text-base p-0.5 rounded ${feat.icon === e ? "bg-primary/20" : "hover:bg-muted"}`}>{e}</button>)}
                </div>
                <Input value={feat.title} onChange={e => update({ ...data, features: data.features.map(f => f.id === feat.id ? { ...f, title: e.target.value } : f) })} className="h-8 text-sm" placeholder="العنوان" />
                <Input value={feat.desc} onChange={e => update({ ...data, features: data.features.map(f => f.id === feat.id ? { ...f, desc: e.target.value } : f) })} className="h-8 text-sm" placeholder="الوصف" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Button onClick={add} className="gap-2"><Plus className="w-4 h-4" />إضافة ميزة</Button>
      </div>
    );
  };

  const renderAppBanner = () => (
    <div>
      <SectionHeader title="بانر التطبيق" icon={Smartphone} />
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Switch checked={data.appBanner.is_visible} onCheckedChange={v => update({ ...data, appBanner: { ...data.appBanner, is_visible: v } })} />
            <span className="text-sm font-medium">{data.appBanner.is_visible ? "مرئي" : "مخفي"}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium mb-1 block">العنوان</label><Input value={data.appBanner.title} onChange={e => update({ ...data, appBanner: { ...data.appBanner, title: e.target.value } })} /></div>
            <div><label className="text-sm font-medium mb-1 block">الوصف</label><Input value={data.appBanner.description} onChange={e => update({ ...data, appBanner: { ...data.appBanner, description: e.target.value } })} /></div>
            <div><label className="text-sm font-medium mb-1 block">نص زر App Store</label><Input value={data.appBanner.appStoreLabel} onChange={e => update({ ...data, appBanner: { ...data.appBanner, appStoreLabel: e.target.value } })} /></div>
            <div><label className="text-sm font-medium mb-1 block">رابط App Store</label><Input value={data.appBanner.appStoreLink} dir="ltr" onChange={e => update({ ...data, appBanner: { ...data.appBanner, appStoreLink: e.target.value } })} /></div>
            <div><label className="text-sm font-medium mb-1 block">نص زر Google Play</label><Input value={data.appBanner.playStoreLabel} onChange={e => update({ ...data, appBanner: { ...data.appBanner, playStoreLabel: e.target.value } })} /></div>
            <div><label className="text-sm font-medium mb-1 block">رابط Google Play</label><Input value={data.appBanner.playStoreLink} dir="ltr" onChange={e => update({ ...data, appBanner: { ...data.appBanner, playStoreLink: e.target.value } })} /></div>
          </div>
          {/* معاينة */}
          <div className="bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 rounded-2xl p-4 text-white">
            <h3 className="font-bold text-lg">{data.appBanner.title}</h3>
            <p className="text-white/80 text-sm mt-1">{data.appBanner.description}</p>
            <div className="flex gap-3 mt-3">
              <span className="flex-1 text-center py-2 bg-white text-gray-900 rounded-xl text-sm font-medium">{data.appBanner.appStoreLabel}</span>
              <span className="flex-1 text-center py-2 bg-white text-gray-900 rounded-xl text-sm font-medium">{data.appBanner.playStoreLabel}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBottomNav = () => {
    const add = () => {
      const n: MobileBottomNavItem = { id: genId(), icon: "🔗", label: "جديد", path: "/", is_active: true, order: data.bottomNav.length + 1 };
      update({ ...data, bottomNav: [...data.bottomNav, n] });
    };
    return (
      <div>
        <SectionHeader title="القائمة السفلية" icon={Navigation} count={data.bottomNav.length} />
        <div className="space-y-2 mb-4">
          {data.bottomNav.sort((a,b)=>a.order-b.order).map(item => (
            <Card key={item.id} draggable onDragStart={() => setDragId(item.id)} onDragEnd={() => setDragId(null)} onDragOver={e => { e.preventDefault(); handleDrag(data.bottomNav, item.id, nb => update({ ...data, bottomNav: nb })); }} className={!item.is_active ? "opacity-50" : ""}>
              <CardContent className="p-3 flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab flex-shrink-0" />
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-0.5">الأيقونة</label>
                    <Input value={item.icon} onChange={e => update({ ...data, bottomNav: data.bottomNav.map(n => n.id === item.id ? { ...n, icon: e.target.value } : n) })} className="h-7 text-sm text-center" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-0.5">الاسم</label>
                    <Input value={item.label} onChange={e => update({ ...data, bottomNav: data.bottomNav.map(n => n.id === item.id ? { ...n, label: e.target.value } : n) })} className="h-7 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-0.5">المسار</label>
                    <Input value={item.path} dir="ltr" onChange={e => update({ ...data, bottomNav: data.bottomNav.map(n => n.id === item.id ? { ...n, path: e.target.value } : n) })} className="h-7 text-sm" />
                  </div>
                </div>
                <Switch checked={item.is_active} onCheckedChange={() => update({ ...data, bottomNav: toggleItem(data.bottomNav, item.id) })} />
                <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8" onClick={() => { if(confirm("حذف؟")) update({ ...data, bottomNav: deleteItem(data.bottomNav, item.id) }); }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button onClick={add} className="gap-2"><Plus className="w-4 h-4" />إضافة عنصر</Button>
        {/* معاينة القائمة السفلية */}
        <div className="mt-6 bg-white rounded-2xl border p-3 shadow-sm">
          <p className="text-xs text-muted-foreground mb-2 text-center">معاينة القائمة السفلية</p>
          <div className="flex justify-around">
            {data.bottomNav.filter(n => n.is_active).sort((a,b)=>a.order-b.order).map(item => (
              <div key={item.id} className="flex flex-col items-center gap-1 text-xs text-gray-600 p-2">
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case "hero": return renderHero();
      case "deals": return renderDeals();
      case "destinations": return renderDestinations();
      case "quickActions": return renderQuickActions();
      case "features": return renderFeatures();
      case "appBanner": return renderAppBanner();
      case "bottomNav": return renderBottomNav();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">إدارة الصفحة الرئيسية - الموبايل</h1>
            <p className="text-muted-foreground text-sm">تحكم كامل في محتوى نسخة الجوال</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetAll} className="gap-2">
            <RotateCcw className="w-4 h-4" />إعادة الضبط
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <a href="/m" target="_blank"><ExternalLink className="w-4 h-4" />معاينة</a>
          </Button>
          <Button onClick={saveAll} className="gap-2 bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4" />
            {hasChanges ? "حفظ التغييرات *" : "حفظ"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-muted rounded-xl">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === s.id ? "bg-white shadow text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            <s.icon className="w-4 h-4" />
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>{renderSection()}</div>

      {/* Save Bar */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-orange-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-fade-in-up">
          <span className="text-sm font-medium">لديك تغييرات غير محفوظة</span>
          <Button size="sm" variant="secondary" onClick={saveAll} className="bg-white text-orange-600 hover:bg-orange-50 h-7 px-3 text-xs font-bold">
            <Save className="w-3 h-3 ml-1" />حفظ الآن
          </Button>
        </div>
      )}
    </div>
  );
};

export default MobileHomepageAdmin;
