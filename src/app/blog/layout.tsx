import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - East @ West Lebanese Restaurant Brussels',
  description: 'Lebanese cuisine blog: recipes, cooking tips & culinary traditions. Discover authentic Mediterranean food culture from East @ West Brussels.',
  alternates: {
    canonical: 'https://eastatwest.com/blog',
    languages: {
      'en': 'https://eastatwest.com/blog',
      'fr': 'https://eastatwest.com/blog',
      'nl': 'https://eastatwest.com/blog',
      'x-default': 'https://eastatwest.com/blog',
    },
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
