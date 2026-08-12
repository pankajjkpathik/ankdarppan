
-- 1. Add old_price to services table
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS old_price NUMERIC;

-- 2. Ensure orders table has all necessary fields and correct permissions
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_code TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount NUMERIC;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_type TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS booking_details JSONB;

-- 3. Grant permissions to service_role for edge functions
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.coupons TO service_role;
GRANT SELECT ON public.services TO service_role;

-- 4. Ensure RLS allows service_role to do its job
-- (Usually service_role bypasses RLS if configured correctly, but adding explicit policy if needed)
CREATE POLICY "Service role can manage all orders" ON public.orders
FOR ALL TO service_role USING (true) WITH CHECK (true);
