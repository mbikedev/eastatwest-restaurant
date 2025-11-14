-- Add language column to blogs table
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';

-- Create index for language column for better query performance
CREATE INDEX IF NOT EXISTS idx_blogs_language ON public.blogs(language);

-- Update existing blog posts with language based on their slugs
-- French blogs
UPDATE public.blogs
SET language = 'fr'
WHERE slug IN (
  'meilleurs-restaurants-vegetariens-bruxelles-belgique',
  'restaurants-halal-cuisine-authentique-moyen-orient',
  'etiquette-restaurant-cuisine-moyen-orient',
  'restaurant-mediterraneen-top-4-caracteristiques',
  'restaurants-fast-food-pres-moi-avantages',
  'restaurant-vegetarien-experience-saine-savoureuse',
  'restaurant-mediterraneen-experience-inoubliable'
);

-- Dutch blogs
UPDATE public.blogs
SET language = 'nl'
WHERE slug IN (
  'beste-vegetarische-restaurants-brussel-belgie',
  'halal-restaurants-authentieke-midden-oosterse-keuken',
  'midden-oosterse-restaurant-etiquette-wel-niet',
  'mediterraan-restaurant-top-4-kenmerken',
  'fastfood-restaurants-bij-mij-voordelen',
  'vegetarisch-restaurant-gezonde-smakelijke-ervaring',
  'mediterraans-restaurant-onvergetelijke-ervaring'
);

-- English blogs (default - all blogs not matched above will be English)
UPDATE public.blogs
SET language = 'en'
WHERE language IS NULL
   OR language = 'en'
   OR slug IN (
     'best-vegetarian-restaurants-brussels-belgium',
     'halal-food-restaurants-authentic-middle-eastern-cuisine',
     'middle-eastern-restaurant-etiquette-dos-donts',
     'mediterranean-restaurant-top-4-features',
     'fast-food-restaurants-near-me-benefits',
     'vegetarian-restaurant-healthy-tasty-experience',
     'mediterranean-restaurant-unforgettable-experience',
     'vegetarian-restaurant-brussels',
     'lebanese-mezze-authentic-flavors',
     'lebanese-hospitality-brussels',
     'ramadan-special-menu-2024'
   );

-- Add comment to column
COMMENT ON COLUMN public.blogs.language IS 'Language code for the blog post (en, fr, nl, etc.)';
