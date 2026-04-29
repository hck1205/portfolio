import type { Preview } from "@storybook/nextjs-vite";
import "../src/styles.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    layout: "centered",
    nextjs: {
      appDirectory: true
    },
    options: {
      storySort: {
        order: ["Foundation", ["Tokens"], "Components"]
      }
    }
  }
};

export default preview;
