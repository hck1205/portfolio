import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Select.stories.css";
import {
  defineDsSelect,
  type SelectMode,
  type SelectPlacement,
  type SelectSize,
  type SelectStatus,
  type SelectVariant
} from ".";

type SelectStoryArgs = {
  allowClear: boolean;
  disabled: boolean;
  maxCount: number;
  mode: SelectMode;
  open: boolean;
  placeholder: string;
  placement: SelectPlacement;
  showSearch: boolean;
  size: SelectSize;
  status: SelectStatus | "";
  value: string;
  variant: SelectVariant;
};

const options = [
  { label: "Apple", value: "apple" },
  { label: "Pear", value: "pear" },
  { label: "Orange", value: "orange" },
  { disabled: true, label: "Disabled", value: "disabled" }
];

const storyDescriptions = {
  default: "기본 Select는 드롭다운에서 하나의 선택지를 고르는 입력입니다.",
  search: "show-search 속성은 옵션 목록을 입력값으로 필터링하는 검색 필드를 표시합니다.",
  multiple: "multiple 모드는 여러 옵션을 태그 형태로 선택합니다.",
  tags: "tags 모드는 여러 값을 태그 형태로 다루며 옵션 기반 선택 UI를 제공합니다.",
  size: "size 속성은 selector의 높이를 small, middle, large로 조정합니다.",
  status: "status 속성은 검증 상태를 error 또는 warning으로 표시합니다.",
  variant: "variant 속성은 outlined, filled, borderless, underlined 스타일을 제공합니다.",
  placement: "placement 속성은 popup이 selector 기준 어느 방향에 붙는지 제어합니다.",
  disabled: "disabled 상태에서는 selector와 option 선택을 비활성화합니다."
};

const defaultArgs = {
  allowClear: false,
  disabled: false,
  maxCount: 0,
  mode: "single",
  open: false,
  placeholder: "Please select",
  placement: "bottomLeft",
  showSearch: false,
  size: "middle",
  status: "",
  value: "",
  variant: "outlined"
} satisfies SelectStoryArgs;

function ensureSelectDefined() {
  defineDsSelect();
}

function createFrame(children: HTMLElement[], className = "") {
  const frame = document.createElement("div");

  frame.className = ["ds-select-story-frame", className].filter(Boolean).join(" ");
  frame.append(...children);

  return frame;
}

function createRow(children: HTMLElement[]) {
  const row = document.createElement("div");

  row.className = "ds-select-story-row";
  row.append(...children);

  return row;
}

function createSelect(args: Partial<SelectStoryArgs> = {}) {
  const mergedArgs = { ...defaultArgs, ...args };
  const select = document.createElement("ds-select");

  select.setAttribute("options", JSON.stringify(options));
  select.setAttribute("placeholder", mergedArgs.placeholder);
  select.setAttribute("placement", mergedArgs.placement);
  select.setAttribute("size", mergedArgs.size);
  select.setAttribute("variant", mergedArgs.variant);
  select.toggleAttribute("allow-clear", mergedArgs.allowClear);
  select.toggleAttribute("disabled", mergedArgs.disabled);
  select.toggleAttribute("open", mergedArgs.open);
  select.toggleAttribute("show-search", mergedArgs.showSearch);
  syncOptionalAttribute(select, "max-count", mergedArgs.maxCount ? String(mergedArgs.maxCount) : "");
  syncOptionalAttribute(select, "mode", mergedArgs.mode === "single" ? "" : mergedArgs.mode);
  syncOptionalAttribute(select, "status", mergedArgs.status);
  syncOptionalAttribute(select, "value", mergedArgs.value);

  return select;
}

function renderDefault(args: SelectStoryArgs) {
  ensureSelectDefined();

  return createFrame([createSelect(args)]);
}

function renderSearchStory() {
  ensureSelectDefined();

  return createFrame([createSelect({ open: true, showSearch: true })]);
}

function renderMultipleStory() {
  ensureSelectDefined();

  return createFrame([
    createSelect({
      allowClear: true,
      mode: "multiple",
      value: JSON.stringify(["apple", "orange"])
    })
  ]);
}

function renderTagsStory() {
  ensureSelectDefined();

  return createFrame([createSelect({ mode: "tags", showSearch: true, value: JSON.stringify(["pear"]) })]);
}

function renderSizeStory() {
  ensureSelectDefined();

  return createFrame((["small", "middle", "large"] as SelectSize[]).map((size) => createSelect({ size, value: "apple" })));
}

function renderStatusStory() {
  ensureSelectDefined();

  return createFrame([
    createRow([
      createSelect({ status: "error", value: "apple" }),
      createSelect({ status: "warning", value: "pear" })
    ])
  ]);
}

function renderVariantStory() {
  ensureSelectDefined();

  return createFrame((["outlined", "filled", "borderless", "underlined"] as SelectVariant[]).map((variant) => createSelect({ value: "apple", variant })));
}

function renderPlacementStory() {
  ensureSelectDefined();

  return createFrame((["bottomLeft", "bottomRight", "topLeft", "topRight"] as SelectPlacement[]).map((placement) => createSelect({ placement, value: "apple" })));
}

function renderDisabledStory() {
  ensureSelectDefined();

  return createFrame([createSelect({ disabled: true, value: "apple" })]);
}

function syncOptionalAttribute(element: HTMLElement, name: string, value: string) {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
}

const meta: Meta<SelectStoryArgs> = {
  title: "Components/Data Entry/Select",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Select는 제한된 선택지 목록을 드롭다운으로 보여주고 하나 또는 여러 값을 선택하는 Data Entry 컴포넌트입니다."
      }
    }
  },
  argTypes: {
    mode: {
      control: "inline-radio",
      options: ["single", "multiple", "tags"]
    },
    placement: {
      control: "select",
      options: ["bottomLeft", "bottomRight", "topLeft", "topRight"]
    },
    size: {
      control: "inline-radio",
      options: ["small", "middle", "large"]
    },
    status: {
      control: "inline-radio",
      options: ["", "error", "warning"]
    },
    variant: {
      control: "inline-radio",
      options: ["outlined", "filled", "borderless", "underlined"]
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<SelectStoryArgs>;

export const Default: Story = { parameters: { docs: { description: { story: storyDescriptions.default } } } };
export const Search: Story = { render: renderSearchStory, parameters: { docs: { description: { story: storyDescriptions.search } } } };
export const Multiple: Story = { render: renderMultipleStory, parameters: { docs: { description: { story: storyDescriptions.multiple } } } };
export const Tags: Story = { render: renderTagsStory, parameters: { docs: { description: { story: storyDescriptions.tags } } } };
export const Size: Story = { render: renderSizeStory, parameters: { docs: { description: { story: storyDescriptions.size } } } };
export const Status: Story = { render: renderStatusStory, parameters: { docs: { description: { story: storyDescriptions.status } } } };
export const Variant: Story = { render: renderVariantStory, parameters: { docs: { description: { story: storyDescriptions.variant } } } };
export const Placement: Story = { render: renderPlacementStory, parameters: { docs: { description: { story: storyDescriptions.placement } } } };
export const Disabled: Story = { render: renderDisabledStory, parameters: { docs: { description: { story: storyDescriptions.disabled } } } };
