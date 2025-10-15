'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, Mail, MapPin, Clock, ChevronRight } from 'lucide-react'
import Banner from '../../public/images/banner.webp'
import Guru1 from '../../public/images/guru2023.webp'
import Guru2 from '../../public/images/guru2024.webp'

export default function HomePage() {
  const { t } = useTranslation('common')
  const { theme } = useTheme()

  // Video reference for hero section autoplay, defer until after first paint
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showVideo, setShowVideo] = useState(false)

  // Defer background video until after first paint/user intent to improve LCP
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-data: reduce)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    // Only enable video if user does not prefer reduced data/motion
    if (!mediaQuery.matches && !reducedMotion.matches) {
      // Show video after initial frame to avoid competing with LCP image
      const t = setTimeout(() => setShowVideo(true), 1200)
      const onFirstInput = () => setShowVideo(true)
      window.addEventListener('pointerdown', onFirstInput, { once: true })
      return () => {
        clearTimeout(t)
        window.removeEventListener('pointerdown', onFirstInput)
      }
    }
  }, [])

  // Video autoplay effect once video is revealed
  useEffect(() => {
    if (!showVideo) return
    const video = videoRef.current
    if (video) {
      video.muted = true
      const playVideo = async () => {
        try {
          await video.play()
        } catch (error) {
          // ignore autoplay failures
        }
      }
      if (video.readyState >= 3) {
        playVideo()
      } else {
        video.addEventListener('canplaythrough', playVideo)
      }
      return () => {
        video.removeEventListener('canplaythrough', playVideo)
      }
    }
  }, [showVideo])

  const specials = [
    {
      id: 1,
      image: '/images/gallery/houmos.webp',
      titleKey: 'specials.items.hummus.title',
      descriptionKey: 'specials.items.hummus.description',
      priceKey: 'specials.items.hummus.price',
    },
    {
      id: 2,
      image: '/images/gallery/falafel.webp',
      titleKey: 'specials.items.falafel.title',
      descriptionKey: 'specials.items.falafel.description',
      priceKey: 'specials.items.falafel.price',
    },
    {
      id: 3,
      image: '/images/gallery/kebbe.webp',
      titleKey: 'specials.items.kebbe.title',
      descriptionKey: 'specials.items.kebbe.description',
      priceKey: 'specials.items.kebbe.price',
    },
    {
      id: 4,
      image: '/images/gallery/aish el saraya.webp',
      titleKey: 'specials.items.aishElSaraya.title',
      descriptionKey: 'specials.items.aishElSaraya.description',
      priceKey: 'specials.items.aishElSaraya.price',
    },
  ]

  const events = [
    {
      id: 1,
      titleKey: "upcomingEvents.wineTasting.title",
      descriptionKey: "upcomingEvents.wineTasting.description",
      icon: "🍷"
    },
    {
      id: 2,
      titleKey: "upcomingEvents.chefTable.title",
      descriptionKey: "upcomingEvents.chefTable.description",
      icon: "👨‍🍳"
    },
    {
      id: 3,
      titleKey: "upcomingEvents.cookingClass.title",
      descriptionKey: "upcomingEvents.cookingClass.description",
      icon: "🥘"
    }
  ]

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[rgb(26,26,26)] text-white' : 'bg-[rgb(245,240,230)] text-[rgb(26,26,26)]'}`}>
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            "name": "East at West",
            "description": "Experience the authentic flavors of the Mediterranean in our modern culinary sanctuary.",
            "servesCuisine": ["Mediterranean", "Middle Eastern", "Lebanese"],
            "priceRange": "$$",
            "image": "/images/banner.webp",
            "hasMenu": "/pdfs/menus.pdf",
            "acceptsReservations": true,
          })
        }}
      />

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background container: paint LCP with optimized Image, defer video */}
        <div className="absolute inset-0 w-full h-full">
          {/* LCP hero image (served immediately) */}
          <Image
            src={Banner}
            alt={t('hero.imageAlt') || 'East @ West hero'}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="absolute inset-0 w-full h-full object-cover z-10"
          />

          {/* Background video (deferred) */}
          {showVideo && (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover z-10"
              autoPlay
              loop
              muted={true}
              playsInline
              preload="none"
              poster="/images/banner.webp"
            >
              <source src="/videos/hero-video.mp4" type="video/mp4" />
              <source src="/videos/hero-video.webm" type="video/webm" />
              <track
                kind="captions"
                src="/videos/hero-video-captions.vtt"
                srcLang="en"
                label="English captions"
                default
              />
              Your browser does not support the video tag.
            </video>
          )}

          {/* Enhanced Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 z-15 bg-gradient-to-br from-black/70 via-black/50 to-black/60"></div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="mb-6">
              <span className="text-5xl sm:text-7xl">🍽️</span>
            </div>

            <h1
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 text-white"
              style={{ fontFamily: 'var(--font-rozha), serif' }}
            >
              {t("hero.headline")}
            </h1>

            <p
              className="text-lg sm:text-xl md:text-2xl mb-8 text-white max-w-3xl mx-auto inline-block"
              style={{
                backgroundColor: 'rgba(181, 174, 174, 0.15)',
                padding: '1rem',
                borderRadius: '0.5rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)'
              }}
            >
              {t("hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/reservations">
                  {t("hero.cta")}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 text-white border-white">
                <Link href="/pdfs/menus.pdf" target="_blank">
                  {t("hero.viewMenu")}
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 text-white border-white">
                <Link href="/pdfs/take-away-only.pdf" target="_blank">
                  Take-Away-Only
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 text-white border-white">
                <Link href="/gallery">
                  {t("hero.viewGallery")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Today's Specials Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <div className="text-5xl mb-4">🌟</div>
              <h2
                className="text-4xl sm:text-5xl md:text-6xl font-black mb-4"
                style={{ fontFamily: 'var(--font-rozha), serif' }}
              >
                {t('specials.title')}
              </h2>
              <p className="text-xl text-[rgb(168,213,186)] font-semibold mb-4">
                {t('specials.subtitle')}
              </p>
              <div className="w-32 h-1.5 mx-auto rounded-full bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)]"></div>
              <p className="text-base sm:text-lg mt-6 max-w-3xl mx-auto opacity-80">
                {t('specials.description')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {specials.map((special) => (
                <Card key={special.id} className="overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={special.image}
                      alt={t(special.titleKey)}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-3 right-3 bg-[rgb(168,213,186)] text-[rgb(26,26,26)] px-3 py-1 rounded-full font-bold text-sm">
                      {t(special.priceKey)}
                    </div>
                    <div className="absolute top-3 left-3 text-2xl">⭐</div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{t(special.titleKey)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {t(special.descriptionKey)}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" className="bg-[rgb(168,213,186)] hover:bg-[rgb(168,213,186)]/90 text-[rgb(26,26,26)]">
                <Link href="/pdfs/allmenus.pdf" target="_blank">
                  {t('specials.seeFullMenu')}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </section>

          {/* Upcoming Events Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <div className="text-5xl mb-4">🎉</div>
              <Link href="/events-catering">
                <h2
                  className={`text-4xl sm:text-5xl font-black mb-4 cursor-pointer hover:text-[rgb(168,213,186)] transition-colors duration-300`}
                  style={{ fontFamily: 'var(--font-rozha), serif' }}
                >
                  {t('realtime.reserveEvents')}
                </h2>
              </Link>
              <div className="w-32 h-1.5 mx-auto rounded-full bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)]"></div>
              <p className="text-base sm:text-lg mt-6">
                {t('realtime.upcomingEventsDescription')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.map((event) => (
                <Card key={event.id} className={`hover:shadow-2xl transition-all duration-300 ${theme === 'dark' ? 'bg-[rgb(26,26,26)]/80 border-[rgb(168,213,186)]' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-[rgb(168,213,186)]">
                        {event.icon}
                      </div>
                      <CardTitle className="text-xl">{t(event.titleKey)}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {t(event.descriptionKey)}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Parallax Section */}
          <section className="relative h-[50vh] w-full overflow-hidden mb-20 rounded-2xl">
            <div
              className="absolute inset-0 bg-cover bg-center bg-fixed"
              style={{ backgroundImage: "url('/images/parallax-image.webp')" }}
            />
            <div className="absolute inset-0 bg-black/70" />

            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center px-4">
                <h2
                  className="text-3xl sm:text-5xl lg:text-6xl font-black mb-6 text-white italic"
                  style={{ fontFamily: 'var(--font-rozha), serif' }}
                >
                  {t('parallax.title')}
                </h2>
                <p className="text-lg sm:text-xl lg:text-2xl text-white/90 font-light mb-8 italic">
                  {t('parallax.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                    <Link href="/reservations">
                      {t('parallax.cta')}
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                    <Link href="/pdfs/menus.pdf">
                      VIEW THE MENU
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Awards Section */}
          <section className="mb-20 text-center">
            <div className="mb-12">
              <h2
                className="text-4xl sm:text-5xl font-black mb-4"
                style={{ fontFamily: 'Rozha One, serif' }}
              >
                {t('awards.title')}
              </h2>
              <div className="w-32 h-1.5 mx-auto rounded-full bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)] mb-4"></div>
              <p className="text-lg">
                {t('awards.subtitle')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <a
                href="https://restaurantguru.com/East-and-West-Eatery-Brussels"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-105 transition-transform duration-300"
              >
                <svg
                  width="280"
                  height="280"
                  viewBox="0 0 280 280"
                  xmlns="http://www.w3.org/2000/svg"
                  className="rounded-lg shadow-lg"
                >
                  {/* Light background */}
                  <rect width="280" height="280" fill="#f5f5f0" rx="8"/>

                  {/* Outer red circle */}
                  <circle cx="140" cy="140" r="110" fill="none" stroke="#c62828" strokeWidth="8"/>

                  {/* Fork and knife icon at top */}
                  <g transform="translate(140, 50)">
                    {/* Fork - left */}
                    <rect x="-20" y="0" width="1.5" height="25" fill="#c62828"/>
                    <rect x="-23" y="0" width="1.5" height="10" fill="#c62828"/>
                    <rect x="-17" y="0" width="1.5" height="10" fill="#c62828"/>
                    {/* Knife - right */}
                    <rect x="10" y="0" width="2" height="25" fill="#c62828"/>
                    <path d="M 8 0 L 13 0 L 11 10 Z" fill="#c62828"/>
                  </g>

                  {/* Star icon with outline */}
                  <g transform="translate(140, 95)">
                    <path
                      d="M 0,-15 L 4,-3 L 17,-3 L 7,4 L 11,17 L 0,9 L -11,17 L -7,4 L -17,-3 L -4,-3 Z"
                      fill="none"
                      stroke="#c62828"
                      strokeWidth="2"
                    />
                  </g>

                  {/* Top text */}
                  <text x="140" y="125" textAnchor="middle" fontSize="11" fontWeight="400" fill="#333">
                    Restaurant Guru 2021
                  </text>

                  {/* Red banner background */}
                  <rect x="40" y="135" width="200" height="35" fill="#c62828"/>

                  {/* RECOMMENDED text */}
                  <text x="140" y="158" textAnchor="middle" fontSize="20" fontWeight="700" fill="white" letterSpacing="1">
                    RECOMMENDED
                  </text>

                  {/* Bottom text */}
                  <text x="140" y="195" textAnchor="middle" fontSize="13" fontWeight="600" fill="#333">
                    East @ West
                  </text>
                </svg>
              </a>

              <a href="https://restaurantguru.com/" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform duration-300">
                <Image
                  src={Guru1}
                  alt="Restaurant Guru Award 2023"
                  className="h-[280px] w-auto object-contain rounded-lg shadow-lg"
                />
              </a>

              <a href="https://restaurantguru.com/" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform duration-300">
                <Image
                  src={Guru2}
                  alt="Restaurant Guru Award 2024"
                  className="h-[280px] w-auto object-contain rounded-lg shadow-lg"
                />
              </a>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className={`py-20 rounded-2xl ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2
                  className="text-4xl sm:text-5xl font-black mb-4"
                  style={{ fontFamily: 'var(--font-rozha), serif' }}
                >
                  {t('contact.contactUs')}
                </h2>
                <div className="w-32 h-1.5 mx-auto rounded-full bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)]"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <Card className={`${theme === 'dark' ? 'bg-gray-900/80 border-gray-600' : ''}`}>
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-900 hover:bg-green-600 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{t('contact.phone')}</h3>
                        <a href="tel:+32465206024" className={`${theme === 'dark' ? 'text-white' : 'text-gray-600'} hover:text-[rgb(168,213,186)]`}>
                          {t('footer.phone')}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-900 hover:bg-green-600 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{t('contact.email')}</h3>
                        <a href="mailto:contact@eastatwest.com" className={`${theme === 'dark' ? 'text-white' : 'text-gray-600'} hover:text-[rgb(168,213,186)]`}>
                          {t('footer.email')}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-900 hover:bg-green-600 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{t('contact.address')}</h3>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-600'} whitespace-pre-line`}>
                          {t('footer.address')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-900 hover:bg-green-600 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{t('contact.openingHours')}</h3>
                        <div className={`${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>
                          <p>{t('contact.mondayFriday')}</p>
                          <p>{t('contact.saturday')}</p>
                          <p>{t('contact.sundayClosed')}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="relative h-[400px] lg:h-auto rounded-xl overflow-hidden">
                  <Image
                    src={Banner}
                    alt="East at West Restaurant"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-20 left-8 right-8 text-white text-center">
                    <h3 className="text-3xl sm:text-4xl font-bold mb-2 italic" style={{ fontFamily: 'Rozha One, serif' }}>
                      {t('contact.restaurantImageAlt')}
                    </h3>
                    <p className="text-lg italic" style={{ fontFamily: 'var(--font-rozha), serif' }}>
                      {t('contact.restaurantDescription')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
