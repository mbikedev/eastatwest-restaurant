import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://eastatwest.com'

  // Static routes with SEO-optimized priorities and change frequencies
  // Note: Language switching is handled client-side, so we don't create separate URL routes
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
    { path: '/faq', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/lebanese-restaurant-brussels', priority: 0.9, changeFrequency: 'monthly' as const },
  ]

  // Generate URLs for static pages (actual routes only)
  const staticRoutes: MetadataRoute.Sitemap = routes.map(route => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
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
        changeFrequency: 'weekly' as const,
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
