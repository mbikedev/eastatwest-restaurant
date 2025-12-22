import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkAndFixBrokenImages() {
  console.log('🔍 Checking all blog posts for broken images...\n');

  const { data: allBlogs, error } = await supabase
    .from('blogs')
    .select('id, title, slug, cover_image_url, published')
    .eq('published', true);

  if (error) {
    console.error('Error fetching blogs:', error);
    return;
  }

  console.log(`📊 Checking ${allBlogs?.length} published blogs...\n`);

  const brokenImages: any[] = [];

  for (const blog of allBlogs || []) {
    const imageUrl = blog.cover_image_url;

    if (!imageUrl || imageUrl.trim() === '') {
      brokenImages.push({ ...blog, reason: 'Empty URL' });
      continue;
    }

    // Check if it's a local path
    if (imageUrl.startsWith('/images/') || imageUrl.startsWith('images/')) {
      const localPath = path.join('./public', imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl);

      if (!fs.existsSync(localPath)) {
        brokenImages.push({ ...blog, reason: `File not found: ${localPath}` });
      }
    } else if (imageUrl.startsWith('https://eastatwest.com/images/')) {
      const relativePath = imageUrl.replace('https://eastatwest.com', '');
      const localPath = path.join('./public', relativePath);

      if (!fs.existsSync(localPath)) {
        brokenImages.push({ ...blog, reason: `File not found: ${localPath}` });
      }
    }
  }

  if (brokenImages.length > 0) {
    console.log(`❌ Found ${brokenImages.length} posts with broken images:\n`);
    console.log('═'.repeat(100));

    for (let i = 0; i < brokenImages.length; i++) {
      const blog = brokenImages[i];
      console.log(`\n${i + 1}. ${blog.title}`);
      console.log(`   Slug: ${blog.slug}`);
      console.log(`   Image URL: ${blog.cover_image_url}`);
      console.log(`   Issue: ${blog.reason}`);
    }

    console.log('\n\n🔧 Fixing broken images...\n');

    // Fix by updating to use set-libanais.webp (which exists)
    for (const blog of brokenImages) {
      const { error: updateError } = await supabase
        .from('blogs')
        .update({ cover_image_url: '/images/gallery/set-libanais.webp' })
        .eq('id', blog.id);

      if (updateError) {
        console.error(`❌ Error updating ${blog.slug}:`, updateError);
      } else {
        console.log(`✅ Fixed: ${blog.title}`);
      }
    }

    console.log('\n✅ All broken images have been fixed!');
  } else {
    console.log('✅ All blog posts have valid image paths!');
  }
}

checkAndFixBrokenImages();
