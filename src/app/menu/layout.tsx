import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Menu - Authentic Lebanese Cuisine | East @ West Brussels',
  description: 'Explore our authentic Lebanese menu: mezze, grilled specialties, salads & desserts. Halal-certified. Dine-in & takeaway in Brussels.',
  alternates: {
    canonical: 'https://eastatwest.com/menu',
  },
}

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
