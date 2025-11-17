-- Add all missing Sandwich products to the database
-- Based on the sandwiches defined in your menu page

INSERT INTO products (name, description, price, category, image_url, created_at) VALUES

-- 1. Hummus Sandwich
(
  $${"en": "Hummus Sandwich", "fr": "Sandwich Hummus", "nl": "Hummus Sandwich"}$$,
  $${"en": "Fresh pita bread filled with creamy hummus, vegetables and herbs", "fr": "Pain pita frais garni de houmous crémeux, légumes et herbes", "nl": "Vers pitabrood gevuld met romige hummus, groenten en kruiden"}$$,
  7.50,
  'sandwiches',
  NULL,
  NOW()
),

-- 2. Shish Taouk Sandwich  
(
  $${"en": "Shish Taouk Sandwich", "fr": "Sandwich Chich Taouk", "nl": "Shish Taouk Sandwich"}$$,
  $${"en": "Grilled marinated chicken breast in pita with garlic sauce and vegetables", "fr": "Blanc de poulet grillé mariné dans pita avec sauce à l'ail et légumes", "nl": "Gegrilde gemarineerde kipfilet in pita met knoflooksaus en groenten"}$$,
  9.50,
  'sandwiches',
  NULL,
  NOW()
),

-- 3. Moutabal Sandwich
(
  $${"en": "Moutabal Sandwich", "fr": "Sandwich Moutabal", "nl": "Moutabal Sandwich"}$$,
  $${"en": "Smoky grilled eggplant dip with tahini in fresh pita bread", "fr": "Trempette d'aubergine grillée fumée au tahini dans pain pita frais", "nl": "Rokerige gegrilde aubergine dip met tahini in vers pitabrood"}$$,
  8.00,
  'sandwiches',
  NULL,
  NOW()
),

-- 4. Toshka Sandwich
(
  $${"en": "Toshka Sandwich", "fr": "Sandwich Toshka", "nl": "Toshka Sandwich"}$$,
  $${"en": "Traditional spiced meat sandwich with yogurt sauce and vegetables", "fr": "Sandwich traditionnel à la viande épicée avec sauce yaourt et légumes", "nl": "Traditionele gekruide vlees sandwich met yoghurtsaus en groenten"}$$,
  10.00,
  'sandwiches',
  NULL,
  NOW()
),

-- 5. Falafel Sandwich
(
  $${"en": "Falafel Sandwich", "fr": "Sandwich Falafel", "nl": "Falafel Sandwich"}$$,
  $${"en": "Crispy falafel balls in pita with tahini sauce, salad and pickles", "fr": "Boules de falafel croustillantes dans pita avec sauce tahini, salade et cornichons", "nl": "Knapperige falafel balletjes in pita met tahini saus, salade en augurken"}$$,
  8.50,
  'sandwiches',
  NULL,
  NOW()
),

-- 6. Kebab Sandwich
(
  $${"en": "Kebab Sandwich", "fr": "Sandwich Kebab", "nl": "Kebab Sandwich"}$$,
  $${"en": "Grilled kebab meat in pita with garlic sauce and fresh vegetables", "fr": "Viande de kebab grillée dans pita avec sauce à l'ail et légumes frais", "nl": "Gegrild kebab vlees in pita met knoflooksaus en verse groenten"}$$,
  9.50,
  'sandwiches',
  NULL,
  NOW()
),

-- 7. Vegan Grill Sandwich
(
  $${"en": "Vegan Grill Sandwich", "fr": "Sandwich Grill Végétalien", "nl": "Veganistische Grill Sandwich"}$$,
  $${"en": "Grilled vegetables and vegan protein in pita with tahini sauce", "fr": "Légumes grillés et protéines végétaliennes dans pita avec sauce tahini", "nl": "Gegrilde groenten en veganistische eiwitten in pita met tahini saus"}$$,
  9.00,
  'sandwiches',
  NULL,
  NOW()
),

-- 8. Makdous Sandwich
(
  $${"en": "Makdous Sandwich", "fr": "Sandwich Makdous", "nl": "Makdous Sandwich"}$$,
  $${"en": "Baby eggplants stuffed with walnuts and peppers in pita bread", "fr": "Petites aubergines farcies aux noix et poivrons dans pain pita", "nl": "Baby aubergines gevuld met walnoten en paprika's in pitabrood"}$$,
  9.50,
  'sandwiches',
  NULL,
  NOW()
),

-- 9. Tarator Chicken Sandwich
(
  $${"en": "Tarator Chicken Sandwich", "fr": "Sandwich Poulet Tarator", "nl": "Tarator Kip Sandwich"}$$,
  $${"en": "Cold chicken with creamy tahini walnut sauce in fresh pita", "fr": "Poulet froid avec sauce crémeuse tahini-noix dans pita frais", "nl": "Koude kip met romige tahini-walnoten saus in vers pitabrood"}$$,
  10.50,
  'sandwiches',
  NULL,
  NOW()
),

-- 10. Cheese Sandwich
(
  $${"en": "Cheese Sandwich", "fr": "Sandwich au Fromage", "nl": "Kaas Sandwich"}$$,
  $${"en": "Grilled cheese with Mediterranean herbs in crispy pita bread", "fr": "Fromage grillé aux herbes méditerranéennes dans pain pita croustillant", "nl": "Gegrilde kaas met mediterrane kruiden in knapperig pitabrood"}$$,
  7.50,
  'sandwiches',
  NULL,
  NOW()
);

-- Verify all sandwiches were added
SELECT 
    name,
    price,
    image_url
FROM products 
WHERE category = 'sandwiches'
ORDER BY created_at;

-- Show count by category
SELECT 
    category,
    COUNT(*) as product_count
FROM products 
GROUP BY category 
ORDER BY category; 