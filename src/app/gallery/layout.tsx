import { Metadata } from 'next'

export const metadata: Metadata = {
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
