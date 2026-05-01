import type { Meta, StoryObj } from "@storybook/web-components-vite";

import {
  defineDsCollapse,
  type CollapseExpandIconPlacement,
  type CollapseHeadingLevel,
  type CollapseSize
} from ".";

type CollapseStoryArgs = {
  accordion: boolean;
  bordered: boolean;
  defaultActiveKey: string;
  expandIconPlacement: CollapseExpandIconPlacement;
  ghost: boolean;
  headingLevel: CollapseHeadingLevel;
  size: CollapseSize;
};

const panelText =
  "A content area which can be collapsed and expanded to keep dense information easy to scan.";

const storyDescriptions = {
  default: "기본 Collapse입니다. accordion 모드가 켜져 있어 한 번에 하나의 panel만 열립니다.",
  multiple:
    "여러 panel을 동시에 열 수 있는 Collapse입니다. accordion을 끄고 default-active-key에 comma-separated key를 전달합니다.",
  borderless:
    "외곽 border를 제거한 Collapse입니다. 내부 panel의 배경과 구분선은 유지해 영역감은 남깁니다.",
  ghost:
    "외곽 border, 내부 배경, panel 구분선을 최대한 제거한 투명한 Collapse입니다. 본문 안에 자연스럽게 섞이는 표현에 적합합니다.",
  extraAndCollapsible:
    "extra는 header 오른쪽 보조 영역을 보여주고, collapsible은 header 전체, icon만, disabled처럼 클릭 가능한 범위를 제어합니다."
};

function ensureCollapseElementsDefined() {
  defineDsCollapse();
}

function createCollapseItem(
  itemKey: string,
  label: string,
  options: {
    collapsible?: string;
    extra?: string;
  } = {}
) {
  const item = document.createElement("ds-collapse-item");

  item.setAttribute("item-key", itemKey);
  item.setAttribute("label", label);
  item.textContent = panelText;

  if (options.collapsible) {
    item.setAttribute("collapsible", options.collapsible);
  }

  if (options.extra) {
    item.setAttribute("extra", options.extra);
  }

  return item;
}

function createCollapseItems() {
  return [
    createCollapseItem("1", "This is panel header 1"),
    createCollapseItem("2", "This is panel header 2"),
    createCollapseItem("3", "This is panel header 3")
  ];
}

function createCollapseElement(
  {
    accordion,
    bordered,
    defaultActiveKey,
    expandIconPlacement,
    ghost,
    headingLevel,
    size
  }: CollapseStoryArgs,
  children: HTMLElement[]
) {
  const collapse = document.createElement("ds-collapse");

  collapse.setAttribute("accordion", String(accordion));
  collapse.setAttribute("bordered", String(bordered));
  collapse.setAttribute("default-active-key", defaultActiveKey);
  collapse.setAttribute("expand-icon-placement", expandIconPlacement);
  collapse.setAttribute("ghost", String(ghost));
  collapse.setAttribute("size", size);

  for (const child of children) {
    child.setAttribute("heading-level", String(headingLevel));
  }

  collapse.append(...children);

  return collapse;
}

function renderDefaultCollapseStory(args: CollapseStoryArgs) {
  ensureCollapseElementsDefined();

  return createCollapseElement(args, createCollapseItems());
}

function renderExtraAndCollapsibleStory(args: CollapseStoryArgs) {
  ensureCollapseElementsDefined();

  return createCollapseElement(args, [
    createCollapseItem("1", "This panel can be collapsed by clicking text or icon", {
      extra: "Extra"
    }),
    createCollapseItem("2", "This panel can only be collapsed by clicking icon", {
      collapsible: "icon"
    }),
    createCollapseItem("3", "This panel cannot be collapsed", {
      collapsible: "disabled"
    })
  ]);
}

const meta: Meta<CollapseStoryArgs> = {
  title: "Components/Data Display/Collapse",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Collapse는 여러 content panel을 접고 펼쳐 dense information을 스캔하기 쉽게 만드는 Web Component입니다."
      }
    }
  },
  argTypes: {
    defaultActiveKey: {
      control: "select",
      options: ["1", "2", "3"]
    },
    expandIconPlacement: {
      control: "inline-radio",
      options: ["start", "end"]
    },
    headingLevel: {
      control: "inline-radio",
      options: [1, 2, 3, 4, 5, 6]
    },
    size: {
      control: "inline-radio",
      options: ["small", "middle", "large"]
    }
  },
  args: {
    accordion: true,
    bordered: true,
    defaultActiveKey: "1",
    expandIconPlacement: "start",
    ghost: false,
    headingLevel: 3,
    size: "middle"
  },
  render: renderDefaultCollapseStory
};

export default meta;

type Story = StoryObj<CollapseStoryArgs>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.default
      }
    }
  }
};

export const Multiple: Story = {
  args: {
    accordion: false,
    defaultActiveKey: "1,2"
  },
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.multiple
      }
    }
  }
};

export const Borderless: Story = {
  args: {
    bordered: false
  },
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.borderless
      }
    }
  }
};

export const Ghost: Story = {
  args: {
    bordered: false,
    ghost: true
  },
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.ghost
      }
    }
  }
};

export const ExtraAndCollapsible: Story = {
  render: renderExtraAndCollapsibleStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.extraAndCollapsible
      }
    }
  }
};
