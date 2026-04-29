import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Table | Lebanese Restaurant Brussels | East @ West',
  description: 'Reserve your table at East @ West Brussels. Authentic Lebanese dining experience. Easy online booking for lunch & dinner.',
  alternates: {
    canonical: 'https://eastatwest.com/reservations',
  },
}

export default function ReservationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
