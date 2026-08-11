CREATE TABLE public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL DEFAULT 'percent',
  discount_value integer NOT NULL DEFAULT 0,
  min_order_amount integer NOT NULL DEFAULT 0,
  max_discount integer,
  expires_at timestamp with time zone,
  usage_limit integer,
  times_used integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.coupons TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.coupons TO authenticated;
GRANT ALL ON public.coupons TO service_role;

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active coupons viewable by everyone"
ON public.coupons FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "Admins can view all coupons"
ON public.coupons FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert coupons"
ON public.coupons FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update coupons"
ON public.coupons FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete coupons"
ON public.coupons FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_coupons_updated_at
BEFORE UPDATE ON public.coupons
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();