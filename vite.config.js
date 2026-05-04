import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://www.fll-list.vercel.app',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react()
  ],
})