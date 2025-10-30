# Database Migration Instructions

## Recent Migrations

### 1. Adding Language Column to Blogs Table
### 2. Setting Default Blog Images

To fix issues with the blog system, we need to apply two migrations to the `blogs` table in Supabase.

### Steps to Apply the Migrations:

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project
   - Navigate to the SQL Editor

2. **Run Migration 1: Add Language Column**
   - Open the file: `supabase/migrations/20251019000000_add_language_column_to_blogs.sql`
   - Copy the entire contents
   - Paste it into the Supabase SQL Editor
   - Click "Run" to execute the migration

3. **Run Migration 2: Set Default Blog Images**
   - Open the file: `supabase/migrations/20251019010000_set_default_blog_images.sql`
   - Copy the entire contents
   - Paste it into the Supabase SQL Editor
   - Click "Run" to execute the migration

4. **Verify the Migrations**
   - Go to Table Editor > blogs
   - Check that the `language` column now exists
   - Verify that existing blogs have been assigned the correct language based on their slugs
   - Verify that all blogs now have `cover_image_url` values (no NULL values)

### What These Migrations Do:

**Migration 1: Language Column**
- Adds a `language` column to the `blogs` table (default: 'en')
- Creates an index on the `language` column for better performance
- Updates existing blog posts with the correct language based on their slugs:
  - French blogs (fr): Posts with French slugs
  - Dutch blogs (nl): Posts with Dutch slugs
  - English blogs (en): All other posts (default)

**Migration 2: Default Blog Images**
- Sets appropriate default images for all blogs without cover images
- Assigns theme-appropriate images based on blog tags:
  - Mezze/Lebanese: Mezze platter image
  - Vegetarian: Fattouche salad image
  - Culture/Hospitality: Event dining image
  - Special menu/Events: Special platter image
  - Default fallback: Falafel image
- Ensures all blogs display with proper images

### After Migrations:

1. All blogs will be displayed correctly on the blog page, filtered by the current language setting
2. All blogs will have proper cover images with no broken images
3. The code has been updated to use the `language` column directly instead of hardcoded slug matching
4. Image error handlers have been added to automatically fallback to default images if any image fails to load

### Adding New Blogs:

When adding new blog posts:
1. Set the `language` field to:
   - `'en'` for English
   - `'fr'` for French
   - `'nl'` for Dutch
2. Set the `cover_image_url` to an appropriate image path from `/public/images/`
3. If no specific image is available, use one of these defaults:
   - `/images/events-catering/plat-libanais-restaurant-libanais-bruxelles.webp` (general)
   - `/images/gallery/falafel.webp` (food items)
   - `/images/events-catering/mezze-libanais-restaurant.webp` (mezze/Lebanese)

The blog system will automatically filter and display posts based on the user's selected language, and will fallback to default images if any image fails to load.
