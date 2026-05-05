import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Fornecedores Cobija',
        short_name: 'Cobija',
        description: 'Checklist de verificação de fornecedores em Cobija, Bolivia',
        theme_color: '#0f172a',
        background_color: '#f8fafc',
        display: 'standalone',
        lang: 'pt-BR',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  base: process.env.GITHUB_PAGES ? '/checklist-fornecedores-cobija/' : '/',
  server: {
    port: 3000,
    open: true
  }
})
