import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./TreeSelect.stories.css";
import {
  defineDsTreeSelect,
  type TreeSelectPlacement,
  type TreeSelectSize,
  type TreeSelectStatus,
  type TreeSelectVariant
} from ".";

type TreeSelectStoryArgs = {
  allowClear: boolean;
  disabled: boolean;
  multiple: boolean;
  open: boolean;
  placeholder: string;
  placement: TreeSelectPlacement;
  showSearch: boolean;
  size: TreeSelectSize;
  status?: TreeSelectStatus;
  treeData: string;
  value?: string;
  variant: TreeSelectVariant;
};

const treeData = JSON.stringify([
  {
    label: "Design System",
    value: "design-system",
    children: [
      { label: "Foundation", value: "foundation" },
      { label: "Components", value: "components" }
    ]
  },
  {
    label: "Application",
    value: "application",
    children: [
      { label: "Dashboard", value: "dashboard" },
      { label: "Settings", value: "settings" }
    ]
  }
]);

const defaultArgs = {
  allowClear: true,
  disabled: false,
  multiple: false,
  open: false,
  placeholder: "Please select",
  placement: "bottomLeft",
  showSearch: false,
  size: "medium",
  status: undefined,
  treeData,
  value: undefined,
  variant: "outlined"
} satisfies TreeSelectStoryArgs;

const storyDescriptions = {
  default: "기본 TreeSelect는 계층형 데이터에서 하나의 값을 선택합니다.",
  multiple: "multiple 상태에서는 여러 노드를 태그 형태로 선택해 표시합니다.",
  search: "show-search를 사용해 노드 라벨과 값으로 목록을 필터링합니다.",
  sizes: "small, medium, large 크기별 입력 높이를 확인합니다.",
  variants: "outlined, filled, borderless, underlined 네 가지 입력 variant를 제공합니다.",
  status: "error와 warning 상태에서 검증 피드백 색상을 표시합니다.",
  placement: "placement 속성으로 팝업이 열리는 위치를 제어합니다."
};

function ensureTreeSelectDefined() {
  defineDsTreeSelect();
}

function createTreeSelect(args: TreeSelectStoryArgs) {
  const element = document.createElement("ds-tree-select");

  element.setAttribute("tree-data", args.treeData);
  element.setAttribute("placeholder", args.placeholder);
  element.setAttribute("placement", args.placement);
  element.setAttribute("size", args.size);
  element.setAttribute("variant", args.variant);
  element.setAttribute("allow-clear", String(args.allowClear));
  element.toggleAttribute("disabled", args.disabled);
  element.toggleAttribute("multiple", args.multiple);
  element.toggleAttribute("open", args.open);
  element.setAttribute("show-search", String(args.showSearch));

  if (args.value !== undefined) {
    element.setAttribute("value", args.value);
  }

  if (args.status) {
    element.setAttribute("status", args.status);
  }

  return element;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-tree-select-story-frame";
  frame.append(...children);

  return frame;
}

function createStack(children: HTMLElement[]) {
  const stack = document.createElement("div");

  stack.className = "ds-tree-select-story-stack";
  stack.append(...children);

  return stack;
}

function createRow(label: string, picker: HTMLElement) {
  const row = document.createElement("div");
  const labelElement = document.createElement("span");

  row.className = "ds-tree-select-story-row";
  labelElement.className = "ds-tree-select-story-label";
  labelElement.textContent = label;
  row.append(labelElement, picker);

  return row;
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

function renderDefault(args: TreeSelectStoryArgs) {
  ensureTreeSelectDefined();

  return createFrame([createTreeSelect(args)]);
}

function renderMultipleStory() {
  ensureTreeSelectDefined();

  return createFrame([
    createTreeSelect({ ...defaultArgs, multiple: true, open: true, showSearch: true, value: "foundation,components" })
  ]);
}

function renderSearchStory() {
  ensureTreeSelectDefined();

  return createFrame([createTreeSelect({ ...defaultArgs, open: true, showSearch: true })]);
}

function renderSizesStory() {
  ensureTreeSelectDefined();

  return createFrame([
    createStack([
      createRow("small", createTreeSelect({ ...defaultArgs, size: "small", value: "foundation" })),
      createRow("medium", createTreeSelect({ ...defaultArgs, size: "medium", value: "components" })),
      createRow("large", createTreeSelect({ ...defaultArgs, size: "large", value: "dashboard" }))
    ])
  ]);
}

function renderVariantsStory() {
  ensureTreeSelectDefined();

  return createFrame([
    createStack([
      createRow("outlined", createTreeSelect({ ...defaultArgs, value: "foundation", variant: "outlined" })),
      createRow("filled", createTreeSelect({ ...defaultArgs, value: "components", variant: "filled" })),
      createRow("borderless", createTreeSelect({ ...defaultArgs, value: "dashboard", variant: "borderless" })),
      createRow("underlined", createTreeSelect({ ...defaultArgs, value: "settings", variant: "underlined" }))
    ])
  ]);
}

function renderStatusStory() {
  ensureTreeSelectDefined();

  return createFrame([
    createStack([
      createRow("error", createTreeSelect({ ...defaultArgs, status: "error", value: "foundation" })),
      createRow("warning", createTreeSelect({ ...defaultArgs, status: "warning", value: "settings" }))
    ])
  ]);
}

function renderPlacementStory() {
  ensureTreeSelectDefined();

  return createFrame([
    createStack([
      createRow("bottomLeft", createTreeSelect({ ...defaultArgs, placement: "bottomLeft", value: "foundation" })),
      createRow("bottomRight", createTreeSelect({ ...defaultArgs, placement: "bottomRight", value: "components" })),
      createRow("topLeft", createTreeSelect({ ...defaultArgs, placement: "topLeft", value: "dashboard" })),
      createRow("topRight", createTreeSelect({ ...defaultArgs, placement: "topRight", value: "settings" }))
    ])
  ]);
}

const meta: Meta<TreeSelectStoryArgs> = {
  title: "Components/Data Entry/TreeSelect",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "TreeSelect는 계층형 데이터에서 값을 선택하는 Data Entry 컴포넌트입니다. 단일/다중 선택, 검색, clear, 크기, 상태, variant, placement를 Web Component API로 제공합니다."
      }
    }
  },
  argTypes: {
    allowClear: { control: "boolean" },
    disabled: { control: "boolean" },
    multiple: { control: "boolean" },
    open: { control: "boolean" },
    placeholder: { control: "text" },
    placement: {
      control: "inline-radio",
      options: ["bottomLeft", "bottomRight", "topLeft", "topRight"]
    },
    showSearch: { control: "boolean" },
    size: {
      control: "inline-radio",
      options: ["small", "medium", "large"]
    },
    status: {
      control: "inline-radio",
      options: [undefined, "error", "warning"]
    },
    treeData: { control: "text" },
    value: { control: "text" },
    variant: {
      control: "inline-radio",
      options: ["outlined", "filled", "borderless", "underlined"]
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<TreeSelectStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.default)
};

export const Multiple: Story = {
  render: renderMultipleStory,
  parameters: createDocsDescription(storyDescriptions.multiple)
};

export const Search: Story = {
  render: renderSearchStory,
  parameters: createDocsDescription(storyDescriptions.search)
};

export const Sizes: Story = {
  render: renderSizesStory,
  parameters: createDocsDescription(storyDescriptions.sizes)
};

export const Variants: Story = {
  render: renderVariantsStory,
  parameters: createDocsDescription(storyDescriptions.variants)
};

export const Status: Story = {
  render: renderStatusStory,
  parameters: createDocsDescription(storyDescriptions.status)
};

export const Placement: Story = {
  render: renderPlacementStory,
  parameters: createDocsDescription(storyDescriptions.placement)
};
