-- ======================================================
-- جدول العروض الخاصة للرحلات السياحية
-- special_offers: الباقات والعروض المعروضة في صفحة /offers
-- ======================================================

CREATE TABLE IF NOT EXISTS special_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- العنوان
    title_ar TEXT NOT NULL,
    title_en TEXT,
    slug TEXT UNIQUE NOT NULL,

    -- التصنيف والوجهة
    offer_type TEXT NOT NULL DEFAULT 'seasonal',
    -- seasonal, flash, honeymoon, family, lastminute, earlybird, group, weekend
    destination TEXT DEFAULT '',
    countries TEXT[] DEFAULT '{}',

    -- الصور والوصف
    cover_image TEXT,
    description_ar TEXT,
    highlights TEXT[] DEFAULT '{}',

    -- التسعير
    original_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    discounted_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    discount_percentage INTEGER DEFAULT 0,
    currency TEXT DEFAULT 'SAR',

    -- التفاصيل
    duration TEXT,
    includes TEXT[] DEFAULT '{}',
    terms TEXT,

    -- التواريخ
    valid_until TIMESTAMPTZ,

    -- الحالة
    is_hot BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- فهارس
CREATE INDEX IF NOT EXISTS idx_special_offers_active  ON special_offers (is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_special_offers_type    ON special_offers (offer_type);
CREATE INDEX IF NOT EXISTS idx_special_offers_hot     ON special_offers (is_hot) WHERE is_hot = true;

-- RLS
ALTER TABLE special_offers ENABLE ROW LEVEL SECURITY;

-- قراءة عامة للجميع
DROP POLICY IF EXISTS "special_offers_public_read" ON special_offers;
CREATE POLICY "special_offers_public_read"
    ON special_offers FOR SELECT
    USING (is_active = true);

-- كتابة للمشرفين فقط
DROP POLICY IF EXISTS "special_offers_admin_all" ON special_offers;
CREATE POLICY "special_offers_admin_all"
    ON special_offers FOR ALL
    USING (auth.role() = 'authenticated');

-- Trigger لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_special_offers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS special_offers_updated_at ON special_offers;
CREATE TRIGGER special_offers_updated_at
    BEFORE UPDATE ON special_offers
    FOR EACH ROW EXECUTE FUNCTION update_special_offers_updated_at();

-- بيانات تجريبية أولية
INSERT INTO special_offers (title_ar, title_en, slug, offer_type, destination, countries, cover_image, description_ar, original_price, discounted_price, discount_percentage, duration, includes, valid_until, is_hot, is_featured)
VALUES
(
    'باقة ماليزيا الذهبية',
    'Malaysia Golden Package',
    'malaysia-golden-package',
    'family',
    'ماليزيا',
    ARRAY['ماليزيا'],
    'https://images.unsplash.com/photo-1596422846543-75c6fc197f07',
    'استمتع برحلة لا تُنسى في ماليزيا مع أفضل الفنادق والجولات السياحية',
    3999, 2999, 25, '7 أيام / 6 ليالي',
    ARRAY['تذاكر طيران', 'فندق 5 نجوم', 'جولات سياحية', 'إفطار يومي'],
    NOW() + INTERVAL '30 days',
    true, true
),
(
    'عرض تركيا الخاص',
    'Turkey Special Offer',
    'turkey-special-offer',
    'seasonal',
    'تركيا',
    ARRAY['تركيا'],
    'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200',
    'اكتشف جمال تركيا بأسعار لا تُقاوم',
    4500, 3200, 29, '8 أيام / 7 ليالي',
    ARRAY['طيران مباشر', 'فندق 4 نجوم', 'نقل من وإلى المطار', 'مرشد سياحي'],
    NOW() + INTERVAL '45 days',
    false, true
),
(
    'جزر المالديف - شهر عسل',
    'Maldives Honeymoon',
    'maldives-honeymoon',
    'honeymoon',
    'المالديف',
    ARRAY['المالديف'],
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8',
    'قضِ أجمل أيام عمرك في المالديف مع باقة شهر العسل الفاخرة',
    12000, 8800, 27, '6 أيام / 5 ليالي',
    ARRAY['طيران', 'فيلا على الماء', 'وجبات كاملة', 'رحلات غوص', 'سبا للزوجين'],
    NOW() + INTERVAL '60 days',
    true, true
)
ON CONFLICT (slug) DO NOTHING;
