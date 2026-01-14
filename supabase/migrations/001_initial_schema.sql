-- =============================================
-- Traveliun Database Schema
-- Migration: 001_initial_schema
-- Created: 2025-12-29
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    first_name_ar VARCHAR(100),
    last_name_ar VARCHAR(100),
    avatar_url TEXT,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    nationality VARCHAR(100),
    
    passport_number VARCHAR(50),
    passport_expiry DATE,
    passport_country VARCHAR(100),
    
    preferred_language VARCHAR(10) DEFAULT 'ar',
    preferred_currency VARCHAR(10) DEFAULT 'SAR',
    newsletter_subscribed BOOLEAN DEFAULT true,
    
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'agent', 'partner')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
    
    loyalty_points INTEGER DEFAULT 0,
    loyalty_tier VARCHAR(20) DEFAULT 'bronze' CHECK (loyalty_tier IN ('bronze', 'silver', 'gold', 'platinum')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    
    google_id VARCHAR(255),
    apple_id VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- =============================================
-- 2. DESTINATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    country_ar VARCHAR(100) NOT NULL,
    country_en VARCHAR(100) NOT NULL,
    region_ar VARCHAR(100),
    region_en VARCHAR(100),
    
    description_ar TEXT,
    description_en TEXT,
    short_description_ar VARCHAR(500),
    short_description_en VARCHAR(500),
    
    cover_image TEXT NOT NULL,
    gallery JSONB DEFAULT '[]',
    video_url TEXT,
    
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timezone VARCHAR(50),
    
    visa_required BOOLEAN DEFAULT false,
    visa_on_arrival BOOLEAN DEFAULT false,
    visa_instructions_ar TEXT,
    visa_instructions_en TEXT,
    best_time_to_visit VARCHAR(100),
    currency_code VARCHAR(10),
    language VARCHAR(100),
    
    category TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    
    starting_price DECIMAL(10, 2),
    price_currency VARCHAR(10) DEFAULT 'SAR',
    
    average_rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    
    is_featured BOOLEAN DEFAULT false,
    is_trending BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    meta_title_ar VARCHAR(200),
    meta_title_en VARCHAR(200),
    meta_description_ar TEXT,
    meta_description_en TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_destinations_slug ON destinations(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_featured ON destinations(is_featured) WHERE is_featured = true;

-- =============================================
-- 3. PROGRAMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    slug VARCHAR(150) UNIQUE NOT NULL,
    
    name_ar VARCHAR(300) NOT NULL,
    name_en VARCHAR(300) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    
    duration_days INTEGER NOT NULL,
    duration_nights INTEGER NOT NULL,
    program_type VARCHAR(50) NOT NULL CHECK (program_type IN (
        'honeymoon', 'family', 'adventure', 'cultural', 
        'beach', 'city_tour', 'safari', 'cruise', 'budget'
    )),
    
    cover_image TEXT,
    gallery JSONB DEFAULT '[]',
    itinerary JSONB NOT NULL DEFAULT '[]',
    includes JSONB DEFAULT '[]',
    excludes JSONB DEFAULT '[]',
    
    base_price DECIMAL(10, 2) NOT NULL,
    child_price DECIMAL(10, 2),
    infant_price DECIMAL(10, 2) DEFAULT 0,
    single_supplement DECIMAL(10, 2) DEFAULT 0,
    price_currency VARCHAR(10) DEFAULT 'SAR',
    
    discount_percentage INTEGER DEFAULT 0,
    discount_valid_until DATE,
    
    min_travelers INTEGER DEFAULT 1,
    max_travelers INTEGER DEFAULT 20,
    hotel_options JSONB DEFAULT '[]',
    
    average_rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_programs_destination ON programs(destination_id);
CREATE INDEX IF NOT EXISTS idx_programs_type ON programs(program_type);

-- =============================================
-- 4. PROGRAM DATES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS program_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    
    departure_date DATE NOT NULL,
    return_date DATE NOT NULL,
    
    total_spots INTEGER NOT NULL DEFAULT 20,
    booked_spots INTEGER DEFAULT 0,
    
    special_price DECIMAL(10, 2),
    price_note VARCHAR(200),
    
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN (
        'available', 'limited', 'sold_out', 'cancelled'
    )),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(program_id, departure_date)
);

CREATE INDEX IF NOT EXISTS idx_program_dates_date ON program_dates(departure_date);

-- =============================================
-- 5. HOTELS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS hotels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID REFERENCES destinations(id),
    
    name_ar VARCHAR(300) NOT NULL,
    name_en VARCHAR(300) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    
    star_rating INTEGER CHECK (star_rating BETWEEN 1 AND 5),
    hotel_type VARCHAR(50) CHECK (hotel_type IN (
        'hotel', 'resort', 'villa', 'apartment', 'boutique', 'hostel'
    )),
    
    address_ar TEXT,
    address_en TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    distance_to_city_center DECIMAL(5, 2),
    distance_to_airport DECIMAL(5, 2),
    
    cover_image TEXT,
    gallery JSONB DEFAULT '[]',
    virtual_tour_url TEXT,
    
    description_ar TEXT,
    description_en TEXT,
    amenities JSONB DEFAULT '[]',
    
    check_in_time TIME DEFAULT '14:00',
    check_out_time TIME DEFAULT '12:00',
    cancellation_policy TEXT,
    child_policy TEXT,
    
    average_rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    
    partner_id UUID,
    commission_rate DECIMAL(5, 2) DEFAULT 15,
    
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hotels_destination ON hotels(destination_id);
CREATE INDEX IF NOT EXISTS idx_hotels_rating ON hotels(star_rating);

-- =============================================
-- 6. ROOMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    room_type VARCHAR(50) NOT NULL CHECK (room_type IN (
        'standard', 'superior', 'deluxe', 'suite', 'presidential', 'villa'
    )),
    
    max_adults INTEGER DEFAULT 2,
    max_children INTEGER DEFAULT 2,
    bed_type VARCHAR(50),
    room_size DECIMAL(6, 2),
    
    images JSONB DEFAULT '[]',
    amenities JSONB DEFAULT '[]',
    view_type VARCHAR(50),
    
    base_price DECIMAL(10, 2) NOT NULL,
    extra_adult_price DECIMAL(10, 2) DEFAULT 0,
    extra_child_price DECIMAL(10, 2) DEFAULT 0,
    
    total_rooms INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rooms_hotel ON rooms(hotel_id);

-- =============================================
-- 7. BOOKINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    
    booking_type VARCHAR(20) NOT NULL CHECK (booking_type IN (
        'program', 'hotel_only', 'flight_hotel', 'custom'
    )),
    
    program_id UUID REFERENCES programs(id),
    program_date_id UUID REFERENCES program_dates(id),
    hotel_id UUID REFERENCES hotels(id),
    room_id UUID REFERENCES rooms(id),
    
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    
    adults_count INTEGER NOT NULL DEFAULT 1,
    children_count INTEGER DEFAULT 0,
    infants_count INTEGER DEFAULT 0,
    
    subtotal DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    taxes DECIMAL(12, 2) DEFAULT 0,
    service_fee DECIMAL(12, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'SAR',
    
    promo_code VARCHAR(50),
    promo_discount DECIMAL(12, 2) DEFAULT 0,
    
    points_earned INTEGER DEFAULT 0,
    points_redeemed INTEGER DEFAULT 0,
    points_value DECIMAL(12, 2) DEFAULT 0,
    
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'confirmed', 'processing', 'completed', 
        'cancelled', 'refunded', 'failed'
    )),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN (
        'pending', 'partial', 'paid', 'refunded', 'failed'
    )),
    
    special_requests TEXT,
    internal_notes TEXT,
    cancellation_reason TEXT,
    
    source VARCHAR(50) DEFAULT 'website' CHECK (source IN (
        'website', 'mobile_app', 'whatsapp', 'phone', 'partner', 'agent'
    )),
    agent_id UUID REFERENCES users(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in_date, check_out_date);

-- =============================================
-- 8. TRAVELERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS travelers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    first_name_ar VARCHAR(100),
    last_name_ar VARCHAR(100),
    
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    nationality VARCHAR(100),
    
    passport_number VARCHAR(50),
    passport_expiry DATE,
    passport_country VARCHAR(100),
    
    traveler_type VARCHAR(20) NOT NULL CHECK (traveler_type IN (
        'adult', 'child', 'infant'
    )),
    is_lead_traveler BOOLEAN DEFAULT false,
    
    email VARCHAR(255),
    phone VARCHAR(20),
    
    meal_preference VARCHAR(50),
    special_needs TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_travelers_booking ON travelers(booking_id);

-- =============================================
-- 9. PAYMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    user_id UUID NOT NULL REFERENCES users(id),
    
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'SAR',
    
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN (
        'credit_card', 'debit_card', 'bank_transfer', 
        'apple_pay', 'mada', 'tabby', 'tamara', 'stc_pay'
    )),
    
    gateway VARCHAR(50),
    transaction_id VARCHAR(255),
    gateway_response JSONB,
    
    card_last_four VARCHAR(4),
    card_brand VARCHAR(50),
    
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'processing', 'completed', 'failed', 
        'cancelled', 'refunded', 'partially_refunded'
    )),
    failure_reason TEXT,
    
    is_installment BOOLEAN DEFAULT false,
    installment_plan JSONB,
    installments_count INTEGER,
    
    refund_amount DECIMAL(12, 2) DEFAULT 0,
    refunded_at TIMESTAMPTZ,
    refund_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction ON payments(transaction_id);

-- =============================================
-- 10. CONTACT MESSAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    
    subject VARCHAR(200),
    message TEXT NOT NULL,
    
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN (
        'new', 'read', 'replied', 'archived'
    )),
    
    replied_by UUID REFERENCES users(id),
    replied_at TIMESTAMPTZ,
    reply_message TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);

-- =============================================
-- FUNCTION: Generate Booking Reference
-- =============================================
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
    NEW.booking_reference := 'TRV' || TO_CHAR(NOW(), 'YYMMDD') || 
                            LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_booking_reference ON bookings;
CREATE TRIGGER set_booking_reference
    BEFORE INSERT ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION generate_booking_reference();

-- =============================================
-- FUNCTION: Update updated_at Column
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON destinations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON hotels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE travelers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view active destinations" ON destinations FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active programs" ON programs FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view available program dates" ON program_dates FOR SELECT USING (status != 'cancelled');
CREATE POLICY "Public can view active hotels" ON hotels FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active rooms" ON rooms FOR SELECT USING (is_active = true);

-- User policies
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can submit contact messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- =============================================
-- SAMPLE DATA
-- =============================================
INSERT INTO destinations (slug, name_ar, name_en, country_ar, country_en, region_ar, region_en, cover_image, starting_price, is_featured, is_active)
VALUES 
    ('malaysia', 'ماليزيا', 'Malaysia', 'ماليزيا', 'Malaysia', 'جنوب شرق آسيا', 'Southeast Asia', '/assets/malaysia.jpg', 3999, true, true),
    ('thailand', 'تايلاند', 'Thailand', 'تايلاند', 'Thailand', 'جنوب شرق آسيا', 'Southeast Asia', '/assets/thailand.jpg', 4499, true, true),
    ('indonesia', 'إندونيسيا', 'Indonesia', 'إندونيسيا', 'Indonesia', 'جنوب شرق آسيا', 'Southeast Asia', '/assets/indonesia.jpg', 4999, true, true),
    ('turkey', 'تركيا', 'Turkey', 'تركيا', 'Turkey', 'أوروبا وآسيا', 'Europe and Asia', '/assets/turkey.jpg', 3499, true, true),
    ('georgia', 'جورجيا', 'Georgia', 'جورجيا', 'Georgia', 'القوقاز', 'Caucasus', '/assets/georgia.jpg', 2999, true, true),
    ('maldives', 'المالديف', 'Maldives', 'المالديف', 'Maldives', 'المحيط الهندي', 'Indian Ocean', '/assets/maldives.jpg', 8999, true, true)
ON CONFLICT (slug) DO NOTHING;
