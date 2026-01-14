-- =====================================================
-- نظام الرحلات والفنادق - ترافليون
-- قابل للتطوير والربط مع APIs خارجية مستقبلاً
-- =====================================================

-- =====================================================
-- 1. جدول شركات الطيران
-- =====================================================
CREATE TABLE IF NOT EXISTS airlines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    iata_code VARCHAR(3) UNIQUE, -- مثل SV, EK, TK
    logo_url TEXT,
    country VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. جدول المطارات
-- =====================================================
CREATE TABLE IF NOT EXISTS airports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    iata_code VARCHAR(3) UNIQUE NOT NULL, -- مثل JED, RUH, DXB
    city_ar VARCHAR(100) NOT NULL,
    city_en VARCHAR(100) NOT NULL,
    country_ar VARCHAR(100) NOT NULL,
    country_en VARCHAR(100) NOT NULL,
    country_code VARCHAR(2), -- SA, AE, TR
    timezone VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. جدول عروض الرحلات
-- =====================================================
CREATE TABLE IF NOT EXISTS flight_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- معلومات المسار
    origin_airport_id UUID REFERENCES airports(id),
    destination_airport_id UUID REFERENCES airports(id),
    airline_id UUID REFERENCES airlines(id),
    
    -- التواريخ
    departure_date DATE NOT NULL,
    return_date DATE, -- فارغ إذا كان ذهاب فقط
    departure_time TIME,
    arrival_time TIME,
    
    -- تفاصيل الرحلة
    flight_number VARCHAR(20),
    flight_class VARCHAR(50) DEFAULT 'economy', -- economy, business, first
    is_direct BOOLEAN DEFAULT true,
    stops_count INT DEFAULT 0,
    duration_minutes INT,
    
    -- التسعير
    price_adult DECIMAL(10,2) NOT NULL,
    price_child DECIMAL(10,2),
    price_infant DECIMAL(10,2),
    original_price DECIMAL(10,2), -- السعر قبل الخصم
    currency VARCHAR(3) DEFAULT 'SAR',
    
    -- المقاعد
    available_seats INT DEFAULT 10,
    total_seats INT DEFAULT 100,
    
    -- الحالة
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    valid_from DATE DEFAULT CURRENT_DATE,
    valid_until DATE,
    
    -- معلومات إضافية
    baggage_allowance VARCHAR(50) DEFAULT '23 kg',
    meal_included BOOLEAN DEFAULT false,
    notes TEXT,
    
    -- مصدر البيانات (للتوسع المستقبلي)
    source VARCHAR(50) DEFAULT 'internal', -- internal, api, partner
    external_id VARCHAR(100), -- معرف خارجي من API
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- 4. جدول الفنادق
-- =====================================================
CREATE TABLE IF NOT EXISTS hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    
    -- الموقع
    city_ar VARCHAR(100) NOT NULL,
    city_en VARCHAR(100) NOT NULL,
    country_ar VARCHAR(100) NOT NULL,
    country_en VARCHAR(100) NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- التصنيف
    star_rating INT CHECK (star_rating BETWEEN 1 AND 5),
    hotel_type VARCHAR(50) DEFAULT 'hotel', -- hotel, resort, apartment, villa
    
    -- الوصف
    description_ar TEXT,
    description_en TEXT,
    
    -- الصور
    main_image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb, -- مصفوفة روابط الصور
    
    -- المرافق
    amenities JSONB DEFAULT '[]'::jsonb, -- wifi, pool, spa, gym, restaurant, etc.
    
    -- معلومات الاتصال
    phone VARCHAR(20),
    email VARCHAR(100),
    website TEXT,
    
    -- السياسات
    check_in_time TIME DEFAULT '15:00',
    check_out_time TIME DEFAULT '11:00',
    cancellation_policy TEXT,
    
    -- التقييم
    rating DECIMAL(2,1) DEFAULT 0,
    reviews_count INT DEFAULT 0,
    
    -- الحالة
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    -- مصدر البيانات
    source VARCHAR(50) DEFAULT 'internal',
    external_id VARCHAR(100),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- 5. جدول أنواع الغرف
-- =====================================================
CREATE TABLE IF NOT EXISTS hotel_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    room_type VARCHAR(50) DEFAULT 'standard', -- standard, deluxe, suite, villa
    
    -- التفاصيل
    description_ar TEXT,
    description_en TEXT,
    max_adults INT DEFAULT 2,
    max_children INT DEFAULT 1,
    bed_type VARCHAR(50), -- single, double, twin, king
    room_size_sqm INT,
    
    -- التسعير
    price_per_night DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'SAR',
    
    -- ما يشمله
    includes_breakfast BOOLEAN DEFAULT false,
    includes_wifi BOOLEAN DEFAULT true,
    amenities JSONB DEFAULT '[]'::jsonb,
    
    -- التوفر
    available_rooms INT DEFAULT 5,
    total_rooms INT DEFAULT 10,
    
    -- الصور
    images JSONB DEFAULT '[]'::jsonb,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. جدول حجوزات الرحلات
-- =====================================================
CREATE TABLE IF NOT EXISTS flight_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference VARCHAR(20) UNIQUE NOT NULL, -- مثل TRV-FL-XXXXXX
    
    -- العميل
    customer_id UUID REFERENCES auth.users(id),
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    
    -- تفاصيل الرحلة
    flight_offer_id UUID REFERENCES flight_offers(id),
    origin_code VARCHAR(3) NOT NULL,
    destination_code VARCHAR(3) NOT NULL,
    departure_date DATE NOT NULL,
    return_date DATE,
    
    -- المسافرين
    passengers JSONB NOT NULL, -- تفاصيل كل مسافر
    adults_count INT DEFAULT 1,
    children_count INT DEFAULT 0,
    infants_count INT DEFAULT 0,
    
    -- التسعير
    base_price DECIMAL(10,2) NOT NULL,
    taxes DECIMAL(10,2) DEFAULT 0,
    fees DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'SAR',
    
    -- الدفع
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, refunded
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    paid_at TIMESTAMPTZ,
    
    -- الحالة
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
    
    -- ملاحظات
    special_requests TEXT,
    internal_notes TEXT,
    
    -- التتبع
    source VARCHAR(50) DEFAULT 'website', -- website, admin, api
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

-- =====================================================
-- 7. جدول حجوزات الفنادق
-- =====================================================
CREATE TABLE IF NOT EXISTS hotel_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference VARCHAR(20) UNIQUE NOT NULL, -- مثل TRV-HT-XXXXXX
    
    -- العميل
    customer_id UUID REFERENCES auth.users(id),
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    
    -- تفاصيل الحجز
    hotel_id UUID REFERENCES hotels(id),
    room_id UUID REFERENCES hotel_rooms(id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    nights_count INT NOT NULL,
    rooms_count INT DEFAULT 1,
    
    -- الضيوف
    guests JSONB, -- تفاصيل الضيوف
    adults_count INT DEFAULT 2,
    children_count INT DEFAULT 0,
    
    -- التسعير
    price_per_night DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    taxes DECIMAL(10,2) DEFAULT 0,
    fees DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'SAR',
    
    -- الدفع
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    paid_at TIMESTAMPTZ,
    
    -- الحالة
    status VARCHAR(20) DEFAULT 'pending',
    
    -- ملاحظات
    special_requests TEXT,
    internal_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

-- =====================================================
-- 8. جدول العروض الموسمية
-- =====================================================
CREATE TABLE IF NOT EXISTS seasonal_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_ar VARCHAR(200) NOT NULL,
    title_en VARCHAR(200) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    
    offer_type VARCHAR(50) NOT NULL, -- flight, hotel, package
    discount_type VARCHAR(20) NOT NULL, -- percentage, fixed
    discount_value DECIMAL(10,2) NOT NULL,
    
    -- الشروط
    min_booking_amount DECIMAL(10,2),
    max_discount_amount DECIMAL(10,2),
    applicable_destinations JSONB, -- قائمة الوجهات المشمولة
    promo_code VARCHAR(50),
    
    -- الصلاحية
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    usage_limit INT,
    used_count INT DEFAULT 0,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- إنشاء الفهارس
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_flight_offers_origin ON flight_offers(origin_airport_id);
CREATE INDEX IF NOT EXISTS idx_flight_offers_destination ON flight_offers(destination_airport_id);
CREATE INDEX IF NOT EXISTS idx_flight_offers_dates ON flight_offers(departure_date, return_date);
CREATE INDEX IF NOT EXISTS idx_flight_offers_active ON flight_offers(is_active, is_featured);

CREATE INDEX IF NOT EXISTS idx_hotels_city ON hotels(city_ar);
CREATE INDEX IF NOT EXISTS idx_hotels_active ON hotels(is_active, is_featured);
CREATE INDEX IF NOT EXISTS idx_hotel_rooms_hotel ON hotel_rooms(hotel_id);

CREATE INDEX IF NOT EXISTS idx_flight_bookings_customer ON flight_bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_status ON flight_bookings(status);
CREATE INDEX IF NOT EXISTS idx_hotel_bookings_customer ON hotel_bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_hotel_bookings_status ON hotel_bookings(status);

-- =====================================================
-- إدخال بيانات أولية
-- =====================================================

-- شركات الطيران
INSERT INTO airlines (name_ar, name_en, iata_code, country) VALUES
('الخطوط السعودية', 'Saudia', 'SV', 'المملكة العربية السعودية'),
('طيران ناس', 'Flynas', 'XY', 'المملكة العربية السعودية'),
('طيران أديل', 'Flyadeal', 'F3', 'المملكة العربية السعودية'),
('طيران الإمارات', 'Emirates', 'EK', 'الإمارات'),
('الخطوط القطرية', 'Qatar Airways', 'QR', 'قطر'),
('الخطوط التركية', 'Turkish Airlines', 'TK', 'تركيا'),
('الاتحاد للطيران', 'Etihad Airways', 'EY', 'الإمارات'),
('الخطوط الماليزية', 'Malaysia Airlines', 'MH', 'ماليزيا'),
('طيران آسيا', 'AirAsia', 'AK', 'ماليزيا')
ON CONFLICT (iata_code) DO NOTHING;

-- المطارات الرئيسية
INSERT INTO airports (name_ar, name_en, iata_code, city_ar, city_en, country_ar, country_en, country_code) VALUES
('مطار الملك عبدالعزيز الدولي', 'King Abdulaziz International Airport', 'JED', 'جدة', 'Jeddah', 'المملكة العربية السعودية', 'Saudi Arabia', 'SA'),
('مطار الملك خالد الدولي', 'King Khalid International Airport', 'RUH', 'الرياض', 'Riyadh', 'المملكة العربية السعودية', 'Saudi Arabia', 'SA'),
('مطار الملك فهد الدولي', 'King Fahd International Airport', 'DMM', 'الدمام', 'Dammam', 'المملكة العربية السعودية', 'Saudi Arabia', 'SA'),
('مطار الأمير محمد بن عبدالعزيز', 'Prince Mohammad Bin Abdulaziz Airport', 'MED', 'المدينة المنورة', 'Medina', 'المملكة العربية السعودية', 'Saudi Arabia', 'SA'),
('مطار دبي الدولي', 'Dubai International Airport', 'DXB', 'دبي', 'Dubai', 'الإمارات', 'UAE', 'AE'),
('مطار أبوظبي الدولي', 'Abu Dhabi International Airport', 'AUH', 'أبوظبي', 'Abu Dhabi', 'الإمارات', 'UAE', 'AE'),
('مطار كوالالمبور الدولي', 'Kuala Lumpur International Airport', 'KUL', 'كوالالمبور', 'Kuala Lumpur', 'ماليزيا', 'Malaysia', 'MY'),
('مطار اسطنبول', 'Istanbul Airport', 'IST', 'اسطنبول', 'Istanbul', 'تركيا', 'Turkey', 'TR'),
('مطار سوفارنابومي', 'Suvarnabhumi Airport', 'BKK', 'بانكوك', 'Bangkok', 'تايلاند', 'Thailand', 'TH'),
('مطار نجورا راي الدولي', 'Ngurah Rai International Airport', 'DPS', 'بالي', 'Bali', 'إندونيسيا', 'Indonesia', 'ID'),
('مطار فيلانا الدولي', 'Velana International Airport', 'MLE', 'ماليه', 'Male', 'المالديف', 'Maldives', 'MV'),
('مطار تبليسي الدولي', 'Tbilisi International Airport', 'TBS', 'تبليسي', 'Tbilisi', 'جورجيا', 'Georgia', 'GE'),
('مطار القاهرة الدولي', 'Cairo International Airport', 'CAI', 'القاهرة', 'Cairo', 'مصر', 'Egypt', 'EG')
ON CONFLICT (iata_code) DO NOTHING;

-- =====================================================
-- Row Level Security
-- =====================================================
ALTER TABLE airlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE airports ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasonal_offers ENABLE ROW LEVEL SECURITY;

-- السماح بالقراءة للجميع للبيانات العامة
CREATE POLICY "Public read access" ON airlines FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON airports FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON flight_offers FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON hotels FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON hotel_rooms FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON seasonal_offers FOR SELECT USING (is_active = true);

-- السماح بالإدارة للمستخدمين المصرح لهم
CREATE POLICY "Admin full access" ON airlines FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON airports FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON flight_offers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON hotels FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON hotel_rooms FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON seasonal_offers FOR ALL USING (auth.role() = 'authenticated');

-- الحجوزات: العميل يرى حجوزاته فقط
CREATE POLICY "Users can view own bookings" ON flight_bookings 
    FOR SELECT USING (auth.uid() = customer_id OR auth.role() = 'authenticated');
CREATE POLICY "Users can create bookings" ON flight_bookings 
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage bookings" ON flight_bookings 
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view own bookings" ON hotel_bookings 
    FOR SELECT USING (auth.uid() = customer_id OR auth.role() = 'authenticated');
CREATE POLICY "Users can create bookings" ON hotel_bookings 
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage bookings" ON hotel_bookings 
    FOR ALL USING (auth.role() = 'authenticated');
