'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../context/ThemeContext'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getBlogPosts, getBlogTags } from '@/lib/blog'
import { formatBlogDate } from '@/lib/blog'
import type { Blog } from '@/types/blog'
import Head from 'next/head'

export default function BlogPage() {
  const { t, i18n } = useTranslation('common')
  const { theme } = useTheme()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8
      }
    }
  }

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Load blog posts when filters change
  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        // Only show loading screen on initial load
        if (isInitialLoad) {
          setLoading(true)
        } else {
          setIsSearching(true)
        }

        const params = {
          tags: selectedTag ? [selectedTag] : undefined,
          search: debouncedSearchTerm || undefined
        }
        const data = await getBlogPosts(params, i18n.language)
        console.log('📝 Setting blogs state:', data.length, 'posts')
        console.log('📝 Blog titles:', data.map(b => b.title))
        setBlogs(data)
        setError(null)
      } catch (err) {
        console.error('Error loading blog posts:', err)
        setError('Failed to load blog posts. Please try again later.')
      } finally {
        if (isInitialLoad) {
          setLoading(false)
          setIsInitialLoad(false)
        } else {
          setIsSearching(false)
        }
      }
    }

    loadBlogPosts()
  }, [selectedTag, debouncedSearchTerm, i18n.language, isInitialLoad])

  // Load tags when language changes
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await getBlogTags(i18n.language)
        setAvailableTags(tags)

        // Reset selected tag if it doesn't exist in the new language
        if (selectedTag && !tags.includes(selectedTag)) {
          setSelectedTag(null)
        }
      } catch (err) {
        console.error('Error loading tags:', err)
      }
    }

    loadTags()
  }, [i18n.language, selectedTag])

  const handleTagFilter = (tag: string | null) => {
    setSelectedTag(tag)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Search will be triggered by useEffect when searchTerm changes
  }

  const retryLoadPosts = () => {
    // Force reload by clearing and resetting the debounced search term
    setError(null)
    setDebouncedSearchTerm('')
    setTimeout(() => setDebouncedSearchTerm(searchTerm), 0)
  }

  // Get cover image for blog post with fallback based on slug
  const getBlogCoverImage = (blog: Blog): string => {
    console.log('🖼️ Getting cover image for:', blog.slug, 'Current cover_image_url:', blog.cover_image_url)

    // Assign unique images to each blog post to avoid duplication
    const slugImageMap: Record<string, string> = {
      // Vegetarian Restaurants Brussels (all languages)
      'best-vegetarian-restaurants-brussels-belgium': '/images/gallery/falafel.webp',
      'meilleurs-restaurants-vegetariens-bruxelles-belgique': '/images/gallery/falafel.webp',
      'beste-vegetarische-restaurants-brussel-belgie': '/images/gallery/falafel.webp',

      // Why Are Halal Food Restaurants So Well-liked? (all languages)
      'why-are-halal-food-restaurants-so-well-liked': '/images/gallery/kebbe.webp',
      'pourquoi-les-restaurants-halal-sont-ils-si-populaires': '/images/gallery/kebbe.webp',
      'waarom-zijn-halal-restaurants-zo-populair': '/images/gallery/kebbe.webp',

      // The Dos And Don'ts Of Middle Eastern Cuisine Restaurant Etiquette (all languages)
      'the-dos-and-donts-of-middle-eastern-cuisine-restaurant-etiquette': '/images/gallery/houmos.webp',
      'les-choses-a-faire-et-a-ne-pas-faire-de-letiquette-au-restaurant-de-cuisine-du-moyen-orient': '/images/gallery/houmos.webp',
      'de-dos-en-donts-van-midden-oosterse-keuken-restaurant-etiquette': '/images/gallery/houmos.webp',

      // Restaurant Etiquette (all languages)
      'middle-eastern-restaurant-etiquette-dos-donts': '/images/gallery/houmos.webp',
      'etiquette-restaurant-cuisine-moyen-orient': '/images/gallery/houmos.webp',
      'midden-oosterse-restaurant-etiquette-wel-niet': '/images/gallery/houmos.webp',

      // Mediterranean Restaurant Top 4 Features (all languages)
      'mediterranean-restaurant-top-4-features': '/images/gallery2/eastatwest-bruxelles.webp',
      'restaurant-mediterraneen-top-4-caracteristiques': '/images/gallery2/eastatwest-bruxelles.webp',
      'mediterraan-restaurant-top-4-kenmerken': '/images/gallery2/eastatwest-bruxelles.webp',

      // Fast Food Restaurants (all languages)
      'fast-food-restaurants-near-me-benefits': '/images/gallery/muhamara.webp',
      'restaurants-fast-food-pres-moi-avantages': '/images/gallery/muhamara.webp',
      'fastfood-restaurants-bij-mij-voordelen': '/images/gallery/muhamara.webp',

      // Vegetarian Restaurant Experience (all languages)
      'vegetarian-restaurant-healthy-tasty-experience': '/images/gallery/poulet-torator.webp',
      'restaurant-vegetarien-experience-saine-savoureuse': '/images/gallery/poulet-torator.webp',
      'vegetarisch-restaurant-gezonde-smakelijke-ervaring': '/images/gallery/poulet-torator.webp',

      // Mediterranean Restaurant Unforgettable Experience (all languages)
      'mediterranean-restaurant-unforgettable-experience': '/images/events-catering/plat-libanais-restaurant-libanais-event.webp',
      'restaurant-mediterraneen-experience-inoubliable': '/images/events-catering/plat-libanais-restaurant-libanais-event.webp',
      'mediterraans-restaurant-onvergetelijke-ervaring': '/images/events-catering/plat-libanais-restaurant-libanais-event.webp',

      // Mediterranean Cuisine History Benefits (all languages)
      'mediterranean-cuisine-restaurant-history-benefits': '/images/events-catering/plat-libanais-restaurant-libanais-bruxelles.webp',
      'restaurant-cuisine-mediterraneenne-histoire-bienfaits': '/images/events-catering/plat-libanais-restaurant-libanais-bruxelles.webp',

      // Middle Eastern Restaurant Guide (all languages)
      'middle-eastern-restaurant-comprehensive-guide': '/images/gallery2/mezze-libanais-restaurant-libanais.webp',
      'midden-oosters-restaurant-uitgebreide-gids': '/images/gallery2/mezze-libanais-restaurant-libanais.webp',

      // Vegetarian Restaurant Brussels - All You Need to Know (all languages)
      'vegetarian-restaurant-brussels-all-you-need-to-know': '/images/gallery/makdous.webp',
      'restaurant-vegetarien-bruxelles-tout-ce-que-vous-devez-savoir': '/images/gallery/makdous.webp',
      'vegetarisch-restaurant-brussel-alles-wat-u-moet-weten': '/images/gallery/makdous.webp',
    }

    const imagePath = slugImageMap[blog.slug] || '/images/gallery/iche.webp'
    console.log('🖼️ Selected unique image for', blog.slug, ':', imagePath)
    return imagePath
  }

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${
        theme === 'dark' ? 'bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#1A1A1A]' : 'bg-gradient-to-br from-[#F5F0E6] via-[#FFFFFF] to-[#F5F0E6]'
      }`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-4 border-4 border-t-transparent rounded-full animate-spin ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-[#A8D5BA]'
            }`}></div>
            <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Loading blog posts...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${
        theme === 'dark' ? 'bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#1A1A1A]' : 'bg-gradient-to-br from-[#F5F0E6] via-[#FFFFFF] to-[#F5F0E6]'
      }`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className={`text-center p-8 rounded-2xl ${
            theme === 'dark' ? 'bg-red-900/20 text-white' : 'bg-red-50 text-red-900'
          }`}>
            <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
            <p className="mb-6">{error}</p>
            <button
              onClick={retryLoadPosts}
              className={`px-6 py-3 text-white rounded-lg transition-colors duration-300 ${
                theme === 'dark' ? 'bg-[#1A1A1A] hover:bg-[#FFFFFF] hover:text-[#1A1A1A]' : 'bg-[#A8D5BA] hover:bg-[#1A1A1A]'
              }`}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const featuredPost = blogs.find(blog => blog.featured)
  const regularPosts = blogs.filter(blog => !blog.featured)

  console.log('🎯 Total blogs in state:', blogs.length)
  console.log('🎯 Featured post:', featuredPost?.title || 'None')
  console.log('🎯 Regular posts:', regularPosts.length, regularPosts.map(b => b.title))

  return (
    <>
      <Head>
        <title>Blog - East at West | Lebanese Restaurant Brussels</title>
        <meta name="description" content="Discover stories, recipes, and insights from East at West. Learn about Lebanese cuisine, hospitality, and our journey in Brussels." />
        <meta name="keywords" content="Lebanese cuisine, Brussels restaurant, Middle Eastern food, blog, recipes, culture" />
      </Head>

      <div className={`min-h-screen transition-colors duration-500 ${
        theme === 'dark' ? 'bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#1A1A1A]' : 'bg-gradient-to-br from-[#F5F0E6] via-[#FFFFFF] to-[#F5F0E6]'
      }`}>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/events-catering/plat-libanais-restaurant-libanais-bruxelles.webp"
              alt="East at West Blog"
              fill
              className="object-cover transform scale-105 transition-transform duration-[3s] hover:scale-110"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#A8D5BA]/20 to-[#A8D5BA]/20"></div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <motion.div
              className="text-center text-white max-w-4xl"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent">
                  {t('blog.title')}
                </span>
              </h1>
              
              <p className="text-xl font-light mb-8 max-w-2xl mx-auto">
                {t('blog.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`p-6 rounded-2xl  border ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10' 
              : 'bg-white/80 border-gray-200 shadow-lg'
          }`}>
            <div className="flex flex-col gap-6">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  {isSearching ? (
                    <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${
                      theme === 'dark' ? 'border-white/50' : 'border-gray-400'
                    }`}></div>
                  ) : (
                    <svg className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      theme === 'dark' ? 'text-white/50' : 'text-gray-400'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('blog.searchPlaceholder')}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-colors duration-300 ${
                      theme === 'dark'
                        ? 'bg-black/20 border-white/20 text-white placeholder-white/50'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </form>

            </div>
          </div>
        </section>

        {/* Blog Content */}
        <motion.section
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t('blog.noPostsFound')}
              </h2>
              <p className={`text-lg ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                {selectedTag || debouncedSearchTerm
                  ? t('blog.noPostsFoundDesc')
                  : t('blog.checkBackSoon')
                }
              </p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <motion.article
                  variants={itemVariants}
                  className={`mb-12 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:transform hover:scale-[1.02] ${
                    theme === 'dark' 
                      ? 'bg-white/5  border border-white/10 hover:bg-white/10' 
                      : 'bg-white border border-gray-100 hover:shadow-3xl'
                  }`}
                >
                  <Link href={`/blog/${featuredPost.slug}`}>
                    <div className="relative h-80 md:h-96">
                      <Image
                        src={getBlogCoverImage(featuredPost)}
                        alt={featuredPost.title}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                        priority
                        quality={75}
                      />
                      {/* Enhanced dark gradient overlay for better text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30"></div>

                      {/* Featured badge */}
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                        <span className="bg-[#A8D5BA] text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-lg backdrop-blur-sm">
                          ✨ {t('blog.featured')}
                        </span>
                      </div>

                      {/* Text content with enhanced background */}
                      <div className="absolute bottom-0 left-0 right-0">
                        {/* Additional dark overlay behind text for maximum readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>

                        <div className="relative p-4 sm:p-6 text-white">
                          {/* Meta information with better contrast */}
                          <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-3 text-xs sm:text-sm flex-wrap">
                            {featuredPost.author_name && (
                              <span className="flex items-center gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#A8D5BA] rounded-full"></div>
                                {featuredPost.author_name}
                              </span>
                            )}
                            {featuredPost.published_at && (
                              <span className="flex items-center gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#A8D5BA] rounded-full"></div>
                                {formatBlogDate(featuredPost.published_at)}
                              </span>
                            )}
                            {featuredPost.reading_time && (
                              <span className="flex items-center gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                                {featuredPost.reading_time} {t('blog.minRead')}
                              </span>
                            )}
                          </div>

                          {/* Title with text shadow for extra contrast */}
                          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 leading-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,0.9)' }}>
                            {featuredPost.title}
                          </h2>

                          {/* Excerpt with line clamp and text shadow */}
                          <p className="text-sm sm:text-base md:text-lg opacity-95 leading-relaxed line-clamp-2 sm:line-clamp-3" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                            {featuredPost.excerpt || t('blog.readMore')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              )}

              {/* Regular Blog Posts Grid */}
              {regularPosts.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((blog) => (
                    <motion.article
                      key={blog.id}
                      variants={itemVariants}
                      className={`rounded-2xl overflow-hidden transition-all duration-300 hover:transform hover:scale-105 ${
                        theme === 'dark' 
                          ? 'bg-white/5  border border-white/10 hover:bg-white/10' 
                          : 'bg-white shadow-lg border border-gray-100 hover:shadow-xl'
                      }`}
                    >
                      <Link href={`/blog/${blog.slug}`}>
                        <div className="relative h-44 sm:h-48">
                          <Image
                            src={getBlogCoverImage(blog)}
                            alt={blog.title}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            loading="lazy"
                            quality={70}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                              <span className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium capitalize">
                                {blog.tags[0]}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4 sm:p-6">
                          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 text-xs sm:text-sm flex-wrap">
                            {blog.published_at && (
                              <span className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                                {formatBlogDate(blog.published_at)}
                              </span>
                            )}
                            {blog.reading_time && (
                              <>
                                <span className={`${theme === 'dark' ? 'text-white/50' : 'text-gray-400'}`}>•</span>
                                <span className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                                  {blog.reading_time} {t('blog.minRead')}
                                </span>
                              </>
                            )}
                          </div>

                          <h3 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 leading-snug line-clamp-2 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {blog.title}
                          </h3>

                          <p className={`text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3 ${
                            theme === 'dark' ? 'text-white/80' : 'text-gray-600'
                          }`}>
                            {blog.excerpt || t('blog.readMore')}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            {blog.author_name && (
                              <span className={`text-sm font-medium ${
                                theme === 'dark' ? 'text-[#A8D5BA]' : 'text-[#A8D5BA]'
                              }`}>
                                {blog.author_name}
                              </span>
                            )}
                            <div className="text-[#A8D5BA] hover:text-[#A8D5BA] transition-colors duration-300">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.section>
      </div>
    </>
  )
}
