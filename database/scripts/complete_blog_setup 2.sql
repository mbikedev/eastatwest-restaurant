-- Complete blog setup: Create table and insert blog post
-- Step 1: Create blogs table if it doesn't exist
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

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs(published);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON public.blogs(featured);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON public.blogs(published_at);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_tags ON public.blogs USING GIN(tags);

-- Step 3: Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policy for reading published blogs
DROP POLICY IF EXISTS "Anyone can read published blogs" ON public.blogs;
CREATE POLICY "Anyone can read published blogs" ON public.blogs
  FOR SELECT USING (published = true);

-- Step 5: Insert the vegetarian restaurant blog post
INSERT INTO public.blogs (
  title,
  slug,
  excerpt,
  content,
  author_name,
  cover_image_url,
  tags,
  published,
  featured,
  meta_title,
  meta_description,
  reading_time,
  published_at
) VALUES (
  'Vegetarian Restaurant Brussels – East @ West',
  'vegetarian-restaurant-brussels-east-at-west',
  'Meat, fish, and poultry are not served at vegetarian restaurant Brussels East @ West. Discover our diverse vegetarian options and the rich culinary heritage of Belgian plant-based cuisine.',
  E'# Vegetarian Restaurant Brussels – East @ West

Meat, fish, and poultry are not served at vegetarian restaurant Brussels East @ West.

Vegetarianism is a complex idea, and vegetarian eateries cater to a diverse range of patrons with different dietary choices and beliefs.

## Why Choose a Vegetarian Restaurant in Brussels?

Belgium offers a variety of vegetarian options that you can enjoy during your stay.

Aside from its famous chocolates and waffles, this beautiful country presents an array of side dishes and main courses that highlight its rich culinary heritage.

Here are some must-try vegetarian dishes you should definitely add to your list.

## What Is a Vegetarian Restaurant?

Vegetarian restaurants do not serve meat, fish, or poultry.

However, vegetarian Mediterranean cuisine—like that at East @ West restaurant Libanais—welcomes a wide variety of customers.

Vegetarianism is a broad concept. Some vegans avoid all animal-derived ingredients, including butter and dairy, while others may consume eggs or even seafood.

As a result, vegetarian meals may still include some animal products.

### Typical offerings include:

- A variety of cereals
- Meatless protein sources like beans, lentils, or tempeh
- Fresh, organic vegetables and fruits

Whether you''re enjoying a fine dining experience or grabbing a quick lunch, the focus is always on clean eating and nutrition.

## How Long Have There Been Vegetarian Eateries?

Although a few vegetarian restaurants existed in the U.S. in the late 19th century, the idea gained momentum after the Pure Food and Drug Act of 1906.

This Act was inspired by Upton Sinclair''s novel The Jungle, which exposed the unsanitary conditions of the meatpacking industry.

### Vegetarian Restaurant Brussels: All You Need to Know

As more people adopted meatless diets, vegetarian cafés began to flourish.

In the 1970s, the second wave of vegetarianism began with a counterculture-driven food revolution. California chefs introduced the "eat fresh, local, and seasonal" philosophy, pushing vegetarian food into the mainstream.

## What''s on the Menu at a Vegetarian Restaurant?

Vegetables, grains, and legumes form the foundation of most vegetarian dishes.

Expect to find:
- Salads
- Stir-fries
- Grain bowls
- Wraps

Many people seek out vegetarian restaurants in Brussels due to food allergies, ethical reasons, or curiosity about meat-free lifestyles.

### Menus often include:
- Nutritional info
- Labels (gluten-free, vegan, vegetarian)
- Ethical sourcing details (e.g., farm-to-table origin)

## Belgium''s Must-Try Vegetarian Dishes

When you visit East @ West Vegetarian Restaurant in Brussels, don''t miss these signature dishes:

### Belgian Fries
Crispy and delicious, Belgian fries are usually double-fried.
Traditionally cooked in meat fat, you can request vegetarian versions.
Made from Bintje potatoes and served with tangy mayonnaise.

### Stoemp
A comforting mash of potatoes, leeks, and carrots, this dish dates back to the 19th century.
Sometimes includes onions or other seasonal vegetables.

### Poireaux''s Hachis
A hearty and flavorful mix made with leeks, lemon, mustard, capers, and more.
Often found on menus across the country.

### Chicon au Gratin
Endives baked with cheese, milk, nutmeg, butter, and flour.
Vegetarian versions are common. Usually served with mashed potatoes.

## What''s the Cost of Opening a Vegetarian Restaurant?

On average, restaurant budgets follow this model:
- 40% for food costs
- 40% for overhead/operations
- 20% profit margin

Vegetarian eateries often face higher ingredient costs due to sourcing organic and seasonal products.
The estimated startup cost is around $350,000, including equipment, staffing, renovations, and supplies.

## How to Start a Vegetarian Restaurant?

Start by defining:
- Your target audience
- Whether to serve animal-derived items like dairy or eggs
- Menu options: wraps, bowls, comfort foods, or Mediterranean classics

### Key steps include:
- Partnering with local farmers and suppliers
- Planning for extra refrigeration and storage
- Choosing the right location

## Common Types of Vegetarian Restaurants in Brussels

Modern vegetarian restaurants in Brussels appeal to both vegans and omnivores seeking healthier choices.

Popular items include:
- Meatless burgers, tacos, sandwiches, and pizzas
- Familiar comfort food with a plant-based twist

There''s growing demand for creative dishes that challenge stereotypes about vegetarian cuisine.

## Conclusion

Vegetarian restaurants today offer flavorful, high-quality meals that break away from old clichés.

With around 20 million vegetarians worldwide, the scene is ripe for innovation and growth.

### Best Vegetarian Restaurants Brussels, Belgium

Discover the flavorful side of plant-based cuisine at East @ West.',
  'East at West Team',
  '/images/lunch-dishes/plat-vegan.webp',
  ARRAY['vegetarian', 'brussels', 'restaurant', 'belgian-cuisine', 'plant-based', 'healthy-eating'],
  true,
  true,
  'Vegetarian Restaurant Brussels – East @ West | Plant-Based Belgian Cuisine',
  'Discover East @ West, Brussels'' premier vegetarian restaurant. Enjoy authentic Belgian vegetarian dishes, from crispy fries to traditional stoemp, in the heart of Brussels.',
  12,
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  excerpt = EXCLUDED.excerpt,
  updated_at = NOW();

-- Step 6: Add a few more sample blog posts for testing
INSERT INTO public.blogs (
  title, slug, excerpt, content, author_name, cover_image_url, tags, published, published_at
) VALUES 
(
  'Lebanese Mezze: Authentic Flavors at East @ West',
  'lebanese-mezze-authentic-flavors',
  'Discover the rich tradition of Lebanese mezze at East @ West. From hummus to falafel, explore the authentic flavors that make Lebanese cuisine special.',
  E'# Lebanese Mezze: Authentic Flavors at East @ West

Mezze is the heart of Lebanese dining culture. It''s not just a meal, but a social experience that brings people together around a table filled with small, flavorful dishes.

## Our Signature Cold Mezze

### Hummus
Our signature hummus is made fresh daily with the finest tahini, olive oil, and chickpeas. Smooth, creamy, and bursting with flavor.

### Moutabal
A smoky eggplant dip that perfectly balances the richness of tahini with the subtle char of roasted eggplant.',
  'Chef Ahmad',
  '/images/cold-mezzes/houmos.webp',
  ARRAY['lebanese', 'mezze', 'authentic', 'middle-eastern'],
  true,
  NOW() - INTERVAL '2 days'
)
ON CONFLICT (slug) DO NOTHING;

-- Step 7: Show all blog posts to verify
SELECT id, title, slug, published, created_at FROM public.blogs ORDER BY created_at DESC; 