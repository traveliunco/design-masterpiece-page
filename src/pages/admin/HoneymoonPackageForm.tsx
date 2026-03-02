import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Save, Loader2, Plus, X, Heart, ImageIcon, Upload, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { type HoneymoonPackage, getHoneymoonData, saveHoneymoonData } from "./HoneymoonAdmin";

const emojiOptions = ["🏝️", "🌺", "🌊", "🦅", "💑", "🌴", "🏖️", "🌅", "💎", "🌸", "🦋", "🐚", "⛱️", "🚢", "🗺️", "🎭"];

const HoneymoonPackageForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [form, setForm] = useState<Omit<HoneymoonPackage, "order">>({
    id: "",
    destination: "",
    title: "",
    emoji: "🏝️",
    description: "",
    image: "",
    duration: "",
    price: "",
    oldPrice: "",
    features: [],
    rating: 4.5,
    reviews: 0,
    badge: "",
    is_active: true,
  });

  useEffect(() => {
    if (isEditing) {
      const data = getHoneymoonData();
      const pkg = data.packages.find(p => p.id === id);
      if (pkg) {
        setForm(pkg);
        setImagePreview(pkg.image);
      } else {
        toast.error("الباقة غير موجودة");
        navigate("/admin/honeymoon");
      }
    }
  }, [id, isEditing, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setForm(prev => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview("");
    setForm(prev => ({ ...prev, image: "" }));
  };

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
    if (!form.title || !form.destination || !form.price) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setSaving(true);
    try {
      const data = getHoneymoonData();

      if (isEditing) {
        data.packages = data.packages.map(p =>
          p.id === id ? { ...form, order: p.order } : p
        );
        toast.success("تم تحديث الباقة بنجاح");
      } else {
        const newPkg: HoneymoonPackage = {
          ...form,
          id: Date.now().toString(),
          order: data.packages.length + 1,
        };
        data.packages.push(newPkg);
        toast.success("تم إضافة الباقة بنجاح");
      }

      saveHoneymoonData(data);
      navigate("/admin/honeymoon");
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
        <Button variant="ghost" onClick={() => navigate("/admin/honeymoon")} aria-label="رجوع">
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-500" />
            {isEditing ? "تعديل باقة شهر العسل" : "إضافة باقة جديدة"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Preview */}
        <Card>
          <CardHeader><CardTitle className="text-lg">معاينة</CardTitle></CardHeader>
          <CardContent>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border max-w-[350px] mx-auto">
              <div className="relative h-48 bg-gray-100">
                {imagePreview ? (
                  <img src={imagePreview} alt={form.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="w-12 h-12 opacity-30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {form.badge && (
                  <div className="absolute top-3 right-3 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold">{form.badge}</div>
                )}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <span className="text-3xl">{form.emoji}</span>
                  <div>
                    <p className="text-white font-bold">{form.title || "اسم الباقة"}</p>
                    <p className="text-white/70 text-xs">{form.destination || "الوجهة"}</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-3">{form.description || "وصف الباقة..."}</p>
                <div className="flex items-center justify-between">
                  <div>
                    {form.oldPrice && <p className="text-xs text-muted-foreground line-through">{form.oldPrice} ر.س</p>}
                    <p className="text-xl font-bold text-rose-500">{form.price || "0"} ر.س</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-sm">{form.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card>
          <CardHeader><CardTitle className="text-lg">الصورة</CardTitle></CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative group">
                <img src={imagePreview} alt="preview" className="w-full h-48 object-cover rounded-xl" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                  <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 ml-1" />تغيير
                  </Button>
                  <Button type="button" variant="destructive" size="sm" onClick={removeImage}>
                    <X className="w-4 h-4 ml-1" />حذف
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Upload className="w-10 h-10 mb-2" />
                <p className="font-medium">اضغط لرفع صورة</p>
                <p className="text-xs">PNG, JPG حتى 5MB</p>
              </button>
            )}
            <div className="mt-3">
              <label className="text-sm font-medium mb-1 block">أو رابط الصورة</label>
              <Input
                value={form.image.startsWith("data:") ? "" : form.image}
                onChange={e => { setForm(prev => ({ ...prev, image: e.target.value })); setImagePreview(e.target.value); }}
                placeholder="https://example.com/image.jpg"
                dir="ltr"
                className="text-left"
              />
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader><CardTitle className="text-lg">المعلومات الأساسية</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">اسم الباقة *</label>
                <Input value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="جنة العشاق" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">الوجهة *</label>
                <Input value={form.destination} onChange={e => setForm(prev => ({ ...prev, destination: e.target.value }))} placeholder="المالديف" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">الوصف</label>
              <textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="وصف تفصيلي للباقة..." className="w-full min-h-[100px] p-3 rounded-lg border bg-background text-sm resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">المدة</label>
                <Input value={form.duration} onChange={e => setForm(prev => ({ ...prev, duration: e.target.value }))} placeholder="5 أيام / 4 ليالي" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">الشارة (Badge)</label>
                <Input value={form.badge} onChange={e => setForm(prev => ({ ...prev, badge: e.target.value }))} placeholder="الأكثر طلباً" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader><CardTitle className="text-lg">التسعير</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">السعر الحالي (ر.س) *</label>
                <Input value={form.price} onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))} placeholder="12,999" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">السعر القديم (ر.س)</label>
                <Input value={form.oldPrice} onChange={e => setForm(prev => ({ ...prev, oldPrice: e.target.value }))} placeholder="15,999" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating */}
        <Card>
          <CardHeader><CardTitle className="text-lg">التقييم</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">التقييم (من 5)</label>
                <Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">عدد الحجوزات</label>
                <Input type="number" min="0" value={form.reviews} onChange={e => setForm(prev => ({ ...prev, reviews: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emoji */}
        <Card>
          <CardHeader><CardTitle className="text-lg">الإيموجي</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {emojiOptions.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, emoji }))}
                  className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center transition-all ${
                    form.emoji === emoji ? "bg-rose-100 ring-2 ring-rose-500 scale-110" : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader><CardTitle className="text-lg">المميزات</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input value={newFeature} onChange={e => setNewFeature(e.target.value)} placeholder="أضف ميزة..." onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }} />
              <Button type="button" variant="outline" onClick={addFeature}><Plus className="w-4 h-4" /></Button>
            </div>
            {form.features.length > 0 ? (
              <div className="space-y-2">
                {form.features.map((f, i) => (
                  <div key={i} className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-2.5">
                    <span className="text-sm">{f}</span>
                    <button type="button" onClick={() => removeFeature(i)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
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
                <h3 className="font-bold">حالة الباقة</h3>
                <p className="text-sm text-muted-foreground">هل تريد إظهار الباقة في الموقع؟</p>
              </div>
              <Switch checked={form.is_active} onCheckedChange={v => setForm(prev => ({ ...prev, is_active: v }))} />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/honeymoon")}>إلغاء</Button>
          <Button type="submit" disabled={saving} className="min-w-[150px] bg-rose-500 hover:bg-rose-600">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 ml-2" />{isEditing ? "حفظ التعديلات" : "إضافة الباقة"}</>}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HoneymoonPackageForm;
