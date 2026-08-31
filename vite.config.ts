import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import fs from "fs";
import path from "path";

const COLOR_PALETTES: Record<string, string> = {
  "dms-professional": "./src/config/color-palette.json",
  "formation-obs": "./src/config/color-palette.formation-obs.json",
};
// const DEFAULT_COLOR_PALETTE = "dms-professional";
const DEFAULT_COLOR_PALETTE = "formation-obs";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const paletteName = env.COLOR_PALETTE ?? DEFAULT_COLOR_PALETTE;
  const palettePath =
    COLOR_PALETTES[paletteName] ?? COLOR_PALETTES[DEFAULT_COLOR_PALETTE];

  return {
    plugins: [
      tanstackRouter({
        // routesDirectory: "./src/routes",
        // generatedRouteTree: "./src/routeTree.gen.ts",
        target: "react",
        autoCodeSplitting: true,
      }),
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@color-palette": path.resolve(__dirname, palettePath),
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
        "/api": {
          target: "https://dms.test",
          changeOrigin: true,
          rewrite: (path) => path,
        },
        // Proxy tenant-specific routes
        "/:tenant/api": {
          target: "https://dms.test",
          changeOrigin: true,
          rewrite: (path) => path,
        },
        // Proxy sanctum cookie endpoint
        "/sanctum": {
          target: "https://dms.test",
          changeOrigin: true,
          rewrite: (path) => path,
        },
      },
    },
  };
});
