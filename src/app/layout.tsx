import "@/lib/ssr-sanitize";
import type { Metadata } from "next";
import { Inter, Roboto, Rozha_One, ZCOOL_XiaoWei } from "next/font/google";
import "./globals.css";
import ZeroCSSBlocking, {
  ultraCriticalCSS,
} from "../components/ZeroCSSBlocking";
import { ThemeProvider } from "../context/ThemeContext";
import { LightboxProvider } from "../context/LightboxContext";
import { CartProvider } from "../context/CartContext";
import { LanguageProvider } from "../context/LanguageContext";
import I18nProvider from "../components/I18nProvider";
import LazyMotionProvider from "../components/LazyMotion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import ClientProviders from "../components/ClientProviders";
import CookieConsent from "../components/CookieConsent";

// Optimize font loading - use optional display for non-critical fonts
const inter = Inter({
  subsets: ["latin"],
  display: "optional", // Don't block render waiting for font
  preload: false, // Let Next.js handle preloading
  fallback: ["system-ui", "sans-serif"],
});

const roboto = Roboto({
  weight: ["400", "700"], // Reduced from ['400', '500', '700'] - less to load
  subsets: ["latin"],
  display: "optional", // Don't block render
  preload: false,
  fallback: ["Arial", "sans-serif"],
});

// Decorative fonts - load async, don't block render
const rozha = Rozha_One({
  weight: "400",
  subsets: ["latin"],
  display: "optional", // Changed from 'swap' to 'optional'
  preload: false,
  variable: "--font-rozha",
  fallback: ["Georgia", "serif"],
});

const zcool = ZCOOL_XiaoWei({
  weight: "400",
  subsets: ["latin"],
  display: "optional", // Changed from 'swap' to 'optional'
  preload: false,
  variable: "--font-xiaowei",
  fallback: ["Georgia", "serif"],
});

// Cache busting version for favicon - increment this to force favicon refresh
const FAVICON_VERSION = "v5";

export const metadata: Metadata = {
  metadataBase: new URL("https://eastatwest.com"),
  title: "East At West — Lebanese Fusion Restaurant in Brussels",
  description:
    "Authentic Lebanese cuisine in Brussels. Fresh Mediterranean dishes, warm hospitality & halal options. Book your table at East At West today!",
  keywords:
    "Lebanese restaurant Brussels, Mediterranean cuisine, fusion restaurant, Brussels dining, Lebanese food, mezze, authentic cuisine, Restaurant Guru recommended",
  authors: [{ name: "East At West" }],
  alternates: {
    canonical: "https://eastatwest.com",
    languages: {
      'en': 'https://eastatwest.com',
      'fr': 'https://eastatwest.com',
      'nl': 'https://eastatwest.com',
      'x-default': 'https://eastatwest.com',
    },
  },
  icons: {
    icon: [
      {
        url: `/favicon-128x128.png?${FAVICON_VERSION}`,
        sizes: "128x128",
        type: "image/png",
      },
      {
        url: `/favicon-96x96.png?${FAVICON_VERSION}`,
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: `/favicon-64x64.png?${FAVICON_VERSION}`,
        sizes: "64x64",
        type: "image/png",
      },
      {
        url: `/favicon-48x48.png?${FAVICON_VERSION}`,
        sizes: "48x48",
        type: "image/png",
      },
      {
        url: `/favicon-32x32.png?${FAVICON_VERSION}`,
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: `/favicon-16x16.png?${FAVICON_VERSION}`,
        sizes: "16x16",
        type: "image/png",
      },
      { url: `/favicon.ico?${FAVICON_VERSION}` },
    ],
    apple: [
      {
        url: `/apple-touch-icon.png?${FAVICON_VERSION}`,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: `/site.webmanifest?${FAVICON_VERSION}`,
  openGraph: {
    title: "East At West — Lebanese Fusion Restaurant in Brussels",
    description:
      "Authentic Lebanese cuisine meets modern flavors in the heart of Brussels. Experience handcrafted Mediterranean dishes with fresh ingredients.",
    type: "website",
    locale: "en_US",
    url: "https://eastatwest.com",
    siteName: "East At West Restaurant",
    images: [
      {
        url: "https://eastatwest.com/images/banner.webp",
        width: 1200,
        height: 630,
        alt: "East At West Lebanese Restaurant Brussels",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "East At West — Lebanese Fusion Restaurant in Brussels",
    description:
      "Authentic Lebanese cuisine meets modern flavors in the heart of Brussels. Experience handcrafted Mediterranean dishes with fresh ingredients.",
    images: ["https://eastatwest.com/images/banner.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
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
            __html: ultraCriticalCSS,
          }}
        />

        {/* Note: Preload for banner.webp moved to homepage to avoid unused preload warnings on other pages */}

        {/* Preconnect to external resources for faster loading */}
        <link rel="preconnect" href="https://awards.infcdn.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://restaurantguru.com" />

        {/* DO NOT preconnect to Google Fonts - Next.js font optimization handles this */}

        {/* Enhanced Restaurant + Organization Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Restaurant",
                "@id": "https://eastatwest.com/#restaurant",
                name: "East At West",
                alternateName: "East At West Lebanese Restaurant",
                description: "Authentic Lebanese restaurant in Brussels serving fresh mezze, grilled specialties, and traditional desserts. Halal-certified with vegetarian and vegan options.",
                image: [
                  "https://eastatwest.com/images/banner.webp",
                  "https://eastatwest.com/images/gallery/set-libanais.webp",
                  "https://eastatwest.com/images/gallery/falafel.webp"
                ],
                logo: {
                  "@type": "ImageObject",
                  url: `https://eastatwest.com/android-chrome-512x512.png?${FAVICON_VERSION}`,
                  width: 512,
                  height: 512,
                },
                url: "https://eastatwest.com",
                telephone: "+32 465 20 60 24",
                email: "contact@eastatwest.com",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Bld de l'Empereur 26",
                  addressLocality: "Brussels",
                  addressRegion: "Brussels-Capital",
                  postalCode: "1000",
                  addressCountry: "BE",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 50.8476,
                  longitude: 4.3572,
                },
                servesCuisine: ["Lebanese", "Mediterranean", "Middle Eastern", "Halal"],
                priceRange: "$$",
                menu: "https://eastatwest.com/menu",
                openingHoursSpecification: [
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    opens: "11:30",
                    closes: "14:00",
                  },
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: "Saturday",
                    opens: "18:00",
                    closes: "22:00",
                  },
                ],
                acceptsReservations: true,
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: "4.5",
                  reviewCount: "150",
                  bestRating: "5",
                  worstRating: "1",
                },
                hasMenu: {
                  "@type": "Menu",
                  url: "https://eastatwest.com/menu",
                  hasMenuSection: [
                    {
                      "@type": "MenuSection",
                      name: "Mezze",
                      description: "Traditional Lebanese appetizers"
                    },
                    {
                      "@type": "MenuSection",
                      name: "Main Courses",
                      description: "Grilled specialties and traditional dishes"
                    },
                    {
                      "@type": "MenuSection",
                      name: "Desserts",
                      description: "Traditional Lebanese sweets"
                    }
                  ]
                },
                starRating: {
                  "@type": "Rating",
                  ratingValue: "4.5"
                },
                paymentAccepted: ["Cash", "Credit Card", "Debit Card"],
                currenciesAccepted: "EUR",
                amenityFeature: [
                  {
                    "@type": "LocationFeatureSpecification",
                    name: "Takeaway Service",
                    value: true
                  },
                  {
                    "@type": "LocationFeatureSpecification",
                    name: "Delivery Service",
                    value: true
                  },
                  {
                    "@type": "LocationFeatureSpecification",
                    name: "Outdoor Seating",
                    value: false
                  },
                  {
                    "@type": "LocationFeatureSpecification",
                    name: "Family Friendly",
                    value: true
                  }
                ],
                potentialAction: {
                  "@type": "ReserveAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://eastatwest.com/reservations",
                    actionPlatform: [
                      "http://schema.org/DesktopWebPlatform",
                      "http://schema.org/MobileWebPlatform"
                    ]
                  },
                  result: {
                    "@type": "Reservation",
                    name: "Table Reservation"
                  }
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": "https://eastatwest.com/#organization",
                name: "East At West",
                url: "https://eastatwest.com",
                logo: `https://eastatwest.com/android-chrome-512x512.png?${FAVICON_VERSION}`,
                description: "Authentic Lebanese restaurant in Brussels offering dine-in, takeaway, and catering services",
                telephone: "+32-2-503-5303",
                email: "infos.east.west@gmail.com",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Rue de la Bourse 15",
                  addressLocality: "Brussels",
                  postalCode: "1000",
                  addressCountry: "BE",
                },
                sameAs: [
                  "https://www.facebook.com/eastatwest",
                  "https://www.instagram.com/eastatwest",
                  "https://www.restaurantguru.com/East-at-West-Brussels"
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+32-2-503-5303",
                  contactType: "customer service",
                  email: "infos.east.west@gmail.com",
                  availableLanguage: ["English", "French", "Dutch", "Arabic"],
                  areaServed: "BE"
                }
              }
            ]),
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
            `,
          }}
        />

        <noscript>
          <link rel="stylesheet" href="/css/21dd575f6da5a64f.css" />
          <link rel="stylesheet" href="/css/824db010a7f7a3f8.css" />
          <link rel="stylesheet" href="https://awards.infcdn.net/circ5_n.css" />
          <link rel="stylesheet" href="/deferred-styles.css" />
        </noscript>

        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
                    // Set theme
                    var theme = window.localStorage.getItem('theme') || 'light';
                    if (theme === 'dark') {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }

                    // Set language attribute
                    var language = window.localStorage.getItem('language') || 'en';
                    document.documentElement.setAttribute('lang', language);
                  }
                } catch(e) {
                  // Silently fail if localStorage is not available
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.className} ${roboto.className} ${rozha.variable} ${zcool.variable}`}
      >
        <I18nProvider>
          <LanguageProvider>
            <ThemeProvider>
              <CartProvider>
                <LightboxProvider>
                  <LazyMotionProvider>
                    <ZeroCSSBlocking />
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <Breadcrumb />
                      <main className="flex-1">{children}</main>
                      <Footer />
                    </div>
                    <ClientProviders />
                    <CookieConsent />
                  </LazyMotionProvider>
                </LightboxProvider>
              </CartProvider>
            </ThemeProvider>
          </LanguageProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
