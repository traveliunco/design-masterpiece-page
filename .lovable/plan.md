

# تحويل جميع الصفحات لتصميم تطبيق الجوال

## المشكلة
الصفحة الرئيسية فقط (`MobileHomePage`) لها تصميم تطبيق جوال (هيدر خفيف + شريط بحث + تنقل سفلي). باقي الـ 30+ صفحة تستخدم `PageLayout` الذي يعرض `Nav3D` الثقيل و `PremiumFooter` الكبير حتى على الموبايل.

## الحل: تعديل مركزي في 3 ملفات

### 1. تعديل `PageLayout` — إضافة هيدر موبايل خفيف
- على الموبايل: إخفاء `Nav3D` و `PremiumFooter`
- عرض هيدر خفيف بدلاً منه (شعار + عنوان الصفحة + زر رجوع)
- عرض فوتر بسيط مصغر
- إبقاء `MobileNav` (الشريط السفلي)
- على الديسكتوب: لا تغيير

### 2. تعديل `PageHeader` — تصغير على الموبايل
- تقليل `min-h-[50vh]` إلى `min-h-[30vh]` على الموبايل
- تصغير حجم العنوان والوصف
- تقليل الـ padding

### 3. تعديل صفحات Auth (Login, Register, ForgotPassword, ResetPassword)
- استخدام `PageLayout` بدلاً من `Nav3D` + `Footer` المباشرة
- لتوحيد التجربة

## التفاصيل التقنية

### `PageLayout` الجديد:
```
على الموبايل:
┌─────────────────────┐
│ ← عنوان الصفحة  🔔 👤│  ← هيدر خفيف sticky
├─────────────────────┤
│                     │
│    محتوى الصفحة     │
│                     │
├─────────────────────┤
│  روابط سريعة مصغرة  │  ← فوتر بسيط
├─────────────────────┤
│ 🏠  🗺️  🎁  👤     │  ← MobileNav (موجود)
└─────────────────────┘
```

### الصفحات المتأثرة (34 صفحة):
كل صفحة تستخدم `PageLayout` ستتحسن تلقائياً:
- Destinations, Programs, Hotels, Flights, Offers
- Contact, About, Services, Blog, Honeymoon
- Booking, MyBookings, Search, Careers, Loyalty
- Privacy, Terms, Sitemap, وغيرها

### الصفحات التي تحتاج تعديل يدوي:
- `Login.tsx` — يستخدم `Nav3D` + `Footer` مباشرة
- `Register.tsx` — نفس الشيء
- `ForgotPassword.tsx`, `ResetPassword.tsx`

## الملفات المعدلة:
1. `src/layouts/PageLayout.tsx` — إضافة هيدر/فوتر موبايل
2. `src/components/ui/PageHeader.tsx` — responsive sizing
3. `src/pages/Login.tsx` — استخدام PageLayout
4. `src/pages/Register.tsx` — استخدام PageLayout
5. `src/pages/ForgotPassword.tsx` — استخدام PageLayout
6. `src/pages/ResetPassword.tsx` — استخدام PageLayout

