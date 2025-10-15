import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
        devOptions: {
    enabled: true, // 🔥 activa el SW también en modo dev
  },
      registerType: 'autoUpdate',
      manifest: {
        name: "Mi PWA Pro",
        short_name: "PWAPRO", 
        description: "Aplicación PWA ",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#667eea",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icon-512.png",
            sizes: "512x512", 
            type: "image/png"
          }
        ]
      }
    })
  ]
})
