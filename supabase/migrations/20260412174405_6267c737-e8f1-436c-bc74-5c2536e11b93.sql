
ALTER TABLE public.profiles
  ADD COLUMN billing_address_line1 text,
  ADD COLUMN billing_address_line2 text,
  ADD COLUMN billing_city text,
  ADD COLUMN billing_state text,
  ADD COLUMN billing_pincode text,
  ADD COLUMN billing_country text DEFAULT 'India',
  ADD COLUMN shipping_address_line1 text,
  ADD COLUMN shipping_address_line2 text,
  ADD COLUMN shipping_city text,
  ADD COLUMN shipping_state text,
  ADD COLUMN shipping_pincode text,
  ADD COLUMN shipping_country text DEFAULT 'India';
