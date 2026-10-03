import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/  --this config designs 
// this way when build make then it uses live url in the development--othherwise localhost url
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // Product/avatar images are stored as relative /uploads/... paths.
      // API calls now hit the backend origin directly (see src/api/client.js).
      '/uploads': { target: 'http://localhost:3008', changeOrigin: true },
    },
  },
})
