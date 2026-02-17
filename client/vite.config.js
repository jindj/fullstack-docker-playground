import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  cacheDir: "/tmp/vite-cache", // docker build optimize
  server: {
    host: true,
    port: 5173,
    allowedHosts: ["client"],
    proxy: {
      "/api": {
        target: "http://api:3000",
        changeOrigin: true,
      },
    },
  },
});
