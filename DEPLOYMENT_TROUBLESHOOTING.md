# Deployment Troubleshooting - Site Not Loading

## Problem
- Home page not loading (blank/404)
- `/favicon.ico:1 Failed to load resource: 404`
- Nothing opens on the site

## Most Likely Causes

### 1. Netlify Build Failed
**Check:**
1. Go to https://app.netlify.com
2. Select your site (eastatwest.com)
3. Click **"Deploys"** tab
4. Look at the latest deploy status

**If deploy shows "Failed" or "Error":**
- Click on the failed deploy
- Scroll down to see build logs
- Look for error messages (usually in red)
- Common errors:
  - Missing environment variables
  - Build timeout
  - Out of memory
  - Dependency installation failed

**Fix:**
- Click **"Trigger deploy"** → **"Clear cache and deploy site"**
- If it fails again, check the error logs

### 2. Domain Not Connected Properly
**Check:**
1. Go to Netlify Dashboard → **Domain settings**
2. Verify `eastatwest.com` is listed
3. Check if DNS is configured correctly

**DNS should point to:**
- **A Record** → Netlify Load Balancer IP
- **OR CNAME** → `your-site-name.netlify.app`

### 3. Site Not Deployed to Production
**Check:**
1. Netlify Dashboard → **Deploys**
2. Look for "Published" status on main4 branch
3. Check if the latest commit is deployed

**If not deployed:**
- Branch name mismatch (check if Netlify is watching "main4" branch)
- Auto-deploy disabled
- Build skipped

### 4. Wrong Netlify Site
**Check:**
- Are you looking at the correct Netlify site?
- Is eastatwest.com connected to the right project?
- Try accessing the Netlify subdomain directly: `your-site.netlify.app`

## Quick Diagnostic Steps

### Step 1: Check Netlify Subdomain
1. Find your Netlify subdomain (e.g., `eastatwest-restaurant.netlify.app`)
2. Visit it directly in browser
3. **If it loads:** DNS/domain issue
4. **If it doesn't load:** Build/deployment issue

### Step 2: Check Build Logs
1. Netlify Dashboard → Deploys → Click latest deploy
2. Scroll through build log
3. Look for:
   ```
   ✓ Build succeeded
   ✓ Deploy successful
   ```
4. **OR** errors like:
   ```
   ✗ Build failed
   Error: ...
   ```

### Step 3: Check Environment Variables
Missing variables will cause build to fail.

Required in Netlify:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (if using maps)
- `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` (if using maps)

**To add:**
1. Netlify → Site settings → Environment variables
2. Add missing variables
3. Redeploy

### Step 4: Check Branch Settings
1. Netlify → Site settings → Build & deploy → Continuous deployment
2. **Production branch** should be: `main4`
3. If it says `main` or `master`, change it to `main4`
4. Save and trigger new deploy

## Manual Deploy (If Auto-Deploy Fails)

### Option 1: Netlify CLI
```bash
cd C:\Users\mbike\.claude\projects\eastatwest-restaurant-main4
npm run build
netlify deploy --prod
```

### Option 2: Force Deploy from GitHub
1. Make a small change (add space to README)
2. Commit and push
3. This triggers new deploy

## Check Current Status

### Online Tools:
1. **Is site online?** https://downforeveryoneorjustme.com/eastatwest.com
2. **DNS check:** https://www.whatsmydns.net/#A/eastatwest.com
3. **SSL check:** https://www.ssllabs.com/ssltest/analyze.html?d=eastatwest.com

### Command Line:
```bash
# Check if domain resolves
nslookup eastatwest.com

# Check HTTP status
curl -I https://eastatwest.com

# Check Netlify subdomain
curl -I https://your-site.netlify.app
```

## Common Fixes

### Fix 1: Clear Cache and Redeploy
1. Netlify → Deploys
2. **Trigger deploy** → **Clear cache and deploy site**
3. Wait 5-10 minutes

### Fix 2: Rebuild from Scratch
1. Netlify → Deploys → Deploy settings
2. Click **Clear build cache**
3. Trigger new deploy

### Fix 3: Check Node Version
1. Netlify → Site settings → Build & deploy → Environment
2. Verify `NODE_VERSION = 18` is set
3. Save and redeploy

### Fix 4: Manual Deployment
If auto-deploy is broken:
1. Build locally: `npm run build`
2. Deploy folder manually via Netlify CLI
3. Or use Netlify drop (drag .next folder)

## Emergency: Site Completely Down

### Quick Recovery:
1. Go to Netlify → Deploys
2. Find the **last working deploy** (one that shows "Published")
3. Click on it
4. Click **"Publish deploy"** to rollback
5. This restores the last working version immediately

## Prevention

### Setup Notifications:
1. Netlify → Site settings → Build & deploy → Deploy notifications
2. Add email for failed builds
3. Add Slack webhook (optional)

### Enable Deploy Previews:
1. Site settings → Build & deploy → Deploy contexts
2. Enable deploy previews for pull requests
3. Test changes before merging to main4

## Need Help?

### Information to Gather:
1. Latest deploy log (copy full text)
2. Environment variables list (names only, not values)
3. Branch name being deployed
4. Build command and publish directory
5. Node version

### Support:
- Netlify Support: https://www.netlify.com/support/
- Netlify Forums: https://answers.netlify.com/
