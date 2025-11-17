import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Takeaway - East @ West Lebanese Restaurant Brussels',
  description: 'Order Lebanese takeaway in Brussels. Fresh mezze, grilled specialties & halal dishes ready for pickup. Browse menu & order at East @ West.',
  alternates: {
    canonical: 'https://eastatwest.com/takeaway',
    languages: {
      'en': 'https://eastatwest.com/takeaway',
      'fr': 'https://eastatwest.com/takeaway',
      'nl': 'https://eastatwest.com/takeaway',
      'x-default': 'https://eastatwest.com/takeaway',
    },
  },
}

export default function TakeawayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
