// بيانات المطارات السعودية والدولية
export interface Airport {
  code: string;
  nameAr: string;
  nameEn: string;
  city: string;
  lat: number;
  lng: number;
  country?: string;
}

// مطارات المملكة العربية السعودية الرئيسية
export const saudiAirports: Airport[] = [
  {
    code: 'RUH',
    nameAr: 'مطار الملك خالد الدولي',
    nameEn: 'King Khalid International Airport',
    city: 'الرياض',
    lat: 24.9576,
    lng: 46.6988
  },
  {
    code: 'JED',
    nameAr: 'مطار الملك عبدالعزيز الدولي',
    nameEn: 'King Abdulaziz International Airport',
    city: 'جدة',
    lat: 21.6796,
    lng: 39.1565
  },
  {
    code: 'DMM',
    nameAr: 'مطار الملك فهد الدولي',
    nameEn: 'King Fahd International Airport',
    city: 'الدمام',
    lat: 26.4712,
    lng: 49.7979
  },
  {
    code: 'MED',
    nameAr: 'مطار الأمير محمد بن عبدالعزيز',
    nameEn: 'Prince Mohammad Bin Abdulaziz Airport',
    city: 'المدينة المنورة',
    lat: 24.5534,
    lng: 39.7051
  }
];

// المطارات الدولية في الدول المشمولة
export const internationalAirports: Airport[] = [
  // تايلاند
  {
    code: 'BKK',
    country: 'thailand',
    nameAr: 'مطار سوفارنابومي',
    nameEn: 'Suvarnabhumi Airport',
    city: 'بانكوك',
    lat: 13.6900,
    lng: 100.7501
  },
  {
    code: 'HKT',
    country: 'thailand',
    nameAr: 'مطار بوكيت الدولي',
    nameEn: 'Phuket International Airport',
    city: 'بوكيت',
    lat: 8.1132,
    lng: 98.3169
  },
  {
    code: 'CNX',
    country: 'thailand',
    nameAr: 'مطار شيانغ ماي الدولي',
    nameEn: 'Chiang Mai International Airport',
    city: 'شيانغ ماي',
    lat: 18.7669,
    lng: 98.9625
  },
  
  // ماليزيا
  {
    code: 'KUL',
    country: 'malaysia',
    nameAr: 'مطار كوالالمبور الدولي',
    nameEn: 'Kuala Lumpur International Airport',
    city: 'كوالالمبور',
    lat: 2.7456,
    lng: 101.7099
  },
  {
    code: 'LGK',
    country: 'malaysia',
    nameAr: 'مطار لنكاوي الدولي',
    nameEn: 'Langkawi International Airport',
    city: 'لنكاوي',
    lat: 6.3297,
    lng: 99.7287
  },
  {
    code: 'PEN',
    country: 'malaysia',
    nameAr: 'مطار بينانج الدولي',
    nameEn: 'Penang International Airport',
    city: 'بينانج',
    lat: 5.2972,
    lng: 100.2769
  },
  
  // إندونيسيا
  {
    code: 'CGK',
    country: 'indonesia',
    nameAr: 'مطار سوكارنو هاتا',
    nameEn: 'Soekarno-Hatta International Airport',
    city: 'جاكرتا',
    lat: -6.1256,
    lng: 106.6558
  },
  {
    code: 'DPS',
    country: 'indonesia',
    nameAr: 'مطار نجوراه راي',
    nameEn: 'Ngurah Rai International Airport',
    city: 'بالي',
    lat: -8.7467,
    lng: 115.1672
  },
  
  // فيتنام
  {
    code: 'SGN',
    country: 'vietnam',
    nameAr: 'مطار تان سون نهات',
    nameEn: 'Tan Son Nhat International Airport',
    city: 'هوشي منه',
    lat: 10.8188,
    lng: 106.6519
  },
  {
    code: 'HAN',
    country: 'vietnam',
    nameAr: 'مطار نوي باي',
    nameEn: 'Noi Bai International Airport',
    city: 'هانوي',
    lat: 21.2212,
    lng: 105.8072
  },
  {
    code: 'DAD',
    country: 'vietnam',
    nameAr: 'مطار دا نانغ الدولي',
    nameEn: 'Da Nang International Airport',
    city: 'دا نانغ',
    lat: 16.0439,
    lng: 108.1992
  },
  
  // سنغافورة
  {
    code: 'SIN',
    country: 'singapore',
    nameAr: 'مطار تشانغي',
    nameEn: 'Singapore Changi Airport',
    city: 'سنغافورة',
    lat: 1.3644,
    lng: 103.9915
  },
  
  // الفلبين
  {
    code: 'MNL',
    country: 'philippines',
    nameAr: 'مطار نينوي أكينو',
    nameEn: 'Ninoy Aquino International Airport',
    city: 'مانيلا',
    lat: 14.5086,
    lng: 121.0193
  },
  
  // تركيا
  {
    code: 'IST',
    country: 'turkey',
    nameAr: 'مطار إسطنبول الجديد',
    nameEn: 'Istanbul Airport',
    city: 'إسطنبول',
    lat: 41.2753,
    lng: 28.7519
  },
  {
    code: 'SAW',
    country: 'turkey',
    nameAr: 'مطار صبيحة كوكجن',
    nameEn: 'Sabiha Gokcen International Airport',
    city: 'إسطنبول',
    lat: 40.8986,
    lng: 29.3092
  },
  {
    code: 'AYT',
    country: 'turkey',
    nameAr: 'مطار أنطاليا الدولي',
    nameEn: 'Antalya Airport',
    city: 'أنطاليا',
    lat: 36.8987,
    lng: 30.8005
  }
];

// دالة للحصول على مطار بالكود
export const getAirportByCode = (code: string): Airport | undefined => {
  return [...saudiAirports, ...internationalAirports].find(a => a.code === code);
};

// دالة للحصول على مطارات دولة معينة
export const getAirportsByCountry = (countryId: string): Airport[] => {
  return internationalAirports.filter(a => a.country === countryId);
};
