import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | East @ West Brussels',
  description: 'Find answers about our Lebanese restaurant: opening hours, parking, halal options, vegan menu, reservations & group bookings in Brussels.',
  alternates: {
    canonical: 'https://eastatwest.com/faq',
  },
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
