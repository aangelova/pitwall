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
      "/openf1": {
        target: "https://api.openf1.org/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/openf1/, ""),
      },
      "/jolpica": {
        target: "https://api.jolpi.ca/ergast/f1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/jolpica/, ""),
      },
    },
  },
});