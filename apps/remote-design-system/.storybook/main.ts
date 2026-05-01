import type { StorybookConfig } from "@storybook/web-components-vite";

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
    name: "@storybook/web-components-vite",
    options: {}
  },
  typescript: {},
  staticDirs: []
};

export default config;
