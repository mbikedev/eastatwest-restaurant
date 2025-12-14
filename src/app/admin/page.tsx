'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import Link from 'next/link'

export default function AdminDashboard() {
  const { theme } = useTheme()
  const { loading, isAuthenticated } = useAdminAuth()

  useEffect(() => {
    document.title = 'Admin Dashboard - East @ West'
  }, [])

  // Show loading screen while checking auth OR if not authenticated (during redirect)
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-transparent border-[#A8D5BA] rounded-full animate-spin"></div>
          <p className="text-lg text-gray-900 dark:text-white">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  const adminSections = [
    {
      title: 'Reservations',
      description: 'Manage table reservations, approve or cancel bookings',
      icon: '📅',
      href: '/admin/reservations',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
    },
    {
      title: 'Comments',
      description: 'Moderate blog comments, approve or disapprove feedback',
      icon: '💬',
      href: '/admin/comments',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
    },
    {
      title: 'Orders',
      description: 'View and manage takeaway orders',
      icon: '🛒',
      href: '/admin/orders',
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700',
    },
  ]

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className={`min-h-screen pt-16 transition-colors duration-500 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A]'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={itemVariants}
        >
          <h1 className={`text-5xl md:text-6xl font-black mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            🛡️ Admin Dashboard
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-[#A8D5BA] to-[#8BC5A8] rounded-full mx-auto mb-6"></div>
          <p className={`text-xl ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
            Manage your restaurant operations
          </p>
        </motion.div>

        {/* Admin Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adminSections.map((section) => (
            <motion.div
              key={section.title}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={section.href}>
                <div className={`h-full p-8 rounded-2xl shadow-xl transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                    : 'bg-white border border-gray-200 hover:shadow-2xl'
                }`}>
                  {/* Icon */}
                  <div className={`w-16 h-16 mb-6 rounded-xl bg-gradient-to-r ${section.color} flex items-center justify-center text-3xl shadow-lg`}>
                    {section.icon}
                  </div>

                  {/* Title */}
                  <h2 className={`text-2xl font-bold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {section.title}
                  </h2>

                  {/* Description */}
                  <p className={`mb-6 ${
                    theme === 'dark' ? 'text-white/70' : 'text-gray-600'
                  }`}>
                    {section.description}
                  </p>

                  {/* Action Button */}
                  <div className={`inline-flex items-center gap-2 text-sm font-medium bg-gradient-to-r ${section.color} ${section.hoverColor} text-white px-4 py-2 rounded-lg transition-all duration-300`}>
                    <span>Open Dashboard</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div
          className={`mt-16 p-8 rounded-2xl ${
            theme === 'dark'
              ? 'bg-white/5 border border-white/10'
              : 'bg-white shadow-lg border border-gray-200'
          }`}
          variants={itemVariants}
        >
          <h3 className={`text-2xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            📊 Quick Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-4 rounded-xl ${
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <div className="text-sm mb-2 text-gray-500">Access Level</div>
              <div className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Administrator
              </div>
            </div>
            <div className={`p-4 rounded-xl ${
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <div className="text-sm mb-2 text-gray-500">Available Dashboards</div>
              <div className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {adminSections.length} Modules
              </div>
            </div>
            <div className={`p-4 rounded-xl ${
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <div className="text-sm mb-2 text-gray-500">Quick Actions</div>
              <div className="flex gap-2">
                <Link
                  href="/"
                  className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  View Site
                </Link>
                <Link
                  href="/blog"
                  className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  Blog
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          className={`mt-8 p-6 rounded-xl ${
            theme === 'dark'
              ? 'bg-blue-500/10 border border-blue-500/20'
              : 'bg-blue-50 border border-blue-200'
          }`}
          variants={itemVariants}
        >
          <h4 className={`font-bold mb-2 ${
            theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
          }`}>
            💡 Tips
          </h4>
          <ul className={`text-sm space-y-1 ${
            theme === 'dark' ? 'text-blue-200/80' : 'text-blue-700'
          }`}>
            <li>• Use the <strong>Reservations</strong> dashboard to manage table bookings</li>
            <li>• <strong>Comments</strong> require approval before appearing on blog posts</li>
            <li>• <strong>Orders</strong> dashboard shows all takeaway orders</li>
            <li>• Each dashboard has search and filter functionality</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}
