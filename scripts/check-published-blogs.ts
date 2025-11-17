import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPublishedBlogs() {
  console.log('📊 Checking all published blog posts...\n');

  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('id, title, slug, language, published, featured, created_at, reading_time')
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

  console.log(`✅ Found ${blogs.length} published blog posts:\n`);

  // Group by language
  const byLanguage = blogs.reduce((acc, blog) => {
    if (!acc[blog.language]) {
      acc[blog.language] = [];
    }
    acc[blog.language].push(blog);
    return acc;
  }, {} as Record<string, typeof blogs>);

  // Display by language
  Object.entries(byLanguage).forEach(([lang, posts]) => {
    console.log(`\n📝 ${lang.toUpperCase()} (${posts.length} posts):`);
    console.log('═'.repeat(80));

    posts.forEach((blog, index) => {
      console.log(`\n${index + 1}. ${blog.title}`);
      console.log(`   Slug: ${blog.slug}`);
      console.log(`   Featured: ${blog.featured ? '⭐ Yes' : 'No'}`);
      console.log(`   Reading time: ${blog.reading_time} min`);
      console.log(`   Created: ${new Date(blog.created_at).toLocaleDateString()}`);
      console.log(`   URL: https://eastatwest.com/${lang}/blog/${blog.slug}`);
    });
  });

  // Summary
  console.log('\n\n📊 Summary:');
  console.log('═'.repeat(80));
  console.log(`Total published: ${blogs.length}`);
  console.log(`Featured: ${blogs.filter(b => b.featured).length}`);
  console.log(`Languages: ${Object.keys(byLanguage).join(', ')}`);

  Object.entries(byLanguage).forEach(([lang, posts]) => {
    console.log(`  - ${lang.toUpperCase()}: ${posts.length} posts`);
  });
}

checkPublishedBlogs();
