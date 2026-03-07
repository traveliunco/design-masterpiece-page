import { Link } from "react-router-dom";
import { User, Clock, TrendingUp, Loader2 } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { useSEO } from "@/hooks/useSEO";
import { useState, useEffect } from "react";
import { blogService } from "@/services/adminDataService";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  author_name: string;
  category: string;
  tags: string[];
  reading_time: number;
  is_featured: boolean;
  published_at: string;
  views: number;
}

const fallbackArticles: Article[] = [
  {
    id: "1",
    title: "أفضل 10 وجهات سياحية في ماليزيا",
    slug: "best-10-destinations-malaysia",
    excerpt: "اكتشف أجمل الأماكن السياحية في ماليزيا من الجزر الاستوائية إلى المدن الحديثة",
    cover_image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800",
    author_name: "فريق ترافليون",
    category: "دليل السفر",
    tags: ["ماليزيا", "سياحة", "جزر"],
    reading_time: 8,
    is_featured: true,
    published_at: "2026-01-10T10:00:00Z",
    views: 1250
  },
  {
    id: "2",
    title: "نصائح ذهبية لشهر العسل المثالي",
    slug: "honeymoon-tips",
    excerpt: "كل ما تحتاج معرفته لتخطيط شهر عسل لا يُنسى مع شريك حياتك",
    cover_image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
    author_name: "سارة أحمد",
    category: "شهر العسل",
    tags: ["شهر عسل", "رومانسي", "نصائح"],
    reading_time: 6,
    is_featured: true,
    published_at: "2026-01-08T10:00:00Z",
    views: 890
  },
  {
    id: "3",
    title: "استكشف جمال طرابزون التركية",
    slug: "trabzon-turkey-guide",
    excerpt: "رحلة في الشمال التركي الساحر - الطبيعة الخلابة والثقافة الغنية",
    cover_image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800",
    author_name: "محمد العلي",
    category: "دليل السفر",
    tags: ["تركيا", "طرابزون", "طبيعة"],
    reading_time: 10,
    is_featured: false,
    published_at: "2026-01-05T10:00:00Z",
    views: 650
  },
  {
    id: "4",
    title: "أفضل المطاعم الحلال في بانكوك",
    slug: "halal-restaurants-bangkok",
    excerpt: "دليلك الشامل لأفضل المطاعم الحلال في العاصمة التايلاندية",
    cover_image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
    author_name: "فريق ترافليون",
    category: "نصائح السفر",
    tags: ["تايلاند", "حلال", "مطاعم"],
    reading_time: 5,
    is_featured: false,
    published_at: "2026-01-03T10:00:00Z",
    views: 420
  },
  {
    id: "5",
    title: "تعرف على ثقافة جورجيا العريقة",
    slug: "georgia-culture-guide",
    excerpt: "اكتشف التاريخ والتقاليد الغنية لجورجيا في القوقاز",
    cover_image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800",
    author_name: "أحمد خالد",
    category: "ثقافة وتراث",
    tags: ["جورجيا", "ثقافة", "تاريخ"],
    reading_time: 7,
    is_featured: false,
    published_at: "2026-01-01T10:00:00Z",
    views: 380
  }
];

const Blog = () => {
  useSEO({
    title: "المدونة - ترافليون",
    description: "اقرأ أحدث المقالات والنصائح حول السفر والسياحة من خبراء ترافليون",
    keywords: "مدونة سياحة, نصائح سفر, دليل سياحي, مقالات سفر",
  });

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await blogService.getArticles();
        setArticles(data && data.length > 0 ? (data as unknown as Article[]) : fallbackArticles);
      } catch {
        setArticles(fallbackArticles);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const categories = ["الكل", "دليل السفر", "نصائح السفر", "شهر العسل", "ثقافة وتراث"];
  const featuredArticles = articles.filter(a => a.is_featured).slice(0, 2);
  const regularArticles = articles.filter(a => !a.is_featured);
  const filteredArticles = selectedCategory === "all"
    ? regularArticles
    : regularArticles.filter(a => a.category === selectedCategory);

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-luxury-teal" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        badge="اقرأ وتعلم"
        badgeIcon={<TrendingUp className="w-4 h-4 text-luxury-teal" />}
        title={<>مدونة <span className="text-gradient-teal">السفر والسياحة</span></>}
        subtitle="نصائح، أدلة، وقصص ملهمة من عالم السفر"
      />

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-8 -mt-10 relative z-20">
          <div className="container px-4">
            <h2 className="text-2xl font-bold text-luxury-navy mb-6">المقالات المميزة</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredArticles.map((article) => (
                <Link key={article.id} to={`/blog/${article.slug}`} className="group">
                  <div className="card-3d overflow-hidden hover:shadow-luxury transition-all">
                    <div className="relative h-64">
                      <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/80 to-transparent" />
                      <div className="absolute top-4 right-4 bg-luxury-gold text-luxury-navy px-4 py-1 rounded-full text-sm font-bold">
                        مميز
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-luxury-gold text-sm font-semibold">{article.category}</span>
                        <h3 className="text-2xl font-bold text-white mt-2 mb-3 group-hover:text-luxury-gold transition-colors">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-4 text-white/80 text-sm">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{article.author_name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{article.reading_time} دقائق</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Filter */}
      <section className="py-12 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === "الكل" ? "all" : cat)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  (selectedCategory === "all" && cat === "الكل") || selectedCategory === cat
                    ? "bg-luxury-teal text-white shadow-glow-teal"
                    : "bg-white text-luxury-navy hover:bg-luxury-cream border border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Link key={article.id} to={`/blog/${article.slug}`} className="group">
                <div className="card-3d overflow-hidden hover:shadow-luxury transition-all h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.cover_image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 bg-luxury-teal/90 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {article.category}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-luxury-navy mb-3 group-hover:text-luxury-teal transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2 flex-1">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{article.author_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{article.reading_time} دقائق</span>
                      </div>
                    </div>
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {article.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-xs bg-luxury-cream text-luxury-teal px-2 py-1 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">لا توجد مقالات في هذا التصنيف حالياً</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-luxury-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-luxury-gold/10 rounded-full blur-[150px]" />
        </div>
        <div className="container px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">اشترك في نشرتنا البريدية</h2>
            <p className="text-white/70 mb-8">احصل على أحدث المقالات والعروض الحصرية مباشرة إلى بريدك</p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 px-6 py-4 rounded-full text-luxury-navy"
              />
              <button className="btn-gold px-8 py-4 rounded-full whitespace-nowrap">
                اشترك الآن
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Blog;