'use client'

import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../../context/ThemeContext'
import { useAdminAuth } from '../../../hooks/useAdminAuth'
import { fetchAllComments, approveComment, disapproveComment, deleteComment, formatCommentDate } from '../../../lib/commentUtils'
import type { Comment } from '../../../types/comments'
import Link from 'next/link'

export default function CommentsAdminPage() {
  const { theme } = useTheme()
  const { loading: authLoading, isAuthenticated } = useAdminAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBlogPost, setSelectedBlogPost] = useState<string>('all')

  const loadComments = async () => {
    setLoading(true)
    try {
      const allComments = await fetchAllComments(true)
      setComments(allComments)
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoading(false)
    }
  }

  // Set page title
  useEffect(() => {
    document.title = 'Comment Moderation - Admin Dashboard'
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadComments()
    }
  }, [isAuthenticated])

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-transparent border-[#A8D5BA] rounded-full animate-spin"></div>
          <p className="text-lg text-gray-900 dark:text-white">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  const handleApprove = async (commentId: string) => {
    const result = await approveComment(commentId)
    if (result.success) {
      setComments(prev => prev.map(comment =>
        comment.id === commentId
          ? { ...comment, is_approved: true }
          : comment
      ))
    } else {
      alert('Error approving comment: ' + result.error)
    }
  }

  const handleDisapprove = async (commentId: string) => {
    if (!confirm('Are you sure you want to disapprove this comment?')) return

    const result = await disapproveComment(commentId)
    if (result.success) {
      setComments(prev => prev.map(comment =>
        comment.id === commentId
          ? { ...comment, is_approved: false }
          : comment
      ))
    } else {
      alert('Error disapproving comment: ' + result.error)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) return

    const result = await deleteComment(commentId)
    if (result.success) {
      setComments(prev => prev.filter(comment => comment.id !== commentId))
    } else {
      alert('Error deleting comment: ' + result.error)
    }
  }

  // Get unique blog post IDs
  const uniqueBlogPosts = Array.from(new Set(comments.map(c => c.blog_post_id)))

  // Filter comments
  const filteredComments = comments.filter(comment => {
    // Filter by approval status
    const statusMatch = (() => {
      switch (filter) {
        case 'pending':
          return !comment.is_approved
        case 'approved':
          return comment.is_approved
        default:
          return true
      }
    })()

    // Filter by search term
    const searchMatch = searchTerm === '' ||
      comment.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by blog post
    const blogPostMatch = selectedBlogPost === 'all' || comment.blog_post_id === selectedBlogPost

    return statusMatch && searchMatch && blogPostMatch
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  }

  return (
    <div className={`min-h-screen pt-16 transition-colors duration-500 ${
      theme === 'dark' ? 'bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#1A1A1A]' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <m.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <m.div
          className="mb-12"
          variants={itemVariants}
        >
          <h1 className={`text-4xl md:text-5xl font-black mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            💬 Comment Moderation
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-[#A8D5BA] to-[#8BC5A8] rounded-full mb-4"></div>
          <p className={`text-lg ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
            Manage and moderate all blog post comments
          </p>
        </m.div>

        {/* Search and Filters Row */}
        <m.div
          className={`mb-8 p-6 rounded-2xl ${
            theme === 'dark'
              ? 'bg-white/5 border border-white/10'
              : 'bg-white shadow-lg border border-gray-200'
          }`}
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-white/70' : 'text-gray-700'
              }`}>
                Search Comments
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or content..."
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/20 text-white placeholder-white/40'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>

            {/* Blog Post Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-white/70' : 'text-gray-700'
              }`}>
                Filter by Blog Post
              </label>
              <select
                value={selectedBlogPost}
                onChange={(e) => setSelectedBlogPost(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/20 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Blog Posts ({uniqueBlogPosts.length})</option>
                {uniqueBlogPosts.map((blogPostId) => (
                  <option key={blogPostId} value={blogPostId}>
                    {blogPostId} ({comments.filter(c => c.blog_post_id === blogPostId).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-3">
            {(['all', 'pending', 'approved'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                  filter === filterType
                    ? 'bg-gradient-to-r from-[#A8D5BA] to-[#8BC5A8] text-white shadow-lg scale-105'
                    : theme === 'dark'
                      ? 'bg-white/10 text-white/70 hover:bg-white/20'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-[#A8D5BA] hover:text-gray-900 hover:shadow-md'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                {filterType === 'pending' && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {comments.filter(c => !c.is_approved).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </m.div>

        {/* Stats Bar */}
        <m.div
          className={`mb-8 p-4 rounded-xl ${
            theme === 'dark'
              ? 'bg-white/5 border border-white/10'
              : 'bg-white shadow border border-gray-200'
          }`}
          variants={itemVariants}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-black mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {comments.length}
              </div>
              <div className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-green-500 mb-1">
                {comments.filter(c => c.is_approved).length}
              </div>
              <div className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-red-500 mb-1">
                {comments.filter(c => !c.is_approved).length}
              </div>
              <div className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-blue-500 mb-1">
                {filteredComments.length}
              </div>
              <div className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>Filtered</div>
            </div>
          </div>
        </m.div>

        {/* Comments List */}
        {loading ? (
          <m.div
            className="text-center py-16"
            variants={itemVariants}
          >
            <div className={`animate-spin w-12 h-12 mx-auto mb-4 border-4 border-t-transparent rounded-full ${
              theme === 'dark' ? 'border-[#A8D5BA]' : 'border-[#8BC5A8]'
            }`}></div>
            <p className={theme === 'dark' ? 'text-white/70' : 'text-gray-600'}>Loading comments...</p>
          </m.div>
        ) : filteredComments.length === 0 ? (
          <m.div
            className="text-center py-16"
            variants={itemVariants}
          >
            <span className="text-6xl mb-4 block">📭</span>
            <p className={`text-xl mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              No comments found
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
              {searchTerm || selectedBlogPost !== 'all' || filter !== 'all'
                ? 'Try adjusting your filters'
                : 'No comments have been posted yet'
              }
            </p>
          </m.div>
        ) : (
          <m.div
            className="space-y-4"
            variants={containerVariants}
          >
            <AnimatePresence mode="popLayout">
              {filteredComments.map((comment) => (
                <m.div
                  key={comment.id}
                  className={`p-6 rounded-xl border transition-all duration-300 ${
                    comment.is_approved
                      ? theme === 'dark'
                        ? 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10'
                        : 'bg-green-50 border-green-200 hover:bg-green-100'
                      : theme === 'dark'
                        ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10'
                        : 'bg-red-50 border-red-200 hover:bg-red-100'
                  }`}
                  variants={itemVariants}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Comment Header */}
                  <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#A8D5BA] to-[#8BC5A8] flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">
                          {comment.author_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {comment.author_name}
                        </h4>
                        <p className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                          {comment.author_email}
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-white/40' : 'text-gray-400'}`}>
                          {formatCommentDate(comment.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        comment.is_approved
                          ? 'bg-green-500/20 text-green-600'
                          : 'bg-red-500/20 text-red-600'
                      }`}>
                        {comment.is_approved ? '✓ Approved' : '⏳ Pending'}
                      </span>
                      {comment.is_admin_reply && (
                        <span className="bg-gradient-to-r from-[#A8D5BA] to-[#8BC5A8] text-white px-3 py-1 rounded-full text-xs font-medium">
                          👤 Admin
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Blog Post Info */}
                  <div className={`mb-3 pb-3 border-b ${
                    theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                  }`}>
                    <p className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                      📝 Blog Post: <span className="font-mono text-xs">{comment.blog_post_id}</span>
                    </p>
                    {comment.parent_comment_id && (
                      <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                        💬 Reply to: <span className="font-mono text-xs">{comment.parent_comment_id}</span>
                      </p>
                    )}
                  </div>

                  {/* Comment Content */}
                  <div className="mb-4">
                    <p className={`leading-relaxed ${theme === 'dark' ? 'text-white/90' : 'text-gray-800'}`}>
                      {comment.content}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {!comment.is_approved ? (
                      <button
                        onClick={() => handleApprove(comment.id)}
                        style={{
                          backgroundColor: '#10B981',
                          color: '#FFFFFF'
                        }}
                        className="hover:opacity-90 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                      >
                        ✅ Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDisapprove(comment.id)}
                        style={{
                          backgroundColor: '#F97316',
                          color: '#FFFFFF'
                        }}
                        className="hover:opacity-90 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                      >
                        ⏸️ Disapprove
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      style={{
                        backgroundColor: '#EF4444',
                        color: '#FFFFFF'
                      }}
                      className="hover:opacity-90 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                    >
                      🗑️ Delete
                    </button>
                    <Link
                      href={`/blog/${comment.blog_post_id}`}
                      target="_blank"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                        theme === 'dark'
                          ? 'bg-white/10 hover:bg-white/20 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      }`}
                    >
                      🔗 View Post
                    </Link>
                  </div>
                </m.div>
              ))}
            </AnimatePresence>
          </m.div>
        )}
      </m.div>
    </div>
  )
}
