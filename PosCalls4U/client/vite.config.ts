import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Path resolution for imports
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@utils': resolve(__dirname, './src/utils'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@services': resolve(__dirname, './src/services'),
      '@store': resolve(__dirname, './src/store'),
      '@types': resolve(__dirname, './src/types'),
    },
  },

  // Build optimizations
  build: {
    // Enable source maps for production debugging
    sourcemap: false,
    
    // Minimize CSS
    cssMinify: true,
    
    // Split vendor chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom'],
          
          // Router and state management
          'router-state': ['react-router-dom', '@reduxjs/toolkit', 'react-redux'],
          
          // Data fetching and forms
          'data-forms': ['react-query', 'axios', 'react-hook-form', '@hookform/resolvers'],
          
          // UI and utilities
          'ui-utils': ['react-toastify', 'date-fns', 'yup'],
          
          // Socket.io for real-time features
          'realtime': ['socket.io-client'],
        },
        
        // Optimize chunk naming for caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace(/\.[^/.]+$/, '')
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        
        // Optimize asset naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
            return `img/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext || '')) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
    
    // Optimize target for modern browsers
    target: 'es2020',
    
    // Minimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug'],
      },
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },

  // Development server optimizations
  server: {
    port: 3000,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        ws: true,
      },
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'react-query',
      'axios',
      'react-hook-form',
      'socket.io-client',
    ],
    exclude: ['@testing-library/react', '@testing-library/jest-dom'],
  },

  // CSS optimizations
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/variables.scss";',
      },
    },
  },

  // Enable esbuild for faster builds
  esbuild: {
    target: 'es2020',
    drop: ['console', 'debugger'],
  },

  // Preview configuration
  preview: {
    port: 4173,
    open: true,
  },
});
