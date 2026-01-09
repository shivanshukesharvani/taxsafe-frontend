import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
      "@shared": path.resolve(process.cwd(), "../shared"),
      // Block backend-only modules from being bundled
      "drizzle-orm": "false",
      "drizzle-orm/pg-core": "false",
      "shared/schema": "false",
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});