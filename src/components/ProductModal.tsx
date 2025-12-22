'use client'

import React, { memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '../context/ThemeContext'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import { m, AnimatePresence } from 'framer-motion'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    name: string
    description: string
    price: string
    image: string
    category: string
    categorySlug: string
  }
}

function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { theme } = useTheme()
  const { t, i18n } = useTranslation('common')
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const { addItem, cart } = useCart()

  // Handle adding product to cart
  // For now, just redirect to takeaway page where user can add the product
  // This is simpler and more reliable than trying to fetch and match products
  const handleAddToCart = () => {
    router.push(`/takeaway?category=${product.categorySlug}`)
    onClose()
  }

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <m.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <m.div
            className={`relative max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button with X */}
            <m.button
              onClick={onClose}
              className={`absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-red-600 text-white'
                  : 'bg-white/90 hover:bg-red-500 text-gray-800 hover:text-white shadow-lg'
              }`}
              aria-label="Close modal"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </m.button>

            {/* Product Image */}
            <div className="relative h-64 sm:h-80 w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Price Badge */}
              <div className={`absolute top-4 left-4 px-4 py-2 rounded-full font-bold text-lg shadow-lg ${
                theme === 'dark'
                  ? 'bg-[rgb(168,213,186)] text-[rgb(26,26,26)]'
                  : 'bg-[rgb(168,213,186)] text-[rgb(26,26,26)]'
              }`}>
                {product.price}
              </div>
            </div>

            {/* Product Details */}
            <div className="p-6 sm:p-8">
              {/* Category Badge */}
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-[rgb(168,213,186)]'
                    : 'bg-gray-100 text-[rgb(168,213,186)]'
                }`}>
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-[rgb(26,26,26)]'
              }`}>
                {product.name}
              </h2>

              {/* Product Description */}
              <p className={`text-base sm:text-lg leading-relaxed mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-[rgb(26,26,26)]/70'
              }`}>
                {product.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold text-center transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    theme === 'dark'
                      ? 'shadow-[rgb(168,213,186)]/50 hover:shadow-[rgb(168,213,186)]/60'
                      : ''
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{
                    background: 'linear-gradient(to right, rgb(168,213,186), rgb(168,213,186))',
                    color: '#ffffff'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, rgb(26,26,26), rgb(26,26,26))'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, rgb(168,213,186), rgb(168,213,186))'
                  }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center" style={{ color: '#ffffff' }}>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5" style={{ color: '#ffffff' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span style={{ color: '#ffffff' }}>Adding...</span>
                    </span>
                  ) : (
                    <span style={{ color: '#ffffff' }}>{t('takeaway.addToCart')}</span>
                  )}
                </button>

                {/* View Full Menu Button */}
                <Link
                  href="/pdfs/full-menu.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold text-center transition-all duration-300 transform hover:scale-105 border-2 ${
                    theme === 'dark'
                      ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                      : 'border-gray-300 text-[rgb(26,26,26)] hover:bg-gray-50'
                  }`}
                  onClick={onClose}
                >
                  View Full Menu
                </Link>
              </div>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default memo(ProductModal)
