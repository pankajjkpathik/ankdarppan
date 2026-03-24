-- Allow insert/update/delete on products for admin management (public for now, auth can be added later)
CREATE POLICY "Anyone can insert products"
  ON public.products FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update products"
  ON public.products FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete products"
  ON public.products FOR DELETE USING (true);