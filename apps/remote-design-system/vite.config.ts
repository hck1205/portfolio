import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const entry = {
  index: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
  register: fileURLToPath(new URL("./src/register.ts", import.meta.url))
};

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
      fileName: (format, entryName) =>
        format === "es" ? `${entryName}.js` : `${entryName}.cjs`,
      cssFileName: "styles"
    },
    rollupOptions: {
      external: []
    }
  }
});
