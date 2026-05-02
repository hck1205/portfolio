import {
  ArrowUp,
  Bell,
  Headphones,
  MessageCircle,
  CircleQuestionMark,
  Search,
  createElement as createLucideElement
} from "lucide";
import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./FloatButton.stories.css";
import {
  defineDsFloatButton,
  type FloatButtonGroupPlacement,
  type FloatButtonGroupTrigger,
  type FloatButtonShape,
  type FloatButtonType
} from ".";

type FloatButtonStoryArgs = {
  badge: string;
  content: string;
  disabled: boolean;
  href: string;
  icon: "none" | "search" | "message" | "bell" | "question" | "headphones" | "arrow-up";
  placement: FloatButtonGroupPlacement;
  shape: FloatButtonShape;
  tooltip: string;
  trigger?: FloatButtonGroupTrigger;
  type: FloatButtonType;
};

const storyDescriptions = {
  default: "페이지 어디에서나 접근해야 하는 전역 액션을 고정 위치의 FloatButton으로 제공합니다.",
  type: "type 속성으로 기본 액션과 주요 액션의 시각적 우선순위를 전환합니다.",
  shape: "circle과 square 형태를 지원하며, 텍스트 content는 square 형태에서 사용하기 적합합니다.",
  content: "content 속성으로 짧은 문구를 버튼 안에 표시합니다.",
  tooltip: "tooltip 속성은 native title과 접근 가능한 이름 후보로 사용됩니다.",
  group: "여러 FloatButton을 함께 배치할 때 group으로 묶어 간격과 형태를 일관되게 관리합니다.",
  menu: "trigger를 사용하면 click 또는 hover로 열리는 FloatButton 메뉴를 만들 수 있습니다.",
  placement: "placement 속성으로 메뉴가 펼쳐지는 방향을 지정합니다.",
  backTop: "back-top 버튼은 지정된 스크롤 높이를 넘은 뒤 나타나고 클릭 시 페이지 상단으로 이동합니다.",
  badge: "badge 속성으로 버튼 우측 상단에 짧은 상태 값을 표시합니다."
};

const defaultArgs = {
  badge: "",
  content: "",
  disabled: false,
  href: "",
  icon: "question",
  placement: "top",
  shape: "circle",
  tooltip: "Help",
  trigger: undefined,
  type: "default"
} satisfies FloatButtonStoryArgs;

function ensureFloatButtonDefined() {
  defineDsFloatButton();
}

function createIcon(name: FloatButtonStoryArgs["icon"]) {
  if (name === "none") {
    return undefined;
  }

  const iconMap = {
    "arrow-up": ArrowUp,
    bell: Bell,
    headphones: Headphones,
    message: MessageCircle,
    question: CircleQuestionMark,
    search: Search
  };
  const icon = createLucideElement(iconMap[name], {
    "aria-hidden": "true",
    focusable: "false",
    height: 18,
    width: 18,
    "stroke-width": 2.25
  });
  const wrapper = document.createElement("span");

  wrapper.slot = "icon";
  wrapper.append(icon);

  return wrapper;
}

function createFloatButton(args: FloatButtonStoryArgs) {
  const button = document.createElement("ds-float-button");
  const icon = createIcon(args.icon);

  button.setAttribute("type", args.type);
  button.setAttribute("shape", args.shape);
  button.toggleAttribute("disabled", args.disabled);

  if (args.badge) {
    button.setAttribute("badge", args.badge);
  }

  if (args.content) {
    button.setAttribute("content", args.content);
  }

  if (args.href) {
    button.setAttribute("href", args.href);
    button.setAttribute("target", "_blank");
  }

  if (args.tooltip) {
    button.setAttribute("tooltip", args.tooltip);
  }

  if (icon) {
    button.append(icon);
  }

  return button;
}

function createPreviewFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-float-button-story-frame";
  frame.append(...children);

  return frame;
}

function renderDefault(args: FloatButtonStoryArgs) {
  ensureFloatButtonDefined();

  return createPreviewFrame([createFloatButton(args)]);
}

function renderTypeStory() {
  ensureFloatButtonDefined();

  return createPreviewFrame([
    createFloatButton({ ...defaultArgs, tooltip: "Default" }),
    createFloatButton({ ...defaultArgs, icon: "message", tooltip: "Primary", type: "primary" })
  ]);
}

function renderShapeStory() {
  ensureFloatButtonDefined();

  return createPreviewFrame([
    createFloatButton({ ...defaultArgs, tooltip: "Circle" }),
    createFloatButton({ ...defaultArgs, icon: "headphones", shape: "square", tooltip: "Square" })
  ]);
}

function renderContentStory() {
  ensureFloatButtonDefined();

  return createPreviewFrame([
    createFloatButton({
      ...defaultArgs,
      content: "문의",
      icon: "headphones",
      shape: "square",
      tooltip: "상담 문의",
      type: "primary"
    })
  ]);
}

function renderGroupStory() {
  ensureFloatButtonDefined();

  const group = document.createElement("ds-float-button-group");
  group.setAttribute("shape", "circle");
  group.append(
    createFloatButton({ ...defaultArgs, icon: "search", tooltip: "검색" }),
    createFloatButton({ ...defaultArgs, icon: "bell", tooltip: "알림", badge: "3" }),
    createFloatButton({ ...defaultArgs, icon: "message", tooltip: "메시지", type: "primary" })
  );

  return createPreviewFrame([group]);
}

function renderMenuStory() {
  ensureFloatButtonDefined();

  const group = document.createElement("ds-float-button-group");
  group.setAttribute("trigger", "click");
  group.setAttribute("open", "");
  group.append(
    createFloatButton({ ...defaultArgs, icon: "search", tooltip: "검색" }),
    createFloatButton({ ...defaultArgs, icon: "bell", tooltip: "알림", badge: "3" }),
    createFloatButton({ ...defaultArgs, icon: "message", tooltip: "메시지", type: "primary" })
  );

  return createPreviewFrame([group]);
}

function renderPlacementStory() {
  ensureFloatButtonDefined();

  return createPreviewFrame(
    (["top", "right", "bottom", "left"] as FloatButtonGroupPlacement[]).map((placement) => {
      const group = document.createElement("ds-float-button-group");
      group.setAttribute("trigger", "click");
      group.setAttribute("open", "");
      group.setAttribute("placement", placement);
      group.append(
        createFloatButton({ ...defaultArgs, icon: "search", tooltip: `${placement} 검색` }),
        createFloatButton({ ...defaultArgs, icon: "message", tooltip: `${placement} 메시지` })
      );
      return group;
    })
  );
}

function renderBackTopStory() {
  ensureFloatButtonDefined();

  const button = createFloatButton({
    ...defaultArgs,
    icon: "none",
    tooltip: "맨 위로",
    type: "primary"
  });
  button.setAttribute("back-top", "");
  button.setAttribute("visibility-height", "0");

  return createPreviewFrame([button]);
}

function renderBadgeStory() {
  ensureFloatButtonDefined();

  return createPreviewFrame([
    createFloatButton({ ...defaultArgs, badge: "5", icon: "bell", tooltip: "새 알림" }),
    createFloatButton({ ...defaultArgs, badge: "N", icon: "message", tooltip: "새 메시지", type: "primary" })
  ]);
}

const meta: Meta<FloatButtonStoryArgs> = {
  title: "Components/General/FloatButton",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "FloatButton은 전역 액션을 페이지 위에 고정해 보여주는 컴포넌트입니다. 빠르게 접근해야 하는 보조 액션을 DS Web Component 시맨틱과 foundation token으로 표현합니다."
      }
    }
  },
  argTypes: {
    icon: {
      control: "inline-radio",
      options: ["none", "search", "message", "bell", "question", "headphones", "arrow-up"]
    },
    placement: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"]
    },
    shape: {
      control: "inline-radio",
      options: ["circle", "square"]
    },
    trigger: {
      control: "inline-radio",
      options: [undefined, "click", "hover"]
    },
    type: {
      control: "inline-radio",
      options: ["default", "primary"]
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<FloatButtonStoryArgs>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.default
      }
    }
  }
};

export const Type: Story = {
  render: renderTypeStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.type
      }
    }
  }
};

export const Shape: Story = {
  render: renderShapeStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.shape
      }
    }
  }
};

export const Content: Story = {
  render: renderContentStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.content
      }
    }
  }
};

export const Tooltip: Story = {
  args: {
    tooltip: "도움말"
  },
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.tooltip
      }
    }
  }
};

export const Group: Story = {
  render: renderGroupStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.group
      }
    }
  }
};

export const Menu: Story = {
  render: renderMenuStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.menu
      }
    }
  }
};

export const Placement: Story = {
  render: renderPlacementStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.placement
      }
    }
  }
};

export const BackTop: Story = {
  render: renderBackTopStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.backTop
      }
    }
  }
};

export const Badge: Story = {
  render: renderBadgeStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.badge
      }
    }
  }
};
