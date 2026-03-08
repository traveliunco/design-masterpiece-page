
-- Fix special_offers RLS: Remove insecure policies, add proper admin-only write + public read
DROP POLICY IF EXISTS "allow_authenticated_manage_special_offers" ON public.special_offers;
DROP POLICY IF EXISTS "special_offers_admin_all" ON public.special_offers;
DROP POLICY IF EXISTS "allow_public_read_special_offers" ON public.special_offers;
DROP POLICY IF EXISTS "special_offers_public_read" ON public.special_offers;

-- Admin can do everything
CREATE POLICY "special_offers_admin_all" ON public.special_offers
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Public can read active offers
CREATE POLICY "special_offers_public_read" ON public.special_offers
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Fix programs RLS: Remove insecure policies
DROP POLICY IF EXISTS "Allow public read programs" ON public.programs;
DROP POLICY IF EXISTS "Public can view active programs" ON public.programs;
DROP POLICY IF EXISTS "allow_authenticated_delete_programs" ON public.programs;
DROP POLICY IF EXISTS "allow_authenticated_insert_programs" ON public.programs;
DROP POLICY IF EXISTS "allow_authenticated_update_programs" ON public.programs;
DROP POLICY IF EXISTS "allow_public_read_programs" ON public.programs;

-- Admin can do everything on programs
CREATE POLICY "programs_admin_all" ON public.programs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Public can read active programs
CREATE POLICY "programs_public_read" ON public.programs
  FOR SELECT TO anon, authenticated
  USING (is_active = true);
