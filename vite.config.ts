import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({ registerType: "autoUpdate" })],
  build: {
    sourcemap: true,
  },
  // server: {
  //   host: "192.168.0.190",
  // },
});
