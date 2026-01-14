/**
 * مكون شريط البحث
 * يوفر بحث ذكي في الوجهات والبرامج
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, X, Plane, Hotel, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { destinations } from "@/data/destinations";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    variant?: "default" | "hero" | "compact";
    className?: string;
    onSearch?: (query: string) => void;
}

// بيانات إضافية للبحث
const searchableItems = [
    ...destinations.map((d) => ({
        id: d.id,
        type: "destination" as const,
        title: d.name,
        subtitle: d.region,
        path: `/destinations/${d.id}`,
    })),
    { id: "flights", type: "service" as const, title: "حجز طيران", subtitle: "احجز تذكرتك", path: "/flights" },
    { id: "hotels", type: "service" as const, title: "حجز فنادق", subtitle: "أفضل الأسعار", path: "/hotels" },
    { id: "honeymoon", type: "service" as const, title: "شهر العسل", subtitle: "برامج رومانسية", path: "/honeymoon" },
    { id: "offers", type: "service" as const, title: "العروض", subtitle: "خصومات حصرية", path: "/offers" },
];

export const SearchBar = ({ variant = "default", className, onSearch }: SearchBarProps) => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState(searchableItems);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // فلترة النتائج حسب البحث
    useEffect(() => {
        if (query.trim() === "") {
            setResults(searchableItems.slice(0, 6));
            setSelectedIndex(-1);
            return;
        }

        const filtered = searchableItems.filter(
            (item) =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.subtitle.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setSelectedIndex(-1);
    }, [query]);

    // إغلاق القائمة عند النقر خارجها
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // التعامل مع لوحة المفاتيح
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex >= 0 && results[selectedIndex]) {
                handleSelect(results[selectedIndex]);
            } else if (query.trim()) {
                handleSearch();
            }
        } else if (e.key === "Escape") {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    const handleSelect = (item: (typeof searchableItems)[0]) => {
        navigate(item.path);
        setQuery("");
        setIsOpen(false);
    };

    const handleSearch = () => {
        if (query.trim()) {
            onSearch?.(query);
            navigate(`/search?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "destination":
                return <MapPin className="w-4 h-4" />;
            case "service":
                return <Plane className="w-4 h-4" />;
            default:
                return <Search className="w-4 h-4" />;
        }
    };

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            {/* Input Field */}
            <div
                className={cn(
                    "relative flex items-center",
                    variant === "hero" && "bg-white rounded-full shadow-2xl",
                    variant === "compact" && "bg-muted rounded-lg",
                    variant === "default" && "bg-background border rounded-xl"
                )}
            >
                <Search
                    className={cn(
                        "absolute right-3 w-5 h-5 text-muted-foreground",
                        variant === "hero" && "right-5"
                    )}
                />
                <Input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="ابحث عن وجهة، فندق، أو رحلة..."
                    className={cn(
                        "pr-10 border-0 bg-transparent focus-visible:ring-0",
                        variant === "hero" && "h-14 pr-12 text-lg",
                        variant === "compact" && "h-10 pr-10 text-sm"
                    )}
                />
                {query && (
                    <button
                        onClick={() => setQuery("")}
                        aria-label="مسح البحث"
                        className="absolute left-3 p-1 hover:bg-muted rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                )}
                {variant === "hero" && (
                    <Button
                        onClick={handleSearch}
                        size="lg"
                        className="absolute left-2 rounded-full px-6"
                    >
                        بحث
                    </Button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {isOpen && results.length > 0 && (
                <div
                    className={cn(
                        "absolute top-full right-0 left-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden",
                        variant === "hero" && "mt-4"
                    )}
                >
                    <div className="p-2 max-h-80 overflow-y-auto">
                        {results.map((item, index) => (
                            <button
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 rounded-lg text-right transition-colors",
                                    selectedIndex === index
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                                        selectedIndex === index
                                            ? "bg-primary-foreground/20"
                                            : "bg-primary/10 text-primary"
                                    )}
                                >
                                    {getIcon(item.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{item.title}</p>
                                    <p
                                        className={cn(
                                            "text-sm truncate",
                                            selectedIndex === index
                                                ? "text-primary-foreground/70"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {item.subtitle}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="p-3 border-t border-border bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-2">استكشف المزيد</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate("/destinations")}
                                className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-full hover:bg-primary/20 transition-colors"
                            >
                                <MapPin className="w-3 h-3" />
                                الوجهات
                            </button>
                            <button
                                onClick={() => navigate("/offers")}
                                className="flex items-center gap-1 px-3 py-1.5 bg-secondary/10 text-secondary text-xs rounded-full hover:bg-secondary/20 transition-colors"
                            >
                                <Calendar className="w-3 h-3" />
                                العروض
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
