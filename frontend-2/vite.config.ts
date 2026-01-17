import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        editor: "public/editor.html",
      },
    },
  },
  server: {
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/editor.html") {
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
        }
        next()
      })
    },
  }
})