import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkTranslationCoverage() {
  console.log('🌍 Checking translation coverage for all blog posts...\n');

  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('id, title, slug, language, published_at, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`📊 Total published blogs: ${blogs?.length}\n`);

  // Group by similar titles to find translation groups
  const titleGroups: Record<string, any[]> = {};

  blogs?.forEach(blog => {
    // Create a normalized title (remove language indicators and normalize)
    let normalizedTitle = blog.title
      .toLowerCase()
      .replace(/^complete guide to /i, 'guide to ')
      .replace(/^comprehensive guide to /i, 'guide to ')
      .replace(/^traditional /i, '')
      .replace(/\s*:\s*.*$/, '') // Remove subtitle after colon
      .replace(/\s+/g, ' ')
      .trim();

    if (!titleGroups[normalizedTitle]) {
      titleGroups[normalizedTitle] = [];
    }
    titleGroups[normalizedTitle].push(blog);
  });

  // Check for incomplete translations
  let incomplete = 0;
  const incompleteGroups: any[] = [];

  Object.entries(titleGroups).forEach(([normalizedTitle, group]) => {
    const hasEN = group.some(b => b.language === 'en');
    const hasFR = group.some(b => b.language === 'fr');
    const hasNL = group.some(b => b.language === 'nl');

    if (group.length > 1 && (!hasEN || !hasFR || !hasNL)) {
      incomplete++;
      incompleteGroups.push({
        title: group[0].title,
        en: group.find(b => b.language === 'en'),
        fr: group.find(b => b.language === 'fr'),
        nl: group.find(b => b.language === 'nl'),
      });
    }
  });

  if (incompleteGroups.length > 0) {
    console.log('❌ Blog posts with INCOMPLETE translations:\n');
    console.log('═'.repeat(100));

    incompleteGroups.forEach((group, idx) => {
      console.log(`\n${idx + 1}. Base Title: ${group.title}`);
      console.log(`   EN: ${group.en ? '✅ ' + group.en.slug : '❌ MISSING'}`);
      console.log(`   FR: ${group.fr ? '✅ ' + group.fr.slug : '❌ MISSING'}`);
      console.log(`   NL: ${group.nl ? '✅ ' + group.nl.slug : '❌ MISSING'}`);
    });
  } else {
    console.log('✅ All blog posts with multiple language versions are fully translated!');
  }

  // Check for standalone posts (only in one language)
  const standalonePosts = Object.entries(titleGroups)
    .filter(([_, group]) => group.length === 1)
    .map(([_, group]) => group[0]);

  if (standalonePosts.length > 0) {
    console.log('\n\n⚠️  Standalone posts (only available in ONE language):\n');
    console.log('═'.repeat(100));

    standalonePosts.forEach((post, idx) => {
      console.log(`\n${idx + 1}. [${post.language.toUpperCase()}] ${post.title}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Created: ${new Date(post.created_at).toLocaleDateString()}`);
    });
  }

  console.log('\n\n📊 Summary:');
  console.log('═'.repeat(100));
  console.log(`Total published: ${blogs?.length}`);
  console.log(`Incomplete translation groups: ${incompleteGroups.length}`);
  console.log(`Standalone posts (no translations): ${standalonePosts.length}`);
  console.log(`Fully translated groups: ${Object.keys(titleGroups).length - incompleteGroups.length - standalonePosts.length}`);
}

checkTranslationCoverage();
