import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - East @ West Lebanese Restaurant Brussels',
  description: 'Explore Lebanese cuisine, recipes, and culinary traditions on the East @ West blog. Discover authentic Mediterranean cooking tips, restaurant news, and cultural stories from Brussels.',
  alternates: {
    canonical: 'https://eastatwest.com/blog',
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
