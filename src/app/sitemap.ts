import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
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

  // Add blog posts dynamically if they exist
  // You can fetch from your CMS/database here
  const blogPosts: MetadataRoute.Sitemap = []

  // For now, just return static routes
  return [
    ...staticRoutes,
    ...blogPosts,
  ]
}
