import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Replace with the tunnel hostname shown in your error
const allowedHosts = [
  'localhost',
  '127.0.0.1',
   // <--- domain
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
     host: true, // allow access from network
    allowedHosts,
  },
})
