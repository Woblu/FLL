import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        // Use the single-level *.vercel.app host; www.fll-list.vercel.app is not on the cert (nested subdomain).
        target: 'https://fll-list.vercel.app',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react()
  ],
})