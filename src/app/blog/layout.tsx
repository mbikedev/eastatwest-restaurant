import { Metadata } from 'next'

export const metadata: Metadata = {
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
