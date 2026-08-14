
-- Add 'Ask One Question' service using title to match existing logic
INSERT INTO public.services (title, description, price, icon, is_active, sort_order)
VALUES ('Ask One Question', 'Get a precise answer to any one specific question in your mind regarding career, health, or relationships.', 194, 'Star', true, 100)
ON CONFLICT (id) DO UPDATE SET price = 194, is_active = true;

-- Update sort orders to reflect Prime vs Secondary
-- Prime: Loshu Grid (10), Mobile (20), Marriage (30), Name (40)
UPDATE public.services SET sort_order = 10 WHERE title ILIKE '%Loshu Grid%';
UPDATE public.services SET sort_order = 20 WHERE title ILIKE '%Mobile Number%';
UPDATE public.services SET sort_order = 30 WHERE title ILIKE '%Marriage Compatibility%';
UPDATE public.services SET sort_order = 40 WHERE title ILIKE '%Name Compatibility%';

-- Secondary: Lal Kitab (50), Crystal & Rudraksh (60)
UPDATE public.services SET sort_order = 50 WHERE title ILIKE '%Lal Kitab%';
UPDATE public.services SET sort_order = 60 WHERE title ILIKE '%Crystal%';
