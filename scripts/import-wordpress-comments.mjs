#!/usr/bin/env node

/**
 * WordPress Comments Import Script
 *
 * This script imports comments from a WordPress site into Supabase.
 * It supports two methods:
 * 1. CSV export from WordPress (recommended)
 * 2. Direct WordPress REST API access
 *
 * Usage:
 *   node scripts/import-wordpress-comments.mjs --source=csv --file=comments.csv
 *   node scripts/import-wordpress-comments.mjs --source=api --url=https://old-site.com
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

// Get environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Parse command line arguments
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.split('=')
  acc[key.replace('--', '')] = value
  return acc
}, {})

const SOURCE = args.source || 'csv'
const FILE_PATH = args.file
const WP_URL = args.url

/**
 * Import comments from CSV file
 *
 * CSV Format:
 * comment_ID,comment_post_ID,comment_author,comment_author_email,comment_author_url,comment_content,comment_date,comment_approved,comment_parent
 */
async function importFromCSV(filePath) {
  console.log(`📄 Reading CSV file: ${filePath}`)

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }

  const csvContent = fs.readFileSync(filePath, 'utf-8')
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  })

  console.log(`✅ Found ${records.length} comments in CSV`)

  let imported = 0
  let skipped = 0
  let errors = 0

  for (const record of records) {
    try {
      // Map WordPress post ID to slug (you'll need to customize this mapping)
      const blogPostSlug = mapPostIdToSlug(record.comment_post_ID)

      if (!blogPostSlug) {
        console.warn(`⚠️  Skipping comment ${record.comment_ID}: No slug mapping for post ${record.comment_post_ID}`)
        skipped++
        continue
      }

      const commentData = {
        blog_post_id: blogPostSlug,
        author_name: record.comment_author || 'Anonymous',
        author_email: record.comment_author_email || null,
        author_website: record.comment_author_url || null,
        content: record.comment_content,
        created_at: record.comment_date,
        is_approved: record.comment_approved === '1',
        parent_comment_id: record.comment_parent !== '0' ? record.comment_parent : null,
        is_admin_reply: false
      }

      const { error } = await supabase
        .from('comments')
        .insert([commentData])

      if (error) {
        console.error(`❌ Failed to import comment ${record.comment_ID}:`, error.message)
        errors++
      } else {
        imported++
        if (imported % 10 === 0) {
          console.log(`📊 Progress: ${imported} imported, ${skipped} skipped, ${errors} errors`)
        }
      }

      // Rate limiting - avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100))

    } catch (err) {
      console.error(`❌ Error processing comment ${record.comment_ID}:`, err.message)
      errors++
    }
  }

  return { imported, skipped, errors }
}

/**
 * Import comments from WordPress REST API
 *
 * Requires WordPress REST API to be accessible
 */
async function importFromWordPressAPI(wpUrl) {
  console.log(`🌐 Fetching comments from WordPress: ${wpUrl}`)

  const commentsUrl = `${wpUrl}/wp-json/wp/v2/comments?per_page=100`

  try {
    let page = 1
    let hasMore = true
    let imported = 0
    let skipped = 0
    let errors = 0

    while (hasMore) {
      console.log(`📥 Fetching page ${page}...`)

      const response = await fetch(`${commentsUrl}&page=${page}`)

      if (!response.ok) {
        if (response.status === 400 && page > 1) {
          // No more pages
          hasMore = false
          break
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const comments = await response.json()

      if (comments.length === 0) {
        hasMore = false
        break
      }

      console.log(`✅ Found ${comments.length} comments on page ${page}`)

      for (const comment of comments) {
        try {
          // Get post slug from post ID
          const postResponse = await fetch(`${wpUrl}/wp-json/wp/v2/posts/${comment.post}`)
          const post = await postResponse.json()

          const commentData = {
            blog_post_id: post.slug,
            author_name: comment.author_name || 'Anonymous',
            author_email: comment.author_email || null,
            author_website: comment.author_url || null,
            content: comment.content.rendered.replace(/<[^>]*>/g, ''), // Strip HTML
            created_at: comment.date,
            is_approved: comment.status === 'approved',
            parent_comment_id: comment.parent !== 0 ? comment.parent : null,
            is_admin_reply: false
          }

          const { error } = await supabase
            .from('comments')
            .insert([commentData])

          if (error) {
            console.error(`❌ Failed to import comment ${comment.id}:`, error.message)
            errors++
          } else {
            imported++
          }

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 200))

        } catch (err) {
          console.error(`❌ Error processing comment ${comment.id}:`, err.message)
          errors++
        }
      }

      page++
    }

    return { imported, skipped, errors }

  } catch (error) {
    console.error('❌ Failed to fetch from WordPress API:', error.message)
    throw error
  }
}

/**
 * Map WordPress post IDs to blog post slugs
 *
 * IMPORTANT: You need to customize this function to match your WordPress post IDs
 * to your new blog post slugs in Supabase.
 *
 * Example mappings:
 */
function mapPostIdToSlug(postId) {
  const mapping = {
    // Add your WordPress post ID to slug mappings here
    // Example:
    // '123': 'vegetarian-restaurant-brussels',
    // '456': 'lebanese-cuisine-guide',
    // '789': 'best-falafel-recipe',
  }

  return mapping[postId] || null
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 WordPress Comments Import Script')
  console.log('====================================\n')

  let stats

  if (SOURCE === 'csv') {
    if (!FILE_PATH) {
      console.error('❌ Missing --file parameter')
      console.error('Usage: node scripts/import-wordpress-comments.mjs --source=csv --file=comments.csv')
      process.exit(1)
    }

    stats = await importFromCSV(FILE_PATH)

  } else if (SOURCE === 'api') {
    if (!WP_URL) {
      console.error('❌ Missing --url parameter')
      console.error('Usage: node scripts/import-wordpress-comments.mjs --source=api --url=https://old-site.com')
      process.exit(1)
    }

    stats = await importFromWordPressAPI(WP_URL)

  } else {
    console.error('❌ Invalid source. Use --source=csv or --source=api')
    process.exit(1)
  }

  console.log('\n✅ Import Complete!')
  console.log('===================')
  console.log(`Imported: ${stats.imported}`)
  console.log(`Skipped:  ${stats.skipped}`)
  console.log(`Errors:   ${stats.errors}`)
}

main().catch(error => {
  console.error('\n❌ Fatal Error:', error.message)
  process.exit(1)
})
