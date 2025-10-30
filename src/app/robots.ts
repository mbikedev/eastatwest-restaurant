import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/debug-auth',
          '/force-admin-refresh',
          '/login',
          '/reset-password',
          '/takeaway/checkout',
          '/takeaway/payment',
        ],
      },
    ],
    sitemap: 'https://eastatwest.com/sitemap.xml',
  }
}
