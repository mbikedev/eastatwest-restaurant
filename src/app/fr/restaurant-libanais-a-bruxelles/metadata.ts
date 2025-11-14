import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Restaurant Libanais à Bruxelles | East @ West - Cuisine Authentique',
  description: 'Découvrez East @ West, le meilleur restaurant libanais à Bruxelles. Cuisine libanaise authentique, mezze traditionnels, grillades et desserts orientaux. Réservez votre table maintenant!',
  keywords: 'restaurant libanais bruxelles, cuisine libanaise, mezze, restaurant oriental bruxelles, east at west, houmous, falafel, kebab, bruxelles restaurant',
  openGraph: {
    title: 'Restaurant Libanais à Bruxelles | East @ West',
    description: 'Cuisine libanaise authentique au cœur de Bruxelles. Découvrez nos mezze, grillades et desserts traditionnels.',
    url: 'https://eastatwest.com/fr/restaurant-libanais-a-bruxelles',
    siteName: 'East @ West',
    locale: 'fr_BE',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eastatwest.com/fr/restaurant-libanais-a-bruxelles',
    languages: {
      'fr-BE': 'https://eastatwest.com/fr/restaurant-libanais-a-bruxelles',
      'en': 'https://eastatwest.com',
      'nl-BE': 'https://eastatwest.com',
    },
  },
}
