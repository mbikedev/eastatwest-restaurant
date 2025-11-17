-- Check the actual content in the database
SELECT 
  title,
  slug,
  LENGTH(content) as content_length,
  SUBSTRING(content, 1, 200) as content_preview,
  published
FROM public.blogs 
WHERE slug = 'vegetarian-restaurant-brussels-east-at-west'; 