import type { Meta, StoryObj } from "@storybook/web-components-vite";

import { defineDsIcon } from "./registration/defineDsIcon";

defineDsIcon();

type IconStoryArgs = {
  icon: string;
  label: string;
  size: number;
  strokeWidth: number;
};

const meta = {
  title: "Components/Icon",
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: "text"
    },
    label: {
      control: "text"
    },
    size: {
      control: { max: 48, min: 12, step: 1, type: "number" }
    },
    strokeWidth: {
      control: { max: 4, min: 1, step: 0.25, type: "number" }
    }
  },
  args: {
    icon: "list-collapse",
    label: "",
    size: 18,
    strokeWidth: 2
  },
  render: ({ icon, label, size, strokeWidth }) => {
    const element = document.createElement("ds-icon");

    element.setAttribute("icon", icon);
    element.setAttribute("size", String(size));
    element.setAttribute("stroke-width", String(strokeWidth));

    if (label) {
      element.setAttribute("label", label);
      element.setAttribute("decorative", "false");
    }

    return element;
  }
} satisfies Meta<IconStoryArgs>;

export default meta;

type Story = StoryObj<IconStoryArgs>;

export const Basic: Story = {};
