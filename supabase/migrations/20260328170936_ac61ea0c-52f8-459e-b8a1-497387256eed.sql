
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price integer NOT NULL,
  icon text DEFAULT 'FileText',
  link text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services viewable by everyone" ON public.services FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update services" ON public.services FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete services" ON public.services FOR DELETE TO authenticated USING (true);

-- Seed with existing services
INSERT INTO public.services (title, description, price, icon, link, sort_order) VALUES
('Loshu Grid Report', 'Know your Grid, Birth Number, Destiny Number and more in your ANK DARPPAN REPORT', 671, 'Grid3X3', 'https://rzp.io/rzp/UIzji7Qc', 1),
('Vedic Numerology Report', 'Get your Vedic Numerology Report along with Remedies', 671, 'BookOpen', 'https://rzp.io/rzp/hXZcp6f', 2),
('Marriage Compatibility', 'Get an authentic Marriage Compatibility Report for your relationship.', 941, 'Heart', 'https://rzp.io/rzp/6AxWUPN', 3),
('Mobile Number Consultation', 'Is your Mobile Number Lucky for you or not? Find out now!', 581, 'Smartphone', 'https://rzp.io/rzp/dpnepvMq', 4),
('Crystal & Rudraksh Consultation', 'Get personalized crystal and Rudraksh recommendations for healing and balance.', 941, 'Gem', NULL, 5),
('Name Analysis & Correction', 'Discover the numerological power of your name and get correction suggestions.', 671, 'FileText', NULL, 6);
