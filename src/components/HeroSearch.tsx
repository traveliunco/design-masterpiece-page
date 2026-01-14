import { useState, useEffect, useRef } from "react";
import { Search, Plane, Hotel, MapPin, Package, Tag, Calendar, Users, ArrowLeft, TrendingUp, Clock, Sparkles, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type SearchTab = "all" | "destinations" | "programs" | "hotels" | "flights" | "offers";

interface SearchResult {
  id: string;
  type: "destination" | "program" | "hotel" | "flight" | "offer";
  title: string;
  subtitle?: string;
  price?: string;
  image?: string;
  url: string;
  badge?: string;
}

const HeroSearch = () => {
  const [activeTab, setActiveTab] = useState<SearchTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const tabs = [
    { id: "all" as SearchTab, label: "الكل", icon: Search, color: "from-purple-500 to-pink-500" },
    { id: "destinations" as SearchTab, label: "الوجهات", icon: MapPin, color: "from-luxury-teal to-emerald-500" },
    { id: "programs" as SearchTab, label: "البرامج", icon: Package, color: "from-blue-500 to-cyan-500" },
    { id: "hotels" as SearchTab, label: "الفنادق", icon: Hotel, color: "from-orange-500 to-red-500" },
    { id: "flights" as SearchTab, label: "الطيران", icon: Plane, color: "from-sky-500 to-blue-600" },
    { id: "offers" as SearchTab, label: "العروض", icon: Tag, color: "from-luxury-gold to-yellow-500" },
  ];

  const popularSearches = [
    { text: "ماليزيا", icon: "🇲🇾" },
    { text: "شهر العسل المالديف", icon: "💍" },
    { text: "تركيا اسطنبول", icon: "🇹🇷" },
    { text: "عروض الصيف", icon: "☀️" },
    { text: "فنادق 5 نجوم", icon: "⭐" },
  ];

  // Search function
  const performSearch = async (query: string, tab: SearchTab) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const allResults: SearchResult[] = [];

    try {
      // Search destinations
      if (tab === "all" || tab === "destinations") {
        const { data: destinations } = await supabase
          .from("destinations")
          .select("*")
          .or(`name_ar.ilike.%${query}%,name_en.ilike.%${query}%,description_ar.ilike.%${query}%`)
          .limit(5);

        if (destinations) {
          allResults.push(
            ...destinations.map((d) => ({
              id: d.id,
              type: "destination" as const,
              title: d.name_ar || d.name_en,
              subtitle: d.country_ar || d.country_en,
              price: d.starting_price ? `${d.starting_price} ر.س` : undefined,
              image: d.cover_image,
              url: `/destinations/${d.slug || d.id}`,
              badge: d.is_featured ? "مميز" : undefined,
            }))
          );
        }
      }

      // Search programs
      if (tab === "all" || tab === "programs") {
        const { data: programs } = await supabase
          .from("programs")
          .select("*")
          .or(`name_ar.ilike.%${query}%,name_en.ilike.%${query}%,description_ar.ilike.%${query}%`)
          .limit(5);

        if (programs) {
          allResults.push(
            ...programs.map((p: any) => ({
              id: p.id,
              type: "program" as const,
              title: p.name_ar || p.name_en,
              subtitle: p.duration ? `${p.duration} أيام` : undefined,
              price: p.base_price ? `${p.base_price} ر.س` : undefined,
              image: p.cover_image,
              url: `/programs/${p.id}`,
              badge: p.is_featured ? "مميز" : undefined,
            }))
          );
        }
      }

      // Search hotels
      if (tab === "all" || tab === "hotels") {
        const { data: hotels } = await supabase
          .from("hotels")
          .select("*")
          .or(`name_ar.ilike.%${query}%,name_en.ilike.%${query}%,description_ar.ilike.%${query}%`)
          .limit(5);

        if (hotels) {
          allResults.push(
            ...hotels.map((h: any) => ({
              id: h.id,
              type: "hotel" as const,
              title: h.name_ar || h.name_en,
              subtitle: h.city_ar || h.city_en,
              price: h.price_per_night ? `${h.price_per_night} ر.س / ليلة` : undefined,
              image: h.main_image || h.cover_image,
              url: `/hotels/${h.id}`,
              badge: h.rating ? `⭐ ${h.rating}` : undefined,
            }))
          );
        }
      }

      setResults(allResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery, activeTab);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (url: string) => {
    setShowResults(false);
    setSearchQuery("");
    setIsFocused(false);
    navigate(url);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "destination":
        return MapPin;
      case "program":
        return Package;
      case "hotel":
        return Hotel;
      case "flight":
        return Plane;
      case "offer":
        return Tag;
      default:
        return Search;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "destination":
        return "وجهة";
      case "program":
        return "برنامج";
      case "hotel":
        return "فندق";
      case "flight":
        return "رحلة طيران";
      case "offer":
        return "عرض";
      default:
        return "";
    }
  };

  const activeTabData = tabs.find((t) => t.id === activeTab);

  return (
    <div ref={searchRef} className="relative w-full animate-reveal delay-300">
      {/* Enhanced Search Container with Advanced Glassmorphism */}
      <div
        className={cn(
          "relative rounded-3xl p-1.5 transition-all duration-500",
          "bg-gradient-to-br from-white/10 via-white/5 to-transparent",
          "backdrop-blur-xl backdrop-saturate-150",
          "border border-white/20",
          "shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]",
          isFocused && "shadow-[0_20px_60px_0_rgba(14,165,233,0.3),0_0_0_1px_rgba(14,165,233,0.2)]",
          isFocused && "scale-[1.02]"
        )}
      >
        {/* Animated Gradient Border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-luxury-teal/50 via-luxury-gold/50 to-luxury-teal/50 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10" />

        {/* Inner Container */}
        <div className="relative bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-2xl rounded-[22px] p-4 shadow-inner">
          {/* Tabs with Premium Design */}
          <div className="flex gap-2 mb-4 pb-4 border-b border-white/20 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative flex items-center gap-2.5 px-5 py-3 rounded-2xl font-semibold whitespace-nowrap transition-all duration-300 text-sm group",
                    isActive
                      ? "text-white shadow-lg shadow-current/30 scale-105"
                      : "text-luxury-navy/70 hover:text-luxury-navy hover:bg-white/50 hover:shadow-md"
                  )}
                >
                  {isActive && (
                    <div className={cn("absolute inset-0 rounded-2xl bg-gradient-to-r", tab.color, "animate-gradient")} />
                  )}
                  <Icon className={cn("w-4 h-4 relative z-10 transition-transform group-hover:scale-110")} />
                  <span className="relative z-10">{tab.label}</span>
                  {isActive && (
                    <Sparkles className="w-3 h-3 text-white/70 relative z-10 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Premium Search Input */}
          <div className="relative group">
            {/* Search Icon */}
            <Search
              className={cn(
                "absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 z-10 transition-all duration-300",
                isFocused ? "text-luxury-teal scale-110" : "text-luxury-navy/40"
              )}
            />

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => {
                setShowResults(true);
                setIsFocused(true);
              }}
              onBlur={() => setIsFocused(false)}
              placeholder={`ابحث عن ${activeTab === "all" ? "الوجهات، البرامج، الفنادق..." : activeTabData?.label || ""}`}
              className={cn(
                "w-full px-5 pr-14 pl-14 py-4 text-base rounded-2xl transition-all duration-300",
                "bg-white/80 backdrop-blur-md",
                "border-2 border-white/40",
                "text-luxury-navy placeholder:text-luxury-navy/40",
                "focus:outline-none focus:bg-white focus:border-luxury-teal/50",
                "focus:shadow-[0_10px_40px_0_rgba(14,165,233,0.15)]",
                "hover:border-white/60"
              )}
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute left-5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-luxury-navy/10 hover:bg-luxury-navy/20 transition-all group z-10"
                title="مسح البحث"
              >
                <X className="w-4 h-4 text-luxury-navy/60 group-hover:text-luxury-navy" />
              </button>
            )}

            {/* Loading Indicator */}
            {isSearching && (
              <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
                <div className="w-5 h-5 border-2 border-luxury-teal border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Advanced Search Results Dropdown */}
          {showResults && (searchQuery || popularSearches.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-3 rounded-3xl overflow-hidden z-50 animate-slideDown">
              <div className="bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-2xl border border-white/30 shadow-[0_20px_70px_0_rgba(0,0,0,0.15)] max-h-[600px] overflow-y-auto">
                {/* Results */}
                {results.length > 0 ? (
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-luxury-navy/60 text-sm mb-4 px-2">
                      <Sparkles className="w-4 h-4" />
                      <span>{results.length} نتيجة</span>
                    </div>
                    <div className="space-y-3">
                      {results.map((result) => {
                        const Icon = getTypeIcon(result.type);
                        return (
                          <button
                            key={`${result.type}-${result.id}`}
                            onClick={() => handleResultClick(result.url)}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/80 transition-all group text-right border border-transparent hover:border-luxury-teal/20 hover:shadow-lg"
                          >
                            {result.image && (
                              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                                <img
                                  src={result.image}
                                  alt={result.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <Icon className="w-4 h-4 text-luxury-teal flex-shrink-0" />
                                <span className="text-xs text-luxury-navy/50 font-medium">{getTypeName(result.type)}</span>
                                {result.badge && (
                                  <span className="text-xs bg-gradient-to-r from-luxury-gold/20 to-luxury-gold/10 text-luxury-gold px-2 py-0.5 rounded-full font-semibold">
                                    {result.badge}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-luxury-navy font-bold text-lg group-hover:text-luxury-teal transition-colors truncate mb-1">
                                {result.title}
                              </h4>
                              {result.subtitle && (
                                <p className="text-luxury-navy/60 text-sm truncate">{result.subtitle}</p>
                              )}
                            </div>
                            {result.price && (
                              <div className="text-luxury-gold font-bold text-sm flex-shrink-0 px-3 py-1.5 bg-luxury-gold/10 rounded-xl">
                                {result.price}
                              </div>
                            )}
                            <ArrowLeft className="w-5 h-5 text-luxury-navy/30 group-hover:text-luxury-teal group-hover:-translate-x-1 transition-all flex-shrink-0" />
                          </button>
                        );
                      })}
                    </div>

                    {/* View All Results */}
                    <Link
                      to={`/search?q=${searchQuery}&type=${activeTab}`}
                      className="block mt-5 p-4 text-center text-luxury-teal hover:text-luxury-teal/80 font-bold rounded-2xl hover:bg-luxury-teal/10 transition-all border-2 border-dashed border-luxury-teal/30 hover:border-luxury-teal"
                    >
                      عرض جميع النتائج ({results.length}+)
                    </Link>
                  </div>
                ) : searchQuery && !isSearching ? (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-luxury-teal/20 to-luxury-gold/20 flex items-center justify-center">
                      <Search className="w-10 h-10 text-luxury-navy/30" />
                    </div>
                    <p className="text-luxury-navy/70 font-semibold text-lg mb-2">لا توجد نتائج لـ "{searchQuery}"</p>
                    <p className="text-luxury-navy/40 text-sm">جرب البحث عن شيء آخر أو تصفح الفئات</p>
                  </div>
                ) : (
                  <div className="p-5">
                    {/* Popular Searches */}
                    <div className="mb-5">
                      <div className="flex items-center gap-2 text-luxury-navy/60 text-sm mb-4 px-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-semibold">عمليات بحث شائعة</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((search) => (
                          <button
                            key={search.text}
                            onClick={() => {
                              setSearchQuery(search.text);
                              setShowResults(true);
                            }}
                            className="px-4 py-2.5 bg-white/80 hover:bg-white text-luxury-navy rounded-xl text-sm font-medium transition-all hover:shadow-md border border-white/40 hover:border-luxury-teal/30 flex items-center gap-2"
                          >
                            <span>{search.icon}</span>
                            <span>{search.text}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="pt-5 border-t border-white/30">
                      <div className="text-luxury-navy/60 text-sm mb-4 px-2 font-semibold">روابط سريعة</div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { to: "/destinations", icon: MapPin, label: "جميع الوجهات", color: "from-luxury-teal to-emerald-500" },
                          { to: "/offers", icon: Tag, label: "العروض الخاصة", color: "from-luxury-gold to-yellow-500" },
                          { to: "/honeymoon", icon: Sparkles, label: "شهر العسل", color: "from-rose-500 to-pink-500" },
                          { to: "/programs", icon: Package, label: "البرامج السياحية", color: "from-blue-500 to-cyan-500" },
                        ].map((link) => (
                          <Link
                            key={link.to}
                            to={link.to}
                            className="flex items-center gap-3 p-4 rounded-2xl bg-white/60 hover:bg-white text-luxury-navy/70 hover:text-luxury-navy transition-all hover:shadow-lg border border-white/40 hover:border-white group"
                          >
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br text-white shadow-md", link.color)}>
                              <link.icon className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-sm">{link.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSearch;
