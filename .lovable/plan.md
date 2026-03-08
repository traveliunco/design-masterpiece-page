

# ذاكرة المشروع + قائمة فحص شاملة

## ما سيتم إنشاؤه

ملف `PROJECT_MEMORY.md` في جذر المشروع يحتوي على كل ما يلي:

---

## 1. هيكل التطبيق الكامل

### الصفحات العامة (Public) - 30 صفحة مُفعّلة

| الصفحة | المسار | الحالة |
|--------|--------|--------|
| الرئيسية | `/` | ✅ متصلة بـ DB |
| الموبايل | `/m` | ✅ متصلة بـ DB |
| بريميوم | `/premium` | ✅ عرض ثابت |
| الوجهات | `/destinations` | ✅ متصلة بـ DB |
| تفاصيل وجهة | `/destinations/:id` | ✅ متصلة بـ DB |
| البرامج | `/programs` | ✅ متصلة بـ DB |
| تفاصيل برنامج | `/programs/:id` | ✅ متصلة بـ DB |
| الفنادق | `/hotels` | ✅ متصلة بـ DB |
| تفاصيل فندق | `/hotels/:id` | ✅ متصلة بـ DB |
| الرحلات | `/flights` | ✅ متصلة بـ DB |
| حجز رحلة | `/flight-booking` | ⚠️ واجهة فقط |
| رحلات أماديوس | `/amadeus-flights` | ⚠️ تحتاج API key |
| العروض | `/offers` | ✅ متصلة بـ DB |
| شهر العسل | `/honeymoon` | ✅ متصلة بـ DB |
| الحجز | `/booking` | ✅ متصلة بـ DB |
| تأكيد الحجز | `/booking/confirmation` | ✅ عرض نتيجة |
| حجوزاتي | `/my-bookings` | ✅ متصلة بـ DB |
| البكجات الجاهزة | `/packages` | ✅ متصلة بـ DB (مُحدّثة) |
| مصمم الرحلات | `/trip-builder` | ✅ متصلة بـ DB |
| المدونة | `/blog` | ✅ متصلة بـ DB |
| مقال مدونة | `/blog/:slug` | ✅ متصلة بـ DB |
| الخدمات | `/services` | ✅ متصلة بـ DB |
| معلومات الخدمة | `/service-info` | ✅ عرض ثابت |
| ضمان الخدمة | `/service-guarantee` | ✅ عرض ثابت |
| صفحة الدولة | `/country/:countryId` | ✅ ديناميكية + fallback |
| تفاصيل مدينة | `/country/:countryId/city/:cityId` | ✅ ديناميكية |
| البحث | `/search` | ✅ |
| تواصل معنا | `/contact` | ✅ متصلة بـ DB |
| من نحن | `/about` | ✅ عرض ثابت |
| الكرة الأرضية | `/globe` | ⚠️ ثقيلة (three.js) |
| الولاء | `/loyalty` | ✅ عرض ثابت |
| الوظائف | `/careers` | ✅ عرض ثابت |
| تابي | `/tabby` | ✅ عرض ثابت |
| تمارا | `/tamara` | ✅ عرض ثابت |
| دعم العملاء | `/customer-support` | ✅ عرض ثابت |
| خريطة الموقع | `/sitemap` | ✅ |
| الخصوصية | `/privacy` | ✅ عرض ثابت |
| الشروط | `/terms` | ✅ عرض ثابت |

### صفحات مخفية (Routes معلقة) - 3 صفحات

| الصفحة | المسار | الحالة |
|--------|--------|--------|
| تأجير سيارات | `/car-rental` | ❌ Route معلق بتعليق |
| التأشيرات | `/visas` | ❌ Route معلق بتعليق |
| التأمين | `/insurance` | ❌ Route معلق بتعليق |

### صفحات مصادقة - 5 صفحات

| الصفحة | المسار | الحالة |
|--------|--------|--------|
| تسجيل الدخول | `/login` | ✅ |
| التسجيل | `/register` | ✅ |
| نسيت كلمة المرور | `/forgot-password` | ✅ |
| إعادة تعيين كلمة المرور | `/reset-password` | ✅ |
| Auth Callback | `/auth/callback` | ✅ |

### صفحات لوحة التحكم - مُفعّلة (لها Routes)

| الصفحة | المسار | الحالة |
|--------|--------|--------|
| لوحة القيادة | `/admin` | ✅ |
| الحجوزات | `/admin/bookings` | ✅ |
| البرامج | `/admin/programs` | ✅ |
| إضافة/تعديل برنامج | `/admin/programs/new`, `edit/:id` | ✅ |
| العروض | `/admin/offers` | ✅ |
| إضافة/تعديل عرض | `/admin/offers/new`, `edit/:id` | ✅ |
| البكجات الجاهزة | `/admin/ready-packages` | ✅ |
| الإعدادات | `/admin/settings` | ✅ (admin only) |
| إعدادات AI | `/admin/ai-settings` | ✅ (admin only) |
| دول جنوب شرق آسيا | `/admin/southeast-asia-countries` | ✅ (admin only) |
| مدن جنوب شرق آسيا | `/admin/southeast-asia-cities` | ✅ (admin only) |
| بذر البرامج | `/admin/seed-programs` | ✅ (admin only) |
| الخدمات | `/admin/services` | ✅ (admin only) |
| إضافة/تعديل خدمة | `/admin/services/new`, `edit/:id` | ✅ (admin only) |
| شهر العسل | `/admin/honeymoon` | ✅ (admin only) |
| باقات شهر العسل | `/admin/honeymoon/packages/new`, `edit/:id` | ✅ (admin only) |
| الصفحة الرئيسية | `/admin/homepage` | ✅ (admin only) |
| المدونة | `/admin/blog` | ✅ (admin only) |
| إضافة/تعديل مقال | `/admin/blog/new`, `edit/:id` | ✅ (admin only) |

### صفحات لوحة التحكم - مستوردة بدون Route ❌

هذه الصفحات لها ملفات ومُستوردة في App.tsx لكن **ليس لها `<Route>`**:

| الصفحة | ملف | الحالة |
|--------|------|--------|
| الوجهات (Admin) | `AdminDestinations` | ❌ لا يوجد route |
| إضافة وجهة | `AdminDestinationNew` | ❌ لا يوجد route |
| تعديل وجهة | `AdminDestinationEdit` | ❌ لا يوجد route |
| الفنادق (Admin) | `AdminHotels` | ❌ لا يوجد route |
| الرحلات (Admin) | `AdminFlights` | ❌ لا يوجد route |
| المدفوعات | `AdminPayments` | ❌ لا يوجد route |
| التقييمات | `AdminReviews` | ❌ لا يوجد route |
| المستخدمين | `AdminUsers` | ❌ لا يوجد route |
| الرسائل | `AdminMessages` | ❌ لا يوجد route |
| التقارير | `AdminReports` | ❌ لا يوجد route |
| المقالات | `AdminArticles` | ❌ لا يوجد route |
| قائمة التنقل | `AdminNavMenu` | ❌ لا يوجد route |
| الموبايل (Admin) | `AdminMobileHomepage` | ❌ لا يوجد route |
| بذر الدول | `AdminSeedCountries` | ❌ لا يوجد route |

### ملفات مكررة/قديمة 🗑️

| الملف | السبب |
|-------|-------|
| `src/pages/Thailand.tsx` | مكرر مع `src/pages/countries/Thailand.tsx` |
| `src/pages/Malaysia.tsx` | مكرر مع `src/pages/countries/Malaysia.tsx` |
| `src/pages/Indonesia.tsx` | مكرر مع `src/pages/countries/Indonesia.tsx` |
| `src/pages/Vietnam.tsx` | مكرر مع `src/pages/countries/Vietnam.tsx` |
| `src/pages/Philippines.tsx` | مكرر مع `src/pages/countries/Philippines.tsx` |
| `src/pages/Singapore.tsx` | مكرر مع `src/pages/countries/Singapore.tsx` |
| `src/pages/CityDetails.tsx` | مكرر - يُستخدم `CityTemplate` بدلاً منه |
| `src/pages/Api.tsx` | مستوردة لكن لا يوجد route لها |
| `design-masterpiece-page-main/` | مجلد مشروع قديم في الجذر |

---

## 2. سجل التعديلات الأخيرة

- إضافة نظام البكجات القابلة للتخصيص (تغيير فندق/طيران/سيارة مع تسعير حي)
- إنشاء صفحة إدارة البكجات `/admin/ready-packages`
- تحسين الأداء: code splitting، caching Supabase، lazy loading للمكتبات الثقيلة
- Migration لإضافة أعمدة الربط في `ready_packages`

## 3. قواعد التطوير

- استخدام `useAuth()` من `@/hooks/useAuth` (وليس hook مستقل)
- جميع الصفحات lazy loaded عبر `React.lazy()`
- صفحات Admin محمية بـ `ProtectedRoute`
- الصفحات العامة تستخدم `useSEO()` لـ meta tags
- الاستعلامات تستخدم caching في `tripBuilderService`
- التصميم RTL بالكامل (عربي)

## 4. المشاكل المعروفة

- Routes مكررة: `/destinations/:id` و `/destinations/:slug` (نفس الكومبوننت)
- 14 صفحة admin مستوردة بدون routes
- 6 ملفات دول مكررة في `src/pages/` و `src/pages/countries/`
- صفحة `/globe` ثقيلة (three.js) - تم عمل lazy loading لكن لا تزال كبيرة

---

## التنفيذ

إنشاء ملف `PROJECT_MEMORY.md` واحد في جذر المشروع يحتوي كل المعلومات أعلاه بتنسيق markdown منظم.

