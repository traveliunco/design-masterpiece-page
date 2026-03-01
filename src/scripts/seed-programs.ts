/**
 * سكريبت إضافة البرامج السياحية - يتم تشغيله مرة واحدة
 * يمكن استخدامه من صفحة المتصفح أو من الكونسول
 */

import { supabase } from "@/integrations/supabase/client";

export const programsData = [
  {
    name_ar: "برنامج 9 أيام في ماليزيا",
    name_en: "9 Days Malaysia Package Tour",
    slug: "9-days-malaysia",
    program_type: "family",
    duration_days: 9,
    duration_nights: 8,
    base_price: 3499,

    original_price: 3999,
    cover_image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&h=800&fit=crop",
    description_ar: "برنامج سياحي شامل في ماليزيا لمدة 9 أيام يتضمن زيارة كوالالمبور ولنكاوي ومنتجع صنوي بيراميد. نرتبه لكم مع الطيران والفنادق والجولات. البرنامج مناسب للعوائل وشهر العسل.",
    description_en: "A comprehensive 9-day Malaysia tour package including visits to Kuala Lumpur, Langkawi, and Sunway Pyramid Resort. Arranged with flights, hotels, and tours. Suitable for families and honeymoons.",
    is_active: true,
    is_featured: true,
    countries: ["ماليزيا"],
    highlights: ["كوالالمبور", "لنكاوي", "منتجع صنوي بيراميد", "جنتنق هايلاند"],
    gallery: [
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=600&fit=crop",
    ],
    includes: [
      "إقامة في فنادق 4-5 نجوم",
      "الإفطار يومياً",
      "استقبال وتوديع من المطار",
      "جولات سياحية بسيارة خاصة مع سائق",
      "متابعة أونلاين على مدار الساعة",
    ],
    excludes: [
      "تذاكر الطيران الدولي",
      "التأشيرة",
      "المصاريف الشخصية",
      "الغداء والعشاء",
    ],
    itinerary: [
      { day: 1, title: "الوصول والاستقبال", description: "استقبال من المطار وتوصيل إلى منتجع صنوي بيراميد للراحة والاستعداد للرحلة" },
      { day: 2, title: "ملاهي صنوي لاجون", description: "يوم حر في ملاهي الصنواي والاستمتاع بالألعاب المائية والكهربائية وحديقة الحيوان" },
      { day: 3, title: "الانتقال إلى لنكاوي", description: "التوصيل إلى مطار كوالالمبور والسفر إلى جزيرة لنكاوي" },
      { day: 4, title: "جولة سياحية في لنكاوي", description: "زيارة مزرعة الفواكه والرياضة المائية وحديقة الحيوانات البرية وميدان النسر" },
      { day: 5, title: "جولة بحرية في لنكاوي", description: "زيارة جزيرة المرأة الحامل ورحلة غابات المانغروف البحرية" },
      { day: 6, title: "العودة إلى كوالالمبور", description: "التوصيل إلى مطار لنكاوي والاستقبال من مطار كوالالمبور الدولي" },
      { day: 7, title: "يوم حر في كوالالمبور", description: "التسوق وزيارة المعالم بشكل حر في العاصمة" },
      { day: 8, title: "جولة سياحية في المدينة", description: "زيارة منارة كوالالمبور وعالم تحت البحار وحديقة الحيوانات وأبراج ماليزيا" },
      { day: 9, title: "المغادرة", description: "التوصيل إلى مطار كوالالمبور الدولي" },
    ],
  },
  {
    name_ar: "برنامج 10 أيام – شهر عسل في ماليزيا",
    name_en: "10 Days Honeymoon in Malaysia",
    slug: "10-days-honeymoon-malaysia",
    program_type: "honeymoon",
    duration_days: 10,
    duration_nights: 9,
    base_price: 4999,

    original_price: 5999,
    cover_image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&h=800&fit=crop",
    description_ar: "برنامج شهر عسل فاخر في ماليزيا لمدة 10 أيام. إقامة في أفخم المنتجعات والفنادق مع جولات رومانسية وتجارب لا تُنسى في كوالالمبور ولنكاوي وبينانج.",
    description_en: "A luxurious 10-day honeymoon package in Malaysia. Stay in premium resorts and hotels with romantic tours and unforgettable experiences in Kuala Lumpur, Langkawi, and Penang.",
    is_active: true,
    is_featured: true,
    countries: ["ماليزيا"],
    highlights: ["كوالالمبور", "لنكاوي", "بينانج", "منتجعات فاخرة", "عشاء رومانسي"],
    gallery: [
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    ],
    includes: [
      "إقامة في منتجعات 5 نجوم",
      "الإفطار يومياً",
      "عشاء رومانسي",
      "استقبال وتوديع VIP",
      "جولات خاصة بسيارة فاخرة",
      "تزيين الغرفة للعروسين",
      "جلسة سبا للزوجين",
      "متابعة أونلاين على مدار الساعة",
    ],
    excludes: [
      "تذاكر الطيران الدولي",
      "التأشيرة",
      "المصاريف الشخصية",
    ],
    itinerary: [
      { day: 1, title: "الوصول والاستقبال VIP", description: "استقبال خاص من المطار وتوصيل إلى المنتجع مع تزيين الغرفة وباقة ورد" },
      { day: 2, title: "جولة رومانسية في كوالالمبور", description: "زيارة أبراج بتروناس وحدائق KLCC وعشاء رومانسي بإطلالة على المدينة" },
      { day: 3, title: "مرتفعات جنتنق هايلاند", description: "رحلة إلى مرتفعات جنتنق بالتلفريك والاستمتاع بالأجواء الباردة" },
      { day: 4, title: "السفر إلى لنكاوي", description: "الانتقال إلى جزيرة لنكاوي الساحرة والإقامة في منتجع شاطئي" },
      { day: 5, title: "جزر لنكاوي", description: "رحلة بحرية خاصة لاستكشاف الجزر مع غداء على الشاطئ" },
      { day: 6, title: "سبا ومساج للزوجين", description: "يوم استرخاء في السبا مع مساج خاص للزوجين وأمسية رومانسية" },
      { day: 7, title: "السفر إلى بينانج", description: "الانتقال إلى جزيرة بينانج واستكشاف المدينة القديمة" },
      { day: 8, title: "جولة في جورج تاون", description: "زيارة معالم جورج تاون التاريخية وفن الشارع وتذوق الأطعمة المحلية" },
      { day: 9, title: "العودة إلى كوالالمبور", description: "التسوق في أشهر مراكز التسوق وشراء الهدايا التذكارية" },
      { day: 10, title: "المغادرة", description: "التوصيل إلى مطار كوالالمبور مع توديع خاص" },
    ],
  },
  {
    name_ar: "برنامج 13 يوم – عائلي في ماليزيا",
    name_en: "13 Days Family Tour in Malaysia",
    slug: "13-days-family-malaysia",
    program_type: "family",
    duration_days: 13,
    duration_nights: 12,
    base_price: 5999,

    original_price: 6999,
    cover_image: "https://images.unsplash.com/photo-1570789210967-2cac24home7d?w=1200&h=800&fit=crop",
    description_ar: "برنامج عائلي شامل في ماليزيا لمدة 13 يوم يتضمن زيارة أجمل المدن والجزر الماليزية. مناسب للعائلات مع أطفال مع أنشطة ترفيهية متنوعة.",
    description_en: "A comprehensive 13-day family tour in Malaysia covering the most beautiful cities and islands. Perfect for families with children with diverse entertainment activities.",
    is_active: true,
    is_featured: false,
    countries: ["ماليزيا"],
    highlights: ["كوالالمبور", "لنكاوي", "بينانج", "صنوي لاجون", "جنتنق هايلاند", "ليغولاند"],
    gallery: [
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=600&fit=crop",
    ],
    includes: [
      "إقامة في فنادق 4 نجوم",
      "الإفطار يومياً",
      "استقبال وتوديع",
      "جولات بسيارة خاصة مع سائق",
      "طيران داخلي",
      "دخوليات المعالم السياحية",
      "متابعة أونلاين على مدار الساعة",
    ],
    excludes: [
      "تذاكر الطيران الدولي",
      "التأشيرة",
      "المصاريف الشخصية",
      "الغداء والعشاء",
    ],
    itinerary: [
      { day: 1, title: "الوصول إلى كوالالمبور", description: "الاستقبال من المطار والتوصيل إلى الفندق للراحة" },
      { day: 2, title: "صنوي لاجون", description: "يوم كامل في منتزه صنوي لاجون المائي والترفيهي" },
      { day: 3, title: "جنتنق هايلاند", description: "رحلة بالتلفريك إلى مرتفعات جنتنق والاستمتاع بالملاهي" },
      { day: 4, title: "جولة في المدينة", description: "زيارة أبراج بتروناس ومنارة كوالالمبور وحديقة الطيور" },
      { day: 5, title: "عالم تحت البحار", description: "زيارة عالم تحت البحار وحديقة الحيوانات الوطنية" },
      { day: 6, title: "السفر إلى لنكاوي", description: "الانتقال بالطيران الداخلي إلى جزيرة لنكاوي" },
      { day: 7, title: "جولة لنكاوي", description: "زيارة مزرعة الفواكه وميدان النسر والتلفريك" },
      { day: 8, title: "رحلة بحرية", description: "جولة بحرية إلى الجزر المجاورة والرياضات المائية" },
      { day: 9, title: "يوم حر في لنكاوي", description: "يوم حر للاسترخاء والتسوق في لنكاوي" },
      { day: 10, title: "السفر إلى بينانج", description: "الانتقال إلى جزيرة بينانج" },
      { day: 11, title: "جولة في بينانج", description: "زيارة جورج تاون والمعابد وحديقة التوابل" },
      { day: 12, title: "العودة إلى كوالالمبور", description: "التسوق في بافيليون مول وسنتر بوينت" },
      { day: 13, title: "المغادرة", description: "التوصيل إلى مطار كوالالمبور الدولي" },
    ],
  },
  {
    name_ar: "برنامج 10 أيام في تايلاند",
    name_en: "10 Days Thailand Package Tour",
    slug: "10-days-thailand",
    program_type: "family",
    duration_days: 10,
    duration_nights: 9,
    base_price: 3999,

    original_price: 4599,
    cover_image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&h=800&fit=crop",
    description_ar: "برنامج سياحي متكامل في تايلاند لمدة 10 أيام يشمل بوكيت وكرابي وبانكوك. نرتبه لكم مع الطيران والفنادق والجولات. البرنامج مناسب للعوائل وشهر العسل.",
    description_en: "A comprehensive 10-day Thailand tour package including Phuket, Krabi, and Bangkok. Arranged with flights, hotels, and tours. Suitable for families and honeymoons.",
    is_active: true,
    is_featured: true,
    countries: ["تايلاند"],
    highlights: ["بوكيت", "كرابي", "بانكوك", "جزيرة جيمس بوند", "خليج بان ناه"],
    gallery: [
      "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&h=600&fit=crop",
    ],
    includes: [
      "إقامة في فنادق 4 نجوم",
      "الإفطار يومياً",
      "طيران داخلي",
      "استقبال وتوديع",
      "جولات سياحية",
      "دخوليات الأماكن السياحية",
      "متابعة أونلاين على مدار الساعة",
    ],
    excludes: [
      "تذاكر الطيران الدولي",
      "التأشيرة",
      "المصاريف الشخصية",
      "الغداء والعشاء",
    ],
    itinerary: [
      { day: 1, title: "الوصول إلى بوكيت", description: "الاستقبال من مطار بوكيت الدولي والتوصيل إلى الفندق للراحة" },
      { day: 2, title: "جولة بوكيت السياحية", description: "زيارة خليج بان ناه وشلال بانغ باي وفنتازيا بوكيت والحديقة المائية ومملكة النمور" },
      { day: 3, title: "جزيرة جيمس بوند", description: "جولة بقارب سريع إلى جزيرة جيمس بوند الشهيرة والجزر المحيطة" },
      { day: 4, title: "استكشاف بوكيت", description: "زيارة بوكيت أكواريوم وحديقة حيوان بوكيت والبلدة القديمة" },
      { day: 5, title: "الانتقال إلى كرابي", description: "التوصيل إلى كرابي والإقامة في منتجع شاطئي" },
      { day: 6, title: "جولة كرابي السياحية", description: "جولة من العاشرة صباحاً حتى السادسة مساءً لزيارة أهم المعالم والحدائق" },
      { day: 7, title: "الانتقال إلى بانكوك", description: "السفر إلى بانكوك والإقامة في فندق وسط المدينة" },
      { day: 8, title: "جولة التسوق في بانكوك", description: "سوق دامنون العائم وسنترال وورلد وسيام باراجون وMBK وسوق شاتوشاك وتشينا تاون" },
      { day: 9, title: "يوم حر في بانكوك", description: "يوم حر للتسوق وزيارة المعابد والمعالم التاريخية" },
      { day: 10, title: "المغادرة", description: "التوصيل إلى مطار بانكوك الدولي" },
    ],
  },
  {
    name_ar: "برنامج 9 أيام في أذربيجان",
    name_en: "9 Days Azerbaijan Package Tour",
    slug: "9-days-azerbaijan",
    program_type: "adventure",
    duration_days: 9,
    duration_nights: 8,
    base_price: 3299,

    original_price: 3899,
    cover_image: "https://images.unsplash.com/photo-1603437873662-15950e0b2a42?w=1200&h=800&fit=crop",
    description_ar: "برنامج سياحي مميز في أذربيجان لمدة 9 أيام. استكشف باكو العاصمة الساحرة وغابالا ذات الطبيعة الخلابة وشيكي التاريخية.",
    description_en: "A distinctive 9-day tour program in Azerbaijan. Explore the charming capital Baku, the stunning nature of Gabala, and historic Sheki.",
    is_active: true,
    is_featured: false,
    countries: ["أذربيجان"],
    highlights: ["باكو", "غابالا", "شيكي", "البلدة القديمة", "بحر قزوين"],
    gallery: [
      "https://images.unsplash.com/photo-1603437873662-15950e0b2a42?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&h=600&fit=crop",
    ],
    includes: [
      "إقامة في فنادق 4 نجوم",
      "الإفطار يومياً",
      "استقبال وتوديع",
      "جولات بسيارة خاصة مع سائق",
      "دخوليات المعالم السياحية",
      "متابعة أونلاين على مدار الساعة",
    ],
    excludes: [
      "تذاكر الطيران الدولي",
      "التأشيرة",
      "المصاريف الشخصية",
      "الغداء والعشاء",
    ],
    itinerary: [
      { day: 1, title: "الوصول إلى باكو", description: "الاستقبال من المطار والتوصيل إلى الفندق" },
      { day: 2, title: "جولة البلدة القديمة", description: "زيارة البلدة القديمة وبرج العذراء وقصر الشروانشاهيين" },
      { day: 3, title: "باكو الحديثة", description: "زيارة مركز حيدر علييف وأبراج اللهب وكورنيش بحر قزوين" },
      { day: 4, title: "الانتقال إلى غابالا", description: "رحلة برية إلى غابالا والاستمتاع بمناظر الطبيعة" },
      { day: 5, title: "مغامرات غابالا", description: "تلفريك غابالا وشلالات الأفوج وبحيرة نوهور" },
      { day: 6, title: "شيكي التاريخية", description: "زيارة مدينة شيكي وقصر خان ومصنع الحرير" },
      { day: 7, title: "العودة إلى باكو", description: "العودة إلى باكو مع التوقف في المعالم على الطريق" },
      { day: 8, title: "تسوق وترفيه", description: "التسوق في مراكز باكو التجارية وزيارة المعالم المتبقية" },
      { day: 9, title: "المغادرة", description: "التوصيل إلى مطار حيدر علييف الدولي" },
    ],
  },
  {
    name_ar: "برنامج 5 أيام في الشمال التركي",
    name_en: "5 Days North Turkey Package Tour",
    slug: "5-days-north-turkey",
    program_type: "adventure",
    duration_days: 5,
    duration_nights: 4,
    base_price: 1999,

    original_price: 2499,
    cover_image: "https://images.unsplash.com/photo-1589561454226-796a8aa89b05?w=1200&h=800&fit=crop",
    description_ar: "برنامج سياحي مختصر في الشمال التركي لمدة 5 أيام. استكشف طرابزون والمناظر الطبيعية الخلابة في أوزنجول وحيدرنهبي.",
    description_en: "A compact 5-day North Turkey tour. Explore Trabzon and the stunning natural landscapes of Uzungol and Hıdırnebi.",
    is_active: true,
    is_featured: false,
    countries: ["تركيا"],
    highlights: ["طرابزون", "أوزنجول", "حيدرنهبي", "دير سوميلا"],
    gallery: [
      "https://images.unsplash.com/photo-1589561454226-796a8aa89b05?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=600&fit=crop",
    ],
    includes: [
      "إقامة في فنادق 4 نجوم",
      "الإفطار يومياً",
      "استقبال وتوديع",
      "جولات بسيارة خاصة مع سائق",
      "متابعة أونلاين على مدار الساعة",
    ],
    excludes: [
      "تذاكر الطيران الدولي",
      "المصاريف الشخصية",
      "الغداء والعشاء",
    ],
    itinerary: [
      { day: 1, title: "الوصول إلى طرابزون", description: "الاستقبال من المطار والتوصيل إلى الفندق" },
      { day: 2, title: "أوزنجول", description: "رحلة إلى بحيرة أوزنجول الشهيرة والتمتع بالطبيعة الخلابة" },
      { day: 3, title: "حيدرنهبي ودير سوميلا", description: "زيارة مرتفعات حيدرنهبي ودير سوميلا التاريخي" },
      { day: 4, title: "جولة في طرابزون", description: "زيارة معالم المدينة والأسواق المحلية والبازار" },
      { day: 5, title: "المغادرة", description: "التوصيل إلى مطار طرابزون" },
    ],
  },
  {
    name_ar: "برنامج 10 أيام في الشمال التركي",
    name_en: "10 Days North Turkey Package Tour",
    slug: "10-days-north-turkey",
    program_type: "family",
    duration_days: 10,
    duration_nights: 9,
    base_price: 3499,

    original_price: 3999,
    cover_image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&h=800&fit=crop",
    description_ar: "برنامج سياحي شامل في الشمال التركي لمدة 10 أيام. استكشف طرابزون وأوزنجول وأيدر وريزا وبورصة مع أجمل المناظر الطبيعية في تركيا.",
    description_en: "A comprehensive 10-day North Turkey tour. Explore Trabzon, Uzungol, Ayder, Rize, and Bursa with Turkey's most beautiful natural scenery.",
    is_active: true,
    is_featured: true,
    countries: ["تركيا"],
    highlights: ["طرابزون", "أوزنجول", "أيدر", "ريزا", "بورصة", "أولوداغ"],
    gallery: [
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1589561454226-796a8aa89b05?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&h=600&fit=crop",
    ],
    includes: [
      "إقامة في فنادق 4 نجوم",
      "الإفطار يومياً",
      "استقبال وتوديع",
      "جولات بسيارة خاصة مع سائق",
      "طيران داخلي",
      "دخوليات المعالم السياحية",
      "متابعة أونلاين على مدار الساعة",
    ],
    excludes: [
      "تذاكر الطيران الدولي",
      "المصاريف الشخصية",
      "الغداء والعشاء",
    ],
    itinerary: [
      { day: 1, title: "الوصول إلى طرابزون", description: "الاستقبال من المطار والتوصيل إلى الفندق" },
      { day: 2, title: "أوزنجول", description: "رحلة إلى بحيرة أوزنجول والتمتع بالطبيعة والأكواخ" },
      { day: 3, title: "مرتفعات حيدرنهبي", description: "زيارة مرتفعات حيدرنهبي ودير سوميلا التاريخي" },
      { day: 4, title: "أيدر", description: "رحلة إلى هضبة أيدر والشلالات الطبيعية والحمامات الحرارية" },
      { day: 5, title: "ريزا", description: "زيارة مدينة ريزا ومزارع الشاي والمناظر الخلابة" },
      { day: 6, title: "جولة في طرابزون", description: "زيارة معالم المدينة وقلعة طرابزون ومتحف آيا صوفيا" },
      { day: 7, title: "يوم حر", description: "يوم حر للتسوق والاسترخاء" },
      { day: 8, title: "الانتقال إلى بورصة", description: "السفر إلى بورصة - المدينة الخضراء" },
      { day: 9, title: "جبل أولوداغ", description: "رحلة بالتلفريك إلى جبل أولوداغ والجامع الأخضر والأسواق" },
      { day: 10, title: "المغادرة", description: "التوصيل إلى المطار" },
    ],
  },
  {
    name_ar: "برنامج ماليزيا وسنغافورة 12 يوم",
    name_en: "Malaysia & Singapore 12 Days Tour",
    slug: "12-days-malaysia-singapore",
    program_type: "luxury",
    duration_days: 12,
    duration_nights: 11,
    base_price: 6499,

    original_price: 7499,
    cover_image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=800&fit=crop",
    description_ar: "برنامج سياحي فاخر متعدد الدول يجمع بين ماليزيا وسنغافورة لمدة 12 يوم. استمتع بأفضل ما في البلدين من معالم وتجارب فريدة.",
    description_en: "A luxury multi-country tour combining Malaysia and Singapore for 12 days. Enjoy the best of both countries with unique landmarks and experiences.",
    is_active: true,
    is_featured: true,
    countries: ["ماليزيا", "سنغافورة"],
    highlights: ["كوالالمبور", "لنكاوي", "سنغافورة", "مارينا باي", "جزيرة سنتوسا", "يونيفرسال ستوديو"],
    gallery: [
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop",
    ],
    includes: [
      "إقامة في فنادق 5 نجوم",
      "الإفطار يومياً",
      "استقبال وتوديع VIP",
      "جولات خاصة مع مرشد",
      "طيران داخلي",
      "تذاكر يونيفرسال ستوديو",
      "عشاء في مارينا باي",
      "متابعة أونلاين على مدار الساعة",
    ],
    excludes: [
      "تذاكر الطيران الدولي",
      "التأشيرة",
      "المصاريف الشخصية",
    ],
    itinerary: [
      { day: 1, title: "الوصول إلى كوالالمبور", description: "الاستقبال VIP والتوصيل إلى الفندق" },
      { day: 2, title: "أبراج بتروناس والمدينة", description: "جولة في أهم معالم كوالالمبور وأبراج بتروناس" },
      { day: 3, title: "جنتنق هايلاند", description: "رحلة إلى مرتفعات جنتنق بالتلفريك" },
      { day: 4, title: "صنوي لاجون", description: "يوم ترفيهي في منتزه صنوي لاجون المائي" },
      { day: 5, title: "السفر إلى لنكاوي", description: "الانتقال إلى جزيرة لنكاوي" },
      { day: 6, title: "جولة لنكاوي", description: "استكشاف الجزيرة وتلفريك لنكاوي والشواطئ" },
      { day: 7, title: "رحلة بحرية", description: "رحلة بحرية إلى الجزر والمانغروف" },
      { day: 8, title: "السفر إلى سنغافورة", description: "الانتقال إلى سنغافورة والتعرف على المدينة" },
      { day: 9, title: "مارينا باي وحدائق الخليج", description: "زيارة مارينا باي ساندز وحدائق الخليج وعشاء فاخر" },
      { day: 10, title: "جزيرة سنتوسا", description: "يوم كامل في يونيفرسال ستوديو وأكواريوم" },
      { day: 11, title: "تسوق في أورتشارد رود", description: "التسوق في أشهر شوارع سنغافورة" },
      { day: 12, title: "المغادرة", description: "التوصيل إلى مطار تشانغي" },
    ],
  },
];

export async function seedPrograms() {
  console.log("🚀 بدء إضافة البرامج السياحية...");
  
  // Get current authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("❌ يجب تسجيل الدخول أولاً كمسؤول");
    return [{ name: "Auth Error", success: false, error: "يجب تسجيل الدخول أولاً كمسؤول" }];
  }
  
  const results = [];
  
  for (const program of programsData) {
    try {
      const { data, error } = await supabase
        .from("programs")
        .insert({ ...program, created_by: user.id } as any)
        .select()
        .single();

      if (error) {
        console.error(`❌ فشل إضافة: ${program.name_ar}`, error.message);
        results.push({ name: program.name_ar, success: false, error: error.message });
      } else {
        console.log(`✅ تم إضافة: ${program.name_ar}`);
        results.push({ name: program.name_ar, success: true, id: data.id });
      }
    } catch (err) {
      console.error(`❌ خطأ: ${program.name_ar}`, err);
      results.push({ name: program.name_ar, success: false, error: String(err) });
    }
  }
  
  console.log("\n📊 النتائج:");
  console.log(`✅ نجح: ${results.filter(r => r.success).length}`);
  console.log(`❌ فشل: ${results.filter(r => !r.success).length}`);
  
  return results;
}
