-- المدونة: جدول المقالات
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    author_id UUID REFERENCES auth.users(id),
    author_name TEXT,
    category TEXT,
    tags TEXT [],
    status TEXT DEFAULT 'draft',
    -- draft, published, archived
    views INTEGER DEFAULT 0,
    reading_time INTEGER,
    -- in minutes
    is_featured BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Index للبحث السريع
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
-- RLS Policies
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
-- الجميع يمكنه قراءة المقالات المنشورة
CREATE POLICY "Anyone can view published articles" ON articles FOR
SELECT USING (status = 'published');
-- المسؤولون فقط يمكنهم إدارة المقالات
CREATE POLICY "Admins can manage articles" ON articles FOR ALL USING (auth.jwt()->>'role' = 'admin');
-- Function لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_articles_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER articles_updated_at BEFORE
UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_articles_updated_at();
-- إضافة بيانات تجريبية
INSERT INTO articles (
        title,
        slug,
        excerpt,
        content,
        cover_image,
        author_name,
        category,
        tags,
        status,
        reading_time,
        is_featured,
        published_at
    )
VALUES (
        'أفضل 10 وجهات سياحية في 2026',
        'best-destinations-2026',
        'اكتشف أجمل الوجهات السياحية لهذا العام مع دليلنا الشامل',
        '# أفضل 10 وجهات سياحية في 2026

## المقدمة
السفر هو أحد أجمل التجارب التي يمكن للإنسان خوضها...

## 1. جزر المالديف
جزر المالديف هي الوجهة المثالية لمحبي الشواطئ الخلابة...

## 2. اسطنبول، تركيا
تجمع اسطنبول بين التاريخ والحداثة...
  
## الخلاصة
هذه قائمة بأفضل الوجهات التي ننصح بزيارتها في 2026!',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
        'فريق ترافليون',
        'دليل السفر',
        ARRAY ['سياحة', 'وجهات', '2026'],
        'published',
        8,
        true,
        NOW()
    ),
    (
        'نصائح ذهبية للسفر بميزانية محدودة',
        'budget-travel-tips',
        'تعلم كيف تسافر إلى وجهات أحلامك بأقل التكاليف',
        '# نصائح ذهبية للسفر بميزانية محدودة

السفر لا يجب أن يكون مكلفاً! إليك نصائحنا...

## 1. احجز مبكراً
الحجز المبكر يوفر لك الكثير...

## 2. السفر خارج المواسم
السفر في غير المواسم يقلل التكاليف بشكل كبير...

## 3. استخدم برامج المكافآت
استفد من برامج الولاء...
  ',
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828',
        'أحمد السالم',
        'نصائح السفر',
        ARRAY ['ميزانية', 'نصائح', 'توفير'],
        'published',
        6,
        false,
        NOW() - INTERVAL '2 days'
    ),
    (
        'دليل شهر العسل: أفضل الوجهات الرومانسية',
        'honeymoon-destinations-guide',
        'دليلك الشامل لاختيار وجهة شهر العسل المثالية',
        '# دليل شهر العسل: أفضل الوجهات الرومانسية

شهر العسل هو رحلة العمر! اختر وجهتك بعناية...

## المالديف
الخيار الأول لمعظم الأزواج...

## بالي
جزيرة الآلهة وجهة رومانسية بامتياز...

## باريس
مدينة الحب والرومانسية...
  ',
        'https://images.unsplash.com/photo-1464047736614-af63643285bf',
        'سارة محمد',
        'شهر العسل',
        ARRAY ['رومانسية', 'شهر عسل', 'عرسان'],
        'published',
        10,
        true,
        NOW() - INTERVAL '5 days'
    );