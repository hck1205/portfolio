import type { Meta, StoryObj } from "@storybook/web-components-vite";

import { defineDsButton } from "../Button";
import "./Segmented.stories.css";
import { defineDsSegmented, type SegmentedOrientation, type SegmentedShape, type SegmentedSize } from ".";

type SegmentedStoryArgs = {
  block: boolean;
  defaultValue: string;
  disabled: boolean;
  options: string;
  orientation: SegmentedOrientation;
  shape: SegmentedShape;
  size: SegmentedSize;
};

const defaultArgs = {
  block: false,
  defaultValue: "Daily",
  disabled: false,
  options: "Daily,Weekly,Monthly,Quarterly,Yearly",
  orientation: "horizontal",
  shape: "default",
  size: "middle"
} satisfies SegmentedStoryArgs;

const storyDescriptions = {
  default: "가장 기본적인 단일 선택 segmented control입니다.",
  block: "block 모드는 옵션을 부모 너비에 맞춰 균등하게 확장합니다.",
  vertical: "vertical 방향은 옵션을 한 열로 쌓아 표시합니다.",
  round: "round shape은 pill 형태의 segmented 스타일을 표현합니다.",
  disabled: "disabled 상태에서는 옵션 변경을 막습니다.",
  sizes: "small, middle, large 크기는 24px, 32px, 40px 컨트롤 높이에 대응합니다.",
  customRender: "옵션 메타의 icon과 label을 조합해 더 풍부한 항목 UI를 렌더링합니다.",
  dynamic: "옵션을 동적으로 로드해 Segmented의 선택지를 확장합니다."
};

const customRenderOptions = JSON.stringify([
  { icon: "calendar", label: "일별", value: "Daily" },
  { icon: "chart", label: "차트", value: "Chart" },
  { icon: "table", label: "표", value: "Table" }
]);

const dynamicInitialOptions = ["Daily", "Weekly", "Monthly"];
const dynamicAdditionalOptions = ["Quarterly", "Yearly"];

function ensureSegmentedDefined() {
  defineDsSegmented();
}

function ensureStoryElementsDefined() {
  ensureSegmentedDefined();
  defineDsButton();
}

function createSegmented(overrides: Partial<SegmentedStoryArgs> = {}) {
  const args = { ...defaultArgs, ...overrides };
  const element = document.createElement("ds-segmented");

  element.setAttribute("default-value", args.defaultValue);
  element.setAttribute("options", args.options);
  element.setAttribute("orientation", args.orientation);
  element.setAttribute("shape", args.shape);
  element.setAttribute("size", args.size);
  element.toggleAttribute("block", args.block);
  element.toggleAttribute("disabled", args.disabled);

  return element;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-segmented-story-frame";
  frame.append(...children);

  return frame;
}

function createStack(children: HTMLElement[]) {
  const stack = document.createElement("div");

  stack.className = "ds-segmented-story-stack";
  stack.append(...children);

  return stack;
}

function createButton(label: string) {
  const button = document.createElement("ds-button");

  button.setAttribute("type", "default");
  button.setAttribute("size", "middle");
  button.textContent = label;

  return button;
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

function renderDefault(args: SegmentedStoryArgs) {
  ensureSegmentedDefined();

  return createFrame([createSegmented(args)]);
}

function renderSizes() {
  ensureSegmentedDefined();

  return createFrame([
    createStack([
      createSegmented({ size: "small" }),
      createSegmented({ size: "middle" }),
      createSegmented({ size: "large" })
    ])
  ]);
}

function renderCustomRender() {
  ensureSegmentedDefined();

  return createFrame([
    createSegmented({
      defaultValue: "Chart",
      options: customRenderOptions,
      shape: "round"
    })
  ]);
}

function renderDynamic() {
  ensureStoryElementsDefined();

  const stack = createStack([]);
  const segmented = createSegmented({
    options: dynamicInitialOptions.join(",")
  });
  const loadButton = createButton("옵션 더 불러오기");
  let isExpanded = false;

  loadButton.addEventListener("click", () => {
    if (isExpanded) {
      return;
    }

    const nextOptions = [...dynamicInitialOptions, ...dynamicAdditionalOptions];

    segmented.setAttribute("options", nextOptions.join(","));
    loadButton.setAttribute("disabled", "true");
    loadButton.textContent = "모든 옵션을 불러왔습니다";
    isExpanded = true;
  });

  stack.append(segmented, loadButton);

  return createFrame([stack]);
}

const meta: Meta<SegmentedStoryArgs> = {
  title: "Components/Data Display/Segmented",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Segmented는 여러 옵션 중 하나를 선택하는 컨트롤입니다. block 레이아웃, vertical 방향, round shape, disabled 상태, size, name, default value, value, options를 지원합니다."
      }
    }
  },
  argTypes: {
    block: {
      control: "boolean",
      description: "부모 너비에 맞춰 옵션을 균등하게 확장합니다."
    },
    defaultValue: {
      control: "text",
      description: "처음 렌더링될 때 선택할 옵션 값을 설정합니다."
    },
    disabled: {
      control: "boolean",
      description: "전체 세그먼트 컨트롤을 비활성화합니다."
    },
    options: {
      control: "text",
      description:
        "쉼표 문자열 또는 JSON 배열로 옵션을 설정합니다. JSON 옵션은 icon, label, value, disabled를 사용할 수 있습니다."
    },
    orientation: {
      control: "inline-radio",
      description: "옵션을 가로 또는 세로 방향으로 배치합니다.",
      options: ["horizontal", "vertical"]
    },
    shape: {
      control: "inline-radio",
      description: "기본 모서리 또는 둥근 pill 형태를 설정합니다.",
      options: ["default", "round"]
    },
    size: {
      control: "inline-radio",
      description: "컨트롤 크기를 설정합니다.",
      options: ["small", "middle", "large"]
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<SegmentedStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.default)
};

export const Block: Story = {
  args: {
    block: true
  },
  parameters: createDocsDescription(storyDescriptions.block)
};

export const VerticalDirection: Story = {
  args: {
    orientation: "vertical"
  },
  parameters: createDocsDescription(storyDescriptions.vertical)
};

export const Round: Story = {
  args: {
    shape: "round"
  },
  parameters: createDocsDescription(storyDescriptions.round)
};

export const Disabled: Story = {
  args: {
    disabled: true
  },
  parameters: createDocsDescription(storyDescriptions.disabled)
};

export const Sizes: Story = {
  render: renderSizes,
  parameters: createDocsDescription(storyDescriptions.sizes)
};

export const CustomRender: Story = {
  render: renderCustomRender,
  parameters: createDocsDescription(storyDescriptions.customRender)
};

export const Dynamic: Story = {
  render: renderDynamic,
  parameters: createDocsDescription(storyDescriptions.dynamic)
};
