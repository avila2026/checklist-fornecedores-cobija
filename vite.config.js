import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? '/checklist-fornecedores-cobija/' : '/',
  server: {
    port: 3000,
    open: true
  }
})
