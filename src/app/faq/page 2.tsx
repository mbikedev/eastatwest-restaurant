'use client'

import { useTheme } from '@/context/ThemeContext'
import { m } from 'framer-motion'

export default function FAQPage() {
  const { theme } = useTheme()

  const faqs = [
    {
      question: "What are your opening hours?",
      answer: "We are open Monday to Friday from 11:30 AM to 2:00 PM for lunch. On Saturday, we serve dinner from 6:00 PM to 10:00 PM. We are closed on Sundays."
    },
    {
      question: "Is your restaurant halal-certified?",
      answer: "Yes, all our meat and poultry are halal-certified. We take pride in serving authentic Lebanese cuisine prepared according to halal standards."
    },
    {
      question: "Do you have vegan and vegetarian options?",
      answer: "Absolutely! We offer a wide variety of vegan and vegetarian dishes including hummus, falafel, tabbouleh, fattoush, grilled vegetables, and many mezze options. Our menu clearly indicates vegan and vegetarian choices."
    },
    {
      question: "Can I make a reservation?",
      answer: "Yes, we highly recommend making a reservation, especially for dinner and weekends. You can book a table through our website's reservations page or call us at +32 465 20 60 24."
    },
    {
      question: "Do you offer takeaway services?",
      answer: "Yes, we offer takeaway for all menu items. You can view our takeaway menu online and place orders for pickup. We also provide catering services for events."
    },
    {
      question: "Is parking available near the restaurant?",
      answer: "Yes, there are several public parking options near our location at Bld de l'Empereur 26 in Brussels. Street parking and nearby parking garages are available."
    },
    {
      question: "Do you accommodate large groups?",
      answer: "Yes, we welcome group bookings for special occasions, corporate events, and private dining. Please contact us in advance to discuss your requirements and we'll arrange the perfect setup for your party."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash, credit cards, and debit cards (Visa, Mastercard, American Express). Payment can be made at the restaurant or when collecting takeaway orders."
    },
    {
      question: "Do you offer gluten-free options?",
      answer: "Many of our dishes are naturally gluten-free, including grilled meats, salads, and certain mezze. Please inform our staff about dietary restrictions and we'll be happy to recommend suitable options."
    },
    {
      question: "Can I host a private event at your restaurant?",
      answer: "Yes, we offer event catering and private dining services. Whether it's a wedding, corporate event, or birthday celebration, we can create a custom menu and arrangement. Contact us to discuss your event needs."
    }
  ]

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <div className={`min-h-screen pt-20 pb-16 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <m.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Frequently Asked Questions
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Everything you need to know about East @ West Lebanese Restaurant in Brussels
          </p>
        </m.div>

        {/* FAQ Items */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <m.div
              key={index}
              className={`p-6 rounded-xl ${
                theme === 'dark'
                  ? 'bg-gray-900 border border-gray-800'
                  : 'bg-gray-50 border border-gray-200'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <h2 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                {faq.question}
              </h2>
              <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {faq.answer}
              </p>
            </m.div>
          ))}
        </div>

        {/* Contact CTA */}
        <m.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className={`text-lg mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Still have questions?
          </p>
          <a
            href="/contact"
            className={`inline-block px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            Contact Us
          </a>
        </m.div>
      </div>
    </div>
  )
}
