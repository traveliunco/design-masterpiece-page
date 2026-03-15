

# خطة تفعيل نظام "مصمم الرحلات الديناميكي" للإنتاج الفعلي

## الوضع الحالي

النظام الحالي يعمل بشكل أساسي لكنه غير مترابط منطقيا:
- **الخطوة 1 (الوجهة)**: تسحب من جدول `destinations` وليس من `tour_countries` / `tour_cities` -- لا يوجد ربط بالدول والمدن الفعلية
- **الخطوة 2 (الطيران)**: تعرض كل الرحلات بدون فلترة حسب الوجهة المختارة
- **الخطوة 3 (الفندق)**: تعرض كل الفنادق بدون فلترة حسب المدينة
- **الخطوة 4 (السيارة)**: نفس المشكلة -- لا فلترة
- **الخطوة 5 (الإضافات)**: تسحب من جدول `tour_activities` غير موجود فعليا
- **الخطوة 6 (الملخص)**: تحفظ في `dynamic_packages` لكن بدون ربط بالمستخدم المسجل
- **التسعير**: ثابت للتأمين والفيزا، لا يتغير حسب الوجهة

## الخطة المقترحة

### المرحلة 1: إعادة هيكلة خطوة الوجهة (الدول ثم المدن)

**تعديل StepDestination** ليعمل بأسلوب تسلسلي:
1. يعرض الدول من `tour_countries` (بدل `destinations`)
2. عند اختيار دولة، يعرض مدنها من `tour_cities`
3. يحفظ `countryId` + `cityId` + أسماءهم في TripData

**تعديل TripData** لإضافة:
- `countryId`, `countryName`, `cityId`, `cityName`
- `originCityCode` (مدينة المغادرة -- الرياض افتراضيا)

### المرحلة 2: ربط الطيران بالوجهة المختارة

**تعديل StepFlight**:
- فلترة `flight_offers` حسب `destination_airport_id` المرتبط بالمدينة/الدولة المختارة
- إضافة خيار اختيار مدينة المغادرة (من المطارات السعودية)
- فلترة حسب التاريخ المختار
- عرض تفاصيل أكثر (شركة الطيران، المدة، التوقفات)

### المرحلة 3: ربط الفنادق بالمدينة المختارة

**تعديل StepHotel**:
- فلترة `hotels` حسب `city_en` أو `city_ar` المطابقة للمدينة المختارة
- عرض التصنيف والتقييم والصور
- عرض الغرف المتاحة مع الأسعار الديناميكية

### المرحلة 4: ربط السيارات بالمدينة

**تعديل StepCarRental**:
- فلترة `car_rentals` حسب المدينة المختارة
- تحسين عرض خيار السائق والسعر

### المرحلة 5: إنشاء جدول الأنشطة السياحية

**إنشاء جدول `tour_activities` في Supabase**:

```text
tour_activities
├── id (uuid, PK)
├── name_ar, name_en (varchar)
├── description_ar, description_en (text)
├── city_id (uuid, FK → tour_cities)
├── country_id (uuid, FK → tour_countries)
├── image_url (text)
├── price_per_person (numeric)
├── duration_hours (numeric)
├── category (varchar: مغامرة/ثقافة/ترفيه/طبيعة)
├── is_active (boolean)
├── display_order (integer)
└── created_at, updated_at (timestamptz)
```

- ربط الأنشطة بالمدينة المختارة في StepExtras
- تسعير ديناميكي للتأمين والفيزا حسب الوجهة

### المرحلة 6: تحسين الملخص والحفظ

**تعديل StepSummary**:
- ربط بالمستخدم المسجل (`auth.uid()`) إن وجد
- حفظ `country_id` و `city_id` في `dynamic_packages`
- إرسال إشعار واتساب أو بريد إلكتروني (اختياري مستقبلا)
- إضافة زر "مشاركة البكج" كرابط

### المرحلة 7: تعديل tripBuilderService

تحديث كل دالة في الخدمة لتقبل فلاتر المدينة والدولة:

```text
tripBuilderService
├── getCountries()          → tour_countries (is_active)
├── getCities(countryId)    → tour_cities (by country)
├── getFlights(airportId, date)  → flight_offers (filtered)
├── getHotels(cityName)     → hotels (by city)
├── getHotelRooms(hotelId)  → hotel_rooms (unchanged)
├── getCarRentals(cityName) → car_rentals (by city)
├── getActivities(cityId)   → tour_activities (by city)
└── savePackage(data)       → dynamic_packages (enhanced)
```

### المرحلة 8: تعديل `dynamic_packages` schema

إضافة أعمدة جديدة:
- `country_id` (uuid, FK)
- `city_id` (uuid, FK)
- `origin_city` (varchar)

## ملخص التعديلات حسب الملف

| الملف | التعديل |
|---|---|
| `useTripBuilder.ts` | إضافة حقول country/city/origin |
| `tripBuilderService.ts` | إعادة كتابة مع فلاتر ذكية |
| `StepDestination.tsx` | دولة → مدينة بأسلوب تسلسلي |
| `StepFlight.tsx` | فلترة حسب الوجهة + مدينة المغادرة |
| `StepHotel.tsx` | فلترة حسب المدينة |
| `StepCarRental.tsx` | فلترة حسب المدينة |
| `StepExtras.tsx` | جدول أنشطة جديد + فلترة |
| `StepSummary.tsx` | ربط بالمستخدم + حقول جديدة |
| `TripSidebar.tsx` | عرض الدولة والمدينة |
| Migration | جدول `tour_activities` + أعمدة `dynamic_packages` |

## ترتيب التنفيذ

1. Migration: إنشاء `tour_activities` + تعديل `dynamic_packages`
2. تحديث `TripData` interface و `useTripBuilder`
3. إعادة كتابة `tripBuilderService`
4. تحديث `StepDestination` (دولة → مدينة)
5. تحديث `StepFlight` (فلترة + مدينة مغادرة)
6. تحديث `StepHotel` (فلترة بالمدينة)
7. تحديث `StepCarRental` (فلترة بالمدينة)
8. تحديث `StepExtras` (أنشطة بالمدينة + تسعير ديناميكي)
9. تحديث `StepSummary` + `TripSidebar`

