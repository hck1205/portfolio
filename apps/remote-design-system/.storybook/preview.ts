import type { Preview } from "@storybook/nextjs-vite";
import "@portfolio/ui/styles.css";

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
    }
  }
};

export default preview;
