# Priority Improvements for East @ West
## SEO Rankings & Customer Engagement

**Audit Date:** November 5, 2025
**Current SEO Score:** 7.5/10
**Potential Score (with improvements):** 9.5/10

---

## 🔴 CRITICAL - Implement This Week (Highest ROI)

### 1. Add hreflang Tags for Multilingual SEO ⚠️ URGENT
**Issue:** Your site supports EN/FR/NL but has NO hreflang tags
**Impact:** Google doesn't know which language version to show users
**File to Fix:** `/src/app/layout.tsx`
**Time:** 2 hours
**Expected Impact:** +30-50% multilingual search visibility

**How to Fix:**
```typescript
// In /src/app/layout.tsx metadata
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://eastatwest.com',
    languages: {
      'en': 'https://eastatwest.com/en',
      'fr': 'https://eastatwest.com/fr',
      'nl': 'https://eastatwest.com/nl',
      'x-default': 'https://eastatwest.com',
    }
  }
}
```

### 2. Set Up Google Business Profile 🔴 CRITICAL
**Issue:** NOT FOUND on Google Business Profile (or not optimized)
**Impact:** Missing 50-70% of local restaurant discovery
**Time:** 3-4 hours initial setup
**Expected Impact:** Can 10x local visibility within 90 days

**Action Steps:**
1. Go to business.google.com
2. Claim/verify "East @ West" listing
3. Complete 100% of profile:
   - Business hours
   - Full menu upload
   - 20+ high-quality photos
   - Services (dine-in, takeaway, catering, halal, vegetarian)
   - Enable messaging
   - Add booking link
4. Start collecting reviews (target: 50 reviews in 3 months)

**Why This Matters:**
- 46% of all Google searches are local
- Restaurants with complete profiles get 2x more visits
- 88% of consumers trust online reviews

### 3. Fix Dynamic Language Attribute
**Issue:** HTML lang attribute is hardcoded to "en"
**Current:** `<html lang="en">`
**Should be:** Dynamic based on user's selected language
**File:** `/src/app/layout.tsx` line 160
**Time:** 30 minutes
**Impact:** Accessibility and SEO compliance

### 4. Publish Your First 3 Blog Posts 🎯
**Issue:** Blog system is FULLY BUILT but has ZERO published posts
**Impact:** Massive missed opportunity for organic traffic
**Time:** 12-15 hours total (4-5 hours per post)
**Expected Impact:** 500-1,500 monthly organic visits within 6 months

**Suggested First 3 Posts:**
1. **"15 Traditional Lebanese Dishes You Must Try"**
   - Target keyword: "Lebanese dishes"
   - Expected traffic: 200-400/month

2. **"Best Lebanese Restaurant in Brussels: Complete 2025 Guide"**
   - Target keyword: "Lebanese restaurant Brussels"
   - Expected traffic: 300-600/month

3. **"What Makes Authentic Lebanese Cuisine Special"**
   - Target keyword: "authentic Lebanese cuisine"
   - Expected traffic: 100-200/month

**Template:** Use `/BLOG_POST_TEMPLATE.md`

---

## 🟠 HIGH PRIORITY - Next 2-4 Weeks

### 5. Add Article Schema to Blog Posts
**File:** `/src/app/blog/[slug]/page.tsx`
**Time:** 2-3 hours
**Impact:** Rich results in Google, better CTR

**Schema to Add:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Blog Post Title",
  "author": {
    "@type": "Person",
    "name": "East @ West Team"
  },
  "datePublished": "2025-11-05",
  "dateModified": "2025-11-05",
  "image": "cover-image-url",
  "publisher": {
    "@type": "Organization",
    "name": "East @ West",
    "logo": "https://eastatwest.com/logo.png"
  }
}
```

### 6. Implement Newsletter Signup 📧
**Issue:** NO email capture anywhere on site
**Impact:** Missing customer retention channel
**Time:** 4-6 hours
**Expected:** 15-25% of visitors sign up

**Where to Add:**
- Footer (permanent)
- Homepage (above fold)
- Blog sidebar
- Exit intent popup

**Integration Options:**
- Mailchimp (Free for <500 subscribers)
- SendinBlue (Free tier available)
- ConvertKit

**Email Strategy:**
- Welcome sequence (3 emails)
- Monthly newsletter (menu updates, events, blog posts)
- Special offers for subscribers

### 7. Create Dedicated FAQ Page
**Path:** `/faq`
**Current:** FAQ only embedded in Lebanese Brussels page
**Time:** 4-5 hours
**Impact:** Featured snippets, reduces support questions

**Content Ideas (20-30 FAQs):**
- Do you serve halal food?
- Are there vegetarian options?
- Can I make a reservation online?
- What are your opening hours?
- Do you offer catering?
- Is delivery available?
- What's on the menu?
- How much does a meal cost?
- Do you have parking?
- Are you family-friendly?

### 8. Set Up Google Analytics 4
**Current:** No GA4 found in code
**Time:** 2-3 hours
**Impact:** Data-driven decision making

**Events to Track:**
- Reservations submitted
- Menu PDF downloads
- Phone number clicks
- "Reserve Now" button clicks
- Takeaway orders completed
- Social media clicks
- Language changes

### 9. Optimize Menu Page for SEO
**File:** `/src/app/menu/layout.tsx`
**Time:** 6-8 hours
**Issues:**
- Menu only available as PDF (low SEO value)
- No HTML version
- Minimal descriptions

**Improvements:**
1. Create full HTML menu with categories
2. Add descriptions for each dish (50-100 words)
3. Include pricing
4. Add MenuItem schema for ALL dishes
5. Add dietary filters (halal, vegetarian, vegan, gluten-free)
6. Include preparation time/spice level

---

## 🟡 MEDIUM PRIORITY - Months 2-3

### 10. Create Reviews Page
**Path:** `/reviews`
**Time:** 6-8 hours
**Features:**
- Aggregate all testimonials
- Google Reviews widget integration
- Customer photo submissions
- Review submission form

### 11. List on Local Directories
**Platforms:**
- TripAdvisor
- TheFork (La Fourchette)
- Yelp
- Visit Brussels
- Resto.be

**Time:** 3-4 hours total
**Impact:** NAP consistency, local backlinks, visibility

### 12. Create Special Offers Page
**Path:** `/offers` or `/promotions`
**Content:**
- Weekly specials
- Seasonal menu
- Group booking discounts
- Birthday/anniversary offers

### 13. Publish 5-7 More Blog Posts
**Cadence:** 2 posts per month
**Topics:**
- "Halal Dining in Brussels: Your Complete Guide"
- "Mediterranean Diet Benefits: Lebanese Edition"
- "How to Order at a Lebanese Restaurant"
- "Lebanese vs Mediterranean Cuisine: Differences"
- "Best Vegetarian Lebanese Dishes"
- "Lebanese Catering for Events in Brussels"
- "Wine Pairing Guide for Lebanese Food"

### 14. Enhance Photo Gallery
**Improvements:**
- Add captions with keywords
- Include restaurant interior photos
- Add team/chef photos
- Implement ImageObject schema
- Add "Behind the Scenes" category

---

## 🟢 NICE TO HAVE - Month 3+

### 15. Add Live Chat
**Options:** Intercom, Drift, Tawk.to (free)
**Impact:** Customer service, conversion boost

### 16. Create Chef Profile Page
**Path:** `/team/chef-hanna`
**Content:** Full bio, awards, philosophy, signature dishes

### 17. Implement Loyalty Program
**Features:** Points per visit, birthday rewards, referral bonuses

### 18. Start YouTube Channel
**Content:** Restaurant tours, cooking demos, chef interviews

### 19. Add WhatsApp Business
**Impact:** Easier customer communication, especially for international visitors

### 20. Create Virtual Tour
**Tool:** Google Street View trusted photographer
**Impact:** Show restaurant before visit

---

## 📊 Expected Impact Timeline

### Week 1 (Critical Fixes)
- Fix hreflang tags → +30% multilingual visibility
- Set up Google Business Profile → Start appearing in local searches
- Fix lang attribute → SEO compliance

### Month 1
- 3 blog posts published → 200-500 visitors/month
- Newsletter setup → Start building email list
- GA4 tracking → Data collection begins
- FAQ page → Featured snippet opportunities

### Month 3
- 12 blog posts → 1,000-2,000 visitors/month
- 50 Google reviews → Higher local rankings
- 200+ newsletter subscribers → Retention channel established
- Listed on 5+ directories → Increased backlinks

### Month 6
- 24 blog posts → 2,000-4,000 visitors/month
- 100+ Google reviews → Top 3 local rankings
- 600+ newsletter subscribers
- Consistent content schedule → Authority building

### Month 12
- 48 blog posts → 4,000-8,000 visitors/month
- 200+ reviews → #1 local ranking for "Lebanese Restaurant Brussels"
- 1,500+ newsletter subscribers
- 10x organic traffic vs. current

---

## 💰 Investment Required

### Time Investment
- **Week 1 (Critical):** 8-10 hours
- **Month 1:** 30-40 hours
- **Ongoing:** 15-20 hours/month for content

### Potential Costs
- **Professional photography:** €500-1,000 (one-time)
- **Blog content writer:** €200-400/post OR in-house
- **SEO tools (optional):** €100-300/month
- **Email marketing:** €0-50/month (free tier available)

### Expected ROI
- **Break-even:** 2-3 months
- **5x ROI:** 6-9 months
- **10x ROI:** 12-18 months

---

## 🎯 Quick Wins (Do These First!)

1. **hreflang tags** → 2 hours → Massive multilingual SEO boost
2. **Google Business Profile** → 3 hours → 10x local visibility
3. **First blog post** → 4 hours → Start organic traffic
4. **Newsletter signup** → 4 hours → Retention channel
5. **Fix lang attribute** → 30 min → SEO compliance

**Total Time for Quick Wins:** ~14 hours
**Expected Impact:** 50-100% increase in visibility within 60 days

---

## 📋 Implementation Checklist

### Week 1
- [ ] Add hreflang tags to layout.tsx
- [ ] Set up Google Business Profile
- [ ] Fix dynamic lang attribute
- [ ] Upload 20+ photos to Google Business
- [ ] Start requesting customer reviews

### Week 2
- [ ] Publish first blog post
- [ ] Set up GA4 tracking
- [ ] Add newsletter signup form
- [ ] Create FAQ page

### Week 3-4
- [ ] Publish 2nd and 3rd blog posts
- [ ] Add Article schema to blog template
- [ ] List on TripAdvisor and TheFork
- [ ] Optimize menu page

### Month 2
- [ ] Publish 4 more blog posts (2/week)
- [ ] Create reviews page
- [ ] Create offers/promotions page
- [ ] Enhance photo gallery
- [ ] Get listed on 5+ local directories

### Month 3
- [ ] Publish 4 more blog posts
- [ ] Reach 50 Google reviews
- [ ] Build email list to 200+ subscribers
- [ ] Analyze GA4 data and optimize

---

## 🔍 Tracking Success

### Key Metrics to Monitor

**Weekly:**
- Google Business Profile views/clicks
- Online reservations
- Website traffic (GA4)
- Newsletter signups

**Monthly:**
- Organic search traffic
- Keyword rankings
- Number of reviews
- Email list growth
- Blog post performance

**Tools Needed:**
1. Google Search Console (free)
2. Google Analytics 4 (free)
3. Google Business Profile Insights (free)
4. Ahrefs or SEMrush (optional, €99-299/month)

---

## 🏆 Success Criteria

### 3 Months
- ✅ 50+ Google reviews (4.5+ stars)
- ✅ Top 5 ranking for "Lebanese restaurant Brussels"
- ✅ 1,000+ monthly organic visitors
- ✅ 200+ email subscribers
- ✅ 12 blog posts published

### 6 Months
- ✅ 100+ Google reviews
- ✅ Top 3 ranking for primary keywords
- ✅ 3,000+ monthly organic visitors
- ✅ 600+ email subscribers
- ✅ 24 blog posts published

### 12 Months
- ✅ 200+ Google reviews
- ✅ #1 ranking for "Lebanese restaurant Brussels"
- ✅ 6,000+ monthly organic visitors
- ✅ 1,500+ email subscribers
- ✅ 48 blog posts published
- ✅ 50% increase in online reservations

---

## 📞 Need Help?

**Files to Review:**
- This document: `/PRIORITY_IMPROVEMENTS.md`
- Blog template: `/BLOG_POST_TEMPLATE.md`
- Translation TODO: `/BLOG_TRANSLATIONS_TODO.md`
- SEO analysis: `/SEO_ANALYSIS_COMPREHENSIVE.md`
- Indexing status: `/GOOGLE_INDEXING_STATUS.md`

**Scripts Available:**
- `/scripts/check-published-blogs.ts` - Check blog status
- `/scripts/check-blog-images.ts` - Verify images
- `/scripts/check-translation-coverage.ts` - Translation gaps

---

**Remember:** The biggest opportunities are:
1. 🔴 Google Business Profile (50-100% visibility boost)
2. 🔴 hreflang tags (fix multilingual SEO)
3. 🎯 Blog content (organic traffic goldmine)
4. 📧 Newsletter (customer retention)

Start with the Quick Wins checklist above and you'll see results within 30-60 days!
