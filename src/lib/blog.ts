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
        'restaurants-halal-cuisine-authentique-moyen-orient',
        'etiquette-restaurant-cuisine-moyen-orient',
        'restaurant-mediterraneen-top-4-caracteristiques',
        'restaurants-fast-food-pres-moi-avantages',
        'restaurant-vegetarien-experience-saine-savoureuse',
        'restaurant-mediterraneen-experience-inoubliable'
      ]
    case 'nl':
      return [
        'beste-vegetarische-restaurants-brussel-belgie',
        'halal-restaurants-authentieke-midden-oosterse-keuken',
        'midden-oosterse-restaurant-etiquette-wel-niet',
        'mediterraan-restaurant-top-4-kenmerken',
        'fastfood-restaurants-bij-mij-voordelen',
        'vegetarisch-restaurant-gezonde-smakelijke-ervaring',
        'mediterraans-restaurant-onvergetelijke-ervaring'
      ]
    case 'en':
    default:
      return [
        'best-vegetarian-restaurants-brussels-belgium',
        'halal-food-restaurants-authentic-middle-eastern-cuisine',
        'middle-eastern-restaurant-etiquette-dos-donts',
        'mediterranean-restaurant-top-4-features',
        'fast-food-restaurants-near-me-benefits',
        'vegetarian-restaurant-healthy-tasty-experience',
        'mediterranean-restaurant-unforgettable-experience'
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