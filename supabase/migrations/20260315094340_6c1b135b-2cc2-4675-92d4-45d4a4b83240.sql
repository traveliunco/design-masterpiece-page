
-- Verify tour_activities table exists and add missing policies safely
DO $$ BEGIN
  -- Drop and recreate policies to avoid conflicts
  DROP POLICY IF EXISTS "Public read active tour_activities" ON public.tour_activities;
  DROP POLICY IF EXISTS "Admin manage tour_activities" ON public.tour_activities;
  
  CREATE POLICY "Public read active tour_activities" ON public.tour_activities
    FOR SELECT TO public USING (is_active = true);
  CREATE POLICY "Admin manage tour_activities" ON public.tour_activities
    FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role));
END $$;
