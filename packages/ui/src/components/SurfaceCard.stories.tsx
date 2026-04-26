import { createElement } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { defineDsButton } from "./Button";
import { defineDsSurfaceCard } from "./SurfaceCard";

defineDsButton();
defineDsSurfaceCard();

type SurfaceCardStoryArgs = {
  body: string;
  eyebrow: string;
  heading: string;
};

const meta = {
  title: "Components/SurfaceCard",
  parameters: {
    layout: "centered"
  },
  args: {
    eyebrow: "Portfolio",
    heading: "Runtime composition",
    body:
      "Shared UI components live in packages/ui and can be rendered inside each micro frontend app."
  },
  render: ({ body, eyebrow, heading }) =>
    createElement("ds-surface-card", { eyebrow, heading }, body)
} satisfies Meta<SurfaceCardStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    body: "Use shared components to keep the host and remotes visually consistent."
  },
  render: ({ body, eyebrow, heading }) =>
    createElement(
      "ds-surface-card",
      { eyebrow, heading },
      createElement("div", { className: "ds-stack" }, [
        createElement("p", { key: "copy" }, body),
        createElement("ds-button", { key: "button" }, "Open remote")
      ])
    )
};
