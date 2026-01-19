// بيانات دول جنوب شرق آسيا والمدن السياحية

export interface City {
  id: string;
  nameAr: string;
  nameEn: string;
  description: string;
  image: string;
  attractions: string[];
  bestTime: string;
  coordinates: { lat: number; lng: number };
  highlights: string[];
  averageTemp: string | { summer: string; winter: string };
  accommodation: string;
}

export interface Country {
  id: string;
  nameAr: string;
  nameEn: string;
  description: string;
  coverImage: string;
  coordinates: { lat: number; lng: number };
  cities: City[];
  currency: string;
  language: string;
  visa: string;
  bestSeason: string;
  tripDuration: string;
  highlights: string[];
  climate: string;
  budget: string;
}

export const southeastAsiaCountries: Country[] = [
  {
    id: "thailand",
    nameAr: "تايلاند",
    nameEn: "Thailand",
    description: "أرض الابتسامات - جنة سياحية تجمع بين الشواطئ الخلابة والمعابد التاريخية والثقافة الغنية",
    coverImage: "https://images.unsplash.com/photo-1528181304800-259b08848526",
    coordinates: { lat: 13.7563, lng: 100.5018 },
    currency: "باht التايلاندي (THB)",
    language: "التايلاندية",
    visa: "فيزا عند الوصول - 30 يوم",
    bestSeason: "نوفمبر - أبريل",
    tripDuration: "7-14 يوم",
    climate: "استوائي حار رطب",
    budget: "متوسط - 150-300 دولار يومياً",
    highlights: [
      "شواطئ بوكيت الساحرة",
      "المعابد البوذية التاريخية",
      "الأسواق العائمة",
      "المساج التايلاندي التقليدي",
      "الطعام التايلاندي الشهير"
    ],
    cities: [
      {
        id: "bangkok",
        nameAr: "بانكوك",
        nameEn: "Bangkok",
        description: "العاصمة النابضة بالحياة - مزيج رائع من التقاليد والحداثة",
        image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed",
        coordinates: { lat: 13.7563, lng: 100.5018 },
        bestTime: "نوفمبر - فبراير",
        averageTemp: "28-33°C",
        accommodation: "فنادق 4-5 نجوم من 80-200 دولار",
        attractions: [
          "القصر الكبير والمعبد الزمردي",
          "معبد وات آرون (معبد الفجر)",
          "السوق العائم دامنوين سادواك",
          "مركز سيام للتسوق العملاق",
          "شارع خاو سان النابض بالحياة",
          "سوق تشاتوتشاك نهاية الأسبوع",
          "منطقة أسياتيك الترفيهية",
          "برج بايوك سكاي الشاهق"
        ],
        highlights: [
          "القصر الملكي الكبير ومعبد الزمرد",
          "جولات القوارب في نهر تشاو فرايا",
          "الأسواق الليلية المتنوعة",
          "المطاعم العالمية والمحلية",
          "المعابد البوذية التاريخية",
          "التسوق في المولات الضخمة"
        ]
      },
      {
        id: "phuket",
        nameAr: "بوكيت",
        nameEn: "Phuket",
        description: "لؤلؤة الجنوب - أجمل جزيرة تايلاندية بشواطئها الذهبية",
        image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5",
        coordinates: { lat: 7.8804, lng: 98.3923 },
        bestTime: "نوفمبر - أبريل",
        averageTemp: "27-32°C",
        accommodation: "منتجعات شاطئية 100-400 دولار",
        attractions: [
          "شاطئ باتونج الشهير",
          "جزر في في الساحرة",
          "معبد بوذا الكبير",
          "شارع بانجلا للترفيه والحياة الليلية",
          "خليج فانج نجا وجزيرة جيمس بوند",
          "شاطئ كارون الهادئ",
          "منطقة أولد تاون التاريخية",
          "منتزه سيريناث البحري"
        ],
        highlights: [
          "الشواطئ الاستوائية الخلابة",
          "الغوص والسنوركلينج في مياه صافية",
          "جولات الجزر اليومية",
          "الحياة الليلية المميزة",
          "المأكولات البحرية الطازجة",
          "الرياضات المائية المتنوعة"
        ]
      },
      {
        id: "chiangmai",
        nameAr: "شيانغ ماي",
        nameEn: "Chiang Mai",
        description: "وردة الشمال - مدينة المعابد والطبيعة الساحرة",
        image: "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648",
        coordinates: { lat: 18.7883, lng: 98.9853 },
        bestTime: "نوفمبر - فبراير",
        averageTemp: "25-30°C",
        accommodation: "فنادق بوتيك 60-150 دولار",
        attractions: [
          "معبد دوي سوثيب الذهبي",
          "السوق الليلي الشهير",
          "محمية الفيلة الأخلاقية",
          "المدينة القديمة والأسوار",
          "شلالات دوي انتانون",
          "قرية الحرفيين بورسانج",
          "متحف الفنون والثقافة",
          "حديقة الزهور الملكية"
        ],
        highlights: [
          "أكثر من 300 معبد بوذي",
          "تجربة العناية بالفيلة",
          "الطبيعة الجبلية الخلابة",
          "المهرجانات الثقافية التقليدية",
          "الأسواق الليلية المميزة",
          "دروس الطبخ التايلاندي"
        ]
      },
      {
        id: "pattaya",
        nameAr: "باتايا",
        nameEn: "Pattaya",
        description: "مدينة الترفيه - منتجع ساحلي قريب من بانكوك",
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a",
        coordinates: { lat: 12.9236, lng: 100.8825 },
        bestTime: "نوفمبر - فبراير",
        averageTemp: "27-32°C",
        accommodation: "فنادق شاطئية 70-180 دولار",
        attractions: [
          "شاطئ باتايا الشهير",
          "حديقة نونج نوش الاستوائية",
          "معبد الحقيقة الخشبي",
          "جزيرة كوه لان القريبة",
          "شارع ووكينج ستريت",
          "ملاهي كارتون نتورك",
          "عروض التايجر زو",
          "حديقة الفراشات"
        ],
        highlights: [
          "قرب من بانكوك (ساعتين)",
          "الشواطئ المناسبة للعائلات",
          "الرياضات المائية المتنوعة",
          "الحدائق الاستوائية الجميلة",
          "الترفيه الليلي المتنوع",
          "التسوق الرخيص"
        ]
      }
    ]
  },
  {
    id: "malaysia",
    nameAr: "ماليزيا",
    nameEn: "Malaysia",
    description: "ماليزيا الحقيقية - تنوع ثقافي وطبيعة خلابة وتطور حضاري",
    coverImage: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07",
    coordinates: { lat: 3.139, lng: 101.6869 },
    currency: "رينجت ماليزي (MYR)",
    language: "الماليزية والإنجليزية",
    visa: "مجانية - 90 يوم",
    bestSeason: "طوال العام",
    tripDuration: "7-10 أيام",
    climate: "استوائي حار رطب طوال العام",
    budget: "اقتصادي - 100-250 دولار يومياً",
    highlights: [
      "أبراج بتروناس التوأم الشهيرة",
      "جزيرة لنكاوي الساحرة",
      "مرتفعات كاميرون الخضراء",
      "التنوع الثقافي الفريد",
      "المطبخ الماليزي المميز"
    ],
    cities: [
      {
        id: "kualalumpur",
        nameAr: "كوالالمبور",
        nameEn: "Kuala Lumpur",
        description: "العاصمة الحديثة - مدينة الأبراج والتسوق الفاخر",
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07",
        coordinates: { lat: 3.139, lng: 101.6869 },
        bestTime: "مايو - يوليو، ديسمبر - فبراير",
        averageTemp: "27-33°C",
        accommodation: "فنادق 4-5 نجوم 80-200 دولار",
        attractions: [
          "أبراج بتروناس التوأم الشهيرة",
          "برج كوالالمبور (KL Tower)",
          "شارع العرب (بوكيت بينتانج)",
          "حدائق بحيرة تيتيوانجسا",
          "كهوف باتو الشهيرة",
          "مول بافيليون",
          "السوق المركزي",
          "المتحف الإسلامي"
        ],
        highlights: [
          "رمز ماليزيا - أبراج بتروناس",
          "مراكز التسوق العملاقة",
          "المطاعم العربية المتنوعة",
          "السياحة العلاجية المتقدمة",
          "الحدائق والمتنزهات الجميلة",
          "وسائل النقل الحديثة"
        ]
      },
      {
        id: "langkawi",
        nameAr: "لنكاوي",
        nameEn: "Langkawi",
        description: "جزيرة الأساطير - 99 جزيرة من الجمال الاستوائي",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
        coordinates: { lat: 6.3500, lng: 99.8000 },
        bestTime: "نوفمبر - أبريل",
        averageTemp: "26-32°C",
        accommodation: "منتجعات فاخرة 100-350 دولار",
        attractions: [
          "التلفريك والجسر المعلق الشهير",
          "شلالات الآبار السبعة",
          "جزيرة العذراء الحامل",
          "معرض لنكاوي للفنون ثلاثي الأبعاد",
          "شاطئ سينانج الجميل",
          "قرية الشرقية",
          "حديقة التماسيح",
          "متحف تحت الماء"
        ],
        highlights: [
          "الجسر السماوي المعلق",
          "الشواطئ الهادئة والنظيفة",
          "التسوق المعفي من الضرائب",
          "الطبيعة البكر والغابات",
          "المنتجعات الفاخرة",
          "جولات القوارب والجزر"
        ]
      },
      {
        id: "penang",
        nameAr: "بينانج",
        nameEn: "Penang",
        description: "لؤلؤة الشرق - تراث عالمي ومأكولات شهية",
        image: "https://images.unsplash.com/photo-1545051330-89f5be9a9150",
        coordinates: { lat: 5.4141, lng: 100.3288 },
        bestTime: "ديسمبر - مارس",
        averageTemp: "26-32°C",
        accommodation: "فنادق تراثية 60-150 دولار",
        attractions: [
          "جورج تاون التاريخية",
          "معبد كيك لوك سي الضخم",
          "تل بينانج (Penang Hill)",
          "شاطئ باتو فرنجي",
          "المتحف الثلاثي الأبعاد",
          "حديقة التوابل الاستوائية",
          "قصر تشيونج فات تزي",
          "سوق الليل جورجتاون"
        ],
        highlights: [
          "التراث العالمي لليونسكو",
          "فن الشارع الشهير عالمياً",
          "الطعام الماليزي الأصيل",
          "المعابد التاريخية المتنوعة",
          "الأسواق الليلية النابضة",
          "المباني الاستعمارية"
        ]
      },
      {
        id: "genting",
        nameAr: "جنتنج هايلاندز",
        nameEn: "Genting Highlands",
        description: "مدينة الترفيه - منتجع جبلي مع ملاهي ومنتجعات فاخرة",
        image: "https://images.unsplash.com/photo-1580837119756-563d608dd119",
        coordinates: { lat: 3.4235, lng: 101.7935 },
        bestTime: "طوال العام",
        averageTemp: "15-25°C",
        accommodation: "منتجعات فاخرة 120-300 دولار",
        attractions: [
          "مدينة ملاهي جنتنج سكاي ورلدز",
          "التلفريك الأطول في جنوب شرق آسيا",
          "منتجع جنتنج الفاخر",
          "مراكز التسوق الضخمة",
          "ملاهي سكاي أفينيو",
          "معبد تشين سوي",
          "حديقة الفراشات",
          "متحف الشمع"
        ],
        highlights: [
          "الطقس البارد على مدار العام",
          "مدينة الألعاب الضخمة",
          "الكازينو الوحيد في ماليزيا",
          "المطاعم العالمية المتنوعة",
          "الفنادق الفخمة",
          "قرب من كوالالمبور (ساعة)"
        ]
      }
    ]
  },
  {
    id: "indonesia",
    nameAr: "إندونيسيا",
    nameEn: "Indonesia",
    description: "أرخبيل الجمال - 17,000 جزيرة من الطبيعة الساحرة والثقافة الغنية",
    coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    coordinates: { lat: -8.3405, lng: 115.0920 },
    currency: "روبية إندونيسية (IDR)",
    language: "الإندونيسية",
    visa: "فيزا عند الوصول - 30 يوم",
    bestSeason: "أبريل - أكتوبر",
    tripDuration: "7-14 يوم",
    climate: "استوائي حار رطب",
    budget: "اقتصادي جداً - 80-200 دولار يومياً",
    highlights: [
      "جزيرة بالي الساحرة",
      "المعابد الهندوسية الفريدة",
      "حقول الأرز الخضراء",
      "البراكين النشطة",
      "الثقافة الإندونيسية الأصيلة"
    ],
    cities: [
      {
        id: "bali",
        nameAr: "بالي",
        nameEn: "Bali",
        description: "جزيرة الآلهة - جنة استوائية بشواطئ ومعابد خلابة",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
        coordinates: { lat: -8.3405, lng: 115.0920 },
        bestTime: "أبريل - أكتوبر",
        averageTemp: "26-31°C",
        accommodation: "فلل وفنادق 60-250 دولار",
        attractions: [
          "معبد تاناه لوت على البحر",
          "حقول أرز تيجالالانج الخضراء",
          "شاطئ سيمينياك العصري",
          "غابة القردة المقدسة في أوبود",
          "بوابة لمبونجان الشهيرة",
          "شلالات تيجينونجان",
          "معبد أولوواتو",
          "جبل باتور البركاني"
        ],
        highlights: [
          "الشواطئ الذهبية الساحرة",
          "المعابد الهندوسية التاريخية",
          "حقول الأرز الخضراء الممتدة",
          "اليوغا والسبا العالمية",
          "الثقافة البالينيزية الفريدة",
          "الفلل الخاصة الفاخرة"
        ]
      },
      {
        id: "jakarta",
        nameAr: "جاكرتا",
        nameEn: "Jakarta",
        description: "العاصمة الضخمة - مركز التجارة والثقافة الإندونيسية",
        image: "https://images.unsplash.com/photo-1555899434-94d1eb5c80a1",
        coordinates: { lat: -6.2088, lng: 106.8456 },
        bestTime: "يونيو - سبتمبر",
        averageTemp: "26-32°C",
        accommodation: "فنادق أعمال 70-180 دولار",
        attractions: [
          "النصب الوطني موناس",
          "المدينة القديمة (كوتا)",
          "مسجد الاستقلال الضخم",
          "أنكول دريم لاند",
          "جزر سيريبو القريبة",
          "المتحف الوطني",
          "مول جراند إندونيسيا",
          "سوق تاناه أبانج"
        ],
        highlights: [
          "التسوق العصري في المولات",
          "المطاعم المتنوعة عالمياً",
          "الحياة الليلية النابضة",
          "المتاحف التاريخية الغنية",
          "مراكز الأعمال الحديثة",
          "سهولة الوصول الدولي"
        ]
      },
      {
        id: "yogyakarta",
        nameAr: "جوجاكارتا",
        nameEn: "Yogyakarta",
        description: "قلب الثقافة الجاوية - معابد بوروبودور الشهيرة",
        image: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5",
        coordinates: { lat: -7.7956, lng: 110.3695 },
        bestTime: "مايو - سبتمبر",
        averageTemp: "24-31°C",
        accommodation: "فنادق تقليدية 40-120 دولار",
        attractions: [
          "معبد بوروبودور (أحد عجائب الدنيا)",
          "معبد برامبانان الهندوسي",
          "قصر السلطان (كراتون)",
          "شارع ماليوبورو التجاري",
          "شاطئ باراتريتيس",
          "كهف جومبلانج",
          "قرية كاليوارانج الفنية",
          "بركان ميرابي النشط"
        ],
        highlights: [
          "معابد اليونسكو العالمية",
          "الفنون التقليدية الجاوية",
          "الباتيك اليدوي الأصيل",
          "البراكين النشطة القريبة",
          "الطعام الجاوي التقليدي",
          "الثقافة الملكية العريقة"
        ]
      }
    ]
  },
  {
    id: "vietnam",
    nameAr: "فيتنام",
    nameEn: "Vietnam",
    description: "جوهرة آسيا - تاريخ عريق وطبيعة ساحرة ومأكولات شهية",
    coverImage: "https://images.unsplash.com/photo-1528127269322-539801943592",
    coordinates: { lat: 21.0285, lng: 105.8542 },
    currency: "دونج فيتنامي (VND)",
    language: "الفيتنامية",
    visa: "فيزا إلكترونية - 30 يوم",
    bestSeason: "فبراير - أبريل، أغسطس - أكتوبر",
    tripDuration: "10-14 يوم",
    climate: "متنوع - شمالي معتدل وجنوبي استوائي",
    budget: "رخيص جداً - 50-150 دولار يومياً",
    highlights: [
      "خليج ها لونج الشهير عالمياً",
      "المدن التاريخية العريقة",
      "القهوة الفيتنامية الأصيلة",
      "الأطعمة الشهية المتنوعة",
      "الأسعار المعقولة جداً"
    ],
    cities: [
      {
        id: "hanoi",
        nameAr: "هانوي",
        nameEn: "Hanoi",
        description: "العاصمة العريقة - مزيج من التراث الفيتنامي والاستعمار الفرنسي",
        image: "https://images.unsplash.com/photo-1528127269322-539801943592",
        coordinates: { lat: 21.0285, lng: 105.8542 },
        bestTime: "أكتوبر - أبريل",
        averageTemp: "17-29°C",
        accommodation: "فنادق تراثية 50-130 دولار",
        attractions: [
          "بحيرة هوان كييم (البحيرة الصاعدة)",
          "الحي القديم التاريخي (Old Quarter)",
          "معبد الأدب التاريخي",
          "ضريح هو تشي منه",
          "مسرح الدمى المائي الشهير",
          "سجن هوا لو",
          "معبد نغوك سون",
          "القطار الشارع"
        ],
        highlights: [
          "الشوارع القديمة الأصيلة",
          "القهوة الفيتنامية الأفضل",
          "الطعام الشهي والرخيص",
          "الثقافة العريقة المحفوظة",
          "الأسواق التقليدية النابضة",
          "العمارة الفرنسية الجميلة"
        ]
      },
      {
        id: "hochiminh",
        nameAr: "هوشي منه (سايغون)",
        nameEn: "Ho Chi Minh City",
        description: "سايغون السابقة - المركز الاقتصادي النابض بالحياة",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
        coordinates: { lat: 10.8231, lng: 106.6297 },
        bestTime: "ديسمبر - أبريل",
        averageTemp: "26-34°C",
        accommodation: "فنادق عصرية 60-150 دولار",
        attractions: [
          "كاتدرائية نوتردام الشهيرة",
          "قصر الاستقلال التاريخي",
          "أنفاق كو تشي",
          "سوق بن ثانه المركزي",
          "شارع بوي فين للتسوق",
          "متحف الحرب",
          "مسجد سايغون المركزي",
          "برج بيتكسكو المالي"
        ],
        highlights: [
          "الحياة العصرية النابضة",
          "التاريخ الحديث الغني",
          "الأسواق الليلية الشهيرة",
          "المطاعم المتنوعة عالمياً",
          "التسوق الرخيص جداً",
          "سهولة التنقل"
        ]
      },
      {
        id: "danang",
        nameAr: "دا نانغ",
        nameEn: "Da Nang",
        description: "لؤلؤة الوسط - شواطئ رملية وجسور معمارية مذهلة",
        image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b",
        coordinates: { lat: 16.0544, lng: 108.2022 },
        bestTime: "فبراير - مايو",
        averageTemp: "24-30°C",
        accommodation: "منتجعات شاطئية 70-200 دولار",
        attractions: [
          "جسر التنين الناري الشهير",
          "شاطئ ميكي الجميل",
          "جبال الرخام الخمسة",
          "منتزه باناهيلز والجسر الذهبي",
          "مدينة هوي أن القديمة القريبة",
          "شبه جزيرة سون ترا",
          "متحف شام الأثري",
          "معبد ليه فونج"
        ],
        highlights: [
          "الشواطئ الجميلة والنظيفة",
          "الجسور الحديثة المضيئة",
          "باناهيلز والجسر الذهبي الشهير",
          "قرب من هوي أن التراثية",
          "المأكولات البحرية الطازجة",
          "المدينة الحديثة المنظمة"
        ]
      },
      {
        id: "halong",
        nameAr: "خليج ها لونج",
        nameEn: "Ha Long Bay",
        description: "أحد عجائب الطبيعة - 2000 جزيرة كارستية في البحر",
        image: "https://images.unsplash.com/photo-1528127269322-539801943592",
        coordinates: { lat: 20.9101, lng: 107.1839 },
        bestTime: "مارس - مايو، سبتمبر - نوفمبر",
        averageTemp: "22-28°C",
        accommodation: "سفن سياحية فاخرة 100-350 دولار",
        attractions: [
          "رحلات القوارب بين الجزر",
          "كهف سونج سوت (كهف المفاجآت)",
          "قرية الصيد العائمة",
          "جزيرة تي توب",
          "التجديف بالكاياك",
          "كهف داو جو",
          "شاطئ تي توب",
          "كهف لوون"
        ],
        highlights: [
          "أحد مواقع التراث العالمي",
          "المناظر الطبيعية الخيالية",
          "السفن السياحية الفاخرة",
          "الكهوف الطبيعية المذهلة",
          "تجربة المبيت على السفينة",
          "التصوير الفوتوغرافي الرائع"
        ]
      }
    ]
  },
  
  // ============ الفلبين ============
  {
    id: "philippines",
    nameAr: "الفلبين",
    nameEn: "Philippines",
    description: "أكثر من 7000 جزيرة استوائية - شواطئ بيضاء وطبيعة خلابة",
    coverImage: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86",
    currency: "بيزو فلبيني (PHP)",
    language: "الإنجليزية والتاغالوغية",
    visa: "تأشيرة عند الوصول",
    bestSeason: "ديسمبر - مايو",
    climate: "استوائي - حار ورطب",
    budget: "35-100 دولار",
    cities: [
      {
        id: "manila",
        nameAr: "مانيلا",
        nameEn: "Manila",
        description: "العاصمة النابضة - مزيج من التاريخ والحداثة",
        image: "https://images.unsplash.com/photo-1548164279-91598f5601c4",
        coordinates: { lat: 14.5995, lng: 120.9842 },
        bestTimeToVisit: "ديسمبر - فبراير",
        averageTemp: { summer: "26-33°C", winter: "24-31°C" },
        accommodation: { budget: "20-40$", midRange: "50-100$", luxury: "150-400$" },
        attractions: [
          { nameAr: "إنتراموروس", nameEn: "Intramuros", description: "المدينة القديمة المسورة", type: "تاريخي", entryFee: "50 بيزو", timeNeeded: "3-4 ساعات", bestTimeToVisit: "الصباح الباكر", rating: 4.5 },
          { nameAr: "ريزال بارك", nameEn: "Rizal Park", description: "حديقة تاريخية وطنية", type: "حديقة", entryFee: "مجاني", timeNeeded: "2-3 ساعات", bestTimeToVisit: "المساء", rating: 4.3 },
          { nameAr: "مول آسيا", nameEn: "SM Mall of Asia", description: "أحد أكبر مولات العالم", type: "تسوق", entryFee: "مجاني", timeNeeded: "4-5 ساعات", bestTimeToVisit: "أي وقت", rating: 4.6 },
          { nameAr: "كنيسة سان أوغستين", nameEn: "San Agustin Church", description: "أقدم كنيسة حجرية", type: "تاريخي", entryFee: "200 بيزو", timeNeeded: "1-2 ساعة", bestTimeToVisit: "الصباح", rating: 4.7 },
          { nameAr: "خليج مانيلا", nameEn: "Manila Bay", description: "شروق وغروب خلابة", type: "طبيعة", entryFee: "مجاني", timeNeeded: "2 ساعة", bestTimeToVisit: "الغروب", rating: 4.4 },
          { nameAr: "حديقة المحيط", nameEn: "Ocean Park", description: "أكواريوم ضخم وألعاب", type: "ترفيه", entryFee: "1000 بيزو", timeNeeded: "4-5 ساعات", bestTimeToVisit: "صباحاً", rating: 4.5 },
          { nameAr: "متحف أيالا", nameEn: "Ayala Museum", description: "تاريخ الفلبين الغني", type: "متحف", entryFee: "425 بيزو", timeNeeded: "2-3 ساعات", bestTimeToVisit: "الصباح", rating: 4.6 },
          { nameAr: "حي ماكاتي", nameEn: "Makati", description: "المركز المالي والتسوق", type: "حي", entryFee: "مجاني", timeNeeded: "نصف يوم", bestTimeToVisit: "أي وقت", rating: 4.5 }
        ],
        highlights: [
          "المدينة القديمة إنتراموروس",
          "غروب خليج مانيلا الشهير",
          "التسوق في المولات الضخمة",
          "المطاعم الفلبينية الأصيلة",
          "الحياة الليلية النابضة",
          "سهولة التواصل بالإنجليزية"
        ]
      },
      {
        id: "boracay",
        nameAr: "بوراكاي",
        nameEn: "Boracay",
        description: "جنة الشواطئ البيضاء - أجمل شواطئ العالم",
        image: "https://images.unsplash.com/photo-1584646098378-0874589d76b1",
        coordinates: { lat: 11.9674, lng: 121.9248 },
        bestTimeToVisit: "نوفمبر - مايو",
        averageTemp: { summer: "27-32°C", winter: "25-30°C" },
        accommodation: { budget: "30-60$", midRange: "80-150$", luxury: "200-600$" },
        attractions: [
          { nameAr: "الشاطئ الأبيض", nameEn: "White Beach", description: "4 كم من الرمال البيضاء", type: "شاطئ", entryFee: "مجاني", timeNeeded: "طوال اليوم", bestTimeToVisit: "أي وقت", rating: 4.9 },
          { nameAr: "بوكا بيتش", nameEn: "Puka Beach", description: "شاطئ هادئ بعيد", type: "شاطئ", entryFee: "مجاني", timeNeeded: "3-4 ساعات", bestTimeToVisit: "الصباح", rating: 4.7 },
          { nameAr: "جزيرة كريستال", nameEn: "Crystal Cove", description: "كهوف ومياه كريستالية", type: "جزيرة", entryFee: "200 بيزو", timeNeeded: "2-3 ساعات", bestTimeToVisit: "الصباح", rating: 4.6 },
          { nameAr: "ديد فورست", nameEn: "Dead Forest", description: "غابة مانغروف مذهلة", type: "طبيعة", entryFee: "100 بيزو", timeNeeded: "1-2 ساعة", bestTimeToVisit: "الصباح", rating: 4.4 },
          { nameAr: "جبل لوهو", nameEn: "Mount Luho", description: "أعلى نقطة في بوراكاي", type: "جبل", entryFee: "200 بيزو", timeNeeded: "1 ساعة", bestTimeToVisit: "الغروب", rating: 4.5 },
          { nameAr: "ديناويد بيتش", nameEn: "Diniwid Beach", description: "شاطئ هادئ للاسترخاء", type: "شاطئ", entryFee: "مجاني", timeNeeded: "3 ساعات", bestTimeToVisit: "المساء", rating: 4.6 },
          { nameAr: "الغوص والسنوركل", nameEn: "Diving", description: "مواقع غوص رائعة", type: "نشاط", entryFee: "1500-3000 بيزو", timeNeeded: "نصف يوم", bestTimeToVisit: "الصباح", rating: 4.8 },
          { nameAr: "التجديف", nameEn: "Paraw Sailing", description: "القوارب الشراعية التقليدية", type: "نشاط", entryFee: "1500-2500 بيزو", timeNeeded: "2 ساعة", bestTimeToVisit: "الغروب", rating: 4.7 }
        ],
        highlights: [
          "أجمل شواطئ رملية بيضاء",
          "مياه فيروزية صافية",
          "الغوص والرياضات المائية",
          "غروب الشمس الساحر",
          "المنتجعات الفاخرة",
          "الحياة الليلية على الشاطئ"
        ]
      },
      {
        id: "palawan",
        nameAr: "بالاوان",
        nameEn: "Palawan",
        description: "الجزيرة الأجمل في العالم - طبيعة بكر خلابة",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
        coordinates: { lat: 9.8349, lng: 118.7384 },
        bestTimeToVisit: "نوفمبر - مايو",
        averageTemp: { summer: "27-33°C", winter: "25-31°C" },
        accommodation: { budget: "25-50$", midRange: "70-140$", luxury: "180-500$" },
        attractions: [
          { nameAr: "نهر بويرتو الجوفي", nameEn: "Underground River", description: "نهر تحت الأرض (اليونسكو)", type: "طبيعة", entryFee: "1500 بيزو", timeNeeded: "نصف يوم", bestTimeToVisit: "الصباح", rating: 4.9 },
          { nameAr: "جزيرة كورون", nameEn: "Coron Island", description: "بحيرات وشعاب مرجانية", type: "جزيرة", entryFee: "رحلة 1200-1800 بيزو", timeNeeded: "يوم كامل", bestTimeToVisit: "الصباح", rating: 4.8 },
          { nameAr: "بحيرة كايانجان", nameEn: "Kayangan Lake", description: "أنظف بحيرة في آسيا", type: "بحيرة", entryFee: "200 بيزو", timeNeeded: "2-3 ساعات", bestTimeToVisit: "الصباح", rating: 4.9 },
          { nameAr: "إل نيدو", nameEn: "El Nido", description: "منحدرات كلسية وشواطئ", type: "منطقة", entryFee: "رحلات 1200-1500 بيزو", timeNeeded: "عدة أيام", bestTimeToVisit: "نوفمبر - أبريل", rating: 4.9 },
          { nameAr: "جزيرة بالامبوان", nameEn: "Balabac", description: "جزيرة نائية وبكر", type: "جزيرة", entryFee: "رحلة منظمة", timeNeeded: "يومين", bestTimeToVisit: "مارس - مايو", rating: 4.8 },
          { nameAr: "حطام سفن كورون", nameEn: "Coron Wrecks", description: "مواقع غوص عالمية", type: "غوص", entryFee: "1500-2500 بيزو", timeNeeded: "نصف يوم", bestTimeToVisit: "الصباح", rating: 4.9 },
          { nameAr: "باكويت الكبير", nameEn: "Big Lagoon", description: "بحيرة ضخمة ساحرة", type: "بحيرة", entryFee: "ضمن رحلة", timeNeeded: "2 ساعة", bestTimeToVisit: "الصباح", rating: 4.8 },
          { nameAr: "شاطئ ناكبان", nameEn: "Nacpan Beach", description: "شاطئ طويل ونظيف", type: "شاطئ", entryFee: "مجاني", timeNeeded: "نصف يوم", bestTimeToVisit: "المساء", rating: 4.7 }
        ],
        highlights: [
          "النهر الجوفي (عجائب الطبيعة)",
          "أجمل الجزر في العالم",
          "الغوص في حطام السفن",
          "الطبيعة البكر الخلابة",
          "البحيرات الكريستالية",
          "جنة الصور الفوتوغرافية"
        ]
      }
    ]
  },
  
  // ============ سنغافورة ============
  {
    id: "singapore",
    nameAr: "سنغافورة",
    nameEn: "Singapore",
    description: "مدينة الأسد - الحداثة والنظافة والتطور",
    coverImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd",
    currency: "دولار سنغافوري (SGD)",
    language: "الإنجليزية والصينية والمالاوية",
    visa: "تأشيرة إلكترونية",
    bestSeason: "فبراير - أبريل",
    climate: "استوائي - حار ورطب طوال العام",
    budget: "80-200 دولار",
    cities: [
      {
        id: "singapore-city",
        nameAr: "سنغافورة",
        nameEn: "Singapore City",
        description: "مدينة حديثة نظيفة - مركز مالي عالمي",
        image: "https://images.unsplash.com/photo-1565967511849-76a60a516170",
        coordinates: { lat: 1.3521, lng: 103.8198 },
        bestTimeToVisit: "فبراير - أبريل",
        averageTemp: { summer: "26-32°C", winter: "25-31°C" },
        accommodation: { budget: "50-80$", midRange: "100-200$", luxury: "300-800$" },
        attractions: [
          { nameAr: "مارينا باي ساندز", nameEn: "Marina Bay Sands", description: "فندق أيقوني ومسبح لامتناهي", type: "معلم", entryFee: "مسبح 23 دولار", timeNeeded: "2-3 ساعات", bestTimeToVisit: "المساء", rating: 4.8 },
          { nameAr: "جاردنز باي ذا باي", nameEn: "Gardens by the Bay", description: "حدائق مستقبلية ضخمة", type: "حديقة", entryFee: "28 دولار", timeNeeded: "3-4 ساعات", bestTimeToVisit: "المساء", rating: 4.9 },
          { nameAr: "يونيفرسال ستوديوز", nameEn: "Universal Studios", description: "مدينة ألعاب عالمية", type: "ترفيه", entryFee: "79 دولار", timeNeeded: "يوم كامل", bestTimeToVisit: "طوال اليوم", rating: 4.7 },
          { nameAr: "حديقة الحيوان", nameEn: "Singapore Zoo", description: "أفضل حديقة حيوان في آسيا", type: "حديقة حيوان", entryFee: "39 دولار", timeNeeded: "4-5 ساعات", bestTimeToVisit: "الصباح", rating: 4.8 },
          { nameAr: "سفاري الليل", nameEn: "Night Safari", description: "سفاري ليلية فريدة", type: "ترفيه", entryFee: "49 دولار", timeNeeded: "3-4 ساعات", bestTimeToVisit: "المساء", rating: 4.7 },
          { nameAr: "الحي الصيني", nameEn: "Chinatown", description: "أسواق وثقافة صينية", type: "حي", entryFee: "مجاني", timeNeeded: "2-3 ساعات", bestTimeToVisit: "المساء", rating: 4.5 },
          { nameAr: "الهند الصغيرة", nameEn: "Little India", description: "ألوان وروائح هندية", type: "حي", entryFee: "مجاني", timeNeeded: "2 ساعة", bestTimeToVisit: "أي وقت", rating: 4.4 },
          { nameAr: "أوركارد رود", nameEn: "Orchard Road", description: "شارع التسوق الشهير", type: "تسوق", entryFee: "مجاني", timeNeeded: "3-4 ساعات", bestTimeToVisit: "أي وقت", rating: 4.6 },
          { nameAr: "سنتوسا", nameEn: "Sentosa Island", description: "جزيرة المرح والشواطئ", type: "جزيرة", entryFee: "متنوع", timeNeeded: "يوم كامل", bestTimeToVisit: "طوال اليوم", rating: 4.7 },
          { nameAr: "متحف الفنون والعلوم", nameEn: "ArtScience Museum", description: "معارض تفاعلية مبتكرة", type: "متحف", entryFee: "19 دولار", timeNeeded: "2-3 ساعات", bestTimeToVisit: "الصباح", rating: 4.6 }
        ],
        highlights: [
          "مدينة نظيفة ومنظمة جداً",
          "البنية التحتية المتطورة",
          "التنوع الثقافي الفريد",
          "المطاعم العالمية والمحلية",
          "الحدائق والمساحات الخضراء",
          "أمان تام وسهولة التنقل"
        ]
      }
    ]
  }
];

export const getSoutheastAsiaCountries = () => {
  return southeastAsiaCountries;
};

export const getCountryById = (id: string) => {
  return southeastAsiaCountries.find(country => country.id === id);
};

export const getCityById = (countryId: string, cityId: string) => {
  const country = getCountryById(countryId);
  return country?.cities.find(city => city.id === cityId);
};

export const getAllCities = () => {
  return southeastAsiaCountries.flatMap(country => 
    country.cities.map(city => ({
      ...city,
      country: {
        id: country.id,
        nameAr: country.nameAr,
        nameEn: country.nameEn
      }
    }))
  );
};
