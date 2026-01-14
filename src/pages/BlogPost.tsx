import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, User, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Tag, Eye } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import { useSEO } from "@/hooks/useSEO";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

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
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      // Fetch main article
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) throw error;
      setArticle(data);

      // Increment views
      await supabase
        .from("articles")
        .update({ views: (data.views || 0) + 1 })
        .eq("id", data.id);

      // Fetch related articles
      const { data: related } = await supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .eq("category", data.category)
        .neq("id", data.id)
        .limit(3);

      setRelatedArticles(related || []);
    } catch (error) {
      console.error("Error fetching article:", error);
      navigate("/blog");
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = window.location.href;

  if (loading) {
    return (
      <PageLayout>
        <div className="container px-4 py-20 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-luxury-teal border-t-transparent rounded-full mx-auto" />
        </div>
      </PageLayout>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <PageLayout>
      {/* Hero Image */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <img 
          src={article.cover_image} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
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
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="font-semibold">{article.author_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(article.published_at).toLocaleDateString("ar-SA")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{article.reading_time} دقائق قراءة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span>{article.views} مشاهدة</span>
                </div>
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
              {/* Main Content */}
              <div className="flex-1">
                <div className="card-3d p-8 md:p-12 prose prose-lg max-w-none">
                  <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Tag className="w-5 h-5 text-luxury-teal" />
                    {article.tags.map((tag, i) => (
                      <span key={i} className="bg-luxury-cream text-luxury-teal px-4 py-2 rounded-full font-semibold text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Share */}
                <div className="mt-8 card-3d p-6">
                  <h3 className="font-bold text-luxury-navy mb-4 flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    شارك المقال
                  </h3>
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
                  {/* Author Card */}
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

                  {/* CTA */}
                  <div className="card-3d p-6 bg-gradient-to-br from-luxury-teal/10 to-luxury-gold/10 border-luxury-teal/30">
                    <h3 className="font-bold text-luxury-navy mb-3">جاهز للسفر؟</h3>
                    <p className="text-sm text-muted-foreground mb-4">اكتشف عروضنا الحصرية</p>
                    <Link to="/destinations">
                      <Button className="w-full btn-luxury">تصفح الوجهات</Button>
                    </Link>
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
                      <img 
                        src={related.cover_image} 
                        alt={related.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-luxury-navy group-hover:text-luxury-teal transition-colors line-clamp-2 mb-2">
                        {related.title}
                      </h3>
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
