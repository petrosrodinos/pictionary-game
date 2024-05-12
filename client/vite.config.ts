import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
    host: true,
    strictPort: true,
    port: 5173,
  },
  optimizeDeps: {
    exclude: ["js-big-decimal"],
  },
  plugins: [react()],
});
