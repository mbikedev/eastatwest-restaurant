# reCAPTCHA and Floating Button Overlap Issue - Analysis Report

## Overview
This document identifies the overlapping issue between Google reCAPTCHA v3 badge and the floating scroll-to-top button in the East @ West restaurant website.

---

## 1. FLOATING BUTTON CONFIGURATION

### File: `src/components/ScrollToTopButton.jsx`

**Issue**: The ScrollToTopButton uses `z-index: 50` and is positioned in the **bottom-right corner**.

```jsx
<button
  onClick={scrollToTop}
  aria-label="Scroll to top"
  className={`fixed z-50 bottom-2 right-1 md:bottom-6 md:right-8 p-3 rounded-full transition-all duration-200
    ${visible ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-90'}
    hover:shadow-2xl hover:scale-110 focus:outline-none`}
  style={{
    backgroundColor: theme === 'dark' ? '#16A34A' : '#22C55E',
    color: '#FFFFFF',
    border: '2px solid',
    borderColor: theme === 'dark' ? '#15803D' : '#16A34A',
    boxShadow: '0 4px 24px rgba(0,0,0,0.15)'
  }}
>
  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" 
       strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M5 15l7-7 7 7" />
  </svg>
</button>
```

**Positioning:**
- `fixed` - Fixed positioning
- `z-50` - High z-index (from Tailwind)
- `bottom-2` / `md:bottom-6` - Bottom spacing: 0.5rem on mobile, 1.5rem on desktop
- `right-1` / `md:right-8` - Right spacing: 0.25rem on mobile, 2rem on desktop
- **Color**: Green (#22C55E light mode, #16A34A dark mode)
- **Size**: Small circular button with SVG icon

---

## 2. reCAPTCHA CONFIGURATION

### File: `src/app/blog/[slug]/page.tsx` (lines 325-331)

**reCAPTCHA v3 Script Loading**:
```jsx
{/* Google reCAPTCHA v3 Script */}
{process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
  <Script
    src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
    strategy="lazyOnload"
  />
)}
```

### File: `src/components/CommentSection.jsx` (lines 118-141)

**reCAPTCHA Usage**:
```jsx
if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && typeof window !== 'undefined' && window.grecaptcha) {
  try {
    const token = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'submit_comment' })
    
    // Verify token with server
    const verifyResponse = await fetch('/api/verify-recaptcha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
    // ...
  }
}
```

**reCAPTCHA Badge Behavior**:
- Google automatically injects the reCAPTCHA badge with "Protected by reCAPTCHA" text
- Includes Privacy and Terms links
- **Default Position**: Bottom-right corner of the viewport
- **Default z-index**: Google's reCAPTCHA badge has `z-index: 2147483647` (highest possible integer)

### File: `src/types/recaptcha.d.ts`

Type definitions for reCAPTCHA:
```typescript
interface Window {
  grecaptcha: {
    execute: (siteKey: string, options: { action: string }) => Promise<string>
    ready: (callback: () => void) => void
  }
}
```

---

## 3. THE OVERLAP PROBLEM

### Root Cause

1. **ScrollToTopButton Position**: `fixed`, `bottom: 0.5-1.5rem`, `right: 0.25-2rem`, `z-index: 50`
2. **reCAPTCHA Badge Position**: Automatically positioned at bottom-right corner with `z-index: 2147483647`

The reCAPTCHA badge will always appear on top (due to its astronomical z-index), but the ScrollToTopButton occupies the same space, causing visual overlap.

### When It Occurs

- Visible on all pages where reCAPTCHA is loaded (primarily blog pages)
- Affects all users (desktop and mobile)
- The green button and reCAPTCHA badge both fight for the same bottom-right corner real estate

### Visual Impact

- **reCAPTCHA Badge** (on top due to z-index: 2147483647): Shows "Protected by reCAPTCHA" with Privacy-Terms links
- **ScrollToTopButton** (underneath): Green circular button with up arrow, partially obscured
- **User Experience**: Confusing visual overlap, potential difficulty clicking the scroll button

---

## 4. CSS Z-INDEX HIERARCHY

### Critical CSS File: `src/styles/critical.css`

```css
/* Critical layout utilities */
.z-10 { z-index: 10; }
.z-20 { z-index: 20; }
.z-50 { z-index: 50; }
```

### Navigation Header (highest in app): `z-index: 50`
```css
.nav-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  backdrop-filter: blur(12px);
  background: rgba(92, 67, 0, 0.9);
}
```

### Current z-index Stack:
- **reCAPTCHA Badge**: 2147483647 (Google's iframe)
- **ScrollToTopButton**: 50 (Tailwind z-50)
- **Navigation Header**: 50 (Tailwind z-50)
- **Content layers**: 10, 20

---

## 5. ENVIRONMENT CONFIGURATION

### Environment Variables Used

```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY  - Used in blog page and comment section
RECAPTCHA_SECRET_KEY             - Used in verify-recaptcha API route
```

### API Endpoint

**File**: `src/app/api/verify-recaptcha/route.ts`

Verifies reCAPTCHA tokens on the server (lines 1-55):
- Accepts score threshold of 0.5+
- Returns success/failure with score

---

## 6. AFFECTED FILES SUMMARY

| File | Purpose | z-index | Position | Issue |
|------|---------|---------|----------|-------|
| `src/components/ScrollToTopButton.jsx` | Floating scroll button | 50 | Fixed bottom-right | Overlaps with reCAPTCHA |
| `src/app/blog/[slug]/page.tsx` | Blog page with reCAPTCHA script | - | Loads reCAPTCHA v3 | Creates badge at bottom-right |
| `src/components/CommentSection.jsx` | Comment form with reCAPTCHA | - | Uses grecaptcha API | Triggers badge display |
| `src/styles/critical.css` | Critical CSS | 50 | Nav header | z-50 defined here |
| `src/app/globals.css` | Global styles | - | Imports Tailwind | Tailwind z-utilities |
| `src/app/api/verify-recaptcha/route.ts` | Server verification | - | API | Validates tokens |
| `src/types/recaptcha.d.ts` | TypeScript types | - | Type defs | Window.grecaptcha interface |

---

## 7. SOLUTIONS

### Option A: Move ScrollToTopButton to Different Corner
Reposition the button to **bottom-left** or use a different location.

### Option B: Add Bottom Margin/Padding
Add margin to ScrollToTopButton to account for reCAPTCHA badge height (~75px).

### Option C: Hide ScrollToTopButton on reCAPTCHA Pages
Only show the scroll button on pages where reCAPTCHA is not loaded.

### Option D: Containerize reCAPTCHA Badge Position
Modify reCAPTCHA loading to position badge in a specific container rather than viewport.

### Option E: Dynamic Positioning
Use JavaScript to detect reCAPTCHA badge presence and adjust button position dynamically.

---

## 8. RECOMMENDED QUICK FIX

**Modify `src/components/ScrollToTopButton.jsx`:**

Add additional bottom margin to account for reCAPTCHA badge:

```jsx
className={`fixed z-50 bottom-20 right-1 md:bottom-24 md:right-8 ...`}
```

This provides:
- `bottom-20` (5rem / 80px) on mobile
- `md:bottom-24` (6rem / 96px) on desktop
- Enough space for reCAPTCHA badge (typically ~75px height)
- Clear separation and no overlap

---

## Files to Modify

1. **Primary Fix**: `src/components/ScrollToTopButton.jsx`
   - Adjust bottom positioning values
   - Add media queries for different screen sizes

2. **Optional Enhancements**:
   - `src/components/ClientProviders.tsx` - Could add conditional rendering
   - Add comment about reCAPTCHA positioning considerations

---

## Testing Recommendations

1. Test on pages WITH reCAPTCHA (blog pages)
2. Test on pages WITHOUT reCAPTCHA (home, menu, etc.)
3. Test on mobile (bottom margin more critical)
4. Test on desktop with various zoom levels
5. Test in both light and dark themes
6. Verify button still clicks when near badge

---

Generated: 2025-11-05
