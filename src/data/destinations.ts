export interface Program {
  name: string;
  days: number;
  price: string;
}

export interface Destination {
  id: string;
  slug: string;
  name?: string;
  name_ar: string;
  name_en?: string;
  description?: string;
  description_ar: string;
  short_description_ar?: string;
  image?: string;
  cover_image: string;
  tag?: string;
  tags: string[];
  region?: string;
  region_ar: string;
  starting_price: number;
  startPrice?: string;
  average_rating: number;
  rating?: number;
  total_reviews: number;
  reviewCount?: number;
  display_order?: number;
  is_active?: boolean;
  is_featured?: boolean;
  programs?: Program[];
  countryId?: string; // Link to southeast-asia country
}

import malaysiaImg from "@/assets/malaysia.jpg";
import thailandImg from "@/assets/thailand.jpg";
import turkeyImg from "@/assets/turkey.jpg";
import indonesiaImg from "@/assets/indonesia.jpg";
import maldivesImg from "@/assets/maldives.jpg";
import georgiaImg from "@/assets/georgia.jpg";
import azerbaijanImg from "@/assets/azerbaijan.jpg";

export const destinations = [
  {
    id: "malaysia",
    slug: "malaysia",
    countryId: "malaysia",
    name: "ماليزيا",
    name_ar: "ماليزيا",
    name_en: "Malaysia",
    description: "كوالالمبور الرائعة - تجتمع الحضارة والتاريخ والطبيعة",
    description_ar: "كوالالمبور الرائعة - تجتمع الحضارة والتاريخ والطبيعة",
    image: malaysiaImg,
    cover_image: malaysiaImg,
    tag: "الأكثر طلباً",
    tags: ["الأكثر طلباً"],
    region: "جنوب شرق آسيا",
    region_ar: "جنوب شرق آسيا",
    startPrice: "3,999",
    starting_price: 3999,
    rating: 4.9,
    average_rating: 4.9,
    reviewCount: 520,
    total_reviews: 520,
    programs: [
      { name: "برنامج 10 أيام شهر عسل", days: 10, price: "5,999" },
      { name: "برنامج 7 أيام عائلي", days: 7, price: "4,499" },
      { name: "برنامج 5 أيام اقتصادي", days: 5, price: "3,999" },
    ],
  },
  {
    id: "thailand",
    slug: "thailand",
    countryId: "thailand",
    name: "تايلاند",
    name_ar: "تايلاند",
    name_en: "Thailand",
    description: "فوكيت جمال الطبيعة المذهل - الأجمل والأرقى",
    description_ar: "فوكيت جمال الطبيعة المذهل - الأجمل والأرقى",
    image: thailandImg,
    cover_image: thailandImg,
    tag: "شهر عسل",
    tags: ["شهر عسل"],
    region: "جنوب شرق آسيا",
    region_ar: "جنوب شرق آسيا",
    startPrice: "4,499",
    starting_price: 4499,
    rating: 4.8,
    average_rating: 4.8,
    reviewCount: 380,
    total_reviews: 380,
    programs: [
      { name: "برنامج 10 أيام في تايلاند", days: 10, price: "5,499" },
      { name: "برنامج بوكيت الفاخر", days: 7, price: "6,999" },
      { name: "برنامج بانكوك وباتايا", days: 8, price: "4,999" },
    ],
  },
  {
    id: "turkey",
    slug: "turkey",
    name: "تركيا",
    name_ar: "تركيا",
    name_en: "Turkey",
    description: "طرابزون الأجمل والأرخص - الوجهة الأولى",
    description_ar: "طرابزون الأجمل والأرخص - الوجهة الأولى",
    image: turkeyImg,
    cover_image: turkeyImg,
    tag: "عائلي",
    tags: ["عائلي"],
    region: "أوروبا وآسيا",
    region_ar: "أوروبا وآسيا",
    startPrice: "3,499",
    starting_price: 3499,
    rating: 4.7,
    average_rating: 4.7,
    reviewCount: 450,
    total_reviews: 450,
    programs: [
      { name: "برنامج 5 أيام الشمال التركي", days: 5, price: "3,499" },
      { name: "برنامج 10 أيام طرابزون", days: 10, price: "5,999" },
      { name: "برنامج إسطنبول وكابادوكيا", days: 8, price: "4,999" },
    ],
  },
  {
    id: "indonesia",
    slug: "indonesia",
    countryId: "indonesia",
    name: "إندونيسيا",
    name_ar: "إندونيسيا",
    name_en: "Indonesia",
    description: "في قلب الطبيعة، بأكواخ جمالها من الخيال",
    description_ar: "في قلب الطبيعة، بأكواخ جمالها من الخيال",
    image: indonesiaImg,
    cover_image: indonesiaImg,
    tag: "مغامرة",
    tags: ["مغامرة"],
    region: "جنوب شرق آسيا",
    region_ar: "جنوب شرق آسيا",
    startPrice: "4,999",
    starting_price: 4999,
    rating: 4.8,
    average_rating: 4.8,
    reviewCount: 320,
    total_reviews: 320,
    programs: [
      { name: "برنامج 10 أيام في بالي", days: 10, price: "6,499" },
      { name: "برنامج 7 أيام في جاكرتا وبالي", days: 7, price: "5,299" },
      { name: "برنامج 6 أيام اقتصادي", days: 6, price: "4,999" },
    ],
  },
  {
    id: "vietnam",
    slug: "vietnam",
    countryId: "vietnam",
    name: "فيتنام",
    name_ar: "فيتنام",
    name_en: "Vietnam",
    description: "هانوي وهوشي منه - تاريخ وثقافة وطبيعة ساحرة",
    description_ar: "هانوي وهوشي منه - تاريخ وثقافة وطبيعة ساحرة",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592",
    cover_image: "https://images.unsplash.com/photo-1528127269322-539801943592",
    tag: "ثقافة",
    tags: ["ثقافة", "طبيعة"],
    region: "جنوب شرق آسيا",
    region_ar: "جنوب شرق آسيا",
    startPrice: "3,799",
    starting_price: 3799,
    rating: 4.7,
    average_rating: 4.7,
    reviewCount: 280,
    total_reviews: 280,
    programs: [
      { name: "برنامج 10 أيام شامل", days: 10, price: "5,799" },
      { name: "برنامج 7 أيام هانوي وهالونج", days: 7, price: "4,499" },
      { name: "برنامج 5 أيام اقتصادي", days: 5, price: "3,799" },
    ],
  },
    average_rating: 4.8,
    reviewCount: 320,
    total_reviews: 320,
    programs: [
      { name: "برنامج بالي الساحر", days: 7, price: "5,999" },
      { name: "برنامج جاكرتا وبالي", days: 10, price: "6,499" },
      { name: "برنامج شهر عسل بالي", days: 8, price: "7,499" },
    ],
  },
  {
    id: "maldives",
    slug: "maldives",
    name: "المالديف",
    name_ar: "المالديف",
    name_en: "Maldives",
    description: "جزر الأحلام مثالية لشهر العسل والاسترخاء",
    description_ar: "جزر الأحلام مثالية لشهر العسل والاسترخاء",
    image: maldivesImg,
    cover_image: maldivesImg,
    tag: "رومانسي",
    tags: ["رومانسي"],
    region: "المحيط الهندي",
    region_ar: "المحيط الهندي",
    startPrice: "8,999",
    starting_price: 8999,
    rating: 4.9,
    average_rating: 4.9,
    reviewCount: 280,
    total_reviews: 280,
    programs: [
      { name: "برنامج شهر عسل فاخر", days: 5, price: "12,999" },
      { name: "برنامج الاسترخاء", days: 4, price: "8,999" },
      { name: "برنامج الجزر الخاصة", days: 7, price: "18,999" },
    ],
  },
  {
    id: "georgia",
    slug: "georgia",
    name: "جورجيا",
    name_ar: "جورجيا",
    name_en: "Georgia",
    description: "طبيعة خلابة وتاريخ عريق بأسعار مناسبة",
    description_ar: "طبيعة خلابة وتاريخ عريق بأسعار مناسبة",
    image: georgiaImg,
    cover_image: georgiaImg,
    tag: "اقتصادي",
    tags: ["اقتصادي"],
    region: "القوقاز",
    region_ar: "القوقاز",
    startPrice: "2,999",
    starting_price: 2999,
    rating: 4.6,
    average_rating: 4.6,
    reviewCount: 410,
    total_reviews: 410,
    programs: [
      { name: "برنامج 7 أيام تبليسي", days: 7, price: "3,499" },
      { name: "برنامج الجبال والطبيعة", days: 10, price: "4,999" },
      { name: "برنامج اقتصادي 5 أيام", days: 5, price: "2,999" },
    ],
  },
  {
    id: "philippines",
    slug: "philippines",
    countryId: "philippines",
    name: "الفلبين",
    name_ar: "الفلبين",
    name_en: "Philippines",
    description: "7000 جزيرة استوائية - شواطئ بيضاء وطبيعة خلابة",
    description_ar: "7000 جزيرة استوائية - شواطئ بيضاء وطبيعة خلابة",
    image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86",
    cover_image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86",
    tag: "شواطئ",
    tags: ["شواطئ", "جديد"],
    region: "جنوب شرق آسيا",
    region_ar: "جنوب شرق آسيا",
    startPrice: "4,299",
    starting_price: 4299,
    rating: 4.8,
    average_rating: 4.8,
    reviewCount: 250,
    total_reviews: 250,
    programs: [
      { name: "برنامج 10 أيام مانيلا وبالاوان", days: 10, price: "6,499" },
      { name: "برنامج 7 أيام بوراكاي", days: 7, price: "5,299" },
      { name: "برنامج 5 أيام اقتصادي", days: 5, price: "4,299" },
    ],
  },
  {
    id: "singapore",
    slug: "singapore",
    countryId: "singapore",
    name: "سنغافورة",
    name_ar: "سنغافورة",
    name_en: "Singapore",
    description: "مدينة الأسد - الحداثة والنظافة والتطور",
    description_ar: "مدينة الأسد - الحداثة والنظافة والتطور",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd",
    cover_image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd",
    tag: "فاخر",
    tags: ["فاخر", "حضري"],
    region: "جنوب شرق آسيا",
    region_ar: "جنوب شرق آسيا",
    startPrice: "5,999",
    starting_price: 5999,
    rating: 4.9,
    average_rating: 4.9,
    reviewCount: 420,
    total_reviews: 420,
    programs: [
      { name: "برنامج 7 أيام سنغافورة الفاخر", days: 7, price: "8,999" },
      { name: "برنامج 5 أيام عائلي", days: 5, price: "6,999" },
      { name: "برنامج 4 أيام اقتصادي", days: 4, price: "5,999" },
    ],
  },
  {
    id: "azerbaijan",
    slug: "azerbaijan",
    name: "أذربيجان",
    name_ar: "أذربيجان",
    name_en: "Azerbaijan",
    description: "باكو الحديثة مع لمسات تاريخية فريدة",
    description_ar: "باكو الحديثة مع لمسات تاريخية فريدة",
    image: azerbaijanImg,
    cover_image: azerbaijanImg,
    tag: "جديد",
    tags: ["جديد"],
    region: "القوقاز",
    region_ar: "القوقاز",
    startPrice: "3,299",
    starting_price: 3299,
    rating: 4.7,
    average_rating: 4.7,
    reviewCount: 190,
    total_reviews: 190,
    programs: [
      { name: "برنامج 9 أيام في أذربيجان", days: 9, price: "4,999" },
      { name: "برنامج باكو الفاخر", days: 5, price: "3,999" },
      { name: "برنامج اقتصادي", days: 6, price: "3,299" },
    ],
  },
];
