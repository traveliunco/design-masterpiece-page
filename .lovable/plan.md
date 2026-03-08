

# بكج السفر الديناميكي - Dynamic Trip Builder

## الفكرة
نظام متعدد الخطوات يمكّن المسافر من تصميم رحلته بنفسه خطوة بخطوة، باختيار الوجهة ثم الطيران ثم الفندق ثم السيارة ثم خدمات إضافية، مع ملخص تفاعلي للأسعار. البيانات تأتي من Supabase (مدخلة يدوياً) مع إمكانية التوسع لاحقاً عبر APIs خارجية.

## الخطوات للمسافر (Wizard من 6 مراحل)

```text
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ 1. الوجهة │ → │ 2. الطيران│ → │ 3. الفندق │ → │ 4. السيارة│ → │ 5. إضافات │ → │ 6. ملخص   │
│ و التواريخ│   │          │   │ و الغرفة  │   │ والجولات │   │ تأمين/فيزا│   │ و الدفع  │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
```

## التغييرات المطلوبة

### 1. جداول قاعدة البيانات (Migration)

**جدول `dynamic_packages`** - لحفظ البكج المصمم:
- `id`, `user_id`, `session_id` (لغير المسجلين)
- `destination`, `check_in_date`, `check_out_date`
- `adults_count`, `children_count`, `infants_count`
- `flight_offer_id` (FK → flight_offers, nullable)
- `hotel_id`, `room_id` (FK → hotels/hotel_rooms, nullable)
- `car_rental_id` (FK → car_rentals, nullable)
- `extras` (jsonb - تأمين، فيزا، جولات...)
- `subtotal`, `taxes`, `total_price`, `currency`
- `status` (draft/pending/confirmed/cancelled)
- `customer_name`, `customer_email`, `customer_phone`

**جدول `car_rentals`** - لتأجير السيارات (حالياً بيانات ثابتة في الكود):
- `id`, `name_ar`, `name_en`, `category`, `seats`, `bags`
- `transmission`, `fuel_type`, `price_per_day`, `price_with_driver`
- `city_ar`, `city_en`, `country_ar`, `country_en`
- `features` (jsonb), `image_url`, `rating`, `is_active`

**جدول `tour_activities`** - للجولات والأنشطة:
- `id`, `name_ar`, `name_en`, `city_ar`, `city_en`
- `description_ar`, `description_en`
- `duration_hours`, `price_per_person`, `category`
- `image_url`, `is_active`

### 2. ملفات جديدة

| الملف | الوصف |
|-------|-------|
| `src/pages/TripBuilder.tsx` | الصفحة الرئيسية - Wizard Container |
| `src/components/trip-builder/StepDestination.tsx` | الخطوة 1: اختيار الوجهة والتواريخ والمسافرين |
| `src/components/trip-builder/StepFlight.tsx` | الخطوة 2: اختيار الطيران من flight_offers |
| `src/components/trip-builder/StepHotel.tsx` | الخطوة 3: اختيار الفندق والغرفة |
| `src/components/trip-builder/StepCarRental.tsx` | الخطوة 4: اختيار سيارة (اختياري) |
| `src/components/trip-builder/StepExtras.tsx` | الخطوة 5: تأمين سفر، فيزا، جولات |
| `src/components/trip-builder/StepSummary.tsx` | الخطوة 6: ملخص + بيانات التواصل + تأكيد |
| `src/components/trip-builder/TripSidebar.tsx` | شريط جانبي تفاعلي يعرض الاختيارات والسعر |
| `src/components/trip-builder/StepIndicator.tsx` | مؤشر التقدم بالخطوات |
| `src/hooks/useTripBuilder.ts` | Hook مركزي لإدارة state البكج |
| `src/services/tripBuilderService.ts` | خدمات Supabase للبكج الديناميكي |

### 3. تعديل ملفات موجودة

- **`src/App.tsx`**: إضافة route `/trip-builder`
- **`src/components/Nav3D.tsx`**: إضافة رابط "صمم رحلتك" في القائمة

### 4. كيف يعمل كل Step

**Step 1 - الوجهة**: يختار المسافر الوجهة من destinations الموجودة، يحدد التواريخ وعدد المسافرين.

**Step 2 - الطيران**: يعرض رحلات متاحة من `flight_offers` مفلترة حسب الوجهة والتاريخ. يمكن التخطي إذا لا يريد طيران.

**Step 3 - الفندق**: يعرض فنادق من `hotels` + `hotel_rooms` مفلترة حسب المدينة. اختيار الفندق ثم الغرفة.

**Step 4 - السيارة**: يعرض سيارات متاحة من `car_rentals` الجديد. اختياري بالكامل.

**Step 5 - الإضافات**: تأمين سفر، خدمة فيزا، جولات سياحية من `tour_activities`. كلها اختيارية.

**Step 6 - الملخص**: عرض كل الاختيارات + السعر الإجمالي + نموذج بيانات التواصل + زر التأكيد.

### 5. الشريط الجانبي (TripSidebar)

يظهر دائماً على اليسار (RTL) ويعرض:
- الوجهة والتواريخ
- كل خدمة تم اختيارها مع سعرها
- خصم (إن وجد)
- الضريبة (15%)
- **الإجمالي** محدث لحظياً

### 6. RLS Policies

- `dynamic_packages`: المستخدم يرى ويعدل بكجاته فقط (`auth.uid() = user_id`)، الأدمن يرى الكل
- `car_rentals` و `tour_activities`: قراءة عامة للنشط، تعديل للأدمن فقط

### 7. دعم API خارجي مستقبلاً

التصميم يدعم مصدرين للبيانات:
- **`source: 'internal'`**: بيانات مدخلة يدوياً في Supabase
- **`source: 'api'`**: بيانات من API خارجي (Amadeus, Travelpayouts...)

كل service function تتحقق من المصدر وتجلب البيانات وفقاً لذلك. هذا موجود فعلاً في `flight_offers.source`.

