import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";

const meta = {
  title: "Design System/Button",
  component: Button,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
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
    children: "Button",
    tone: "primary",
    size: "md"
  }
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Neutral: Story = {
  args: {
    children: "Neutral",
    tone: "neutral"
  }
};

export const Danger: Story = {
  args: {
    children: "Delete",
    tone: "danger"
  }
};
