'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/ThemeContext'
import { m, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

// Lightbox component
const Lightbox = ({ image, isOpen, onClose, title, description }: {
  image: string
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <m.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <m.div
        className="relative max-w-4xl max-h-[90vh] mx-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <Image
            src={image}
            alt={title}
            width={800}
            height={600}
            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            quality={90}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200"
            aria-label="Close lightbox"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {(title || description) && (
          <div className="mt-4 p-4 bg-white/90 dark:bg-gray-800/90 rounded-lg ">
            {title && (
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-gray-700 dark:text-gray-300">
                {description}
              </p>
            )}
          </div>
        )}
      </m.div>
    </m.div>
  )
}

export default function GalleryPage() {
  const { t } = useTranslation('common')
  const { theme } = useTheme()
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{
    src: string
    title: string
    description: string
  } | null>(null)

  // All available images from the public/images directory - wrapped in useMemo
  const allImages = useMemo(() => [
    // Gallery images
    '/images/gallery/aish el saraya.webp',
    '/images/gallery/traditional-ice-cream.webp',
    '/images/gallery/falafel.webp',
    '/images/gallery/kebbe.webp',
    '/images/gallery/eggplant.jpg',
    '/images/gallery/houmos.webp',
    '/images/gallery/muhamara.webp',
    '/images/gallery/makdous.webp',
    '/images/gallery/iche.webp',
    '/images/gallery/poulet-torator.webp',
    '/images/gallery/nakanek.webp',
    
    // Cold mezzes
    '/images/cold-mezzes/houmos.webp',
    '/images/cold-mezzes/moutabal.webp',
    '/images/cold-mezzes/muhamara.webp',
    '/images/cold-mezzes/makdous.webp',
    '/images/cold-mezzes/iche.webp',
    '/images/cold-mezzes/poulet-torator.webp',
    '/images/cold-mezzes/warak-enab.webp',
    '/images/cold-mezzes/mousaka.webp',
    
    // Hot mezzes
    '/images/hot-mezzes/falafel-salad.webp',
    '/images/hot-mezzes/kebbe.webp',
    '/images/hot-mezzes/kebbe-vegan.webp',
    '/images/hot-mezzes/sujuk.webp',
    '/images/hot-mezzes/nakanek.webp',
    '/images/hot-mezzes/arayes-cheese.webp',
    '/images/hot-mezzes/batata-harra.webp',
    '/images/hot-mezzes/rkakat.webp',
    '/images/hot-mezzes/grilled-cheese.webp',
    '/images/hot-mezzes/foul-moudamas.webp',
    
    // Salads
    '/images/Salads/fattouche-vegan.webp',
    '/images/Salads/falafel-vegan-salad.webp',
    '/images/Salads/original-taboule.webp',
    
    // Lunch dishes
    '/images/lunch-dishes/alepo-mix.webp',
    '/images/lunch-dishes/falafel.webp',
    '/images/lunch-dishes/kebab-dish.webp',
    '/images/lunch-dishes/plat-vegan.webp',
    '/images/lunch-dishes/shish-taouk.webp',
    '/images/lunch-dishes/toshka-leban.webp',
    
    // Desserts
    '/images/desserts/aish-el-saraya.webp',
    '/images/desserts/traditional-ice-cream.webp',
    
    // Events and restaurant spaces
    '/images/gallery2/restaurant-eastatwest-brussel.webp',
    '/images/gallery2/eastatwest-bruxelles.webp',
    '/images/gallery2/restaurant-libanais.webp',
    '/images/gallery2/mezze-libanais-restaurant-libanais.webp',
    '/images/gallery2/eastatwest-traiteur.webp',
    '/images/gallery2/traiteur-eastatwest-brussel.webp',
    
    // Events catering
    '/images/events-catering/mezze-libanais-restaurant.webp',
    '/images/events-catering/plat-fattouche-libanais-restaurant.webp',
    '/images/events-catering/plat-libanais-restaurant-libanais-bruxelles.webp',
    '/images/events-catering/plat-libanais-restaurant-libanais-event.webp',
    '/images/events-catering/plat-libanais-restaurant-libanais.webp'
    
    
  ], [])

  // Prepare images without shuffling (to avoid hydration mismatch)
  const preparedImages = useMemo(() => {
    // Create a map to track unique dishes by their filename (not full path)
    const uniqueImages = new Map<string, string>()

    allImages.forEach(imagePath => {
      const filename = imagePath.split('/').pop() || ''
      // Only add if this filename hasn't been seen before
      if (!uniqueImages.has(filename)) {
        uniqueImages.set(filename, imagePath)
      }
    })

    // Convert to array
    const uniqueArray = Array.from(uniqueImages.values())

    // Priority dishes that should always appear
    const priorityDishes = [
      'fattouche-vegan.webp',
      'original-taboule.webp',
      'falafel.webp',
      'falafel-vegan-salad.webp',
      'houmos.webp',
      'kebbe.webp',
      'muhamara.webp',
      'makdous.webp',
      'nakanek.webp'
    ]

    // Separate priority and non-priority images
    const priorityImages: string[] = []
    const otherImages: string[] = []

    uniqueArray.forEach(imagePath => {
      const filename = imagePath.split('/').pop() || ''
      if (priorityDishes.includes(filename)) {
        priorityImages.push(imagePath)
      } else {
        otherImages.push(imagePath)
      }
    })

    // Return without shuffling to avoid hydration mismatch
    return { priorityImages, otherImages }
  }, [allImages])

  // Shuffle images on client side only to avoid hydration mismatch
  const [randomizedImages, setRandomizedImages] = useState<string[]>([])

  useEffect(() => {
    // Shuffle the non-priority images only on client side
    const shuffledOthers = [...preparedImages.otherImages].sort(() => Math.random() - 0.5)
    const combined = [...preparedImages.priorityImages, ...shuffledOthers]
    setRandomizedImages(combined.slice(0, 24))
  }, [preparedImages])

  // Generate titles and descriptions for images based on their path
  const getImageDetails = (imagePath: string) => {
    const filename = imagePath.split('/').pop()?.split('.')[0] || ''

    // Map specific image names to their accurate titles and descriptions
    const imageMap: Record<string, { title: string; description: string }> = {
      // Gallery images
      'aish el saraya': { title: 'Aish El Saraya', description: 'Traditional Lebanese palace bread dessert with cream layers' },
      'aish-el-saraya': { title: 'Aish El Saraya', description: 'Traditional Lebanese palace bread dessert with cream layers' },
      'traditional-ice-cream': { title: 'Lebanese Ice Cream', description: 'Authentic Lebanese ice cream with rose water and pistachios' },
      'falafel': { title: 'Falafel', description: 'Crispy chickpea fritters served fresh' },
      'kebbe': { title: 'Kebbe', description: 'Fried bulgur croquettes stuffed with minced meat and spices' },
      'eggplant': { title: 'Grilled Eggplant', description: 'Perfectly grilled eggplant with Lebanese seasoning' },
      'houmos': { title: 'Hummus', description: 'Creamy chickpea dip with tahini and olive oil' },
      'muhamara': { title: 'Muhammara', description: 'Spicy red pepper and walnut dip' },
      'makdous': { title: 'Makdous', description: 'Baby eggplants stuffed with walnuts and peppers' },
      'iche': { title: 'Itch', description: 'Bulgur salad with tomatoes and herbs' },
      'poulet-torator': { title: 'Chicken Tarator', description: 'Shredded chicken with tahini sauce' },
      'nakanek': { title: 'Nakanek', description: 'Lebanese spiced sausages' },

      // Cold mezzes
      'moutabal': { title: 'Moutabal', description: 'Smoky grilled eggplant with tahini' },
      'warak-enab': { title: 'Warak Enab', description: 'Stuffed vine leaves with rice and herbs' },
      'mousaka': { title: 'Mousaka', description: 'Cold eggplant in tomato sauce' },

      // Hot mezzes
      'falafel-salad': { title: 'Falafel Salad', description: 'Fresh falafel served over mixed greens' },
      'kebbe-vegan': { title: 'Vegan Kebbe', description: 'Plant-based version of traditional kebbe' },
      'sujuk': { title: 'Sujuk', description: 'Spicy Lebanese sausage' },
      'arayes-cheese': { title: 'Arayes with Cheese', description: 'Grilled pita stuffed with cheese and herbs' },
      'batata-harra': { title: 'Batata Harra', description: 'Spicy fried potatoes with cilantro' },
      'rkakat': { title: 'Rkakat', description: 'Crispy cheese rolls' },
      'grilled-cheese': { title: 'Lebanese Grilled Cheese', description: 'Traditional grilled cheese with herbs' },
      'foul-moudamas': { title: 'Foul Moudamas', description: 'Fava beans with lemon and garlic' },

      // Salads
      'fattoush': { title: 'Fattoush', description: 'Mixed salad with crispy pita bread' },
      'fattouche-vegan': { title: 'Fattoush', description: 'Mixed salad with crispy pita bread' },
      'taboule': { title: 'Tabbouleh', description: 'Fresh parsley salad with bulgur and tomatoes' },
      'original-taboule': { title: 'Tabbouleh', description: 'Fresh parsley salad with bulgur and tomatoes' },
      'falafel-vegan-salad': { title: 'Falafel Salad', description: 'Fresh falafel served over mixed greens' },

      // Lunch dishes
      'alepo-mix': { title: 'Aleppo Mixed Grill', description: 'Assorted grilled meats from Aleppo' },
      'kebab-dish': { title: 'Kebab Platter', description: 'Grilled kebab with rice and vegetables' },
      'plat-vegan': { title: 'Vegan Platter', description: 'Plant-based Lebanese specialties' },
      'shish-taouk': { title: 'Shish Taouk', description: 'Grilled marinated chicken skewers' },
      'toshka-leban': { title: 'Toshka Leban', description: 'Grilled meat with yogurt sauce' },

      // Restaurant spaces
      'restaurant-eastatwest-brussel': { title: 'East@West Brussels', description: 'Our beautiful restaurant interior' },
      'eastatwest-bruxelles': { title: 'East@West Dining Room', description: 'Elegant dining space in Brussels' },
      'restaurant-libanais': { title: 'Lebanese Restaurant Ambiance', description: 'Authentic Lebanese dining atmosphere' },
      'mezze-libanais-restaurant-libanais': { title: 'Mezze Display', description: 'Traditional mezze presentation' },
      'eastatwest-traiteur': { title: 'Catering Service', description: 'Professional catering setup' },
      'traiteur-eastatwest-brussel': { title: 'Brussels Catering', description: 'Catering service in Brussels' },

      // Events catering
      'mezze-libanais-restaurant': { title: 'Event Mezze Spread', description: 'Mezze platter for special occasions' },
      'plat-fattouche-libanais-restaurant': { title: 'Fattoush for Events', description: 'Fresh fattoush salad for catering' },
      'plat-libanais-restaurant-libanais-bruxelles': { title: 'Lebanese Catering Brussels', description: 'Authentic Lebanese dishes for events' },
      'plat-libanais-restaurant-libanais-event': { title: 'Event Lebanese Platter', description: 'Special event Lebanese cuisine' },
      'plat-libanais-restaurant-libanais': { title: 'Lebanese Event Cuisine', description: 'Traditional Lebanese catering' },

      // Other
      'banner': { title: 'East@West Restaurant', description: 'Welcome to our Lebanese restaurant' },
      'about-us': { title: 'Our Story', description: 'Learn about East@West heritage' },
      'hanna': { title: 'Chef Hanna', description: 'Our master chef and culinary artist' }
    }

    const details = imageMap[filename]
    if (details) {
      return details
    }

    // Fallback based on path structure
    if (imagePath.includes('cold-mezzes')) {
      return { title: 'Cold Mezze', description: 'Traditional Lebanese cold appetizer' }
    } else if (imagePath.includes('hot-mezzes')) {
      return { title: 'Hot Mezze', description: 'Warm Lebanese appetizer' }
    } else if (imagePath.includes('Salads')) {
      return { title: 'Lebanese Salad', description: 'Fresh Lebanese salad' }
    } else if (imagePath.includes('lunch-dishes')) {
      return { title: 'Lunch Dish', description: 'Lebanese lunch specialty' }
    } else if (imagePath.includes('desserts')) {
      return { title: 'Lebanese Dessert', description: 'Traditional Lebanese sweet' }
    } else if (imagePath.includes('events-catering')) {
      return { title: 'Catering Service', description: 'Professional event catering' }
    } else if (imagePath.includes('gallery2')) {
      return { title: 'Restaurant Space', description: 'East@West dining environment' }
    }

    return { title: 'Lebanese Cuisine', description: 'Authentic Lebanese dish' }
  }

  const handleImageClick = (image: string) => {
    const details = getImageDetails(image)
    setSelectedImage({
      src: image,
      title: details.title,
      description: details.description
    })
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    setSelectedImage(null)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black' : 'bg-gray-50'
    }`}>
      {/* Hero Section */}
      <div className={`relative py-20 px-4 sm:px-6 lg:px-8 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-black via-gray-900 to-black' 
          : 'bg-gradient-to-br from-orange-50 via-white to-orange-50'
      }`}>
        <div className="max-w-7xl mx-auto text-center">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-4">🍴</div>
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} style={{fontFamily: 'Times New Roman, serif'}}>
              <span
                className={`font-black ${theme === 'dark' ? 'text-white' : 'text-transparent bg-clip-text'}`}
                style={theme === 'dark' ? {} : { backgroundColor: 'rgb(1, 1, 1)' }}
              >
                {t('gallery.title')}
              </span>
            </h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-6"></div>
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>
              {t('gallery.description')}
            </p>
          </m.div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <m.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {randomizedImages.map((image, index) => {
              const details = getImageDetails(image)
              
              return (
                <m.div
                  key={image}
                  className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${
                    theme === 'dark' 
                      ? 'bg-gray-900 hover:bg-gray-800' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={() => handleImageClick(image)}
                  whileHover={{ y: -8 }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={image}
                      alt={details.description}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      quality={65}
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Zoom icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="p-3 bg-white/90 dark:bg-gray-800/90 rounded-full ">
                        <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Caption overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="font-semibold text-sm mb-1 drop-shadow-lg">
                        {details.title}
                      </h3>
                      <p className="text-xs text-gray-200 drop-shadow-lg line-clamp-2">
                        {details.description}
                      </p>
                    </div>
                  </div>
                </m.div>
              )
            })}
          </m.div>
          
          {/* Refresh button */}
          <m.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              style={{
                backgroundColor: theme === 'dark' ? '#16A34A' : '#16A34A',
                color: '#FFFFFF'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1'
              }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Shuffle Gallery
            </button>
          </m.div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className={`py-8 px-4 sm:px-6 lg:px-8`}>
        <div className={`max-w-7xl mx-auto p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <h3 className={`text-2xl font-bold text-center mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Explore More
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <Link href="/menu" className={`text-center p-4 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-white'
            }`}>
              <div className="text-3xl mb-2">📖</div>
              <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Our Menu</div>
            </Link>
            <Link href="/blog" className={`text-center p-4 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-white'
            }`}>
              <div className="text-3xl mb-2">📰</div>
              <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Blog</div>
            </Link>
            <Link href="/events-catering" className={`text-center p-4 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-white'
            }`}>
              <div className="text-3xl mb-2">🎉</div>
              <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Events</div>
            </Link>
            <Link href="/contact" className={`text-center p-4 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-white'
            }`}>
              <div className="text-3xl mb-2">📞</div>
              <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Contact</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Back to Home Link */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 text-center">
        <Link
          href="/"
          className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-gray-600 text-white hover:text-white hover:bg-gray-800'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span style={{ color: 'rgba(0, 0, 0, 1)' }}>Back to Home</span>
        </Link>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && selectedImage && (
          <Lightbox
            image={selectedImage.src}
            title={selectedImage.title}
            description={selectedImage.description}
            isOpen={isLightboxOpen}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
