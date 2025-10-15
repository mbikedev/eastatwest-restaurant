'use client'

import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/ThemeContext'

export default function MenuHeroClient() {
  const { t } = useTranslation('common')
  const { theme } = useTheme()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'EastAtWest',
    url: '/menu',
    servesCuisine: ['Mediterranean', 'Middle Eastern', 'Lebanese'],
    hasMenu: '/menu',
  }

  return (
    <main className={theme === 'dark' ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#1A1A1A]'}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[75vh] flex items-center justify-center overflow-hidden">
        <img
          src="/images/banner.webp"
          alt={t('menu.heroAlt')}
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-4xl w-full px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight ${theme === 'dark'
            ? 'bg-gradient-to-b from-gray-100 via-gray-300 to-gray-900 bg-clip-text text-transparent'
            : 'text-gray-400'}
`}>{t('menu.title')}</h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl opacity-90 text-white">{t('menu.subtitle')}</p>

          {/* Notification Banner */}
          <div className="mt-6 sm:mt-8 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500/90 to-teal-500/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
            <svg className="w-5 h-5 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="text-white font-semibold text-sm sm:text-base">{t('menu.notification')}</span>
          </div>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href="/pdfs/menus.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('menu.buttons.menu')}
              className="inline-block px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-xl focus:outline-none focus:ring-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white focus:ring-emerald-500/50"
            >
              {t('menu.buttons.menu')}
            </a>

            <a
              href="/pdfs/take-away-only.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('menu.buttons.menuTakeawayOnly')}
              className="inline-block px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-xl focus:outline-none focus:ring-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white focus:ring-blue-500/50"
            >
              {t('menu.buttons.menuTakeawayOnly')}
            </a>
          </div>
        </div>
      </section>

      <section className={`py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-[#111] text-white/90' : 'bg-[#f9f7f5] text-[#1A1A1A]'}`}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-base sm:text-lg md:text-xl leading-relaxed">{t('menu.description')}</p>
        </div>
      </section>

      <section id="menu-list" className="py-8 sm:py-12" />
    </main>
  )
}


