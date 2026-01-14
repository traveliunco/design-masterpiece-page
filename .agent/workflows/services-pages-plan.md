# 📋 خطة صفحات الخدمات - ترافليون

## نظرة عامة
إنشاء 6 صفحات خدمات متكاملة لموقع ترافليون للسفر والسياحة.

---

## 📄 الصفحات المطلوبة

### 1. ✈️ حجز الطيران (`/flights`)
**الحالة:** ✅ مكتمل

**المحتوى:**
- Widget بحث من Travelpayouts
- الوجهات الشائعة
- مميزات الحجز
- CTA للتواصل

---

### 2. 🏨 حجز الفنادق (`/hotels`)
**الحالة:** 🔄 قيد الإنشاء

**المحتوى:**
- Widget بحث الفنادق من Hotellook
- فئات الفنادق (5 نجوم، 4 نجوم، إلخ)
- أفضل الفنادق في كل وجهة
- عروض خاصة
- نصائح لاختيار الفندق

**التكامل:**
- Hotellook Widget
- صور فنادق من Supabase Storage

---

### 3. 🗺️ البرامج السياحية (`/programs`)
**الحالة:** 🔄 قيد الإنشاء

**المحتوى:**
- قائمة البرامج حسب الوجهة
- فلترة حسب: النوع، المدة، السعر
- تفاصيل كل برنامج:
  - جدول الرحلة يوم بيوم
  - ما يشمله البرنامج
  - ما لا يشمله
  - الفنادق
  - السعر
- نموذج حجز

**التكامل:**
- بيانات من Supabase (جدول programs)
- نموذج حجز متصل بالـ Admin

---

### 4. 🚗 تأجير السيارات (`/car-rental`)
**الحالة:** 🔄 قيد الإنشاء

**المحتوى:**
- أنواع السيارات المتاحة
- خدمة مع/بدون سائق
- الأسعار حسب المدة
- الوجهات المتاحة
- شروط التأجير
- نموذج حجز

**التكامل:**
- Rentalcars Widget (اختياري)
- نموذج حجز يدوي

---

### 5. 📋 التأشيرات (`/visas`)
**الحالة:** 🔄 قيد الإنشاء

**المحتوى:**
- قائمة الدول المتاحة
- متطلبات كل دولة
- أنواع التأشيرات
- مدة الاستخراج
- الأسعار
- المستندات المطلوبة
- نموذج طلب تأشيرة

**البيانات:**
- جدول visas في Supabase
- جدول visa_requirements

---

### 6. 🛡️ التأمين (`/insurance`)
**الحالة:** 🔄 قيد الإنشاء

**المحتوى:**
- أنواع التأمين:
  - تأمين سفر شامل
  - تأمين طبي
  - تأمين إلغاء الرحلة
  - تأمين الأمتعة
- التغطيات
- الأسعار
- المقارنة بين الخطط
- شركات التأمين الشريكة
- نموذج طلب تأمين

---

## 🎨 التصميم الموحد

### كل صفحة تحتوي على:
1. **Hero Section** - عنوان + وصف + صورة/أيقونة
2. **Search/Filter** - بحث أو فلترة
3. **Main Content** - المحتوى الرئيسي
4. **Features** - مميزات الخدمة
5. **FAQ** - الأسئلة الشائعة
6. **CTA** - دعوة للتواصل/الحجز

### الألوان:
- Primary: #0B4D3C (أخضر)
- Secondary: #CC9A4B (ذهبي)
- Accent: متغير حسب الخدمة

---

## 📁 هيكل الملفات

```
src/pages/
├── Api.tsx (Flights - موجود)
├── Hotels.tsx (جديد)
├── Programs.tsx (جديد)  
├── CarRental.tsx (جديد)
├── Visas.tsx (جديد)
├── Insurance.tsx (جديد)
```

---

## 🗃️ جداول Supabase المطلوبة

```sql
-- البرامج السياحية
CREATE TABLE programs (
  id UUID PRIMARY KEY,
  name_ar TEXT,
  name_en TEXT,
  destination_id UUID REFERENCES destinations(id),
  duration_days INT,
  price DECIMAL,
  description TEXT,
  itinerary JSONB,
  includes TEXT[],
  excludes TEXT[],
  is_active BOOLEAN DEFAULT true
);

-- التأشيرات
CREATE TABLE visas (
  id UUID PRIMARY KEY,
  country_name_ar TEXT,
  country_name_en TEXT,
  country_code TEXT,
  visa_types JSONB,
  requirements TEXT[],
  processing_days INT,
  price DECIMAL,
  is_active BOOLEAN DEFAULT true
);

-- تأجير السيارات
CREATE TABLE car_rentals (
  id UUID PRIMARY KEY,
  car_type TEXT,
  brand TEXT,
  model TEXT,
  price_per_day DECIMAL,
  with_driver BOOLEAN,
  available_cities TEXT[],
  features TEXT[],
  is_active BOOLEAN DEFAULT true
);

-- التأمين
CREATE TABLE insurance_plans (
  id UUID PRIMARY KEY,
  name_ar TEXT,
  type TEXT,
  coverage JSONB,
  price_per_day DECIMAL,
  max_coverage DECIMAL,
  provider TEXT,
  is_active BOOLEAN DEFAULT true
);
```

---

## ⏱️ خطة التنفيذ

| المرحلة | المهمة | الوقت المقدر |
|---------|--------|--------------|
| 1 | إنشاء صفحة الفنادق | 10 دقائق |
| 2 | إنشاء صفحة البرامج | 15 دقيقة |
| 3 | إنشاء صفحة تأجير السيارات | 10 دقائق |
| 4 | إنشاء صفحة التأشيرات | 10 دقائق |
| 5 | إنشاء صفحة التأمين | 10 دقائق |
| 6 | تحديث Sitemap و Navigation | 5 دقائق |
| 7 | إضافة جداول Supabase | 5 دقائق |

**الإجمالي:** ~65 دقيقة

---

## 🚀 البدء

سيتم إنشاء الصفحات بالترتيب التالي:
1. Hotels.tsx
2. Programs.tsx
3. CarRental.tsx
4. Visas.tsx
5. Insurance.tsx

ثم تحديث Navigation و Sitemap.
