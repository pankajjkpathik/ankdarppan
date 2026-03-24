-- Fix: restrict order updates to service role only
DROP POLICY "Service role can update orders" ON public.orders;
DROP POLICY "Service role can read orders" ON public.orders;

-- Only service role (edge functions) can update orders
CREATE POLICY "Service role updates orders"
  ON public.orders FOR UPDATE
  USING (current_setting('role') = 'service_role');

-- Only service role can read orders
CREATE POLICY "Service role reads orders"
  ON public.orders FOR SELECT
  USING (current_setting('role') = 'service_role');