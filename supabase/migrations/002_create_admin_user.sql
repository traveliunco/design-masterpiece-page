-- =============================================
-- إنشاء حساب Admin تجريبي للوحة التحكم
-- =============================================
-- 
-- يمكنك تشغيل هذا في Supabase SQL Editor بعد تفعيل Auth
-- 
-- بيانات الدخول التجريبية:
-- البريد: admin@traveliun.com
-- كلمة المرور: Admin@123456
--
-- =============================================

-- أولاً: إنشاء المستخدم في جدول auth.users (يتم عبر Supabase Dashboard)
-- ثانياً: إضافة بيانات المستخدم في جدول users

-- ملاحظة: يجب إنشاء المستخدم أولاً من Supabase Dashboard > Authentication > Users > Add user
-- ثم استخدم الـ UUID الناتج في الاستعلام التالي

-- مثال (استبدل YOUR_USER_UUID بالـ UUID الفعلي):
/*
INSERT INTO users (
    id,
    email,
    phone,
    first_name,
    last_name,
    first_name_ar,
    last_name_ar,
    role,
    status,
    email_verified,
    preferred_language,
    preferred_currency
) VALUES (
    'YOUR_USER_UUID',
    'admin@traveliun.com',
    '+966569222111',
    'Admin',
    'Traveliun',
    'المدير',
    'ترافليون',
    'admin',
    'active',
    true,
    'ar',
    'SAR'
) ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    status = 'active';
*/

-- =============================================
-- التعليمات:
-- =============================================
-- 
-- 1. افتح Supabase Dashboard
-- 2. اذهب إلى Authentication > Users
-- 3. اضغط "Add user"
-- 4. أدخل:
--    - Email: admin@traveliun.com
--    - Password: Admin@123456
--    - تفعيل "Auto Confirm User"
-- 5. انسخ الـ UUID الناتج
-- 6. شغّل الاستعلام أعلاه مع الـ UUID
--
-- =============================================
