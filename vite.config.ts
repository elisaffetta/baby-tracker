import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// Developer: Elisaffetta - https://t.me/elisaffetta
// Removed lovable-tagger import as it's no longer needed

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Developer: Elisaffetta - https://t.me/elisaffetta
    // Removed componentTagger plugin
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
