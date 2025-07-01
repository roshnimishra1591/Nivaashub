import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0', // Allow access from other devices
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})