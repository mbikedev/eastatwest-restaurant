'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { useTranslation } from 'react-i18next'
import { m } from 'framer-motion'

export default function NotFound() {
  const { theme } = useTheme()
  const { i18n } = useTranslation('common')
  const [menuPdfUrl, setMenuPdfUrl] = useState('/pdfs/eastatwest_menu_en.pdf')
  const [menuDownloadName, setMenuDownloadName] = useState('east-at-west-menu-english.pdf')

  // Update menu PDF URL when language changes
  useEffect(() => {
    const language = i18n.language || 'en'

    if (language.startsWith('fr')) {
      setMenuPdfUrl('/pdfs/eastatwest_menu_fr.pdf')
      setMenuDownloadName('east-at-west-menu-french.pdf')
    } else if (language.startsWith('nl')) {
      setMenuPdfUrl('/pdfs/eastatwest_menu_nl.pdf')
      setMenuDownloadName('east-at-west-menu-dutch.pdf')
    } else {
      setMenuPdfUrl('/pdfs/eastatwest_menu_en.pdf')
      setMenuDownloadName('east-at-west-menu-english.pdf')
    }
  }, [i18n.language])

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-[#5C4300] via-[#4a3700] to-[#5C4300]' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto"
      >
        <m.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
          className="text-8xl mb-6"
        >
          🍽️
        </m.div>
        
        <m.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-6xl font-black mb-4 bg-gradient-to-r from-[#f99747] to-[#bc906b] bg-clip-text text-transparent`}
        >
          404
        </m.h1>
        
        <m.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`text-2xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Page Not Found
        </m.h2>
        
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`text-lg mb-8 ${
            theme === 'dark' ? 'text-white/70' : 'text-gray-600'
          }`}
        >
          The page you&apos;re looking for seems to have wandered off like a lost mezze plate.
        </m.p>
        
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <Link href="/">
            <m.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-[#f99747] to-[#bc906b] text-white font-bold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🏠 Back to Home
            </m.button>
          </Link>
          
          <a href={menuPdfUrl} target="_blank" rel="noopener noreferrer">
            <m.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full font-semibold py-3 px-8 rounded-2xl border-2 transition-all duration-300 ${
                theme === 'dark'
                  ? 'border-white/20 text-white hover:bg-white/10'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              🍽️ View Menu
            </m.button>
          </a>
        </m.div>
      </m.div>
    </div>
  )
} 