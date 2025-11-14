import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBlogImages() {
  console.log('🖼️  Checking blog post cover images...\n');

  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('id, title, slug, language, cover_image_url, published')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching blogs:', error);
    return;
  }

  if (!blogs || blogs.length === 0) {
    console.log('⚠️  No published blogs found.');
    return;
  }

  const withImages = blogs.filter(b => b.cover_image_url && b.cover_image_url.trim() !== '');
  const withoutImages = blogs.filter(b => !b.cover_image_url || b.cover_image_url.trim() === '');

  console.log(`📊 Total published blogs: ${blogs.length}`);
  console.log(`✅ With images: ${withImages.length} (${Math.round(withImages.length/blogs.length*100)}%)`);
  console.log(`❌ Without images: ${withoutImages.length} (${Math.round(withoutImages.length/blogs.length*100)}%)\n`);

  if (withoutImages.length > 0) {
    console.log('\n❌ Blog posts MISSING cover images:\n');
    console.log('═'.repeat(100));

    withoutImages.forEach((blog, index) => {
      console.log(`\n${index + 1}. [${blog.language.toUpperCase()}] ${blog.title}`);
      console.log(`   Slug: ${blog.slug}`);
      console.log(`   URL: https://eastatwest.com/${blog.language}/blog/${blog.slug}`);
      console.log(`   Image URL: ${blog.cover_image_url || '(empty)'}`);
    });

    console.log('\n\n💡 Suggestion: Add cover images to these posts using:');
    console.log('   - Existing images from /images/gallery/ folder');
    console.log('   - Or upload new food photography images\n');
  } else {
    console.log('✅ All blog posts have cover images!\n');
  }

  // Show common image paths being used
  console.log('\n📸 Most used cover images:');
  console.log('═'.repeat(100));
  const imageCounts = withImages.reduce((acc, blog) => {
    const url = blog.cover_image_url || 'unknown';
    acc[url] = (acc[url] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(imageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([url, count]) => {
      console.log(`   ${count}x - ${url}`);
    });
}

checkBlogImages();
