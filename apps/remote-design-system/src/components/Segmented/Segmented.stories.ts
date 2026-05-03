import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Segmented.stories.css";
import { defineDsSegmented, type SegmentedOrientation, type SegmentedShape, type SegmentedSize } from ".";

type SegmentedStoryArgs = {
  block: boolean;
  defaultValue: string;
  disabled: boolean;
  options: string;
  orientation: SegmentedOrientation;
  shape: SegmentedShape;
  size: SegmentedSize;
};

const defaultArgs = {
  block: false,
  defaultValue: "Daily",
  disabled: false,
  options: "Daily,Weekly,Monthly,Quarterly,Yearly",
  orientation: "horizontal",
  shape: "default",
  size: "middle"
} satisfies SegmentedStoryArgs;

function ensureSegmentedDefined() {
  defineDsSegmented();
}

function createSegmented(args: SegmentedStoryArgs) {
  const element = document.createElement("ds-segmented");

  element.setAttribute("default-value", args.defaultValue);
  element.setAttribute("options", args.options);
  element.setAttribute("orientation", args.orientation);
  element.setAttribute("shape", args.shape);
  element.setAttribute("size", args.size);
  element.toggleAttribute("block", args.block);
  element.toggleAttribute("disabled", args.disabled);

  return element;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-segmented-story-frame";
  frame.append(...children);

  return frame;
}

function createStack(children: HTMLElement[]) {
  const stack = document.createElement("div");

  stack.className = "ds-segmented-story-stack";
  stack.append(...children);

  return stack;
}

function createDocsDescription(story: string) {
  return {
    docs: {
      description: {
        story
      }
    }
  };
}

function renderDefault(args: SegmentedStoryArgs) {
  ensureSegmentedDefined();

  return createFrame([createSegmented(args)]);
}

function renderSizes() {
  ensureSegmentedDefined();

  return createFrame([
    createStack([
      createSegmented({ ...defaultArgs, size: "small" }),
      createSegmented({ ...defaultArgs, size: "middle" }),
      createSegmented({ ...defaultArgs, size: "large" })
    ])
  ]);
}

const meta: Meta<SegmentedStoryArgs> = {
  title: "Components/Data Display/Segmented",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Segmented displays multiple options and lets the user select one. It supports block layout, vertical orientation, round shape, disabled state, sizes, name, default value, value, and options."
      }
    }
  },
  argTypes: {
    block: { control: "boolean" },
    defaultValue: { control: "text" },
    disabled: { control: "boolean" },
    options: { control: "text" },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"]
    },
    shape: {
      control: "inline-radio",
      options: ["default", "round"]
    },
    size: {
      control: "inline-radio",
      options: ["small", "middle", "large"]
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<SegmentedStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription("The most basic single-selection segmented control.")
};

export const Block: Story = {
  args: {
    block: true
  },
  parameters: createDocsDescription("Block mode stretches options to fit the parent width.")
};

export const Vertical: Story = {
  args: {
    orientation: "vertical"
  },
  parameters: createDocsDescription("Vertical orientation stacks options in one column.")
};

export const Round: Story = {
  args: {
    shape: "round"
  },
  parameters: createDocsDescription("Round shape matches Ant Design's pill-like segmented style.")
};

export const Disabled: Story = {
  args: {
    disabled: true
  },
  parameters: createDocsDescription("Disabled state prevents option changes.")
};

export const Sizes: Story = {
  render: renderSizes,
  parameters: createDocsDescription("Small, middle, and large sizes map to 24px, 32px, and 40px controls.")
};
