import MenuHeroClient from '@/app/menu/MenuHeroClient'

export const metadata = {
  title: 'Menu | EastAtWest',
  description: 'Explore our full menu of authentic dishes. Dine in or order take-away on demand.',
  openGraph: {
    title: 'Menu | EastAtWest',
    description: 'Explore our full menu of authentic dishes. Dine in or order take-away on demand.',
    images: ['/images/banner.webp'],
    url: '/menu',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Menu | EastAtWest',
    description: 'Explore our full menu of authentic dishes. Dine in or order take-away on demand.',
    images: ['/images/banner.webp'],
  },
}

export default function MenuPage() {
  return <MenuHeroClient />
}


