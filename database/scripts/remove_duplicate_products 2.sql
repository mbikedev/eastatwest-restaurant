-- Remove duplicate products from the database
-- This script will keep only the first instance (lowest ID) of products with the same name and category

-- First, let's see what duplicates exist (optional - for verification)
SELECT 
    name->>'en' as product_name,
    category,
    COUNT(*) as duplicate_count,
    ARRAY_AGG(id::text ORDER BY created_at) as product_ids
FROM products 
GROUP BY name->>'en', category 
HAVING COUNT(*) > 1
ORDER BY category, name->>'en';

-- Remove duplicates - keep only the earliest created product for each name+category combination
DELETE FROM products 
WHERE id NOT IN (
    SELECT DISTINCT ON (name->>'en', category) id
    FROM products 
    ORDER BY name->>'en', category, created_at ASC
);

-- Verify duplicates have been removed
SELECT 
    category,
    COUNT(*) as product_count 
FROM products 
GROUP BY category 
ORDER BY category;

-- Show all remaining products by category
SELECT 
    category,
    name->>'en' as product_name,
    id,
    created_at
FROM products 
ORDER BY category, name->>'en'; 