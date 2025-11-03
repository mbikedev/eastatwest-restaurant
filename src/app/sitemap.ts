import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://eastatwest.com'

  // Static routes
  const routes = [
    '',
    '/about',
    '/menu',
    '/gallery',
    '/contact',
    '/events-catering',
    '/takeaway',
    '/blog',
    '/reservations',
  ]

  const staticRoutes = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // Fetch published blog posts from Supabase
  const supabase = createClient()
  let blogPosts: MetadataRoute.Sitemap = []

  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('slug, updated_at, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (!error && data) {
      blogPosts = data.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.published_at),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
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
