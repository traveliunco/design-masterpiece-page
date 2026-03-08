
-- 1. Car Rentals table
CREATE TABLE public.car_rentals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar varchar NOT NULL,
  name_en varchar NOT NULL,
  category varchar DEFAULT 'sedan',
  seats integer DEFAULT 5,
  bags integer DEFAULT 2,
  transmission varchar DEFAULT 'automatic',
  fuel_type varchar DEFAULT 'petrol',
  price_per_day numeric NOT NULL DEFAULT 0,
  price_with_driver numeric DEFAULT 0,
  city_ar varchar NOT NULL DEFAULT '',
  city_en varchar NOT NULL DEFAULT '',
  country_ar varchar NOT NULL DEFAULT '',
  country_en varchar NOT NULL DEFAULT '',
  features jsonb DEFAULT '[]'::jsonb,
  image_url text,
  rating numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Tour Activities table
CREATE TABLE public.tour_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar varchar NOT NULL,
  name_en varchar NOT NULL,
  city_ar varchar NOT NULL DEFAULT '',
  city_en varchar NOT NULL DEFAULT '',
  country_ar varchar DEFAULT '',
  country_en varchar DEFAULT '',
  description_ar text,
  description_en text,
  duration_hours numeric DEFAULT 1,
  price_per_person numeric NOT NULL DEFAULT 0,
  category varchar DEFAULT 'tour',
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Dynamic Packages table
CREATE TABLE public.dynamic_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id varchar,
  destination varchar,
  destination_id uuid,
  check_in_date date,
  check_out_date date,
  adults_count integer DEFAULT 1,
  children_count integer DEFAULT 0,
  infants_count integer DEFAULT 0,
  flight_offer_id uuid REFERENCES public.flight_offers(id) ON DELETE SET NULL,
  hotel_id uuid REFERENCES public.hotels(id) ON DELETE SET NULL,
  room_id uuid REFERENCES public.hotel_rooms(id) ON DELETE SET NULL,
  car_rental_id uuid REFERENCES public.car_rentals(id) ON DELETE SET NULL,
  selected_activities jsonb DEFAULT '[]'::jsonb,
  extras jsonb DEFAULT '{}'::jsonb,
  subtotal numeric DEFAULT 0,
  taxes numeric DEFAULT 0,
  total_price numeric DEFAULT 0,
  currency varchar DEFAULT 'SAR',
  status varchar DEFAULT 'draft',
  customer_name varchar,
  customer_email varchar,
  customer_phone varchar,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS for car_rentals
ALTER TABLE public.car_rentals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active car_rentals" ON public.car_rentals FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage car_rentals" ON public.car_rentals FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS for tour_activities
ALTER TABLE public.tour_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active tour_activities" ON public.tour_activities FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage tour_activities" ON public.tour_activities FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS for dynamic_packages
ALTER TABLE public.dynamic_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own packages" ON public.dynamic_packages FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public insert packages" ON public.dynamic_packages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage all packages" ON public.dynamic_packages FOR ALL USING (public.has_role(auth.uid(), 'admin'));
