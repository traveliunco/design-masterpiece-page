import { useState, useEffect } from "react";
import {
  Plus, Edit, Trash2, GripVertical, ExternalLink,
  Eye, EyeOff, RotateCcw, Save, ChevronDown, Menu
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { navService, defaultNavLinks, type NavLink } from "@/services/adminDataService";

// ─── قائمة الـ Dropdowns الثابتة ───
const DROPDOWN_OPTIONS = [
  { value: "", label: "لا يوجد (رابط عادي)" },
  { value: "countries", label: "🌍 قائمة الدول والمدن" },
  { value: "more", label: "📋 قائمة المزيد" },
];

const ICON_SUGGESTIONS = [
  "🏠","🌍","💑","🏷️","✈️","⚙️","📋","🌐","🗺️","🏖️",
  "🎯","📞","🔍","👤","💎","🎁","📝","ℹ️","🏨","🚗",
];

// ─── Component ───
const AdminNavMenu = () => {
  const [links, setLinks] = useState<NavLink[]>([]);
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<NavLink>>({});

  // نموذج إضافة رابط جديد
  const [newForm, setNewForm] = useState({
    name: "",
    path: "",
    icon: "🔗",
    hasDropdown: false,
    dropdownKey: "",
    openInNew: false,
  });

  useEffect(() => {
    setLinks(navService.getNavLinks());
  }, []);

  const save = (updated: NavLink[]) => {
    const sorted = [...updated].sort((a, b) => a.order - b.order);
    setLinks(sorted);
    navService.saveNavLinks(sorted);
  };

  // ─── إضافة رابط ───
  const addLink = () => {
    if (!newForm.name) { toast.error("أدخل اسم الرابط"); return; }
    if (!newForm.path && !newForm.hasDropdown) { toast.error("أدخل المسار"); return; }
    const newLink: NavLink = {
      id: Date.now().toString(),
      name: newForm.name,
      path: newForm.hasDropdown ? "#" : newForm.path,
      icon: newForm.icon,
      is_active: true,
      order: links.length + 1,
      hasDropdown: newForm.hasDropdown,
      dropdownKey: newForm.hasDropdown ? newForm.dropdownKey : undefined,
      openInNew: newForm.openInNew,
    };
    save([...links, newLink]);
    setNewForm({ name: "", path: "", icon: "🔗", hasDropdown: false, dropdownKey: "", openInNew: false });
    toast.success("تم إضافة الرابط");
  };

  // ─── تعديل ───
  const startEdit = (link: NavLink) => {
    setEditingId(link.id);
    setEditForm({ ...link });
  };

  const saveEdit = () => {
    if (!editForm.name) { toast.error("أدخل الاسم"); return; }
    save(links.map(l => l.id === editingId ? { ...l, ...editForm } : l));
    setEditingId(null);
    toast.success("تم التحديث");
  };

  // ─── حذف ───
  const deleteLink = (id: string) => {
    if (!confirm("حذف هذا الرابط؟")) return;
    save(links.filter(l => l.id !== id).map((l, i) => ({ ...l, order: i + 1 })));
    toast.success("تم الحذف");
  };

  // ─── تبديل التفعيل ───
  const toggleActive = (id: string) => {
    save(links.map(l => l.id === id ? { ...l, is_active: !l.is_active } : l));
  };

  // ─── Drag & Drop ───
  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!dragItem || dragItem === targetId) return;
    const arr = [...links];
    const from = arr.findIndex(l => l.id === dragItem);
    const to = arr.findIndex(l => l.id === targetId);
    if (from === -1 || to === -1) return;
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    arr.forEach((l, i) => l.order = i + 1);
    save(arr);
  };

  // ─── إعادة الافتراضي ───
  const resetDefault = () => {
    if (!confirm("إعادة القائمة للإعدادات الافتراضية؟")) return;
    navService.resetToDefault();
    setLinks(defaultNavLinks);
    toast.success("تم إعادة الضبط");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Menu className="w-7 h-7 text-primary" />
            إدارة القائمة العلوية
          </h1>
          <p className="text-muted-foreground mt-1">
            {links.filter(l => l.is_active).length} رابط مفعّل • {links.length} إجمالي
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetDefault} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            إعادة الضبط
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              معاينة الموقع
            </a>
          </Button>
        </div>
      </div>

      {/* نموذج الإضافة */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            إضافة رابط جديد
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* الاسم */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">الاسم</label>
              <Input
                value={newForm.name}
                onChange={e => setNewForm({ ...newForm, name: e.target.value })}
                placeholder="مثال: المدونة"
              />
            </div>
            {/* المسار */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">المسار</label>
              <Input
                value={newForm.path}
                onChange={e => setNewForm({ ...newForm, path: e.target.value })}
                placeholder="/blog"
                dir="ltr"
                disabled={newForm.hasDropdown}
              />
            </div>
            {/* الأيقونة */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">الأيقونة (emoji)</label>
              <div className="space-y-2">
                <Input
                  value={newForm.icon}
                  onChange={e => setNewForm({ ...newForm, icon: e.target.value })}
                  placeholder="🔗"
                  className="text-center text-lg w-full"
                />
                <div className="flex flex-wrap gap-1">
                  {ICON_SUGGESTIONS.map(ic => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewForm({ ...newForm, icon: ic })}
                      className={`text-lg p-1 rounded hover:bg-muted transition-colors ${newForm.icon === ic ? "bg-primary/10 ring-2 ring-primary" : ""}`}
                      title={ic}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* خيارات */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">نوع القائمة المنسدلة</label>
                <select
                  value={newForm.dropdownKey}
                  onChange={e => setNewForm({ ...newForm, hasDropdown: !!e.target.value, dropdownKey: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
                >
                  {DROPDOWN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={newForm.openInNew}
                  onChange={e => setNewForm({ ...newForm, openInNew: e.target.checked })}
                  className="rounded"
                />
                فتح في تبويب جديد
              </label>
              <Button onClick={addLink} className="w-full gap-2">
                <Plus className="w-4 h-4" />
                إضافة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* قائمة الروابط */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">روابط القائمة</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {links.sort((a, b) => a.order - b.order).map((link) => (
              <div
                key={link.id}
                draggable
                onDragStart={() => setDragItem(link.id)}
                onDragEnd={() => setDragItem(null)}
                onDragOver={e => handleDragOver(e, link.id)}
                className={`flex items-center gap-3 p-4 hover:bg-muted/30 cursor-grab transition-colors ${!link.is_active ? "opacity-50" : ""}`}
              >
                {/* Handle */}
                <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />

                {/* الترتيب */}
                <span className="w-6 h-6 rounded-full bg-muted text-xs font-bold flex items-center justify-center text-muted-foreground flex-shrink-0">
                  {link.order}
                </span>

                {editingId === link.id ? (
                  // ─── وضع التعديل ───
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                    <Input
                      value={editForm.name || ""}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="الاسم"
                      className="h-8 text-sm"
                    />
                    <Input
                      value={editForm.path || ""}
                      onChange={e => setEditForm({ ...editForm, path: e.target.value })}
                      placeholder="/path"
                      dir="ltr"
                      className="h-8 text-sm"
                      disabled={!!editForm.hasDropdown}
                    />
                    <Input
                      value={editForm.icon || ""}
                      onChange={e => setEditForm({ ...editForm, icon: e.target.value })}
                      placeholder="🔗"
                      className="h-8 text-sm text-center"
                    />
                    <select
                      value={editForm.dropdownKey || ""}
                      onChange={e => setEditForm({ ...editForm, hasDropdown: !!e.target.value, dropdownKey: e.target.value || undefined })}
                      className="border rounded-lg px-2 py-1.5 text-xs bg-background h-8"
                    >
                      {DROPDOWN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                ) : (
                  // ─── وضع العرض ───
                  <div className="flex-1 flex items-center gap-3 min-w-0">
                    <span className="text-xl flex-shrink-0">{link.icon || "🔗"}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">{link.name}</p>
                      <p className="text-xs text-muted-foreground font-mono" dir="ltr">
                        {link.path}
                        {link.hasDropdown && (
                          <span className="ms-1 text-primary not-italic">
                            <ChevronDown className="w-3 h-3 inline" /> {link.dropdownKey}
                          </span>
                        )}
                        {link.openInNew && <ExternalLink className="w-3 h-3 inline ms-1 text-muted-foreground" />}
                      </p>
                    </div>
                  </div>
                )}

                {/* أزرار التحكم */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Switch
                    checked={link.is_active}
                    onCheckedChange={() => toggleActive(link.id)}
                    title={link.is_active ? "إخفاء" : "إظهار"}
                  />
                  {editingId === link.id ? (
                    <>
                      <Button variant="ghost" size="icon" onClick={saveEdit} className="text-green-600 hover:text-green-700 h-8 w-8">
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setEditingId(null)} className="h-8 w-8">
                        <EyeOff className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" size="icon" onClick={() => startEdit(link)} className="h-8 w-8">
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 h-8 w-8"
                    onClick={() => deleteLink(link.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {links.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              لا توجد روابط بعد. أضف الأول من النموذج أعلاه.
            </div>
          )}
        </CardContent>
      </Card>

      {/* ملاحظة */}
      <div className="bg-muted/50 rounded-xl p-4 text-center text-sm text-muted-foreground">
        💡 التغييرات تظهر فوراً في القائمة العلوية عند تحديث الصفحة الرئيسية
      </div>
    </div>
  );
};

export default AdminNavMenu;
