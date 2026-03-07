import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, User, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Tag, Eye, Loader2 } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import { useSEO } from "@/hooks/useSEO";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { blogService } from "@/services/adminDataService";
import { supabase } from "@/integrations/supabase/client";

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
  reading_time: number;
  published_at: string;
  views: number;
}

const fallbackArticles: Article[] = [
  {
    id: "1",
    title: "أفضل 10 وجهات سياحية في ماليزيا",
    slug: "best-10-destinations-malaysia",
    excerpt: "اكتشف أجمل الأماكن السياحية في ماليزيا من الجزر الاستوائية إلى المدن الحديثة",
    content: `# أفضل 10 وجهات سياحية في ماليزيا\n\nماليزيا هي واحدة من أجمل الوجهات السياحية في جنوب شرق آسيا.\n\n## 1. كوالالمبور\nالعاصمة الماليزية هي نقطة البداية المثالية.\n\n## 2. جزيرة لانكاوي\nجنة استوائية بشواطئها الرملية البيضاء ومياهها الفيروزية.`,
    cover_image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800",
    author_name: "فريق ترافليون",
    category: "دليل السفر",
    tags: ["ماليزيا", "سياحة", "جزر"],
    reading_time: 8,
    published_at: "2026-01-10T10:00:00Z",
    views: 1250
  },
  {
    id: "2",
    title: "نصائح ذهبية لشهر العسل المثالي",
    slug: "honeymoon-tips",
    excerpt: "كل ما تحتاج معرفته لتخطيط شهر عسل لا يُنسى مع شريك حياتك",
    content: `# نصائح ذهبية لشهر العسل المثالي\n\n## التخطيط المبكر\nابدأ التخطيط قبل 6 أشهر على الأقل.\n\n## اختيار الوجهة\nفكّر في اهتماماتكما المشتركة.`,
    cover_image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
    author_name: "سارة أحمد",
    category: "شهر العسل",
    tags: ["شهر عسل", "رومانسي", "نصائح"],
    reading_time: 6,
    published_at: "2026-01-08T10:00:00Z",
    views: 890
  },
  {
    id: "3",
    title: "استكشف جمال طرابزون التركية",
    slug: "trabzon-turkey-guide",
    excerpt: "رحلة في الشمال التركي الساحر",
    content: `# استكشف جمال طرابزون التركية\n\n## دير سوميلا\nمعلق على جرف صخري.\n\n## بحيرة أوزنجول\nقرية ساحرة على ضفاف بحيرة هادئة.`,
    cover_image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800",
    author_name: "محمد العلي",
    category: "دليل السفر",
    tags: ["تركيا", "طرابزون", "طبيعة"],
    reading_time: 10,
    published_at: "2026-01-05T10:00:00Z",
    views: 650
  }
];

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: article ? `${article.title} - مدونة ترافليون` : "مدونة ترافليون",
    description: article?.excerpt || "",
    keywords: article?.tags?.join(", ") || "",
  });

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        // محاولة الجلب من Supabase أولاً
        const { data, error } = await (supabase
          .from("blog_articles" as "destinations")
          .select("*")
          .eq("slug", slug)
          .single() as unknown as Promise<{data: Article | null, error: unknown}>);

        if (!error && data) {
          setArticle(data as unknown as Article);
          // جلب المقالات ذات الصلة بشكل منفصل
          void (supabase
            .from("blog_articles" as "destinations")
            .select("*")
            .eq("category", (data as unknown as Article).category)
            .limit(4) as unknown as Promise<{data: unknown[] | null}>)
            .then(res => {
              const relArr = ((res.data || []) as unknown as Article[]).filter(a => a.id !== (data as unknown as Article).id).slice(0, 3);
              setRelatedArticles(relArr);
            });
          // زيادة عداد المشاهدات
          blogService.incrementViews((data as unknown as Article).id);
        } else {
          // Fallback للبيانات الثابتة
          const found = fallbackArticles.find(a => a.slug === slug);
          if (found) {
            setArticle(found);
            setRelatedArticles(fallbackArticles.filter(a => a.category === found.category && a.id !== found.id));
          } else {
            navigate("/blog");
          }
        }
      } catch {
        const found = fallbackArticles.find(a => a.slug === slug);
        if (found) {
          setArticle(found);
          setRelatedArticles(fallbackArticles.filter(a => a.category === found.category && a.id !== found.id));
        } else {
          navigate("/blog");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug, navigate]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-luxury-teal" />
        </div>
      </PageLayout>
    );
  }

  if (!article) return null;

  // Simple markdown to HTML converter
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-luxury-navy mb-4">{line.slice(2)}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-luxury-navy mt-8 mb-3">{line.slice(3)}</h2>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-muted-foreground leading-relaxed mb-4">{line}</p>;
    });
  };

  return (
    <PageLayout>
      {/* Hero Image */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy via-luxury-navy/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 pb-16">
          <div className="container px-4">
            <div className="max-w-4xl">
              <Link to="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-luxury-gold transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" />
                العودة للمدونة
              </Link>
              <span className="inline-block bg-luxury-teal text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                {article.category}
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">{article.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-white/80">
                <div className="flex items-center gap-2"><User className="w-5 h-5" /><span className="font-semibold">{article.author_name}</span></div>
                <div className="flex items-center gap-2"><Calendar className="w-5 h-5" /><span>{new Date(article.published_at).toLocaleDateString("ar-SA")}</span></div>
                <div className="flex items-center gap-2"><Clock className="w-5 h-5" /><span>{article.reading_time} دقائق قراءة</span></div>
                <div className="flex items-center gap-2"><Eye className="w-5 h-5" /><span>{article.views} مشاهدة</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-12">
              <div className="flex-1">
                <div className="card-3d p-8 md:p-12">{renderContent(article.content)}</div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Tag className="w-5 h-5 text-luxury-teal" />
                    {article.tags.map((tag, i) => (
                      <span key={i} className="bg-luxury-cream text-luxury-teal px-4 py-2 rounded-full font-semibold text-sm">#{tag}</span>
                    ))}
                  </div>
                )}

                {/* Share */}
                <div className="mt-8 card-3d p-6">
                  <h3 className="font-bold text-luxury-navy mb-4 flex items-center gap-2"><Share2 className="w-5 h-5" />شارك المقال</h3>
                  <div className="flex gap-3">
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2"><Facebook className="w-4 h-4" />فيسبوك</Button>
                    </a>
                    <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${article.title}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2"><Twitter className="w-4 h-4" />تويتر</Button>
                    </a>
                    <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2"><Linkedin className="w-4 h-4" />لينكدإن</Button>
                    </a>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="hidden lg:block w-80">
                <div className="sticky top-24 space-y-6">
                  <div className="card-3d p-6">
                    <h3 className="font-bold text-luxury-navy mb-4">عن الكاتب</h3>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-luxury-teal to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                        {article.author_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-luxury-navy">{article.author_name}</div>
                        <div className="text-sm text-muted-foreground">كاتب ومدون سفر</div>
                      </div>
                    </div>
                  </div>
                  <div className="card-3d p-6 bg-gradient-to-br from-luxury-teal/10 to-luxury-gold/10 border-luxury-teal/30">
                    <h3 className="font-bold text-luxury-navy mb-3">جاهز للسفر؟</h3>
                    <p className="text-sm text-muted-foreground mb-4">اكتشف عروضنا الحصرية</p>
                    <Link to="/destinations"><Button className="w-full btn-luxury">تصفح الوجهات</Button></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 bg-luxury-cream/50">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-luxury-navy mb-8">مقالات ذات صلة</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link key={related.id} to={`/blog/${related.slug}`} className="group">
                  <div className="card-3d overflow-hidden hover:shadow-luxury transition-all">
                    <div className="relative h-40 overflow-hidden">
                      <img src={related.cover_image} alt={related.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-luxury-navy group-hover:text-luxury-teal transition-colors line-clamp-2 mb-2">{related.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{related.reading_time} دقائق</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
};

export default BlogPost;