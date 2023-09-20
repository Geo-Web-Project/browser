import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    fs: {
      strict: false,
    },
  },
  resolve: {
    alias: [
      {
        find: /@geo-web\/mud-world-base-contracts/,
        replacement: path.resolve(
          __dirname,
          "node_modules",
          "@geo-web",
          "mud-world-base-contracts"
        ),
      },
    ],
  },
  build: {
    target: "esnext",
    minify: true,
    sourcemap: true,
  },
});
