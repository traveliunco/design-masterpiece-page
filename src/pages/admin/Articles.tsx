import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author_name: string;
  category: string;
  tags: string[];
  status: string;
  reading_time: number;
  is_featured: boolean;
  published_at: string;
  views: number;
}

const AdminArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const emptyArticle: Partial<Article> = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    author_name: "فريق ترافليون",
    category: "دليل السفر",
    tags: [],
    status: "draft",
    reading_time: 5,
    is_featured: false,
  };

  const [formData, setFormData] = useState<Partial<Article>>(emptyArticle);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("خطأ في تحميل المقالات");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.content) {
        toast.error("الرجاء إكمال الحقول المطلوبة");
        return;
      }

      // Generate slug if not provided
      if (!formData.slug) {
        formData.slug = formData.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, "");
      }

      if (editingArticle) {
        // Update
        const { error } = await supabase
          .from("articles")
          .update(formData)
          .eq("id", editingArticle.id);

        if (error) throw error;
        toast.success("تم تحديث المقال بنجاح");
      } else {
        // Create
        const { error } = await supabase
          .from("articles")
          .insert([formData]);

        if (error) throw error;
        toast.success("تم إنشاء المقال بنجاح");
      }

      setEditingArticle(null);
      setIsCreating(false);
      setFormData(emptyArticle);
      fetchArticles();
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "حدث خطأ");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return;

    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("تم حذف المقال");
      fetchArticles();
    } catch (error) {
      toast.error("خطأ في الحذف");
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData(article);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingArticle(null);
    setIsCreating(false);
    setFormData(emptyArticle);
  };

  if (loading) {
    return <div className="p-8 text-center">جاري التحميل...</div>;
  }

  if (isCreating || editingArticle) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-luxury-navy">
            {editingArticle ? "تعديل المقال" : "مقال جديد"}
          </h1>
          <div className="flex gap-3">
            <Button onClick={handleCancel} variant="outline">
              <X className="w-4 h-4 ml-2" />
              إلغاء
            </Button>
            <Button onClick={handleSave} className="btn-luxury">
              <Save className="w-4 h-4 ml-2" />
              حفظ
            </Button>
          </div>
        </div>

        <div className="card-3d p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>العنوان *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="عنوان المقال"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="article-url-slug"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>المقدمة *</Label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              placeholder="مقدمة قصيرة عن المقال"
            />
          </div>

          <div className="space-y-2">
            <Label>المحتوى * (Markdown)</Label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={15}
              placeholder="محتوى المقال بصيغة Markdown..."
              className="font-mono"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>صورة الغلاف (URL)</Label>
              <Input
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>الكاتب</Label>
              <Input
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>التصنيف</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="دليل السفر">دليل السفر</SelectItem>
                  <SelectItem value="نصائح السفر">نصائح السفر</SelectItem>
                  <SelectItem value="شهر العسل">شهر العسل</SelectItem>
                  <SelectItem value="ثقافة وتراث">ثقافة وتراث</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>الكلمات المفتاحية (بفاصلة)</Label>
              <Input
                value={formData.tags?.join(", ")}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",").map(t => t.trim()) })}
                placeholder="سياحة, سفر, مغامرة"
              />
            </div>
            <div className="space-y-2">
              <Label>وقت القراءة (دقائق)</Label>
              <Input
                type="number"
                value={formData.reading_time}
                onChange={(e) => setFormData({ ...formData, reading_time: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">مسودة</SelectItem>
                  <SelectItem value="published">منشور</SelectItem>
                  <SelectItem value="archived">مؤرشف</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="featured" className="cursor-pointer">مقال مميز</Label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-luxury-navy">إدارة المقالات</h1>
        <Button onClick={() => setIsCreating(true)} className="btn-luxury">
          <Plus className="w-4 h-4 ml-2" />
          مقال جديد
        </Button>
      </div>

      <div className="card-3d overflow-hidden">
        <table className="w-full">
          <thead className="bg-luxury-cream">
            <tr>
              <th className="text-right p-4 font-bold text-luxury-navy">العنوان</th>
              <th className="text-right p-4 font-bold text-luxury-navy">التصنيف</th>
              <th className="text-right p-4 font-bold text-luxury-navy">الحالة</th>
              <th className="text-right p-4 font-bold text-luxury-navy">المشاهدات</th>
              <th className="text-right p-4 font-bold text-luxury-navy">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-t border-border hover:bg-luxury-cream/50">
                <td className="p-4">
                  <div className="font-semibold text-luxury-navy">{article.title}</div>
                  <div className="text-sm text-muted-foreground">{article.author_name}</div>
                </td>
                <td className="p-4">
                  <span className="text-sm bg-luxury-teal/10 text-luxury-teal px-2 py-1 rounded">
                    {article.category}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`text-sm px-2 py-1 rounded ${
                    article.status === "published" ? "bg-green-100 text-green-700" :
                    article.status === "draft" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {article.status === "published" ? "منشور" : article.status === "draft" ? "مسودة" : "مؤرشف"}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{article.views || 0}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => window.open(`/blog/${article.slug}`, "_blank")}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(article)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(article.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminArticles;
