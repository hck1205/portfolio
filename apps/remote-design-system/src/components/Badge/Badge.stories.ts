import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Badge.stories.css";
import { defineDsBadge, type BadgeSize, type BadgeStatus } from ".";

type BadgeStoryArgs = {
  color: string;
  count: string;
  dot: boolean;
  offset: string;
  overflowCount: number;
  showZero: boolean;
  size: BadgeSize;
  status: BadgeStatus | "";
  text: string;
  title: string;
};

const defaultArgs = {
  color: "",
  count: "5",
  dot: false,
  offset: "",
  overflowCount: 99,
  showZero: false,
  size: "middle",
  status: "",
  text: "",
  title: ""
} satisfies BadgeStoryArgs;

const storyDescriptions = {
  basic: "Badge는 대상 주변에 알림 수나 작은 상태 정보를 표시합니다.",
  color: "color 속성으로 dot 또는 count badge 색상을 바꿀 수 있습니다.",
  overflow: "overflow-count를 넘는 숫자는 축약해서 표시합니다.",
  ribbon: "Ribbon은 카드 같은 콘텐츠 모서리에 보조 라벨을 붙입니다.",
  standalone: "children이 없는 badge는 독립 배지로 표시됩니다.",
  status: "status와 text 조합으로 상태 설명을 표시합니다."
};

function ensureBadgeDefined() {
  defineDsBadge();
}

function createTarget() {
  const target = document.createElement("span");

  target.className = "ds-badge-story-target";

  return target;
}

function createBadge(args: Partial<BadgeStoryArgs> = {}, child: HTMLElement | undefined = createTarget()) {
  const mergedArgs = { ...defaultArgs, ...args };
  const badge = document.createElement("ds-badge");

  badge.setAttribute("count", mergedArgs.count);
  badge.setAttribute("overflow-count", String(mergedArgs.overflowCount));
  badge.setAttribute("show-zero", String(mergedArgs.showZero));
  badge.setAttribute("size", mergedArgs.size);
  badge.toggleAttribute("dot", mergedArgs.dot);
  syncOptionalAttribute(badge, "color", mergedArgs.color);
  syncOptionalAttribute(badge, "offset", mergedArgs.offset);
  syncOptionalAttribute(badge, "status", mergedArgs.status);
  syncOptionalAttribute(badge, "text", mergedArgs.text);
  syncOptionalAttribute(badge, "title", mergedArgs.title);

  if (child) {
    badge.append(child);
  }

  return badge;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-badge-story-frame";
  frame.append(...children);

  return frame;
}

function createCard() {
  const card = document.createElement("div");
  const title = document.createElement("strong");
  const body = document.createElement("span");

  card.className = "ds-badge-story-card";
  title.textContent = "Card with ribbon";
  body.textContent = "Ribbon highlights contextual information.";
  card.append(title, body);

  return card;
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

function renderDefault(args: BadgeStoryArgs) {
  ensureBadgeDefined();

  return createFrame([createBadge(args)]);
}

function renderOverflowStory() {
  ensureBadgeDefined();

  return createFrame([
    createBadge({ count: "99" }),
    createBadge({ count: "100" }),
    createBadge({ count: "1000", overflowCount: 999 })
  ]);
}

function renderStandaloneStory() {
  ensureBadgeDefined();

  return createFrame([createBadge({ count: "25" }), createBadge({ count: "0", showZero: true }), createBadge({ dot: true })]);
}

function renderStatusStory() {
  ensureBadgeDefined();

  return createFrame(
    (["success", "error", "default", "processing", "warning"] as BadgeStatus[]).map((status) =>
      createBadge({ status, text: status }, undefined)
    )
  );
}

function renderColorStory() {
  ensureBadgeDefined();

  return createFrame([
    createBadge({ color: "#1677ff", count: "5" }),
    createBadge({ color: "#52c41a", dot: true }),
    createBadge({ color: "rgb(45, 183, 245)", count: "New" })
  ]);
}

function renderSizeStory() {
  ensureBadgeDefined();

  return createFrame([createBadge({ count: "5", size: "middle" }), createBadge({ count: "5", size: "small" })]);
}

function renderRibbonStory() {
  ensureBadgeDefined();

  const ribbon = document.createElement("ds-badge-ribbon");

  ribbon.setAttribute("text", "New");
  ribbon.append(createCard());

  return createFrame([ribbon]);
}

function syncOptionalAttribute(element: HTMLElement, name: string, value: string) {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
}

const meta: Meta<BadgeStoryArgs> = {
  title: "Components/Data Display/Badge",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Badge는 알림 수, dot, 상태 텍스트, ribbon을 표시하는 Data Display 컴포넌트입니다. Ant Design의 count, overflow, status, color, offset, ribbon 패턴을 Web Component API로 제공합니다."
      }
    }
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["middle", "small"]
    },
    status: {
      control: "inline-radio",
      options: ["", "success", "error", "default", "processing", "warning"]
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<BadgeStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.basic)
};

export const OverflowCount: Story = {
  render: renderOverflowStory,
  parameters: createDocsDescription(storyDescriptions.overflow)
};

export const Standalone: Story = {
  render: renderStandaloneStory,
  parameters: createDocsDescription(storyDescriptions.standalone)
};

export const Status: Story = {
  render: renderStatusStory,
  parameters: createDocsDescription(storyDescriptions.status)
};

export const Colorful: Story = {
  render: renderColorStory,
  parameters: createDocsDescription(storyDescriptions.color)
};

export const Size: Story = {
  render: renderSizeStory,
  parameters: createDocsDescription("Size shows middle and small badges on the same target item.")
};

export const Ribbon: Story = {
  render: renderRibbonStory,
  parameters: createDocsDescription(storyDescriptions.ribbon)
};
