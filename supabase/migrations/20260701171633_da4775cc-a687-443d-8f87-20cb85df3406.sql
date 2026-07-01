
-- Fix: users can update their own orders — remove entirely; updates go through admin/service role
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

-- Fix: blogs draft exposure
DROP POLICY IF EXISTS "Blogs viewable by everyone" ON public.blogs;
CREATE POLICY "Published blogs viewable by everyone" ON public.blogs
  FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can view all blogs" ON public.blogs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix: lock down user_roles mutations to admins only
CREATE POLICY "Admins can insert roles" ON public.user_roles
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update roles" ON public.user_roles
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete roles" ON public.user_roles
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix: has_role SECURITY DEFINER shouldn't be executable by anon/authenticated broadly
-- RLS policies invoke it as postgres role, so revoking from authenticated is safe
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
