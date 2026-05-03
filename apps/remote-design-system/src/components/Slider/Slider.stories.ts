import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Slider.stories.css";
import { defineDsSlider } from ".";

type SliderStoryArgs = {
  defaultValue: string;
  disabled: boolean;
  dots: boolean;
  included: boolean;
  marks: string;
  max: number;
  min: number;
  range: boolean;
  reverse: boolean;
  step: string;
  tooltip: "auto" | "open" | "closed";
  value?: string;
  vertical: boolean;
};

const defaultArgs = {
  defaultValue: "30",
  disabled: false,
  dots: false,
  included: true,
  marks: "",
  max: 100,
  min: 0,
  range: false,
  reverse: false,
  step: "1",
  tooltip: "auto",
  value: undefined,
  vertical: false
} satisfies SliderStoryArgs;

const storyDescriptions = {
  default: "기본 Slider는 지정된 범위 안에서 하나의 값을 선택합니다.",
  range: "range 속성을 사용하면 두 개의 핸들로 시작 값과 끝 값을 함께 조절합니다.",
  disabled: "disabled 상태에서는 값 변경을 막고 비활성 색상으로 현재 값을 표현합니다.",
  marks: "marks와 dots를 함께 사용해 눈금 위치로만 값을 이동하도록 제한합니다.",
  vertical: "vertical 속성은 세로 방향 레일과 핸들 배치를 제공합니다.",
  reverse: "reverse 속성은 값이 증가하는 방향을 반대로 전환합니다.",
  tooltip: "tooltip 속성으로 핸들 값 표시를 자동, 항상 표시, 숨김 상태로 조절합니다."
};

function ensureSliderDefined() {
  defineDsSlider();
}

function createSlider(args: SliderStoryArgs) {
  const slider = document.createElement("ds-slider");

  slider.setAttribute("default-value", args.defaultValue);
  slider.setAttribute("max", String(args.max));
  slider.setAttribute("min", String(args.min));
  slider.setAttribute("step", args.step);
  slider.setAttribute("tooltip", args.tooltip);
  slider.toggleAttribute("disabled", args.disabled);
  slider.toggleAttribute("dots", args.dots);
  slider.setAttribute("included", String(args.included));
  slider.toggleAttribute("range", args.range);
  slider.toggleAttribute("reverse", args.reverse);
  slider.toggleAttribute("vertical", args.vertical);

  if (args.marks) {
    slider.setAttribute("marks", args.marks);
  }

  if (args.value !== undefined) {
    slider.setAttribute("value", args.value);
  }

  return slider;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-slider-story-frame";
  frame.append(...children);

  return frame;
}

function createStack(children: HTMLElement[]) {
  const stack = document.createElement("div");

  stack.className = "ds-slider-story-stack";
  stack.append(...children);

  return stack;
}

function createRow(label: string, slider: HTMLElement) {
  const row = document.createElement("div");
  const labelElement = document.createElement("span");

  row.className = "ds-slider-story-row";
  labelElement.className = "ds-slider-story-label";
  labelElement.textContent = label;
  row.append(labelElement, slider);

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

function renderDefault(args: SliderStoryArgs) {
  ensureSliderDefined();

  return createFrame([createSlider(args)]);
}

function renderRangeStory() {
  ensureSliderDefined();

  return createFrame([
    createStack([
      createRow("기본 범위", createSlider({ ...defaultArgs, defaultValue: "20,60", range: true })),
      createRow("넓은 범위", createSlider({ ...defaultArgs, defaultValue: "10,90", range: true, step: "5" }))
    ])
  ]);
}

function renderDisabledStory() {
  ensureSliderDefined();

  return createFrame([
    createStack([
      createRow("단일", createSlider({ ...defaultArgs, defaultValue: "35", disabled: true })),
      createRow("범위", createSlider({ ...defaultArgs, defaultValue: "20,70", disabled: true, range: true }))
    ])
  ]);
}

function renderMarksStory() {
  ensureSliderDefined();

  return createFrame([
    createSlider({
      ...defaultArgs,
      defaultValue: "40",
      dots: true,
      marks: "0:0,20:20,40:40,60:60,80:80,100:100",
      step: "null",
      tooltip: "open"
    })
  ]);
}

function renderVerticalStory() {
  ensureSliderDefined();

  const frame = document.createElement("div");

  frame.className = "ds-slider-story-vertical";
  frame.append(
    createSlider({ ...defaultArgs, defaultValue: "30", vertical: true }),
    createSlider({
      ...defaultArgs,
      defaultValue: "20,75",
      marks: "0:0,50:50,100:100",
      range: true,
      vertical: true
    })
  );

  return createFrame([frame]);
}

function renderReverseStory() {
  ensureSliderDefined();

  return createFrame([
    createStack([
      createRow("단일", createSlider({ ...defaultArgs, defaultValue: "30", reverse: true })),
      createRow("범위", createSlider({ ...defaultArgs, defaultValue: "20,70", range: true, reverse: true }))
    ])
  ]);
}

function renderTooltipStory() {
  ensureSliderDefined();

  return createFrame([
    createStack([
      createRow("auto", createSlider({ ...defaultArgs, defaultValue: "28", tooltip: "auto" })),
      createRow("open", createSlider({ ...defaultArgs, defaultValue: "52", tooltip: "open" })),
      createRow("closed", createSlider({ ...defaultArgs, defaultValue: "76", tooltip: "closed" }))
    ])
  ]);
}

const meta: Meta<SliderStoryArgs> = {
  title: "Components/Data Entry/Slider",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Slider는 제한된 범위 안에서 연속 값이나 구간 값을 선택하는 Data Entry 컴포넌트입니다. 단일 값, 범위, 눈금, 세로 방향, 반전 방향, 툴팁 표시를 Web Component API로 제공합니다."
      }
    }
  },
  argTypes: {
    defaultValue: {
      control: "text"
    },
    disabled: {
      control: "boolean"
    },
    dots: {
      control: "boolean"
    },
    included: {
      control: "boolean"
    },
    marks: {
      control: "text"
    },
    max: {
      control: "number"
    },
    min: {
      control: "number"
    },
    range: {
      control: "boolean"
    },
    reverse: {
      control: "boolean"
    },
    step: {
      control: "text"
    },
    tooltip: {
      control: "inline-radio",
      options: ["auto", "open", "closed"]
    },
    value: {
      control: "text"
    },
    vertical: {
      control: "boolean"
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<SliderStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.default)
};

export const Range: Story = {
  render: renderRangeStory,
  parameters: createDocsDescription(storyDescriptions.range)
};

export const Disabled: Story = {
  render: renderDisabledStory,
  parameters: createDocsDescription(storyDescriptions.disabled)
};

export const Marks: Story = {
  render: renderMarksStory,
  parameters: createDocsDescription(storyDescriptions.marks)
};

export const Vertical: Story = {
  render: renderVerticalStory,
  parameters: createDocsDescription(storyDescriptions.vertical)
};

export const Reverse: Story = {
  render: renderReverseStory,
  parameters: createDocsDescription(storyDescriptions.reverse)
};

export const Tooltip: Story = {
  render: renderTooltipStory,
  parameters: createDocsDescription(storyDescriptions.tooltip)
};
