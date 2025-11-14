# Deployment & Testing Guide - Redirect Fixes

## 📋 Overview

All 108 legacy WordPress URLs have been fixed with proper 301 redirects. This guide will help you deploy and verify the changes.

## 🚀 Step 1: Deploy to Production

### Current Status
- ✅ Code committed to `main2` branch
- ✅ Changes pushed to GitHub
- ⏳ Netlify auto-deployment triggered

### Monitor Deployment

1. **Check Netlify Dashboard**
   - Go to: https://app.netlify.com
   - Select your site
   - Look for latest deployment from `main2` branch
   - Wait for "Published" status (usually 3-5 minutes)

2. **Check Deployment Logs**
   - Click on the deployment
   - Review build logs for any errors
   - Verify "next.config.mjs" was included in the build

### Expected Build Output
```
✓ Compiled successfully
✓ Generating static pages (45/45)
✓ Finalizing page optimization
```

## 🧪 Step 2: Test Redirects Locally (Optional)

Before testing on production, you can verify redirects work locally:

### Start Development Server
```bash
npm run dev
```

### Run Test Script
```bash
node scripts/test-redirects.js
```

Expected output:
```
📂 French Language URLs
──────────────────────────────────────────────────────────
  ✅ /fr → /
  ✅ /fr/about-snack-halal → /about
  ✅ /fr/blog → /blog
  ...

📊 Test Summary
═══════════════════════════════════════════════════════
Total Tests: 28
✅ Passed: 28
❌ Failed: 0
Success Rate: 100%

🎉 All redirects working correctly!
```

## 🌐 Step 3: Test Production Redirects

After Netlify deployment completes:

### Run Production Tests
```bash
node scripts/test-redirects.js --production
```

### Manual Testing with cURL
Test a few sample URLs to verify 301 redirects:

```bash
# Test French URL
curl -I https://eastatwest.com/fr/product/humos
# Expected: HTTP/1.1 301 Moved Permanently
# Location: https://eastatwest.com/menu

# Test WordPress query param
curl -I "https://eastatwest.com/?post_type=product&p=4043"
# Expected: HTTP/1.1 301 Moved Permanently
# Location: https://eastatwest.com/menu

# Test legacy product page
curl -I https://eastatwest.com/product/kebbe-frit
# Expected: HTTP/1.1 301 Moved Permanently
# Location: https://eastatwest.com/menu

# Test legacy page
curl -I https://eastatwest.com/about-snack-halal
# Expected: HTTP/1.1 301 Moved Permanently
# Location: https://eastatwest.com/about

# Test Facebook tracking parameter
curl -I "https://eastatwest.com/menu?fbclid=test123"
# Expected: HTTP/1.1 301 Moved Permanently
# Location: https://eastatwest.com/menu
```

### Browser Testing
1. Open browser DevTools (F12)
2. Go to Network tab
3. Visit a legacy URL like: `https://eastatwest.com/fr/product/humos`
4. Verify:
   - Status: `301 Moved Permanently`
   - Location header points to correct URL
   - Browser redirects to new URL

## 📊 Step 4: Google Search Console Submission

### 4A. Submit Sitemap

1. Go to: https://search.google.com/search-console
2. Select property: `eastatwest.com`
3. Click **Sitemaps** in left sidebar
4. Enter: `https://eastatwest.com/sitemap.xml`
5. Click **Submit**

### 4B. Request Indexing for Key Pages

Priority URLs to manually index:

1. Click **URL Inspection** in left sidebar
2. Test each URL below:
   - `https://eastatwest.com/`
   - `https://eastatwest.com/menu`
   - `https://eastatwest.com/blog`
   - `https://eastatwest.com/about`
   - `https://eastatwest.com/events-catering`
   - `https://eastatwest.com/reservations`

3. For each URL:
   - Enter URL in search box
   - Click "Test Live URL"
   - Wait for results
   - Click "Request Indexing"

### 4C. Optional: Bulk URL Submission

Use the file `google-search-console-urls.txt` which contains:
- Current valid URLs to index (top section)
- Legacy URLs for monitoring (bottom section)

**Note:** Google Search Console doesn't have a bulk submission API, but you can:
- Monitor these URLs in the Coverage report
- Google will automatically discover redirects when crawling
- No manual action needed for legacy URLs (they redirect automatically)

## 📈 Step 5: Monitor Progress

### Week 1: Initial Monitoring

**Check Daily:**
1. **Coverage Report** (Google Search Console)
   - Go to: Coverage or Pages
   - Look for "Page with redirect" section
   - Note the current count (should be 108 initially)

2. **URL Inspection**
   - Test 5-10 random legacy URLs
   - Verify Google sees the 301 redirect
   - Check "Redirect target" is correct

### Week 2-4: Track Improvements

**Check Weekly:**
1. **Coverage Report**
   - "Page with redirect" count should decrease
   - Target: 0 errors by week 4

2. **Indexed Pages**
   - Total indexed pages should stabilize
   - Only current, valid URLs should be indexed

3. **Search Performance**
   - Monitor clicks and impressions
   - Should remain stable or improve

## 🔍 Verification Checklist

### Deployment Verification
- [ ] Netlify deployment successful
- [ ] No build errors
- [ ] next.config.mjs changes deployed

### Redirect Testing
- [ ] Local tests pass (100%)
- [ ] Production tests pass (100%)
- [ ] Manual cURL tests show 301 redirects
- [ ] Browser tests show proper redirects

### Google Search Console
- [ ] Sitemap submitted
- [ ] Key pages requested for indexing
- [ ] Coverage report monitored
- [ ] Legacy URLs showing as redirects

## ❗ Troubleshooting

### Issue: Redirects not working after deployment

**Check:**
1. Verify deployment completed successfully
2. Clear browser cache (or use incognito mode)
3. Test with cURL to see actual HTTP status
4. Check Netlify deploy logs for errors
5. Verify `next.config.mjs` was included in build

**Fix:**
```bash
# Rebuild locally to verify
npm run build

# If successful, force redeploy on Netlify
git commit --allow-empty -m "Force redeploy"
git push origin main2
```

### Issue: Some redirects return 404

**Check:**
1. Verify URL pattern matches exactly in `next.config.mjs`
2. Check for typos in redirect rules
3. Test locally first: `npm run dev`

**Fix:**
- Update `next.config.mjs` with correct pattern
- Commit and push changes

### Issue: Google still shows redirect errors after 2 weeks

**This is normal:**
- Google recrawls at different rates
- Some URLs may take 4-6 weeks to update
- Legacy URLs will eventually be removed from index

**Action:**
- Continue monitoring
- Manually request reindexing for persistent issues
- Verify redirects are working with cURL

### Issue: Redirects create redirect chains

**Check:**
```bash
curl -I -L https://eastatwest.com/fr/product/humos
```

Should show:
```
HTTP/1.1 301 Moved Permanently
Location: https://eastatwest.com/menu

HTTP/1.1 200 OK
```

If you see multiple 301s, there's a redirect chain - check configuration.

## 📝 Files Reference

### Configuration Files
- `next.config.mjs` - Next.js redirect rules (primary)
- `public/_redirects` - Netlify redirect rules (fallback)

### Documentation Files
- `REDIRECT_FIXES_GOOGLE_INDEXING.md` - Detailed fix documentation
- `NEXT_STEPS_GOOGLE_INDEXING.md` - Step-by-step GSC guide
- `DEPLOYMENT_AND_TESTING_GUIDE.md` - This file

### Testing & Analysis Files
- `scripts/test-redirects.js` - Automated testing script
- `redirect-analysis.json` - Categorized URL breakdown
- `google-search-console-urls.txt` - URLs for GSC submission

### Working Files (Can be deleted)
- `analyze-redirects.js` - Script used to analyze Excel file

## ✅ Success Criteria

**Immediate (Day 1-2):**
- ✅ Deployment successful
- ✅ All redirects return 301 status
- ✅ Redirects point to correct destinations
- ✅ No redirect chains
- ✅ Test script shows 100% pass rate

**Short-term (Week 1-2):**
- ✅ Sitemap submitted to GSC
- ✅ Key pages indexed
- ✅ GSC shows redirects are discovered

**Long-term (Week 3-4):**
- ✅ "Page with redirect" errors decrease to 0
- ✅ Only current URLs in Google's index
- ✅ SEO rankings maintained or improved
- ✅ No 404 errors for legacy URLs

## 🎯 Expected Timeline

| Day | Activity | Expected Result |
|-----|----------|----------------|
| 0 | Deploy changes | ✅ Redirects live |
| 1 | Submit to GSC | ✅ Sitemap processing |
| 2-3 | Monitor GSC | Google starts recrawling |
| 7 | Week 1 check | 20-30% of URLs updated |
| 14 | Week 2 check | 50-70% of URLs updated |
| 21 | Week 3 check | 80-90% of URLs updated |
| 28 | Week 4 check | 100% - All URLs updated |

---

**Status**: Ready for deployment ✅
**Branch**: main2
**Commit**: 67b67f3
**Date**: 2025-11-11
