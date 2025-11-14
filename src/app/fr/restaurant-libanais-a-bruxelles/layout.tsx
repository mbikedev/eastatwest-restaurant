import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Restaurant Libanais à Bruxelles | East @ West - Cuisine Authentique',
  description: 'Découvrez East @ West, le meilleur restaurant libanais à Bruxelles. Cuisine libanaise authentique, mezze traditionnels, houmous, falafel, kebbe, grillades et desserts orientaux. Boulevard de l\'Empereur 26, 1000 Bruxelles.',
  keywords: 'restaurant libanais bruxelles, cuisine libanaise, mezze, restaurant oriental bruxelles, east at west, houmous, falafel, kebab, kebbe, bruxelles restaurant, restaurant halal bruxelles',
  openGraph: {
    title: 'Restaurant Libanais à Bruxelles | East @ West',
    description: 'Cuisine libanaise authentique au cœur de Bruxelles. Découvrez nos mezze, grillades et desserts traditionnels.',
    url: 'https://eastatwest.com/fr/restaurant-libanais-a-bruxelles',
    siteName: 'East @ West',
    locale: 'fr_BE',
    type: 'restaurant',
    images: [
      {
        url: 'https://eastatwest.com/images/banner.webp',
        width: 1200,
        height: 630,
        alt: 'Restaurant East @ West - Cuisine Libanaise à Bruxelles',
      },
    ],
  },
  alternates: {
    canonical: 'https://eastatwest.com/fr/restaurant-libanais-a-bruxelles',
    languages: {
      'fr-BE': 'https://eastatwest.com/fr/restaurant-libanais-a-bruxelles',
      'en': 'https://eastatwest.com',
      'nl-BE': 'https://eastatwest.com',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RestaurantLibanaisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
