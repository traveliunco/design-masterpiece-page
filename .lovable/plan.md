

# خطة تحسين سرعة التطبيق الشاملة

## المشاكل المكتشفة

### 1. استعلامات Supabase مكررة عند كل تنقل
- `user_roles` و `user_favorites` تُستدعى مرتين عند كل تنقل (ظاهرة في Network requests)
- `MobileNav` يستدعي `mobileHomepageService.getData()` عند كل تغيير في `location.pathname`
- `Nav3D` يعيد جلب `navLinks` عند كل تغيير في `location.pathname`
- `FavoritesContext` يعيد الجلب من Supabase عند كل تغيير في `user`

### 2. Nav3D ثقيل جداً (840 سطر)
- يستورد 18 أيقونة من lucide-react
- يحتوي على mega menu بحجم كبير ثابت في الذاكرة
- أنيميشن `float3d` و `rotate3d` تعمل بشكل دائم على اللوغو (GPU drain)
- 3 عناصر "floating particles" بأنيميشن `pulse` دائمة حول اللوغو
- يعيد حساب `activeNavLinks` عند كل render

### 3. PremiumHeroSection يحمّل صور ثقيلة
- 3 صور خلفية (imports) تُحمّل كلها فوراً حتى لو غير ظاهرة
- `homepageService.getHeroSlides()` تُستدعى عند كل mount بدون cache
- الصور من قاعدة البيانات تحتوي على base64 ضخم (ظاهر في network response)

### 4. CSS يفرض `transform: translateZ(0)` على كل العناصر التفاعلية
- السطر 174-180 في `index.css` يطبق `will-change: auto` و `translateZ(0)` على كل `a, button, input, select, textarea` وكل عنصر يحتوي على `transition` أو `animate` - هذا يستهلك GPU بشكل مفرط

### 5. `scroll-behavior: smooth` على مستوى HTML
- يبطئ التنقل بين الصفحات

### 6. `content-visibility: auto` على كل section/article
- قد يسبب layout shifts ومشاكل في الأداء مع العناصر الكبيرة

## الحلول المقترحة

### الملف 1: `src/index.css`
- إزالة `scroll-behavior: smooth` من `html`
- إزالة قاعدة `translateZ(0)` و `will-change: auto` الشاملة (السطر 174-180) - هذه تضر أكثر مما تنفع
- تقليل نطاق `content-visibility: auto` ليشمل فقط `main > section`

### الملف 2: `src/components/Nav3D.tsx`
- تحويل `navLinks` لاستخدام `useMemo` بدلاً من `useState` + `useEffect`
- إزالة أنيميشن `rotate3d` الدائمة من اللوغو (الأثقل)
- تبسيط الـ floating particles (إزالة 2 من 3)
- Lazy render لـ mega menu dropdown (لا يُرندر إلا عند الفتح)

### الملف 3: `src/components/MobileNav.tsx`
- إزالة إعادة جلب `mobileHomepageService.getData()` عند كل تغيير route - يكفي مرة واحدة عند الـ mount
- تبسيط `getActiveIndex` لتجنب استدعائه مرتين

### الملف 4: `src/contexts/FavoritesContext.tsx`
- إضافة flag لمنع إعادة الجلب المتكرر من Supabase

### الملف 5: `src/components/PremiumHeroSection.tsx`
- تأجيل تحميل الصور غير المرئية باستخدام `loading="lazy"` على الـ background images
- Cache نتيجة `getHeroSlides` في الذاكرة

### الملف 6: `src/hooks/useAuth.tsx`
- إضافة `useRef` لمنع استدعاء `fetchUserRole` أكثر من مرة لنفس المستخدم

### الملف 7: `src/components/ScrollToTop.tsx`
- التأكد من أن السلوك `instant` (تم تطبيقه سابقاً)

## الملفات المتأثرة

| الملف | العملية |
|---|---|
| `src/index.css` | إزالة CSS rules ضارة بالأداء |
| `src/components/Nav3D.tsx` | تخفيف أنيميشن + memoize + lazy dropdown |
| `src/components/MobileNav.tsx` | إيقاف إعادة الجلب عند كل تنقل |
| `src/contexts/FavoritesContext.tsx` | منع الجلب المكرر |
| `src/components/PremiumHeroSection.tsx` | تحسين تحميل الصور |
| `src/hooks/useAuth.tsx` | منع استدعاء fetchUserRole المكرر |

## النتيجة المتوقعة
- تقليل عدد Network requests بنسبة ~50% عند التنقل
- تقليل استهلاك GPU بإزالة الأنيميشنات الدائمة غير المرئية
- تسريع التنقل بين الصفحات بشكل ملحوظ
- لا تأثير على شكل التطبيق أو البيانات

