import MenuHeroClient from '@/app/menu/MenuHeroClient'

export const metadata = {
  title: 'Lebanese Restaurant Menu Brussels | Authentic Mezze, Grill & Vegetarian Dishes',
  description: 'Discover our authentic Lebanese menu featuring fresh mezze, grilled specialties, vegetarian options, and traditional desserts. Halal-certified restaurant in Brussels. Dine-in or takeaway available.',
  keywords: 'Lebanese menu Brussels, mezze Brussels, halal restaurant menu, Lebanese food menu, Mediterranean menu, Lebanese grill, vegetarian Lebanese food, Brussels restaurant menu, authentic Lebanese dishes',
  alternates: {
    canonical: 'https://eastatwest.com/menu',
    languages: {
      'en': 'https://eastatwest.com/menu',
      'fr': 'https://eastatwest.com/menu',
      'nl': 'https://eastatwest.com/menu',
      'x-default': 'https://eastatwest.com/menu',
    },
  },
  openGraph: {
    title: 'Lebanese Restaurant Menu Brussels | East @ West',
    description: 'Authentic Lebanese menu with fresh mezze, grilled specialties, vegetarian options. Halal-certified. Order online for takeaway or dine-in.',
    images: [{
      url: 'https://eastatwest.com/images/banner.webp',
      width: 1200,
      height: 630,
      alt: 'East @ West Lebanese Restaurant Menu'
    }],
    url: 'https://eastatwest.com/menu',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lebanese Restaurant Menu Brussels | East @ West',
    description: 'Authentic Lebanese menu with fresh mezze, grilled specialties, vegetarian options. Halal-certified.',
    images: ['https://eastatwest.com/images/banner.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function MenuPage() {
  return <MenuHeroClient />
}


