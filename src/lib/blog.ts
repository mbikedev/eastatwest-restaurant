import { createClient } from '@/utils/supabase/client'
import type { Blog, BlogListParams } from '@/types/blog'

const supabase = createClient()

/**
 * Detect language from blog post (using the language column)
 */
export function detectLanguageFromSlug(slug: string): string {
  // This function is deprecated but kept for backwards compatibility
  // The language is now stored in the database
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

  // Build query with language filter from the start
  let query = supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .eq('language', language)
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

  // Apply pagination
  query = query.range(offset, offset + limit - 1)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching blog posts:', error)
    throw new Error(`Failed to fetch blog posts: ${error.message}`)
  }

  // Additional client-side filter to ensure only correct language posts are returned
  const filteredData = (data || []).filter(blog => blog.language === language)

  return filteredData as Blog[]
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
    .eq('language', language)
    .neq('slug', currentSlug)
    .overlaps('tags', tags)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching related blog posts:', error)
    return []
  }

  // Additional client-side filter to ensure only correct language posts are returned
  const filteredData = (data || []).filter(blog => blog.language === language)

  return filteredData as Blog[]
}
/**
 * Get all unique tags from published blog posts filtered by language
 */
export async function getBlogTags(language: string = 'en') {
  const { data, error } = await supabase
    .from('blogs')
    .select('tags')
    .eq('published', true)
    .eq('language', language)

  if (error) {
    console.error('Error fetching blog tags:', error)
    return []
  }

  // Flatten and deduplicate tags
  const allTags = (data || []).flatMap(blog => blog.tags || [])
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

/**
 * Get adjacent blog posts (previous and next) for navigation
 */
export async function getAdjacentBlogPosts(currentSlug: string, language: string = 'en') {
  const { data, error } = await supabase
    .from('blogs')
    .select('slug, title, published_at')
    .eq('published', true)
    .eq('language', language)
    .order('published_at', { ascending: false })

  if (error || !data) {
    console.error('Error fetching adjacent blog posts:', error)
    return { previous: null, next: null }
  }

  // Find current post index
  const currentIndex = data.findIndex(blog => blog.slug === currentSlug)

  if (currentIndex === -1) {
    return { previous: null, next: null }
  }

  // Previous post is the one published after (newer)
  const previous = currentIndex > 0 ? data[currentIndex - 1] : null

  // Next post is the one published before (older)
  const next = currentIndex < data.length - 1 ? data[currentIndex + 1] : null

  return { previous, next }
} 