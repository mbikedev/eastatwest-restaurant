import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events & Catering - East @ West Lebanese Restaurant Brussels',
  description: 'Lebanese catering in Brussels. Professional event services for weddings, corporate events & private dining. Authentic cuisine by East @ West.',
  alternates: {
    canonical: 'https://eastatwest.com/events-catering',
    languages: {
      'en': 'https://eastatwest.com/events-catering',
      'fr': 'https://eastatwest.com/events-catering',
      'nl': 'https://eastatwest.com/events-catering',
      'x-default': 'https://eastatwest.com/events-catering',
    },
  },
}

export default function EventsCateringLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
