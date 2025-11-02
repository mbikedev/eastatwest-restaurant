# How to Update Restaurant Logo on Google Search & Maps

## Overview
This guide explains how to remove the old logo and display the new "East At West" logo on Google Search results, Google Maps, and Google Business Profile.

**Old Logo**: Red/black decorative pattern
**New Logo**: Clean "EAST AT WEST" text with fork and spoon

---

## Changes Made to the Website

### 1. **Structured Data Update** ✅ COMPLETED
- Added `logo` field to Restaurant schema in `src/app/layout.tsx` (line 146-151)
- Logo URL: `https://eastatwest.com/android-chrome-512x512.png?v5`
- Format: 512x512 PNG (optimal for Google)

### 2. **Favicon Cache Busting** ✅ COMPLETED
- Incremented `FAVICON_VERSION` from `v4` to `v5`
- All favicon URLs now include `?v5` parameter
- Forces browsers and search engines to fetch fresh logo

---

## Step-by-Step: Update Logo on Google

### Step 1: Update Google Business Profile Logo

#### A. Access Google Business Profile
1. Go to https://business.google.com/
2. Sign in with the account that manages "East @ West" restaurant
3. Select your business location in Brussels

#### B. Upload New Logo
1. Click on **"Profile"** or **"Edit profile"**
2. Find the **"Logo"** section
3. Click **"Add logo"** or **"Change logo"**
4. Upload the new logo image (the clean "EAST AT WEST" design)
5. Click **"Apply"** or **"Save"**

**Logo Requirements:**
- Format: PNG, JPG, or GIF
- Size: Minimum 250 x 250 pixels, Maximum 5120 x 5120 pixels
- Aspect ratio: 1:1 (square)
- File size: Maximum 5 MB
- Content: Must represent your business (no promotional text)

### Step 2: Verify Structured Data with Google

#### A. Test Structured Data
1. Go to https://search.google.com/test/rich-results
2. Enter URL: `https://eastatwest.com`
3. Click **"Test URL"**
4. Check if Google detects the `logo` field in Restaurant schema
5. Verify the logo URL is: `https://eastatwest.com/android-chrome-512x512.png?v5`

#### B. Request Re-indexing
1. Go to https://search.google.com/search-console
2. Select your property (eastatwest.com)
3. Use **"URL Inspection"** tool
4. Enter: `https://eastatwest.com`
5. Click **"Request Indexing"**
6. Wait 24-48 hours for Google to re-crawl

### Step 3: Clear Cached Content

#### A. Google Search Cache
1. Search for: `cache:eastatwest.com` in Google
2. Click the three dots next to the result
3. Select **"Cached"** to see cached version
4. If old logo appears, wait for re-indexing (completed in Step 2B)

#### B. Google Images Cache
1. Go to https://www.google.com/imghp
2. Search: `East @ West Brussels logo`
3. If old logo appears, you can request removal:
   - Go to https://search.google.com/search-console
   - **Removals** → **New Request** → **Remove outdated content**
   - Enter the old logo image URL
   - Submit request

### Step 4: Update Social Media & Other Platforms

#### A. Clear Facebook Cache
1. Go to https://developers.facebook.com/tools/debug/
2. Enter: `https://eastatwest.com`
3. Click **"Fetch new scrape information"**
4. Repeat 2-3 times if needed
5. Verify new logo appears in preview

#### B. Clear Twitter/X Cache
1. Go to https://cards-dev.twitter.com/validator
2. Enter: `https://eastatwest.com`
3. Click **"Preview card"**
4. If old logo shows, wait 7 days (Twitter cache TTL)

#### C. Clear LinkedIn Cache
1. Go to https://www.linkedin.com/post-inspector/
2. Enter: `https://eastatwest.com`
3. Click **"Inspect"**
4. Re-inspect if old logo appears

---

## Verification Checklist

Use this checklist to verify the logo update is complete:

### Website Verification
- [ ] Visit https://eastatwest.com in incognito mode
- [ ] Check browser tab icon (favicon) shows new logo
- [ ] View page source, search for `"logo"` in JSON-LD
- [ ] Confirm logo URL includes `?v5` parameter

### Google Verification
- [ ] Google Business Profile shows new logo
- [ ] Google Maps shows new logo for the restaurant
- [ ] Google Search rich results show new logo
- [ ] Google Rich Results Test passes: https://search.google.com/test/rich-results
- [ ] Search Console shows successful indexing

### Social Media Verification
- [ ] Facebook preview shows new logo
- [ ] Twitter card preview shows new logo
- [ ] LinkedIn preview shows new logo

---

## Timeline Expectations

| Platform | Expected Update Time |
|----------|---------------------|
| Website (after deployment) | Immediate |
| Browser cache (hard refresh) | Immediate |
| Google Business Profile | 1-3 days |
| Google Search Results | 3-7 days |
| Google Maps | 3-7 days |
| Google Images | 2-4 weeks |
| Social Media Cache | 1-7 days |
| Third-party websites | Varies (they must update) |

---

## Troubleshooting

### Problem: Old logo still appears on Google after 7 days

**Solution:**
1. Verify logo uploaded to Google Business Profile
2. Check if structured data is correct:
   ```bash
   curl https://eastatwest.com | grep -A5 '"logo"'
   ```
3. Request re-indexing again in Search Console
4. Contact Google Business Support if issue persists

### Problem: "Logo field not detected" in Rich Results Test

**Solution:**
1. Verify deployment is live
2. Check that `FAVICON_VERSION = 'v5'` in `src/app/layout.tsx`
3. Verify logo file exists: https://eastatwest.com/android-chrome-512x512.png
4. Clear CDN cache and redeploy

### Problem: Logo appears on Google but not on Google Maps

**Solution:**
1. Update logo specifically in Google Business Profile
2. Wait 1-3 days for Maps to sync
3. Verify business information is complete in Business Profile

---

## Important Notes

### Do NOT Delete Old Logo Files
Keep the old favicon files on the server even after updating. Some cached references may still point to them. Delete them only after 6+ months.

### Logo Requirements for Google
- **File format**: PNG recommended (supports transparency)
- **Size**: 512x512 pixels (current setup)
- **Aspect ratio**: 1:1 (square)
- **Background**: Can be transparent or solid color
- **Content**: Should clearly represent your brand

### Monitoring Logo Changes
Check these URLs regularly:
- Google Business Profile: https://business.google.com/
- Search Console: https://search.google.com/search-console
- Rich Results Test: https://search.google.com/test/rich-results?url=https://eastatwest.com

---

## Quick Reference: Files Modified

| File | Change | Purpose |
|------|--------|---------|
| `src/app/layout.tsx` (line 52) | `FAVICON_VERSION = 'v5'` | Cache busting |
| `src/app/layout.tsx` (line 146-151) | Added `logo` field | Google structured data |
| All favicon links | Added `?v5` parameter | Force refresh |

---

## Additional Resources

- **Google Business Profile Help**: https://support.google.com/business/
- **Structured Data Guidelines**: https://developers.google.com/search/docs/appearance/structured-data/logo
- **Rich Results Test**: https://search.google.com/test/rich-results
- **Search Console**: https://search.google.com/search-console

---

## Need Help?

If the logo doesn't update after following all steps:

1. **Technical Issue**: Check deployment logs and verify all changes are live
2. **Google Issue**: Contact Google Business Support: https://support.google.com/business/gethelp
3. **SEO Issue**: Request assistance from a Google Search Console specialist

**Note**: Logo changes on Google are not instant. Be patient and allow up to 7 days for changes to fully propagate.
