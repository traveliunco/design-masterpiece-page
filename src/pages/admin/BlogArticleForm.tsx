import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Save, Loader2, Plus, X, FileText, Upload, Star, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { type BlogArticle, getBlogArticles, saveBlogArticles } from "./BlogAdmin";
import { blogService } from "@/services/adminDataService";

const categoryOptions = ["دليل السفر", "نصائح السفر", "شهر العسل", "ثقافة وتراث", "عروض وتخفيضات", "أخبار السفر"];

const BlogArticleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState<Omit<BlogArticle, "order">>({
    id: "", title: "", slug: "", excerpt: "", content: "",
    cover_image: "", author_name: "فريق ترافليون", category: "دليل السفر",
    tags: [], reading_time: 5, is_featured: false, is_active: true,
    published_at: new Date().toISOString().split("T")[0], views: 0,
  });

  useEffect(() => {
    if (isEditing) {
      const articles = getBlogArticles();
      const article = articles.find(a => a.id === id);
      if (article) { setForm(article); setImagePreview(article.cover_image); }
      else { toast.error("المقالة غير موجودة"); navigate("/admin/blog"); }
    }
  }, [id, isEditing, navigate]);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[\s]+/g, "-").replace(/[^\u0600-\u06FFa-z0-9-]/g, "").slice(0, 80);
  };

  const handleTitleChange = (title: string) => {
    setForm(p => ({ ...p, title, slug: isEditing ? p.slug : generateSlug(title) }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("الحجم يجب أقل من 5MB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => { const b64 = reader.result as string; setImagePreview(b64); setForm(p => ({ ...p, cover_image: b64 })); };
    reader.readAsDataURL(file);
  };

  const addTag = () => {
    if (!newTag.trim() || form.tags.includes(newTag.trim())) return;
    setForm(p => ({ ...p, tags: [...p.tags, newTag.trim()] }));
    setNewTag("");
  };

  const removeTag = (tag: string) => setForm(p => ({ ...p, tags: p.tags.filter(t => t !== tag) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) { toast.error("أدخل عنوان المقالة"); return; }
    setSaving(true);
    try {
      const articles = getBlogArticles();
      if (isEditing) {
        const idx = articles.findIndex(a => a.id === id);
        if (idx !== -1) articles[idx] = { ...form, order: articles[idx].order };
        saveBlogArticles(articles);
        blogService.upsertArticle({ ...form }).catch(() => {});
        toast.success("تم تحديث المقالة");
      } else {
        const newArticle = { ...form, id: Date.now().toString(), order: articles.length + 1 };
        articles.push(newArticle);
        saveBlogArticles(articles);
        blogService.upsertArticle(newArticle).catch(() => {});
        toast.success("تم إضافة المقالة");
      }
      navigate("/admin/blog");
    } catch { toast.error("حدث خطأ"); } finally { setSaving(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/admin/blog")} aria-label="رجوع"><ArrowRight className="w-5 h-5" /></Button>
        <h1 className="text-2xl font-bold flex items-center gap-2"><FileText className="w-7 h-7 text-primary" />{isEditing ? "تعديل المقالة" : "مقالة جديدة"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover Image */}
        <Card>
          <CardHeader><CardTitle className="text-lg">صورة الغلاف</CardTitle></CardHeader>
          <CardContent>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            {imagePreview ? (
              <div className="relative group">
                <img src={imagePreview} alt="" className="w-full h-56 object-cover rounded-xl" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                  <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}><Upload className="w-4 h-4 ml-1" />تغيير</Button>
                  <Button type="button" variant="destructive" size="sm" onClick={() => { setImagePreview(""); setForm(p => ({ ...p, cover_image: "" })); }}><X className="w-4 h-4 ml-1" />حذف</Button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                <Upload className="w-10 h-10 mb-2" /><p className="font-medium">اضغط لرفع صورة</p><p className="text-xs">PNG, JPG حتى 5MB</p>
              </button>
            )}
            <div className="mt-3">
              <label className="text-sm font-medium mb-1 block">أو رابط الصورة</label>
              <Input value={form.cover_image.startsWith("data:") ? "" : form.cover_image} onChange={e => { setForm(p => ({ ...p, cover_image: e.target.value })); setImagePreview(e.target.value); }} placeholder="https://..." dir="ltr" className="text-left" />
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader><CardTitle className="text-lg">المعلومات الأساسية</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">العنوان *</label>
              <Input value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="عنوان المقالة" required />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">الرابط (Slug)</label>
              <Input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="article-slug" dir="ltr" className="text-left font-mono text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">المقتطف</label>
              <textarea value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} placeholder="ملخص قصير للمقالة..." className="w-full min-h-[80px] p-3 rounded-lg border bg-background text-sm resize-none" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">المحتوى</label>
              <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="محتوى المقالة الكامل (يدعم HTML)..." className="w-full min-h-[200px] p-3 rounded-lg border bg-background text-sm resize-y" />
            </div>
          </CardContent>
        </Card>

        {/* Category & Author */}
        <Card>
          <CardHeader><CardTitle className="text-lg">التصنيف والكاتب</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">التصنيف</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm bg-background" title="التصنيف">
                  {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">الكاتب</label>
                <Input value={form.author_name} onChange={e => setForm(p => ({ ...p, author_name: e.target.value }))} placeholder="اسم الكاتب" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">وقت القراءة (دقائق)</label>
                <Input type="number" min="1" value={form.reading_time} onChange={e => setForm(p => ({ ...p, reading_time: parseInt(e.target.value) || 1 }))} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">تاريخ النشر</label>
                <Input type="date" value={form.published_at} onChange={e => setForm(p => ({ ...p, published_at: e.target.value }))} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader><CardTitle className="text-lg">الوسوم</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="أضف وسم..." onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} />
              <Button type="button" variant="outline" onClick={addTag}><Plus className="w-4 h-4" /></Button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.tags.map(tag => (
                  <span key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-red-500 hover:text-red-700"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div><h3 className="font-bold">نشر المقالة</h3><p className="text-sm text-muted-foreground">إظهار المقالة في الموقع</p></div>
              <Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} />
            </div>
            <div className="flex items-center justify-between">
              <div><h3 className="font-bold">مقالة مميزة</h3><p className="text-sm text-muted-foreground">عرضها في قسم المميزات</p></div>
              <Switch checked={form.is_featured} onCheckedChange={v => setForm(p => ({ ...p, is_featured: v }))} />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/blog")}>إلغاء</Button>
          <Button type="submit" disabled={saving} className="min-w-[150px]">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 ml-2" />{isEditing ? "حفظ التعديلات" : "نشر المقالة"}</>}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogArticleForm;
