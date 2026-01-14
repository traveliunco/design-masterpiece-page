-- ======================================
-- جداول نظام حجز الطيران لـ Supabase
-- تشغيل هذا الملف سيحذف الجداول الموجودة ويعيد إنشاءها
-- ======================================
-- حذف الجداول الموجودة (إذا وجدت)
DROP TABLE IF EXISTS booking_payments CASCADE;
DROP TABLE IF EXISTS booking_passengers CASCADE;
DROP TABLE IF EXISTS flight_bookings CASCADE;
DROP VIEW IF EXISTS booking_summary CASCADE;
DROP FUNCTION IF EXISTS update_flight_booking_timestamp CASCADE;
-- ======================================
-- جدول الحجوزات الرئيسي
-- ======================================
CREATE TABLE flight_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pnr VARCHAR(10) UNIQUE NOT NULL DEFAULT UPPER(
        SUBSTRING(
            MD5(RANDOM()::TEXT)
            FROM 1 FOR 6
        )
    ),
    user_id UUID NULL,
    -- تفاصيل الرحلة
    flight_offer JSONB NOT NULL DEFAULT '{}'::JSONB,
    origin_code VARCHAR(3) NOT NULL,
    origin_city VARCHAR(100),
    destination_code VARCHAR(3) NOT NULL,
    destination_city VARCHAR(100),
    departure_date TIMESTAMPTZ NOT NULL,
    return_date TIMESTAMPTZ,
    trip_type VARCHAR(20) DEFAULT 'oneWay',
    cabin_class VARCHAR(20) DEFAULT 'ECONOMY',
    -- الأسعار
    base_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    taxes DECIMAL(10, 2) DEFAULT 0,
    services_price DECIMAL(10, 2) DEFAULT 0,
    total_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'SAR',
    -- المسافرين
    total_passengers INTEGER NOT NULL DEFAULT 1,
    adults INTEGER DEFAULT 1,
    children INTEGER DEFAULT 0,
    infants INTEGER DEFAULT 0,
    -- الحالة
    status VARCHAR(20) DEFAULT 'pending',
    payment_status VARCHAR(20) DEFAULT 'unpaid',
    -- معلومات التواصل
    contact_first_name VARCHAR(100) NOT NULL,
    contact_last_name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    -- الخدمات الإضافية
    additional_services JSONB DEFAULT '[]'::JSONB,
    seat_selections JSONB DEFAULT '[]'::JSONB,
    -- بيانات Amadeus
    amadeus_order_id VARCHAR(100),
    ticket_numbers TEXT [],
    -- ملاحظات
    notes TEXT,
    admin_notes TEXT,
    -- التواريخ
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    ticketed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);
-- ======================================
-- جدول المسافرين
-- ======================================
CREATE TABLE booking_passengers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES flight_bookings(id) ON DELETE CASCADE,
    passenger_type VARCHAR(10) NOT NULL DEFAULT 'adult',
    title VARCHAR(10),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL DEFAULT 'MALE',
    nationality VARCHAR(2) DEFAULT 'SA',
    passport_number VARCHAR(20),
    passport_expiry DATE,
    passport_country VARCHAR(2),
    frequent_flyer_number VARCHAR(30),
    meal_preference VARCHAR(20),
    special_requests TEXT,
    seat_number VARCHAR(5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ======================================
-- جدول المدفوعات
-- ======================================
CREATE TABLE booking_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES flight_bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'SAR',
    payment_method VARCHAR(50) NOT NULL DEFAULT 'credit_card',
    card_last_four VARCHAR(4),
    card_brand VARCHAR(20),
    installment_plan JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    transaction_id VARCHAR(100),
    gateway_response JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ
);
-- ======================================
-- Row Level Security (RLS)
-- ======================================
ALTER TABLE flight_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_payments ENABLE ROW LEVEL SECURITY;
-- سماح للجميع (للتطوير)
CREATE POLICY "Public access flight_bookings" ON flight_bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access booking_passengers" ON booking_passengers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access booking_payments" ON booking_payments FOR ALL USING (true) WITH CHECK (true);
-- ======================================
-- Indexes
-- ======================================
CREATE INDEX idx_fb_pnr ON flight_bookings(pnr);
CREATE INDEX idx_fb_status ON flight_bookings(status);
CREATE INDEX idx_fb_email ON flight_bookings(contact_email);
CREATE INDEX idx_fb_departure ON flight_bookings(departure_date);
CREATE INDEX idx_bp_booking ON booking_passengers(booking_id);
CREATE INDEX idx_bpay_booking ON booking_payments(booking_id);
-- ======================================
-- Trigger
-- ======================================
CREATE OR REPLACE FUNCTION update_fb_timestamp() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_fb_updated BEFORE
UPDATE ON flight_bookings FOR EACH ROW EXECUTE FUNCTION update_fb_timestamp();