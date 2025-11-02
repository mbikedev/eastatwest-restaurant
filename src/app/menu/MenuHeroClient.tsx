'use client'

import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/ThemeContext'
import { motion } from 'framer-motion'

export default function MenuHeroClient() {
  const { t, i18n } = useTranslation('common')
  const { theme } = useTheme()

  // Get the appropriate menu PDF based on current language
  const getMenuPdf = () => {
    const language = i18n.language || 'en'

    if (language.startsWith('fr')) {
      return '/pdfs/menu_francais.pdf'
    } else if (language.startsWith('nl')) {
      return '/pdfs/menu_nederlands.pdf'
    } else {
      return '/pdfs/menu_english.pdf'
    }
  }

  const menuPdfUrl = getMenuPdf()

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
        <Image src="/images/banner.webp" alt={t('menu.heroAlt')} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-4xl w-full px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight ${theme === 'dark'
            ? 'bg-gradient-to-b from-gray-100 via-gray-300 to-gray-900 bg-clip-text text-transparent'
            : 'text-gray-400'}
`}>{t('menu.title')}</h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl opacity-90 text-white">{t('menu.subtitle')}</p>

          <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-4 sm:gap-6 w-full max-w-2xl mx-auto px-4">
            {/* Menu button with left arrow pointing right */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
              <motion.span
                className="text-3xl sm:text-4xl text-white font-bold flex-shrink-0"
                animate={{
                  x: [-8, 8, -8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                →
              </motion.span>
              <a
                href={menuPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('menu.buttons.menu')}
                className={`inline-block px-8 sm:px-10 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-lg focus:outline-none focus:ring-4 flex-shrink-0 ${theme === 'dark'
                  ? 'bg-gradient-to-b from-gray-100 via-gray-700 to-gray-900 text-[#1A1A1A] focus:ring-white/30 text-white'
                  : 'bg-gradient-to-b from-[#2A7B9B] via-[#1A703E] to-green-900 text-[#3F423A] focus:ring-white/30 text-white'}
                `}
              >
                {t('menu.buttons.menu')}
              </a>
              <motion.span
                className="text-3xl sm:text-4xl text-white font-bold flex-shrink-0"
                animate={{
                  x: [8, -8, 8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ←
              </motion.span>
            </div>

            {/* Menu Take-away Only button with arrows */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
              <motion.span
                className="text-3xl sm:text-4xl text-white font-bold flex-shrink-0"
                animate={{
                  x: [-8, 8, -8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                →
              </motion.span>
              <a
                href="/pdfs/take-away-only.pdf"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('menu.buttons.menuTakeawayOnly')}
                className={`inline-block px-8 sm:px-10 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-lg focus:outline-none focus:ring-4 flex-shrink-0 whitespace-nowrap ${theme === 'dark'
                  ? 'bg-gradient-to-b from-gray-100 via-gray-700 to-gray-900 text-[#1A1A1A] focus:ring-white/30 text-white'
                  : 'bg-gradient-to-b from-[#2A7B9B] via-[#1A703E] to-green-900 text-[#3F423A] focus:ring-white/30 text-white'}
                `}
              >
                {t('menu.buttons.menuTakeawayOnly')}
              </a>
              <motion.span
                className="text-3xl sm:text-4xl text-white font-bold flex-shrink-0"
                animate={{
                  x: [8, -8, 8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ←
              </motion.span>
            </div>
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


