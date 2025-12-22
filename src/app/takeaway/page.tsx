'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../context/ThemeContext'
import { MultilingualText } from '../../types/takeaway'
import { useCart } from '../../context/CartContext'
import { useLightbox } from '../../context/LightboxContext'
import { Product } from '../../types/takeaway'
// Use regular div elements instead of motion for initial load performance
// import { m, AnimatePresence } from 'framer-motion'

export default function TakeawayPage() {
  const { t, i18n } = useTranslation('common')
  const { theme } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  // Note: Language switching could be added here for product names/descriptions
  const { cart, addItem, removeItem, updateQuantity, isCartOpen, setIsCartOpen } = useCart()
  const { openLightbox } = useLightbox()

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Handle URL parameters for direct product linking
  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      setSelectedCategory(category)
    }
  }, [searchParams])

  // Fetch products dynamically per selected category
  useEffect(() => {
    const controller = new AbortController()

    const fetchByCategory = async () => {
      try {
        setLoading(true)
        setError(null)

        // Map Menu category IDs to Take Away category slugs used in DB
        const categoryMapping: { [key: string]: string } = {
          'setMenus': 'set-menus',
          'coldMezzes': 'cold-mezzes',
          'hotMezzes': 'hot-mezzes',
          'salads': 'salads',
          'lunchDishes': 'lunch-dishes',
          'sandwiches': 'sandwiches',
          'skewers': 'skewers',
          'desserts': 'desserts',
          'drinks': 'drinks'
        }

        let url = '/api/products'
        if (selectedCategory !== 'all') {
          const mapped = categoryMapping[selectedCategory] || selectedCategory
          url = `/api/products?category=${encodeURIComponent(mapped)}`
        }

        const response = await fetch(url, { signal: controller.signal })
        const result = await response.json()

        if (result.success) {
          let data: Product[] = result.data || []
          // Exclude sandwiches from "All" view (include set menus)
          if (selectedCategory === 'all') {
            data = data.filter((p: Product) => p.category !== 'sandwiches')
          }
          setFilteredProducts(data)
        } else {
          setError(result.error || 'Failed to load products')
        }
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          setError('Failed to load products')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchByCategory()
    return () => controller.abort()
  }, [selectedCategory])

  // Union of Menu and Take Away categories
  const categories = [
    { id: "setMenus", name: t("menu.categories.setMenus") },
    { id: "coldMezzes", name: t("menu.categories.coldMezzes") },
    { id: "hotMezzes", name: t("menu.categories.hotMezzes") },
    { id: "salads", name: t("menu.categories.salads") },
    { id: "lunchDishes", name: t("menu.categories.lunchDishes") },
    { id: "sandwiches", name: t("menu.categories.sandwiches") },
    { id: "desserts", name: t("menu.categories.desserts") },
    { id: "drinks", name: t("menu.categories.drinks") },
  ];

  // Get product name/description directly from DB in current language
  const getLocalizedText = (multilingualText: MultilingualText) => {
    const lang = (i18n.language || 'en') as keyof MultilingualText
    return multilingualText[lang] || multilingualText.en || multilingualText.fr || multilingualText.nl || ''
  }

  // Handle image click for lightbox
  const handleImageClick = (product: Product, allProducts: Product[]) => {
    // Create images array from all products that have images
    const productImages = allProducts
      .filter(p => p.image_url) // Only products with images
      .map(p => ({
        src: p.image_url,
        alt: getLocalizedText(p.name)
      }))
    
    // Find current image index
    const currentIndex = productImages.findIndex(img => img.src === product.image_url)
    
    openLightbox(
      product.image_url,
      getLocalizedText(product.name),
      productImages,
      currentIndex >= 0 ? currentIndex : 0
    )
  }

  if (loading) {
    return (
      <div className={`min-h-screen pt-16 flex items-center justify-center ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-[#F5F1EC] text-[#5C4300]'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f99747] mx-auto mb-4"></div>
          <p className="text-lg">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen pt-16 flex items-center justify-center ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-[#F5F1EC] text-[#5C4300]'
      }`}>
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#f99747] text-white rounded-lg hover:bg-[#bc906b] transition-colors"
          >
            {t('common.tryAgain')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen pt-16 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black text-white' : 'bg-[#F5F1EC] text-[#5C4300]'
    }`}>
      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${
              theme === 'dark' 
                ? 'text-white' 
                : 'bg-gradient-to-r from-[#f99747] via-[#bc906b] to-[#5C4300] bg-clip-text text-transparent'
            }`}
          >
            {t('takeaway.title')}
          </h1>
          <p 
            className={`text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-[#5C4300]/80'
            }`}
          >
            {t('takeaway.subtitle')}
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/80'}`}>
            <p className={`text-lg leading-relaxed text-center mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Order authentic Lebanese food for takeaway in Brussels and enjoy restaurant-quality meals in the comfort of your home. Our takeaway menu features all your favorite dishes, from fresh mezze platters and hearty main courses to delicious desserts, all prepared fresh to order.
            </p>
            <p className={`text-lg leading-relaxed text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Browse our online menu, select your items, and pick up your order at our Rue de la Bourse location. Every dish is carefully packaged to maintain freshness and flavor. Experience the taste of Lebanon wherever you are in Brussels.
            </p>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-9 gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-3 rounded-lg font-semibold transition-all duration-300 text-sm ${selectedCategory === category.id
                  ? theme === "dark"
                    ? "bg-[#A8D5BA] text-white shadow-lg shadow-[#A8D5BA]/30 border-2 border-[#A8D5BA]/50 scale-105"
                    : "!bg-[#A8D5BA] !text-[#1A1A1A] !shadow-2xl shadow-[#A8D5BA]/60 !border-2 border-[#A8D5BA] scale-105"
                  : theme === "dark"
                    ? "bg-white/10 text-white hover:bg-white/20 hover:scale-105 border-2 border-white/20 hover:border-white/40 shadow-md"
                    : "bg-white/90 text-[#1A1A1A] hover:bg-white hover:scale-105 border-2 border-[#A8D5BA]/40 hover:border-[#A8D5BA]/70 shadow-md"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Tablet and Mobile Layout - 3x3 Grid */}
          <div className="grid grid-cols-3 gap-3 lg:hidden">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-3 rounded-lg font-semibold transition-all duration-300 text-xs sm:text-sm ${selectedCategory === category.id
                  ? theme === "dark"
                    ? "bg-[#A8D5BA] text-white shadow-lg shadow-[#A8D5BA]/30 border-2 border-[#A8D5BA]/50 scale-105"
                    : "!bg-[#A8D5BA] !text-[#1A1A1A] !shadow-2xl shadow-[#A8D5BA]/60 !border-2 border-[#A8D5BA] scale-105"
                  : theme === "dark"
                    ? "bg-white/10 text-white hover:bg-white/20 hover:scale-105 border-2 border-white/20 hover:border-white/40 shadow-md"
                    : "bg-white/90 text-[#1A1A1A] hover:bg-white hover:scale-105 border-2 border-[#A8D5BA]/40 hover:border-[#A8D5BA]/70 shadow-md"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 gap-8">
          {/* Categories Filter removed for all devices */}

          {/* Products Grid */}
          <div className="w-full">
            <div className="flex justify-end items-center mb-6">
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative px-6 py-3 rounded-lg transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-[#f99747] hover:bg-[#bc906b] text-white border-2 border-white/30 shadow-lg shadow-white/20 hover:border-white/50'
                    : '!bg-[#1A1A1A] hover:!bg-[#5C4300] !text-white'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13l1.5 1.5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  <span>{t('takeaway.cart')}</span>
                  {cart.itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                      {cart.itemCount}
                    </span>
                  )}
                </div>
              </button>
            </div>

          <div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`group p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105 ${
                      theme === 'dark'
                        ? 'bg-gray-900/80 hover:bg-gray-800  border border-gray-700'
                        : 'bg-white hover:bg-white/80  border border-[#bc906b]/20 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {/* Only show image container if product has an image_url or is not a sandwich */}
                    {product.image_url && (
                      <div 
                        className="relative h-48 mb-4 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => handleImageClick(product, filteredProducts)}
                      >
                        <Image
                          src={product.image_url}
                          alt={getLocalizedText(product.name)}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/images/placeholder-food.webp'
                          }}
                        />
                        {/* Overlay to indicate clickable */}
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                          <svg className="w-6 h-6 text-white bg-black/50 rounded-full p-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold group-hover:text-[#f99747] transition-colors duration-300">
                        {getLocalizedText(product.name)}
                      </h3>
                      <span className="text-2xl font-bold text-[#f99747]">
                        €{product.price.toFixed(2)}
                      </span>
                    </div>
                    
                    <p className={`mb-4 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-[#5C4300]/70'
                    }`}>
                      {getLocalizedText(product.description)}
                    </p>
                    
                    <button
                      onClick={() => addItem(product)}
                      style={{
                        background: theme === 'dark'
                          ? 'linear-gradient(to right, #f99747, #bc906b)'
                          : 'linear-gradient(to right, #f99747, #bc906b)',
                        color: '#FFFFFF'
                      }}
                      className="w-full py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      {t('takeaway.addToCart')}
                    </button>
                  </div>
                ))}
              </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-gray-300' : 'text-[#5C4300]/70'
                }`}>
                  {t('takeaway.noProducts')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
        {isCartOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 "
            onClick={() => setIsCartOpen(false)}
          >
            <div
              className={`absolute right-0 top-0 h-full w-full max-w-md ${
                theme === 'dark' ? 'bg-black' : 'bg-white'
              } shadow-2xl overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                  }`}>{t('takeaway.cart')}</h3>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className={`p-2 rounded-lg ${
                      theme === 'dark'
                        ? 'hover:bg-gray-800 text-white'
                        : 'hover:bg-gray-100 text-[#1A1A1A]'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {cart.items.length === 0 ? (
                  <p className={`text-center py-8 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-[#5C4300]/70'
                  }`}>
                    {t('takeaway.emptyCart')}
                  </p>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.items.map((item) => (
                        <div key={item.product.id} className={`p-4 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center space-x-4">
                            {/* Only show image in cart if product has an image_url */}
                            {item.product.image_url && (
                              <div 
                                className="relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer"
                                onClick={() => handleImageClick(item.product, cart.items.map(cartItem => cartItem.product))}
                              >
                                <Image
                                  src={item.product.image_url}
                                  alt={getLocalizedText(item.product.name)}
                                  fill
                                  sizes="64px"
                                  className="object-cover hover:scale-110 transition-transform duration-300"
                                />
                                {/* Hover overlay for cart images */}
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                                  <svg className="w-3 h-3 text-white bg-black/50 rounded-full p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                  </svg>
                                </div>
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className={`font-semibold ${
                                theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                              }`}>{getLocalizedText(item.product.name)}</h4>
                              <p className={`font-bold ${
                                theme === 'dark' ? 'text-[#A8D5BA]' : 'text-[#16A34A]'
                              }`}>€{item.product.price.toFixed(2)}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  theme === 'dark'
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300 text-[#1A1A1A]'
                                }`}
                              >
                                -
                              </button>
                              <span className={`w-8 text-center font-semibold ${
                                theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                              }`}>{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  theme === 'dark'
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300 text-[#1A1A1A]'
                                }`}
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={`border-t pt-4 mb-6 ${
                      theme === 'dark' ? 'border-gray-700' : 'border-[#A8D5BA]/20'
                    }`}>
                      <div className="flex justify-between items-center text-xl font-bold">
                        <span className={theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'}>{t('takeaway.total')}</span>
                        <span className={theme === 'dark' ? 'text-[#A8D5BA]' : 'text-[#16A34A]'}>€{cart.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (cart.itemCount > 0) {
                          setIsCartOpen(false)
                          router.push('/takeaway/checkout')
                        } else {
                          alert(t('takeaway.emptyCart'))
                        }
                      }}
                      style={{
                        backgroundColor: theme === 'dark' ? '#A8D5BA' : '#16A34A',
                        color: '#FFFFFF'
                      }}
                      className="w-full py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-all duration-300"
                    >
                      {t('takeaway.checkout')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
