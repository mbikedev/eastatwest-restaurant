# Resend Email Configuration

## Current Status

### Environment Variables Required

```bash
RESEND_API_KEY=re_6urjn6gZ_MFw2mTfkg7hVAR6WjAKHx4xM
RESEND_FROM_EMAIL=onboarding@resend.dev  # Temporary - see below
```

## Temporary Configuration

**Current Sender:** `onboarding@resend.dev`
**Reason:** Domain `eastatwest.com` not yet verified in Resend
**Status:** ⏳ Pending domain verification

## To Fix Permanently

### Step 1: Verify Domain in Resend

1. Login to: https://resend.com/domains
2. Add domain: `eastatwest.com`
3. Copy DNS records provided

### Step 2: Add DNS Records in Hostinger

Add these records in Hostinger DNS Zone:

#### TXT Record (Verification):
```
Name: @
Value: resend-verification=xxxxx (copy from Resend)
```

#### CNAME Record (DKIM):
```
Name: resend._domainkey
Value: resend._domainkey.resend.com
```

#### Update SPF Record:
**Change existing TXT record from:**
```
v=spf1 include:titan.email ~all
```

**To:**
```
v=spf1 include:titan.email include:_spf.resend.com ~all
```

### Step 3: Verify in Resend

- Wait 5-15 minutes for DNS propagation
- Click "Verify" in Resend dashboard
- Status should show: ✅ Verified

### Step 4: Update Environment Variable

**Change in production:**
```bash
RESEND_FROM_EMAIL=contact@eastatwest.com
```

**Locations to update:**
- Vercel/Netlify/Hostinger environment variables
- Redeploy after changing

## Testing

### Notification Email Recipients

All reservation notifications are sent to:
1. `contact@eastatwest.com`
2. `mbagnickg@gmail.com`
3. `infos.east.west@gmail.com`

### Test Checklist

- [ ] Submit test reservation
- [ ] Check browser console for logs
- [ ] Verify all 3 recipients receive email
- [ ] Check email arrives from correct sender
- [ ] Verify email content is correct

## Current Implementation

**Code locations:**
- API Route: `src/app/api/send-notification-emails/route.ts`
- Frontend: `src/app/reservations/page.tsx` (sendNotificationEmails function)

**Logging:**
- Comprehensive console logging added for debugging
- User-facing toast warnings if emails fail
- Server-side detailed logs for each recipient

---

**Last Updated:** 2025-10-29
**Status:** Using temporary sender until domain verification complete
