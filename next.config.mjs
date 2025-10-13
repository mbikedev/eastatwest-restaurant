/** @type {import('next').NextConfig} */
export default {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost', 'cdn.builder.io', 'eastatwest.be'],
    // Use WebP only for better Firefox compatibility
    formats: ['image/webp'],
    // Optimized responsive image sizes for better performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    // Enable aggressive image optimization
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Disable unoptimized mode for better cross-browser compatibility
    unoptimized: false,
  },
  // Enable compression
  compress: true,
  // Experimental features with proper CSS handling
  experimental: {
    optimizeCss: false, // Disable to prevent CSS syntax errors
    optimizeServerReact: true,
  },
  // SWC compiler optimizations for modern browsers
  compiler: {
    // Remove React DevTools in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Enable source maps for production debugging
  productionBrowserSourceMaps: true,

  // Target modern environments
  env: {
    NEXT_TELEMETRY_DISABLED: '1',
    // Optimize for modern browsers
    BROWSERSLIST_ENV: 'modern',
  },
  // External packages that should not be bundled
  serverExternalPackages: ['@resvg/resvg-js'],
  // Webpack optimizations for modern browsers
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Target modern browsers to avoid polyfills
      config.target = ['web', 'es2020']
      
      // Configure CSS handling to prevent syntax errors
      if (config.optimization.splitChunks?.cacheGroups?.styles) {
        delete config.optimization.splitChunks.cacheGroups.styles
      }
      
      // Enhanced code splitting for better performance
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        
        // Split large vendor libraries
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          chunks: 'all',
          minChunks: 1,
        },
        
        // Separate Framer Motion into its own chunk
        framerMotion: {
          test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
          name: 'framer-motion',
          priority: 20,
          chunks: 'all',
        },
        
        // Separate React Hot Toast
        reactHotToast: {
          test: /[\\/]node_modules[\\/]react-hot-toast[\\/]/,
          name: 'react-hot-toast',
          priority: 20,
          chunks: 'all',
        },
        
        
        // Component chunks
        components: {
          test: /[\\/]src[\\/]components[\\/]/,
          name: 'components',
          priority: 15,
          chunks: 'all',
          minChunks: 2,
        }
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