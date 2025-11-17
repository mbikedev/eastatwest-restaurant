# Google reCAPTCHA v3 Setup Guide

This guide will help you set up Google reCAPTCHA v3 for spam protection on your blog comment form.

## What is reCAPTCHA v3?

reCAPTCHA v3 is Google's invisible spam protection that runs in the background without requiring users to solve puzzles or click checkboxes. It assigns each user interaction a score (0.0 to 1.0), where 1.0 indicates a likely human and 0.0 indicates a likely bot.

## Setup Steps

### 1. Get Your reCAPTCHA Keys

1. Go to the [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Sign in with your Google account
3. Click the **+** button to register a new site
4. Fill in the registration form:
   - **Label**: `East at West Blog` (or any name you prefer)
   - **reCAPTCHA type**: Select **reCAPTCHA v3**
   - **Domains**: Add your domains:
     - `eastatwest.com`
     - `www.eastatwest.com`
     - `localhost` (for testing)
   - Accept the reCAPTCHA Terms of Service
5. Click **Submit**
6. You'll receive two keys:
   - **Site Key** (NEXT_PUBLIC_RECAPTCHA_SITE_KEY)
   - **Secret Key** (RECAPTCHA_SECRET_KEY)

### 2. Add Keys to Your Environment Variables

1. Open your `.env.local` file
2. Replace the placeholder values with your actual keys:

```bash
# Google reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_actual_site_key_here
RECAPTCHA_SECRET_KEY=your_actual_secret_key_here
```

**Important**:
- The `NEXT_PUBLIC_` prefix makes the site key available to the browser
- The secret key should NEVER be exposed to the browser
- Never commit these keys to Git (`.env.local` is already in `.gitignore`)

### 3. Restart Your Development Server

After adding the keys, restart your Next.js development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 4. Test the Integration

1. Visit a blog post on your site (e.g., `http://localhost:3000/blog/vegetarian-restaurant-brussels`)
2. Scroll down to the comment form
3. Fill out the form and submit a comment
4. The comment should be submitted successfully after reCAPTCHA verification
5. Check the browser console (F12) - you should see no reCAPTCHA errors

## How It Works

### Frontend (Blog Post Page)

The blog post page (`src/app/blog/[slug]/page.tsx`) loads the reCAPTCHA script:

```jsx
<Script
  src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
  strategy="lazyOnload"
/>
```

### Comment Form (CommentSection Component)

When a user submits a comment, the form:

1. Gets a reCAPTCHA token from Google: `grecaptcha.execute()`
2. Sends the token to your API for verification
3. Only submits the comment if verification succeeds

### Backend Verification (API Route)

The API route (`src/app/api/verify-recaptcha/route.ts`) verifies the token with Google and checks:

- Is the token valid?
- Is the score above 0.5 (likely human)?

## Score Threshold

The current implementation uses a score threshold of **0.5**. This means:

- **Score 1.0**: Very likely a good interaction (human)
- **Score 0.5+**: Accepted (default threshold)
- **Score below 0.5**: Rejected as likely spam/bot

You can adjust this threshold in `src/app/api/verify-recaptcha/route.ts` (line 33):

```typescript
if (data.success && data.score >= 0.5) {  // Change 0.5 to your preferred threshold
```

**Recommendations**:
- **0.3**: More lenient (fewer false positives, but allows some spam)
- **0.5**: Balanced (recommended)
- **0.7**: Stricter (blocks more spam, but may reject some real users)

## Testing

### Test in Development

1. reCAPTCHA works on `localhost` without special configuration
2. Submit test comments and check:
   - Comments are accepted for normal submissions
   - Check browser console for any errors

### Test in Production

1. Deploy your changes to production
2. Make sure your production domain is added to reCAPTCHA admin console
3. Test comment submission on the live site

## Monitoring

You can monitor reCAPTCHA activity in the [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin):

- View request volume
- See score distribution
- Detect unusual patterns

## Troubleshooting

### "reCAPTCHA verification failed"

**Causes**:
- Invalid site key
- Domain not registered in reCAPTCHA console
- Score below threshold

**Solutions**:
1. Double-check your site key in `.env.local`
2. Verify your domain is registered in reCAPTCHA admin
3. Check browser console for detailed errors

### "Error verifying you are human"

**Causes**:
- Network error
- reCAPTCHA script failed to load
- Browser blocking reCAPTCHA

**Solutions**:
1. Check your internet connection
2. Disable ad blockers temporarily
3. Try a different browser

### reCAPTCHA Not Loading

**Causes**:
- Site key not set in environment variables
- Server not restarted after adding keys

**Solutions**:
1. Verify `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set in `.env.local`
2. Restart your development server
3. Clear browser cache

## Security Best Practices

1. **Never commit keys to Git**: Always use environment variables
2. **Rotate keys periodically**: Generate new keys every 6-12 months
3. **Monitor your reCAPTCHA dashboard**: Watch for unusual patterns
4. **Keep your secret key secret**: Never expose it in client-side code
5. **Use HTTPS in production**: reCAPTCHA requires HTTPS for production domains

## Disabling reCAPTCHA (For Testing)

If you need to temporarily disable reCAPTCHA:

1. Remove or comment out the keys in `.env.local`:
```bash
# NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
# RECAPTCHA_SECRET_KEY=your_secret_key_here
```

2. The comment form will work without reCAPTCHA protection

## Additional Resources

- [reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [reCAPTCHA FAQ](https://developers.google.com/recaptcha/docs/faq)

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify your environment variables are set correctly
3. Ensure your domain is registered in reCAPTCHA admin
4. Check the reCAPTCHA dashboard for error logs
