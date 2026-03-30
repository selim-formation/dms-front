import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import fs from "fs";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      // routesDirectory: "./src/routes",
      // generatedRouteTree: "./src/routeTree.gen.ts",
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "dms.test",
    port: 5173,
    https: {
      key: fs.readFileSync("./certs/dms.test-key.pem"),
      cert: fs.readFileSync("./certs/dms.test.pem"),
    },
    open: true,
    proxy: {
      // Proxy all API requests to the backend
      '/api': {
        target: 'https://dms.formation-obs.com',
        changeOrigin: true,
        rewrite: (path) => path,
      },
      // Proxy tenant-specific routes
      '/:tenant/api': {
        target: 'https://dms.formation-obs.com',
        changeOrigin: true,
        rewrite: (path) => path,
      },
      // Proxy sanctum cookie endpoint
      '/sanctum': {
        target: 'https://dms.formation-obs.com',
        changeOrigin: true,
        rewrite: (path) => path,
      },
    }
  }
});
