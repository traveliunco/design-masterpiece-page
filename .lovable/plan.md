

# خطة إضافة البيانات التجريبية وصفحات الإدارة لنظام مصمم الرحلات

## الوضع الحالي في قاعدة البيانات

| الجدول | العدد الحالي |
|---|---|
| destinations (وجهات/دول) | 6 ✅ |
| airports | 13 ✅ |
| airlines | 9 ✅ |
| **flight_offers** | **0 ❌** |
| **hotels** | **0 ❌** |
| **hotel_rooms** | **0 ❌** |
| **car_rentals** | **0 ❌** |
| tour_activities | 6 (تحتاج المزيد) |

## ما سيتم تنفيذه

### 1. Edge Function لبذر البيانات التجريبية

إنشاء `supabase/functions/seed-trip-data/index.ts` يضيف:

- **14 فندق** موزعين على 6 دول (كوالالمبور، بانكوك، بالي، اسطنبول، تبليسي، ماليه)
- **~35 غرفة فندقية** (2-3 لكل فندق بأسعار واقعية)
- **18 عرض طيران** من الرياض/جدة لجميع الوجهات (اقتصادي + بزنس)
- **10 سيارات إيجار** لكل مدينة رئيسية
- **8 أنشطة سياحية** إضافية (معابد بانكوك، كهوف باتو، كازبيجي، غوص المالديف...)

### 2. صفحة إدارة البكجات الديناميكية

إنشاء `src/pages/admin/DynamicPackagesAdmin.tsx`:
- عرض جميع الطلبات المحفوظة من `dynamic_packages`
- فلترة حسب الحالة (مسودة/مرسل/مؤكد/ملغي)
- عرض تفاصيل كل بكج (الوجهة، الطيران، الفندق، السيارة، الأنشطة، السعر)
- تغيير حالة الطلب
- إحصائيات سريعة

### 3. صفحة إدارة الأنشطة السياحية

إنشاء `src/pages/admin/TourActivitiesAdmin.tsx`:
- CRUD كامل للأنشطة السياحية
- ربط بالدولة والمدينة
- تحميل صور وأسعار

### 4. تحديث التوجيه والقائمة الجانبية

- إضافة الصفحتين في `App.tsx` تحت مسارات الأدمن
- إضافة روابط في `AdminLayout.tsx` تحت قسم "مصمم الرحلات"

### 5. تحسين أنواع TypeScript

- تحديث `tour_activities` في `tripBuilderService.ts` لإزالة `as any`

## الملفات المتأثرة

| الملف | العملية |
|---|---|
| `supabase/functions/seed-trip-data/index.ts` | إنشاء |
| `src/pages/admin/DynamicPackagesAdmin.tsx` | إنشاء |
| `src/pages/admin/TourActivitiesAdmin.tsx` | إنشاء |
| `src/App.tsx` | إضافة مسارات |
| `src/components/admin/AdminLayout.tsx` | إضافة روابط قائمة |
| `src/services/tripBuilderService.ts` | تحسين الأنواع |
| `supabase/config.toml` | إضافة دالة seed |

