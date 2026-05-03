import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Popover.stories.css";
import { defineDsPopover, type PopoverPlacement } from ".";

type PopoverStoryArgs = {
  arrow: boolean;
  content: string;
  defaultOpen: boolean;
  placement: PopoverPlacement;
  title: string;
  trigger: string;
};

const defaultArgs = {
  arrow: true,
  content: "Popover content can include extra information or actions.",
  defaultOpen: false,
  placement: "top",
  title: "Title",
  trigger: "hover"
} satisfies PopoverStoryArgs;

const storyDescriptions = {
  default: "A floating card appears around the trigger.",
  triggers: "Popover supports hover, focus, click, and context menu triggers.",
  placement: "Twelve placements are available around the trigger.",
  arrow: "Arrow rendering can be disabled."
};

function ensurePopoverDefined() {
  defineDsPopover();
}

function createPopover(args: PopoverStoryArgs, label = "Hover me") {
  const element = document.createElement("ds-popover");
  const button = document.createElement("button");

  element.setAttribute("arrow", String(args.arrow));
  element.setAttribute("content", args.content);
  element.setAttribute("placement", args.placement);
  element.setAttribute("title", args.title);
  element.setAttribute("trigger", args.trigger);
  element.toggleAttribute("default-open", args.defaultOpen);
  button.className = "ds-popover-story-button";
  button.type = "button";
  button.textContent = label;
  element.append(button);

  return element;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-popover-story-frame";
  frame.append(...children);

  return frame;
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

function renderDefault(args: PopoverStoryArgs) {
  ensurePopoverDefined();

  return createFrame([createPopover(args)]);
}

function renderTriggers() {
  ensurePopoverDefined();

  const row = document.createElement("div");

  row.className = "ds-popover-story-row";
  row.append(
    createPopover({ ...defaultArgs, trigger: "hover" }, "Hover me"),
    createPopover({ ...defaultArgs, trigger: "focus" }, "Focus me"),
    createPopover({ ...defaultArgs, trigger: "click" }, "Click me")
  );

  return createFrame([row]);
}

function renderPlacements() {
  ensurePopoverDefined();

  const grid = document.createElement("div");
  const placements: PopoverPlacement[] = [
    "topLeft",
    "top",
    "topRight",
    "leftTop",
    "rightTop",
    "left",
    "right",
    "leftBottom",
    "rightBottom",
    "bottomLeft",
    "bottom",
    "bottomRight"
  ];

  grid.className = "ds-popover-story-grid";
  grid.append(...placements.map((placement) => createPopover({ ...defaultArgs, placement }, placement)));

  return createFrame([grid]);
}

const meta: Meta<PopoverStoryArgs> = {
  title: "Components/Data Display/Popover",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Popover displays a floating card for additional information or actions. It supports title, content, arrow, hover/focus/click/context menu triggers, controlled open state, and twelve placements."
      }
    }
  },
  argTypes: {
    arrow: { control: "boolean" },
    content: { control: "text" },
    defaultOpen: { control: "boolean" },
    placement: {
      control: "select",
      options: [
        "top",
        "topLeft",
        "topRight",
        "bottom",
        "bottomLeft",
        "bottomRight",
        "left",
        "leftTop",
        "leftBottom",
        "right",
        "rightTop",
        "rightBottom"
      ]
    },
    title: { control: "text" },
    trigger: { control: "text" }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<PopoverStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.default)
};

export const Triggers: Story = {
  render: renderTriggers,
  parameters: createDocsDescription(storyDescriptions.triggers)
};

export const Placement: Story = {
  render: renderPlacements,
  parameters: createDocsDescription(storyDescriptions.placement)
};

export const NoArrow: Story = {
  args: {
    arrow: false,
    defaultOpen: true
  },
  parameters: createDocsDescription(storyDescriptions.arrow)
};
