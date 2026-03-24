-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  old_price INTEGER,
  badge TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  total INTEGER NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Products are publicly readable
CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT USING (true);

-- Orders: anyone can insert (guest checkout)
CREATE POLICY "Anyone can create orders"
  ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update orders"
  ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Service role can read orders"
  ON public.orders FOR SELECT USING (true);

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

CREATE POLICY "Product images are publicly accessible"
  ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can upload product images"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anyone can update product images"
  ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can delete product images"
  ON storage.objects FOR DELETE USING (bucket_id = 'product-images');

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial products
INSERT INTO public.products (name, description, price, old_price, badge, sort_order) VALUES
  ('Zodiac Charms', 'Handcrafted zodiac-themed spiritual charms for your cosmic journey.', 2500, 4500, 'Bestseller', 1),
  ('Astrologic Pendant', 'Premium astrological pendant aligned with planetary energies.', 3200, 5900, 'New', 2),
  ('Celestial Gemstone Set', 'A curated set of celestial gemstones to elevate your vibrations.', 1800, 3500, 'Popular', 3),
  ('Planetary Bracelet', 'Beautiful bracelet crafted with planetary gemstones.', 2100, 4000, 'Trending', 4);