'use client'

import { useTranslation } from 'react-i18next'
import { useTheme } from '../../context/ThemeContext'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import FAQSection from '@/components/FAQSection'
import Head from 'next/head'

export default function LebaneseRestaurantBrusselsPage() {
  const { t } = useTranslation('common')
  const { theme } = useTheme()

  // SEO-optimized FAQs for Lebanese Restaurant Brussels
  const faqs = [
    {
      question: "What makes East At West the best Lebanese restaurant in Brussels?",
      answer: "East At West combines authentic Lebanese recipes passed down through generations with fresh, locally-sourced ingredients. Our chefs bring decades of experience in Lebanese cuisine, creating traditional dishes like mezze, falafel, hummus, and shawarma with modern presentation. We're recognized by Restaurant Guru and loved by locals and tourists alike for our warm hospitality and genuine flavors of Lebanon."
    },
    {
      question: "Where is East At West Lebanese restaurant located in Brussels?",
      answer: "We're conveniently located at Rue de la Bourse 15, 1000 Brussels (Bruxelles), right in the heart of the city center. We're easily accessible by metro (Bourse/De Brouckère stations), tram, and bus. Street parking and public parking garages are available nearby."
    },
    {
      question: "Do you serve halal food at your Lebanese restaurant?",
      answer: "Yes, all our meat dishes are prepared according to halal standards. We take pride in serving authentic Lebanese halal cuisine including chicken shawarma, lamb kebabs, kafta, and more. Our menu also features extensive vegetarian and vegan options."
    },
    {
      question: "What are the opening hours of East At West Brussels?",
      answer: "We're open Tuesday through Sunday:\nLunch: 12:00 PM - 2:00 PM\nDinner: 6:00 PM - 10:00 PM\n\nWe're closed on Mondays. For reservations or special events, please call us at +32 2 503 5303 or book online through our website."
    },
    {
      question: "Do you offer vegetarian and vegan Lebanese dishes?",
      answer: "Absolutely! Lebanese cuisine is naturally rich in vegetarian and vegan options. We offer falafel, hummus, baba ganoush, tabbouleh, fattoush, stuffed grape leaves, lentil soup, and many more plant-based dishes. Our vegan kibbeh is a customer favorite. Just ask our staff for recommendations!"
    },
    {
      question: "Can I make a reservation at East At West?",
      answer: "Yes, we highly recommend making reservations, especially for dinner and weekends. You can book a table online through our website, call us at +32 2 503 5303, or email infos.east.west@gmail.com. Walk-ins are welcome based on availability."
    },
    {
      question: "Do you offer catering services for events in Brussels?",
      answer: "Yes! We provide authentic Lebanese catering for corporate events, weddings, private parties, and special occasions throughout Brussels. Our catering menu includes mezze platters, hot dishes, desserts, and customizable options for any group size. Visit our Events & Catering page or contact us for a personalized quote."
    },
    {
      question: "What are your most popular Lebanese dishes?",
      answer: "Our customer favorites include:\n• Mixed Mezze Platter (hummus, baba ganoush, tabbouleh, falafel)\n• Chicken Shawarma\n• Lamb Kafta Kebabs\n• Kibbeh (traditional and vegan)\n• Fattoush Salad\n• Manakish (Lebanese flatbread)\n• Baklava for dessert\n\nWe also offer daily specials featuring seasonal ingredients."
    },
    {
      question: "Is East At West family-friendly?",
      answer: "Yes, we're a family-friendly restaurant! We welcome guests of all ages and offer a relaxed, warm atmosphere perfect for family dinners. Our menu has options that appeal to both adults and children, and our staff is happy to accommodate special requests."
    },
    {
      question: "Do you offer takeaway and delivery in Brussels?",
      answer: "Yes, we offer both takeaway and delivery services. You can order directly through our website for pickup, or find us on popular delivery platforms. Enjoy authentic Lebanese cuisine in the comfort of your home!"
    }
  ]

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

  // Structured Data for Local Business
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "East At West - Lebanese Restaurant Brussels",
    "description": "Authentic Lebanese restaurant in Brussels serving traditional mezze, shawarma, falafel, and halal dishes. Located in the heart of Brussels city center.",
    "url": "https://eastatwest.com/lebanese-restaurant-brussels",
    "image": "https://eastatwest.com/images/banner.webp",
    "logo": "https://eastatwest.com/android-chrome-512x512.png",
    "telephone": "+32-2-503-5303",
    "email": "infos.east.west@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rue de la Bourse 15",
      "addressLocality": "Brussels",
      "addressRegion": "Brussels-Capital",
      "postalCode": "1000",
      "addressCountry": "BE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "50.8476",
      "longitude": "4.3572"
    },
    "servesCuisine": ["Lebanese", "Mediterranean", "Middle Eastern", "Halal"],
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "12:00",
        "closes": "22:00"
      }
    ],
    "acceptsReservations": true,
    "menu": "https://eastatwest.com/menu",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
    "currenciesAccepted": "EUR"
  }

  return (
    <>
      <Head>
        <title>Lebanese Restaurant Brussels | East At West - Authentic Lebanese Cuisine</title>
        <meta
          name="description"
          content="Best Lebanese restaurant in Brussels ⭐ Authentic halal mezze, shawarma, falafel & more. Located at Rue de la Bourse 15. Dine-in, takeaway & catering. Book now!"
        />
        <meta
          name="keywords"
          content="Lebanese restaurant Brussels, halal restaurant Brussels, mezze Brussels, shawarma Brussels, falafel Brussels, Middle Eastern food Brussels, Lebanese catering Brussels, authentic Lebanese cuisine, vegetarian restaurant Brussels, vegan Lebanese food"
        />
        <link rel="canonical" href="https://eastatwest.com/lebanese-restaurant-brussels" />

        {/* Open Graph */}
        <meta property="og:title" content="Lebanese Restaurant Brussels | East At West - Authentic Lebanese Cuisine" />
        <meta property="og:description" content="Best Lebanese restaurant in Brussels. Authentic halal mezze, shawarma, falafel & more. Dine-in, takeaway & catering available." />
        <meta property="og:url" content="https://eastatwest.com/lebanese-restaurant-brussels" />
        <meta property="og:type" content="restaurant" />
        <meta property="og:image" content="https://eastatwest.com/images/banner.webp" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lebanese Restaurant Brussels | East At West" />
        <meta name="twitter:description" content="Best Lebanese restaurant in Brussels. Authentic halal cuisine, mezze, shawarma & more." />
        <meta name="twitter:image" content="https://eastatwest.com/images/banner.webp" />

        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </Head>

      <div className={`min-h-screen pt-16 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#1A1A1A] text-white' : 'bg-white text-black'
      }`}>

        {/* Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/banner.webp')"
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="mb-8"
            >
              <div className="text-8xl mb-6">🇱🇧</div>
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 text-white drop-shadow-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Lebanese Restaurant Brussels
            </motion.h1>

            <motion.p
              className="text-2xl sm:text-3xl max-w-4xl mx-auto font-light leading-relaxed text-white drop-shadow-lg mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              Experience Authentic Lebanese Cuisine in the Heart of Brussels
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              <Link href="/reservations">
                <button className="bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl">
                  Book a Table
                </button>
              </Link>
              <Link href="/menu">
                <button className="border-3 border-white bg-white/10 text-white hover:bg-white hover:text-black px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl">
                  View Menu
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Why Choose East At West */}
        <motion.section
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
            <motion.div className="text-center mb-16" variants={itemVariants}>
              <h2 className="text-4xl sm:text-5xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] bg-clip-text text-transparent">
                  Why East At West?
                </span>
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] mx-auto rounded-full"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  emoji: "🥙",
                  title: "100% Authentic Lebanese",
                  description: "Traditional recipes from Lebanon, prepared by experienced Lebanese chefs with the finest ingredients and spices imported directly from the Middle East."
                },
                {
                  emoji: "🥩",
                  title: "Halal Certified",
                  description: "All our meat dishes are halal certified, ensuring you can enjoy authentic Lebanese cuisine with complete peace of mind."
                },
                {
                  emoji: "🌱",
                  title: "Vegan & Vegetarian Options",
                  description: "Extensive plant-based menu featuring falafel, hummus, baba ganoush, vegan kibbeh, and many other Lebanese specialties."
                },
                {
                  emoji: "📍",
                  title: "Central Brussels Location",
                  description: "Located at Rue de la Bourse 15 in the heart of Brussels, easily accessible by public transport and within walking distance of major attractions."
                },
                {
                  emoji: "🎉",
                  title: "Catering Services",
                  description: "Professional Lebanese catering for corporate events, weddings, and private parties. Custom menus available for groups of all sizes."
                },
                {
                  emoji: "⭐",
                  title: "Award-Winning",
                  description: "Recognized by Restaurant Guru and highly rated by customers for our exceptional food quality, service, and authentic atmosphere."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`p-8 rounded-3xl ${
                    theme === 'dark'
                      ? 'bg-[#2A2A2A] border border-[#A8D5BA]/20'
                      : 'bg-white border border-gray-200'
                  } shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
                >
                  <div className="text-6xl mb-4 text-center">{feature.emoji}</div>
                  <h3 className={`text-2xl font-bold mb-4 text-center ${
                    theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-center leading-relaxed ${
                    theme === 'dark' ? 'text-white/80' : 'text-gray-700'
                  }`}>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Signature Dishes */}
        <motion.section
          className={`py-20 px-4 sm:px-8 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#1A1A1A]/90 to-orange-200'
              : 'bg-gradient-to-br from-gray-100 to-gray-300'
          }`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16" variants={itemVariants}>
              <div className="text-6xl mb-6">🍽️</div>
              <h2 className="text-4xl sm:text-5xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] bg-clip-text text-transparent">
                  Our Signature Lebanese Dishes
                </span>
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] mx-auto rounded-full mb-6"></div>
              <p className={`text-lg max-w-3xl mx-auto ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                Discover the rich flavors of Lebanon with our carefully curated menu of traditional and modern dishes
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {[
                {
                  title: "Mezze Platter",
                  description: "A beautiful assortment of Lebanese appetizers including hummus, baba ganoush, tabbouleh, falafel, stuffed grape leaves, and fresh pita bread. Perfect for sharing!",
                  keywords: "vegetarian, vegan options, gluten-free available"
                },
                {
                  title: "Chicken Shawarma",
                  description: "Tender marinated chicken, slowly roasted and served with tahini sauce, pickles, and Lebanese garlic sauce. A Lebanese street food classic!",
                  keywords: "halal, signature dish, customer favorite"
                },
                {
                  title: "Kibbeh (Traditional & Vegan)",
                  description: "Our famous kibbeh - bulgur wheat shells stuffed with spiced meat or our innovative vegan filling. Crispy outside, flavorful inside.",
                  keywords: "traditional Lebanese, vegan option available"
                },
                {
                  title: "Lamb Kafta Kebabs",
                  description: "Hand-rolled ground lamb mixed with parsley, onions, and Middle Eastern spices, grilled to perfection. Served with rice and grilled vegetables.",
                  keywords: "halal, grilled, gluten-free"
                }
              ].map((dish, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`p-8 rounded-3xl ${
                    theme === 'dark'
                      ? 'bg-[#2A2A2A] border border-[#A8D5BA]/20'
                      : 'bg-white border border-gray-200'
                  } shadow-xl`}
                >
                  <h3 className={`text-2xl font-bold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                  }`}>
                    {dish.title}
                  </h3>
                  <p className={`leading-relaxed mb-4 ${
                    theme === 'dark' ? 'text-white/80' : 'text-gray-700'
                  }`}>
                    {dish.description}
                  </p>
                  <div className={`text-sm font-semibold ${
                    theme === 'dark' ? 'text-[#A8D5BA]' : 'text-[#A8D5BA]'
                  }`}>
                    {dish.keywords}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div className="text-center mt-12" variants={itemVariants}>
              <Link href="/menu">
                <button className="bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl">
                  View Full Menu
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Location & Hours */}
        <motion.section
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div variants={itemVariants}>
                <div className="text-6xl mb-6">📍</div>
                <h2 className={`text-4xl font-black mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                }`}>
                  Visit Us in Brussels
                </h2>
                <div className="w-32 h-1.5 bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] rounded-full mb-8"></div>

                <div className="space-y-6">
                  <div>
                    <h3 className={`text-xl font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                    }`}>Address</h3>
                    <p className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>
                      Rue de la Bourse 15<br />
                      1000 Brussels (Bruxelles)<br />
                      Belgium
                    </p>
                  </div>

                  <div>
                    <h3 className={`text-xl font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                    }`}>Contact</h3>
                    <p className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>
                      Phone: <a href="tel:+3225035303" className="text-[#A8D5BA] hover:underline">+32 2 503 5303</a><br />
                      Email: <a href="mailto:infos.east.west@gmail.com" className="text-[#A8D5BA] hover:underline">infos.east.west@gmail.com</a>
                    </p>
                  </div>

                  <div>
                    <h3 className={`text-xl font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                    }`}>Public Transport</h3>
                    <p className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>
                      Metro: Bourse or De Brouckère stations<br />
                      Tram/Bus: Multiple lines stop nearby
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="text-6xl mb-6">⏰</div>
                <h2 className={`text-4xl font-black mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                }`}>
                  Opening Hours
                </h2>
                <div className="w-32 h-1.5 bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] rounded-full mb-8"></div>

                <div className={`p-8 rounded-3xl ${
                  theme === 'dark'
                    ? 'bg-[#2A2A2A] border border-[#A8D5BA]/20'
                    : 'bg-white border border-gray-200'
                } shadow-xl`}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'}`}>
                        Monday
                      </span>
                      <span className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>
                        Closed
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'}`}>
                        Tuesday - Sunday
                      </span>
                      <span className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>
                        12:00 - 14:00, 18:00 - 22:00
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-[#A8D5BA]/20">
                    <Link href="/reservations">
                      <button className="w-full bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] text-white py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Make a Reservation
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <FAQSection
          faqs={faqs}
          title="Lebanese Restaurant Brussels - Your Questions Answered"
          subtitle="Everything you need to know about East At West"
        />

        {/* CTA Section */}
        <motion.section
          className="relative py-20 px-4 sm:px-8 bg-black text-white"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.div variants={itemVariants}>
              <div className="text-6xl mb-6">🎯</div>
              <h2 className="text-4xl sm:text-5xl font-black mb-8">
                <span className="bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] bg-clip-text text-transparent">
                  Ready to Experience Authentic Lebanese Cuisine?
                </span>
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] mx-auto rounded-full mb-8"></div>
              <p className="text-xl mb-12 max-w-3xl mx-auto">
                Book your table now and discover why East At West is Brussels' favorite Lebanese restaurant
              </p>

              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                <Link href="/reservations">
                  <button className="bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl">
                    Reserve a Table
                  </button>
                </Link>
                <Link href="/takeaway">
                  <button className="border-3 border-white bg-white/10 text-white hover:bg-white hover:text-black px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl">
                    Order Takeaway
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </>
  )
}
