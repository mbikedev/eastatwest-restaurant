import { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://eastatwest.com/takeaway',
  },
}

export default function TakeawayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
