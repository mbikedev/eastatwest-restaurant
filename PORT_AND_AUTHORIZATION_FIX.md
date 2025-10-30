# Port and Authorization Fix Guide

## Current Issues
1. **Port Mismatch**: Error shows `localhost:3001` but you're running on `localhost:3000`
2. **RefererNotAllowedMapError**: Domain not authorized in Google Cloud Console
3. **Deprecated Marker Warning**: Some components still using old markers

## Quick Fixes

### Fix 1: Check Your Port
The error shows `http://localhost:3001/contact` but you should be running on port 3000.

**Check your current port:**
1. Look at your terminal where you ran `npm run dev`
2. It should show something like: `Local: http://localhost:3000`
3. If it shows port 3001, that's fine - just update the Google Cloud Console settings

### Fix 2: Update Google Cloud Console Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Click on your API key
4. Under **Application restrictions**, select **HTTP referrers (web sites)**
5. Add these referrers:
   - `http://localhost:3000/*`
   - `http://localhost:3001/*` (if you're using port 3001)
   - `http://localhost:3000/contact`
   - `http://localhost:3001/contact` (if you're using port 3001)
6. Click **SAVE**

### Fix 3: Clear Browser Cache
1. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Or clear browser cache completely
3. Try in an incognito/private window

### Fix 4: Wait for Changes to Propagate
API key restrictions can take 5-10 minutes to take effect.

## Alternative: Use Placeholder Map Temporarily

If you want to test the site without dealing with Google Maps API issues:

1. **Temporarily remove the API key** from `.env.local`:
   ```bash
   # Comment out or remove these lines
   # NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
   # NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your_map_id
   ```

2. **Restart your development server**:
   ```bash
   npm run dev
   ```

3. **Visit the contact page** - you'll see a placeholder map with restaurant information

4. **Check the diagnostic component** for setup instructions

## Verification Steps

### Step 1: Check Your Port
```bash
# In your terminal, check what port you're running on
# Look for a line like: Local: http://localhost:3000
```

### Step 2: Test the API Endpoint
Visit: `http://localhost:3000/api/test-google-maps` (or your actual port)

You should see a JSON response with your API key status.

### Step 3: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to the contact page
4. Look for any error messages

### Step 4: Use Diagnostic Component
The diagnostic component on the contact page will show:
- API key status
- Map ID status
- Specific error messages
- Troubleshooting steps

## Common Solutions

### If you're running on port 3001:
1. Update Google Cloud Console to include `http://localhost:3001/*`
2. Wait 5-10 minutes for changes to propagate
3. Clear browser cache

### If you're running on port 3000:
1. Make sure Google Cloud Console includes `http://localhost:3000/*`
2. Check that the API key restrictions are saved
3. Wait for changes to propagate

### If you want to use a different port:
1. Update Google Cloud Console with your actual port
2. Restart your development server
3. Clear browser cache

## Next Steps

Once the authorization is fixed:

1. **Add your Map ID** to `.env.local` for Advanced Markers
2. **Test map functionality** - click markers, zoom, pan
3. **Check mobile responsiveness**
4. **Update for production** when ready

## Support

If issues persist:

1. **Check the diagnostic component** on the contact page
2. **Test the API endpoint** at `/api/test-google-maps`
3. **Verify Google Cloud Console** settings
4. **Use the placeholder map** temporarily while troubleshooting

The diagnostic component will help you identify exactly what's wrong and guide you through the fix. 