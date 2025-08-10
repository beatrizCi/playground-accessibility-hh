import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/playground-accessibility-hh/' : '/', // <-- root in dev
  server: { open: true } // auto open browser
}))
