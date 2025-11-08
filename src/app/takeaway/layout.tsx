import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Takeaway - East @ West Lebanese Restaurant Brussels',
  description: 'Order authentic Lebanese food for takeaway in Brussels. Fresh mezze, grilled specialties, and halal-certified dishes ready for pickup. Browse our menu and order online now.',
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
