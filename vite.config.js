import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration optimized for Vercel deployment
export default defineConfig({
  plugins: [react()],
  envPrefix: ["VITE_", "REACT_APP_"],
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Chunk pdfjs separately to avoid bundle size issues
          if (id.includes('pdfjs-dist')) {
            return 'pdfjs'
          }
        },
      },
    },
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
  },
})
