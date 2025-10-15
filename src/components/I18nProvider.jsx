'use client'

import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import initI18next from '../lib/i18n'

const I18nProvider = ({ children }) => {
  const [i18nInstance, setI18nInstance] = useState(null)

  useEffect(() => {
    const initI18n = async () => {
      const lang = typeof window !== 'undefined'
        ? localStorage.getItem('language') || 'en'
        : 'en'
      const instance = await initI18next(lang)
      setI18nInstance(instance)

      // Listen to language changes
      const handleLanguageChange = (lng) => {
        console.log('Language changed to:', lng)
      }
      instance.on('languageChanged', handleLanguageChange)

      return () => {
        instance.off('languageChanged', handleLanguageChange)
      }
    }
    initI18n()
  }, [])

  if (!i18nInstance) {
    return <div>Loading...</div>
  }

  return (
    <I18nextProvider i18n={i18nInstance}>
      {children}
    </I18nextProvider>
  )
}

export default I18nProvider 