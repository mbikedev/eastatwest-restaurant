'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import { m } from 'framer-motion'
import Script from 'next/script'

const Breadcrumb = () => {
  const pathname = usePathname()
  const { t } = useTranslation('common')
  const { theme } = useTheme()

  // Don't show breadcrumb on home page
  if (pathname === '/') {
    return null
  }

  // Generate page title based on pathname
  const getPageTitle = (path: string) => {
    // Remove leading/trailing slashes and get the last segment
    const segments = path.split('/').filter(Boolean)
    const lastSegment = segments[segments.length - 1]

    // Map paths to translated titles
    const titleMap: Record<string, string> = {
      'menu': t('nav.menu'),
      'reservations': t('nav.reservations'),
      'takeaway': t('nav.takeaway'),
      'blog': t('nav.blog'),
      'events-catering': t('nav.events'),
      'about': t('nav.about'),
      'gallery': t('gallery.title'),
      'contact': 'Contact',
      'checkout': 'Checkout',
      'payment': 'Payment',
      'success': 'Success',
      'admin': 'Admin',
      'orders': 'Orders',
      'comments': 'Comments',
    }

    // If it's a nested path, try to get a meaningful title
    if (segments.length > 1) {
      // For blog posts or dynamic routes, use the last segment
      return titleMap[lastSegment] || lastSegment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    }

    return titleMap[lastSegment] || lastSegment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const pageTitle = getPageTitle(pathname)

  // Generate BreadcrumbList schema for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://eastatwest.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": pageTitle,
        "item": `https://eastatwest.com${pathname}`
      }
    ]
  }

  return (
    <>
      {/* Breadcrumb Structured Data */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <m.nav
        className={`w-full py-3 px-4 sm:px-6 lg:px-8 border-b transition-colors duration-300 mt-16 shadow-md ${
          theme === 'dark'
            ? 'bg-gray-900/95 border-gray-800 backdrop-blur-sm shadow-black/20'
            : 'bg-white/95 border-gray-200 backdrop-blur-sm shadow-gray-400/30'
        }`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          {/* Home Link */}
          <li>
            <Link
              href="/"
              className={`flex items-center transition-all duration-200 hover:underline cursor-pointer ${
                theme === 'dark'
                  ? 'text-green-400 hover:text-green-300'
                  : 'text-green-600 hover:text-green-700'
              }`}
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="font-semibold">Home</span>
            </Link>
          </li>

          {/* Separator */}
          <li>
            <svg
              className={`w-4 h-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </li>

          {/* Current Page */}
          <li>
            <span
              className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {pageTitle}
            </span>
          </li>
        </ol>
      </div>
    </m.nav>
    </>
  )
}

export default Breadcrumb
