# Blog Translations TODO

## Status: Partially Complete

**Last Updated:** November 5, 2025

## Summary

Out of 54 published blog posts, most are fully translated across EN/FR/NL. However, several important recent posts added in November 2025 are only available in English and need French and Dutch translations.

## ✅ Completed Translations

### French Mezze Guide
- ✅ **Guide des Mezzés Libanais Traditionnels : 20 Entrées Incontournables** (FR)
  - Slug: `guide-mezzes-libanais-traditionnels-entrees-incontournables-fr`
  - Status: Published
  - Created: November 5, 2025

## ❌ Missing Translations

### 1. Complete Guide to Lebanese Cuisine
**English Post:**
- Title: "Complete Guide to Lebanese Cuisine: Traditional Dishes, Flavors & Culture"
- Slug: `complete-guide-lebanese-cuisine-traditional-dishes`
- Status: Published (EN only)
- Word Count: ~15,000 characters

**Needs:**
- ❌ French translation
- ❌ Dutch translation

**Suggested French Title:** "Guide Complet de la Cuisine Libanaise : Plats Traditionnels, Saveurs et Culture"
**Suggested Dutch Title:** "Volledige Gids voor Libanese Keuken: Traditionele Gerechten, Smaken en Cultuur"

### 2. 15 Health Benefits of the Mediterranean Diet
**English Post:**
- Title: "15 Health Benefits of the Mediterranean Diet: Lebanese Cuisine Edition"
- Slug: `health-benefits-mediterranean-diet-lebanese-cuisine`
- Status: Published (EN only)
- Word Count: ~12,000 characters

**Needs:**
- ❌ French translation
- ❌ Dutch translation

**Suggested French Title:** "15 Bienfaits pour la Santé du Régime Méditerranéen : Édition Cuisine Libanaise"
**Suggested Dutch Title:** "15 Gezondheidsvoordelen van het Mediterrane Dieet: Libanese Keuken Editie"

### 3. Best Lebanese Restaurants in Brussels
**English Post:**
- Title: "Best Lebanese Restaurants in Brussels: Complete 2025 Guide"
- Slug: `best-lebanese-restaurants-brussels-guide-2025`
- Status: Published (EN only)
- Word Count: ~10,000 characters

**Needs:**
- ❌ French translation
- ❌ Dutch translation

**Suggested French Title:** "Meilleurs Restaurants Libanais à Bruxelles : Guide Complet 2025"
**Suggested Dutch Title:** "Beste Libanese Restaurants in Brussel: Volledige Gids 2025"

## Translation Guidelines

### Key Principles
1. **Maintain SEO Keywords** - Translate but keep search intent
2. **Local Adaptation** - Use Brussels-specific terminology
3. **Keep Structure** - Same headings and sections
4. **Image Reuse** - Same cover images across languages
5. **Tags Translation** - Translate all tags consistently

### Tag Translations Reference

| English | French | Dutch |
|---------|--------|-------|
| Lebanese Cuisine | Cuisine Libanaise | Libanese Keuken |
| Mediterranean Diet | Régime Méditerranéen | Mediterraan Dieet |
| Brussels Dining | Restaurant Bruxelles | Brussel Restaurant |
| Halal Food | Nourriture Halal | Halal Eten |
| Vegetarian | Végétarien | Vegetarisch |
| Food Guide | Guide Gastronomique | Eten Gids |
| Health Benefits | Bienfaits pour la Santé | Gezondheidsvoordelen |
| Traditional Food | Cuisine Traditionnelle | Traditioneel Eten |

### Meta Data Guidelines

**Meta Title:** Max 60 characters
- EN: "Topic | East at West Brussels"
- FR: "Sujet | East at West Bruxelles"
- NL: "Onderwerp | East at West Brussel"

**Meta Description:** Max 160 characters
- Focus on main keywords
- Include location (Brussels/Bruxelles/Brussel)
- Call-to-action when appropriate

## Implementation Steps

### Option 1: Professional Translation Service
1. Export English content from database
2. Send to professional translator
3. Review for culinary accuracy
4. Insert using scripts in `/scripts/` directory

### Option 2: AI-Assisted Translation
1. Use ChatGPT/Claude for initial translation
2. Review by native French/Dutch speaker
3. Adjust for local dialect (Belgian French/Flemish)
4. Insert and publish

### Option 3: Gradual Manual Translation
1. Prioritize by traffic/importance
2. Translate one post per week
3. Focus on highest-value content first

## Priority Order

**High Priority (SEO Impact):**
1. ✅ Mezze Guide (COMPLETED)
2. Lebanese Cuisine Guide (comprehensive, high search volume)
3. Best Lebanese Restaurants Brussels (local SEO)

**Medium Priority:**
4. Mediterranean Diet Benefits (health/wellness audience)

## Scripts Available

Located in `/scripts/`:
- `check-translation-coverage.ts` - Check what's missing
- `create-missing-translations.ts` - Insert new translations
- `check-published-blogs.ts` - Verify published status

## Verification

After translations are complete, run:
```bash
npx tsx scripts/check-translation-coverage.ts
```

Expected result: "All blog posts with multiple language versions are fully translated!"

## Notes

- All existing older blog posts (October 2025 and earlier) ARE fully translated
- Only November 2025 posts need completion
- Mezze Guide FR was completed on Nov 5, 2025
- Consider professional translation for accuracy
- Belgian French differs from France French (use Belgian terminology)
- Flemish Dutch differs from Netherlands Dutch (use Belgian Dutch)

## Contact for Translation

If using professional services, ensure translator has:
- ✓ Culinary/food terminology expertise
- ✓ Belgian French/Dutch experience
- ✓ SEO copywriting skills
- ✓ Understanding of restaurant marketing

---

**Last Checked:** November 5, 2025
**Script:** `check-translation-coverage.ts`
**Total Blog Posts:** 55 (54 previous + 1 new FR Mezze)
**Fully Translated Groups:** Most older content
**Missing Translations:** 3 major posts × 2 languages = 6 translations needed
