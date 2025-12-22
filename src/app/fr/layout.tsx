import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Restaurant Libanais à Bruxelles | East @ West',
  description: 'Découvrez East @ West, le meilleur restaurant libanais à Bruxelles. Cuisine libanaise authentique, mezze traditionnels, grillades et desserts orientaux.',
}

export default function FrenchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
