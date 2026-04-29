import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs-vite";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    {
      directory: "../src",
      files: "**/*.stories.@(js|jsx|mjs|ts|tsx)"
    },
    "../src/foundation/registry/story.ts"
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {}
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      tsconfigPath: path.resolve(currentDir, "../tsconfig.json")
    }
  },
  staticDirs: []
};

export default config;
