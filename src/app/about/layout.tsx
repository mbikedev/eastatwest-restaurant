import { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://eastatwest.com/about',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
