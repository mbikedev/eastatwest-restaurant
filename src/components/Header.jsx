'use client'

import { useState, useEffect, memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { m, AnimatePresence } from 'framer-motion'

const Header = () => {
  const { t } = useTranslation('common')
  const { theme } = useTheme()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Detect reduced motion preference for better performance
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const isMobile = window.innerWidth < 768
    setPrefersReducedMotion(mediaQuery.matches || isMobile)

    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches || window.innerWidth < 768)
    }

    mediaQuery.addEventListener('change', handleChange)
    window.addEventListener('resize', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
      window.removeEventListener('resize', handleChange)
    }
  }, [])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <m.header
      className={`fixed w-full top-0 z-50 transition-all duration-700 ${scrolled
          ? theme === 'dark'
            ? 'bg-gray-900/50 backdrop-blur-md border-b border-white/10 shadow-lg'
            : 'bg-gray-900/50 backdrop-blur-md border-b border-gray-900/10 shadow-lg'
          : theme === 'dark'
            ? 'bg-gray-900 backdrop-blur-sm'
            : 'bg-gray-900/75 backdrop-blur-sm'
        }`}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 relative">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-12 sm:h-13 md:h-14' : 'h-14 sm:h-15 md:h-16'}`}>
          {/* Logo */}
          <m.div
            whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
          >
            <Link href="/" className="flex items-center space-x-2 group">
              <m.div
                className="relative"
                initial={prefersReducedMotion ? {} : {}}
                animate={{}}
                transition={{ duration: 0 }}
              >
                <Image
                  src="/images/east-logo.webp"
                  alt="East at West Logo"
                  width={60}
                  height={60}
                  sizes="(max-width: 640px) 64px, (max-width: 768px) 72px, 80px"
                  priority
                  className={`transition-all duration-500 group-hover:scale-110 ${scrolled ? 'h-12 sm:h-14 md:h-16' : 'h-16 sm:h-18 md:h-20'
                    } w-auto ${theme === 'dark'
                      ? 'drop-shadow-[0_0_8px_rgba(251,146,60,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(251,146,60,0.6)]'
                      : 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)] group-hover:drop-shadow-[0_4px_16px_rgba(251,146,60,0.3)]'
                    }`}
                />
                <m.div
                  className={`absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 ${theme === 'dark'
                      ? 'bg-gradient-to-r from-[rgb(26,26,26)]/20 via-[rgb(26,26,26)]/20 to-[rgb(26,26,26)]/20'
                      : 'bg-gradient-to-r from-[rgb(168,213,186)]/20 via-[rgb(168,213,186)]/20 to-[rgb(168,213,186)]/20'
                    }`}
                  transition={{ duration: 0.3 }}
                />
              </m.div>
              <div
                className={`relative ml-3 sm:ml-4 md:ml-5 h-auto italic hidden md:block ${theme === 'dark' ? 'text-[rgb(255,255,255)]' : 'text-[rgb(168,213,186)]'
                  }`}
                style={{ font: 'italic 20px sm:text-24px md:text-28px lg:text-30px Rozha One, serif' }}
              >
                <p>
                  <em></em>East At West
                </p>
              </div>
            </Link>
          </m.div>



          {/* Modern Responsive Navigation */}
          <m.nav
            className="flex items-center"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-0.5 sm:space-x-1 md:space-x-1.5 lg:space-x-2">
              {[
                { href: '/menu', label: t('nav.menu') },
                { href: '/lebanese-restaurant-brussels', label: t('nav.lebanese') },
                { href: '/reservations', label: t('nav.reservations') },
                { href: '/takeaway', label: t('nav.takeaway') },
                { href: '/blog', label: t('nav.blog') },
                { href: '/events-catering', label: t('nav.events') },
                { href: '/about', label: t('nav.about') }
              ].map((item, index) => {
                const isActive = pathname === item.href
                return (
                  <m.div
                    key={item.href}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      target={item.href.endsWith('.pdf') ? '_blank' : undefined}
                      rel={item.href.endsWith('.pdf') ? 'noopener noreferrer' : undefined}
                      className={`relative px-2 sm:px-2.5 md:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-sm lg:text-base font-medium transition-all duration-300 group backdrop-blur-sm border whitespace-nowrap ${
                        isActive
                          ? theme === 'dark'
                            ? 'text-white bg-green-600/30 border-green-500/50'
                            : 'text-white bg-green-600/40 border-green-500/60'
                          : theme === 'dark'
                            ? 'text-white/90 hover:text-white hover:bg-white/10 border-transparent hover:border-white/20'
                            : 'text-white/90 hover:text-white hover:bg-black/10 border-transparent hover:border-black/20'
                      }`}
                    >
                      <span className="relative z-10">{item.label}</span>
                      {!isActive && (
                        <>
                          <m.div
                            className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 ${theme === 'dark'
                                ? 'bg-gradient-to-r from-[rgb(26,26,26)]/20 to-[rgb(26,26,26)]/20'
                                : 'bg-gradient-to-r from-[rgb(168,213,186)]/20 to-[rgb(168,213,186)]/20'
                              }`}
                            transition={{ duration: 0.3 }}
                          />
                          <m.div
                            className={`absolute bottom-0 left-1/2 w-0 h-0.5 group-hover:w-full group-hover:left-0 transition-all duration-300 ${theme === 'dark'
                                ? 'bg-gradient-to-r from-[rgb(26,26,26)] to-[rgb(26,26,26)]'
                                : 'bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)]'
                              }`}
                          />
                        </>
                      )}
                      {isActive && (
                        <m.div
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-400 to-green-600"
                          layoutId="desktop-underline"
                        />
                      )}
                    </Link>
                  </m.div>
                )
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <m.button
                onClick={toggleMobileMenu}
                className={`relative p-3 rounded-xl transition-all duration-300 group backdrop-blur-sm ${theme === 'dark'
                    ? 'text-white hover:text-[rgb(255,255,255)] hover:bg-[rgb(26,26,26)]/10'
                    : 'text-white hover:text-[rgb(168,213,186)] hover:bg-black/10'
                  }`}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-6 h-6 relative flex flex-col justify-center items-center">
                  <m.span
                    className="block h-0.5 w-6 rounded-full bg-white transition-all duration-300"
                    animate={isMobileMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
                  />
                  <m.span
                    className="block h-0.5 w-6 rounded-full bg-white transition-all duration-300"
                    animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  />
                  <m.span
                    className="block h-0.5 w-6 rounded-full bg-white transition-all duration-300"
                    animate={isMobileMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
                  />
                </div>
              </m.button>
            </div>

            {/* Controls */}
            <m.div
              className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-2.5 lg:space-x-3 ml-2 sm:ml-2.5 md:ml-3 lg:ml-4 pl-2 sm:pl-2.5 md:pl-3 lg:pl-4 border-l border-white/20"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <LanguageSwitcher />
              <ThemeToggle />
            </m.div>
          </m.nav>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <m.div
              className={`absolute top-full left-0 right-0 lg:hidden z-40 ${theme === 'dark'
                  ? 'bg-black/95 border-b border-white/10'
                  : 'bg-white/95 border-b border-black/10'
                } backdrop-blur-xl shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-4 sm:px-6 py-3 sm:py-4 pb-6 space-y-1 sm:space-y-2">
                {[
                  { href: '/menu', label: t('nav.menu'), icon: '🍽️' },
                  { href: '/lebanese-restaurant-brussels', label: t('nav.lebanese'), icon: '🇱🇧' },
                  { href: '/reservations', label: t('nav.reservations'), icon: '📅' },
                  { href: '/takeaway', label: t('nav.takeaway'), icon: '🥡' },
                  { href: '/blog', label: t('nav.blog'), icon: '📝' },
                  { href: '/events-catering', label: t('nav.events'), icon: '🎉' },
                  { href: '/about', label: t('nav.about'), icon: '👥' }
                ].map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <m.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        target={item.href.endsWith('.pdf') ? '_blank' : undefined}
                        rel={item.href.endsWith('.pdf') ? 'noopener noreferrer' : undefined}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`relative flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 group border ${
                          isActive
                            ? theme === 'dark'
                              ? 'text-white bg-green-600/30 border-green-500/50'
                              : 'text-gray-900 bg-green-600/20 border-green-500/40'
                            : theme === 'dark'
                              ? 'text-white hover:bg-white/10 border-transparent hover:border-white/20'
                              : 'text-gray-900 hover:bg-black/10 border-transparent hover:border-black/20'
                        }`}
                      >
                        <span className="text-lg sm:text-xl">{item.icon}</span>
                        <span className="font-bold text-sm sm:text-base">{item.label}</span>
                        <m.div
                          className={`ml-auto transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </m.div>
                        {isActive && (
                          <m.div
                            className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-b-lg"
                            layoutId="mobile-underline"
                          />
                        )}
                      </Link>
                    </m.div>
                  )
                })}

                {/* Mobile Controls */}
                <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-white/70' : 'text-gray-700'
                      }`}>
                      Settings
                    </span>
                    <LanguageSwitcher />
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>

      </div>
    </m.header>
  )
}

export default memo(Header)
