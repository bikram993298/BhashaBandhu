import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001", // your backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Optimize for mobile browsers
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router"],
          "chat-vendor": ["stream-chat", "stream-chat-react"],
          "ui-vendor": ["daisyui"],
        },
      },
    },
  },
  // Optimize for mobile performance
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router",
      "stream-chat",
      "stream-chat-react",
      "@tanstack/react-query",
    ],
  },
});
