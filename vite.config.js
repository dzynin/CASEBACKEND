// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//   },
//   define: {
//     'process.env': {},
//   },
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,  // Automatically opens the browser when server starts
    strictPort: true, // Prevents Vite from switching to a different port if 3000 is in use
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // Example API proxy target
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Simplified imports with alias
      'react-d3-graph': 'react-d3-graph/lib/index.js',
      '@fortawesome/fontawesome-svg-core': '@fortawesome/fontawesome-svg-core/index.es.js',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,  // Enables source maps for debugging
    chunkSizeWarningLimit: 1000, // Increases chunk size limit warning threshold
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,  // Auto-import global SCSS variables
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'd3-drag',
      'd3-force',
      'd3-shape',
      'd3-selection',
      'd3-zoom',
    ],
  },
  define: {
    'process.env': {
      VITE_API_URL: JSON.stringify(process.env.VITE_API_URL || 'http://localhost:5000'),
    },
  },
  esbuild: {
    jsxInject: `import React from 'react'`, // Automatically inject React for JSX support
  },
});
