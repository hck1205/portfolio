import { Download, Search, createElement as createLucideElement } from "lucide";
import type { Meta, StoryObj } from "@storybook/web-components-vite";

import {
  defineDsButton,
  type ButtonColor,
  type ButtonIconPlacement,
  type ButtonShape,
  type ButtonSize,
  type ButtonType,
  type ButtonVariant
} from ".";

type ButtonStoryArgs = {
  block: boolean;
  color?: ButtonColor;
  danger: boolean;
  disabled: boolean;
  ghost: boolean;
  href: string;
  icon: "none" | "search" | "download";
  iconPlacement: ButtonIconPlacement;
  label: string;
  loading: boolean;
  shape: ButtonShape;
  size: ButtonSize;
  type: ButtonType;
  variant?: ButtonVariant;
};

const storyDescriptions = {
  default: "Default Button story using Ant Design type sugar mapped to the DS Web Component API.",
  variants: "Button variants where color and variant attributes take precedence over type sugar.",
  sizes: "Small, middle, and large Button sizes.",
  states: "Disabled, loading, danger, ghost, and block Button states.",
  icon: "Icon slot usage with configurable icon placement.",
  link: "Anchor rendering when href is provided."
};

const defaultButtonArgs = {
  block: false,
  color: undefined,
  danger: false,
  disabled: false,
  ghost: false,
  href: "",
  icon: "none",
  iconPlacement: "start",
  label: "Button",
  loading: false,
  shape: "default",
  size: "middle",
  type: "default",
  variant: undefined
} satisfies ButtonStoryArgs;

function ensureButtonDefined() {
  defineDsButton();
}

function createIcon(name: ButtonStoryArgs["icon"]) {
  if (name === "none") {
    return undefined;
  }

  const icon = createLucideElement(name === "download" ? Download : Search, {
    "aria-hidden": "true",
    focusable: "false",
    height: 16,
    width: 16,
    "stroke-width": 2.25
  });
  const wrapper = document.createElement("span");

  wrapper.slot = "icon";
  wrapper.append(icon);

  return wrapper;
}

function createButton(args: ButtonStoryArgs) {
  const button = document.createElement("ds-button");
  const icon = createIcon(args.icon);

  button.textContent = args.label;
  button.setAttribute("type", args.type);
  button.setAttribute("size", args.size);
  button.setAttribute("shape", args.shape);
  button.setAttribute("icon-placement", args.iconPlacement);
  button.toggleAttribute("block", args.block);
  button.toggleAttribute("danger", args.danger);
  button.toggleAttribute("disabled", args.disabled);
  button.toggleAttribute("ghost", args.ghost);
  button.toggleAttribute("loading", args.loading);

  if (args.color) {
    button.setAttribute("color", args.color);
  }

  if (args.variant) {
    button.setAttribute("variant", args.variant);
  }

  if (args.href) {
    button.setAttribute("href", args.href);
    button.setAttribute("target", "_blank");
  }

  if (args.shape === "circle") {
    button.setAttribute("aria-label", args.label);
    button.textContent = "";
  }

  if (icon) {
    button.prepend(icon);
  }

  return button;
}

function createButtonRow(children: HTMLElement[]) {
  const row = document.createElement("div");

  row.className = "ds-button-story-row";
  row.append(...children);

  return row;
}

function renderDefaultButton(args: ButtonStoryArgs) {
  ensureButtonDefined();

  return createButton(args);
}

function renderVariantsStory() {
  ensureButtonDefined();

  return createButtonRow([
    createButton({ ...defaultButtonArgs, label: "Solid", color: "primary", variant: "solid" }),
    createButton({ ...defaultButtonArgs, label: "Outlined", color: "primary", variant: "outlined" }),
    createButton({ ...defaultButtonArgs, label: "Dashed", color: "primary", variant: "dashed" }),
    createButton({ ...defaultButtonArgs, label: "Filled", color: "primary", variant: "filled" }),
    createButton({ ...defaultButtonArgs, label: "Text", color: "primary", variant: "text" }),
    createButton({ ...defaultButtonArgs, label: "Link", color: "primary", variant: "link" })
  ]);
}

function renderSizesStory() {
  ensureButtonDefined();

  return createButtonRow([
    createButton({ ...defaultButtonArgs, label: "Large", size: "large" }),
    createButton({ ...defaultButtonArgs, label: "Middle", size: "middle" }),
    createButton({ ...defaultButtonArgs, label: "Small", size: "small" })
  ]);
}

function renderStatesStory() {
  ensureButtonDefined();

  return createButtonRow([
    createButton({ ...defaultButtonArgs, label: "Disabled", disabled: true }),
    createButton({ ...defaultButtonArgs, label: "Loading", loading: true }),
    createButton({ ...defaultButtonArgs, label: "Danger", danger: true, type: "primary" }),
    createButton({ ...defaultButtonArgs, label: "Ghost", ghost: true, type: "primary" }),
    createButton({ ...defaultButtonArgs, block: true, label: "Block" })
  ]);
}

function renderIconStory() {
  ensureButtonDefined();

  return createButtonRow([
    createButton({ ...defaultButtonArgs, icon: "search", label: "Search", type: "primary" }),
    createButton({
      ...defaultButtonArgs,
      icon: "download",
      iconPlacement: "end",
      label: "Download"
    }),
    createButton({
      ...defaultButtonArgs,
      icon: "search",
      label: "Icon only",
      shape: "circle",
      type: "primary"
    })
  ]);
}

function renderLinkStory() {
  ensureButtonDefined();

  return createButtonRow([
    createButton({
      ...defaultButtonArgs,
      href: "https://ant.design/components/button/",
      label: "Anchor"
    }),
    createButton({ ...defaultButtonArgs, label: "Link type", type: "link" })
  ]);
}

const meta: Meta<ButtonStoryArgs> = {
  title: "Components/General/Button",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Button triggers an operation. It follows Ant Design's Button concepts while using DS Web Component semantics and foundation tokens."
      }
    }
  },
  argTypes: {
    color: {
      control: "select",
      options: [undefined, "default", "primary", "danger"]
    },
    icon: {
      control: "inline-radio",
      options: ["none", "search", "download"]
    },
    iconPlacement: {
      control: "inline-radio",
      options: ["start", "end"]
    },
    shape: {
      control: "inline-radio",
      options: ["default", "round", "circle"]
    },
    size: {
      control: "inline-radio",
      options: ["small", "middle", "large"]
    },
    type: {
      control: "inline-radio",
      options: ["default", "primary", "dashed", "text", "link"]
    },
    variant: {
      control: "select",
      options: [undefined, "outlined", "dashed", "solid", "filled", "text", "link"]
    }
  },
  args: defaultButtonArgs,
  render: renderDefaultButton
};

export default meta;

type Story = StoryObj<ButtonStoryArgs>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.default
      }
    }
  }
};

export const Variants: Story = {
  render: renderVariantsStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.variants
      }
    }
  }
};

export const Sizes: Story = {
  render: renderSizesStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.sizes
      }
    }
  }
};

export const States: Story = {
  render: renderStatesStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.states
      }
    }
  }
};

export const Icon: Story = {
  args: {
    icon: "search",
    label: "Search",
    type: "primary"
  },
  render: renderIconStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.icon
      }
    }
  }
};

export const Link: Story = {
  render: renderLinkStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.link
      }
    }
  }
};
