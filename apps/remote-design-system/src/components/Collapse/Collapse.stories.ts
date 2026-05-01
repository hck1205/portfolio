import type { Meta, StoryObj } from "@storybook/web-components-vite";

import {
  defineDsCollapse,
  type CollapseExpandIconPlacement,
  type CollapseSize
} from ".";

type CollapseStoryArgs = {
  accordion: boolean;
  bordered: boolean;
  defaultActiveKey: string;
  description: string;
  expandIconPlacement: CollapseExpandIconPlacement;
  ghost: boolean;
  size: CollapseSize;
};

const panelText =
  "A content area which can be collapsed and expanded to keep dense information easy to scan.";

const storyDescriptions = {
  default:
    "기본 Collapse입니다. accordion 모드가 켜져 있어 한 번에 하나의 panel만 열립니다.",
  multiple:
    "여러 panel을 동시에 열 수 있는 Collapse입니다. accordion을 끄고 default-active-key에 comma-separated key를 전달합니다.",
  borderless:
    "외곽 border를 제거한 Collapse입니다. 내부 panel의 배경과 구분선은 유지해 영역감은 남깁니다.",
  ghost:
    "외곽 border, 내부 배경, panel 구분선을 최대한 제거한 투명한 Collapse입니다. 본문 안에 자연스럽게 섞이는 표현에 적합합니다.",
  extraAndCollapsible:
    "extra는 header 오른쪽 보조 영역을 보여주고, collapsible은 header 전체, icon만, disabled처럼 클릭 가능한 범위를 제어합니다."
};

/**
 * Storybook canvas가 custom element를 렌더링하기 직전에 Collapse element 등록을 보장합니다.
 *
 * Web Components renderer는 DOM element를 직접 반환하므로 story render 함수 안에서
 * custom element registry를 준비합니다.
 */
function ensureCollapseElementsDefined() {
  defineDsCollapse();
}

/**
 * `ds-collapse-item` element를 생성하고 story content를 light DOM children으로 넣습니다.
 *
 * @param itemKey parent Collapse가 open 상태를 비교할 item key입니다.
 * @param label header에 표시할 label입니다.
 * @param options item별 추가 attribute 설정입니다.
 * @returns Storybook canvas에 붙일 `ds-collapse-item` element입니다.
 */
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

/**
 * 기본 Story에서 반복해서 사용할 Collapse item 세트를 생성합니다.
 *
 * @returns 세 개의 `ds-collapse-item` element 배열입니다.
 */
function createCollapseItems() {
  return [
    createCollapseItem("1", "This is panel header 1"),
    createCollapseItem("2", "This is panel header 2"),
    createCollapseItem("3", "This is panel header 3")
  ];
}

/**
 * Storybook controls의 args를 실제 `ds-collapse` custom element attribute로 매핑합니다.
 *
 * Web Components renderer가 DOM node를 그대로 canvas에 붙일 수 있도록 HTMLElement를 반환합니다.
 *
 * @param args Storybook controls에서 전달되는 Collapse 설정값입니다.
 * @param children Collapse 안에 넣을 item element 목록입니다.
 * @returns Storybook canvas에 표시할 `ds-collapse` element입니다.
 */
function createCollapseElement(
  { accordion, bordered, defaultActiveKey, expandIconPlacement, ghost, size }: CollapseStoryArgs,
  children: HTMLElement[]
) {
  const collapse = document.createElement("ds-collapse");

  collapse.setAttribute("accordion", String(accordion));
  collapse.setAttribute("bordered", String(bordered));
  collapse.setAttribute("default-active-key", defaultActiveKey);
  collapse.setAttribute("expand-icon-placement", expandIconPlacement);
  collapse.setAttribute("ghost", String(ghost));
  collapse.setAttribute("size", size);
  collapse.append(...children);

  return collapse;
}

/**
 * Story 설명과 Collapse 예제를 함께 담는 preview container를 생성합니다.
 *
 * Docs 탭뿐 아니라 Canvas 탭에서도 각 상태의 의미를 바로 확인할 수 있도록
 * Storybook args의 description 값을 화면에 노출합니다.
 *
 * @param args Storybook controls에서 전달되는 Collapse 설정값입니다.
 * @param collapse Storybook canvas에 표시할 Collapse element입니다.
 * @returns 설명 영역과 Collapse를 포함하는 wrapper element입니다.
 */
function createCollapseStoryPreview(args: CollapseStoryArgs, collapse: HTMLElement) {
  const preview = document.createElement("div");
  const description = document.createElement("p");

  preview.className = "ds-collapse-story";
  description.className = "ds-collapse-story__description";
  description.textContent = args.description;
  preview.append(description, collapse);

  return preview;
}

/**
 * 기본 Collapse Story를 렌더링합니다.
 *
 * @param args Storybook controls에서 전달되는 Collapse 설정값입니다.
 * @returns Storybook canvas에 표시할 preview element입니다.
 */
function renderDefaultCollapseStory(args: CollapseStoryArgs) {
  ensureCollapseElementsDefined();

  return createCollapseStoryPreview(
    args,
    createCollapseElement(args, createCollapseItems())
  );
}

/**
 * extra 영역과 collapsible 정책별 동작을 보여주는 Story를 렌더링합니다.
 *
 * @param args Storybook controls에서 전달되는 Collapse 설정값입니다.
 * @returns Storybook canvas에 표시할 preview element입니다.
 */
function renderExtraAndCollapsibleStory(args: CollapseStoryArgs) {
  ensureCollapseElementsDefined();

  return createCollapseStoryPreview(
    args,
    createCollapseElement(args, [
      createCollapseItem("1", "This panel can be collapsed by clicking text or icon", {
        extra: "Extra"
      }),
      createCollapseItem("2", "This panel can only be collapsed by clicking icon", {
        collapsible: "icon"
      }),
      createCollapseItem("3", "This panel cannot be collapsed", {
        collapsible: "disabled"
      })
    ])
  );
}

const meta: Meta<CollapseStoryArgs> = {
  title: "Components/Collapse",
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
    description: {
      table: {
        disable: true
      }
    },
    defaultActiveKey: {
      control: "select",
      options: ["1", "2", "3"]
    },
    expandIconPlacement: {
      control: "inline-radio",
      options: ["start", "end"]
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
    description: storyDescriptions.default,
    expandIconPlacement: "start",
    ghost: false,
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
    defaultActiveKey: "1,2",
    description: storyDescriptions.multiple
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
    bordered: false,
    description: storyDescriptions.borderless
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
    description: storyDescriptions.ghost,
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
  args: {
    description: storyDescriptions.extraAndCollapsible
  },
  render: renderExtraAndCollapsibleStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.extraAndCollapsible
      }
    }
  }
};
