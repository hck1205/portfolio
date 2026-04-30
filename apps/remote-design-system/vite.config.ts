import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const entry = fileURLToPath(new URL("./src/index.ts", import.meta.url));

export default defineConfig({
  plugins: [
    tailwindcss(),
    dts({
      entryRoot: "src",
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: ["src/**/*.stories.ts", "src/**/*.stories.tsx"],
      insertTypesEntry: true
    })
  ],
  build: {
    lib: {
      entry,
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
      cssFileName: "styles"
    },
    rollupOptions: {
      external: []
    }
  }
});
