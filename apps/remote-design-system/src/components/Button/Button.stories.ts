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
  default: "Ant Design의 type 축약 값을 DS Web Component API에 매핑한 기본 Button 스토리입니다.",
  variants: "color와 variant 속성이 type 축약 값보다 우선 적용되는 Button 변형입니다.",
  sizes: "small, middle, large 크기의 Button을 확인할 수 있습니다.",
  states: "disabled, loading, danger, ghost, block 상태의 Button입니다.",
  ghost: "Ghost Button은 투명한 배경을 유지하며 색상이 있거나 복잡한 배경 위에서 사용하기 적합합니다.",
  icon: "아이콘 위치를 설정할 수 있는 icon 슬롯 사용 예시입니다.",
  link: "href가 제공될 때 앵커로 렌더링되는 예시입니다."
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

function createGhostPreview() {
  const preview = document.createElement("div");

  preview.className = "ds-button-story-ghost-preview";
  preview.append(
    createButton({ ...defaultButtonArgs, label: "Primary", ghost: true, type: "primary" }),
    createButton({ ...defaultButtonArgs, label: "Default", ghost: true }),
    createButton({ ...defaultButtonArgs, label: "Dashed", ghost: true, type: "dashed" }),
    createButton({ ...defaultButtonArgs, danger: true, ghost: true, label: "Danger", type: "primary" })
  );

  return preview;
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

function renderGhostStory() {
  ensureButtonDefined();

  return createGhostPreview();
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
          "Button은 사용자의 동작을 실행하는 컴포넌트입니다. Ant Design의 Button 개념을 따르면서 DS Web Component 시맨틱과 foundation token을 사용합니다."
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

export const Ghost: Story = {
  render: renderGhostStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.ghost
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
