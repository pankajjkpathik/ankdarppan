ALTER TABLE public.services ADD COLUMN IF NOT EXISTS coupon_codes text[] DEFAULT '{}';

COMMENT ON COLUMN public.services.coupon_codes IS 'List of coupon codes associated with this service to display on its landing page';

-- Grant access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
GRANT SELECT ON public.services TO anon;