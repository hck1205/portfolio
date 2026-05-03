import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Descriptions.stories.css";
import { defineDsDescriptions, type DescriptionsLayout, type DescriptionsSize } from ".";

type DescriptionsStoryArgs = {
  bordered: boolean;
  colon: boolean;
  column: number;
  layout: DescriptionsLayout;
  size: DescriptionsSize;
  title: string;
};

const defaultArgs = {
  bordered: false,
  colon: true,
  column: 3,
  layout: "horizontal",
  size: "middle",
  title: "User Info"
} satisfies DescriptionsStoryArgs;

const storyDescriptions = {
  default: "Read-only details are grouped into clear label and value pairs.",
  bordered: "Bordered mode uses one-pixel shared borders and subtle label backgrounds.",
  vertical: "Vertical layout places each label above its content for dense detail views.",
  sizes: "Small, middle, and large sizes adjust cell density without changing the API.",
  span: "Span and filled items support wider rows for long descriptive content."
};

const baseItems = [
  ["UserName", "Kim Minjun"],
  ["Telephone", "010-1234-5678"],
  ["Live", "Seoul, Korea"],
  ["Remark", "Active customer"],
  ["Address", "12 Teheran-ro, Gangnam-gu, Seoul"],
  ["Status", "Running"]
] as const;

function ensureDescriptionsDefined() {
  defineDsDescriptions();
}

function createItem(label: string, content: string | Node, span?: number | "filled") {
  const item = document.createElement("ds-descriptions-item");

  item.setAttribute("label", label);

  if (span !== undefined) {
    item.setAttribute("span", String(span));
  }

  if (typeof content === "string") {
    item.textContent = content;
  } else {
    item.append(content);
  }

  return item;
}

function createDescriptions(args: DescriptionsStoryArgs, items: HTMLElement[] = createBaseItems()) {
  const element = document.createElement("ds-descriptions");

  element.setAttribute("colon", String(args.colon));
  element.setAttribute("column", String(args.column));
  element.setAttribute("layout", args.layout);
  element.setAttribute("size", args.size);
  element.setAttribute("title", args.title);
  element.toggleAttribute("bordered", args.bordered);
  element.append(...items);

  return element;
}

function createBaseItems() {
  return baseItems.map(([label, content]) => createItem(label, content));
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-descriptions-story-frame";
  frame.append(...children);

  return frame;
}

function createStack(children: HTMLElement[]) {
  const stack = document.createElement("div");

  stack.className = "ds-descriptions-story-stack";
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

function renderDefault(args: DescriptionsStoryArgs) {
  ensureDescriptionsDefined();

  return createFrame([createDescriptions(args)]);
}

function renderBordered(args: DescriptionsStoryArgs) {
  ensureDescriptionsDefined();

  const status = document.createElement("span");
  status.className = "ds-descriptions-story-status";
  status.textContent = "Running";

  return createFrame([
    createDescriptions(
      { ...args, bordered: true, title: "Product Info" },
      [
        createItem("Product", "Cloud Database"),
        createItem("Billing Mode", "Prepaid"),
        createItem("Automatic Renewal", "YES"),
        createItem("Order time", "2026-05-03 18:00:00"),
        createItem("Usage Time", "2027-05-03 18:00:00"),
        createItem("Status", status),
        createItem("Config Info", "Database version: 6.0, Package: dedicated, Region: Korea Central", "filled")
      ]
    )
  ]);
}

function renderSizes() {
  ensureDescriptionsDefined();

  return createFrame([
    createStack([
      createDescriptions({ ...defaultArgs, size: "small", title: "Small", bordered: true }, createBaseItems().slice(0, 3)),
      createDescriptions({ ...defaultArgs, size: "middle", title: "Middle", bordered: true }, createBaseItems().slice(0, 3)),
      createDescriptions({ ...defaultArgs, size: "large", title: "Large", bordered: true }, createBaseItems().slice(0, 3))
    ])
  ]);
}

function renderWithExtra(args: DescriptionsStoryArgs) {
  ensureDescriptionsDefined();

  const descriptions = createDescriptions(args);
  const actions = document.createElement("span");
  const edit = document.createElement("a");

  actions.className = "ds-descriptions-story-actions";
  actions.slot = "extra";
  edit.className = "ds-descriptions-story-link";
  edit.href = "#";
  edit.textContent = "Edit";
  actions.append(edit);
  descriptions.append(actions);

  return createFrame([descriptions]);
}

const meta: Meta<DescriptionsStoryArgs> = {
  title: "Components/Data Display/Descriptions",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Descriptions displays multiple read-only fields in a grouped detail layout. It supports bordered cells, horizontal and vertical layouts, responsive columns, item spans, sizes, title, and extra action slots."
      }
    }
  },
  argTypes: {
    bordered: { control: "boolean" },
    colon: { control: "boolean" },
    column: { control: { type: "number", min: 1, max: 6 } },
    layout: {
      control: "inline-radio",
      options: ["horizontal", "vertical"]
    },
    size: {
      control: "inline-radio",
      options: ["small", "middle", "large"]
    },
    title: { control: "text" }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<DescriptionsStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.default)
};

export const Bordered: Story = {
  render: renderBordered,
  parameters: createDocsDescription(storyDescriptions.bordered)
};

export const Vertical: Story = {
  args: {
    bordered: true,
    layout: "vertical",
    title: "Vertical Detail"
  },
  parameters: createDocsDescription(storyDescriptions.vertical)
};

export const Sizes: Story = {
  render: renderSizes,
  parameters: createDocsDescription(storyDescriptions.sizes)
};

export const Extra: Story = {
  render: renderWithExtra,
  parameters: createDocsDescription(storyDescriptions.span)
};
