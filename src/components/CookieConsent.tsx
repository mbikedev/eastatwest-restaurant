'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useTranslation } from 'react-i18next'

export default function CookieConsent() {
  const { t } = useTranslation()
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  })
  const { currentLanguage } = useLanguage()
  const [initialLanguage, setInitialLanguage] = useState<string | null>(null)

  useEffect(() => {
    // Check if user has already given consent
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
      const consent = localStorage.getItem('cookieConsent')
      if (consent) {
        // Load saved preferences
        try {
          const saved = JSON.parse(consent)
          setPreferences(saved)
        } catch (e) {
          // Error parsing cookie consent
        }
        return
      }
    }

    // Store initial language
    if (!initialLanguage) {
      setInitialLanguage(currentLanguage)
    }

    // Show banner after 3 seconds OR when language changes
    const timer = setTimeout(() => {
      setShowBanner(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [currentLanguage, initialLanguage])

  // If user changes language before timer expires, show banner immediately
  useEffect(() => {
    if (initialLanguage && currentLanguage !== initialLanguage) {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
        const consent = localStorage.getItem('cookieConsent')
        if (!consent) {
          setShowBanner(true)
        }
      }
    }
  }, [currentLanguage, initialLanguage])

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    setPreferences(allAccepted)
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
      localStorage.setItem('cookieConsent', JSON.stringify(allAccepted))
    }
    setShowBanner(false)
    setShowPreferences(false)
  }

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
    }
    setPreferences(necessaryOnly)
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
      localStorage.setItem('cookieConsent', JSON.stringify(necessaryOnly))
    }
    setShowBanner(false)
    setShowPreferences(false)
  }

  const savePreferences = () => {
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
      localStorage.setItem('cookieConsent', JSON.stringify(preferences))
    }
    setShowBanner(false)
    setShowPreferences(false)
  }

  const togglePreference = (key: 'analytics' | 'marketing') => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  if (!showBanner) return null

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998
        }}
      />

      {/* Cookie Banner */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderTop: '4px solid #d97706',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem' }}>
            {!showPreferences ? (
              // Main Banner
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#111827' }}>
                    {t('cookieConsent.title')}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#4B5563', maxWidth: '48rem' }}>
                    {t('cookieConsent.description')}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setShowPreferences(true)}
                    style={{
                      padding: '0.625rem 1.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#374151',
                      backgroundColor: '#F3F4F6',
                      borderRadius: '0.5rem',
                      border: '1px solid #D1D5DB',
                      cursor: 'pointer'
                    }}
                  >
                    {t('cookieConsent.customize')}
                  </button>
                  <button
                    onClick={acceptNecessary}
                    style={{
                      padding: '0.625rem 1.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#374151',
                      backgroundColor: '#F3F4F6',
                      borderRadius: '0.5rem',
                      border: '1px solid #D1D5DB',
                      cursor: 'pointer'
                    }}
                  >
                    {t('cookieConsent.necessaryOnly')}
                  </button>
                  <button
                    onClick={acceptAll}
                    style={{
                      padding: '0.625rem 1.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'white',
                      backgroundColor: '#d97706',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {t('cookieConsent.acceptAll')}
                  </button>
                </div>
              </div>
            ) : (
              // Preferences Panel
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>
                    {t('cookieConsent.preferencesTitle')}
                  </h3>
                  <button
                    onClick={() => setShowPreferences(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6B7280',
                      padding: '0.25rem'
                    }}
                    aria-label="Close preferences"
                  >
                    <X style={{ width: '1.25rem', height: '1.25rem' }} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#4B5563' }}>
                    {t('cookieConsent.preferencesDescription')}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={acceptNecessary}
                    style={{
                      flex: 1,
                      padding: '0.625rem 1.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#374151',
                      backgroundColor: '#F3F4F6',
                      borderRadius: '0.5rem',
                      border: '1px solid #D1D5DB',
                      cursor: 'pointer',
                      minWidth: '120px'
                    }}
                  >
                    {t('cookieConsent.rejectAll')}
                  </button>
                  <button
                    onClick={savePreferences}
                    style={{
                      flex: 1,
                      padding: '0.625rem 1.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'white',
                      backgroundColor: '#d97706',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      minWidth: '120px'
                    }}
                  >
                    {t('cookieConsent.savePreferences')}
                  </button>
                  <button
                    onClick={acceptAll}
                    style={{
                      flex: 1,
                      padding: '0.625rem 1.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'white',
                      backgroundColor: '#16a34a',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      minWidth: '120px'
                    }}
                  >
                    {t('cookieConsent.acceptAll')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}
