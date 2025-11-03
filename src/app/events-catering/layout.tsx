import { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://eastatwest.com/events-catering',
  },
}

export default function EventsCateringLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
