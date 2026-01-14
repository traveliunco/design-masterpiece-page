import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Search as SearchIcon, Plane, Hotel, MapPin, Calendar, Users, Filter, TrendingUp, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSEO } from "@/hooks/useSEO";
import { useState } from "react";
import { Link } from "react-router-dom";

const Search = () => {
  useSEO({
    title: "البحث - ترافليون",
    description: "ابحث عن رحلتك المثالية من بين آلاف الخيارات",
    keywords: "بحث, رحلات, فنادق, وجهات سياحية",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [destination, setDestination] = useState("all");

  const popularSearches = ["المالديف", "اسطنبول", "بالي", "دبي", "بانكوك", "باريس"];

  const quickFilters = [
    { name: "شهر العسل", icon: "💑", count: "50+" },
    { name: "عائلية", icon: "👨‍👩‍👧‍👦", count: "100+" },
    { name: "مغامرة", icon: "🏔️", count: "40+" },
    { name: "شواطئ", icon: "🏖️", count: "60+" },
  ];

  // Sample results (would come from API/Supabase)
  const sampleResults = [
    { id: 1, type: "destination", name: "جزر المالديف", image: "🏝️", rating: 4.9, reviews: 350, price: "من 8,500 ر.س" },
    { id: 2, type: "hotel", name: "منتجع كونراد المالديف", image: "🏨", rating: 4.8, reviews: 120, price: "من 3,500 ر.س/ليلة" },
    { id: 3, type: "program", name: "باقة المالديف 7 ليالي", image: "✈️", rating: 5.0, reviews: 89, price: "12,800 ر.س" },
  ];

  return (
    <PageLayout>
      <PageHeader
        badge="اعثر على رحلتك المثالية"
        badgeIcon={<SearchIcon className="w-4 h-4 text-luxury-teal" />}
        title={<>البحث عن <span className="text-gradient-teal">رحلتك</span></>}
        subtitle="ابحث بين آلاف الخيارات واعثر على الرحلة المثالية لك"
      />

      {/* Search Section */}
      <section className="py-8 -mt-10 relative z-20">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto">
            <div className="glass-premium rounded-3xl p-8 shadow-luxury">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="md:col-span-2">
                  <Input
                    placeholder="ابحث عن وجهة، فندق، أو برنامج..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 rounded-xl text-lg"
                  />
                </div>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className="h-14 rounded-xl">
                    <SelectValue placeholder="نوع البحث" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="destinations">وجهات</SelectItem>
                    <SelectItem value="hotels">فنادق</SelectItem>
                    <SelectItem value="programs">برامج</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="h-14 btn-luxury text-lg rounded-xl">
                  <SearchIcon className="w-5 h-5 ml-2" />
                  بحث
                </Button>
              </div>

              {/* Popular Searches */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">الأكثر بحثاً:</span>
                {popularSearches.map((term, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => setSearchQuery(term)}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <section className="py-12 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-luxury-navy mb-6 flex items-center gap-2">
              <Filter className="w-6 h-6 text-luxury-teal" />
              تصفية سريعة
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickFilters.map((filter, i) => (
                <div key={i} className="card-3d p-6 text-center cursor-pointer hover:scale-105 transition-transform">
                  <div className="text-4xl mb-3">{filter.icon}</div>
                  <h3 className="font-bold text-luxury-navy mb-1">{filter.name}</h3>
                  <p className="text-sm text-luxury-teal">{filter.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 bg-luxury-cream/50">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-luxury-navy">نتائج البحث ({sampleResults.length})</h2>
              <Select defaultValue="popular">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">الأكثر شعبية</SelectItem>
                  <SelectItem value="price-low">السعر: الأقل</SelectItem>
                  <SelectItem value="price-high">السعر: الأعلى</SelectItem>
                  <SelectItem value="rating">التقييم</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              {sampleResults.map((result) => (
                <div key={result.id} className="card-3d p-6 hover:shadow-luxury transition-all">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-luxury-teal/20 to-luxury-gold/20 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0">
                      {result.image}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-luxury-navy mb-1">{result.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
                              <span className="font-semibold text-luxury-navy">{result.rating}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">({result.reviews} تقييم)</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground mb-1">ابتداءً من</p>
                          <p className="text-2xl font-bold text-luxury-teal">{result.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4">
                        <Link to={`/${result.type}s/${result.id}`}>
                          <Button className="btn-luxury">عرض التفاصيل</Button>
                        </Link>
                        <Button variant="outline" className="border-luxury-teal text-luxury-teal hover:bg-luxury-teal/10">
                          احجز الآن
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Destinations */}
      <section className="py-16 bg-gradient-to-b from-background to-luxury-cream/30">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto text-center">
            <TrendingUp className="w-12 h-12 text-luxury-teal mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-luxury-navy mb-4">الوجهات الأكثر طلباً</h2>
            <p className="text-muted-foreground mb-8">استكشف أكثر الوجهات شعبية هذا الشهر</p>
            <Link to="/destinations">
              <Button className="btn-luxury px-12 py-6 text-lg rounded-full">
                عرض جميع الوجهات
                <MapPin className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Search;
