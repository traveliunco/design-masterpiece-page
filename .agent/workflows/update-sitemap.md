---
description: Update sitemap page automatically when new routes are added
---

# تحديث خريطة الموقع تلقائياً

هذا السير العمل يشرح كيفية إضافة صفحات جديدة وتحديث خريطة الموقع.

## 1. إضافة صفحة جديدة للتطبيق

عند إضافة صفحة جديدة:

1. أنشئ ملف الصفحة في `src/pages/`
2. أضف lazy import في `src/App.tsx`:
   ```tsx
   const NewPage = lazy(() => import("./pages/NewPage"));
   ```
3. أضف المسار في Routes:
   ```tsx
   <Route path="/new-page" element={<NewPage />} />
   ```

## 2. تحديث خريطة الموقع

افتح ملف `src/pages/Sitemap.tsx` وأضف الرابط الجديد في الثابت `allRoutes`:

```tsx
const allRoutes = {
  main: [
    // ... الروابط الحالية
    { name: "اسم الصفحة", path: "/new-page", icon: IconName },
  ],
  // أو في القسم المناسب: services, destinations, booking, etc.
};
```

## 3. الأقسام المتاحة في خريطة الموقع

- `main` - الصفحات الرئيسية
- `services` - الخدمات
- `destinations` - الوجهات  
- `booking` - الحجز والدفع
- `loyalty` - برامج الولاء
- `content` - المحتوى
- `company` - معلومات الشركة

## 4. إضافة دول/مدن جديدة

الدول والمدن تُضاف تلقائياً من `src/data/southeast-asia.ts`:

1. افتح `src/data/southeast-asia.ts`
2. أضف الدولة/المدينة الجديدة في `southeastAsiaCountries`
3. ستظهر تلقائياً في خريطة الموقع وصفحة الكرة الأرضية

## 5. الروابط في الفوتر

رابط خريطة الموقع موجود في `src/components/PremiumFooter.tsx`:
- السطر 162-164: رابط "خريطة الموقع"

## الملفات المرتبطة

- `src/pages/Sitemap.tsx` - صفحة خريطة الموقع
- `src/App.tsx` - جميع المسارات
- `src/data/southeast-asia.ts` - بيانات الدول والمدن
- `src/components/PremiumFooter.tsx` - الفوتر مع رابط الخريطة
