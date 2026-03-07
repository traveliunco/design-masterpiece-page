-- ======================================================
-- إضافة أعمدة مفقودة لجدول programs
-- countries, highlights, original_price
-- ======================================================

-- حقل الدول (مصفوفة نصية)
ALTER TABLE programs
    ADD COLUMN IF NOT EXISTS countries TEXT[] DEFAULT '{}';

-- حقل أبرز المحطات (مصفوفة نصية)
ALTER TABLE programs
    ADD COLUMN IF NOT EXISTS highlights TEXT[] DEFAULT '{}';

-- حقل السعر الأصلي (قبل الخصم)
ALTER TABLE programs
    ADD COLUMN IF NOT EXISTS original_price DECIMAL(10, 2);

-- إضافة نوع "luxury" المستخدم في الواجهة (إذا لم يكن موجوداً)
ALTER TABLE programs
    DROP CONSTRAINT IF EXISTS programs_program_type_check;

ALTER TABLE programs
    ADD CONSTRAINT programs_program_type_check
    CHECK (program_type IN (
        'honeymoon', 'family', 'adventure', 'cultural',
        'beach', 'city_tour', 'safari', 'cruise', 'budget', 'luxury'
    ));
