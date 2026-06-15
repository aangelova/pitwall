import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/f1api": {
        target: "https://f1api.dev",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/f1api/, ""),
      },
    },
  },
});