-- =============================
-- جداول الدول والمدن السياحية
-- =============================
-- جدول الدول السياحية
CREATE TABLE IF NOT EXISTS tour_countries (
    id TEXT PRIMARY KEY,
    -- slug مثل: thailand, malaysia
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    flag_emoji TEXT DEFAULT '🌍',
    currency TEXT,
    language TEXT,
    visa TEXT,
    best_season TEXT,
    trip_duration TEXT,
    climate TEXT,
    budget TEXT,
    coordinates_lat DECIMAL(10, 6),
    coordinates_lng DECIMAL(10, 6),
    highlights TEXT [] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- جدول المدن السياحية
CREATE TABLE IF NOT EXISTS tour_cities (
    id TEXT NOT NULL,
    -- slug مثل: bangkok, phuket
    country_id TEXT NOT NULL REFERENCES tour_countries(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT,
    image TEXT,
    best_time TEXT,
    average_temp TEXT,
    accommodation TEXT,
    coordinates_lat DECIMAL(10, 6),
    coordinates_lng DECIMAL(10, 6),
    attractions TEXT [] DEFAULT '{}',
    highlights TEXT [] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (country_id, id)
);
-- فهارس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_tour_countries_active ON tour_countries (is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_tour_cities_country ON tour_cities (country_id, is_active);
-- RLS - قراءة عامة بدون مصادقة
ALTER TABLE tour_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_cities ENABLE ROW LEVEL SECURITY;
-- سياسة القراءة للجميع
DROP POLICY IF EXISTS "tour_countries_public_read" ON tour_countries;
CREATE POLICY "tour_countries_public_read" ON tour_countries FOR
SELECT USING (true);
DROP POLICY IF EXISTS "tour_cities_public_read" ON tour_cities;
CREATE POLICY "tour_cities_public_read" ON tour_cities FOR
SELECT USING (true);
-- سياسة الكتابة للمصادَق عليهم فقط
DROP POLICY IF EXISTS "tour_countries_auth_write" ON tour_countries;
CREATE POLICY "tour_countries_auth_write" ON tour_countries FOR ALL USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "tour_cities_auth_write" ON tour_cities;
CREATE POLICY "tour_cities_auth_write" ON tour_cities FOR ALL USING (auth.role() = 'authenticated');
-- Trigger لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_tour_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS tour_countries_updated_at ON tour_countries;
CREATE TRIGGER tour_countries_updated_at BEFORE
UPDATE ON tour_countries FOR EACH ROW EXECUTE FUNCTION update_tour_updated_at();
CREATE TRIGGER tour_cities_updated_at BEFORE
UPDATE ON tour_cities FOR EACH ROW EXECUTE FUNCTION update_tour_updated_at();