import { createClient } from '@/utils/supabase/client'
import type { Blog, BlogListParams } from '@/types/blog'

const supabase = createClient()

/**
 * Get language-specific blog slugs
 */
function getLanguageSlugs(language: string): string[] {
  switch (language) {
    case 'fr':
      return [
        'meilleurs-restaurants-vegetariens-bruxelles-belgique',
        'pourquoi-les-restaurants-halal-sont-ils-si-populaires',
        'restaurant-vegetarien-bruxelles-tout-ce-que-vous-devez-savoir',
        'restaurant-mediterraneen-experience-inoubliable',
        'les-choses-a-faire-et-a-ne-pas-faire-de-letiquette-au-restaurant-de-cuisine-du-moyen-orient',
        'restaurant-mediterraneen-top-4-caracteristiques',
        'restaurants-fast-food-pres-moi-avantages',
        'restaurant-vegetarien-experience-saine-savoureuse',
        'restaurant-mediterraneen-saveurs-authentiques',
        'restaurant-moyen-orient-saveurs-authentiques-ambiance-unique',
        'restaurant-cuisine-mediterraneenne-gout-mediterranee',
        'evasion-culinaire-restaurant-libanais-bruxelles',
        'cuisine-mediterraneenne-heritage-sain-saveurs-riches',
        'trois-raisons-essayer-restaurant-mediterraneen-east-west',
        'quatre-raisons-pour-lesquelles-gens-se-soucient-restaurants-fast-food'
      ]
    case 'nl':
      return [
        'beste-vegetarische-restaurants-brussel-belgie',
        'waarom-zijn-halal-restaurants-zo-populair',
        'vegetarisch-restaurant-brussel-alles-wat-u-moet-weten',
        'mediterraans-restaurant-onvergetelijke-ervaring',
        'de-dos-en-donts-van-midden-oosterse-keuken-restaurant-etiquette',
        'mediterraans-restaurant-top-4-kenmerken',
        'fastfood-restaurants-bij-mij-voordelen',
        'vegetarisch-restaurant-gezonde-smakelijke-ervaring',
        'mediterraans-restaurant-authentieke-smaken',
        'midden-oosters-restaurant-authentieke-smaken-unieke-ambiance',
        'mediterraans-keuken-restaurant-smaak-van-middellandse-zee',
        'culinaire-ontsnapping-libanees-restaurant-brussel',
        'mediterrane-keuken-gezond-erfgoed-rijke-smaken',
        'drie-redenen-om-east-west-mediterraans-restaurant-te-proberen',
        'vier-redenen-waarom-mensen-geven-om-fast-food-restaurants'
      ]
    case 'en':
    default:
      return [
        'best-vegetarian-restaurants-brussels-belgium',
        'why-are-halal-food-restaurants-so-well-liked',
        'vegetarian-restaurant-brussels-all-you-need-to-know',
        'mediterranean-restaurant-unforgettable-experience',
        'the-dos-and-donts-of-middle-eastern-cuisine-restaurant-etiquette',
        'mediterranean-restaurant-top-4-features',
        'fast-food-restaurants-near-me-benefits',
        'vegetarian-restaurant-healthy-tasty-experience',
        'mediterranean-restaurant-authentic-flavors',
        'middle-eastern-restaurant-authentic-flavors-unique-ambiance',
        'mediterranean-cuisine-restaurant-taste-of-mediterranean',
        'culinary-escape-lebanese-restaurant-brussels',
        'mediterranean-cuisine-healthy-heritage-rich-flavors',
        'three-justifications-trying-east-west-restaurant-mediterranean',
        'four-reasons-why-people-care-about-fast-food-restaurants'
      ]
  }
}
/**
 * Detect language from blog slug
 */
export function detectLanguageFromSlug(slug: string): string {
  const lowerSlug = slug.toLowerCase()

  // Check each language
  const frSlugs = getLanguageSlugs('fr')
  if (frSlugs.includes(lowerSlug)) return 'fr'

  const nlSlugs = getLanguageSlugs('nl')
  if (nlSlugs.includes(lowerSlug)) return 'nl'

  // Default to English
  return 'en'
}

/**
 * Get slug mapping between languages for the same blog post
 */
function getSlugMappings(): Record<string, { en: string; fr: string; nl: string }> {
  return {
    // Best Vegetarian Restaurants Brussels Belgium
    'best-vegetarian-restaurants-brussels-belgium': {
      en: 'best-vegetarian-restaurants-brussels-belgium',
      fr: 'meilleurs-restaurants-vegetariens-bruxelles-belgique',
      nl: 'beste-vegetarische-restaurants-brussel-belgie'
    },
    'meilleurs-restaurants-vegetariens-bruxelles-belgique': {
      en: 'best-vegetarian-restaurants-brussels-belgium',
      fr: 'meilleurs-restaurants-vegetariens-bruxelles-belgique',
      nl: 'beste-vegetarische-restaurants-brussel-belgie'
    },
    'beste-vegetarische-restaurants-brussel-belgie': {
      en: 'best-vegetarian-restaurants-brussels-belgium',
      fr: 'meilleurs-restaurants-vegetariens-bruxelles-belgique',
      nl: 'beste-vegetarische-restaurants-brussel-belgie'
    },

    // Why Are Halal Food Restaurants So Well-liked?
    'why-are-halal-food-restaurants-so-well-liked': {
      en: 'why-are-halal-food-restaurants-so-well-liked',
      fr: 'pourquoi-les-restaurants-halal-sont-ils-si-populaires',
      nl: 'waarom-zijn-halal-restaurants-zo-populair'
    },
    'pourquoi-les-restaurants-halal-sont-ils-si-populaires': {
      en: 'why-are-halal-food-restaurants-so-well-liked',
      fr: 'pourquoi-les-restaurants-halal-sont-ils-si-populaires',
      nl: 'waarom-zijn-halal-restaurants-zo-populair'
    },
    'waarom-zijn-halal-restaurants-zo-populair': {
      en: 'why-are-halal-food-restaurants-so-well-liked',
      fr: 'pourquoi-les-restaurants-halal-sont-ils-si-populaires',
      nl: 'waarom-zijn-halal-restaurants-zo-populair'
    },

    // Vegetarian Restaurant Brussels - All You Need to Know
    'vegetarian-restaurant-brussels-all-you-need-to-know': {
      en: 'vegetarian-restaurant-brussels-all-you-need-to-know',
      fr: 'restaurant-vegetarien-bruxelles-tout-ce-que-vous-devez-savoir',
      nl: 'vegetarisch-restaurant-brussel-alles-wat-u-moet-weten'
    },
    'restaurant-vegetarien-bruxelles-tout-ce-que-vous-devez-savoir': {
      en: 'vegetarian-restaurant-brussels-all-you-need-to-know',
      fr: 'restaurant-vegetarien-bruxelles-tout-ce-que-vous-devez-savoir',
      nl: 'vegetarisch-restaurant-brussel-alles-wat-u-moet-weten'
    },
    'vegetarisch-restaurant-brussel-alles-wat-u-moet-weten': {
      en: 'vegetarian-restaurant-brussels-all-you-need-to-know',
      fr: 'restaurant-vegetarien-bruxelles-tout-ce-que-vous-devez-savoir',
      nl: 'vegetarisch-restaurant-brussel-alles-wat-u-moet-weten'
    },

    // Mediterranean Restaurant Unforgettable Experience
    'mediterranean-restaurant-unforgettable-experience': {
      en: 'mediterranean-restaurant-unforgettable-experience',
      fr: 'restaurant-mediterraneen-experience-inoubliable',
      nl: 'mediterraans-restaurant-onvergetelijke-ervaring'
    },
    'restaurant-mediterraneen-experience-inoubliable': {
      en: 'mediterranean-restaurant-unforgettable-experience',
      fr: 'restaurant-mediterraneen-experience-inoubliable',
      nl: 'mediterraans-restaurant-onvergetelijke-ervaring'
    },
    'mediterraans-restaurant-onvergetelijke-ervaring': {
      en: 'mediterranean-restaurant-unforgettable-experience',
      fr: 'restaurant-mediterraneen-experience-inoubliable',
      nl: 'mediterraans-restaurant-onvergetelijke-ervaring'
    },

    // The Dos And Don'ts Of Middle Eastern Cuisine Restaurant Etiquette
    'the-dos-and-donts-of-middle-eastern-cuisine-restaurant-etiquette': {
      en: 'the-dos-and-donts-of-middle-eastern-cuisine-restaurant-etiquette',
      fr: 'les-choses-a-faire-et-a-ne-pas-faire-de-letiquette-au-restaurant-de-cuisine-du-moyen-orient',
      nl: 'de-dos-en-donts-van-midden-oosterse-keuken-restaurant-etiquette'
    },
    'les-choses-a-faire-et-a-ne-pas-faire-de-letiquette-au-restaurant-de-cuisine-du-moyen-orient': {
      en: 'the-dos-and-donts-of-middle-eastern-cuisine-restaurant-etiquette',
      fr: 'les-choses-a-faire-et-a-ne-pas-faire-de-letiquette-au-restaurant-de-cuisine-du-moyen-orient',
      nl: 'de-dos-en-donts-van-midden-oosterse-keuken-restaurant-etiquette'
    },
    'de-dos-en-donts-van-midden-oosterse-keuken-restaurant-etiquette': {
      en: 'the-dos-and-donts-of-middle-eastern-cuisine-restaurant-etiquette',
      fr: 'les-choses-a-faire-et-a-ne-pas-faire-de-letiquette-au-restaurant-de-cuisine-du-moyen-orient',
      nl: 'de-dos-en-donts-van-midden-oosterse-keuken-restaurant-etiquette'
    },

    // Mediterranean Restaurant: Top 4 Features
    'mediterranean-restaurant-top-4-features': {
      en: 'mediterranean-restaurant-top-4-features',
      fr: 'restaurant-mediterraneen-top-4-caracteristiques',
      nl: 'mediterraans-restaurant-top-4-kenmerken'
    },
    'restaurant-mediterraneen-top-4-caracteristiques': {
      en: 'mediterranean-restaurant-top-4-features',
      fr: 'restaurant-mediterraneen-top-4-caracteristiques',
      nl: 'mediterraans-restaurant-top-4-kenmerken'
    },
    'mediterraans-restaurant-top-4-kenmerken': {
      en: 'mediterranean-restaurant-top-4-features',
      fr: 'restaurant-mediterraneen-top-4-caracteristiques',
      nl: 'mediterraans-restaurant-top-4-kenmerken'
    },

    // Fast Food Restaurants Near Me: Benefits
    'fast-food-restaurants-near-me-benefits': {
      en: 'fast-food-restaurants-near-me-benefits',
      fr: 'restaurants-fast-food-pres-moi-avantages',
      nl: 'fastfood-restaurants-bij-mij-voordelen'
    },
    'restaurants-fast-food-pres-moi-avantages': {
      en: 'fast-food-restaurants-near-me-benefits',
      fr: 'restaurants-fast-food-pres-moi-avantages',
      nl: 'fastfood-restaurants-bij-mij-voordelen'
    },
    'fastfood-restaurants-bij-mij-voordelen': {
      en: 'fast-food-restaurants-near-me-benefits',
      fr: 'restaurants-fast-food-pres-moi-avantages',
      nl: 'fastfood-restaurants-bij-mij-voordelen'
    },

    // Vegetarian Restaurant: Healthy and Tasty Experience
    'vegetarian-restaurant-healthy-tasty-experience': {
      en: 'vegetarian-restaurant-healthy-tasty-experience',
      fr: 'restaurant-vegetarien-experience-saine-savoureuse',
      nl: 'vegetarisch-restaurant-gezonde-smakelijke-ervaring'
    },
    'restaurant-vegetarien-experience-saine-savoureuse': {
      en: 'vegetarian-restaurant-healthy-tasty-experience',
      fr: 'restaurant-vegetarien-experience-saine-savoureuse',
      nl: 'vegetarisch-restaurant-gezonde-smakelijke-ervaring'
    },
    'vegetarisch-restaurant-gezonde-smakelijke-ervaring': {
      en: 'vegetarian-restaurant-healthy-tasty-experience',
      fr: 'restaurant-vegetarien-experience-saine-savoureuse',
      nl: 'vegetarisch-restaurant-gezonde-smakelijke-ervaring'
    },

    // Mediterranean Restaurant: Authentic Flavors
    'mediterranean-restaurant-authentic-flavors': {
      en: 'mediterranean-restaurant-authentic-flavors',
      fr: 'restaurant-mediterraneen-saveurs-authentiques',
      nl: 'mediterraans-restaurant-authentieke-smaken'
    },
    'restaurant-mediterraneen-saveurs-authentiques': {
      en: 'mediterranean-restaurant-authentic-flavors',
      fr: 'restaurant-mediterraneen-saveurs-authentiques',
      nl: 'mediterraans-restaurant-authentieke-smaken'
    },
    'mediterraans-restaurant-authentieke-smaken': {
      en: 'mediterranean-restaurant-authentic-flavors',
      fr: 'restaurant-mediterraneen-saveurs-authentiques',
      nl: 'mediterraans-restaurant-authentieke-smaken'
    },

    // Middle Eastern Restaurant: Authentic Flavors in a Unique Ambiance
    'middle-eastern-restaurant-authentic-flavors-unique-ambiance': {
      en: 'middle-eastern-restaurant-authentic-flavors-unique-ambiance',
      fr: 'restaurant-moyen-orient-saveurs-authentiques-ambiance-unique',
      nl: 'midden-oosters-restaurant-authentieke-smaken-unieke-ambiance'
    },
    'restaurant-moyen-orient-saveurs-authentiques-ambiance-unique': {
      en: 'middle-eastern-restaurant-authentic-flavors-unique-ambiance',
      fr: 'restaurant-moyen-orient-saveurs-authentiques-ambiance-unique',
      nl: 'midden-oosters-restaurant-authentieke-smaken-unieke-ambiance'
    },
    'midden-oosters-restaurant-authentieke-smaken-unieke-ambiance': {
      en: 'middle-eastern-restaurant-authentic-flavors-unique-ambiance',
      fr: 'restaurant-moyen-orient-saveurs-authentiques-ambiance-unique',
      nl: 'midden-oosters-restaurant-authentieke-smaken-unieke-ambiance'
    },

    // Mediterranean Cuisine Restaurant: A Taste of the Mediterranean
    'mediterranean-cuisine-restaurant-taste-of-mediterranean': {
      en: 'mediterranean-cuisine-restaurant-taste-of-mediterranean',
      fr: 'restaurant-cuisine-mediterraneenne-gout-mediterranee',
      nl: 'mediterraans-keuken-restaurant-smaak-van-middellandse-zee'
    },
    'restaurant-cuisine-mediterraneenne-gout-mediterranee': {
      en: 'mediterranean-cuisine-restaurant-taste-of-mediterranean',
      fr: 'restaurant-cuisine-mediterraneenne-gout-mediterranee',
      nl: 'mediterraans-keuken-restaurant-smaak-van-middellandse-zee'
    },
    'mediterraans-keuken-restaurant-smaak-van-middellandse-zee': {
      en: 'mediterranean-cuisine-restaurant-taste-of-mediterranean',
      fr: 'restaurant-cuisine-mediterraneenne-gout-mediterranee',
      nl: 'mediterraans-keuken-restaurant-smaak-van-middellandse-zee'
    },

    // Culinary Escape: Lebanese Restaurant in Brussels
    'culinary-escape-lebanese-restaurant-brussels': {
      en: 'culinary-escape-lebanese-restaurant-brussels',
      fr: 'evasion-culinaire-restaurant-libanais-bruxelles',
      nl: 'culinaire-ontsnapping-libanees-restaurant-brussel'
    },
    'evasion-culinaire-restaurant-libanais-bruxelles': {
      en: 'culinary-escape-lebanese-restaurant-brussels',
      fr: 'evasion-culinaire-restaurant-libanais-bruxelles',
      nl: 'culinaire-ontsnapping-libanees-restaurant-brussel'
    },
    'culinaire-ontsnapping-libanees-restaurant-brussel': {
      en: 'culinary-escape-lebanese-restaurant-brussels',
      fr: 'evasion-culinaire-restaurant-libanais-bruxelles',
      nl: 'culinaire-ontsnapping-libanees-restaurant-brussel'
    },

    // Mediterranean Cuisine: Healthy Heritage and Rich Flavors
    'mediterranean-cuisine-healthy-heritage-rich-flavors': {
      en: 'mediterranean-cuisine-healthy-heritage-rich-flavors',
      fr: 'cuisine-mediterraneenne-heritage-sain-saveurs-riches',
      nl: 'mediterrane-keuken-gezond-erfgoed-rijke-smaken'
    },
    'cuisine-mediterraneenne-heritage-sain-saveurs-riches': {
      en: 'mediterranean-cuisine-healthy-heritage-rich-flavors',
      fr: 'cuisine-mediterraneenne-heritage-sain-saveurs-riches',
      nl: 'mediterrane-keuken-gezond-erfgoed-rijke-smaken'
    },
    'mediterrane-keuken-gezond-erfgoed-rijke-smaken': {
      en: 'mediterranean-cuisine-healthy-heritage-rich-flavors',
      fr: 'cuisine-mediterraneenne-heritage-sain-saveurs-riches',
      nl: 'mediterrane-keuken-gezond-erfgoed-rijke-smaken'
    },

    // 3 Justifications For Trying East At West Restaurant Mediterranean
    'three-justifications-trying-east-west-restaurant-mediterranean': {
      en: 'three-justifications-trying-east-west-restaurant-mediterranean',
      fr: 'trois-raisons-essayer-restaurant-mediterraneen-east-west',
      nl: 'drie-redenen-om-east-west-mediterraans-restaurant-te-proberen'
    },
    'trois-raisons-essayer-restaurant-mediterraneen-east-west': {
      en: 'three-justifications-trying-east-west-restaurant-mediterranean',
      fr: 'trois-raisons-essayer-restaurant-mediterraneen-east-west',
      nl: 'drie-redenen-om-east-west-mediterraans-restaurant-te-proberen'
    },
    'drie-redenen-om-east-west-mediterraans-restaurant-te-proberen': {
      en: 'three-justifications-trying-east-west-restaurant-mediterranean',
      fr: 'trois-raisons-essayer-restaurant-mediterraneen-east-west',
      nl: 'drie-redenen-om-east-west-mediterraans-restaurant-te-proberen'
    },

    // 4 Reasons Why People Care About Fast Food Restaurants
    'four-reasons-why-people-care-about-fast-food-restaurants': {
      en: 'four-reasons-why-people-care-about-fast-food-restaurants',
      fr: 'quatre-raisons-pour-lesquelles-gens-se-soucient-restaurants-fast-food',
      nl: 'vier-redenen-waarom-mensen-geven-om-fast-food-restaurants'
    },
    'quatre-raisons-pour-lesquelles-gens-se-soucient-restaurants-fast-food': {
      en: 'four-reasons-why-people-care-about-fast-food-restaurants',
      fr: 'quatre-raisons-pour-lesquelles-gens-se-soucient-restaurants-fast-food',
      nl: 'vier-redenen-waarom-mensen-geven-om-fast-food-restaurants'
    },
    'vier-redenen-waarom-mensen-geven-om-fast-food-restaurants': {
      en: 'four-reasons-why-people-care-about-fast-food-restaurants',
      fr: 'quatre-raisons-pour-lesquelles-gens-se-soucient-restaurants-fast-food',
      nl: 'vier-redenen-waarom-mensen-geven-om-fast-food-restaurants'
    }
  }
}

/**
 * Get the slug for a blog post in a different language
 */
export function getSlugForLanguage(currentSlug: string, targetLanguage: string): string {
  const mappings = getSlugMappings()
  const mapping = mappings[currentSlug.toLowerCase()]

  if (!mapping) {
    console.warn(`No language mapping found for slug: ${currentSlug}`)
    return currentSlug
  }

  return mapping[targetLanguage as 'en' | 'fr' | 'nl'] || currentSlug
}

/**
 * Fetch all published blog posts filtered by language
 */
export async function getBlogPosts(params: BlogListParams = {}, language: string = 'en') {
  const {
    limit = 100,
    offset = 0,
    featured,
    tags,
    search
  } = params

  // Get all published posts first
  let query = supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })

  // Filter by featured status
  if (featured !== undefined) {
    query = query.eq('featured', featured)
  }

  // Filter by tags
  if (tags && tags.length > 0) {
    query = query.overlaps('tags', tags)
  }

  // Search in title and excerpt
  if (search) {
    query = query.or(`title.ilike.%${search}%, excerpt.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching blog posts:', error)
    throw new Error(`Failed to fetch blog posts: ${error.message}`)
  }

  // Filter by language based on exact slug matching
  const languageSlugs = getLanguageSlugs(language)
  console.log('🔍 Language:', language)
  console.log('🔍 Expected slugs:', languageSlugs)
  console.log('🔍 Total posts fetched:', data.length)

  const filteredData = data.filter(blog => {
    const slug = blog.slug.toLowerCase()
    const matches = languageSlugs.includes(slug)
    console.log(`🔍 Checking "${blog.title}" (${slug}):`, matches ? '✅' : '❌')
    return matches
  })

  console.log('🔍 Filtered posts:', filteredData.length)

  // Apply pagination after filtering
  const paginatedData = filteredData.slice(offset, offset + limit)

  return paginatedData as Blog[]
}

/**
 * Fetch a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string, language: string = 'en') {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching blog post:', error)
    throw new Error(`Failed to fetch blog post: ${error.message}`)
  }

  return data as Blog
}

/**
 * Fetch featured blog posts for homepage
 */
export async function getFeaturedBlogPosts(limit: number = 3, language: string = 'en') {
  return getBlogPosts({ featured: true, limit }, language)
}

/**
 * Fetch related blog posts based on tags
 */
export async function getRelatedBlogPosts(currentSlug: string, tags: string[], limit: number = 3, language: string = 'en') {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .neq('slug', currentSlug)
    .overlaps('tags', tags)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching related blog posts:', error)
    return []
  }

  console.log('🔗 Related Posts - Language:', language)
  console.log('🔗 Related Posts - Current slug:', currentSlug)
  console.log('🔗 Related Posts - All matching tags:', data.length, 'posts')
  data.forEach(blog => {
    console.log('   - ' + blog.title + ' (' + blog.slug + ')')
  })

  // Filter by language based on exact slug matching
  const languageSlugs = getLanguageSlugs(language)
  console.log('🔗 Related Posts - Valid slugs for', language + ':', languageSlugs)
  
  const filteredData = data.filter(blog => {
    const slug = blog.slug.toLowerCase()
    const matches = languageSlugs.includes(slug)
    console.log('   ' + (matches ? '✅' : '❌') + ' ' + blog.title)
    return matches
  })

  console.log('🔗 Related Posts - Filtered result:', filteredData.length, 'posts')

  // Apply limit after filtering
  return filteredData.slice(0, limit) as Blog[]
}
/**
 * Get all unique tags from published blog posts filtered by language
 */
export async function getBlogTags(language: string = 'en') {
  const { data, error } = await supabase
    .from('blogs')
    .select('tags, slug')
    .eq('published', true)

  if (error) {
    console.error('Error fetching blog tags:', error)
    return []
  }

  // Filter by language
  const languageSlugs = getLanguageSlugs(language)
  const filteredBlogs = data.filter(blog => {
    const slug = blog.slug.toLowerCase()
    return languageSlugs.includes(slug)
  })

  // Flatten and deduplicate tags
  const allTags = filteredBlogs.flatMap(blog => blog.tags || [])
  return [...new Set(allTags)].sort()
}

/**
 * Get blog posts count
 */
export async function getBlogPostsCount() {
  const { count, error } = await supabase
    .from('blogs')
    .select('*', { count: 'exact', head: true })
    .eq('published', true)

  if (error) {
    console.error('Error fetching blog posts count:', error)
    return 0
  }

  return count || 0
}

/**
 * Calculate estimated reading time based on content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

/**
 * Generate excerpt from content if not provided
 */
export function generateExcerpt(content: string, length: number = 200): string {
  // Remove markdown syntax and HTML tags
  const plainText = content
    .replace(/#{1,6}\s/g, '') // Remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim()

  if (plainText.length <= length) {
    return plainText
  }

  return plainText.substring(0, length).replace(/\s+\S*$/, '') + '...'
}

/**
 * Format date for display
 */
export function formatBlogDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Generate SEO-friendly URL slug from title
 */
export function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
} 