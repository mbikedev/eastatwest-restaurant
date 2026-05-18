import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const { data: blog } = await supabase
    .from('blogs')
    .select('title, meta_title, meta_description, excerpt, cover_image_url, tags, slug')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!blog) {
    return {
      title: 'Blog Post - East At West',
    }
  }

  const title = `${blog.meta_title || blog.title} - East At West`
  const description = blog.meta_description || blog.excerpt || 'Read more on the East At West blog'
  const canonicalUrl = `https://eastatwest.com/blog/${blog.slug}`

  return {
    title,
    description,
    keywords: blog.tags?.join(', ') || 'Lebanese cuisine, Brussels restaurant',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: blog.title,
      description,
      url: canonicalUrl,
      type: 'article',
      images: [blog.cover_image_url || '/images/logo.webp'],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description,
      images: [blog.cover_image_url || '/images/logo.webp'],
    },
  }
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
