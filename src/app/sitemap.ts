import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://eastatwest.com'
  const languages = ['en', 'fr', 'nl']

  // Static routes with SEO-optimized priorities and change frequencies
  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/menu', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/reservations', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/takeaway', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/events-catering', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/gallery', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/lebanese-restaurant-brussels', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/takeaway/checkout', priority: 0.6, changeFrequency: 'monthly' as const },
  ]

  // Generate URLs for static pages with language variants
  const staticRoutes: MetadataRoute.Sitemap = []

  for (const route of routes) {
    // Add default URL with language alternates
    staticRoutes.push({
      url: `${baseUrl}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          en: `${baseUrl}/en${route.path}`,
          fr: `${baseUrl}/fr${route.path}`,
          nl: `${baseUrl}/nl${route.path}`,
        },
      },
    })

    // Add language-specific URLs
    for (const lang of languages) {
      staticRoutes.push({
        url: `${baseUrl}/${lang}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority - 0.1, // Slightly lower priority for translations
      })
    }
  }

  // Fetch published blog posts from Supabase
  const supabase = createClient()
  let blogPosts: MetadataRoute.Sitemap = []

  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('slug, updated_at, published_at, language')
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (!error && data) {
      blogPosts = data.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.published_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        // Add language alternate if post has language specified
        ...(post.language && {
          alternates: {
            languages: {
              [post.language]: `${baseUrl}/${post.language}/blog/${post.slug}`,
            },
          },
        }),
      }))
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }

  return [
    ...staticRoutes,
    ...blogPosts,
  ]
}
