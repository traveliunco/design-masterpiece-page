-- =====================================================
-- نظام الذكاء الاصطناعي - ترافليون
-- =====================================================

-- 1. إعدادات الذكاء الاصطناعي
CREATE TABLE IF NOT EXISTS ai_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    is_enabled BOOLEAN DEFAULT true,
    welcome_message TEXT DEFAULT 'مرحباً بك في ترافليون! 👋 كيف يمكنني مساعدتك اليوم؟',
    system_prompt TEXT DEFAULT 'أنت مساعد سفر ذكي لشركة ترافليون للسياحة والسفر. مهمتك مساعدة العملاء في:
- الإجابة عن استفسارات السفر والسياحة
- تقديم معلومات عن الوجهات والبرامج السياحية
- المساعدة في الحجوزات
- تقديم نصائح السفر

كن ودوداً ومحترفاً، واستخدم اللغة العربية.',
    model VARCHAR(50) DEFAULT 'deepseek-chat',
    temperature DECIMAL(2,1) DEFAULT 0.7,
    max_tokens INT DEFAULT 1000,
    widget_position VARCHAR(20) DEFAULT 'bottom-right',
    widget_color VARCHAR(20) DEFAULT '#0B4D3C',
    avatar_url TEXT,
    business_hours_only BOOLEAN DEFAULT false,
    business_hours_start TIME DEFAULT '09:00',
    business_hours_end TIME DEFAULT '21:00',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. قاعدة معرفة الذكاء الاصطناعي
CREATE TABLE IF NOT EXISTS ai_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- destinations, programs, flights, hotels, policies, faq, offers
    content TEXT NOT NULL,
    keywords TEXT[], -- كلمات مفتاحية للبحث
    source_url TEXT,
    priority INT DEFAULT 0, -- 0=عادي, 1=مهم, 2=عاجل
    is_active BOOLEAN DEFAULT true,
    valid_from DATE,
    valid_until DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- 3. محادثات الذكاء الاصطناعي
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    customer_name VARCHAR(100),
    customer_email VARCHAR(100),
    customer_phone VARCHAR(20),
    messages JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) DEFAULT 'active', -- active, resolved, escalated
    satisfaction_rating INT,
    tags TEXT[],
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 4. تقييمات المحادثات
CREATE TABLE IF NOT EXISTS ai_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
    message_index INT,
    is_helpful BOOLEAN,
    feedback_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- إدخال البيانات الأولية
-- =====================================================

-- الإعدادات الافتراضية
INSERT INTO ai_settings (
    is_enabled,
    welcome_message,
    system_prompt
) VALUES (
    true,
    'مرحباً بك في ترافليون! 👋
أنا مساعدك الذكي للسفر. يمكنني مساعدتك في:
✈️ حجز الرحلات والفنادق
🌍 معلومات عن الوجهات السياحية
📋 البرامج السياحية والعروض
❓ الإجابة على استفساراتك

كيف يمكنني مساعدتك اليوم؟',
    'أنت وكيل ذكاء اصطناعي لشركة ترافليون للسياحة والسفر في المملكة العربية السعودية.

## معلومات الشركة:
- الاسم: ترافليون (Traveliun)
- الموقع: المملكة العربية السعودية
- الهاتف: +966 56 922 2111
- واتساب: +966 56 922 2111
- الخدمات: حجز طيران، فنادق، برامج سياحية، تأشيرات، تأجير سيارات، تأمين سفر

## مهامك:
1. الإجابة على استفسارات العملاء بطريقة ودية ومهنية
2. تقديم معلومات دقيقة عن الخدمات والوجهات
3. المساعدة في عملية الحجز وتوجيه العملاء
4. تقديم نصائح السفر والتوصيات

## إرشادات:
- استخدم اللغة العربية الفصحى البسيطة
- كن ودوداً ومحترفاً
- قدم معلومات دقيقة ومفيدة
- إذا لم تعرف الإجابة، وجه العميل للتواصل مع فريق الدعم
- استخدم الإيموجي بشكل معتدل لجعل المحادثة أكثر ودية'
) ON CONFLICT DO NOTHING;

-- قاعدة المعرفة الأولية
INSERT INTO ai_knowledge (title, category, content, keywords, priority) VALUES
-- معلومات عامة
('معلومات الشركة', 'general', 'ترافليون هي شركة سياحة وسفر سعودية متخصصة في تقديم خدمات السفر المتكاملة. نقدم خدمات حجز الطيران والفنادق والبرامج السياحية والتأشيرات وتأجير السيارات والتأمين.', ARRAY['ترافليون', 'الشركة', 'من نحن', 'معلومات'], 1),
('معلومات التواصل', 'general', 'يمكنكم التواصل معنا عبر:\n- الهاتف: +966 56 922 2111\n- واتساب: +966 56 922 2111\n- البريد: info@traveliun.com', ARRAY['تواصل', 'هاتف', 'واتساب', 'بريد', 'اتصال'], 2),

-- الوجهات
('ماليزيا', 'destinations', 'ماليزيا وجهة سياحية رائعة تجمع بين الطبيعة الخلابة والمدن الحديثة. أهم المدن: كوالالمبور، لنكاوي، بينانج، كاميرون هايلاند. التأشيرة: مجانية للسعوديين لمدة 90 يوم.', ARRAY['ماليزيا', 'كوالالمبور', 'لنكاوي', 'آسيا'], 0),
('تركيا', 'destinations', 'تركيا بلد الحضارات والجمال. أهم المدن: اسطنبول، أنطاليا، طرابزون، كابادوكيا. التأشيرة: إلكترونية سهلة. أفضل الأوقات للزيارة: الربيع والخريف.', ARRAY['تركيا', 'اسطنبول', 'أنطاليا', 'طرابزون'], 0),
('جورجيا', 'destinations', 'جورجيا لؤلؤة القوقاز. أهم المدن: تبليسي، باتومي، كازبيقي. التأشيرة: مجانية للسعوديين لمدة سنة كاملة. طبيعة خلابة وأسعار مناسبة.', ARRAY['جورجيا', 'تبليسي', 'باتومي', 'القوقاز'], 0),
('المالديف', 'destinations', 'المالديف جنة استوائية مثالية لشهر العسل. منتجعات فاخرة على جزر خاصة. التأشيرة: مجانية عند الوصول. أفضل الأوقات: نوفمبر إلى أبريل.', ARRAY['المالديف', 'شهر عسل', 'جزر', 'منتجعات'], 0),

-- الخدمات
('حجز الطيران', 'services', 'نوفر حجز تذاكر الطيران على جميع شركات الطيران العالمية والمحلية. نضمن أفضل الأسعار مع خدمة عملاء متميزة. الدفع متاح بالتقسيط.', ARRAY['طيران', 'تذاكر', 'حجز', 'رحلات'], 1),
('حجز الفنادق', 'services', 'نوفر حجز فنادق ومنتجعات في جميع أنحاء العالم. من فنادق اقتصادية إلى منتجعات 5 نجوم. إلغاء مجاني لمعظم الحجوزات.', ARRAY['فنادق', 'حجز', 'منتجعات', 'إقامة'], 1),
('البرامج السياحية', 'services', 'برامج سياحية متكاملة تشمل الطيران والإقامة والمواصلات والجولات. برامج عائلية، شهر عسل، مغامرات، وأكثر.', ARRAY['برامج', 'سياحة', 'رحلات', 'جولات'], 1),
('التأشيرات', 'services', 'نساعدك في استخراج التأشيرات لجميع الدول. خدمة سريعة وموثوقة.', ARRAY['تأشيرة', 'فيزا', 'سفر'], 1),

-- السياسات
('سياسة الإلغاء', 'policies', 'سياسة الإلغاء تختلف حسب نوع الحجز:\n- الطيران: حسب سياسة شركة الطيران\n- الفنادق: إلغاء مجاني حتى 48 ساعة قبل الوصول\n- البرامج: رسوم إلغاء تصاعدية', ARRAY['إلغاء', 'استرداد', 'سياسة'], 1),
('طرق الدفع', 'policies', 'نقبل الدفع عبر:\n- بطاقات الائتمان (فيزا، ماستركارد، مدى)\n- التحويل البنكي\n- الدفع عند الاستلام (للحجوزات المحلية)\n- التقسيط (بالتنسيق مع البنوك)', ARRAY['دفع', 'بطاقة', 'تحويل', 'تقسيط'], 1)

ON CONFLICT DO NOTHING;

-- =====================================================
-- الفهارس
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_category ON ai_knowledge(category);
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_keywords ON ai_knowledge USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_session ON ai_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_status ON ai_conversations(status);

-- =====================================================
-- Row Level Security
-- =====================================================
ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_feedback ENABLE ROW LEVEL SECURITY;

-- القراءة العامة للإعدادات
CREATE POLICY "Public read ai_settings" ON ai_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage ai_settings" ON ai_settings FOR ALL USING (auth.role() = 'authenticated');

-- القراءة العامة للمعرفة النشطة
CREATE POLICY "Public read active knowledge" ON ai_knowledge FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage knowledge" ON ai_knowledge FOR ALL USING (auth.role() = 'authenticated');

-- المحادثات
CREATE POLICY "Anyone can create conversations" ON ai_conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users see own conversations" ON ai_conversations FOR SELECT USING (
    session_id IS NOT NULL OR user_id = auth.uid() OR auth.role() = 'authenticated'
);
CREATE POLICY "Update own conversations" ON ai_conversations FOR UPDATE USING (
    session_id IS NOT NULL OR user_id = auth.uid() OR auth.role() = 'authenticated'
);
CREATE POLICY "Admin manage conversations" ON ai_conversations FOR ALL USING (auth.role() = 'authenticated');

-- التقييمات
CREATE POLICY "Anyone can create feedback" ON ai_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read feedback" ON ai_feedback FOR SELECT USING (auth.role() = 'authenticated');
