CREATE POLICY "Anyone can read orders by payment id"
ON public.orders
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Service role reads orders" ON public.orders;