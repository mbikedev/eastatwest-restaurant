/** @type {import('next').NextConfig} */
export default {
  // Handle trailing slashes - redirect /page/ to /page
  trailingSlash: false,

  // Permanent redirects for legacy reservation URLs and trailing slash normalization
  async redirects() {
    return [
      // === LEGACY WORDPRESS URL REDIRECTS ===
      // These redirects handle old WordPress URLs that are not indexed by Google

      // 1. Strip Facebook tracking parameters (fbclid)
      {
        source: '/menu',
        has: [{ type: 'query', key: 'fbclid' }],
        destination: '/menu',
        permanent: true,
      },

      // 2. French language URL redirects (/fr/* -> English equivalent)
      // The app uses client-side i18n, not URL-based routing
      // IMPORTANT: /fr/restaurant-libanais-a-bruxelles is NOT redirected - it's a top-ranking SEO page
      { source: '/fr', destination: '/', permanent: true },
      { source: '/fr/about-snack-halal', destination: '/about', permanent: true },
      { source: '/fr/events-catering', destination: '/events-catering', permanent: true },
      { source: '/fr/events-catering-2/aleppo-mix-3', destination: '/menu', permanent: true },
      { source: '/fr/events-catering-2/falafel-3', destination: '/menu', permanent: true },
      { source: '/fr/events-catering-2/iche-2', destination: '/menu', permanent: true },
      { source: '/fr/blog', destination: '/blog', permanent: true },
      { source: '/fr/makdous-3', destination: '/menu', permanent: true },
      { source: '/fr/falafel-2-2', destination: '/menu', permanent: true },
      { source: '/fr/home/iche-2', destination: '/menu', permanent: true },
      { source: '/fr/home/aleppo-mix-3', destination: '/menu', permanent: true },
      { source: '/fr/home/falafel-3', destination: '/menu', permanent: true },

      // French product pages -> /menu
      { source: '/fr/product/humos', destination: '/menu', permanent: true },
      { source: '/fr/product/batata-harra', destination: '/menu', permanent: true },
      { source: '/fr/product/muhammara', destination: '/menu', permanent: true },
      { source: '/fr/product/tochka', destination: '/menu', permanent: true },
      { source: '/fr/product/arayes-cheese', destination: '/menu', permanent: true },
      { source: '/fr/product/foul-moudamas', destination: '/menu', permanent: true },
      { source: '/fr/product/falafel-2', destination: '/menu', permanent: true },
      { source: '/fr/product/falafel', destination: '/menu', permanent: true },
      { source: '/fr/product/falafel-sandwich', destination: '/menu', permanent: true },
      { source: '/fr/product/aleppo-mix', destination: '/menu', permanent: true },
      { source: '/fr/product/iche', destination: '/menu', permanent: true },
      { source: '/fr/product/makdous', destination: '/menu', permanent: true },
      { source: '/fr/product/toshka-2', destination: '/menu', permanent: true },
      { source: '/fr/product/toshka', destination: '/menu', permanent: true },
      { source: '/fr/product/kebbe-frit', destination: '/menu', permanent: true },
      { source: '/fr/product/chich-taouk-2', destination: '/menu', permanent: true },
      { source: '/fr/product/aich-al-saraya', destination: '/menu', permanent: true },
      { source: '/fr/product/menu-east-west', destination: '/menu', permanent: true },
      { source: '/fr/product/menu-vegan', destination: '/menu', permanent: true },
      { source: '/fr/product/poulet-tarator', destination: '/menu', permanent: true },
      { source: '/fr/product/sujuk-2', destination: '/menu', permanent: true },
      { source: '/fr/product/sujuk', destination: '/menu', permanent: true },
      { source: '/fr/product/warak-enab', destination: '/menu', permanent: true },
      { source: '/fr/product/nakanek', destination: '/menu', permanent: true },
      { source: '/fr/product/fromage-syrien-grille', destination: '/menu', permanent: true },
      { source: '/fr/product/set-menu-lareez-vegan', destination: '/menu', permanent: true },
      { source: '/fr/product/grill-mix', destination: '/menu', permanent: true },
      { source: '/fr/product/brochettes-de-kebab', destination: '/menu', permanent: true },
      { source: '/fr/product/kebab', destination: '/menu', permanent: true },
      { source: '/fr/product/rkakat', destination: '/menu', permanent: true },
      { source: '/fr/product/moussakaa', destination: '/menu', permanent: true },
      { source: '/fr/product/moutabal', destination: '/menu', permanent: true },

      // 3. WordPress query parameter redirects
      // Old WordPress post IDs (blog posts)
      { source: '/', has: [{ type: 'query', key: 'p', value: '13403' }], destination: '/blog', permanent: true },
      { source: '/', has: [{ type: 'query', key: 'p', value: '13399' }], destination: '/blog', permanent: true },
      { source: '/', has: [{ type: 'query', key: 'p', value: '13409' }], destination: '/blog', permanent: true },
      { source: '/', has: [{ type: 'query', key: 'p', value: '13413' }], destination: '/blog', permanent: true },
      { source: '/', has: [{ type: 'query', key: 'p', value: '13319' }], destination: '/blog', permanent: true },
      { source: '/', has: [{ type: 'query', key: 'p', value: '13395' }], destination: '/blog', permanent: true },
      { source: '/', has: [{ type: 'query', key: 'p', value: '13417' }], destination: '/blog', permanent: true },
      { source: '/', has: [{ type: 'query', key: 'p', value: '13339' }], destination: '/blog', permanent: true },
      { source: '/', has: [{ type: 'query', key: 'p', value: '13334' }], destination: '/blog', permanent: true },
      { source: '/', has: [{ type: 'query', key: 'p', value: '12865' }], destination: '/blog', permanent: true },
      { source: '/', has: [{ type: 'query', key: 'p', value: '13236' }], destination: '/blog', permanent: true },

      // Old WordPress product IDs -> /menu
      { source: '/', has: [{ type: 'query', key: 'post_type', value: 'product' }], destination: '/menu', permanent: true },

      // Old WordPress page IDs
      { source: '/', has: [{ type: 'query', key: 'page_id', value: '3685' }], destination: '/about', permanent: true },

      // Old WordPress chef pages
      { source: '/', has: [{ type: 'query', key: 'post_type', value: 'ts-chef' }], destination: '/about', permanent: true },

      // Old WordPress attachment IDs -> home
      { source: '/', has: [{ type: 'query', key: 'attachment_id' }], destination: '/', permanent: true },

      // 4. Legacy English product pages -> /menu
      { source: '/product/kebbe-frit', destination: '/menu', permanent: true },
      { source: '/product/set-menu-lareez-vegan', destination: '/menu', permanent: true },
      { source: '/product/batata-harra', destination: '/menu', permanent: true },
      { source: '/product/vegan-grill', destination: '/menu', permanent: true },
      { source: '/product/menu-east-west', destination: '/menu', permanent: true },
      { source: '/product/arayes-cheese', destination: '/menu', permanent: true },
      { source: '/product/iche', destination: '/menu', permanent: true },

      // 5. Legacy pages
      { source: '/about-snack-halal', destination: '/about', permanent: true },
      { source: '/welcome-to-east-at-west', destination: '/blog', permanent: true },
      { source: '/gallery-vegan-dessert', destination: '/gallery', permanent: true },

      // === EXISTING REDIRECTS ===
      // Reservation redirects
      {
        source: '/reservation',
        destination: '/reservations',
        permanent: true,
      },
      {
        source: '/Reservation',
        destination: '/reservations',
        permanent: true,
      },
      {
        source: '/reserve',
        destination: '/reservations',
        permanent: true,
      },
      {
        source: '/booking',
        destination: '/reservations',
        permanent: true,
      },
      // Explicit trailing slash redirects - redirect URLs with trailing slash to without
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
    ];
  },
  images: {
    // Enable modern image formats (AVIF first for better compression - 50% smaller than WebP)
    formats: ['image/avif', 'image/webp'],
    // Mobile-first optimized sizes for better performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    // Aggressive caching for better performance
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    // Enable remote patterns for external images
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'cdn.builder.io',
      },
      {
        protocol: 'https',
        hostname: '**.eastatwest.com',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Optimize images in production, skip in dev for faster builds
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Enable compression
  compress: true,

  // Cache headers for static assets
  async headers() {
    return [
      // Permissions Policy for all pages
      {
        source: '/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'unload=()',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(woff|woff2|ttf|otf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // Experimental features with proper CSS handling
  experimental: {
    optimizeCss: false, // Disable to prevent CSS syntax errors
    optimizeServerReact: true,
    // Tree-shake heavy client-side libraries to reduce JS bundle size
    optimizePackageImports: ['framer-motion', 'lucide-react', 'react-hot-toast'],
    turbopackUseSystemTlsCerts: true, // Fix Google Fonts TLS connection issues
  },
  // SWC compiler optimizations for modern browsers
  compiler: {
    // Remove React DevTools in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Disable source maps in production for better performance
  productionBrowserSourceMaps: false,

  // Target modern environments
  env: {
    NEXT_TELEMETRY_DISABLED: '1',
  },
  // External packages that should not be bundled
  serverExternalPackages: ['@resvg/resvg-js'],
  // Simplified webpack config - avoid over-optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Target ES2022 to eliminate unnecessary polyfills
      // ES2022 includes: Array.at, Object.hasOwn, String.prototype.at
      config.target = ['web', 'es2022']

      // Configure CSS handling to prevent syntax errors
      if (config.optimization.splitChunks?.cacheGroups?.styles) {
        delete config.optimization.splitChunks.cacheGroups.styles
      }
    }
    return config
  },
  // Turbopack configuration (now stable)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
}