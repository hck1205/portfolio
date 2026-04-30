import type { Preview } from "@storybook/web-components-vite";
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
    options: {
      storySort: {
        order: ["Components", "Icons", ["Lucide"], "Foundation", ["Tokens"]]
      }
    }
  }
};

export default preview;
