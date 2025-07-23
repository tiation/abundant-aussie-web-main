/**
 * Deployment Configuration
 * Enterprise-grade deployment settings for multiple environments
 */

const config = {
  // Development Environment
  development: {
    baseUrl: 'http://localhost:3000',
    outputDir: './dist',
    minify: false,
    sourceMaps: true,
    compressionLevel: 0
  },

  // Staging Environment
  staging: {
    baseUrl: 'https://staging-lovable-clone.netlify.app',
    outputDir: './dist',
    minify: true,
    sourceMaps: true,
    compressionLevel: 6
  },

  // Production Environment
  production: {
    baseUrl: 'https://lovable-clone.netlify.app',
    outputDir: './dist',
    minify: true,
    sourceMaps: false,
    compressionLevel: 9,
    optimization: {
      images: true,
      css: true,
      js: true
    }
  },

  // VPS Deployment (using your Hostinger servers)
  vps: {
    staging: {
      host: '145.223.22.9', // docker.tiation.net
      port: 22,
      username: 'root',
      remotePath: '/var/www/lovable-clone-staging',
      baseUrl: 'https://staging.lovable-clone.tiation.net'
    },
    production: {
      host: '89.116.191.60', // ubuntu.sxc.codes
      port: 22,
      username: 'root',
      remotePath: '/var/www/lovable-clone',
      baseUrl: 'https://lovable-clone.sxc.codes'
    }
  },

  // Build settings
  build: {
    assetsDir: 'assets',
    publicPath: '/',
    indexFile: 'index.html',
    excludeFiles: [
      '*.bak',
      '*.backup',
      '.DS_Store',
      'Thumbs.db',
      '*.map'
    ]
  }
};

module.exports = config;
