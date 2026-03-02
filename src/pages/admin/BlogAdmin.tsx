import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, FileText, Plus, Edit, Trash2, Loader2, RefreshCw,
  Eye, EyeOff, GripVertical, Star, Calendar, Clock, User,
  Tag, TrendingUp, Upload, X, Image as ImageIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { blogService } from "@/services/adminDataService";

// ═══════════ TYPES ═══════════
export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author_name: string;
  category: string;
  tags: string[];
  reading_time: number;
  is_featured: boolean;
  is_active: boolean;
  published_at: string;
  views: number;
  order: number;
}

// ═══════════ DEFAULT DATA ═══════════
const defaultArticles: BlogArticle[] = [
  { id: "1", title: "أفضل 10 وجهات سياحية في ماليزيا", slug: "best-10-destinations-malaysia", excerpt: "اكتشف أجمل الأماكن السياحية في ماليزيا من الجزر الاستوائية إلى المدن الحديثة", content: "", cover_image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800", author_name: "فريق ترافليون", category: "دليل السفر", tags: ["ماليزيا", "سياحة", "جزر"], reading_time: 8, is_featured: true, is_active: true, published_at: "2026-01-10", views: 1250, order: 1 },
  { id: "2", title: "نصائح ذهبية لشهر العسل المثالي", slug: "honeymoon-tips", excerpt: "كل ما تحتاج معرفته لتخطيط شهر عسل لا يُنسى مع شريك حياتك", content: "", cover_image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800", author_name: "سارة أحمد", category: "شهر العسل", tags: ["شهر عسل", "رومانسي", "نصائح"], reading_time: 6, is_featured: true, is_active: true, published_at: "2026-01-08", views: 890, order: 2 },
  { id: "3", title: "استكشف جمال طرابزون التركية", slug: "trabzon-turkey-guide", excerpt: "رحلة في الشمال التركي الساحر - الطبيعة الخلابة والثقافة الغنية", content: "", cover_image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800", author_name: "محمد العلي", category: "دليل السفر", tags: ["تركيا", "طرابزون", "طبيعة"], reading_time: 10, is_featured: false, is_active: true, published_at: "2026-01-05", views: 650, order: 3 },
  { id: "4", title: "أفضل المطاعم الحلال في بانكوك", slug: "halal-restaurants-bangkok", excerpt: "دليلك الشامل لأفضل المطاعم الحلال في العاصمة التايلاندية", content: "", cover_image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800", author_name: "فريق ترافليون", category: "نصائح السفر", tags: ["تايلاند", "حلال", "مطاعم"], reading_time: 5, is_featured: false, is_active: true, published_at: "2026-01-03", views: 420, order: 4 },
  { id: "5", title: "تعرف على ثقافة جورجيا العريقة", slug: "georgia-culture-guide", excerpt: "اكتشف التاريخ والتقاليد الغنية لجورجيا في القوقاز", content: "", cover_image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800", author_name: "أحمد خالد", category: "ثقافة وتراث", tags: ["جورجيا", "ثقافة", "تاريخ"], reading_time: 7, is_featured: false, is_active: true, published_at: "2026-01-01", views: 380, order: 5 },
];

const STORAGE_KEY = "traveliun_blog";

export const getBlogArticles = (): BlogArticle[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultArticles));
    return defaultArticles;
  }
  return JSON.parse(stored);
};

export const saveBlogArticles = (articles: BlogArticle[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
};

const categoryOptions = ["دليل السفر", "نصائح السفر", "شهر العسل", "ثقافة وتراث", "عروض وتخفيضات", "أخبار السفر"];

// ═══════════ MAIN COMPONENT ═══════════
const AdminBlog = () => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [dragItem, setDragItem] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await blogService.getArticles();
        const mapped = (data as any[]).map((a, i) => ({ ...a, order: a.display_order || a.order || i + 1 }));
        setArticles(mapped.length > 0 ? mapped : getBlogArticles());
      } catch { setArticles(getBlogArticles()); }
      setLoading(false);
    };
    load();
  }, []);

  const save = (newArticles: BlogArticle[]) => {
    setArticles(newArticles);
    saveBlogArticles(newArticles);
  };

  const toggleFeatured = (id: string) => {
    const article = articles.find(a => a.id === id);
    save(articles.map(a => a.id === id ? { ...a, is_featured: !a.is_featured } : a));
    if (article) blogService.upsertArticle({ ...article, is_featured: !article.is_featured }).catch(() => {});
    toast.success("تم التحديث");
  };

  const toggleActive = (id: string) => {
    const article = articles.find(a => a.id === id);
    save(articles.map(a => a.id === id ? { ...a, is_active: !a.is_active } : a));
    if (article) blogService.upsertArticle({ ...article, is_active: !article.is_active }).catch(() => {});
    toast.success("تم تحديث الحالة");
  };

  const deleteArticle = (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه المقالة؟")) return;
    save(articles.filter(a => a.id !== id));
    blogService.deleteArticle(id).catch(() => {});
    toast.success("تم حذف المقالة");
  };

  // Drag & Drop
  const handleDragStart = (id: string) => setDragItem(id);
  const handleDragEnd = () => setDragItem(null);
  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!dragItem || dragItem === targetId) return;
    const arr = [...articles];
    const di = arr.findIndex(a => a.id === dragItem);
    const ti = arr.findIndex(a => a.id === targetId);
    if (di === -1 || ti === -1) return;
    const [moved] = arr.splice(di, 1);
    arr.splice(ti, 0, moved);
    arr.forEach((a, i) => a.order = i + 1);
    save(arr);
  };

  // Filter
  const filtered = articles
    .filter(a => !search || a.title.includes(search) || a.excerpt.includes(search) || a.author_name.includes(search))
    .filter(a => filterCategory === "all" || a.category === filterCategory)
    .sort((a, b) => a.order - b.order);

  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);

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
          <h1 className="text-2xl font-bold flex items-center gap-2"><FileText className="w-7 h-7 text-primary" />إدارة المدونة</h1>
          <p className="text-muted-foreground">{articles.length} مقالة • {articles.filter(a => a.is_featured).length} مميزة • {totalViews.toLocaleString()} مشاهدة</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setArticles(getBlogArticles()); toast.success("تم التحديث"); }}>
            <RefreshCw className="w-4 h-4 ml-2" />تحديث
          </Button>
          <Button onClick={() => navigate("/admin/blog/new")}>
            <Plus className="w-4 h-4 ml-2" />مقالة جديدة
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-primary">{articles.length}</p>
          <p className="text-sm text-muted-foreground">إجمالي المقالات</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{articles.filter(a => a.is_active).length}</p>
          <p className="text-sm text-muted-foreground">منشورة</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-amber-600">{articles.filter(a => a.is_featured).length}</p>
          <p className="text-sm text-muted-foreground">مميزة</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{new Set(articles.map(a => a.category)).size}</p>
          <p className="text-sm text-muted-foreground">تصنيفات</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{totalViews.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">مشاهدات</p>
        </CardContent></Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="البحث في المقالات..." className="pr-10" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="border rounded-lg px-4 py-2 text-sm bg-background min-w-[150px]" title="التصنيف">
          <option value="all">جميع التصنيفات</option>
          {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Articles Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="py-3 px-3 text-right text-sm font-medium text-muted-foreground w-10"></th>
                  <th className="py-3 px-3 text-right text-sm font-medium text-muted-foreground">الصورة</th>
                  <th className="py-3 px-3 text-right text-sm font-medium text-muted-foreground">المقالة</th>
                  <th className="py-3 px-3 text-right text-sm font-medium text-muted-foreground">التصنيف</th>
                  <th className="py-3 px-3 text-right text-sm font-medium text-muted-foreground">الكاتب</th>
                  <th className="py-3 px-3 text-right text-sm font-medium text-muted-foreground">مشاهدات</th>
                  <th className="py-3 px-3 text-right text-sm font-medium text-muted-foreground">مميزة</th>
                  <th className="py-3 px-3 text-right text-sm font-medium text-muted-foreground">الحالة</th>
                  <th className="py-3 px-3 text-right text-sm font-medium text-muted-foreground">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(article => (
                  <tr
                    key={article.id}
                    className="border-b last:border-0 hover:bg-muted/30 cursor-grab active:cursor-grabbing"
                    draggable
                    onDragStart={() => handleDragStart(article.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, article.id)}
                  >
                    <td className="py-3 px-3"><GripVertical className="w-4 h-4 text-muted-foreground" /></td>
                    <td className="py-3 px-3">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted">
                        {article.cover_image && <img src={article.cover_image} alt="" className="w-full h-full object-cover" />}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-sm line-clamp-1">{article.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{article.excerpt}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{article.reading_time} د</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{article.published_at}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{article.category}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-sm flex items-center gap-1"><User className="w-3 h-3" />{article.author_name}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-sm font-bold flex items-center gap-1"><Eye className="w-3 h-3" />{article.views.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-3">
                      <button onClick={() => toggleFeatured(article.id)} className={`p-1 rounded ${article.is_featured ? "text-amber-500" : "text-gray-300"}`} aria-label="تمييز">
                        <Star className={`w-5 h-5 ${article.is_featured ? "fill-amber-500" : ""}`} />
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <Switch checked={article.is_active} onCheckedChange={() => toggleActive(article.id)} />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/blog/edit/${article.id}`)} aria-label="تعديل">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteArticle(article.id)} aria-label="حذف">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-bold">لا توجد مقالات</h3>
              <p className="text-muted-foreground">أضف مقالة جديدة للبدء</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlog;
