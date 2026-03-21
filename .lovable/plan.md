

# تقرير مراجعة الأنظمة: البرامج، العروض، مصمم الرحلات

## الحالة العامة

بعد مراجعة شاملة للكود وقواعد البيانات، **الأنظمة الثلاثة مبنية بشكل متكامل ومربوطة بقواعد البيانات**. هناك **3 مشاكل تحتاج إصلاح** للجاهزية الإنتاجية:

---

## ✅ ما هو مكتمل وجاهز

### البرامج السياحية (`/programs`)
- صفحة قائمة البرامج: بحث + فلترة حسب النوع ← مربوطة بجدول `programs` في Supabase
- صفحة تفاصيل البرنامج (`/programs/:id`): جدول يومي، يشمل/لا يشمل، معرض صور، حساب سعر
- لوحة التحكم: إضافة/تعديل/حذف/تفعيل/تمييز البرامج ← كل العمليات CRUD مكتملة
- RLS: سياسات أمان مطبقة (admin full access + public read active)

### العروض الخاصة (`/offers`)
- صفحة العروض: فلترة حسب النوع، مؤقت انتهاء الصلاحية، حساب خصومات
- مربوطة بجدول `special_offers` في Supabase
- لوحة التحكم: إضافة/تعديل/حذف العروض ← كامل
- حجز عبر WhatsApp + سؤال الذكاء الاصطناعي

### مصمم الرحلات (`/trip-builder`)
- 6 خطوات متسلسلة: وجهة ← طيران ← فندق ← سيارة ← إضافات ← ملخص
- كل خطوة مربوطة بـ Supabase: `destinations`, `airports`, `flight_offers`, `hotels`, `hotel_rooms`, `car_rentals`, `tour_activities`
- فلترة تسلسلية ذكية حسب الدولة/المدينة
- حساب لحظي للتكاليف + ضريبة 15%
- حفظ الطلب في جدول `dynamic_packages`
- لوحة إدارة الطلبات (`/admin/dynamic-packages`)

### البكجات الجاهزة (`/packages`)
- قابلة للتخصيص (تغيير فندق/غرفة/طيران/سيارة)
- مربوطة بـ `ready_packages` + جداول المخزون الفعلي
- لوحة إدارة كاملة (`/admin/ready-packages`)

---

## 🔧 المشاكل التي تحتاج إصلاح

### 1. عدم تطابق حالة الطلب (Bug)
- **StepSummary** يحفظ الطلب بحالة `status: 'pending'`
- **DynamicPackagesAdmin** لا يعرف حالة `pending` - يعرف فقط: `draft`, `submitted`, `confirmed`, `cancelled`
- **النتيجة**: طلبات المستخدمين تظهر بدون badge حالة في لوحة التحكم
- **الحل**: إضافة `pending` إلى `statusMap` في DynamicPackagesAdmin، وتغيير الحالة الافتراضية في StepSummary من `pending` إلى `submitted` (لأنه طلب مرسل فعلاً)

### 2. ألوان قديمة لم تتحدث (من التوحيد اللوني السابق)
- `src/pages/Offers.tsx` لا يزال يستخدم `luxury-teal`, `luxury-gold`, `luxury-navy`, `emerald`, `amber`, `purple` - لم يُحدَّث ضمن عملية توحيد الألوان الزرقاء
- `src/pages/Programs.tsx` و `ProgramDetails.tsx` نفس المشكلة
- **الحل**: تحديث ألوان هذه الصفحات الثلاث لتتوافق مع الهوية الزرقاء الموحدة

### 3. `supabase as any` cast في عدة ملفات
- `Offers.tsx`, `admin/Offers.tsx`, `admin/OfferNew.tsx`, `admin/OfferEdit.tsx` تستخدم `(supabase as any)` للوصول لجدول `special_offers`
- `TourActivitiesAdmin.tsx` و `tripBuilderService.ts` تستخدم `'tour_activities' as any`
- **السبب**: الجداول موجودة في قاعدة البيانات لكن الأنواع تم توليدها بشكل صحيح فعلاً (موجودة في types.ts)
- **الحل**: إزالة `as any` واستخدام الأنواع الصحيحة مباشرة - هذا يضمن type safety كامل

---

## الملفات المتأثرة

| الملف | العملية |
|---|---|
| `src/pages/admin/DynamicPackagesAdmin.tsx` | إضافة حالة `pending`/`submitted` |
| `src/components/trip-builder/StepSummary.tsx` | تغيير `pending` → `submitted` |
| `src/pages/Offers.tsx` | توحيد الألوان الزرقاء + إزالة `as any` |
| `src/pages/Programs.tsx` | توحيد الألوان الزرقاء |
| `src/pages/ProgramDetails.tsx` | توحيد الألوان الزرقاء |
| `src/pages/admin/Offers.tsx` | إزالة `as any` |
| `src/pages/admin/OfferNew.tsx` | إزالة `as any` |
| `src/pages/admin/OfferEdit.tsx` | إزالة `as any` |
| `src/pages/admin/TourActivitiesAdmin.tsx` | إزالة `as any` |
| `src/services/tripBuilderService.ts` | إزالة `as any` |

## لا تغييرات مطلوبة على قاعدة البيانات
كل الجداول والعلاقات و RLS policies موجودة وتعمل بشكل صحيح.

