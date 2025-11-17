-- COMPLETE PRODUCTS SETUP
-- Run this entire script in your Supabase SQL Editor to add all missing products

-- First: Fix existing Falafel image path
UPDATE products 
SET image_url = '/images/hot-mezzes/falafel-salad.webp'
WHERE category = 'hot-mezzes' 
  AND name->>'en' LIKE '%Falafel%';

-- Add all missing products to match available images
-- ===== COLD MEZZES (6 missing products) =====
INSERT INTO products (name, description, price, category, image_url, created_at) VALUES
-- Mousaka (missing)
(
  '{"en": "Mousaka", "fr": "Moussaka", "nl": "Moussaka"}',
  '{"en": "Traditional layered dish with eggplant, ground meat, and béchamel sauce", "fr": "Plat traditionnel en couches avec aubergines, viande hachée et sauce béchamel", "nl": "Traditioneel gelaagd gerecht met aubergine, gehakt en bechamelsaus"}',
  8.50,
  'cold-mezzes',
  '/images/cold-mezzes/mousaka.webp',
  NOW()
),
-- Iche (missing)
(
  '{"en": "Iche", "fr": "Iche", "nl": "Iche"}',
  '{"en": "Traditional Armenian bulgur salad with herbs and vegetables", "fr": "Salade de boulgour arménienne traditionnelle aux herbes et légumes", "nl": "Traditionele Armeense bulgursalade met kruiden en groenten"}',
  7.50,
  'cold-mezzes',
  '/images/cold-mezzes/iche.webp',
  NOW()
),
-- Muhamara (missing)
(
  '{"en": "Muhamara", "fr": "Mouhamara", "nl": "Muhamara"}',
  '{"en": "Spicy red pepper and walnut dip with pomegranate molasses", "fr": "Trempette épicée aux poivrons rouges et noix avec mélasse de grenade", "nl": "Pittige rode paprika en walnoten dip met granaatappel melasse"}',
  8.00,
  'cold-mezzes',
  '/images/cold-mezzes/muhamara.webp',
  NOW()
),
-- Warak Enab (missing)
(
  '{"en": "Warak Enab", "fr": "Feuilles de Vigne", "nl": "Gevulde Druivenbladeren"}',
  '{"en": "Stuffed grape leaves with rice, herbs and vegetables", "fr": "Feuilles de vigne farcies au riz, herbes et légumes", "nl": "Gevulde druivenbladeren met rijst, kruiden en groenten"}',
  9.00,
  'cold-mezzes',
  '/images/cold-mezzes/warak-enab.webp',
  NOW()
),
-- Makdous (missing)
(
  '{"en": "Makdous", "fr": "Makdous", "nl": "Makdous"}',
  '{"en": "Baby eggplants stuffed with walnuts, garlic and peppers in olive oil", "fr": "Petites aubergines farcies aux noix, ail et poivrons dans l''huile d''olive", "nl": "Baby aubergines gevuld met walnoten, knoflook en paprika''s in olijfolie"}',
  9.50,
  'cold-mezzes',
  '/images/cold-mezzes/makdous.webp',
  NOW()
),
-- Poulet Tarator (missing)
(
  '{"en": "Chicken Tarator", "fr": "Poulet Tarator", "nl": "Kip Tarator"}',
  '{"en": "Cold chicken with creamy tahini and walnut sauce", "fr": "Poulet froid avec sauce crémeuse au tahini et aux noix", "nl": "Koude kip met romige tahini en walnoten saus"}',
  10.50,
  'cold-mezzes',
  '/images/cold-mezzes/poulet-torator.webp',
  NOW()
);

-- ===== HOT MEZZES (8 missing products) =====
INSERT INTO products (name, description, price, category, image_url, created_at) VALUES
-- Sujuk (missing)
(
  '{"en": "Sujuk", "fr": "Sujuk", "nl": "Sujuk"}',
  '{"en": "Spiced Armenian sausage grilled to perfection", "fr": "Saucisse arménienne épicée grillée à la perfection", "nl": "Gekruide Armeense worst perfect gegrild"}',
  9.50,
  'hot-mezzes',
  '/images/hot-mezzes/sujuk.webp',
  NOW()
),
-- Nakanek (missing)
(
  '{"en": "Nakanek", "fr": "Nakanek", "nl": "Nakanek"}',
  '{"en": "Traditional Armenian sausage with unique spices", "fr": "Saucisse arménienne traditionnelle aux épices uniques", "nl": "Traditionele Armeense worst met unieke kruiden"}',
  9.00,
  'hot-mezzes',
  '/images/hot-mezzes/nakanek.webp',
  NOW()
),
-- Foul Moudamas (missing)
(
  '{"en": "Foul Moudamas", "fr": "Foul Moudamas", "nl": "Foul Moudamas"}',
  '{"en": "Traditional fava beans stew with garlic, lemon and olive oil", "fr": "Ragoût traditionnel de fèves avec ail, citron et huile d''olive", "nl": "Traditionele tuinbonen stoofpot met knoflook, citroen en olijfolie"}',
  7.50,
  'hot-mezzes',
  '/images/hot-mezzes/foul-moudamas.webp',
  NOW()
),
-- Arayes Cheese (missing)
(
  '{"en": "Arayes Cheese", "fr": "Arayes au Fromage", "nl": "Arayes Kaas"}',
  '{"en": "Grilled pita bread stuffed with melted cheese and herbs", "fr": "Pain pita grillé farci au fromage fondu et aux herbes", "nl": "Gegrild pitabrood gevuld met gesmolten kaas en kruiden"}',
  8.50,
  'hot-mezzes',
  '/images/hot-mezzes/arayes-cheese.webp',
  NOW()
),
-- Batata Harra (missing)
(
  '{"en": "Batata Harra", "fr": "Pommes de Terre Épicées", "nl": "Pittige Aardappelen"}',
  '{"en": "Spicy fried potatoes with garlic, coriander and chili", "fr": "Pommes de terre frites épicées à l''ail, coriandre et piment", "nl": "Pittige gebakken aardappelen met knoflook, koriander en chili"}',
  7.00,
  'hot-mezzes',
  '/images/hot-mezzes/batata-harra.webp',
  NOW()
),
-- Rkakat (missing)
(
  '{"en": "Rkakat", "fr": "Rkakat", "nl": "Rkakat"}',
  '{"en": "Crispy cheese rolls wrapped in phyllo pastry", "fr": "Rouleaux de fromage croustillants enveloppés dans de la pâte phyllo", "nl": "Knapperige kaasrolletjes gewikkeld in filodeeg"}',
  8.00,
  'hot-mezzes',
  '/images/hot-mezzes/rkakat.webp',
  NOW()
),
-- Kebbe Vegan (missing)
(
  '{"en": "Kebbe Vegan (2pcs)", "fr": "Kebbe Végétalien (2pcs)", "nl": "Kebbe Veganistisch (2st)"}',
  '{"en": "Vegan version of traditional kebbe made with bulgur and vegetables", "fr": "Version végétalienne du kebbe traditionnel au boulgour et légumes", "nl": "Veganistische versie van traditionele kebbe gemaakt met bulgur en groenten"}',
  8.50,
  'hot-mezzes',
  '/images/hot-mezzes/kebbe-vegan.webp',
  NOW()
),
-- Grilled Cheese (missing)
(
  '{"en": "Grilled Cheese", "fr": "Fromage Grillé", "nl": "Gegrilde Kaas"}',
  '{"en": "Traditional grilled cheese with Mediterranean herbs", "fr": "Fromage grillé traditionnel aux herbes méditerranéennes", "nl": "Traditionele gegrilde kaas met mediterrane kruiden"}',
  8.50,
  'hot-mezzes',
  '/images/hot-mezzes/grilled-cheese.webp',
  NOW()
);

-- ===== SALADS (2 missing products) =====
INSERT INTO products (name, description, price, category, image_url, created_at) VALUES
-- Falafel Salad (missing)
(
  '{"en": "Falafel Salad", "fr": "Salade de Falafel", "nl": "Falafel Salade"}',
  '{"en": "Fresh mixed greens with crispy falafel and tahini dressing", "fr": "Mélange de légumes verts frais avec falafel croustillant et sauce tahini", "nl": "Verse gemengde groenten met knapperige falafel en tahini dressing"}',
  12.50,
  'salads',
  '/images/Salads/falafel.webp',
  NOW()
),
-- Taboule (missing)
(
  '{"en": "Taboule", "fr": "Taboulé", "nl": "Tabouli"}',
  '{"en": "Traditional parsley salad with tomatoes, mint, bulgur and lemon dressing", "fr": "Salade de persil traditionnelle aux tomates, menthe, boulgour et vinaigrette au citron", "nl": "Traditionele peterselie salade met tomaten, munt, bulgur en citroendressing"}',
  10.50,
  'salads',
  '/images/Salads/taboule.webp',
  NOW()
);

-- ===== LUNCH DISHES (5 missing products) =====
INSERT INTO products (name, description, price, category, image_url, created_at) VALUES
-- Falafel Lunch (missing)
(
  '{"en": "Falafel Plate", "fr": "Assiette de Falafel", "nl": "Falafel Bord"}',
  '{"en": "Crispy falafel served with rice, salad and tahini sauce", "fr": "Falafel croustillant servi avec riz, salade et sauce tahini", "nl": "Knapperige falafel geserveerd met rijst, salade en tahini saus"}',
  14.50,
  'lunch-dishes',
  '/images/lunch-dishes/falafel.webp',
  NOW()
),
-- Toshka Leban (missing)
(
  '{"en": "Toshka Leban", "fr": "Toshka Leban", "nl": "Toshka Leban"}',
  '{"en": "Traditional dish with yogurt sauce and spiced meat", "fr": "Plat traditionnel avec sauce au yaourt et viande épicée", "nl": "Traditioneel gerecht met yoghurtsaus en gekruide vlees"}',
  16.50,
  'lunch-dishes',
  '/images/lunch-dishes/toshka-leban.webp',
  NOW()
),
-- Aleppo Mix (missing)
(
  '{"en": "Aleppo Mix", "fr": "Mélange d''Alep", "nl": "Aleppo Mix"}',
  '{"en": "Mixed grill platter with various meats and traditional sides", "fr": "Plateau de grillades mixtes avec diverses viandes et accompagnements traditionnels", "nl": "Gemengde grill schotel met verschillende vlees en traditionele bijgerechten"}',
  18.50,
  'lunch-dishes',
  '/images/lunch-dishes/alepo-mix.webp',
  NOW()
),
-- Plat Vegan (missing)
(
  '{"en": "Vegan Plate", "fr": "Assiette Végétalienne", "nl": "Veganistisch Bord"}',
  '{"en": "Complete vegan meal with mixed vegetables, grains and tahini", "fr": "Repas végétalien complet avec légumes mélangés, céréales et tahini", "nl": "Complete veganistische maaltijd met gemengde groenten, granen en tahini"}',
  15.50,
  'lunch-dishes',
  '/images/lunch-dishes/plat-vegan.webp',
  NOW()
),
-- Kebab Dish (missing)
(
  '{"en": "Kebab Dish", "fr": "Assiette Kebab", "nl": "Kebab Schotel"}',
  '{"en": "Grilled kebab served with rice, grilled vegetables and garlic sauce", "fr": "Kebab grillé servi avec riz, légumes grillés et sauce à l''ail", "nl": "Gegrilde kebab geserveerd met rijst, gegrilde groenten en knoflooksaus"}',
  17.50,
  'lunch-dishes',
  '/images/lunch-dishes/kebab-dish.webp',
  NOW()
);

-- ===== DESSERTS (1 missing product) =====
INSERT INTO products (name, description, price, category, image_url, created_at) VALUES
-- Traditional Ice Cream (missing)
(
  '{"en": "Traditional Ice Cream", "fr": "Glace Traditionnelle", "nl": "Traditioneel Ijs"}',
  '{"en": "Homemade Middle Eastern ice cream with rose water and pistachios", "fr": "Glace maison du Moyen-Orient à l''eau de rose et aux pistaches", "nl": "Zelfgemaakt Midden-Oosters ijs met rozenwater en pistaches"}',
  6.50,
  'desserts',
  '/images/desserts/traditional-ice-cream.webp',
  NOW()
);

-- Verify all products were added
SELECT category, COUNT(*) as product_count 
FROM products 
GROUP BY category 
ORDER BY category; 