import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Authentic Lebanese Restaurant in Brussels | East @ West',
  description: 'Discover East @ West Brussels, authentic Lebanese restaurant. Fresh ingredients, traditional recipes, halal-certified kitchen & Mediterranean cuisine.',
  keywords: 'about East @ West, Lebanese restaurant Brussels story, authentic Lebanese cuisine, halal restaurant Brussels, Mediterranean restaurant about, Brussels Lebanese food, family restaurant Brussels',
  alternates: {
    canonical: 'https://eastatwest.com/about',
  },
  openGraph: {
    title: 'About East @ West | Authentic Lebanese Restaurant Brussels',
    description: 'Discover our story, passion for Lebanese cuisine, and commitment to quality. Fresh ingredients, traditional recipes, halal-certified kitchen.',
    url: 'https://eastatwest.com/about',
    type: 'website',
    locale: 'en_US',
    images: [{
      url: 'https://eastatwest.com/images/banner.webp',
      width: 1200,
      height: 630,
      alt: 'East @ West Lebanese Restaurant Brussels'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About East @ West | Authentic Lebanese Restaurant Brussels',
    description: 'Discover our story, passion for Lebanese cuisine, and commitment to quality.',
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

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
