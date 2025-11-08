import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Lebanese Restaurant Brussels | East @ West - Reservations & Inquiries',
  description: 'Contact East @ West Brussels: Bld de l\'Empereur 26, 1000 Brussels. Phone: +32 465 20 60 24. Reservations & catering inquiries welcome.',
  keywords: 'contact Lebanese restaurant Brussels, East @ West contact, restaurant phone Brussels, Lebanese restaurant address, book table Brussels, catering inquiry Brussels, restaurant email Brussels',
  alternates: {
    canonical: 'https://eastatwest.com/contact',
    languages: {
      'en': 'https://eastatwest.com/contact',
      'fr': 'https://eastatwest.com/contact',
      'nl': 'https://eastatwest.com/contact',
      'x-default': 'https://eastatwest.com/contact',
    },
  },
  openGraph: {
    title: 'Contact East @ West | Lebanese Restaurant Brussels',
    description: 'Rue de la Bourse 15, 1000 Brussels | +32-2-503-5303 | Reservations & Inquiries Welcome',
    url: 'https://eastatwest.com/contact',
    type: 'website',
    locale: 'en_US',
    images: [{
      url: 'https://eastatwest.com/images/banner.webp',
      width: 1200,
      height: 630,
      alt: 'Contact East @ West Lebanese Restaurant'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact East @ West | Lebanese Restaurant Brussels',
    description: 'Rue de la Bourse 15, 1000 Brussels | +32-2-503-5303',
    images: ['https://eastatwest.com/images/banner.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
