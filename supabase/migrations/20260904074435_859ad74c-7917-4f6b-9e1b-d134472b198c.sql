-- 1. Stop exposing coupon codes publicly; validation now happens via the validate-coupon edge function (service role)
DROP POLICY IF EXISTS "Active coupons viewable by everyone" ON public.coupons;

-- 2. handle_new_user is a trigger function fired by the auth system; signed-in/anon users should never call it directly
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- 3. has_role must stay callable by signed-in users (RLS policies depend on it), but anon never needs it
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;