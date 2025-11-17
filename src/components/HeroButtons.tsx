'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function HeroButtons() {
  const { t, i18n } = useTranslation('common')
  const [menuPdfUrl, setMenuPdfUrl] = useState('/pdfs/eastatwest_menu_en.pdf')
  const [takeawayPdfUrl, setTakeawayPdfUrl] = useState('/pdfs/menu_takeaway_only_english.pdf')
  const [menuDownloadName, setMenuDownloadName] = useState('east-at-west-menu-english.pdf')
  const [takeawayDownloadName, setTakeawayDownloadName] = useState('east-at-west-takeaway-menu-english.pdf')

  // Update menu PDF URLs when language changes
  useEffect(() => {
    const language = i18n.language || 'en'

    if (language.startsWith('fr')) {
      setMenuPdfUrl('/pdfs/eastatwest_menu_fr.pdf')
      setTakeawayPdfUrl('/pdfs/menu_takeaway_only_french.pdf')
      setMenuDownloadName('east-at-west-menu-french.pdf')
      setTakeawayDownloadName('east-at-west-takeaway-menu-french.pdf')
    } else if (language.startsWith('nl')) {
      setMenuPdfUrl('/pdfs/eastatwest_menu_nl.pdf')
      setTakeawayPdfUrl('/pdfs/menu_takeaway_only_dutch.pdf')
      setMenuDownloadName('east-at-west-menu-dutch.pdf')
      setTakeawayDownloadName('east-at-west-takeaway-menu-dutch.pdf')
    } else {
      setMenuPdfUrl('/pdfs/eastatwest_menu_en.pdf')
      setTakeawayPdfUrl('/pdfs/menu_takeaway_only_english.pdf')
      setMenuDownloadName('east-at-west-menu-english.pdf')
      setTakeawayDownloadName('east-at-west-takeaway-menu-english.pdf')
    }
  }, [i18n.language])

  return (
    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mt-4">
      {/* Primary CTA - Reserve Table */}
      <Link
        href="/reservations"
        className="inline-flex items-center justify-center gap-2 text-base px-6 py-3 font-bold shadow-2xl transition-all duration-300 border-2 rounded-md"
        style={{
          background: 'linear-gradient(to right, rgb(168,213,186), rgb(140,193,166))',
          color: 'rgb(26,26,26)',
          borderColor: 'rgba(255,255,255,0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(to right, rgb(120,173,146), rgb(100,153,126))'
          e.currentTarget.style.color = 'white'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
          e.currentTarget.style.boxShadow = '0 0 30px rgba(168,213,186,0.8), 0 20px 25px -5px rgb(0 0 0 / 0.1)'
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(to right, rgb(168,213,186), rgb(140,193,166))'
          e.currentTarget.style.color = 'rgb(26,26,26)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {t('hero.cta')}
        <ChevronRight className="ml-2 h-5 w-5" />
      </Link>

      {/* Secondary CTA - View Menu */}
      <a
        href={menuPdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 text-base px-6 py-3 border-2 font-semibold shadow-xl transition-all duration-300 rounded-md"
        style={{
          background: 'rgba(255,255,255,0.95)',
          color: 'rgb(26,26,26)',
          borderColor: 'rgb(168,213,186)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgb(168,213,186)'
          e.currentTarget.style.color = 'white'
          e.currentTarget.style.borderColor = 'white'
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.95)'
          e.currentTarget.style.color = 'rgb(26,26,26)'
          e.currentTarget.style.borderColor = 'rgb(168,213,186)'
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {t('hero.viewMenu')}
      </a>

      {/* Tertiary CTA - Take Away */}
      <a
        href={takeawayPdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 text-base px-6 py-3 border-2 font-semibold shadow-xl transition-all duration-300 rounded-md"
        style={{
          background: 'rgba(26,26,26,0.8)',
          color: 'white',
          borderColor: 'rgba(255,255,255,0.8)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgb(50,50,50)'
          e.currentTarget.style.color = 'rgb(168,213,186)'
          e.currentTarget.style.borderColor = 'rgb(168,213,186)'
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(26,26,26,0.8)'
          e.currentTarget.style.color = 'white'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {t('hero.takeAwayOnly')}
      </a>

      {/* Tertiary CTA - Gallery */}
      <Link
        href="/gallery"
        className="inline-flex items-center justify-center gap-2 text-base px-6 py-3 border-2 font-semibold shadow-xl transition-all duration-300 rounded-md"
        style={{
          background: 'linear-gradient(to right, rgba(37,99,235,0.9), rgba(79,70,229,0.9))',
          color: 'white',
          borderColor: 'rgba(96,165,250,0.5)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(to right, rgb(29,78,216), rgb(67,56,202))'
          e.currentTarget.style.borderColor = 'rgb(191,219,254)'
          e.currentTarget.style.boxShadow = '0 0 25px rgba(59,130,246,0.7), 0 20px 25px -5px rgb(0 0 0 / 0.1)'
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(to right, rgba(37,99,235,0.9), rgba(79,70,229,0.9))'
          e.currentTarget.style.borderColor = 'rgba(96,165,250,0.5)'
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {t('hero.viewGallery')}
      </Link>
    </div>
  )
}
