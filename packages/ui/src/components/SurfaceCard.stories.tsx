import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";
import { SurfaceCard } from "./SurfaceCard";

const meta = {
  title: "Design System/SurfaceCard",
  component: SurfaceCard,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  args: {
    eyebrow: "Portfolio",
    title: "Runtime composition",
    children:
      "Shared UI components live in packages/ui and can be rendered inside each micro frontend app."
  }
} satisfies Meta<typeof SurfaceCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    children: (
      <div className="ds-stack">
        <p>Use shared components to keep the shell and remotes visually consistent.</p>
        <Button>Open remote</Button>
      </div>
    )
  }
};
