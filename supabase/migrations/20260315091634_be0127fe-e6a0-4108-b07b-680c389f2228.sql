
-- Add columns to dynamic_packages for better tracking
ALTER TABLE public.dynamic_packages 
  ADD COLUMN IF NOT EXISTS country_id uuid REFERENCES public.destinations(id),
  ADD COLUMN IF NOT EXISTS city_name varchar,
  ADD COLUMN IF NOT EXISTS origin_city varchar DEFAULT 'الرياض';

-- Add RLS policies for tour_activities (public read)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tour_activities' AND policyname = 'Public read active tour_activities') THEN
    ALTER TABLE public.tour_activities ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Public read active tour_activities" ON public.tour_activities FOR SELECT TO public USING (is_active = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tour_activities' AND policyname = 'Admin manage tour_activities') THEN
    CREATE POLICY "Admin manage tour_activities" ON public.tour_activities FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;
