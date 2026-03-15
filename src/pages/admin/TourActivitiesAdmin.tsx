import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";

type Activity = {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  city_ar: string;
  city_en: string;
  country_ar: string;
  country_en: string;
  price_per_person: number;
  duration_hours: number;
  category: string;
  image_url?: string;
  is_active: boolean;
};

const emptyForm: Partial<Activity> = {
  name_ar: "", name_en: "", description_ar: "", city_ar: "", city_en: "",
  country_ar: "", country_en: "", price_per_person: 0, duration_hours: 1,
  category: "ثقافة", image_url: "", is_active: true,
};

const TourActivitiesAdmin = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Partial<Activity>>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["admin-tour-activities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tour_activities" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as Activity[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (formData: Partial<Activity>) => {
      if (editId) {
        const { error } = await (supabase.from("tour_activities" as any) as any).update(formData).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await (supabase.from("tour_activities" as any) as any).insert(formData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tour-activities"] });
      toast.success(editId ? "تم التحديث" : "تمت الإضافة");
      closeDialog();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from("tour_activities" as any) as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tour-activities"] });
      toast.success("تم الحذف");
    },
  });

  const openEdit = (a: Activity) => {
    setEditId(a.id);
    setForm(a);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const handleSave = () => {
    if (!form.name_ar || !form.city_ar || !form.country_ar) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }
    const { id, ...rest } = form as any;
    saveMutation.mutate(rest);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><MapPin className="w-6 h-6" /> الأنشطة السياحية</h1>
          <p className="text-muted-foreground">إدارة الأنشطة والجولات المتاحة في مصمم الرحلات</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setEditId(null); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 ml-2" /> إضافة نشاط
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>النشاط</TableHead>
                <TableHead>المدينة</TableHead>
                <TableHead>الدولة</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>السعر/شخص</TableHead>
                <TableHead>المدة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8">جاري التحميل...</TableCell></TableRow>
              ) : activities.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">لا توجد أنشطة</TableCell></TableRow>
              ) : (
                activities.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {a.image_url && <img src={a.image_url} alt="" className="w-10 h-10 rounded object-cover" />}
                        <div>
                          <p className="font-medium">{a.name_ar}</p>
                          <p className="text-xs text-muted-foreground">{a.name_en}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{a.city_ar}</TableCell>
                    <TableCell>{a.country_ar}</TableCell>
                    <TableCell>{a.category}</TableCell>
                    <TableCell>{a.price_per_person} ر.س</TableCell>
                    <TableCell>{a.duration_hours} ساعات</TableCell>
                    <TableCell>{a.is_active ? "✅" : "❌"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(a)}><Pencil className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { if (confirm("حذف هذا النشاط؟")) deleteMutation.mutate(a.id); }}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editId ? "تعديل النشاط" : "إضافة نشاط جديد"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>الاسم بالعربية *</Label>
              <Input value={form.name_ar || ""} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label>الاسم بالإنجليزية</Label>
              <Input value={form.name_en || ""} onChange={(e) => setForm({ ...form, name_en: e.target.value })} />
            </div>
            <div>
              <Label>المدينة (عربي) *</Label>
              <Input value={form.city_ar || ""} onChange={(e) => setForm({ ...form, city_ar: e.target.value })} />
            </div>
            <div>
              <Label>المدينة (إنجليزي)</Label>
              <Input value={form.city_en || ""} onChange={(e) => setForm({ ...form, city_en: e.target.value })} />
            </div>
            <div>
              <Label>الدولة (عربي) *</Label>
              <Input value={form.country_ar || ""} onChange={(e) => setForm({ ...form, country_ar: e.target.value })} />
            </div>
            <div>
              <Label>الدولة (إنجليزي)</Label>
              <Input value={form.country_en || ""} onChange={(e) => setForm({ ...form, country_en: e.target.value })} />
            </div>
            <div>
              <Label>السعر/شخص (ر.س)</Label>
              <Input type="number" value={form.price_per_person || 0} onChange={(e) => setForm({ ...form, price_per_person: +e.target.value })} />
            </div>
            <div>
              <Label>المدة (ساعات)</Label>
              <Input type="number" value={form.duration_hours || 1} onChange={(e) => setForm({ ...form, duration_hours: +e.target.value })} />
            </div>
            <div>
              <Label>الفئة</Label>
              <Select value={form.category || "ثقافة"} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ثقافة">ثقافة</SelectItem>
                  <SelectItem value="مغامرة">مغامرة</SelectItem>
                  <SelectItem value="ترفيه">ترفيه</SelectItem>
                  <SelectItem value="طبيعة">طبيعة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label>نشط</Label>
              <Switch checked={form.is_active !== false} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
            </div>
            <div className="col-span-2">
              <Label>رابط الصورة</Label>
              <Input value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label>الوصف</Label>
              <Textarea value={form.description_ar || ""} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>إلغاء</Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "جاري الحفظ..." : editId ? "تحديث" : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TourActivitiesAdmin;
