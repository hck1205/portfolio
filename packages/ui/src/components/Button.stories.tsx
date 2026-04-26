import { createElement } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { defineDsButton, type ButtonSize, type ButtonTone } from "./Button";

defineDsButton();

type ButtonStoryArgs = {
  disabled: boolean;
  label: string;
  size: ButtonSize;
  tone: ButtonTone;
};

const meta = {
  title: "Components/Button",
  parameters: {
    layout: "centered"
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["primary", "neutral", "danger"]
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md"]
    }
  },
  args: {
    disabled: false,
    label: "Button",
    tone: "primary",
    size: "md"
  },
  render: ({ disabled, label, size, tone }) =>
    createElement("ds-button", { disabled, size, tone }, label)
} satisfies Meta<ButtonStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Neutral: Story = {
  args: {
    label: "Neutral",
    tone: "neutral"
  }
};

export const Danger: Story = {
  args: {
    label: "Delete",
    tone: "danger"
  }
};
