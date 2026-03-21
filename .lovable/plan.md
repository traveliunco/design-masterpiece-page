

# توحيد الهوية اللونية للصفحة الرئيسية

## المشكلة الحالية
التطبيق يستخدم ألوان متشتتة: teal، cyan، gold، emerald، indigo، green - مما يعطي انطباع "تطبيق مبني بالذكاء الصناعي".

## الحل: لوحة ألوان موحدة
```text
اللون الأساسي:    أزرق داكن     #1e3a5f (hsl 213 52% 25%)
اللون الثانوي:    أزرق فاتح     #3b82f6 (hsl 217 91% 60%)  
اللون المميز:     أزرق سماوي    #60a5fa (hsl 217 92% 68%)
الخلفية الداكنة:  رمادي-أزرق    #0f172a (hsl 222 47% 11%)
النصوص الفرعية:   رمادي          #94a3b8
```

## الملفات المتأثرة

### 1. `src/index.css` - تغيير متغيرات CSS الجذرية
- `--primary`: من teal إلى أزرق داكن `213 52% 25%`
- `--secondary`: من gold إلى أزرق فاتح `217 91% 60%`
- `--accent`: أزرق سماوي `217 92% 68%`
- `--ring`: أزرق
- `::selection`: أزرق
- تحديث `.text-gradient-gold` → تدرج أزرق
- تحديث `.text-gradient-teal` → تدرج أزرق
- تحديث `.btn-luxury` و `.btn-gold` → تدرجات أزرق
- تحديث `.glow-gold` و `.glow-teal` → توهج أزرق

### 2. `tailwind.config.ts` - ألوان Tailwind
- `luxury-gold` → أزرق فاتح
- `luxury-teal` → أزرق داكن
- `glow-teal` و `glow-gold` → ظلال أزرق

### 3. `src/components/PremiumHeroSection.tsx`
- الـ overlay: تدرج أزرق-رمادي بدل teal
- الـ floating orbs: أزرق بدل secondary/accent
- زر CTA: أزرق بدل gold
- الإحصائيات: أزرق فاتح بدل secondary
- الـ highlight في العنوان: تدرج أزرق بدل gold

### 4. `src/components/WhyChooseUs.tsx`
- توحيد ألوان الأيقونات كلها لدرجات الأزرق فقط
- شريط الإحصائيات: تدرج أزرق بدل teal-cyan-blue
- الحدود عند hover: أزرق

### 5. `src/components/InteractiveDestinations.tsx`
- الأزرار النشطة: أزرق داكن (موجود)
- شريط معلومات الدولة: تدرج أزرق
- overlay المدن: أزرق-رمادي بدل teal
- زر "اكتشف الوجهات": أزرق
- نجمة التقييم: أزرق

### 6. `src/components/MarqueeBanner.tsx`
- الخلفية: تدرج أزرق بدل teal-cyan-blue
- الأيقونات: أزرق فاتح بدل cyan

### 7. `src/components/HoneymoonSection.tsx`
- الخلفية: تدرج أزرق-رمادي داكن
- الأيقونات والنصوص المميزة: أزرق فاتح بدل cyan
- زر CTA: أزرق

### 8. `src/components/TestimonialsSection.tsx`
- نجوم التقييم: أزرق بدل teal
- أيقونات الثقة: أزرق
- حدود hover: أزرق

### 9. `src/components/CTASection.tsx`
- الخلفية: تدرج أزرق-رمادي
- زر الاتصال: أزرق بدل teal
- النص المميز: تدرج أزرق

### 10. `src/components/PremiumFooter.tsx`
- اللوغو: تدرج أزرق بدل teal-emerald
- hover الروابط: أزرق فاتح بدل gold
- الأيقونات الاجتماعية: hover أزرق
- التوهج الخلفي: أزرق بدل teal/gold

### 11. `src/components/Nav3D.tsx`
- ألوان اللوغو والتفاعلات: أزرق بدل teal

## القواعد
- لا تغيير في البيانات أو المحتوى النصي
- لا تغيير في الهيكل أو التخطيط
- فقط استبدال الألوان لتكون موحدة بدرجات الأزرق والرمادي الداكن

