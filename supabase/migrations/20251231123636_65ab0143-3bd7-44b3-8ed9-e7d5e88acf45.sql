-- =====================================================
-- Security Fixes Migration
-- =====================================================

-- 1. Create app_role enum and user_roles table for RBAC
-- =====================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_roles (only admins can manage roles)
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- 2. Create security definer function to check roles (avoids RLS recursion)
-- =====================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 3. Enable RLS on promo_codes and add proper policies
-- =====================================================
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Only admins can manage promo codes
CREATE POLICY "Admin manage promo codes" ON public.promo_codes
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Public users can only validate active codes (limited exposure)
CREATE POLICY "Public can validate active codes" ON public.promo_codes
    FOR SELECT USING (is_active = true AND is_public = true);

-- 4. Fix ai_conversations overly permissive policy
-- =====================================================
DROP POLICY IF EXISTS "Users see own conversations" ON public.ai_conversations;
DROP POLICY IF EXISTS "Update own conversations" ON public.ai_conversations;
DROP POLICY IF EXISTS "Admin manage conversations" ON public.ai_conversations;
DROP POLICY IF EXISTS "Anyone can create conversations" ON public.ai_conversations;

-- Recreate with proper restrictions
CREATE POLICY "Users see own conversations" ON public.ai_conversations
    FOR SELECT USING (
        (user_id IS NOT NULL AND user_id = auth.uid()) OR
        public.has_role(auth.uid(), 'admin')
    );

CREATE POLICY "Update own conversations" ON public.ai_conversations
    FOR UPDATE USING (
        (user_id IS NOT NULL AND user_id = auth.uid()) OR
        public.has_role(auth.uid(), 'admin')
    );

CREATE POLICY "Admins manage conversations" ON public.ai_conversations
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create conversations" ON public.ai_conversations
    FOR INSERT WITH CHECK (true);

-- 5. Update admin policies on sensitive tables to use has_role function
-- =====================================================

-- Airlines
DROP POLICY IF EXISTS "Admin full access" ON public.airlines;
CREATE POLICY "Admin full access" ON public.airlines
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Airports
DROP POLICY IF EXISTS "Admin full access" ON public.airports;
CREATE POLICY "Admin full access" ON public.airports
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Flight offers
DROP POLICY IF EXISTS "Admin full access" ON public.flight_offers;
CREATE POLICY "Admin full access" ON public.flight_offers
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Hotels
DROP POLICY IF EXISTS "Admin full access" ON public.hotels;
CREATE POLICY "Admin full access" ON public.hotels
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Hotel rooms
DROP POLICY IF EXISTS "Admin full access" ON public.hotel_rooms;
CREATE POLICY "Admin full access" ON public.hotel_rooms
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- AI settings
DROP POLICY IF EXISTS "Admin manage ai_settings" ON public.ai_settings;
CREATE POLICY "Admin manage ai_settings" ON public.ai_settings
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- AI knowledge
DROP POLICY IF EXISTS "Admin manage knowledge" ON public.ai_knowledge;
CREATE POLICY "Admin manage knowledge" ON public.ai_knowledge
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- AI feedback
DROP POLICY IF EXISTS "Admin read feedback" ON public.ai_feedback;
CREATE POLICY "Admin read feedback" ON public.ai_feedback
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Flight bookings
DROP POLICY IF EXISTS "Admin can manage bookings" ON public.flight_bookings;
CREATE POLICY "Admin can manage bookings" ON public.flight_bookings
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Hotel bookings
DROP POLICY IF EXISTS "Admin can manage bookings" ON public.hotel_bookings;
CREATE POLICY "Admin can manage bookings" ON public.hotel_bookings
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Seasonal offers
DROP POLICY IF EXISTS "Admin full access" ON public.seasonal_offers;
CREATE POLICY "Admin full access" ON public.seasonal_offers
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 6. Add booking validation trigger for server-side validation
-- =====================================================
CREATE OR REPLACE FUNCTION public.validate_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Validate check-in date is not in the past
    IF NEW.check_in_date < CURRENT_DATE THEN
        RAISE EXCEPTION 'Check-in date cannot be in the past';
    END IF;
    
    -- Validate check-out is after check-in
    IF NEW.check_out_date <= NEW.check_in_date THEN
        RAISE EXCEPTION 'Check-out date must be after check-in date';
    END IF;
    
    -- Validate adults count
    IF NEW.adults_count < 1 OR NEW.adults_count > 20 THEN
        RAISE EXCEPTION 'Adults count must be between 1 and 20';
    END IF;
    
    -- Validate children count
    IF NEW.children_count IS NOT NULL AND (NEW.children_count < 0 OR NEW.children_count > 10) THEN
        RAISE EXCEPTION 'Children count must be between 0 and 10';
    END IF;
    
    -- Validate total amount is positive
    IF NEW.total_amount <= 0 THEN
        RAISE EXCEPTION 'Total amount must be positive';
    END IF;
    
    -- Sanitize special requests (limit length)
    IF NEW.special_requests IS NOT NULL AND LENGTH(NEW.special_requests) > 1000 THEN
        NEW.special_requests := LEFT(NEW.special_requests, 1000);
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER validate_booking_trigger
    BEFORE INSERT OR UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_booking();

-- 7. Enable RLS on tables that were missing it
-- =====================================================

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Enable RLS on wishlists
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own wishlist" ON public.wishlists
    FOR ALL USING (auth.uid() = user_id);

-- Enable RLS on reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read approved reviews" ON public.reviews
    FOR SELECT USING (status = 'approved');
CREATE POLICY "Users manage own reviews" ON public.reviews
    FOR ALL USING (auth.uid() = user_id);

-- Enable RLS on travelers
ALTER TABLE public.travelers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see travelers on own bookings" ON public.travelers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.bookings
            WHERE bookings.id = travelers.booking_id
            AND bookings.user_id = auth.uid()
        )
    );
CREATE POLICY "Users manage travelers on own bookings" ON public.travelers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.bookings
            WHERE bookings.id = travelers.booking_id
            AND bookings.user_id = auth.uid()
        )
    );