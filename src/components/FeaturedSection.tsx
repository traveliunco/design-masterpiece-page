import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Tag, 
  Calendar, 
  ArrowLeft, 
  Star, 
  Clock,
  Users,
  Sparkles,
  Percent,
  Plane
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import images
import malaysiaImg from "@/assets/malaysia.jpg";
import thailandImg from "@/assets/thailand.jpg";
import turkeyImg from "@/assets/turkey.jpg";
import indonesiaImg from "@/assets/indonesia.jpg";
import maldivesImg from "@/assets/maldives.jpg";
import georgiaImg from "@/assets/georgia.jpg";

// Tab types
type TabType = "destinations" | "offers" | "programs";

// Data
const destinations = [
  { id: 1, name: "ماليزيا", image: malaysiaImg, description: "جنة استوائية بين الغابات والشواطئ", price: "3,499", rating: 4.9 },
  { id: 2, name: "تايلاند", image: thailandImg, description: "أرض الابتسامات والمعابد الذهبية", price: "2,999", rating: 4.8 },
  { id: 3, name: "تركيا", image: turkeyImg, description: "حيث التاريخ يلتقي الحداثة", price: "4,299", rating: 4.9 },
  { id: 4, name: "إندونيسيا", image: indonesiaImg, description: "سحر الطبيعة وعجائب بالي", price: "3,799", rating: 4.7 },
  { id: 5, name: "المالديف", image: maldivesImg, description: "جنة على الأرض للعشاق", price: "9,999", rating: 5.0 },
  { id: 6, name: "جورجيا", image: georgiaImg, description: "جوهرة القوقاز المخفية", price: "2,799", rating: 4.8 },
];

const offers = [
  { 
    id: 1, 
    title: "عرض الصيف الحار", 
    destination: "تايلاند", 
    discount: 25, 
    originalPrice: "3,999", 
    newPrice: "2,999",
    validUntil: "٣١ يناير ٢٠٢٦",
    image: thailandImg,
    badge: "الأكثر طلباً"
  },
  { 
    id: 2, 
    title: "باقة شهر العسل", 
    destination: "المالديف", 
    discount: 15, 
    originalPrice: "11,999", 
    newPrice: "9,999",
    validUntil: "١٥ فبراير ٢٠٢٦",
    image: maldivesImg,
    badge: "للعرسان"
  },
  { 
    id: 3, 
    title: "عرض العائلات", 
    destination: "ماليزيا", 
    discount: 20, 
    originalPrice: "4,499", 
    newPrice: "3,599",
    validUntil: "٢٨ فبراير ٢٠٢٦",
    image: malaysiaImg,
    badge: "للعائلات"
  },
  { 
    id: 4, 
    title: "استكشف تركيا", 
    destination: "تركيا", 
    discount: 30, 
    originalPrice: "5,999", 
    newPrice: "4,199",
    validUntil: "١٠ فبراير ٢٠٢٦",
    image: turkeyImg,
    badge: "خصم كبير"
  },
];

const programs = [
  { 
    id: 1, 
    title: "رحلة ماليزيا الكاملة", 
    duration: "٧ أيام", 
    category: "عائلي",
    highlights: ["كوالالمبور", "لنكاوي", "بينانج"],
    price: "3,499",
    image: malaysiaImg
  },
  { 
    id: 2, 
    title: "سحر بالي وجاكرتا", 
    duration: "٨ أيام", 
    category: "مغامرات",
    highlights: ["بالي", "جاكرتا", "يوغياكارتا"],
    price: "3,799",
    image: indonesiaImg
  },
  { 
    id: 3, 
    title: "تركيا التاريخية", 
    duration: "١٠ أيام", 
    category: "ثقافي",
    highlights: ["إسطنبول", "كابادوكيا", "أنطاليا"],
    price: "4,299",
    image: turkeyImg
  },
  { 
    id: 4, 
    title: "شهر عسل المالديف", 
    duration: "٥ ليالي", 
    category: "رومانسي",
    highlights: ["منتجع خاص", "عشاء رومانسي", "رحلة غوص"],
    price: "9,999",
    image: maldivesImg
  },
];

const FeaturedSection = () => {
  const [activeTab, setActiveTab] = useState<TabType>("destinations");

  const tabs = [
    { id: "destinations" as TabType, label: "الوجهات", icon: MapPin, count: destinations.length },
    { id: "offers" as TabType, label: "العروض", icon: Tag, count: offers.length },
    { id: "programs" as TabType, label: "البرامج", icon: Calendar, count: programs.length },
  ];

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-background via-luxury-cream/30 to-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-luxury-teal/5 rounded-full blur-[200px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-luxury-gold/5 rounded-full blur-[150px]" />
      
      <div className="container px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 glass-premium rounded-full px-6 py-3 mb-6">
            <Sparkles className="w-4 h-4 text-luxury-gold" />
            <span className="text-sm font-semibold text-luxury-navy">استكشف المزيد</span>
          </div>
          
          <h2 className="text-section text-luxury-navy mb-6">
            اختر <span className="text-gradient-teal">وجهتك المثالية</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            تصفح مجموعتنا المختارة من الوجهات والعروض والبرامج السياحية المميزة
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex gap-2 p-2 glass-premium rounded-2xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-luxury-teal text-white shadow-glow-teal"
                    : "text-luxury-navy/70 hover:bg-luxury-teal/10"
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={cn(
                  "w-6 h-6 rounded-full text-xs flex items-center justify-center",
                  activeTab === tab.id ? "bg-white/20" : "bg-luxury-teal/10"
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[500px]">
          {/* Destinations Grid */}
          {activeTab === "destinations" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-reveal">
              {destinations.map((dest, index) => (
                <Link
                  key={dest.id}
                  to={`/destinations/${dest.id}`}
                  className="group card-3d overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={dest.image} 
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/80 to-transparent" />
                    
                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 glass-dark rounded-full px-3 py-1 flex items-center gap-1">
                      <Star className="w-3 h-3 text-luxury-gold fill-luxury-gold" />
                      <span className="text-white text-xs font-bold">{dest.rating}</span>
                    </div>
                    
                    {/* Title Overlay */}
                    <div className="absolute bottom-4 right-4 left-4">
                      <h3 className="text-xl font-bold text-white mb-1">{dest.name}</h3>
                      <p className="text-white/70 text-sm">{dest.description}</p>
                    </div>
                  </div>
                  
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <span className="text-muted-foreground text-xs">ابتداءً من</span>
                      <div className="text-luxury-teal font-bold text-lg">{dest.price} ر.س</div>
                    </div>
                    <div className="flex items-center gap-2 text-luxury-teal font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>استكشف</span>
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Offers Grid */}
          {activeTab === "offers" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-reveal">
              {offers.map((offer) => (
                <Link
                  key={offer.id}
                  to={`/offers/${offer.id}`}
                  className="group card-3d overflow-hidden flex flex-col md:flex-row"
                >
                  {/* Image */}
                  <div className="relative w-full md:w-2/5 h-48 md:h-auto overflow-hidden">
                    <img 
                      src={offer.image} 
                      alt={offer.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/60 to-transparent" />
                    
                    {/* Discount Badge */}
                    <div className="absolute top-4 right-4 bg-red-500 text-white rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                      <Percent className="w-4 h-4" />
                      <span className="font-bold text-lg">{offer.discount}٪</span>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute bottom-4 right-4 glass-dark rounded-full px-3 py-1">
                      <span className="text-white text-xs font-semibold">{offer.badge}</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{offer.destination}</span>
                      </div>
                      <h3 className="text-xl font-bold text-luxury-navy mb-3 group-hover:text-luxury-teal transition-colors">
                        {offer.title}
                      </h3>
                      
                      {/* Price */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-muted-foreground line-through text-sm">{offer.originalPrice} ر.س</span>
                        <span className="text-luxury-teal font-bold text-2xl">{offer.newPrice} ر.س</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Clock className="w-4 h-4" />
                        <span>صالح حتى {offer.validUntil}</span>
                      </div>
                      <button className="btn-luxury py-2 px-5 text-xs flex items-center gap-2">
                        احجز الآن
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Programs Grid */}
          {activeTab === "programs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-reveal">
              {programs.map((program) => (
                <Link
                  key={program.id}
                  to={`/programs/${program.id}`}
                  className="group card-3d overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={program.image} 
                      alt={program.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/80 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 right-3 bg-luxury-gold text-luxury-navy rounded-full px-3 py-1 text-xs font-bold">
                      {program.category}
                    </div>
                    
                    {/* Duration */}
                    <div className="absolute bottom-3 right-3 glass-dark rounded-lg px-3 py-1 flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-white" />
                      <span className="text-white text-xs">{program.duration}</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-luxury-navy mb-3 group-hover:text-luxury-teal transition-colors">
                      {program.title}
                    </h3>
                    
                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {program.highlights.map((highlight, i) => (
                        <span 
                          key={i}
                          className="text-xs bg-luxury-teal/10 text-luxury-teal px-2 py-1 rounded-md"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                    
                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div>
                        <span className="text-muted-foreground text-xs">للشخص</span>
                        <div className="text-luxury-teal font-bold">{program.price} ر.س</div>
                      </div>
                      <div className="flex items-center gap-1 text-luxury-teal text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>التفاصيل</span>
                        <ArrowLeft className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link 
            to={`/${activeTab}`}
            className="inline-flex items-center gap-3 btn-outline-luxury px-10 py-4"
          >
            <span>عرض الكل</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
