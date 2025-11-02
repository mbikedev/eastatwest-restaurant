# WordPress Comments Import Guide

This guide will help you import comments from your old WordPress site into your new Next.js/Supabase blog system.

## Overview

You had mentioned that your WordPress site was receiving 10+ comments daily, but they weren't migrated when you moved to Next.js. This script will help you import those historical comments to:

1. **Show social proof** - Display existing engagement on your blog posts
2. **Maintain continuity** - Preserve conversation history from your WordPress days
3. **Boost credibility** - Demonstrate that your content has been popular

## Prerequisites

Before you begin, you need:

1. **Access to your WordPress site** (either admin access or database access)
2. **Node.js** installed (you already have this)
3. **csv-parse package** - Install with: `npm install csv-parse`
4. **Your Supabase credentials** - Already configured in `.env.local`

## Installation

First, install the required dependency:

```bash
npm install csv-parse
```

## Method 1: CSV Export (Recommended)

This is the easiest and safest method.

### Step 1: Export Comments from WordPress

#### Option A: Using WordPress Admin (Easiest)

1. Log into your WordPress admin panel
2. Go to **Tools → Export**
3. Select **"Comments"**
4. Click **"Download Export File"**
5. You'll get an XML file

#### Option B: Using phpMyAdmin (More Control)

1. Log into your hosting control panel (cPanel, Plesk, etc.)
2. Open **phpMyAdmin**
3. Select your WordPress database
4. Click on the `wp_comments` table (prefix might be different)
5. Click **"Export"** at the top
6. Choose **CSV** format
7. Click **"Go"** to download

### Step 2: Convert XML to CSV (if needed)

If you got an XML file from WordPress export, you need to convert it to CSV first.

**Using Online Tool:**
1. Go to https://www.convertcsv.com/xml-to-csv.htm
2. Upload your WordPress XML file
3. Download the CSV

**Or using Python:**
```python
import xml.etree.ElementTree as ET
import csv

tree = ET.parse('wordpress-export.xml')
root = tree.getroot()

with open('comments.csv', 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['comment_ID', 'comment_post_ID', 'comment_author', 'comment_author_email', 'comment_author_url', 'comment_content', 'comment_date', 'comment_approved', 'comment_parent'])

    for comment in root.findall('.//wp:comment', {'wp': 'http://wordpress.org/export/1.2/'}):
        writer.writerow([
            comment.find('wp:comment_id', {'wp': 'http://wordpress.org/export/1.2/'}).text,
            comment.find('wp:comment_post_ID', {'wp': 'http://wordpress.org/export/1.2/'}).text,
            comment.find('wp:comment_author', {'wp': 'http://wordpress.org/export/1.2/'}).text,
            comment.find('wp:comment_author_email', {'wp': 'http://wordpress.org/export/1.2/'}).text,
            comment.find('wp:comment_author_url', {'wp': 'http://wordpress.org/export/1.2/'}).text,
            comment.find('wp:comment_content', {'wp': 'http://wordpress.org/export/1.2/'}).text,
            comment.find('wp:comment_date', {'wp': 'http://wordpress.org/export/1.2/'}).text,
            comment.find('wp:comment_approved', {'wp': 'http://wordpress.org/export/1.2/'}).text,
            comment.find('wp:comment_parent', {'wp': 'http://wordpress.org/export/1.2/'}).text,
        ])
```

### Step 3: Create Post ID Mapping

You need to map your WordPress post IDs to your new blog post slugs.

**Find WordPress Post IDs:**
1. In WordPress admin, go to **Posts → All Posts**
2. Hover over each post title
3. Look at the URL in your browser's status bar
4. You'll see something like `post.php?post=123&action=edit` - the number `123` is the post ID

**Find Your New Blog Post Slugs:**
1. Look in your Supabase `blogs` table
2. Or check your blog URLs (e.g., `/blog/vegetarian-restaurant-brussels` → slug is `vegetarian-restaurant-brussels`)

**Update the mapping in the script:**

Edit `scripts/import-wordpress-comments.mjs` at line ~170:

```javascript
function mapPostIdToSlug(postId) {
  const mapping = {
    '123': 'vegetarian-restaurant-brussels',
    '456': 'lebanese-cuisine-guide',
    '789': 'best-falafel-recipe',
    // Add all your WordPress post IDs here
  }

  return mapping[postId] || null
}
```

### Step 4: Run the Import

Place your `comments.csv` file in your project root, then run:

```bash
node scripts/import-wordpress-comments.mjs --source=csv --file=comments.csv
```

You'll see output like:

```
🚀 WordPress Comments Import Script
====================================

📄 Reading CSV file: comments.csv
✅ Found 247 comments in CSV
📊 Progress: 10 imported, 0 skipped, 0 errors
📊 Progress: 20 imported, 0 skipped, 0 errors
...
✅ Import Complete!
===================
Imported: 245
Skipped:  2
Errors:   0
```

## Method 2: Direct WordPress API Import

If your WordPress site is still online and has the REST API enabled, you can import directly.

### Step 1: Check WordPress REST API

Visit: `https://your-old-wordpress-site.com/wp-json/wp/v2/comments`

If you see JSON data, the API is working!

### Step 2: Run the Import

```bash
node scripts/import-wordpress-comments.mjs --source=api --url=https://your-old-wordpress-site.com
```

This method automatically fetches post slugs, so you don't need to create a manual mapping.

## Troubleshooting

### Error: "Missing Supabase credentials"

Make sure your `.env.local` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url_here
SUPABASE_SERVICE_ROLE_KEY=your_key_here
```

### Error: "No slug mapping for post X"

You need to add that WordPress post ID to the `mapPostIdToSlug` function. If you don't care about comments on that post, you can ignore this warning.

### Comments not showing up

1. Check the Supabase `comments` table to verify they were inserted
2. Verify `is_approved` is set to `true` (by default, RLS only shows approved comments)
3. Check `blog_post_id` matches your blog post slugs exactly

### Too many errors

- Check your CSV format matches the expected columns
- Verify date formats are valid (WordPress uses `YYYY-MM-DD HH:MM:SS`)
- Check for special characters or encoding issues in comment content

## Post-Import Tasks

After importing comments:

### 1. Review Comments in Admin Panel

Go to `/admin/comments` and review all imported comments:

- Check for spam (if any slipped through)
- Approve any that are waiting approval
- Delete any spam or inappropriate comments

### 2. Update Approval Status (if needed)

If you want to approve all imported comments in bulk:

```sql
-- Run this in Supabase SQL Editor
UPDATE comments
SET is_approved = true
WHERE created_at < '2025-01-01' -- adjust date as needed
AND is_approved = false;
```

### 3. Verify on Frontend

Visit your blog posts and check that comments are displaying correctly:

- Author names and avatars
- Comment dates
- Nested replies (if you had any)
- Comment count

## Advanced: Cleaning Up Spam

If you're importing lots of old comments, some might be spam. Here's how to clean them:

### Before Import: Clean in WordPress

1. Install **Akismet** or similar spam filter
2. Go to **Comments → Spam**
3. Select all and permanently delete

### After Import: Identify Spam

Look for patterns:

```sql
-- Find comments with suspicious patterns
SELECT * FROM comments
WHERE
  content ILIKE '%viagra%' OR
  content ILIKE '%casino%' OR
  content ILIKE '%buy cheap%' OR
  author_website LIKE '%.ru' OR
  author_website LIKE '%.cn';
```

Delete spam:

```sql
DELETE FROM comments
WHERE id IN (1, 2, 3, ...); -- IDs of spam comments
```

## Preserving Comment Threads

If your WordPress blog had threaded/nested comments (replies to comments), the script preserves this with the `parent_comment_id` field.

**Important:** Import parent comments before child comments, or the references won't work.

If you're importing from CSV, sort by `comment_ID` ascending first:

```bash
sort -t',' -k1 -n comments.csv > comments-sorted.csv
node scripts/import-wordpress-comments.mjs --source=csv --file=comments-sorted.csv
```

## Alternative: Manual Import for Small Numbers

If you only have a few comments to migrate, you can add them manually:

1. Go to your blog post page
2. Submit the comment using the comment form
3. Go to `/admin/comments` and approve it
4. Optionally, update the `created_at` timestamp in Supabase to match the original date

## Monitoring Import Progress

The script shows progress every 10 comments. For large imports:

- **Imported**: Successfully added to database
- **Skipped**: No matching blog post slug found
- **Errors**: Database errors or validation failures

Check your terminal for detailed error messages if any occur.

## FAQ

### Q: Will this import duplicate comments if I run it twice?

A: Yes, currently the script doesn't check for duplicates. Only run it once, or clear the `comments` table first.

### Q: Can I filter which comments to import?

A: Yes! Edit the CSV file to remove comments you don't want, or modify the script to add filters.

### Q: What about comment moderation?

A: By default, comments are imported with their original `approved` status from WordPress. You can review them all in `/admin/comments`.

### Q: Can I import WordPress comment metadata (likes, ratings, etc.)?

A: The basic script doesn't support this, but you can extend the `commentData` object to include custom fields if your Supabase schema supports them.

### Q: Will imported comments trigger email notifications?

A: No, the script bypasses the normal comment submission flow. Email notifications only trigger for new comments submitted through the form.

## Need Help?

If you encounter issues:

1. Check the script output for specific error messages
2. Verify your CSV format matches the expected structure
3. Check Supabase logs in the dashboard
4. Review the `mapPostIdToSlug` function

Common issues:
- Date format mismatches
- Character encoding (UTF-8 vs others)
- Missing WordPress post ID mappings
- Special characters in comment content

## Next Steps

After successfully importing comments:

1. ✅ **Test comment display** on your blog posts
2. ✅ **Verify admin panel** shows all comments
3. ✅ **Enable notifications** so you get alerts for new comments (already done!)
4. ✅ **Set up reCAPTCHA** to prevent spam going forward (already done!)
5. ✅ **Monitor engagement** and respond to comments promptly

Your blog comments are now fully migrated and your engagement history is preserved!
