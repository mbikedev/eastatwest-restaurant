# Supabase + Resend SMTP Integration Guide

## 📋 Summary

This guide covers integrating Resend SMTP with Supabase Auth for sending authentication emails (password resets, magic links, email confirmations).

---

## ✅ What's Already Configured

### Environment Variables (.env.local)
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://whixskigyxeligukorrm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Resend Configuration
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=contact@eastatwest.com
```

### Installed Dependencies
- ✅ `@supabase/supabase-js` v2.50.2
- ✅ `@supabase/ssr` v0.6.1
- ✅ `resend` v4.6.0
- ✅ Supabase CLI v2.47.2 (global)
- ✅ `tsx` (for running test scripts)

### Auth Files in Project
- `src/utils/supabase/client.ts` - Browser Supabase client
- `src/lib/supabaseServer.ts` - Server Supabase client
- `src/lib/supabaseClient.ts` - Legacy browser client
- `src/app/login/page.tsx` - Login page with password & magic link
- `src/hooks/useAdminAuth.ts` - Admin authentication hook
- `src/components/AdminAuthGuard.tsx` - Auth guard component

### Admin Email Whitelist
The following emails are authorized for admin access:
- `mbagnickg@gmail.com`
- `infos.east.west@gmail.com`
- `hannamoubayed@hotmail.com`

---

## 🔧 Step 1: Link Project to Supabase (Manual Method)

The CLI requires browser authentication. Follow these steps:

### Option A: Using Browser Authentication (Recommended)

1. **Login to Supabase CLI:**
   ```bash
   supabase login
   ```
   This will open your browser for authentication.

2. **Link Your Project:**
   ```bash
   supabase link --project-ref whixskigyxeligukorrm
   ```
   Enter your database password when prompted.

3. **Verify Link:**
   ```bash
   supabase status
   ```

### Option B: Using Access Token

If browser login doesn't work:

1. **Get Access Token:**
   - Go to: https://supabase.com/dashboard/account/tokens
   - Create a new access token
   - Copy it

2. **Login with Token:**
   ```bash
   supabase login --token <your-access-token>
   ```

3. **Link Project:**
   ```bash
   supabase link --project-ref whixskigyxeligukorrm
   ```

---

## 📧 Step 2: Configure SMTP in Supabase Dashboard

### Access SMTP Settings

1. Go to: https://supabase.com/dashboard/project/whixskigyxeligukorrm
2. Navigate to: **Authentication** → **Configuration** → **SMTP Settings**
3. Enable **Custom SMTP**

### Enter Resend SMTP Configuration

```
┌─────────────────────────────────────────────────┐
│ SMTP Configuration for Resend                  │
├─────────────────────────────────────────────────┤
│ Enable Custom SMTP: ✓ ON                       │
│                                                 │
│ Sender Name: East at West Restaurant           │
│ Sender Email: contact@eastatwest.com           │
│                                                 │
│ Host: smtp.resend.com                           │
│ Port: 465                                       │
│                                                 │
│ Username: resend                                │
│ Password: your_resend_api_key_here         │
│                                                 │
│ Minimum interval: 60 seconds                   │
└─────────────────────────────────────────────────┘
```

### Save Configuration

Click **Save** at the bottom of the page.

---

## 🌐 Step 3: Verify Domain in Resend (Important!)

### Why Verify Domain?

- **Without verification:** Can only send to emails registered in Resend account
- **With verification:** Can send to any email address
- **Better deliverability:** Emails less likely to go to spam

### Verify Domain in Resend

1. **Go to Resend Dashboard:**
   - Visit: https://resend.com/domains
   - Click **Add Domain**
   - Enter: `eastatwest.com`

2. **Copy DNS Records:**
   Resend will provide DNS records to add.

### Add DNS Records in Hostinger

Login to Hostinger and add these DNS records:

#### 1. TXT Record (Domain Verification)
```
Type: TXT
Name: @
Value: [provided by Resend]
TTL: Auto (or 3600)
```

#### 2. CNAME Record (DKIM Signature)
```
Type: CNAME
Name: resend._domainkey
Value: resend._domainkey.resend.com
TTL: Auto (or 3600)
```

#### 3. Update SPF Record
Find your existing SPF record and update it:

**Before:**
```
Type: TXT
Name: @
Value: v=spf1 include:titan.email ~all
```

**After:**
```
Type: TXT
Name: @
Value: v=spf1 include:titan.email include:_spf.resend.com ~all
```

#### 4. DMARC Record (Optional but Recommended)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:contact@eastatwest.com
```

### Verify in Resend

1. Wait 5-15 minutes for DNS propagation
2. Go back to Resend dashboard
3. Click **Verify Domain**
4. Status should show: ✅ **Verified**

### Check DNS Propagation

```bash
# Check TXT records
dig TXT eastatwest.com

# Check CNAME record
dig CNAME resend._domainkey.eastatwest.com
```

---

## 🧪 Step 4: Test Email Sending

### Method 1: Using Test Script (Recommended)

We've created a test script at `scripts/test-email.ts`.

**Run the test:**
```bash
npm run test:email
```

This will allow you to test:
1. Password reset emails
2. Magic link emails
3. User confirmation emails

**Example output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Supabase Auth Email Testing Tool
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Select test type:
1. Test Password Reset Email
2. Test Magic Link Email
3. Create Test User (sends confirmation email)
4. Run All Tests
5. Exit

Enter your choice (1-5): 1
📧 Enter email address to test: mbagnickg@gmail.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 Testing password reset email...
✅ Password reset email sent successfully!
📧 Check your inbox: mbagnickg@gmail.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Method 2: Using Your Application

1. **Test Password Reset:**
   - Go to: http://localhost:3000/login
   - Enter an email
   - Click "Forgot password?"
   - Click "Send Reset Link"
   - Check email inbox

2. **Test Magic Link:**
   - Go to: http://localhost:3000/login
   - Enter an email
   - Click "📧 Send Magic Link"
   - Check email inbox

3. **Test User Signup:**
   - Create a new user signup flow
   - Check confirmation email arrives

### Method 3: Using Supabase Dashboard

1. Go to: **Authentication** → **Users**
2. Click **Invite User**
3. Enter email address
4. Check email inbox

---

## 🔍 Step 5: Verify Email Delivery

### Check Supabase Logs

1. Go to: https://supabase.com/dashboard/project/whixskigyxeligukorrm
2. Navigate to: **Logs** → **Auth Logs**
3. Look for email sending events
4. Check for any errors

### Check Resend Dashboard

1. Go to: https://resend.com/emails
2. View sent emails
3. Check delivery status:
   - ✅ **Delivered**
   - ⏳ **Queued**
   - ❌ **Failed** (check error message)

### Check Your Inbox

- Check the recipient's inbox
- Check spam/junk folder
- Verify sender shows: `East at West Restaurant <contact@eastatwest.com>`
- Verify email content is correct

---

## 🎨 Step 6: Customize Email Templates (Optional)

### Access Email Templates

1. Go to: **Authentication** → **Email Templates**
2. You can customize:
   - Confirm signup
   - Invite user
   - Magic Link
   - Change Email Address
   - Reset Password

### Template Variables

Available variables:
```
{{ .ConfirmationURL }}    - Email confirmation link
{{ .Token }}              - OTP token
{{ .TokenHash }}          - Hashed token
{{ .SiteURL }}            - Your site URL
{{ .Email }}              - User's email
{{ .RedirectTo }}         - Redirect URL
```

### Example Custom Template

```html
<h2>Welcome to East at West Restaurant!</h2>

<p>Hi there,</p>

<p>Thanks for signing up. Please confirm your email address by clicking the button below:</p>

<a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #A8D5BA; color: white; text-decoration: none; border-radius: 5px;">
  Confirm Email Address
</a>

<p>Or copy and paste this link into your browser:</p>
<p>{{ .ConfirmationURL }}</p>

<p>If you didn't create an account with us, please ignore this email.</p>

<p>Best regards,<br>
The East at West Team</p>
```

---

## 📊 Generate TypeScript Types

Generate TypeScript types from your Supabase database:

```bash
npm run supabase:types
```

This will create `src/types/database.types.ts` with all your database types.

**Note:** You must have the project linked first (Step 1).

### Manual Type Generation

If the npm script doesn't work:

```bash
supabase gen types typescript --linked > src/types/database.types.ts
```

### Using Types in Your Code

```typescript
import { Database } from '@/types/database.types'

type Reservation = Database['public']['Tables']['reservations']['Row']
type Order = Database['public']['Tables']['orders']['Row']
```

---

## 🚨 Troubleshooting

### Emails Not Arriving

**1. Check SMTP Configuration**
- Verify all SMTP settings in Supabase dashboard
- Ensure password is correct: `re_6urjn6gZ_MFw2mTfkg7hVAR6WjAKHx4xM`
- Port should be 465 (not 587)

**2. Check Domain Verification**
- For testing: Use `onboarding@resend.dev`
- For production: Verify domain in Resend

**3. Check Email Logs**
- Supabase: **Logs** → **Auth Logs**
- Resend: https://resend.com/emails

**4. Check Spam Folder**
- Emails might be in spam/junk
- Mark as "Not Spam" to improve deliverability

**5. Check Rate Limits**
- Resend free tier: 100 emails/day, 3,000/month
- Supabase: 60 seconds minimum between emails to same user

### Common Errors

**Error: "Invalid SMTP credentials"**
- Check API key in Supabase dashboard
- Ensure username is exactly: `resend`

**Error: "Domain not verified"**
- Use `onboarding@resend.dev` for testing
- Or verify your domain in Resend

**Error: "Rate limit exceeded"**
- Check Resend dashboard for limits
- Wait before sending more emails

**Error: "Email provider blocked"**
- Check Resend status: https://resend.com/status
- Verify DNS records are correct

---

## 📝 Important Notes

### For Development

When testing locally, you can temporarily use:
```bash
RESEND_FROM_EMAIL=onboarding@resend.dev
```

This sender can only send to the email associated with your Resend account.

### For Production

After domain verification, update to:
```bash
RESEND_FROM_EMAIL=contact@eastatwest.com
```

Don't forget to update in:
- `.env.local` (local development)
- Vercel/Netlify/Hostinger environment variables (production)

### Rate Limits

**Resend Free Tier:**
- 3,000 emails/month
- 100 emails/day
- API calls limited

**Supabase Auth:**
- 60 seconds minimum between emails to same user
- Prevents spam and abuse

### Security

- Never commit `.env.local` to git (already in `.gitignore`)
- Keep API keys secure
- Use service role key only on backend
- Restrict admin access to whitelisted emails

---

## 🎯 Quick Reference Commands

```bash
# Supabase CLI
supabase login                          # Login to Supabase
supabase link --project-ref <ref>       # Link project
supabase status                         # Check status
supabase gen types typescript --linked  # Generate types

# Testing
npm run test:email                      # Test email sending
npm run dev                             # Start development server

# Development
npm install                             # Install dependencies
npm run build                           # Build for production
npm start                              # Start production server
```

---

## 📞 Support Resources

### Supabase
- Dashboard: https://supabase.com/dashboard
- Documentation: https://supabase.com/docs
- Auth Docs: https://supabase.com/docs/guides/auth

### Resend
- Dashboard: https://resend.com
- Documentation: https://resend.com/docs
- Emails: https://resend.com/emails
- Status: https://resend.com/status

### Project Configuration
- Supabase Project: https://supabase.com/dashboard/project/whixskigyxeligukorrm
- Auth Settings: Authentication → Configuration → SMTP Settings
- Email Templates: Authentication → Email Templates
- Logs: Logs → Auth Logs

---

## ✅ Next Steps

1. ☐ Link project to Supabase using CLI (`supabase login` then `supabase link`)
2. ☐ Configure SMTP in Supabase dashboard with Resend credentials
3. ☐ Verify domain in Resend dashboard
4. ☐ Add DNS records in Hostinger
5. ☐ Test email sending using `npm run test:email`
6. ☐ Verify emails arrive in inbox
7. ☐ Generate TypeScript types using `npm run supabase:types`
8. ☐ Customize email templates (optional)
9. ☐ Deploy and test in production

---

**Last Updated:** 2025-10-30
**Status:** Ready for SMTP configuration
**Environment:** Development
