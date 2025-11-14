'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import Head from 'next/head'

/**
 * French SEO Landing Page for "restaurant libanais à bruxelles" search query
 * This page is specifically designed to rank for French language searches
 * and automatically switches the user to French language before redirecting to home
 */
export default function RestaurantLibanaisBruxellesPage() {
  const router = useRouter()
  const { i18n } = useTranslation()

  useEffect(() => {
    // Set language to French
    if (i18n.language !== 'fr') {
      i18n.changeLanguage('fr')
    }

    // Store French preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', 'fr')
    }

    // Redirect to homepage with French language after a brief delay
    // This allows search engines to index this page while users get seamless experience
    const timer = setTimeout(() => {
      router.push('/')
    }, 100)

    return () => clearTimeout(timer)
  }, [i18n, router])

  // SEO content for search engines (visible before redirect)
  return (
    <>
      <Head>
        <title>Restaurant Libanais à Bruxelles | East @ West - Cuisine Authentique</title>
        <meta name="description" content="Découvrez East @ West, le meilleur restaurant libanais à Bruxelles. Cuisine libanaise authentique, mezze traditionnels, grillades et desserts orientaux. Réservez votre table maintenant!" />
        <meta name="keywords" content="restaurant libanais bruxelles, cuisine libanaise, mezze, restaurant oriental bruxelles, east at west, houmous, falafel, kebab, bruxelles restaurant" />
        <link rel="canonical" href="https://eastatwest.com/fr/restaurant-libanais-a-bruxelles" />
        <meta property="og:title" content="Restaurant Libanais à Bruxelles | East @ West" />
        <meta property="og:description" content="Cuisine libanaise authentique au cœur de Bruxelles. Découvrez nos mezze, grillades et desserts traditionnels." />
        <meta property="og:url" content="https://eastatwest.com/fr/restaurant-libanais-a-bruxelles" />
        <meta property="og:locale" content="fr_BE" />
        <meta property="og:type" content="website" />
        <html lang="fr" />
      </Head>
      <div className="min-h-screen bg-[rgb(245,240,230)] flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[rgb(26,26,26)]">
            Restaurant Libanais à Bruxelles - East @ West
          </h1>
          <p className="text-xl mb-4 text-[rgb(26,26,26)]/80">
            Découvrez les saveurs authentiques du Liban au cœur de Bruxelles
          </p>
          <p className="text-lg mb-6 text-[rgb(26,26,26)]/70">
            East @ West vous propose une cuisine libanaise traditionnelle et moderne dans une ambiance chaleureuse.
            Situé Boulevard de l'Empereur 26, notre restaurant vous accueille pour une expérience culinaire unique.
          </p>
          <div className="text-base text-[rgb(26,26,26)]/60">
            Redirection vers la page d'accueil en français...
          </div>
        </div>
      </div>
    </>
  )
}
