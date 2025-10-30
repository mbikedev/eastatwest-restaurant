# SMTP Troubleshooting Summary

**Date:** 2025-10-30
**Project:** East at West Restaurant
**Issue:** Supabase Auth SMTP configuration fails to send emails

---

## ✅ What Works

### 1. Resend API - FULLY FUNCTIONAL
- **API Key:** Valid and working (`re_6urjn6gZ_...`)
- **Domain:** `eastatwest.com` - Verified in Resend
- **Region:** EU-WEST-1
- **Direct Email Test:** ✅ SUCCESS
  - Email ID: `8c2c3aa5-bb63-4f64-9e39-257745f87747`
  - Delivered to: `mbagnickg@gmail.com`
  - Test command: `npm run test:resend-direct`

### 2. Environment Variables - CONFIGURED
```bash
NEXT_PUBLIC_SUPABASE_URL=https://whixskigyxeligukorrm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
RESEND_API_KEY=re_6urjn6gZ_MFw2mTfkg7hVAR6WjAKHx4xM
RESEND_FROM_EMAIL=contact@eastatwest.com
```

### 3. Supabase Connection - WORKING
- Project Reference: `whixskigyxeligukorrm`
- Database connection: ✅ Working
- Auth API: ✅ Working
- Service role key: ✅ Valid

---

## ❌ What Doesn't Work

### Supabase SMTP Configuration
**Status:** FAILS with error 500

**Error Message:**
```
Error sending recovery email
Status: 500
Code: unexpected_failure
```

**Configuration Attempted:**
```
Enable Custom SMTP: ON
Host: smtp.resend.com
Port: 465 (also tried 587)
Username: resend
Password: re_6urjn6gZ_MFw2mTfkg7hVAR6WjAKHx4xM
Sender Email: onboarding@resend.dev (also tried contact@eastatwest.com)
Sender Name: East at West Restaurant
```

---

## 🔍 Troubleshooting Steps Completed

### 1. Environment Variable Verification
- ✅ All required variables present
- ✅ Values correctly formatted
- ✅ .env.local loading properly

### 2. Resend API Testing
- ✅ API key validated via Resend API
- ✅ Domain verification confirmed
- ✅ Direct email sending successful
- ✅ Account status: Active

### 3. SMTP Configuration Testing
- ✅ Verified against Resend documentation
- ✅ Verified against Supabase documentation
- ✅ Tried both port 465 and 587
- ✅ Tried both sender emails (custom domain and test email)
- ✅ Verified no extra spaces or hidden characters
- ✅ Toggle enabled and disabled multiple times

### 4. Diagnostic Scripts Created
- `npm run test:email` - Interactive email testing
- `npm run test:password-reset` - Quick password reset test
- `npm run test:resend-api` - Validate Resend API key
- `npm run test:resend-direct` - Send email directly via Resend
- `npm run diagnose:smtp` - Complete SMTP diagnostic

---

## 📋 Configuration Comparison

### According to Official Documentation

**Resend Documentation:**
```
Host: smtp.resend.com
Port: 465
Username: resend
Password: YOUR_API_KEY
```

**Our Configuration:**
```
Host: smtp.resend.com ✅
Port: 465 ✅
Username: resend ✅
Password: re_6urjn6gZ_MFw2mTfkg7hVAR6WjAKHx4xM ✅
```

**Result:** Still fails despite matching exactly

---

## 🤔 Possible Causes

### 1. Supabase Infrastructure Issue
- SMTP service may be experiencing issues
- Regional connectivity problems
- Internal Supabase bug

### 2. Account/Project Limitations
- Free tier SMTP restrictions
- Rate limiting (though no emails sent yet)
- Project-specific configuration issue

### 3. Cache/Propagation Delay
- Configuration changes not fully propagated
- Supabase backend cache not refreshed
- DNS or connectivity caching

### 4. Firewall/Security Rules
- Supabase IP blocked by Resend
- Regional restrictions
- Security policy preventing SMTP

---

## 🎯 Recommended Next Steps

### Immediate Actions

**1. Check Supabase Auth Logs**
- Go to: https://supabase.com/dashboard/project/whixskigyxeligukorrm/logs/auth-logs
- Look for detailed SMTP error messages
- Check timestamps matching our tests
- Look for error codes like:
  - `535 Authentication failed`
  - `Connection refused`
  - `Relay access denied`
  - `Timeout`

**2. Contact Supabase Support**
Since configuration matches documentation but fails:
- Go to: https://supabase.com/dashboard/support
- Provide:
  - Project Reference: `whixskigyxeligukorrm`
  - Error: "Error sending recovery email (500)"
  - Note: Resend API works directly, SMTP fails
  - Configuration details (without sensitive keys)

**3. Wait and Retry**
- SMTP configuration may take time to propagate
- Try again in 2-4 hours
- Sometimes backend updates are delayed

### Alternative Solutions

**Option A: Use Resend SDK Directly**
Bypass Supabase SMTP entirely:
- Already proven to work (`npm run test:resend-direct`)
- More control over email content
- Better error handling
- Implementation required for auth flows

**Option B: Use Different SMTP Provider**
Test with another provider to isolate issue:
- Try Gmail SMTP (for testing only)
- Try SendGrid
- If others work, issue is Resend-specific
- If others fail, issue is Supabase-specific

**Option C: Use Supabase Default Emails**
- Disable custom SMTP
- Use Supabase's built-in email service
- Limited customization but works out of box
- Rate limits may apply

---

## 📁 Files Created

### Test Scripts
- `scripts/test-email.ts` - Interactive email testing tool
- `scripts/test-password-reset.ts` - Quick password reset test
- `scripts/test-resend-api.ts` - Resend API validation
- `scripts/test-resend-direct.ts` - Direct Resend email sending
- `scripts/diagnose-smtp.ts` - Complete SMTP diagnostics
- `scripts/check-auth-logs.ts` - Auth log helper

### Documentation
- `SUPABASE_RESEND_SMTP_SETUP.md` - Complete setup guide
- `SMTP_TROUBLESHOOTING_SUMMARY.md` - This file

### Package.json Scripts
```json
{
  "scripts": {
    "test:email": "tsx scripts/test-email.ts",
    "test:password-reset": "tsx scripts/test-password-reset.ts",
    "test:resend-api": "tsx scripts/test-resend-api.ts",
    "test:resend-direct": "tsx scripts/test-resend-direct.ts",
    "diagnose:smtp": "tsx scripts/diagnose-smtp.ts",
    "supabase:types": "supabase gen types typescript --linked > src/types/database.types.ts"
  }
}
```

---

## 🔧 Current Status

### Working Components
- ✅ Resend API integration
- ✅ Email delivery infrastructure
- ✅ Domain verification
- ✅ Supabase database connection
- ✅ Environment configuration

### Not Working
- ❌ Supabase SMTP integration
- ❌ Auth emails (password reset, magic links, confirmations)

### Next Action Required
**Check Supabase Auth Logs** or **Contact Supabase Support**

The detailed error in the Auth logs will reveal the exact SMTP failure reason.

---

## 📞 Support Links

### Supabase
- Dashboard: https://supabase.com/dashboard/project/whixskigyxeligukorrm
- Auth Settings: https://supabase.com/dashboard/project/whixskigyxeligukorrm/settings/auth
- Auth Logs: https://supabase.com/dashboard/project/whixskigyxeligukorrm/logs/auth-logs
- Support: https://supabase.com/dashboard/support
- Documentation: https://supabase.com/docs/guides/auth/auth-smtp

### Resend
- Dashboard: https://resend.com
- Emails: https://resend.com/emails
- Domains: https://resend.com/domains
- API Keys: https://resend.com/api-keys
- Documentation: https://resend.com/docs
- Supabase Guide: https://resend.com/docs/send-with-supabase-smtp

---

**Last Updated:** 2025-10-30
**Status:** Awaiting Auth log review or Supabase support response
