'use client'

import { m } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useTranslation } from 'react-i18next'
import { useState, useEffect, memo } from 'react'

interface Testimonial {
  name: string
  rating: number
  review: string
  date: string
  location?: string
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
  title?: string
  showSchema?: boolean
}

function TestimonialsSection({
  testimonials,
  title,
  showSchema = true
}: TestimonialsSectionProps) {
  const { theme } = useTheme()
  const { t } = useTranslation('common')
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  // Review schema markup for SEO
  const reviewSchema = showSchema ? {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "East At West",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1),
      "reviewCount": testimonials.length,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": testimonials.map(testimonial => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": testimonial.name
      },
      "datePublished": testimonial.date,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": testimonial.rating,
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": testimonial.review
    }))
  } : null

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
        style={{ fontSize: '1.5rem' }}
      >
        ★
      </span>
    ))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <>
      {showSchema && reviewSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
      )}

      <m.section
        className={`py-20 px-4 sm:px-8 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-[#1A1A1A] via-[#A8D5BA]/10 to-[#1A1A1A]'
            : 'bg-gradient-to-br from-[#F5F0E6] via-[#A8D5BA]/20 to-[#F5F0E6]'
        }`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <m.div className="text-center mb-16" variants={itemVariants}>
            <div className="text-6xl mb-6">⭐</div>
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
            }`}>
              {title || t('testimonials.title')}
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] mx-auto rounded-full mb-6"></div>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-white/80' : 'text-gray-600'
            }`}>
              {t('testimonials.subtitle')}
            </p>
          </m.div>

          {/* Featured Testimonial (Carousel) */}
          <m.div
            className="max-w-4xl mx-auto mb-12"
            variants={itemVariants}
          >
            <div className={`relative p-10 rounded-3xl ${
              theme === 'dark'
                ? 'bg-[#2A2A2A] border border-[#A8D5BA]/20'
                : 'bg-white border border-gray-200'
            } shadow-2xl`}>
              <div className="text-6xl mb-6 text-center opacity-20">&ldquo;</div>

              <m.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-center mb-6">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>

                <p className={`text-xl leading-relaxed mb-8 text-center italic ${
                  theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                }`}>
                  {testimonials[currentIndex].review}
                </p>

                <div className="text-center">
                  <p className={`font-bold text-lg ${
                    theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                  }`}>
                    {testimonials[currentIndex].name}
                  </p>
                  {testimonials[currentIndex].location && (
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-white/60' : 'text-gray-500'
                    }`}>
                      {testimonials[currentIndex].location}
                    </p>
                  )}
                </div>
              </m.div>

              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-[#A8D5BA] w-8'
                        : theme === 'dark'
                        ? 'bg-white/20'
                        : 'bg-gray-300'
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </m.div>

          {/* Grid of All Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <m.div
                key={index}
                variants={itemVariants}
                className={`p-6 rounded-2xl ${
                  theme === 'dark'
                    ? 'bg-[#2A2A2A] border border-[#A8D5BA]/20'
                    : 'bg-white border border-gray-200'
                } shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
              >
                <div className="flex justify-start mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                <p className={`leading-relaxed mb-6 ${
                  theme === 'dark' ? 'text-white/80' : 'text-gray-700'
                }`}>
                  &ldquo;{testimonial.review}&rdquo;
                </p>

                <div className="border-t border-[#A8D5BA]/20 pt-4">
                  <p className={`font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                  }`}>
                    {testimonial.name}
                  </p>
                  {testimonial.location && (
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-white/60' : 'text-gray-500'
                    }`}>
                      {testimonial.location}
                    </p>
                  )}
                  <p className={`text-xs mt-1 ${
                    theme === 'dark' ? 'text-white/40' : 'text-gray-400'
                  }`}>
                    {new Date(testimonial.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </m.div>
            ))}
          </div>

          {/* CTA to leave a review */}
          <m.div
            className="text-center mt-12"
            variants={itemVariants}
          >
            <p className={`text-lg mb-6 ${
              theme === 'dark' ? 'text-white/80' : 'text-gray-700'
            }`}>
              {t('testimonials.cta.text')}
            </p>
            <a
              href="https://www.google.com/search?q=east+at+west+brussels"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {t('testimonials.cta.button')}
            </a>
          </m.div>
        </div>
      </m.section>
    </>
  )
}
export default memo(TestimonialsSection)
