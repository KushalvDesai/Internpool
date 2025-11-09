import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy API endpoints to backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      // Use regex to only proxy /student/* API calls, not /student page route
      '^/student/.*': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      // Use regex to only proxy /faculty/* API calls, not /faculty page route
      '^/faculty/.*': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      // Use regex to only proxy /admin/* API calls, not /admin page route
      '^/admin/.*': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
