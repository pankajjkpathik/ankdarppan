-- Restrict product mutations to authenticated users only
DROP POLICY IF EXISTS "Anyone can insert products" ON public.products;
DROP POLICY IF EXISTS "Anyone can update products" ON public.products;
DROP POLICY IF EXISTS "Anyone can delete products" ON public.products;

CREATE POLICY "Authenticated users can insert products"
ON public.products FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
ON public.products FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete products"
ON public.products FOR DELETE TO authenticated
USING (true);

-- Restrict order inserts to public (already exists), update to service_role only (already exists)
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders"
ON public.orders FOR INSERT TO public
WITH CHECK (true);