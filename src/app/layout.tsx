import type { Metadata } from "next";
import { Inter, Roboto, Rozha_One, ZCOOL_XiaoWei } from "next/font/google";
import "./globals.css";
import ZeroCSSBlocking, { ultraCriticalCSS } from '../components/ZeroCSSBlocking';
import { ThemeProvider } from "../context/ThemeContext";
import { LightboxProvider } from "../context/LightboxContext";
import { CartProvider } from "../context/CartContext";
import { LanguageProvider } from "../context/LanguageContext";
import I18nProvider from "../components/I18nProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import ClientProviders from "../components/ClientProviders";
import CookieConsent from "../components/CookieConsent";

// Optimize font loading - use optional display for non-critical fonts
const inter = Inter({
  subsets: ["latin"],
  display: 'optional', // Don't block render waiting for font
  preload: false, // Let Next.js handle preloading
  fallback: ['system-ui', 'sans-serif'],
});

const roboto = Roboto({
  weight: ['400', '700'], // Reduced from ['400', '500', '700'] - less to load
  subsets: ["latin"],
  display: 'optional', // Don't block render
  preload: false,
  fallback: ['Arial', 'sans-serif'],
});

// Decorative fonts - load async, don't block render
const rozha = Rozha_One({
  weight: '400',
  subsets: ['latin'],
  display: 'optional', // Changed from 'swap' to 'optional'
  preload: false,
  variable: '--font-rozha',
  fallback: ['Georgia', 'serif'],
});

const zcool = ZCOOL_XiaoWei({
  weight: '400',
  subsets: ['latin'],
  display: 'optional', // Changed from 'swap' to 'optional'
  preload: false,
  variable: '--font-xiaowei',
  fallback: ['Georgia', 'serif'],
});

// Cache busting version for favicon - increment this to force favicon refresh
const FAVICON_VERSION = 'v5';

export const metadata: Metadata = {
  metadataBase: new URL('https://eastatwest.com'),
  title: "East @ West — Lebanese Fusion Restaurant in Brussels",
  description: "Authentic Lebanese cuisine meets modern flavors at East @ West in Brussels. Experience handcrafted Mediterranean dishes, fresh ingredients & warm hospitality. Book now!",
  keywords: "Lebanese restaurant Brussels, Mediterranean cuisine, fusion restaurant, Brussels dining, Lebanese food, mezze, authentic cuisine, Restaurant Guru recommended",
  authors: [{ name: "East @ West" }],
  icons: {
    icon: [
      { url: `/favicon-128x128.png?${FAVICON_VERSION}`, sizes: '128x128', type: 'image/png' },
      { url: `/favicon-96x96.png?${FAVICON_VERSION}`, sizes: '96x96', type: 'image/png' },
      { url: `/favicon-64x64.png?${FAVICON_VERSION}`, sizes: '64x64', type: 'image/png' },
      { url: `/favicon-48x48.png?${FAVICON_VERSION}`, sizes: '48x48', type: 'image/png' },
      { url: `/favicon-32x32.png?${FAVICON_VERSION}`, sizes: '32x32', type: 'image/png' },
      { url: `/favicon-16x16.png?${FAVICON_VERSION}`, sizes: '16x16', type: 'image/png' },
      { url: `/favicon.ico?${FAVICON_VERSION}` },
    ],
    apple: [
      { url: `/apple-touch-icon.png?${FAVICON_VERSION}`, sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: `/site.webmanifest?${FAVICON_VERSION}`,
  openGraph: {
    title: "East @ West — Lebanese Fusion Restaurant in Brussels",
    description: "Authentic Lebanese cuisine meets modern flavors in the heart of Brussels. Experience handcrafted Mediterranean dishes with fresh ingredients.",
    type: "website",
    locale: "en_US",
    url: "https://eastatwest.com",
    siteName: "East @ West Restaurant",
    images: [
      {
        url: "https://eastatwest.com/images/banner.webp",
        width: 1200,
        height: 630,
        alt: "East @ West Lebanese Restaurant Brussels",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "East @ West — Lebanese Fusion Restaurant in Brussels",
    description: "Authentic Lebanese cuisine meets modern flavors in the heart of Brussels. Experience handcrafted Mediterranean dishes with fresh ingredients.",
    images: ["https://eastatwest.com/images/banner.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Force favicon refresh - additional link tags with cache busting */}
        <link rel="icon" href={`/favicon.ico?${FAVICON_VERSION}`} />
        <link rel="shortcut icon" href={`/favicon.ico?${FAVICON_VERSION}`} />

        {/* Inline Critical CSS - prevents render blocking */}
        <style
          dangerouslySetInnerHTML={{
            __html: ultraCriticalCSS
          }}
        />

        {/* Note: Preload for banner.webp moved to homepage to avoid unused preload warnings on other pages */}

        {/* DNS prefetch for external resources - do NOT preconnect (causes extra RTT) */}
        <link rel="dns-prefetch" href="https://awards.infcdn.net" />
        <link rel="dns-prefetch" href="https://restaurantguru.com" />

        {/* DO NOT preconnect to Google Fonts - Next.js font optimization handles this */}

        {/* Restaurant Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              "name": "East @ West",
              "image": "https://eastatwest.com/images/banner.webp",
              "logo": {
                "@type": "ImageObject",
                "url": `https://eastatwest.com/android-chrome-512x512.png?${FAVICON_VERSION}`,
                "width": "512",
                "height": "512"
              },
              "url": "https://eastatwest.com",
              "telephone": "+32-2-503-5303",
              "email": "infos.east.west@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Rue de la Bourse 15",
                "addressLocality": "Brussels",
                "postalCode": "1000",
                "addressCountry": "BE"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 50.8476,
                "longitude": 4.3572
              },
              "servesCuisine": ["Lebanese", "Mediterranean", "Middle Eastern"],
              "priceRange": "$$",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                  "opens": "12:00",
                  "closes": "22:00"
                }
              ],
              "acceptsReservations": "True",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.5",
                "reviewCount": "150"
              }
            })
          }}
        />

        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var css1 = document.createElement('link');
                css1.rel = 'stylesheet';
                css1.href = '/css/21dd575f6da5a64f.css';
                css1.media = 'print';
                css1.onload = function() { this.media = 'all'; };
                document.head.appendChild(css1);
                
                var css2 = document.createElement('link');
                css2.rel = 'stylesheet';
                css2.href = '/css/824db010a7f7a3f8.css';
                css2.media = 'print';
                css2.onload = function() { this.media = 'all'; };
                document.head.appendChild(css2);
                
                var css3 = document.createElement('link');
                css3.rel = 'stylesheet';
                css3.href = 'https://awards.infcdn.net/circ5_n.css';
                css3.media = 'print';
                css3.onload = function() { this.media = 'all'; };
                document.head.appendChild(css3);
                
                var css4 = document.createElement('link');
                css4.rel = 'stylesheet';
                css4.href = '/deferred-styles.css';
                css4.media = 'print';
                css4.onload = function() { this.media = 'all'; };
                document.head.appendChild(css4);
              })();
            `
          }} 
        />

        <noscript>
          <link rel="stylesheet" href="/css/21dd575f6da5a64f.css" />
          <link rel="stylesheet" href="/css/824db010a7f7a3f8.css" />
          <link rel="stylesheet" href="https://awards.infcdn.net/circ5_n.css" />
          <link rel="stylesheet" href="/deferred-styles.css" />
        </noscript>

        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;500;700&display=swap" />

        <style 
          id="ultra-critical-css"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: ultraCriticalCSS }} 
        />
        <script 
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `
          }} 
        />
      </head>
      <body className={`${inter.className} ${roboto.className} ${rozha.variable} ${zcool.variable}`}>
        <I18nProvider>
          <LanguageProvider>
            <ThemeProvider>
              <CartProvider>
                <LightboxProvider>
                  <ZeroCSSBlocking />
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <Breadcrumb />
                    <main className="flex-1">
              {children}
                    </main>
                    <Footer />
                  </div>
                  <ClientProviders />
                  <CookieConsent />
                </LightboxProvider>
              </CartProvider>
            </ThemeProvider>
          </LanguageProvider>
        </I18nProvider>
      </body>
    </html>
  );
}