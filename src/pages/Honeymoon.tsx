import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, MapPin, Calendar, Phone, Gift, Camera, UtensilsCrossed, ArrowLeft, Shield, Check, Users, Clock, Play, ChevronLeft, ChevronRight } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import { Button } from "@/components/ui/button";
import maldivesImg from "@/assets/maldives.jpg";
import thailandImg from "@/assets/thailand.jpg";
import indonesiaImg from "@/assets/indonesia.jpg";
import malaysiaImg from "@/assets/malaysia.jpg";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";

const honeymoonPackages = [
  {
    id: "maldives", destination: "المالديف", title: "جنة العشاق", emoji: "🏝️",
    description: "فيلا خاصة فوق الماء في أجمل جزر المالديف مع عشاء رومانسي تحت النجوم وسبا للزوجين",
    image: maldivesImg, duration: "5 أيام / 4 ليالي", price: "12,999", oldPrice: "15,999",
    features: ["فيلا خاصة فوق الماء", "عشاء رومانسي على الشاطئ", "سبا وتدليك للزوجين", "رحلة غطس بالشعاب المرجانية", "استقبال VIP من المطار"],
    rating: 4.9, reviews: 127, badge: "الأكثر طلباً"
  },
  {
    id: "bali", destination: "بالي - إندونيسيا", title: "سحر الجزيرة", emoji: "🌺",
    description: "أفخم المنتجعات وسط حقول الأرز والغابات الاستوائية مع جولات طبيعية مذهلة",
    image: indonesiaImg, duration: "7 أيام / 6 ليالي", price: "8,999", oldPrice: "11,499",
    features: ["منتجع 5 نجوم وسط الطبيعة", "جولة معابد بالي المقدسة", "مساج بالي التقليدي", "عشاء في مطعم فوق الجرف", "جلسة يوغا صباحية"],
    rating: 4.8, reviews: 203, badge: "أفضل قيمة"
  },
  {
    id: "phuket", destination: "بوكيت - تايلاند", title: "لؤلؤة أندامان", emoji: "🌊",
    description: "شواطئ ذهبية ومياه فيروزية في أجمل جزر تايلاند مع فلل شاطئية خاصة",
    image: thailandImg, duration: "6 أيام / 5 ليالي", price: "6,999", oldPrice: "8,999",
    features: ["فيلا شاطئية خاصة", "رحلة جزر فاي فاي", "مساج تايلاندي أصيل", "عشاء على اليخت", "جولة بالقارب الزجاجي"],
    rating: 4.7, reviews: 185, badge: "خصم 22%"
  },
  {
    id: "langkawi", destination: "لنكاوي - ماليزيا", title: "أرض الأساطير", emoji: "🦅",
    description: "جزيرة الأحلام بغاباتها الكثيفة وشواطئها البكر ومنتجعاتها الفاخرة",
    image: malaysiaImg, duration: "5 أيام / 4 ليالي", price: "5,499", oldPrice: "7,299",
    features: ["منتجع فاخر على البحر", "تلفريك لنكاوي السماوي", "عشاء رومانسي على الشاطئ", "جولة غابات المانغروف", "جسر السماء المعلق"],
    rating: 4.8, reviews: 156, badge: "الأكثر اقتصادية"
  },
];

const honeymoonFeatures = [
  { icon: Heart, title: "تزيين الغرفة", description: "ورود حمراء وشموع عطرية وديكور رومانسي خاص", color: "bg-rose-500" },
  { icon: Gift, title: "هدايا ترحيبية", description: "سلة فواكه استوائية وشوكولاتة فاخرة", color: "bg-amber-500" },
  { icon: UtensilsCrossed, title: "عشاء رومانسي", description: "عشاء خاص على ضوء الشموع فوق الشاطئ", color: "bg-pink-500" },
  { icon: Camera, title: "جلسة تصوير", description: "مصور محترف يوثق أجمل لحظاتكم", color: "bg-purple-500" },
  { icon: Star, title: "استقبال VIP", description: "استقبال خاص من المطار بسيارة فاخرة", color: "bg-teal-500" },
  { icon: Shield, title: "تأمين شامل", description: "تأمين سفر شامل طوال فترة الرحلة", color: "bg-blue-500" },
];

const testimonials = [
  { name: "أحمد و سارة", location: "الرياض", text: "كانت أفضل رحلة في حياتنا! كل شيء كان مرتب بشكل مثالي من الفندق للجولات. شكراً ترافليون ❤️", rating: 5, destination: "المالديف" },
  { name: "عبدالله و نورة", location: "جدة", text: "باقة شهر العسل كانت فوق التوقعات. الفيلا على البحر مباشرة والعشاء الرومانسي كان لا يُنسى!", rating: 5, destination: "بالي" },
  { name: "خالد و ريم", location: "الدمام", text: "تنظيم ممتاز وخدمة عملاء رائعة. استمتعنا بكل لحظة. ننصح كل عريس وعروسة بترافليون!", rating: 5, destination: "بوكيت" },
];

const Honeymoon = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useSEO({
    title: "عروض شهر العسل - باقات رومانسية مميزة | ترافليون",
    description: "أجمل باقات شهر العسل مع ترافليون. المالديف، بالي، بوكيت، لنكاوي. فلل خاصة، عشاء رومانسي، سبا للزوجين. خصومات حتى 25%!",
    keywords: "شهر عسل, عروس, زفاف, المالديف, بالي, رومانسي, سفر العرسان, باقات رومانسية",
  });

  // Auto-slide hero
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % honeymoonPackages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-slide testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentPkg = honeymoonPackages[currentSlide];

  return (
    <PageLayout>
      {/* ═══════════════ CINEMATIC HERO ═══════════════ */}
      <section className="relative h-[90vh] min-h-[700px] overflow-hidden">
        {/* Background Images with Crossfade */}
        {honeymoonPackages.map((pkg, i) => (
          <div
            key={pkg.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              i === currentSlide ? "opacity-100" : "opacity-0"
            )}
          >
            <img src={pkg.image} alt={pkg.destination} className="w-full h-full object-cover scale-105" />
          </div>
        ))}
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-rose-900/30 to-transparent" />

        {/* Floating Hearts Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <Heart
              key={i}
              className={cn(
                "absolute text-rose-400/20 fill-rose-400/10 animate-bounce",
                i === 0 && "w-8 h-8 top-[20%] left-[10%] [animation-delay:0s] [animation-duration:3s]",
                i === 1 && "w-6 h-6 top-[40%] right-[15%] [animation-delay:1s] [animation-duration:4s]",
                i === 2 && "w-10 h-10 top-[60%] left-[70%] [animation-delay:2s] [animation-duration:3.5s]",
                i === 3 && "w-5 h-5 top-[30%] left-[40%] [animation-delay:0.5s] [animation-duration:4.5s]",
                i === 4 && "w-7 h-7 top-[70%] left-[25%] [animation-delay:1.5s] [animation-duration:3.2s]",
                i === 5 && "w-4 h-4 top-[15%] right-[30%] [animation-delay:2.5s] [animation-duration:4.2s]",
              )}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 pb-20 z-10">
          <div className="container px-4">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-rose-500/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-rose-400/30 mb-6">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                <span className="text-sm font-medium text-white">شهر عسل أحلامكم يبدأ من هنا</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                ابدأ حياتكما{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
                  برحلة أحلام
                </span>
              </h1>

              {/* Current Package Info */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl">{currentPkg.emoji}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{currentPkg.title} - {currentPkg.destination}</h2>
                  <div className="flex items-center gap-3 text-white/80 text-sm mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{currentPkg.duration}</span>
                    <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />{currentPkg.rating}</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" />{currentPkg.reviews} حجز</span>
                  </div>
                </div>
              </div>

              {/* Price + CTA */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20">
                  <span className="text-white/60 text-sm line-through">{currentPkg.oldPrice} ر.س</span>
                  <div className="text-3xl font-bold text-white">{currentPkg.price} <span className="text-sm font-normal text-white/70">ر.س / للزوجين</span></div>
                </div>
                <a href={`https://api.whatsapp.com/send?phone=966569222111&text=أريد حجز باقة شهر العسل: ${currentPkg.title} - ${currentPkg.destination}`} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-8 py-6 text-lg shadow-[0_8px_30px_rgba(244,63,94,0.4)] group">
                    <Phone className="w-5 h-5 ml-2" />
                    احجز الآن
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {honeymoonPackages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                i === currentSlide ? "bg-rose-400 w-12" : "bg-white/30 w-6 hover:bg-white/50"
              )}
              aria-label={`الشريحة ${i + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide(prev => prev > 0 ? prev - 1 : honeymoonPackages.length - 1)}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
          aria-label="السابق"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentSlide(prev => (prev + 1) % honeymoonPackages.length)}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
          aria-label="التالي"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </section>

      {/* ═══════════════ WHAT'S INCLUDED ═══════════════ */}
      <section className="py-20 bg-gradient-to-b from-rose-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-rose-200/30 rounded-full blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-pink-200/30 rounded-full blur-[80px]" />
        </div>
        
        <div className="container px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-rose-100 px-5 py-2 rounded-full mb-6">
              <Gift className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-bold text-rose-700">مع كل باقة شهر عسل</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              كل ما تحتاجانه <span className="text-rose-500">لرحلة مثالية</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">خدمات حصرية مصممة خصيصاً لجعل شهر عسلكم تجربة لا تُنسى</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {honeymoonFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-rose-200 hover:-translate-y-2"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3", feature.color)}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PACKAGES ═══════════════ */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-pink-100 px-5 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-bold text-pink-700">وجهات رومانسية</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              اختر <span className="text-rose-500">وجهة أحلامكم</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {honeymoonPackages.map((pkg) => (
              <div key={pkg.id} className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100">
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <img src={pkg.image} alt={pkg.destination} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-rose-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    {pkg.badge}
                  </div>
                  
                  {/* Rating */}
                  <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold">{pkg.rating}</span>
                    <span className="text-white/60">({pkg.reviews})</span>
                  </div>

                  {/* Emoji + Title overlay */}
                  <div className="absolute bottom-4 right-4 left-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{pkg.emoji}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{pkg.title}</h3>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <MapPin className="w-3.5 h-3.5" />{pkg.destination}
                          <span>•</span>
                          <Calendar className="w-3.5 h-3.5" />{pkg.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-5 leading-relaxed">{pkg.description}</p>

                  {/* Features */}
                  <div className="space-y-2.5 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-rose-500" />
                        </div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                    <div>
                      <span className="text-sm text-gray-400 line-through">{pkg.oldPrice} ر.س</span>
                      <div className="text-3xl font-bold text-rose-500">{pkg.price} <span className="text-sm font-normal text-gray-500">ر.س</span></div>
                      <span className="text-xs text-gray-400">للزوجين شامل الضرائب</span>
                    </div>
                    <a href={`https://api.whatsapp.com/send?phone=966569222111&text=أريد حجز باقة شهر العسل: ${pkg.title} - ${pkg.destination}`} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-6 py-5 shadow-lg group">
                        <Phone className="w-4 h-4 ml-2" />
                        احجز الآن
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">عرسان سعداء مع <span className="text-rose-500">ترافليون</span></h2>
            <p className="text-gray-500">آراء حقيقية من أزواج استمتعوا بشهر عسل لا يُنسى</p>
          </div>

          <div className="max-w-3xl mx-auto">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={cn(
                  "transition-all duration-500",
                  i === activeTestimonial ? "block opacity-100" : "hidden opacity-0"
                )}
              >
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-pink-100 text-center">
                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 font-medium">"{t.text}"</p>
                  
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.location} • باقة {t.destination}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === activeTestimonial ? "bg-rose-500 w-8" : "bg-gray-300 w-2"
                  )}
                  aria-label={`التقييم ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ WHY CHOOSE US ═══════════════ */}
      <section className="py-16 bg-white">
        <div className="container px-4">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { number: "500+", label: "زوج سعيد", icon: Heart },
              { number: "15", label: "وجهة رومانسية", icon: MapPin },
              { number: "98%", label: "نسبة الرضا", icon: Star },
              { number: "24/7", label: "دعم متواصل", icon: Clock },
            ].map((stat, i) => (
              <div key={i} className="p-6">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-rose-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <p className="text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="py-24 bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-[100px]" />
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <Heart key={i} className={cn(
              "absolute text-white/10 fill-white/5",
              i % 2 === 0 ? "w-12 h-12" : "w-8 h-8",
            )} style={{ top: `${10 + (i * 12)}%`, left: `${5 + (i * 12)}%` }} />
          ))}
        </div>

        <div className="container px-4 text-center relative z-10">
          <Heart className="w-16 h-16 text-white/30 mx-auto mb-8 animate-pulse" />
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            لم تجد الباقة المناسبة؟
          </h2>
          <p className="text-white/90 text-xl mb-4 max-w-xl mx-auto leading-relaxed">
            فريقنا المختص يصمم لكم برنامج شهر عسل حصري ومخصص 100% حسب رغباتكم وميزانيتكم
          </p>
          <p className="text-white/60 text-sm mb-10">تواصل معنا الآن واحصل على عرض خاص خلال 30 دقيقة</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://api.whatsapp.com/send?phone=966569222111&text=أريد تصميم برنامج شهر عسل مخصص" target="_blank" rel="noopener noreferrer">
              <Button className="bg-white text-rose-600 hover:bg-white/90 rounded-full px-10 py-6 text-lg font-bold shadow-2xl group">
                <Phone className="w-5 h-5 ml-2" />
                صمم رحلتك الخاصة
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </a>
            <a href="tel:+966569222111">
              <Button variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg backdrop-blur-sm">
                <Phone className="w-5 h-5 ml-2" />
                اتصل بنا الآن
              </Button>
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Honeymoon;
