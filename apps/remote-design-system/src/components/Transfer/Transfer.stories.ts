import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Transfer.stories.css";
import { defineDsTransfer, type TransferStatus } from ".";

type TransferStoryArgs = {
  dataSource: string;
  disabled: boolean;
  oneWay: boolean;
  showSearch: boolean;
  showSelectAll: boolean;
  status?: TransferStatus;
  targetKeys: string;
  titles: string;
};

const sampleItems = Array.from({ length: 12 }, (_, index) => ({
  description: `Description of item ${index + 1}`,
  key: `item-${index + 1}`,
  title: `Content ${index + 1}`
}));

const defaultArgs = {
  dataSource: JSON.stringify(sampleItems),
  disabled: false,
  oneWay: false,
  showSearch: false,
  showSelectAll: true,
  status: undefined,
  targetKeys: "item-2,item-5",
  titles: "Source,Target"
} satisfies TransferStoryArgs;

const storyDescriptions = {
  default: "기본 Transfer는 왼쪽 목록에서 선택한 항목을 오른쪽 목록으로 이동합니다.",
  search: "show-search를 사용해 각 컬럼 안에서 항목을 검색합니다.",
  oneWay: "one-way 상태에서는 소스에서 타깃으로 이동하는 단방향 액션만 제공합니다.",
  disabled: "disabled 상태에서는 항목 선택과 이동 버튼을 모두 비활성화합니다.",
  status: "error와 warning 상태에서 두 목록의 검증 색상을 표시합니다."
};

function ensureTransferDefined() {
  defineDsTransfer();
}

function createTransfer(args: TransferStoryArgs) {
  const element = document.createElement("ds-transfer");

  element.setAttribute("data-source", args.dataSource);
  element.setAttribute("target-keys", args.targetKeys);
  element.setAttribute("titles", args.titles);
  element.setAttribute("show-select-all", String(args.showSelectAll));
  element.toggleAttribute("disabled", args.disabled);
  element.toggleAttribute("one-way", args.oneWay);
  element.toggleAttribute("show-search", args.showSearch);

  if (args.status) {
    element.setAttribute("status", args.status);
  }

  return element;
}

function createFrame(child: HTMLElement) {
  const frame = document.createElement("div");

  frame.className = "ds-transfer-story-frame";
  frame.append(child);

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

function renderDefault(args: TransferStoryArgs) {
  ensureTransferDefined();

  return createFrame(createTransfer(args));
}

const meta: Meta<TransferStoryArgs> = {
  title: "Components/Data Entry/Transfer",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Transfer는 여러 항목을 소스 목록과 타깃 목록 사이에서 이동시키는 Data Entry 컴포넌트입니다. 검색, 전체 선택, 단방향 이동, 상태 표시와 선택/이동 이벤트를 Web Component API로 제공합니다."
      }
    }
  },
  argTypes: {
    dataSource: { control: "text" },
    disabled: { control: "boolean" },
    oneWay: { control: "boolean" },
    showSearch: { control: "boolean" },
    showSelectAll: { control: "boolean" },
    status: {
      control: "inline-radio",
      options: [undefined, "error", "warning"]
    },
    targetKeys: { control: "text" },
    titles: { control: "text" }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<TransferStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.default)
};

export const Search: Story = {
  args: { showSearch: true },
  parameters: createDocsDescription(storyDescriptions.search)
};

export const OneWay: Story = {
  args: { oneWay: true },
  parameters: createDocsDescription(storyDescriptions.oneWay)
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: createDocsDescription(storyDescriptions.disabled)
};

export const Status: Story = {
  args: { status: "error" },
  parameters: createDocsDescription(storyDescriptions.status)
};
