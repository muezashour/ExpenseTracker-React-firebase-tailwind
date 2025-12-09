import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react(), tailwindcss(),VitePWA({
      registerType: "prompt",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "Walletly",
        short_name: "Walletly",
        start_url: "/",
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
    })],
})
