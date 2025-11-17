-- Fetch all products from Sandwiches category and check their image status

-- Show all products in sandwiches category
SELECT 
    id,
    name->>'en' as product_name_en,
    name->>'fr' as product_name_fr, 
    name->>'nl' as product_name_nl,
    description->>'en' as description_en,
    price,
    category,
    image_url,
    CASE 
        WHEN image_url IS NULL THEN 'No image URL'
        WHEN image_url = '' THEN 'Empty image URL'
        ELSE 'Has image URL'
    END as image_status,
    created_at
FROM products 
WHERE category = 'sandwiches'
ORDER BY created_at;

-- Count of sandwiches products
SELECT COUNT(*) as total_sandwiches_products 
FROM products 
WHERE category = 'sandwiches';

-- Check if there are any products without images in sandwiches category
SELECT 
    COUNT(*) as products_without_images
FROM products 
WHERE category = 'sandwiches' 
    AND (image_url IS NULL OR image_url = '');

-- Show all categories and their product counts for comparison
SELECT 
    category,
    COUNT(*) as product_count
FROM products 
GROUP BY category 
ORDER BY category; 