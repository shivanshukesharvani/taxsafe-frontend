import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
      "zod": path.resolve(__dirname, "node_modules", "zod"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});