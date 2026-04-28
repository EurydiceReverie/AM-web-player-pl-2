import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      '/jiosaavn-api': {
        target: 'https://www.jiosaavn.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/jiosaavn-api/, '/api.php'),
        secure: false,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
          'Content-Type': 'application/json',
          'Referer': 'https://www.jiosaavn.com/',
          'Origin': 'https://www.jiosaavn.com',
          'Accept': 'application/json, text/plain, */*',
        },
      }
    }
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
