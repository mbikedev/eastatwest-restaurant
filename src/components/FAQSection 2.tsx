'use client'

import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import FAQSchema from './FAQSchema'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs: FAQItem[]
  title?: string
  subtitle?: string
}

export default function FAQSection({ faqs, title = "Frequently Asked Questions", subtitle }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { theme } = useTheme()

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      <FAQSchema faqs={faqs} />

      <section className={`py-20 px-4 sm:px-8 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#1A1A1A] via-[#A8D5BA]/10 to-[#1A1A1A]'
          : 'bg-gradient-to-br from-[#F5F0E6] via-[#A8D5BA]/20 to-[#F5F0E6]'
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">❓</div>
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
            }`}>
              {title}
            </h2>
            {subtitle && (
              <p className={`text-lg ${
                theme === 'dark' ? 'text-white/80' : 'text-gray-600'
              }`}>
                {subtitle}
              </p>
            )}
            <div className="w-32 h-1.5 bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] mx-auto rounded-full mt-6"></div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <m.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl overflow-hidden ${
                  theme === 'dark'
                    ? 'bg-[#2A2A2A] border border-[#A8D5BA]/20'
                    : 'bg-white border border-gray-200'
                } shadow-lg`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full px-6 py-5 text-left flex items-center justify-between transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-[#A8D5BA]/10'
                      : 'hover:bg-[#A8D5BA]/10'
                  }`}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className={`text-lg font-semibold pr-4 ${
                    theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                  }`}>
                    {faq.question}
                  </h3>
                  <m.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex-shrink-0 ${
                      theme === 'dark' ? 'text-[#A8D5BA]' : 'text-[#A8D5BA]'
                    }`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </m.div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <m.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`px-6 pb-5 ${
                        theme === 'dark' ? 'text-white/80' : 'text-gray-700'
                      }`}>
                        <p className="leading-relaxed whitespace-pre-line">{faq.answer}</p>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </m.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
