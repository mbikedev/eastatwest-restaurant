import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events & Catering - East @ West Lebanese Restaurant Brussels',
  description: 'Host your events with authentic Lebanese cuisine at East @ West in Brussels. Professional catering services for weddings, corporate events, and private dining. Contact us today!',
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
