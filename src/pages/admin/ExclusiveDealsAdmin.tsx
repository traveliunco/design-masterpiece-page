import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, GripVertical, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Deal {
  id: string;
  title: string;
  description: string | null;
  discount: string;
  code: string | null;
  gradient: string | null;
  icon: string | null;
  link: string | null;
  expiry: string | null;
  is_active: boolean | null;
  display_order: number | null;
}

const GRADIENT_OPTIONS = [
  { value: "from-primary to-blue-600", label: "أزرق" },
  { value: "from-emerald-600 to-teal-500", label: "أخضر زمردي" },
  { value: "from-rose-500 to-pink-600", label: "وردي" },
  { value: "from-amber-500 to-orange-500", label: "برتقالي" },
  { value: "from-purple-600 to-indigo-500", label: "بنفسجي" },
  { value: "from-cyan-500 to-blue-500", label: "سماوي" },
];

const ICON_OPTIONS = [
  { value: "Sparkles", label: "✨ نجوم" },
  { value: "Percent", label: "% خصم" },
  { value: "Clock", label: "⏰ ساعة" },
  { value: "Gift", label: "🎁 هدية" },
  { value: "Plane", label: "✈️ طائرة" },
  { value: "Heart", label: "❤️ قلب" },
];

const EMPTY_FORM: Omit<Deal, "id"> = {
  title: "",
  description: "",
  discount: "",
  code: "",
  gradient: "from-primary to-blue-600",
  icon: "Sparkles",
  link: "/offers",
  expiry: "عرض محدود",
  is_active: true,
  display_order: 0,
};

const ExclusiveDealsAdmin = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [form, setForm] = useState<Omit<Deal, "id">>(EMPTY_FORM);

  const fetchDeals = async () => {
    const { data, error } = await supabase
      .from("exclusive_deals")
      .select("*")
      .order("display_order");
    if (error) {
      toast.error("خطأ في تحميل العروض");
      return;
    }
    setDeals(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchDeals(); }, []);

  const openNew = () => {
    setEditingDeal(null);
    setForm({ ...EMPTY_FORM, display_order: deals.length + 1 });
    setDialogOpen(true);
  };

  const openEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setForm({
      title: deal.title,
      description: deal.description,
      discount: deal.discount,
      code: deal.code,
      gradient: deal.gradient,
      icon: deal.icon,
      link: deal.link,
      expiry: deal.expiry,
      is_active: deal.is_active,
      display_order: deal.display_order,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.discount) {
      toast.error("العنوان والخصم مطلوبان");
      return;
    }

    if (editingDeal) {
      const { error } = await supabase
        .from("exclusive_deals")
        .update(form)
        .eq("id", editingDeal.id);
      if (error) { toast.error("خطأ في التحديث"); return; }
      toast.success("تم التحديث بنجاح");
    } else {
      const { error } = await supabase
        .from("exclusive_deals")
        .insert([form]);
      if (error) { toast.error("خطأ في الإضافة"); return; }
      toast.success("تمت الإضافة بنجاح");
    }

    setDialogOpen(false);
    fetchDeals();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    const { error } = await supabase.from("exclusive_deals").delete().eq("id", id);
    if (error) { toast.error("خطأ في الحذف"); return; }
    toast.success("تم الحذف");
    fetchDeals();
  };

  const toggleActive = async (deal: Deal) => {
    const { error } = await supabase
      .from("exclusive_deals")
      .update({ is_active: !deal.is_active })
      .eq("id", deal.id);
    if (error) { toast.error("خطأ"); return; }
    fetchDeals();
  };

  if (loading) return <div className="flex items-center justify-center p-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">العروض الحصرية</h1>
            <p className="text-sm text-muted-foreground">إدارة عروض المستخدمين الجدد على الصفحة الرئيسية</p>
          </div>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" />
          إضافة عرض
        </Button>
      </div>

      {/* Deals list */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-right p-3 font-medium text-muted-foreground">الترتيب</th>
              <th className="text-right p-3 font-medium text-muted-foreground">المعاينة</th>
              <th className="text-right p-3 font-medium text-muted-foreground">العنوان</th>
              <th className="text-right p-3 font-medium text-muted-foreground">الخصم</th>
              <th className="text-right p-3 font-medium text-muted-foreground">الكود</th>
              <th className="text-right p-3 font-medium text-muted-foreground">الرابط</th>
              <th className="text-right p-3 font-medium text-muted-foreground">الحالة</th>
              <th className="text-right p-3 font-medium text-muted-foreground">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <GripVertical className="w-4 h-4" />
                    {deal.display_order}
                  </div>
                </td>
                <td className="p-3">
                  <div className={`w-16 h-10 rounded-lg bg-gradient-to-br ${deal.gradient}`} />
                </td>
                <td className="p-3 font-medium text-foreground max-w-[200px] truncate">{deal.title}</td>
                <td className="p-3 font-bold text-primary">{deal.discount}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{deal.code || "—"}</td>
                <td className="p-3 text-xs text-muted-foreground">{deal.link}</td>
                <td className="p-3">
                  <Switch checked={!!deal.is_active} onCheckedChange={() => toggleActive(deal)} />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(deal)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(deal.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {deals.length === 0 && (
              <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">لا توجد عروض حصرية بعد</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDeal ? "تعديل العرض" : "إضافة عرض جديد"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>العنوان *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="مثال: خصم 25% على أول حجز" />
            </div>
            <div>
              <Label>الوصف</Label>
              <Textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="وصف مختصر للعرض" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>الخصم *</Label>
                <Input value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder="25% أو 500 ر.س" />
              </div>
              <div>
                <Label>كود الخصم</Label>
                <Input value={form.code || ""} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="WELCOME25" className="font-mono" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>اللون التدرجي</Label>
                <Select value={form.gradient || ""} onValueChange={(v) => setForm({ ...form, gradient: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {GRADIENT_OPTIONS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded bg-gradient-to-r ${g.value}`} />
                          {g.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>الأيقونة</Label>
                <Select value={form.icon || "Sparkles"} onValueChange={(v) => setForm({ ...form, icon: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((i) => (
                      <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>رابط الصفحة</Label>
                <Input value={form.link || ""} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/hotels" />
              </div>
              <div>
                <Label>نص الانتهاء</Label>
                <Input value={form.expiry || ""} onChange={(e) => setForm({ ...form, expiry: e.target.value })} placeholder="عرض محدود" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>الترتيب</Label>
                <Input type="number" value={form.display_order || 0} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={!!form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                <Label>مفعّل</Label>
              </div>
            </div>

            {/* Preview */}
            <div>
              <Label className="mb-2 block">معاينة</Label>
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${form.gradient} p-5 h-[140px] flex flex-col justify-between`}>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/20" />
                </div>
                <div className="relative">
                  <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-2.5 py-1 text-xs text-white font-medium mb-1">{form.expiry}</div>
                  <h3 className="text-white font-bold text-sm">{form.title || "عنوان العرض"}</h3>
                </div>
                <div className="relative flex items-end justify-between">
                  <p className="text-white/80 text-xs max-w-[60%]">{form.description}</p>
                  <div className="text-center">
                    <span className="text-white font-extrabold text-xl">{form.discount || "—"}</span>
                    {form.code && <span className="block bg-white/25 rounded px-1.5 py-0.5 text-[10px] text-white font-mono mt-1">{form.code}</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} className="flex-1">{editingDeal ? "حفظ التغييرات" : "إضافة العرض"}</Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExclusiveDealsAdmin;
