/** @type {import('next').NextConfig} */
const nextConfig = {
  // Essential for Netlify deployment
  trailingSlash: true,
  
  // Optimize images for Netlify
  images: {
    domains: ['images.unsplash.com', 'assets.buildai.com', 'cdn.jsdelivr.net'],
    unoptimized: true, // Required for static export on Netlify
  },
  
  // Enable experimental features
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Handle SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    // Optimize bundle
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
          },
        },
      };
    }
    
    return config;
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'buildai-production',
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Output configuration for static export (disabled during development)
  // output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Enable SWC minification
  swcMinify: true,
  
  // React strict mode
  reactStrictMode: true,
  
  // ESLint configuration
  eslint: {
    dirs: ['pages', 'utils', 'components', 'lib', 'app'],
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
