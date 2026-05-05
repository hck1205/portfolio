import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Popover.stories.css";
import { defineDsButton } from "../Button";
import { createDsButton } from "../shared/stories/storyElements";
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
  content: "추가 정보나 간단한 액션을 담을 수 있습니다.",
  defaultOpen: false,
  placement: "top",
  title: "제목",
  trigger: "hover"
} satisfies PopoverStoryArgs;

const storyDescriptions = {
  default: "트리거 주변에 추가 정보를 담은 떠 있는 카드가 표시됩니다.",
  triggers: "hover, focus, click, context menu 트리거로 팝오버를 열 수 있습니다.",
  placement: "트리거를 기준으로 열두 가지 위치에 팝오버를 배치합니다.",
  arrow: "말꼬리 표시 여부에 따른 팝오버의 차이를 비교합니다."
};

const triggerExamples = [
  { label: "마우스를 올려보세요", trigger: "hover" },
  { label: "포커스해보세요", trigger: "focus" },
  { label: "클릭해보세요", trigger: "click" }
] satisfies Array<{ label: string; trigger: string }>;

const placementOptions: PopoverPlacement[] = [
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

const arrowExamples = [
  { args: { defaultOpen: true, placement: "top", trigger: "click" }, label: "말꼬리 있음" },
  { args: { arrow: false, defaultOpen: true, placement: "top", trigger: "click" }, label: "말꼬리 없음" }
] satisfies Array<{ args: Partial<PopoverStoryArgs>; label: string }>;

const argDescriptions = {
  arrow: "팝오버 말꼬리 표시 여부를 설정합니다.",
  content: "팝오버 본문에 표시할 내용을 설정합니다.",
  defaultOpen: "처음 렌더링될 때 팝오버를 열린 상태로 표시합니다.",
  placement: "트리거를 기준으로 팝오버가 표시될 위치를 설정합니다.",
  title: "팝오버 상단에 표시할 제목을 설정합니다.",
  trigger: "팝오버를 여는 방식을 설정합니다. hover, focus, click, contextMenu를 사용할 수 있습니다."
};

function ensurePopoverDefined() {
  defineDsPopover();
  defineDsButton();
}

function createPopover(args: PopoverStoryArgs, label = "마우스를 올려보세요") {
  const element = document.createElement("ds-popover");
  const button = createDsButton({ label });

  element.setAttribute("arrow", String(args.arrow));
  element.setAttribute("content", args.content);
  element.setAttribute("placement", args.placement);
  element.setAttribute("title", args.title);
  element.setAttribute("trigger", args.trigger);
  element.toggleAttribute("default-open", args.defaultOpen);
  element.append(button);

  return element;
}

function createGroup(className: string, children: HTMLElement[]) {
  const group = document.createElement("div");

  group.className = className;
  group.append(...children);

  return group;
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

  const row = createGroup(
    "ds-popover-story-row",
    triggerExamples.map((example) => createPopover({ ...defaultArgs, trigger: example.trigger }, example.label))
  );

  return createFrame([row]);
}

function renderPlacements() {
  ensurePopoverDefined();

  const grid = createGroup(
    "ds-popover-story-grid",
    placementOptions.map((placement) => createPopover({ ...defaultArgs, placement }, placement))
  );

  return createFrame([grid]);
}

function renderArrowComparison() {
  ensurePopoverDefined();

  const row = createGroup(
    "ds-popover-story-row",
    arrowExamples.map((example) => createPopover({ ...defaultArgs, ...example.args }, example.label))
  );

  return createFrame([row]);
}

const meta: Meta<PopoverStoryArgs> = {
  title: "Components/Data Display/Popover",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Popover는 트리거 주변에 추가 정보나 액션을 담은 떠 있는 카드를 표시합니다. 제목, 콘텐츠, 말꼬리, hover/focus/click/context menu 트리거, 제어 가능한 open 상태, 열두 가지 placement를 제공합니다."
      }
    }
  },
  argTypes: {
    arrow: {
      control: "boolean",
      description: argDescriptions.arrow
    },
    content: {
      control: "text",
      description: argDescriptions.content
    },
    defaultOpen: {
      control: "boolean",
      description: argDescriptions.defaultOpen
    },
    placement: {
      control: "select",
      description: argDescriptions.placement,
      options: placementOptions
    },
    title: {
      control: "text",
      description: argDescriptions.title
    },
    trigger: {
      control: "text",
      description: argDescriptions.trigger
    }
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
  render: renderArrowComparison,
  parameters: createDocsDescription(storyDescriptions.arrow)
};
