import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'



export default defineConfig({
  server: {
    host: "0.0.0.0"
  },

  plugins: [
    react(),
    tailwindcss(),
 VitePWA({
  registerType: "autoUpdate",
  injectRegister: null,
  disable: true,
  manifest: {
    name: "Walletly",
    short_name: "Walletly",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icons/last192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/last512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  }
})
  ]
})
