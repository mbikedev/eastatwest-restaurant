'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, notFound, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTheme } from '../../../context/ThemeContext'
import { useTranslation } from 'react-i18next'
import { getBlogPostBySlug, getRelatedBlogPosts, formatBlogDate, detectLanguageFromSlug, getSlugForLanguage } from '@/lib/blog'
import type { Blog } from '@/types/blog'
import CommentSection from '../../../components/CommentSection'
import Head from 'next/head'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()
  const { theme } = useTheme()
  const { t, i18n } = useTranslation('common')

  const [blog, setBlog] = useState<Blog | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)

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

  // Get cover image for blog post with fallback based on slug
  const getBlogCoverImage = (blog: Blog): string => {
    // List of invalid/broken image paths to override
    const brokenImagePaths = [
      '/images/gallery2/cuisine-mediterraneenne.webp',
      '/images/gallery2/restaurant-libanais-bruxelles.webp',
      '/images/gallery2/midden-oosters-restaurant.webp',
      '/images/gallery2/middle-eastern-restaurant.webp',
      'cuisine-mediterraneenne.webp',
      'restaurant-libanais-bruxelles.webp',
      'midden-oosters-restaurant.webp',
      'middle-eastern-restaurant.webp',
      '',
      null as any,
      undefined as any
    ]

    // Check if cover_image_url exists, is not empty, and is not a broken path
    const hasValidImage = blog.cover_image_url &&
                         typeof blog.cover_image_url === 'string' &&
                         blog.cover_image_url.trim() !== '' &&
                         !brokenImagePaths.includes(blog.cover_image_url) &&
                         blog.cover_image_url.startsWith('/images/')

    if (hasValidImage) {
      return blog.cover_image_url as string
    }

    // Assign specific images based on slug
    const slugImageMap: Record<string, string> = {
      'mediterranean-cuisine-restaurant-history-benefits': '/images/events-catering/plat-libanais-restaurant-libanais-bruxelles.webp',
      'restaurant-cuisine-mediterraneenne-histoire-bienfaits': '/images/events-catering/plat-libanais-restaurant-libanais-bruxelles.webp',
      'middle-eastern-restaurant-comprehensive-guide': '/images/gallery2/mezze-libanais-restaurant-libanais.webp',
      'midden-oosters-restaurant-uitgebreide-gids': '/images/gallery2/mezze-libanais-restaurant-libanais.webp',
      'vegetarian-restaurant-brussels-all-you-need-to-know': '/images/gallery/falafel.webp',
      'restaurant-vegetarien-bruxelles-tout-ce-que-vous-devez-savoir': '/images/gallery/falafel.webp',
      'vegetarisch-restaurant-brussel-alles-wat-u-moet-weten': '/images/gallery/falafel.webp',
      'best-vegetarian-restaurants-brussels-guide': '/images/gallery/houmos.webp',
      'meilleurs-restaurants-vegetariens-bruxelles': '/images/gallery/houmos.webp',
      'beste-vegetarische-restaurants-brussel': '/images/gallery/houmos.webp',
      'three-justifications-trying-east-west-restaurant': '/images/events-catering/plat-libanais-restaurant-libanais.webp',
      'trois-raisons-essayer-restaurant-east-west': '/images/events-catering/plat-libanais-restaurant-libanais.webp',
      'drie-redenen-east-west-restaurant-proberen': '/images/events-catering/plat-libanais-restaurant-libanais.webp',
      'culinary-escape-lebanese-restaurant-brussels': '/images/gallery2/restaurant-libanais.webp',
      'evasion-culinaire-restaurant-libanais-bruxelles': '/images/gallery2/restaurant-libanais.webp',
      'culinaire-ontsnapping-libanees-restaurant-brussel': '/images/gallery2/restaurant-libanais.webp',
      'halal-food-restaurants-brussels-guide': '/images/gallery/kebbe.webp',
      'restaurants-halal-bruxelles-guide': '/images/gallery/kebbe.webp',
      'halal-restaurants-brussel-gids': '/images/gallery/kebbe.webp',
    }

    return slugImageMap[blog.slug] || '/images/events-catering/mezze-libanais-restaurant.webp'
  }

  const loadBlogPost = useCallback(async () => {
    try {
      setLoading(true)
      const blogData = await getBlogPostBySlug(slug, i18n.language)

      if (!blogData) {
        notFound()
        return
      }

      setBlog(blogData)

      // Load related posts based on tags
      if (blogData.tags && blogData.tags.length > 0) {
        const blogLanguage = detectLanguageFromSlug(blogData.slug)
        const related = await getRelatedBlogPosts(blogData.slug, blogData.tags, 3, blogLanguage)
        setRelatedPosts(related)
      }

      setError(null)
    } catch (err) {
      console.error('Error loading blog post:', err)
      setError('Failed to load blog post. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [slug, i18n.language])

  useEffect(() => {
    if (slug) {
      loadBlogPost()
    }
  }, [slug, loadBlogPost])

  // Handle scroll progress and back to top button
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
      setShowBackToTop(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle language switching - redirect to the correct language version of the blog
  useEffect(() => {
    const currentSlugLanguage = detectLanguageFromSlug(slug)
    const targetLanguage = i18n.language

    // If the current slug language doesn't match the UI language, redirect
    if (currentSlugLanguage !== targetLanguage) {
      const newSlug = getSlugForLanguage(slug, targetLanguage)
      if (newSlug !== slug) {
        console.log(`🌐 Language changed: Redirecting from ${slug} (${currentSlugLanguage}) to ${newSlug} (${targetLanguage})`)
        router.push(`/blog/${newSlug}`)
      }
    }
  }, [i18n.language, slug, router])

  // Convert markdown-like content to JSX (modern blog styling)
  const renderContent = (content: string) => {
    const lines = content.split('\n')
    const elements: React.ReactElement[] = []
    let inList = false
    let listItems: React.ReactElement[] = []

    const flushList = () => {
      if (inList && listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className={`mb-10 space-y-4 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {listItems}
          </ul>
        )
        listItems = []
        inList = false
      }
    }

    // Helper function to process text with bold, italic, and hyperlinks
    const processText = (text: string) => {
      // Handle hyperlinks [text](url)
      text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" class="text-[#A8D5BA] hover:text-[#8FBC8F] underline decoration-2 underline-offset-4 font-semibold transition-all duration-200 hover:decoration-[#8FBC8F]" target="_blank" rel="noopener noreferrer">$1</a>`)
      // Handle bold text **text** (but not inside links)
      text = text.replace(/\*\*([^*]+)\*\*/g, `<strong class="font-bold text-[#A8D5BA]">$1</strong>`)
      // Handle italic text *text* (but not inside bold or links)
      text = text.replace(/\*([^*]+)\*/g, `<em class="italic font-medium">$1</em>`)
      return <span dangerouslySetInnerHTML={{ __html: text }} />
    }
    
    lines.forEach((line, index) => {
      const trimmed = line.trim()

      // Check for image syntax ![alt](url)
      if (trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)) {
        flushList()
        const match = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
        if (!match) return
        const altText = match[1]
        const imageUrl = match[2]

        elements.push(
          <div key={index} className="my-8">
            <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={imageUrl}
                alt={altText}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                quality={85}
              />
            </div>
          </div>
        )
      } else if (trimmed.startsWith('# ')) {
        flushList()
        elements.push(
          <header key={index} className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#A8D5BA] via-[#A8D5BA] to-[#A8D5BA] bg-clip-text text-transparent">
                {trimmed.substring(2)}
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] mx-auto rounded-full"></div>
          </header>
        )
      } else if (trimmed.startsWith('## ')) {
        flushList()
        const headingText = trimmed.substring(3)
        const headingId = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

        elements.push(
          <section key={index} className="mb-12 mt-20" id={headingId}>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-8 flex items-center gap-4 scroll-mt-24">
                <span className="bg-gradient-to-r from-[#A8D5BA] via-[#8FBC8F] to-[#A8D5BA] bg-clip-text text-transparent leading-tight">
                  {headingText}
                </span>
                <div className="flex-1 h-1 bg-gradient-to-r from-[#A8D5BA]/40 via-[#A8D5BA]/20 to-transparent rounded-full"></div>
              </h2>
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#A8D5BA] to-transparent rounded-full"></div>
            </div>
          </section>
        )
      } else if (trimmed.startsWith('### ')) {
        flushList()
        const heading = trimmed.substring(4)
        const emoji = heading.match(/^(\p{Emoji})\s*/u)?.[1] || ''
        const cleanHeading = heading.replace(/^(\p{Emoji})\s*/u, '')
        const headingId = cleanHeading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

        elements.push(
          <div key={index} className="mb-10 mt-12" id={headingId}>
            <div className={`relative pl-6 border-l-4 border-[#A8D5BA] ${
              theme === 'dark' ? 'bg-white/5' : 'bg-[#A8D5BA]/5'
            } py-4 rounded-r-xl`}>
              <h3 className={`text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3 scroll-mt-24 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {emoji && <span className="text-4xl">{emoji}</span>}
                <span className="text-[#A8D5BA]">{cleanHeading}</span>
              </h3>
            </div>
          </div>
        )
      } else if (trimmed.startsWith('- ')) {
        if (!inList) {
          inList = true
        }
        listItems.push(
          <li key={index} className={`flex items-start gap-4 text-lg leading-relaxed pl-2 py-2 rounded-lg transition-all duration-200 hover:pl-4 ${
            theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-[#A8D5BA]/5'
          }`}>
            <span className="w-2.5 h-2.5 bg-gradient-to-br from-[#A8D5BA] to-[#8FBC8F] rounded-full mt-2.5 flex-shrink-0 shadow-lg"></span>
            <span className="flex-1">{processText(trimmed.substring(2))}</span>
          </li>
        )
      } else if (trimmed === '') {
        flushList()
        // Add some spacing for empty lines
        if (elements.length > 0) {
          elements.push(<div key={index} className="mb-6"></div>)
        }
      } else if (trimmed !== '') {
        flushList()

        // Check if this is a special formatted paragraph (starts with **)
        if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
          elements.push(
            <div key={index} className={`mb-8 p-6 rounded-2xl border-l-4 border-[#A8D5BA] shadow-lg ${
              theme === 'dark' ? 'bg-gradient-to-r from-white/10 to-white/5' : 'bg-gradient-to-r from-[#A8D5BA]/10 to-[#A8D5BA]/5'
            }`}>
              <p className="text-xl font-semibold text-[#A8D5BA] leading-relaxed">
                {processText(trimmed)}
              </p>
            </div>
          )
        } else {
          elements.push(
            <p key={index} className={`text-lg md:text-xl leading-[1.8] mb-6 first-letter:text-6xl first-letter:font-bold first-letter:text-[#A8D5BA] first-letter:mr-2 first-letter:float-left first-letter:leading-none ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {processText(trimmed)}
            </p>
          )
        }
      }
    })
    
    // Flush any remaining list items
    flushList()
    
    return elements
  }

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${
        theme === 'dark' ? 'bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#1A1A1A]' : 'bg-gradient-to-br from-[#F5F0E6] via-[#FFFFFF] to-[#F5F0E6]'
      }`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#A8D5BA] border-t-transparent rounded-full animate-spin"></div>
            <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Loading blog post...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${
        theme === 'dark' ? 'bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#1A1A1A]' : 'bg-gradient-to-br from-[#F5F0E6] via-[#FFFFFF] to-[#F5F0E6]'
      }`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className={`text-center p-8 rounded-2xl ${
            theme === 'dark' ? 'bg-red-900/20 text-white' : 'bg-red-50 text-red-900'
          }`}>
            <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
            <p className="mb-6">{error || 'The blog post you\'re looking for doesn\'t exist.'}</p>
            <Link href="/blog">
              <button className="px-6 py-3 bg-[#A8D5BA] hover:bg-[#1A1A1A] text-white rounded-lg transition-colors duration-300">
                Back to Blog
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt || blog.meta_description,
    "author": {
      "@type": "Person",
      "name": blog.author_name || "East at West Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "East at West",
      "logo": {
        "@type": "ImageObject",
        "url": "https://eastatwest.com/images/logo.webp"
      }
    },
    "datePublished": blog.published_at,
    "dateModified": blog.updated_at,
    "image": getBlogCoverImage(blog),
    "url": `https://eastatwest.com/blog/${blog.slug}`
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200/30 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#A8D5BA] via-[#8FBC8F] to-[#A8D5BA] transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#A8D5BA] to-[#8FBC8F] text-white'
              : 'bg-gradient-to-br from-[#A8D5BA] to-[#8FBC8F] text-white'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}

      <Head>
        <title>{blog.meta_title || blog.title} - East at West</title>
        <meta name="description" content={blog.meta_description || blog.excerpt || 'Read more on the East at West blog'} />
        <meta name="keywords" content={blog.tags?.join(', ') || 'Lebanese cuisine, Brussels restaurant'} />
        
        {/* Open Graph */}
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt || blog.meta_description || ''} />
        <meta property="og:image" content={getBlogCoverImage(blog)} />
        <meta property="og:url" content={`https://eastatwest.com/blog/${blog.slug}`} />
        <meta property="og:type" content="article" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.excerpt || blog.meta_description || ''} />
        <meta name="twitter:image" content={getBlogCoverImage(blog)} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className={`min-h-screen transition-colors duration-500 ${
        theme === 'dark' ? 'bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#1A1A1A]' : 'bg-gradient-to-br from-[#F5F0E6] via-[#FFFFFF] to-[#F5F0E6]'
      }`}>
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={getBlogCoverImage(blog)}
              alt={blog.title}
              fill
              className="object-cover transform scale-105 transition-transform duration-[3s] hover:scale-110"
              priority
              sizes="100vw"
              quality={80}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#A8D5BA]/20 to-[#A8D5BA]/20"></div>
          </div>
          
          {/* Breadcrumb */}
          <div className="absolute top-8 left-8 z-10">
            <Link href="/blog">
              <span className="bg-black/50  text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/70 transition-colors duration-300">
                ← {t('blog.backToBlog')}
              </span>
            </Link>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <motion.div
              className="text-center text-white max-w-4xl"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {blog.tags.map(tag => (
                    <span key={tag} className="bg-[#A8D5BA]/80  text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent">
                  {blog.title}
                </span>
              </h1>
              
              {blog.excerpt && (
                <p className="text-xl font-light mb-8 max-w-3xl mx-auto opacity-90">
                  {blog.excerpt}
                </p>
              )}
              
              <motion.div
                className="flex flex-wrap items-center justify-center gap-6 text-lg font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                {blog.author_name && (
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#A8D5BA] rounded-full"></div>
                    {blog.author_name}
                  </span>
                )}
                {blog.published_at && (
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#A8D5BA] rounded-full"></div>
                    {formatBlogDate(blog.published_at)}
                  </span>
                )}
                {blog.reading_time && (
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    {blog.reading_time} {t('blog.minRead')}
                  </span>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Article Content */}
        <motion.article
          className={`relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Table of Contents */}
          <motion.div
            variants={itemVariants}
            className={`relative z-10 p-8 rounded-3xl border mb-12 overflow-hidden ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 shadow-2xl'
                : 'bg-gradient-to-br from-white to-[#A8D5BA]/5 border-[#A8D5BA]/30 shadow-xl'
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#A8D5BA]/10 rounded-full blur-3xl"></div>
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 relative z-10 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <span className="text-3xl">📚</span>
              <span className="bg-gradient-to-r from-[#A8D5BA] to-[#8FBC8F] bg-clip-text text-transparent">
                {t('blog.tableOfContents')}
              </span>
            </h2>
            <nav className="space-y-3 relative z-10">
              {blog.content.split('\n')
                .filter(line => (line.startsWith('## ') || line.startsWith('### ')) && !line.match(/^!\[/))
                .map((heading, index) => {
                  const level = heading.startsWith('### ') ? 3 : 2
                  const text = heading.replace(/^#{2,3}\s/, '').replace(/🍟|🥔|🥬|🧀/g, '').trim()
                  const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

                  return (
                    <a
                      key={index}
                      href={`#${slug}`}
                      className={`block py-2 px-4 rounded-xl hover:bg-[#A8D5BA]/10 hover:translate-x-2 transition-all duration-300 ${
                        level === 3 ? 'ml-6 text-base' : 'font-semibold text-lg'
                      } ${theme === 'dark' ? 'text-gray-300 hover:text-[#A8D5BA]' : 'text-gray-700 hover:text-[#A8D5BA]'}`}
                    >
                      <span className="flex items-center gap-2">
                        {level === 2 ? '▶' : '▸'} {text}
                      </span>
                    </a>
                  )
                })}
            </nav>
          </motion.div>

          {/* Main Content */}
          <motion.div
            variants={itemVariants}
            className={`relative z-10 p-10 md:p-12 rounded-3xl border overflow-hidden ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 shadow-2xl'
                : 'bg-gradient-to-br from-white to-gray-50 border-[#A8D5BA]/30 shadow-xl'
            }`}
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#A8D5BA]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#8FBC8F]/5 rounded-full blur-3xl"></div>
            <article className="prose prose-lg md:prose-xl max-w-none relative z-10">
              {renderContent(blog.content)}
            </article>
          </motion.div>

          {/* Author Info */}
          {blog.author_name && (
            <motion.div
              variants={itemVariants}
              className={`relative z-10 mt-12 p-8 rounded-3xl border overflow-hidden ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 shadow-2xl'
                  : 'bg-gradient-to-br from-white to-[#A8D5BA]/5 border-[#A8D5BA]/30 shadow-xl'
              }`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#A8D5BA]/10 rounded-full blur-3xl"></div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#A8D5BA] via-[#8FBC8F] to-[#A8D5BA] flex items-center justify-center shadow-xl ring-4 ring-white/20">
                  <span className="text-white font-bold text-2xl">
                    {blog.author_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{blog.author_name}</h3>
                  <p className={`text-base ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                    {t('blog.authorAt')} East at West
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Share Section */}
          <motion.div
            variants={itemVariants}
            className={`relative z-10 mt-12 p-8 rounded-3xl border overflow-hidden ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 shadow-2xl'
                : 'bg-gradient-to-br from-white to-[#A8D5BA]/5 border-[#A8D5BA]/30 shadow-xl'
            }`}
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#8FBC8F]/10 rounded-full blur-3xl"></div>
            <h3 className="text-2xl font-bold mb-6 relative z-10 flex items-center gap-3">
              <span className="text-3xl">📤</span>
              <span className="bg-gradient-to-r from-[#A8D5BA] to-[#8FBC8F] bg-clip-text text-transparent">
                {t('blog.shareArticle')}
              </span>
            </h3>
            <div className="flex items-center gap-6 relative z-10">
              <button
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                style={theme !== 'dark' ? { backgroundColor: '#0A66C2' } : {}}
                className={`p-4 rounded-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-lg ${
                  theme === 'dark'
                    ? 'bg-white/10 hover:bg-white/20'
                    : ''
                } text-white`}
                aria-label="Share on Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </button>

              <button
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                style={theme !== 'dark' ? { backgroundColor: '#0A66C2' } : {}}
                className={`p-4 rounded-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-lg ${
                  theme === 'dark'
                    ? 'bg-white/10 hover:bg-white/20'
                    : ''
                } text-white`}
                aria-label="Share on LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <motion.h2 
              className={`text-3xl font-bold mb-8 text-center ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t('blog.relatedArticles')}
            </motion.h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <motion.article
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`rounded-2xl overflow-hidden transition-all duration-300 hover:transform hover:scale-105 ${
                    theme === 'dark' 
                      ? 'bg-white/5  border border-white/10 hover:bg-white/10' 
                      : 'bg-white shadow-lg border border-gray-100 hover:shadow-xl'
                  }`}
                >
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <div className="relative h-48">
                      <Image
                        src={getBlogCoverImage(relatedPost)}
                        alt={relatedPost.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                        quality={70}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className={`text-lg font-bold mb-2 leading-tight ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {relatedPost.title}
                      </h3>
                      
                      <p className={`text-sm leading-relaxed mb-4 ${
                        theme === 'dark' ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        {relatedPost.excerpt || t('blog.readMore')}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        {relatedPost.published_at && (
                          <span className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                            {formatBlogDate(relatedPost.published_at)}
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
          </section>
        )}

        {/* Call to Action */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`relative overflow-hidden rounded-3xl p-12 text-center ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-[#A8D5BA]/20 to-[#8FBC8F]/20'
                : 'bg-gradient-to-br from-[#A8D5BA]/10 to-[#8FBC8F]/10'
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#A8D5BA] rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#8FBC8F] rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-[#A8D5BA] to-[#8FBC8F] bg-clip-text text-transparent">
                  {t('blog.visitRestaurant')}
                </span>
              </h3>
              <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {t('blog.experienceText')}
              </p>
              <Link href="/reservation">

                <button className={`px-8 py-4 text-white font-bold text-lg rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl `} style={theme !== 'dark' ? { backgroundColor: '#9ba39aff' } : {}}>
                  
                  {t('blog.bookTable')}
                </button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Comment Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <CommentSection blogPostId={blog.slug} />
        </section>
      </div>
    </>
  )
}
