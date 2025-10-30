# WordPress to Next.js Migration - Preventing Old Site Access

## Problem
After migrating from WordPress to Next.js, some links may still load the old WordPress site due to:
- Browser caching
- CDN caching (Netlify/Cloudflare)
- DNS propagation delays
- Search engine cached results

## Solutions Implemented

### 1. Redirect Rules (`public/_redirects`)
Added comprehensive redirect rules to block all WordPress URLs:
- `/wp-admin/*` → redirects to home
- `/wp-login.php` → redirects to home
- `/wp-content/*` → redirects to home
- `/wp-includes/*` → redirects to home
- `/wp-json/*` → redirects to home
- All old WordPress page URLs mapped to new Next.js routes

### 2. Middleware Protection (`src/middleware.ts`)
Server-side middleware that catches WordPress URLs before they reach any page:
- Detects WordPress paths in real-time
- Returns 301 permanent redirects
- Runs on edge runtime for fast response

### 3. Cache Control Headers (`netlify.toml`)
Updated headers to prevent old content caching:
- HTML pages: `max-age=0, must-revalidate` (always check for updates)
- Static assets: Long cache for performance
- Security headers added

## Steps to Clear Caches

### A. Clear Netlify Cache
1. Go to Netlify Dashboard: https://app.netlify.com
2. Select your site (eastatwest.com)
3. Go to **Deploys** tab
4. Click **Trigger deploy** → **Clear cache and deploy site**

### B. Clear Cloudflare Cache (if using)
1. Log in to Cloudflare: https://dash.cloudflare.com
2. Select eastatwest.com domain
3. Go to **Caching** → **Configuration**
4. Click **Purge Everything**
5. Confirm the purge

### C. Force Browser Cache Clear
Ask users experiencing issues to:
1. **Chrome/Edge**: Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
2. Select "Cached images and files"
3. Click "Clear data"
4. **OR** Use hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)

### D. Update DNS (if needed)
If the old WordPress server is still running:
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Update DNS records:
   - **A Record**: Point to Netlify IP or remove
   - **CNAME Record**: Point to your-site.netlify.app
3. Wait 24-48 hours for DNS propagation

### E. Verify Changes
1. Deploy the updated code to Netlify
2. Check these URLs (should all redirect to home):
   - https://eastatwest.com/wp-admin
   - https://eastatwest.com/wp-login.php
   - https://eastatwest.com/index.php
3. Use different browsers/incognito mode to test

## Monitoring Tools

### Check Redirects
```bash
curl -I https://eastatwest.com/wp-admin
# Should return: HTTP/1.1 301 Moved Permanently
# Location: https://eastatwest.com/
```

### Check Headers
```bash
curl -I https://eastatwest.com
# Should show: Cache-Control: public, max-age=0, must-revalidate
```

### Online Tools
- **Redirect Checker**: https://httpstatus.io
- **DNS Propagation**: https://www.whatsmydns.net
- **Cache Check**: https://cachecheck.opendns.com

## Prevention Tips

1. **Remove Old WordPress Installation**
   - If WordPress is still hosted somewhere, delete it completely
   - This prevents any accidental access

2. **Update Search Console**
   - Submit new sitemap to Google Search Console
   - Request re-indexing of important pages

3. **Monitor 404s**
   - Check Netlify Analytics for 404 errors
   - Add redirects for any missing pages

4. **Set Up Monitoring**
   - Use Uptime Robot or similar to monitor the site
   - Set alerts for downtime

## Emergency Contact

If WordPress continues to appear:
1. Check if old WordPress server is still running
2. Verify DNS points to Netlify
3. Contact hosting provider to ensure old site is offline
4. Clear all caches (steps A-C above)

## Files Modified
- `public/_redirects` - Added WordPress URL blocking
- `netlify.toml` - Updated cache headers
- `src/middleware.ts` - Added WordPress path detection
