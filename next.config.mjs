/** @type {import('next').NextConfig} */
export default {
  // Handle trailing slashes - redirect /page/ to /page
  trailingSlash: false,

  // Permanent redirects for legacy reservation URLs and trailing slash normalization
  async redirects() {
    return [
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
      // Explicit trailing slash redirects for main pages
      {
        source: '/takeaway/',
        destination: '/takeaway',
        permanent: true,
      },
      {
        source: '/blog/',
        destination: '/blog',
        permanent: true,
      },
    ];
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost', 'cdn.builder.io', 'eastatwest.com', 'flagcdn.com'],
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
    // Removed optimizePackageImports - was causing TBT regression
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