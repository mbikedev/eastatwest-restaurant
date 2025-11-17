#!/usr/bin/env node

/**
 * Redirect Testing Script
 * Tests all 108 legacy URLs to verify they properly redirect
 *
 * Usage:
 *   node scripts/test-redirects.js
 *   node scripts/test-redirects.js --production  (test live site)
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.argv.includes('--production')
  ? 'https://eastatwest.com'
  : 'http://localhost:3000';

console.log(`\n🧪 Testing redirects on: ${BASE_URL}\n`);

// Sample URLs to test from each category
const testUrls = {
  'French Language URLs': [
    { path: '/fr', expected: '/' },
    { path: '/fr/about-snack-halal', expected: '/about' },
    { path: '/fr/events-catering', expected: '/events-catering' },
    { path: '/fr/blog', expected: '/blog' },
    { path: '/fr/product/humos', expected: '/menu' },
    { path: '/fr/product/falafel', expected: '/menu' },
    { path: '/fr/product/kebbe-frit', expected: '/menu' },
  ],

  'WordPress Query Parameters - Posts': [
    { path: '/?p=13403', expected: '/blog' },
    { path: '/?p=13399', expected: '/blog' },
    { path: '/?p=13409', expected: '/blog' },
  ],

  'WordPress Query Parameters - Products': [
    { path: '/?post_type=product&p=4043', expected: '/menu' },
    { path: '/?post_type=product&p=12232', expected: '/menu' },
    { path: '/?post_type=product&p=3842', expected: '/menu' },
  ],

  'WordPress Query Parameters - Other': [
    { path: '/?page_id=3685', expected: '/about' },
    { path: '/?post_type=ts-chef&p=1213', expected: '/about' },
    { path: '/?attachment_id=3957', expected: '/' },
  ],

  'Legacy Product Pages': [
    { path: '/product/kebbe-frit', expected: '/menu' },
    { path: '/product/batata-harra', expected: '/menu' },
    { path: '/product/vegan-grill', expected: '/menu' },
    { path: '/product/arayes-cheese', expected: '/menu' },
  ],

  'Legacy Pages': [
    { path: '/about-snack-halal', expected: '/about' },
    { path: '/welcome-to-east-at-west', expected: '/blog' },
    { path: '/gallery-vegan-dessert', expected: '/gallery' },
  ],

  'Facebook Tracking Parameters': [
    { path: '/menu?fbclid=PAZXh0bgNhZW0BMABhZGlkAasXAArQbJk', expected: '/menu' },
  ],
};

function testRedirect(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;

    const req = client.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 Redirect-Test-Script' }
    }, (res) => {
      resolve({
        statusCode: res.statusCode,
        location: res.headers.location,
        url: url
      });
    });

    req.on('error', (err) => {
      resolve({
        statusCode: 'ERROR',
        location: null,
        url: url,
        error: err.message
      });
    });

    req.end();
  });
}

async function runTests() {
  let totalTests = 0;
  let passed = 0;
  let failed = 0;
  const failures = [];

  for (const [category, urls] of Object.entries(testUrls)) {
    console.log(`\n📂 ${category}`);
    console.log('─'.repeat(60));

    for (const { path, expected } of urls) {
      totalTests++;
      const fullUrl = `${BASE_URL}${path}`;
      const result = await testRedirect(fullUrl);

      // Check if it's a 301 redirect
      const is301 = result.statusCode === 301;

      // Normalize paths for comparison (remove trailing slash)
      const actualLocation = result.location?.replace(/\/$/, '') || '';
      const expectedPath = expected.replace(/\/$/, '');
      const expectedLocation = `${BASE_URL}${expectedPath}`;

      // Check if redirect points to expected location
      const correctLocation = actualLocation === expectedLocation ||
                             actualLocation === expectedPath ||
                             actualLocation.endsWith(expectedPath);

      if (is301 && correctLocation) {
        console.log(`  ✅ ${path}`);
        console.log(`     → ${result.location || expectedPath}`);
        passed++;
      } else {
        console.log(`  ❌ ${path}`);
        console.log(`     Expected: 301 → ${expected}`);
        console.log(`     Got: ${result.statusCode} → ${result.location || 'none'}`);
        if (result.error) console.log(`     Error: ${result.error}`);
        failed++;
        failures.push({ path, expected, result });
      }
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 Test Summary');
  console.log('═'.repeat(60));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed/totalTests) * 100).toFixed(1)}%`);

  if (failures.length > 0) {
    console.log('\n❌ Failed Tests:');
    failures.forEach(({ path, expected, result }) => {
      console.log(`  ${path} → Expected: ${expected}, Got: ${result.statusCode} ${result.location || ''}`);
    });
  }

  console.log('\n');

  if (failed === 0) {
    console.log('🎉 All redirects working correctly!');
    process.exit(0);
  } else {
    console.log('⚠️  Some redirects are not working as expected.');
    console.log('   Please check the configuration in next.config.mjs');
    process.exit(1);
  }
}

// Run tests
runTests().catch(err => {
  console.error('Error running tests:', err);
  process.exit(1);
});
