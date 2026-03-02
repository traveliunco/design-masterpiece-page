-- ═══════════════════════════════════════════════════════════════
-- Traveliun Admin Management Tables
-- الصفحة الرئيسية + شهر العسل + الخدمات + المدونة
-- نفذ هذا الملف في Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════
-- 1. HOMEPAGE: Hero Slides
CREATE TABLE IF NOT EXISTS homepage_hero_slides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '',
    highlight TEXT NOT NULL DEFAULT '',
    subtitle TEXT DEFAULT '',
    description TEXT DEFAULT '',
    image TEXT DEFAULT '',
    stats JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
-- 2. HOMEPAGE: Features (لماذا ترافليون)
CREATE TABLE IF NOT EXISTS homepage_features (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    icon TEXT NOT NULL DEFAULT 'Shield',
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    color TEXT DEFAULT 'text-teal-500',
    bg_color TEXT DEFAULT '',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
-- 3. HOMEPAGE: Stats (الإحصائيات)
CREATE TABLE IF NOT EXISTS homepage_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    number TEXT NOT NULL,
    label TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
-- 4. HOMEPAGE: Testimonials (آراء العملاء)
CREATE TABLE IF NOT EXISTS homepage_testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT DEFAULT '',
    text TEXT NOT NULL,
    rating INT DEFAULT 5 CHECK (
        rating >= 1
        AND rating <= 5
    ),
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
-- 5. HOMEPAGE: Settings (CTA + إعدادات عامة)
CREATE TABLE IF NOT EXISTS homepage_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT now()
);
-- إدخال بيانات CTA الافتراضية
INSERT INTO homepage_settings (key, value)
VALUES ('cta_title', 'جاهز تبدأ'),
    ('cta_highlight', 'رحلتك'),
    (
        'cta_description',
        'فريقنا جاهز لمساعدتك في التخطيط لرحلة أحلامك. تواصل معنا الآن واحصل على استشارة مجانية.'
    ),
    ('cta_whatsapp_number', '966569222111'),
    ('cta_phone_number', '966569222111'),
    ('cta_working_hours', 'نعمل على مدار الساعة 24/7') ON CONFLICT (key) DO NOTHING;
-- 6. HONEYMOON: Packages (باقات شهر العسل)
CREATE TABLE IF NOT EXISTS honeymoon_packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    destination TEXT DEFAULT '',
    description TEXT DEFAULT '',
    duration TEXT DEFAULT '',
    badge TEXT DEFAULT '',
    price NUMERIC DEFAULT 0,
    old_price NUMERIC DEFAULT 0,
    rating NUMERIC DEFAULT 5,
    reviews INT DEFAULT 0,
    emoji TEXT DEFAULT '🌙',
    image TEXT DEFAULT '',
    features JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
-- 7. HONEYMOON: Included Features (الخدمات المتضمنة)
CREATE TABLE IF NOT EXISTS honeymoon_features (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    icon TEXT DEFAULT 'Heart',
    title TEXT NOT NULL,
    color TEXT DEFAULT 'text-rose-500',
    bg_color TEXT DEFAULT '',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
-- 8. HONEYMOON: Testimonials (تقييمات شهر العسل)
CREATE TABLE IF NOT EXISTS honeymoon_testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT DEFAULT '',
    destination TEXT DEFAULT '',
    text TEXT NOT NULL,
    rating INT DEFAULT 5 CHECK (
        rating >= 1
        AND rating <= 5
    ),
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
-- 9. SERVICES (الخدمات)
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    path TEXT DEFAULT '',
    icon TEXT DEFAULT 'Briefcase',
    color TEXT DEFAULT 'text-teal-500',
    emoji TEXT DEFAULT '✈️',
    features JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
-- 10. BLOG: Articles (المدونة)
CREATE TABLE IF NOT EXISTS blog_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT DEFAULT '',
    content TEXT DEFAULT '',
    cover_image TEXT DEFAULT '',
    author_name TEXT DEFAULT 'فريق ترافليون',
    category TEXT DEFAULT 'دليل السفر',
    tags TEXT [] DEFAULT '{}',
    reading_time INT DEFAULT 5,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    published_at DATE DEFAULT CURRENT_DATE,
    views INT DEFAULT 0,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
-- ═══════════ Enable RLS ═══════════
ALTER TABLE homepage_hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE honeymoon_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE honeymoon_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE honeymoon_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;
-- ═══════════ RLS Policies: Public Read ═══════════
CREATE POLICY "Public can read homepage_hero_slides" ON homepage_hero_slides FOR
SELECT USING (true);
CREATE POLICY "Public can read homepage_features" ON homepage_features FOR
SELECT USING (true);
CREATE POLICY "Public can read homepage_stats" ON homepage_stats FOR
SELECT USING (true);
CREATE POLICY "Public can read homepage_testimonials" ON homepage_testimonials FOR
SELECT USING (true);
CREATE POLICY "Public can read homepage_settings" ON homepage_settings FOR
SELECT USING (true);
CREATE POLICY "Public can read honeymoon_packages" ON honeymoon_packages FOR
SELECT USING (true);
CREATE POLICY "Public can read honeymoon_features" ON honeymoon_features FOR
SELECT USING (true);
CREATE POLICY "Public can read honeymoon_testimonials" ON honeymoon_testimonials FOR
SELECT USING (true);
CREATE POLICY "Public can read services" ON services FOR
SELECT USING (true);
CREATE POLICY "Public can read blog_articles" ON blog_articles FOR
SELECT USING (true);
-- ═══════════ RLS Policies: Auth users full access ═══════════
CREATE POLICY "Auth users manage homepage_hero_slides" ON homepage_hero_slides FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage homepage_features" ON homepage_features FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage homepage_stats" ON homepage_stats FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage homepage_testimonials" ON homepage_testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage homepage_settings" ON homepage_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage honeymoon_packages" ON honeymoon_packages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage honeymoon_features" ON honeymoon_features FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage honeymoon_testimonials" ON honeymoon_testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage blog_articles" ON blog_articles FOR ALL USING (auth.role() = 'authenticated');
-- ═══════════ Updated At Triggers ═══════════
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER set_updated_at_homepage_hero_slides BEFORE
UPDATE ON homepage_hero_slides FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_homepage_features BEFORE
UPDATE ON homepage_features FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_honeymoon_packages BEFORE
UPDATE ON honeymoon_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_services BEFORE
UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_blog_articles BEFORE
UPDATE ON blog_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();