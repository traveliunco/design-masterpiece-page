# 🧠 ذاكرة مشروع Traveliun

> آخر تحديث: 2026-03-08

---

## 1. هيكل التطبيق الكامل

### الصفحات العامة (Public) - 30+ صفحة

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

### صفحات المصادقة - 5 صفحات

| الصفحة | المسار | الحالة |
|--------|--------|--------|
| تسجيل الدخول | `/login` | ✅ |
| التسجيل | `/register` | ✅ |
| نسيت كلمة المرور | `/forgot-password` | ✅ |
| إعادة تعيين كلمة المرور | `/reset-password` | ✅ |
| Auth Callback | `/auth/callback` | ✅ |

### صفحات لوحة التحكم (Admin)

| الصفحة | المسار | الصلاحية |
|--------|--------|----------|
| لوحة القيادة | `/admin` | admin + moderator |
| الحجوزات | `/admin/bookings` | admin + moderator |
| البرامج | `/admin/programs` | admin + moderator |
| إضافة/تعديل برنامج | `/admin/programs/new`, `edit/:id` | admin + moderator |
| العروض | `/admin/offers` | admin + moderator |
| إضافة/تعديل عرض | `/admin/offers/new`, `edit/:id` | admin + moderator |
| البكجات الجاهزة | `/admin/ready-packages` | admin + moderator |
| الوجهات | `/admin/destinations` | admin only |
| إضافة/تعديل وجهة | `/admin/destinations/new`, `edit/:id` | admin only |
| الفنادق | `/admin/hotels` | admin only |
| الرحلات | `/admin/flights` | admin only |
| المدفوعات | `/admin/payments` | admin only |
| التقييمات | `/admin/reviews` | admin only |
| المستخدمين | `/admin/users` | admin only |
| الرسائل | `/admin/messages` | admin only |
| التقارير | `/admin/reports` | admin only |
| المقالات | `/admin/articles` | admin only |
| قائمة التنقل | `/admin/nav-menu` | admin only |
| الموبايل | `/admin/mobile-homepage` | admin only |
| بذر الدول | `/admin/seed-countries` | admin only |
| الإعدادات | `/admin/settings` | admin only |
| إعدادات AI | `/admin/ai-settings` | admin only |
| دول جنوب شرق آسيا | `/admin/southeast-asia-countries` | admin only |
| مدن جنوب شرق آسيا | `/admin/southeast-asia-cities` | admin only |
| بذر البرامج | `/admin/seed-programs` | admin only |
| الخدمات | `/admin/services` | admin only |
| شهر العسل | `/admin/honeymoon` | admin only |
| الصفحة الرئيسية | `/admin/homepage` | admin only |
| المدونة | `/admin/blog` | admin only |

---

## 2. سجل التعديلات

| التاريخ | التعديل |
|---------|---------|
| 2026-03-08 | إنشاء PROJECT_MEMORY.md + إضافة 14 route admin مفقود + حذف ملفات مكررة |
| 2026-03-08 | تحسين الأداء: code splitting، caching Supabase، lazy loading |
| 2026-03-07 | نظام البكجات القابلة للتخصيص + صفحة إدارة البكجات |
| 2026-03-07 | Migration لأعمدة الربط في ready_packages |

---

## 3. قواعد التطوير

1. **Auth**: استخدام `useAuth()` من `@/hooks/useAuth` فقط
2. **Lazy Loading**: جميع الصفحات عبر `React.lazy()`
3. **حماية Admin**: كل صفحة admin محمية بـ `ProtectedRoute` مع `requiredRole`
4. **SEO**: الصفحات العامة تستخدم `useSEO()` لـ meta tags
5. **Caching**: استعلامات Supabase تستخدم cache في `tripBuilderService`
6. **RTL**: التصميم بالكامل عربي RTL
7. **Design Tokens**: استخدام semantic tokens من `index.css` وليس ألوان مباشرة
8. **الأدوار**: `user_roles` table مع `has_role()` function (وليس من جدول users)

---

## 4. المشاكل المعروفة

- صفحة `/globe` ثقيلة (three.js) - تم عمل lazy loading لكن لا تزال كبيرة
- `/flight-booking` واجهة فقط بدون ربط فعلي
- `/amadeus-flights` تحتاج Amadeus API key للعمل
- 3 صفحات معلقة: car-rental, visas, insurance

---

## 5. البنية التقنية

```
src/
├── components/          # مكونات مشتركة
│   ├── admin/          # AdminLayout
│   ├── flights/        # مكونات الرحلات
│   ├── globe/          # الكرة الأرضية
│   ├── maps/           # خرائط Leaflet
│   ├── templates/      # CountryTemplate, CityTemplate
│   ├── trip-builder/   # مصمم الرحلات
│   └── ui/             # shadcn/ui components
├── contexts/           # FavoritesContext, NavigationContext
├── data/               # بيانات ثابتة (airports, destinations)
├── hooks/              # useAuth, useSEO, useAmadeus, etc.
├── integrations/       # Supabase client + types
├── layouts/            # PageLayout
├── pages/              # صفحات عامة
│   ├── admin/          # صفحات لوحة التحكم
│   └── countries/      # صفحات الدول
├── services/           # خدمات (admin, AI, amadeus, booking, etc.)
└── styles/             # أنماط إضافية
```
