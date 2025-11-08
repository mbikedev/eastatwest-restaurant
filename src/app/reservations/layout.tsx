import { Metadata } from 'next'

export const metadata: Metadata = {
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
