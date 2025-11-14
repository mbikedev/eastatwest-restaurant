'use client'

import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import { safeSetItem } from '../utils/storage'
import Image from 'next/image'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const { theme } = useTheme()

  const languages = [
    { code: 'en', label: 'EN', flag: 'US' },
    { code: 'fr', label: 'FR', flag: 'FR' },
    { code: 'nl', label: 'NL', flag: 'NL' },
  ]

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode)
    safeSetItem('language', langCode)
  }

  return (
    <div className="flex items-center space-x-1">
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => handleLanguageChange(language.code)}
          className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
            i18n.language === language.code
              ? theme === 'dark'
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-[#1A1A1A] text-white'
              : theme === 'dark'
              ? 'text-white/80 hover:text-white hover:bg-white/10'
              : 'text-white/80 hover:text-white hover:bg-black/10'
          }`}
          aria-label={`Switch to ${language.label}`}
        >
          <Image
            src={`https://flagcdn.com/16x12/${language.flag.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/32x24/${language.flag.toLowerCase()}.png 2x,
                     https://flagcdn.com/48x36/${language.flag.toLowerCase()}.png 3x`}
            width={16}
            height={12}
            alt={`${language.label} flag`}
            className="inline-block"
          />
          <span className="text-xs font-medium">{language.label}</span>
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher
