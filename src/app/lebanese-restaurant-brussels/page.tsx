'use client'

import { useTranslation } from 'react-i18next'
import { useTheme } from '../../context/ThemeContext'
import { useLanguage } from '../../context/LanguageContext'
import { m } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import FAQSection from '@/components/FAQSection'
import Head from 'next/head'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function LebaneseRestaurantBrusselsPage() {
  const { t } = useTranslation('common')
  const { theme } = useTheme()
  const { changeLanguage } = useLanguage()
  const searchParams = useSearchParams()

  // Handle URL-based language switching
  useEffect(() => {
    const lng = searchParams.get('lng')
    if (lng && (lng === 'en' || lng === 'fr' || lng === 'nl')) {
      changeLanguage(lng)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]) // Only depend on searchParams, not changeLanguage

  // SEO-optimized FAQs for Lebanese Restaurant Brussels
  const faqs = [
    {
      question: t('lebaneseRestaurantBrussels.faq.questions.bestRestaurant.question'),
      answer: t('lebaneseRestaurantBrussels.faq.questions.bestRestaurant.answer')
    },
    {
      question: t('lebaneseRestaurantBrussels.faq.questions.location.question'),
      answer: t('lebaneseRestaurantBrussels.faq.questions.location.answer')
    },
    {
      question: t('lebaneseRestaurantBrussels.faq.questions.halal.question'),
      answer: t('lebaneseRestaurantBrussels.faq.questions.halal.answer')
    },
    {
      question: t('lebaneseRestaurantBrussels.faq.questions.openingHours.question'),
      answer: t('lebaneseRestaurantBrussels.faq.questions.openingHours.answer')
    },
    {
      question: t('lebaneseRestaurantBrussels.faq.questions.vegetarian.question'),
      answer: t('lebaneseRestaurantBrussels.faq.questions.vegetarian.answer')
    },
    {
      question: t('lebaneseRestaurantBrussels.faq.questions.reservation.question'),
      answer: t('lebaneseRestaurantBrussels.faq.questions.reservation.answer')
    },
    {
      question: t('lebaneseRestaurantBrussels.faq.questions.catering.question'),
      answer: t('lebaneseRestaurantBrussels.faq.questions.catering.answer')
    },
    {
      question: t('lebaneseRestaurantBrussels.faq.questions.popularDishes.question'),
      answer: t('lebaneseRestaurantBrussels.faq.questions.popularDishes.answer')
    },
    {
      question: t('lebaneseRestaurantBrussels.faq.questions.familyFriendly.question'),
      answer: t('lebaneseRestaurantBrussels.faq.questions.familyFriendly.answer')
    },
    {
      question: t('lebaneseRestaurantBrussels.faq.questions.takeaway.question'),
      answer: t('lebaneseRestaurantBrussels.faq.questions.takeaway.answer')
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  }

  // Structured Data for Local Business
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "East At West - Lebanese Restaurant Brussels",
    "description": "Authentic Lebanese restaurant in Brussels serving traditional mezze, shawarma, falafel, and halal dishes. Located in the heart of Brussels city center.",
    "url": "https://eastatwest.com/lebanese-restaurant-brussels",
    "image": "https://eastatwest.com/images/banner.webp",
    "logo": "https://eastatwest.com/android-chrome-512x512.png",
    "telephone": "+32-465-20-60-24",
    "email": "infos.east.west@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Bld de l'Empereur 26",
      "addressLocality": "Brussels",
      "addressRegion": "Brussels-Capital",
      "postalCode": "1000",
      "addressCountry": "BE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "50.8476",
      "longitude": "4.3572"
    },
    "servesCuisine": ["Lebanese", "Mediterranean", "Middle Eastern", "Halal"],
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "12:00",
        "closes": "14:30"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "18:00",
        "closes": "22:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "18:00",
        "closes": "22:00"
      }
    ],
    "acceptsReservations": true,
    "menu": "https://eastatwest.com/menu",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
    "currenciesAccepted": "EUR"
  }

  return (
    <>
      <Head>
        <title>Lebanese Restaurant Brussels | East At West - Authentic Lebanese Cuisine</title>
        <meta
          name="description"
          content="Best Lebanese restaurant in Brussels ⭐ Authentic halal mezze, shawarma, falafel & more. Located at Bld de l'Empereur 26. Dine-in, takeaway & catering. Book now!"
        />
        <meta
          name="keywords"
          content="Lebanese restaurant Brussels, halal restaurant Brussels, mezze Brussels, shawarma Brussels, falafel Brussels, Middle Eastern food Brussels, Lebanese catering Brussels, authentic Lebanese cuisine, vegetarian restaurant Brussels, vegan Lebanese food"
        />
        <link rel="canonical" href="https://eastatwest.com/lebanese-restaurant-brussels" />

        {/* Open Graph */}
        <meta property="og:title" content="Lebanese Restaurant Brussels | East At West - Authentic Lebanese Cuisine" />
        <meta property="og:description" content="Best Lebanese restaurant in Brussels. Authentic halal mezze, shawarma, falafel & more. Dine-in, takeaway & catering available." />
        <meta property="og:url" content="https://eastatwest.com/lebanese-restaurant-brussels" />
        <meta property="og:type" content="restaurant" />
        <meta property="og:image" content="https://eastatwest.com/images/banner.webp" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lebanese Restaurant Brussels | East At West" />
        <meta name="twitter:description" content="Best Lebanese restaurant in Brussels. Authentic halal cuisine, mezze, shawarma & more." />
        <meta name="twitter:image" content="https://eastatwest.com/images/banner.webp" />

        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </Head>

      <div className={`min-h-screen pt-16 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#1A1A1A] text-white' : 'bg-white text-black'
      }`}>

        {/* Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <Image
            src="/images/banner.webp"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            quality={75}
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <m.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="mb-8"
            >
              <div className="text-8xl mb-6">🇱🇧</div>
            </m.div>

            <m.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 text-white drop-shadow-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              {t('lebaneseRestaurantBrussels.hero.title')}
            </m.h1>

            <m.p
              className="text-2xl sm:text-3xl max-w-4xl mx-auto font-light leading-relaxed text-white drop-shadow-lg mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              {t('lebaneseRestaurantBrussels.hero.subtitle')}
            </m.p>

            <m.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              <Link href="/reservations">
                <button className="bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl">
                  {t('lebaneseRestaurantBrussels.hero.bookTable')}
                </button>
              </Link>
              <Link href="/menu">
                <button className="border-3 border-white bg-white/10 text-white hover:bg-white hover:text-black px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl">
                  {t('lebaneseRestaurantBrussels.hero.viewMenu')}
                </button>
              </Link>
            </m.div>
          </div>
        </section>

        {/* Why Choose East At West */}
        <m.section
          className={`py-20 px-4 sm:px-8 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#1A1A1A] via-[#A8D5BA]/10 to-[#1A1A1A]'
              : 'bg-gradient-to-br from-[#F5F0E6] via-[#A8D5BA]/20 to-[#F5F0E6]'
          }`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <m.div className="text-center mb-16" variants={itemVariants}>
              <h2 className="text-4xl sm:text-5xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] bg-clip-text text-transparent">
                  {t('lebaneseRestaurantBrussels.whyChoose.title')}
                </span>
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] mx-auto rounded-full"></div>
            </m.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  emoji: "🥙",
                  titleKey: "lebaneseRestaurantBrussels.whyChoose.authentic.title",
                  descKey: "lebaneseRestaurantBrussels.whyChoose.authentic.description"
                },
                {
                  emoji: "🥩",
                  titleKey: "lebaneseRestaurantBrussels.whyChoose.halal.title",
                  descKey: "lebaneseRestaurantBrussels.whyChoose.halal.description"
                },
                {
                  emoji: "🌱",
                  titleKey: "lebaneseRestaurantBrussels.whyChoose.vegan.title",
                  descKey: "lebaneseRestaurantBrussels.whyChoose.vegan.description"
                },
                {
                  emoji: "📍",
                  titleKey: "lebaneseRestaurantBrussels.whyChoose.location.title",
                  descKey: "lebaneseRestaurantBrussels.whyChoose.location.description"
                },
                {
                  emoji: "🎉",
                  titleKey: "lebaneseRestaurantBrussels.whyChoose.catering.title",
                  descKey: "lebaneseRestaurantBrussels.whyChoose.catering.description"
                },
                {
                  emoji: "⭐",
                  titleKey: "lebaneseRestaurantBrussels.whyChoose.award.title",
                  descKey: "lebaneseRestaurantBrussels.whyChoose.award.description"
                }
              ].map((feature, index) => (
                <m.div
                  key={index}
                  variants={itemVariants}
                  className={`p-8 rounded-3xl ${
                    theme === 'dark'
                      ? 'bg-[#2A2A2A] border border-[#A8D5BA]/20'
                      : 'bg-white border border-gray-200'
                  } shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
                >
                  <div className="text-6xl mb-4 text-center">{feature.emoji}</div>
                  <h3 className={`text-2xl font-bold mb-4 text-center ${
                    theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                  }`}>
                    {t(feature.titleKey)}
                  </h3>
                  <p className={`text-center leading-relaxed ${
                    theme === 'dark' ? 'text-white/80' : 'text-gray-700'
                  }`}>
                    {t(feature.descKey)}
                  </p>
                </m.div>
              ))}
            </div>
          </div>
        </m.section>

        {/* Signature Dishes */}
        <m.section
          className={`py-20 px-4 sm:px-8 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#1A1A1A]/90 to-orange-200'
              : 'bg-gradient-to-br from-gray-100 to-gray-300'
          }`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <m.div className="text-center mb-16" variants={itemVariants}>
              <div className="text-6xl mb-6">🍽️</div>
              <h2 className={`text-4xl sm:text-5xl font-black mb-6 ${
                theme === 'dark' ? 'text-[#A8D5BA]' : 'text-[#A8D5BA]'
              }`}>
                {t('lebaneseRestaurantBrussels.dishes.title')}
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] mx-auto rounded-full mb-6"></div>
              <p className={`text-lg max-w-3xl mx-auto ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                {t('lebaneseRestaurantBrussels.dishes.subtitle')}
              </p>
            </m.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {[
                {
                  titleKey: "lebaneseRestaurantBrussels.dishes.mezze.title",
                  descKey: "lebaneseRestaurantBrussels.dishes.mezze.description",
                  keywordsKey: "lebaneseRestaurantBrussels.dishes.mezze.keywords"
                },
                {
                  titleKey: "lebaneseRestaurantBrussels.dishes.shawarma.title",
                  descKey: "lebaneseRestaurantBrussels.dishes.shawarma.description",
                  keywordsKey: "lebaneseRestaurantBrussels.dishes.shawarma.keywords"
                },
                {
                  titleKey: "lebaneseRestaurantBrussels.dishes.kibbeh.title",
                  descKey: "lebaneseRestaurantBrussels.dishes.kibbeh.description",
                  keywordsKey: "lebaneseRestaurantBrussels.dishes.kibbeh.keywords"
                },
                {
                  titleKey: "lebaneseRestaurantBrussels.dishes.kafta.title",
                  descKey: "lebaneseRestaurantBrussels.dishes.kafta.description",
                  keywordsKey: "lebaneseRestaurantBrussels.dishes.kafta.keywords"
                }
              ].map((dish, index) => (
                <m.div
                  key={index}
                  variants={itemVariants}
                  className={`p-8 rounded-3xl ${
                    theme === 'dark'
                      ? 'bg-[#2A2A2A] border border-[#A8D5BA]/20'
                      : 'bg-white border border-gray-200'
                  } shadow-xl`}
                >
                  <h3 className={`text-2xl font-bold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                  }`}>
                    {t(dish.titleKey)}
                  </h3>
                  <p className={`leading-relaxed mb-4 ${
                    theme === 'dark' ? 'text-white/80' : 'text-gray-700'
                  }`}>
                    {t(dish.descKey)}
                  </p>
                  <div className={`text-sm font-semibold ${
                    theme === 'dark' ? 'text-[#A8D5BA]' : 'text-[#A8D5BA]'
                  }`}>
                    {t(dish.keywordsKey)}
                  </div>
                </m.div>
              ))}
            </div>

            <m.div className="text-center mt-12" variants={itemVariants}>
              <Link href="/menu">
                <button className="bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl">
                  {t('lebaneseRestaurantBrussels.dishes.viewFullMenu')}
                </button>
              </Link>
            </m.div>
          </div>
        </m.section>

        {/* Location & Hours */}
        <m.section
          className={`py-20 px-4 sm:px-8 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#1A1A1A] via-[#A8D5BA]/10 to-[#1A1A1A]'
              : 'bg-gradient-to-br from-[#F5F0E6] via-[#A8D5BA]/20 to-[#F5F0E6]'
          }`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <m.div variants={itemVariants}>
                <div className="text-6xl mb-6">📍</div>
                <h2 className={`text-4xl font-black mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                }`}>
                  {t('lebaneseRestaurantBrussels.location.title')}
                </h2>
                <div className="w-32 h-1.5 bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] rounded-full mb-8"></div>

                <div className="space-y-6">
                  <div>
                    <h3 className={`text-xl font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                    }`}>{t('lebaneseRestaurantBrussels.location.address')}</h3>
                    <p className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>
                      {t('lebaneseRestaurantBrussels.location.addressLine1')}<br />
                      {t('lebaneseRestaurantBrussels.location.addressLine2')}<br />
                      {t('lebaneseRestaurantBrussels.location.addressLine3')}
                    </p>
                  </div>

                  <div>
                    <h3 className={`text-xl font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                    }`}>{t('lebaneseRestaurantBrussels.location.contactTitle')}</h3>
                    <p className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>
                      {t('lebaneseRestaurantBrussels.location.phone')}: <a href="tel:+32465206024" className="text-[#A8D5BA] hover:underline">+32 465 20 60 24</a><br />
                      {t('lebaneseRestaurantBrussels.location.email')}: <a href="mailto:infos.east.west@gmail.com" className="text-[#A8D5BA] hover:underline">infos.east.west@gmail.com</a>
                    </p>
                  </div>

                  <div>
                    <h3 className={`text-xl font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                    }`}>{t('lebaneseRestaurantBrussels.location.transport')}</h3>
                    <p className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>
                      {t('lebaneseRestaurantBrussels.location.transportDetails')}
                    </p>
                  </div>
                </div>
              </m.div>

              <m.div variants={itemVariants}>
                <div className="text-6xl mb-6">⏰</div>
                <h2 className={`text-4xl font-black mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                }`}>
                  {t('lebaneseRestaurantBrussels.hours.title')}
                </h2>
                <div className="w-32 h-1.5 bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] rounded-full mb-8"></div>

                <div className={`p-8 rounded-3xl ${
                  theme === 'dark'
                    ? 'bg-[#2A2A2A] border border-[#A8D5BA]/20'
                    : 'bg-white border border-gray-200'
                } shadow-xl`}>
                  <div className="space-y-6">
                    {/* Monday - Friday */}
                    <div className="pb-4 border-b border-[#A8D5BA]/20">
                      <div className="mb-3">
                        <span className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'}`}>
                          {t('lebaneseRestaurantBrussels.hours.mondayToFriday')}
                        </span>
                      </div>
                      <div className="space-y-2 ml-4">
                        <div className="flex justify-between items-center">
                          <span className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>
                            🍽️ Lunch
                          </span>
                          <span className={`font-medium ${theme === 'dark' ? 'text-[#A8D5BA]' : 'text-[#A8D5BA]'}`}>
                            {t('lebaneseRestaurantBrussels.hours.lunchHours')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>
                            🍽️ Dinner
                          </span>
                          <span className={`font-medium ${theme === 'dark' ? 'text-[#A8D5BA]' : 'text-[#A8D5BA]'}`}>
                            {t('lebaneseRestaurantBrussels.hours.dinnerHours')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Saturday */}
                    <div className="pb-4 border-b border-[#A8D5BA]/20">
                      <div className="mb-3">
                        <span className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'}`}>
                          🎉 {t('lebaneseRestaurantBrussels.hours.saturday')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="flex justify-between items-center">
                          <span className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>
                            {t('lebaneseRestaurantBrussels.hours.saturdayHours')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sunday - Closed */}
                    <div className="pb-4 border-b border-[#A8D5BA]/20">
                      <div className="flex justify-between items-center">
                        <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'}`}>
                          {t('lebaneseRestaurantBrussels.hours.sunday')}
                        </span>
                        <span className={`font-medium ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                          {t('lebaneseRestaurantBrussels.hours.closed')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-[#A8D5BA]/20">
                    <Link href="/reservations">
                      <button className="w-full bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] text-white py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
                        {t('lebaneseRestaurantBrussels.hours.makeReservation')}
                      </button>
                    </Link>
                  </div>
                </div>
              </m.div>
            </div>
          </div>
        </m.section>

        {/* FAQ Section */}
        <FAQSection
          faqs={faqs}
          title={t('lebaneseRestaurantBrussels.faq.title')}
          subtitle={t('lebaneseRestaurantBrussels.faq.subtitle')}
        />

        {/* CTA Section */}
        <m.section
          className="relative py-20 px-4 sm:px-8 bg-black text-white"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <m.div variants={itemVariants}>
              <div className="text-6xl mb-6">🎯</div>
              <h2 className="text-4xl sm:text-5xl font-black mb-8">
                <span className="bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] bg-clip-text text-transparent">
                  {t('lebaneseRestaurantBrussels.cta.title')}
                </span>
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] mx-auto rounded-full mb-8"></div>
              <p className="text-xl mb-12 max-w-3xl mx-auto">
                {t('lebaneseRestaurantBrussels.cta.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                <Link href="/reservations">
                  <button className="bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl">
                    {t('lebaneseRestaurantBrussels.cta.reserveTable')}
                  </button>
                </Link>
                <Link href="/takeaway">
                  <button className="border-3 border-white bg-white/10 text-white hover:bg-white hover:text-black px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl">
                    {t('lebaneseRestaurantBrussels.cta.orderTakeaway')}
                  </button>
                </Link>
              </div>
            </m.div>
          </div>
        </m.section>
      </div>
    </>
  )
}
