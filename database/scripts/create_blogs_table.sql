-- Create blogs table for East at West blog system
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_name TEXT,
  cover_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  reading_time INTEGER,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published blogs
CREATE POLICY "Anyone can read published blogs" ON public.blogs
  FOR SELECT USING (published = true);

-- Insert sample blog posts
INSERT INTO public.blogs (
  title, slug, excerpt, content, author_name, cover_image_url, tags, published, published_at
) VALUES 
(
  'Vegetarian Restaurant Brussels: All you need to know!',
  'vegetarian-restaurant-brussels',
  'Discover the thriving vegetarian and vegan culture in Brussels.',
  'Most folks misperceive the demand for vegan and vegetarian food in Brussels. However, the truth is Brussels hosts a thriving vibrant vegetarian and vegan culture.',
  'East at West Team',
  '/images/events-catering/plat-libanais-restaurant-libanais-bruxelles.webp',
  ARRAY['vegetarian', 'brussels', 'restaurant', 'food'],
  true,
  NOW()
),
(
  'Lebanese Mezze: Authentic Flavors',
  'lebanese-mezze-authentic-flavors',
  'Discover the rich tradition of Lebanese mezze at East at West.',
  'Mezze is the heart of Lebanese dining culture. It''s not just a meal, but a social experience that brings people together.',
  'Chef Ahmad',
  '/images/cold-mezzes/houmos.webp',
  ARRAY['lebanese', 'mezze', 'authentic', 'middle-eastern'],
  true,
  NOW() - INTERVAL '2 days'
); 