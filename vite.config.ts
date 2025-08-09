import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  base: '/git@github.com:beatrizCi/playground-accessibility-hh.git/', // e.g. '/playground-accessibility-hh/'
})
