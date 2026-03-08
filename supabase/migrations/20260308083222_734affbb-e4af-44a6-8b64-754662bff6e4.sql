
CREATE TABLE public.ready_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar VARCHAR NOT NULL,
  title_en VARCHAR NOT NULL DEFAULT '',
  description_ar TEXT,
  description_en TEXT,
  cover_image TEXT,
  destination_id UUID REFERENCES public.destinations(id),
  destination_name_ar VARCHAR NOT NULL DEFAULT '',
  country_ar VARCHAR NOT NULL DEFAULT '',
  duration_nights INTEGER NOT NULL DEFAULT 5,
  base_price_per_person NUMERIC NOT NULL DEFAULT 0,
  includes_flight BOOLEAN DEFAULT true,
  includes_hotel BOOLEAN DEFAULT true,
  includes_car BOOLEAN DEFAULT false,
  includes_insurance BOOLEAN DEFAULT false,
  includes_visa BOOLEAN DEFAULT false,
  hotel_id UUID REFERENCES public.hotels(id),
  hotel_name_ar VARCHAR,
  room_type_ar VARCHAR,
  flight_description_ar VARCHAR,
  car_description_ar VARCHAR,
  included_activities JSONB DEFAULT '[]'::jsonb,
  highlights JSONB DEFAULT '[]'::jsonb,
  badge VARCHAR,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ready_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active ready_packages" ON public.ready_packages
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin manage ready_packages" ON public.ready_packages
  FOR ALL USING (has_role(auth.uid(), 'admin'));
