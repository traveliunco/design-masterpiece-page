CREATE TABLE public.exclusive_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  discount text NOT NULL,
  code text,
  gradient text DEFAULT 'from-primary to-blue-600',
  icon text DEFAULT 'Sparkles',
  link text DEFAULT '/offers',
  expiry text DEFAULT 'عرض محدود',
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.exclusive_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active deals"
  ON public.exclusive_deals FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage deals"
  ON public.exclusive_deals FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_exclusive_deals_updated_at
  BEFORE UPDATE ON public.exclusive_deals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.exclusive_deals (title, description, discount, code, gradient, icon, link, expiry, display_order) VALUES
  ('خصم 25% على أول حجز فندقي', 'استمتع بخصم حصري على حجزك الأول في أفضل الفنادق', '25%', 'WELCOME25', 'from-primary to-blue-600', 'Sparkles', '/hotels', 'عرض محدود', 1),
  ('وفّر حتى 500 ر.س على الطيران', 'على رحلاتك الدولية الأولى مع ترافليون', '500 ر.س', 'FLY500', 'from-emerald-600 to-teal-500', 'Percent', '/flights', 'ينتهي قريباً', 2),
  ('باقة شهر عسل بخصم 30%', 'رحلة أحلامك بأسعار لا تُقاوم للأزواج الجدد', '30%', 'HONEY30', 'from-rose-500 to-pink-600', 'Sparkles', '/honeymoon', 'عرض موسمي', 3),
  ('خصم 20% على البرامج السياحية', 'استكشف وجهات جديدة بأسعار مميزة للمسافرين الجدد', '20%', 'TRIP20', 'from-amber-500 to-orange-500', 'Clock', '/programs', 'لفترة محدودة', 4);