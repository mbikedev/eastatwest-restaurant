-- Update blogs with NULL or empty cover_image_url to have unique images
-- This ensures all blogs display properly with diverse, appropriate images

-- Update specific blogs by slug with unique images
-- Each blog gets a carefully selected image based on its content

-- Vegetarian restaurant blogs - use varied vegetarian/salad images
UPDATE public.blogs
SET cover_image_url = '/images/Salads/fattouche-vegan.webp'
WHERE slug LIKE '%vegetarian-restaurant%'
  AND (cover_image_url IS NULL OR cover_image_url = '');

UPDATE public.blogs
SET cover_image_url = '/images/Salads/original-taboule.webp'
WHERE slug LIKE '%best-vegetarian%'
  AND (cover_image_url IS NULL OR cover_image_url = '');

UPDATE public.blogs
SET cover_image_url = '/images/lunch-dishes/plat-vegan.webp'
WHERE slug LIKE '%vegetarisch-restaurant%'
  AND (cover_image_url IS NULL OR cover_image_url = '');

UPDATE public.blogs
SET cover_image_url = '/images/Salads/falafel-vegan-salad.webp'
WHERE slug LIKE '%vegetarien-experience%'
  AND (cover_image_url IS NULL OR cover_image_url = '');

-- Lebanese/mezze themed blogs - use varied mezze dishes
UPDATE public.blogs
SET cover_image_url = '/images/cold-mezzes/houmos.webp'
WHERE slug LIKE '%lebanese-mezze%'
  AND (cover_image_url IS NULL OR cover_image_url = '');

UPDATE public.blogs
SET cover_image_url = '/images/cold-mezzes/moutabal.webp'
WHERE slug LIKE '%authentic-middle-eastern%'
  AND (cover_image_url IS NULL OR cover_image_url = '');

UPDATE public.blogs
SET cover_image_url = '/images/cold-mezzes/warak-enab.webp'
WHERE slug LIKE '%authentieke-midden-oosterse%'
  AND (cover_image_url IS NULL OR cover_image_url = '');

-- Mediterranean restaurant blogs - use colorful restaurant scenes
UPDATE public.blogs
SET cover_image_url = '/images/events-catering/mezze-libanais-restaurant.webp'
WHERE slug LIKE '%mediterranean-restaurant%' OR slug LIKE '%mediterraan-restaurant%' OR slug LIKE '%mediterraneen%'
  AND (cover_image_url IS NULL OR cover_image_url = '');

UPDATE public.blogs
SET cover_image_url = '/images/events-catering/plat-libanais-restaurant-libanais-event.webp'
WHERE slug LIKE '%mediterraans-restaurant-onvergetelijke%'
  AND (cover_image_url IS NULL OR cover_image_url = '');

-- Halal food blogs - use grilled/kebab images
UPDATE public.blogs
SET cover_image_url = '/images/skewers/2x-kebab-skewers.webp'
WHERE slug LIKE '%halal-food%'
  AND (cover_image_url IS NULL OR cover_image_url = '');

UPDATE public.blogs
SET cover_image_url = '/images/skewers/2x-chich-taouk.webp'
WHERE slug LIKE '%halal-restaurants%'
  AND (cover_image_url IS NULL OR cover_image_url = '');

UPDATE public.blogs
SET cover_image_url = '/images/lunch-dishes/kebab-dish.webp'
WHERE slug LIKE '%restaurants-halal%'
  AND (cover_image_url IS NULL OR cover_image_url = '');

-- Etiquette/culture blogs - use elegant dining images
UPDATE public.blogs
SET cover_image_url = '/images/gallery2/restaurant-libanais.webp'
WHERE slug LIKE '%etiquette%' OR slug LIKE '%restaurant-etiquette%'
  AND (cover_image_url IS NULL OR cover_image_url = '');

UPDATE public.blogs
SET cover_image_url = '/images/gallery2/mezze-libanais-restaurant-libanais.webp'
WHERE slug LIKE '%midden-oosterse-restaurant-etiquette%'
  AND (cover_image_url IS NULL OR cover_image_url = '');

UPDATE public.blogs
SET cover_image_url = '/images/hanna.webp'
WHERE slug LIKE '%hospitality%' OR slug LIKE '%lebanese-hospitality%'
  AND (cover_image_url IS NULL OR cover_image_url = '');

-- Fast food blogs - use sandwich/takeaway images
UPDATE public.blogs
SET cover_image_url = '/images/sandwiches/falafel-vegan.webp'
WHERE slug LIKE '%fast-food-restaurants%'
  AND (cover_image_url IS NULL OR cover_image_url = '');

UPDATE public.blogs
SET cover_image_url = '/images/sandwiches/kebab.webp'
WHERE slug LIKE '%fastfood-restaurants%'
  AND (cover_image_url IS NULL OR cover_image_url = '');

UPDATE public.blogs
SET cover_image_url = '/images/sandwiches/chich-taouk.webp'
WHERE slug LIKE '%restaurants-fast-food%'
  AND (cover_image_url IS NULL OR cover_image_url = '');

-- Special menu/events blogs - use special dishes
UPDATE public.blogs
SET cover_image_url = '/images/desserts/baklawa.webp'
WHERE slug LIKE '%ramadan%'
  AND (cover_image_url IS NULL OR cover_image_url = '');

UPDATE public.blogs
SET cover_image_url = '/images/hot-mezzes/kebbe.webp'
WHERE slug LIKE '%special-menu%'
  AND (cover_image_url IS NULL OR cover_image_url = '');

-- Generic fallback images for any remaining blogs without images
-- Use diverse images from different categories
UPDATE public.blogs
SET cover_image_url = CASE
  WHEN 'food' = ANY(tags) THEN '/images/events-catering/plat-libanais-restaurant-libanais-bruxelles.webp'
  WHEN 'restaurant' = ANY(tags) THEN '/images/gallery2/restaurant-eastatwest-brussel.webp'
  WHEN 'brussels' = ANY(tags) OR 'bruxelles' = ANY(tags) THEN '/images/gallery2/eastatwest-bruxelles.webp'
  WHEN 'culture' = ANY(tags) THEN '/images/events-catering/plat-libanais-restaurant-libanais-event.webp'
  WHEN 'community' = ANY(tags) THEN '/images/gallery2/traiteur-eastatwest-brussel.webp'
  ELSE '/images/events-catering/plat-libanais-restaurant-libanais.webp'
END
WHERE cover_image_url IS NULL OR cover_image_url = '';

-- Final fallback for any blogs still without images
UPDATE public.blogs
SET cover_image_url = '/images/gallery/falafel.webp'
WHERE cover_image_url IS NULL OR cover_image_url = '';

COMMENT ON COLUMN public.blogs.cover_image_url IS 'URL path to cover image, should always have a value';
