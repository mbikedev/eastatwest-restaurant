import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gallery - Lebanese Restaurant Photos | East @ West Brussels',
  description: 'Explore our Lebanese cuisine gallery. View photos of mezze, grills, desserts & restaurant ambiance at East @ West Brussels.',
  alternates: {
    canonical: 'https://eastatwest.com/gallery',
  },
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
