import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar, Users, Star, Check, Phone, ArrowRight, Clock, Shield, Car, Hotel, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";
import { destinations } from "@/data/destinations";
import { BookingForm } from "@/components/BookingForm";
import { useSEO } from "@/hooks/useSEO";

const DestinationDetails = () => {
  const { id } = useParams();
  const destination = destinations.find((d) => d.id === id || d.slug === id);

  useSEO({
    title: destination ? `${destination.name} - ترافليون` : "الوجهة غير موجودة",
    description: destination?.description || "اكتشف أجمل الوجهات السياحية",
    keywords: destination ? `${destination.name}, سياحة, سفر, برامج` : "سياحة",
  });

  if (!destination) {
    return (
      <PageLayout>
        <div className="container py-32 text-center">
          <h1 className="text-4xl font-bold text-luxury-navy mb-4">الوجهة غير موجودة</h1>
          <Link to="/destinations">
            <Button className="btn-luxury">العودة إلى الوجهات</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const adultPrice = destination.starting_price || 0;
  const childPrice = Math.round(adultPrice * 0.7);

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover scale-110 animate-[pulse_20s_ease-in-out_infinite]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/95 via-luxury-navy/60 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-28 left-0 right-0 z-20">
          <div className="container px-4">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Link to="/" className="hover:text-luxury-gold transition-colors">الرئيسية</Link>
              <span>/</span>
              <Link to="/destinations" className="hover:text-luxury-gold transition-colors">الوجهات</Link>
              <span>/</span>
              <span className="text-luxury-gold font-semibold">{destination.name}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 pb-16 z-10">
          <div className="container px-4">
            <div className="flex items-center gap-3 text-white/90 mb-4">
              <MapPin className="w-6 h-6 text-luxury-gold" />
              <span className="text-lg font-semibold">{destination.region}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {destination.name}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mb-8 leading-relaxed">
              {destination.description}
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-luxury-gold fill-luxury-gold" />
                <span className="text-white font-bold text-lg">{destination.rating || 4.8}</span>
                <span className="text-white/70">(+{destination.reviewCount || 500} تقييم)</span>
              </div>
              <span className="bg-luxury-gold text-luxury-navy px-5 py-2 rounded-full text-sm font-bold shadow-glow-gold">
                {destination.tag}
              </span>
              {destination.countryId && (
                <Link to={`/country/${destination.countryId}`}>
                  <Button className="bg-luxury-teal hover:bg-luxury-teal/90 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all">
                    <MapPin className="w-5 h-5" />
                    استكشف المدن والمعالم
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gradient-to-b from-background via-luxury-cream/30 to-background">
        <div className="container px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Programs */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="w-8 h-8 text-luxury-teal" />
                <h2 className="text-3xl font-bold text-luxury-navy">البرامج السياحية المتاحة</h2>
              </div>

              <div className="space-y-6">
                {destination.programs.map((program, index) => (
                  <div key={index} className="card-3d p-6 hover:shadow-luxury transition-all">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-luxury-navy mb-2">{program.name}</h3>
                        <div className="flex items-center gap-4 text-muted-foreground text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-luxury-teal" />
                            {program.days} أيام
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-luxury-teal" />
                            للأفراد والعائلات
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-sm text-muted-foreground block">السعر</span>
                          <div className="text-2xl font-bold text-luxury-teal">{program.price} ر.س</div>
                        </div>
                        <a
                          href={`https://api.whatsapp.com/send?phone=966569222111&text=أريد الاستفسار عن ${program.name} في ${destination.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button className="btn-luxury rounded-full px-6">احجز الآن</Button>
                        </a>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {["الفندق", "المواصلات", "الإفطار", "المرشد"].map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-luxury-teal" />
                            <span className="text-luxury-navy">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* What's Included */}
              <div className="mt-16">
                <h2 className="text-3xl font-bold text-luxury-navy mb-8">ماذا يشمل البكج؟</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { icon: Hotel, title: "الإقامة الفندقية", desc: "فنادق 4-5 نجوم مع إفطار يومي" },
                    { icon: Car, title: "المواصلات", desc: "سيارة خاصة مع سائق طوال الرحلة" },
                    { icon: Users, title: "الاستقبال", desc: "استقبال وتوديع من وإلى المطار" },
                    { icon: Shield, title: "التأمين", desc: "تأمين سفر شامل طوال الرحلة" },
                    { icon: Clock, title: "الجولات", desc: "جولات سياحية يومية مع مرشد" },
                    { icon: Star, title: "الهدايا", desc: "هدايا ترحيبية خاصة للعملاء" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-5 bg-luxury-cream/50 rounded-2xl">
                      <div className="w-14 h-14 bg-luxury-teal/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-7 h-7 text-luxury-teal" />
                      </div>
                      <div>
                        <h3 className="font-bold text-luxury-navy mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotels Link */}
              <div className="mt-12 p-6 bg-gradient-to-br from-luxury-teal/10 to-luxury-gold/10 rounded-3xl border-2 border-luxury-teal/30">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-luxury-navy mb-2 flex items-center gap-2">
                      <Hotel className="w-6 h-6 text-luxury-teal" />
                      فنادق مميزة في {destination.name}
                    </h3>
                    <p className="text-muted-foreground">اكتشف أفضل الفنادق والمنتجعات الفاخرة</p>
                  </div>
                  <Link to={`/hotels?destination=${destination.id}`}>
                    <Button className="btn-luxury rounded-full px-8">عرض الفنادق</Button>
                  </Link>
                </div>
              </div>

              {/* Booking Form */}
              <div className="mt-16 pt-16 border-t border-border">
                <div className="max-w-xl mx-auto">
                  <BookingForm 
                    destinationName={destination.name_ar || destination.name} 
                    adultPrice={adultPrice}
                    childPrice={childPrice}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Price Card */}
                <div className="card-3d p-6">
                  <div className="text-center mb-6">
                    <span className="text-muted-foreground text-sm">الأسعار تبدأ من</span>
                    <div className="text-5xl font-bold text-luxury-teal mt-2">
                      {destination.startPrice} <span className="text-xl">ر.س</span>
                    </div>
                    <span className="text-sm text-muted-foreground">للشخص الواحد</span>
                  </div>

                  <a
                    href={`https://api.whatsapp.com/send?phone=966569222111&text=أريد الاستفسار عن عروض ${destination.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mb-4"
                  >
                    <Button className="w-full btn-luxury rounded-full py-6 text-lg">
                      <Phone className="w-5 h-5 ml-2" />
                      احجز الآن
                    </Button>
                  </a>

                  <a href="tel:+966569222111" className="block">
                    <Button variant="outline" className="w-full rounded-full py-6 border-luxury-teal text-luxury-teal hover:bg-luxury-teal/10">
                      اتصل بنا
                    </Button>
                  </a>
                </div>

                {/* Quick Info */}
                <div className="bg-luxury-cream/50 rounded-2xl p-6">
                  <h3 className="font-bold text-luxury-navy mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-luxury-gold" />
                    معلومات سريعة
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">المنطقة</span>
                      <span className="font-semibold text-luxury-navy">{destination.region}</span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">عدد البرامج</span>
                      <span className="font-semibold text-luxury-navy">{destination.programs.length} برامج</span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">التقييم</span>
                      <span className="font-semibold text-luxury-navy flex items-center gap-1">
                        <Star className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
                        {destination.rating || 4.8}
                      </span>
                    </li>
                    <li className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">الدفع</span>
                      <span className="font-semibold text-luxury-teal">تقسيط متاح</span>
                    </li>
                  </ul>
                </div>

                {/* Back Link */}
                <Link
                  to="/destinations"
                  className="flex items-center gap-2 text-muted-foreground hover:text-luxury-teal transition-colors justify-center py-3"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>العودة إلى الوجهات</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default DestinationDetails;