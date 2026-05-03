import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Empty.stories.css";
import { defineDsEmpty, type EmptySize } from ".";

type EmptyStoryArgs = {
  description: string;
  image: string;
  size: EmptySize;
};

const defaultArgs = {
  description: "No data",
  image: "default",
  size: "middle"
} satisfies EmptyStoryArgs;

const storyDescriptions = {
  default: "Friendly placeholder for empty states.",
  simple: "Simple built-in image for compact components such as selects and tables.",
  customize: "Custom description, image, and action content can be combined.",
  noDescription: "Description can be hidden with `description=false`."
};

function ensureEmptyDefined() {
  defineDsEmpty();
}

function createEmpty(args: EmptyStoryArgs, actionText?: string) {
  const element = document.createElement("ds-empty");

  element.setAttribute("description", args.description);
  element.setAttribute("image", args.image);
  element.setAttribute("size", args.size);

  if (actionText) {
    const button = document.createElement("button");

    button.className = "ds-empty-story-button";
    button.type = "button";
    button.textContent = actionText;
    element.append(button);
  }

  return element;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-empty-story-frame";
  frame.append(...children);

  return frame;
}

function createGrid(children: HTMLElement[]) {
  const grid = document.createElement("div");

  grid.className = "ds-empty-story-grid";
  grid.append(...children);

  return grid;
}

function createPanel(child: HTMLElement) {
  const panel = document.createElement("div");

  panel.className = "ds-empty-story-panel";
  panel.append(child);

  return panel;
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

function renderDefault(args: EmptyStoryArgs) {
  ensureEmptyDefined();

  return createFrame([createEmpty(args)]);
}

function renderSimple() {
  ensureEmptyDefined();

  return createFrame([
    createGrid([
      createPanel(createEmpty({ ...defaultArgs, image: "simple", size: "small" })),
      createPanel(createEmpty({ ...defaultArgs, description: "Data Not Found", image: "simple", size: "small" }))
    ])
  ]);
}

function renderCustomize() {
  ensureEmptyDefined();

  return createFrame([
    createEmpty(
      {
        description: "Create your first dashboard to start tracking important metrics.",
        image: "default",
        size: "middle"
      },
      "Create Now"
    )
  ]);
}

const meta: Meta<EmptyStoryArgs> = {
  title: "Components/Data Display/Empty",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Empty renders a centered placeholder when no data is available. It supports default and simple images, custom image URLs, custom description text, hidden description, size, and footer action content."
      }
    }
  },
  argTypes: {
    description: { control: "text" },
    image: { control: "text" },
    size: {
      control: "inline-radio",
      options: ["middle", "small"]
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<EmptyStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.default)
};

export const SimpleImage: Story = {
  render: renderSimple,
  parameters: createDocsDescription(storyDescriptions.simple)
};

export const Customize: Story = {
  render: renderCustomize,
  parameters: createDocsDescription(storyDescriptions.customize)
};

export const NoDescription: Story = {
  args: {
    description: "false",
    image: "simple"
  },
  parameters: createDocsDescription(storyDescriptions.noDescription)
};
