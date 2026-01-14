import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plane, Calendar, MapPin, Users, Star, Clock, CheckCircle,
  Hotel, Car, UtensilsCrossed, Camera, Search, Heart, ArrowLeft
} from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import malaysiaImg from "@/assets/malaysia.jpg";
import thailandImg from "@/assets/thailand.jpg";
import turkeyImg from "@/assets/turkey.jpg";
import indonesiaImg from "@/assets/indonesia.jpg";
import maldivesImg from "@/assets/maldives.jpg";
import georgiaImg from "@/assets/georgia.jpg";

const programTypes = [
  { id: "all", name: "الكل", icon: "📋" },
  { id: "honeymoon", name: "شهر عسل", icon: "💕" },
  { id: "family", name: "عائلي", icon: "👨‍👩‍👧‍👦" },
  { id: "adventure", name: "مغامرات", icon: "🏔️" },
  { id: "cultural", name: "ثقافي", icon: "🏛️" },
  { id: "luxury", name: "فاخر", icon: "👑" },
];

const programs = [
  {
    id: 1, name: "ماليزيا الكلاسيكية", destination: "ماليزيا", type: "family",
    days: 8, nights: 7, price: 4999, originalPrice: 5999, rating: 4.8, reviews: 124,
    image: malaysiaImg, highlights: ["كوالالمبور", "جنتنق هايلاند", "لنكاوي"],
    includes: ["الطيران", "الفنادق", "المواصلات", "الجولات"], featured: true,
  },
  {
    id: 2, name: "شهر عسل في المالديف", destination: "المالديف", type: "honeymoon",
    days: 6, nights: 5, price: 12999, originalPrice: 14999, rating: 4.9, reviews: 89,
    image: maldivesImg, highlights: ["منتجع 5 نجوم", "فيلا على الماء", "غوص"],
    includes: ["الطيران", "منتجع فاخر", "إفطار وعشاء"], featured: true,
  },
  {
    id: 3, name: "سحر تركيا", destination: "تركيا", type: "cultural",
    days: 10, nights: 9, price: 5499, originalPrice: 6499, rating: 4.7, reviews: 156,
    image: turkeyImg, highlights: ["اسطنبول", "كابادوكيا", "أنطاليا"],
    includes: ["الطيران", "الفنادق", "مرشد سياحي"], featured: true,
  },
  {
    id: 4, name: "مغامرة جورجيا", destination: "جورجيا", type: "adventure",
    days: 7, nights: 6, price: 3999, originalPrice: 4499, rating: 4.6, reviews: 78,
    image: georgiaImg, highlights: ["تبليسي", "كازبيقي", "باتومي"],
    includes: ["الطيران", "الفنادق", "سيارة خاصة"], featured: false,
  },
  {
    id: 5, name: "تايلاند العائلية", destination: "تايلاند", type: "family",
    days: 9, nights: 8, price: 4499, originalPrice: 5499, rating: 4.8, reviews: 203,
    image: thailandImg, highlights: ["بانكوك", "بتايا", "بوكيت"],
    includes: ["الطيران", "الفنادق", "الجولات"], featured: false,
  },
  {
    id: 6, name: "بالي الرومانسية", destination: "إندونيسيا", type: "honeymoon",
    days: 7, nights: 6, price: 6999, originalPrice: 7999, rating: 4.9, reviews: 112,
    image: indonesiaImg, highlights: ["أوبود", "سيمينياك", "نوسا دوا"],
    includes: ["الطيران", "منتجع", "سبا"], featured: false,
  },
];

const Programs = () => {
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPrograms = programs.filter((program) => {
    if (selectedType !== "all" && program.type !== selectedType) return false;
    if (searchQuery && !program.name.includes(searchQuery) && !program.destination.includes(searchQuery)) return false;
    return true;
  });

  return (
    <PageLayout>
      {/* Hero */}
      <PageHeader
        badge="أكثر من 50 برنامج سياحي"
        badgeIcon={<Plane className="w-4 h-4 text-luxury-gold" />}
        title="البرامج السياحية المتكاملة"
        subtitle="برامج مصممة بعناية تشمل كل ما تحتاجه لرحلة مثالية"
      />

      {/* Filters */}
      <section className="py-8 -mt-16 relative z-20">
        <div className="container px-4">
          <div className="glass-premium rounded-3xl p-6 shadow-luxury">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن برنامج..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-12 h-14 rounded-xl border-border"
                />
              </div>
              
              {/* Type Filter */}
              <div className="flex flex-wrap gap-2">
                {programTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "px-5 py-3 rounded-xl text-sm font-semibold transition-all",
                      selectedType === type.id
                        ? "bg-luxury-teal text-white shadow-glow-teal"
                        : "bg-white text-luxury-navy/70 hover:bg-luxury-teal/10 border border-border"
                    )}
                  >
                    <span className="ml-2">{type.icon}</span>
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              تم العثور على <span className="font-bold text-luxury-teal">{filteredPrograms.length}</span> برنامج
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program, index) => (
              <Link
                key={program.id}
                to={`/booking?destination=${program.destination}`}
                className="group card-3d overflow-hidden animate-reveal"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/80 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {program.featured && (
                      <span className="bg-luxury-gold text-luxury-navy px-3 py-1 rounded-full text-xs font-bold">
                        مميز
                      </span>
                    )}
                  </div>

                  {/* Discount */}
                  {program.originalPrice > program.price && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      خصم {Math.round((1 - program.price / program.originalPrice) * 100)}%
                    </div>
                  )}

                  {/* Duration */}
                  <div className="absolute bottom-4 right-4 glass-dark rounded-lg px-3 py-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white" />
                    <span className="text-white text-sm">{program.days} أيام</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg text-luxury-navy group-hover:text-luxury-teal transition-colors">
                      {program.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
                      <span className="font-bold text-sm">{program.rating}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm flex items-center gap-1 mb-4">
                    <MapPin className="w-4 h-4" />
                    {program.destination}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {program.highlights.map((h, i) => (
                      <span key={i} className="text-xs bg-luxury-teal/10 text-luxury-teal px-2 py-1 rounded-md">
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      {program.originalPrice > program.price && (
                        <span className="text-muted-foreground line-through text-sm">
                          {program.originalPrice.toLocaleString()} ر.س
                        </span>
                      )}
                      <div className="text-luxury-teal font-bold text-xl">
                        {program.price.toLocaleString()} ر.س
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-luxury-teal font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>احجز</span>
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredPrograms.length === 0 && (
            <div className="text-center py-20">
              <Plane className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-luxury-navy mb-2">لم يتم العثور على برامج</h3>
              <p className="text-muted-foreground mb-4">جرب تغيير معايير البحث</p>
              <button onClick={() => setSelectedType("all")} className="btn-outline-luxury">
                عرض جميع البرامج
              </button>
            </div>
          )}
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-luxury-cream/50">
        <div className="container px-4">
          <SectionTitle
            badge="مزايا البرامج"
            title="ماذا تشمل"
            highlight="برامجنا؟"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Plane, label: "تذاكر الطيران", color: "from-blue-500 to-sky-500" },
              { icon: Hotel, label: "إقامة فندقية", color: "from-purple-500 to-violet-500" },
              { icon: Car, label: "المواصلات", color: "from-green-500 to-emerald-500" },
              { icon: Camera, label: "الجولات", color: "from-orange-500 to-amber-500" },
              { icon: UtensilsCrossed, label: "وجبات مختارة", color: "from-red-500 to-rose-500" },
              { icon: Users, label: "مرشد سياحي", color: "from-indigo-500 to-blue-500" },
              { icon: CheckCircle, label: "تأمين السفر", color: "from-teal-500 to-cyan-500" },
              { icon: Clock, label: "دعم 24/7", color: "from-pink-500 to-rose-500" },
            ].map((item, index) => (
              <div key={index} className="card-3d p-6 text-center">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <p className="font-semibold text-luxury-navy">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-luxury-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-luxury-teal/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-luxury-gold/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="container px-4 relative z-10 text-center">
          <h2 className="text-section text-white mb-6">
            لم تجد البرنامج المناسب؟
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            تواصل معنا وسنصمم لك برنامجاً خاصاً يناسب ميزانيتك واهتماماتك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://api.whatsapp.com/send?phone=966569222111" target="_blank" rel="noopener noreferrer">
              <button className="btn-gold px-10 py-5 text-lg">تواصل عبر واتساب</button>
            </a>
            <Link to="/contact">
              <button className="btn-outline-luxury px-10 py-5 text-lg text-white border-white/30 hover:bg-white hover:text-luxury-navy">
                أرسل استفسارك
              </button>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Programs;
