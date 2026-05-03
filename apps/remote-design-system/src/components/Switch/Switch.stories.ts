import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Switch.stories.css";
import { defineDsSwitch, type SwitchSize } from ".";

type SwitchStoryArgs = {
  checked: boolean;
  checkedChildren: string;
  disabled: boolean;
  loading: boolean;
  size: SwitchSize;
  uncheckedChildren: string;
};

const defaultArgs = {
  checked: false,
  checkedChildren: "",
  disabled: false,
  loading: false,
  size: "medium",
  uncheckedChildren: ""
} satisfies SwitchStoryArgs;

const storyDescriptions = {
  default: "기본 Switch는 클릭 즉시 켜짐과 꺼짐 상태를 전환합니다.",
  disabled: "disabled 상태에서는 사용자 입력을 막고 현재 상태만 표시합니다.",
  content: "checked-children과 unchecked-children으로 상태별 짧은 텍스트를 표시합니다.",
  sizes: "medium과 small 두 크기를 제공해 밀도 높은 UI에도 배치할 수 있습니다.",
  loading: "loading 상태는 대기 중임을 표시하고 추가 토글 입력을 막습니다."
};

function ensureSwitchDefined() {
  defineDsSwitch();
}

function createSwitch(args: SwitchStoryArgs) {
  const element = document.createElement("ds-switch");

  element.toggleAttribute("checked", args.checked);
  element.toggleAttribute("disabled", args.disabled);
  element.toggleAttribute("loading", args.loading);
  element.setAttribute("size", args.size);

  if (args.checkedChildren) {
    element.setAttribute("checked-children", args.checkedChildren);
  }

  if (args.uncheckedChildren) {
    element.setAttribute("unchecked-children", args.uncheckedChildren);
  }

  return element;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-switch-story-frame";
  frame.append(...children);

  return frame;
}

function createRow(label: string, switchElement: HTMLElement) {
  const row = document.createElement("div");
  const labelElement = document.createElement("span");

  row.className = "ds-switch-story-row";
  labelElement.className = "ds-switch-story-label";
  labelElement.textContent = label;
  row.append(labelElement, switchElement);

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

function renderDefault(args: SwitchStoryArgs) {
  ensureSwitchDefined();

  return createFrame([createSwitch(args)]);
}

function renderDisabledStory() {
  ensureSwitchDefined();

  return createFrame([
    createRow("꺼짐", createSwitch({ ...defaultArgs, disabled: true })),
    createRow("켜짐", createSwitch({ ...defaultArgs, checked: true, disabled: true }))
  ]);
}

function renderContentStory() {
  ensureSwitchDefined();

  return createFrame([
    createRow("한글", createSwitch({ ...defaultArgs, checkedChildren: "켜짐", uncheckedChildren: "꺼짐" })),
    createRow("숫자", createSwitch({ ...defaultArgs, checkedChildren: "1", uncheckedChildren: "0" })),
    createRow("영문", createSwitch({ ...defaultArgs, checked: true, checkedChildren: "ON", uncheckedChildren: "OFF" }))
  ]);
}

function renderSizesStory() {
  ensureSwitchDefined();

  return createFrame([
    createRow("medium", createSwitch({ ...defaultArgs })),
    createRow("small", createSwitch({ ...defaultArgs, size: "small" }))
  ]);
}

function renderLoadingStory() {
  ensureSwitchDefined();

  return createFrame([
    createRow("꺼짐", createSwitch({ ...defaultArgs, loading: true })),
    createRow("켜짐", createSwitch({ ...defaultArgs, checked: true, loading: true }))
  ]);
}

const meta: Meta<SwitchStoryArgs> = {
  title: "Components/Data Entry/Switch",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Switch는 두 상태 사이를 즉시 전환하는 Data Entry 컴포넌트입니다. checked, default-checked, value alias, loading, disabled, 상태별 짧은 콘텐츠를 Web Component API로 제공합니다."
      }
    }
  },
  argTypes: {
    checked: {
      control: "boolean"
    },
    checkedChildren: {
      control: "text"
    },
    disabled: {
      control: "boolean"
    },
    loading: {
      control: "boolean"
    },
    size: {
      control: "inline-radio",
      options: ["medium", "small"]
    },
    uncheckedChildren: {
      control: "text"
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<SwitchStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.default)
};

export const Disabled: Story = {
  render: renderDisabledStory,
  parameters: createDocsDescription(storyDescriptions.disabled)
};

export const Content: Story = {
  render: renderContentStory,
  parameters: createDocsDescription(storyDescriptions.content)
};

export const Sizes: Story = {
  render: renderSizesStory,
  parameters: createDocsDescription(storyDescriptions.sizes)
};

export const Loading: Story = {
  render: renderLoadingStory,
  parameters: createDocsDescription(storyDescriptions.loading)
};
