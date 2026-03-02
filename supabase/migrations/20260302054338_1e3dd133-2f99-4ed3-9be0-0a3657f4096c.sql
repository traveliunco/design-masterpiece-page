-- Insert admin role for klidmorre@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('5be2687f-9fef-4ed4-896a-24283a9dc730', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Insert moderator role for eng.khalid.work@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('e3597da3-a1e3-4718-84fd-e9bcb158e199', 'moderator')
ON CONFLICT (user_id, role) DO NOTHING;

-- Allow users to read their own roles
CREATE POLICY "Users can read own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow admins to manage all roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
