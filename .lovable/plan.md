

# خطة شاملة: استبدال شريط البحث + إصلاح لوحة التحكم

## المهمة 1: استبدال HeroSearch بـ SkyscannerSearch في الدسكتوب

**المشكلة:** شريط البحث الحالي في الهيرو (`HeroSearch`) يعرض بحث نصي بسيط مع تبويبات. المطلوب استخدام نفس مكون `SkyscannerSearch` الموجود في صفحة الموبايل.

**التعديل:**
- `src/components/PremiumHeroSection.tsx`: استبدال `<HeroSearch />` بـ `<SkyscannerSearch variant="hero" />` مع تنسيق مناسب للهيرو (خلفية شفافة، نصوص بيضاء).

---

## المهمة 2: إصلاح RLS — لوحة التحكم لا يمكنها قراءة البيانات

**المشكلة الجذرية:** 5 جداول تفتقر لسياسات RLS للمسؤولين، مما يعني أن لوحة التحكم تعرض بيانات فارغة أو أخطاء:

| الجدول | المشكلة | الإصلاح |
|--------|---------|---------|
| `bookings` | SELECT فقط لصاحب الحجز | إضافة سياسة admin ALL |
| `contact_messages` | INSERT فقط، لا SELECT/UPDATE/DELETE | إضافة سياسات admin SELECT/UPDATE/DELETE |
| `payments` | SELECT فقط لصاحب الدفعة | إضافة سياسة admin ALL |
| `reviews` | لا يوجد admin policy | إضافة سياسة admin ALL |
| `users` | SELECT/UPDATE فقط للمستخدم نفسه | إضافة سياسة admin SELECT + UPDATE |

**Migration SQL:**
```sql
-- bookings: admin full access
CREATE POLICY "Admin manage all bookings" ON public.bookings FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- contact_messages: admin full access
CREATE POLICY "Admin manage contact_messages" ON public.contact_messages FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- payments: admin full access
CREATE POLICY "Admin manage payments" ON public.payments FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- reviews: admin full access
CREATE POLICY "Admin manage reviews" ON public.reviews FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- users: admin read + update
CREATE POLICY "Admin read all users" ON public.users FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin update users" ON public.users FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));
```

---

## المهمة 3: إصلاح صفحات Admin المعطلة بسبب جداول/أعمدة غير متطابقة

**الصفحات المتأثرة والإصلاحات:**

1. **`admin/Payments.tsx`** — يستعلم من `payments` مع join على `bookings(booking_reference)` و `users(full_name, email)`. جدول `users` لا يحتوي على `full_name` — يجب تعديل الـ join ليستخدم `first_name, last_name` بدلاً منه أو يستخدم `profiles`.

2. **`admin/Reviews.tsx`** — يستعلم من `reviews` مع join على `users(full_name)` — نفس المشكلة.

3. **`admin/Users.tsx`** — يستعلم من `users` مباشرة. يحتاج admin RLS policy.

4. **`admin/Bookings.tsx`** — يستعلم من `bookings` مع join على `user:users(id, full_name, email, phone)` — `full_name` غير موجود في `users`.

5. **`admin/Dashboard.tsx`** — يستعلم `users` count — يحتاج admin RLS.

6. **`admin/Reports.tsx`** — يستعلم `users` count و `payments` — يحتاج admin RLS.

**الحل للـ joins:** تعديل الاستعلامات لتستخدم `profiles(first_name, last_name)` بدلاً من `users(full_name)` حيث أن جدول `profiles` موجود ومرتبط بـ `auth.users`.

---

## ملخص الملفات المتأثرة

| الملف | نوع التعديل |
|-------|-------------|
| `PremiumHeroSection.tsx` | استبدال HeroSearch بـ SkyscannerSearch |
| Migration SQL | إضافة 7 سياسات RLS للمسؤولين |
| `admin/Payments.tsx` | إصلاح join query |
| `admin/Reviews.tsx` | إصلاح join query |
| `admin/Bookings.tsx` | إصلاح join query |
| `admin/Users.tsx` | تعديل لاستخدام profiles |
| `admin/Dashboard.tsx` | تعديل query ليستخدم profiles count |
| `admin/Reports.tsx` | تعديل query ليستخدم profiles count |

