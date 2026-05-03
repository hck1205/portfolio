import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./TimePicker.stories.css";
import {
  defineDsTimePicker,
  type TimePickerPlacement,
  type TimePickerSize,
  type TimePickerStatus,
  type TimePickerVariant
} from ".";

type TimePickerStoryArgs = {
  allowClear: boolean;
  defaultValue: string;
  disabled: boolean;
  format: string;
  hourStep: number;
  inputReadOnly: boolean;
  minuteStep: number;
  open: boolean;
  placeholder: string;
  placement: TimePickerPlacement;
  secondStep: number;
  showNow: boolean;
  size: TimePickerSize;
  status?: TimePickerStatus;
  use12Hours: boolean;
  value?: string;
  variant: TimePickerVariant;
};

const defaultArgs = {
  allowClear: true,
  defaultValue: "",
  disabled: false,
  format: "HH:mm:ss",
  hourStep: 1,
  inputReadOnly: false,
  minuteStep: 1,
  open: false,
  placeholder: "Select a time",
  placement: "bottomLeft",
  secondStep: 1,
  showNow: false,
  size: "medium",
  status: undefined,
  use12Hours: false,
  value: undefined,
  variant: "outlined"
} satisfies TimePickerStoryArgs;

const storyDescriptions = {
  default: "기본 TimePicker는 입력 필드를 클릭해 시간 선택 패널을 열고 값을 선택합니다.",
  sizes: "small, medium, large 크기별 입력 높이를 확인합니다.",
  steps: "hour-step, minute-step, second-step으로 표시되는 시간 옵션 간격을 조절합니다.",
  twelveHours: "use12-hours와 12시간 format을 사용해 AM/PM 컬럼을 표시합니다.",
  variants: "outlined, filled, borderless, underlined 네 가지 입력 variant를 제공합니다.",
  status: "error와 warning 상태에서 검증 피드백 색상을 표시합니다.",
  placement: "placement 속성으로 패널이 열리는 방향을 제어합니다.",
  disabled: "disabled 상태에서는 입력과 패널 열기를 막습니다."
};

function ensureTimePickerDefined() {
  defineDsTimePicker();
}

function createTimePicker(args: TimePickerStoryArgs) {
  const element = document.createElement("ds-time-picker");

  element.setAttribute("allow-clear", String(args.allowClear));
  element.setAttribute("format", args.format);
  element.setAttribute("hour-step", String(args.hourStep));
  element.setAttribute("minute-step", String(args.minuteStep));
  element.setAttribute("placeholder", args.placeholder);
  element.setAttribute("placement", args.placement);
  element.setAttribute("second-step", String(args.secondStep));
  element.setAttribute("size", args.size);
  element.setAttribute("variant", args.variant);
  element.toggleAttribute("disabled", args.disabled);
  element.toggleAttribute("input-read-only", args.inputReadOnly);
  element.toggleAttribute("open", args.open);
  element.toggleAttribute("show-now", args.showNow);
  element.toggleAttribute("use12-hours", args.use12Hours);

  if (args.defaultValue) {
    element.setAttribute("default-value", args.defaultValue);
  }

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

  frame.className = "ds-time-picker-story-frame";
  frame.append(...children);

  return frame;
}

function createStack(children: HTMLElement[]) {
  const stack = document.createElement("div");

  stack.className = "ds-time-picker-story-stack";
  stack.append(...children);

  return stack;
}

function createRow(label: string, picker: HTMLElement) {
  const row = document.createElement("div");
  const labelElement = document.createElement("span");

  row.className = "ds-time-picker-story-row";
  labelElement.className = "ds-time-picker-story-label";
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

function renderDefault(args: TimePickerStoryArgs) {
  ensureTimePickerDefined();

  return createFrame([createTimePicker(args)]);
}

function renderSizesStory() {
  ensureTimePickerDefined();

  return createFrame([
    createStack([
      createRow("small", createTimePicker({ ...defaultArgs, size: "small", value: "09:30:00" })),
      createRow("medium", createTimePicker({ ...defaultArgs, size: "medium", value: "10:30:00" })),
      createRow("large", createTimePicker({ ...defaultArgs, size: "large", value: "11:30:00" }))
    ])
  ]);
}

function renderStepsStory() {
  ensureTimePickerDefined();

  return createFrame([
    createTimePicker({
      ...defaultArgs,
      hourStep: 2,
      minuteStep: 15,
      open: true,
      secondStep: 30,
      value: "10:30:00"
    })
  ]);
}

function renderTwelveHoursStory() {
  ensureTimePickerDefined();

  return createFrame([
    createTimePicker({
      ...defaultArgs,
      format: "h:mm:ss a",
      open: true,
      use12Hours: true,
      value: "1:30:00 pm"
    })
  ]);
}

function renderVariantsStory() {
  ensureTimePickerDefined();

  return createFrame([
    createStack([
      createRow("outlined", createTimePicker({ ...defaultArgs, value: "09:00:00", variant: "outlined" })),
      createRow("filled", createTimePicker({ ...defaultArgs, value: "10:00:00", variant: "filled" })),
      createRow("borderless", createTimePicker({ ...defaultArgs, value: "11:00:00", variant: "borderless" })),
      createRow("underlined", createTimePicker({ ...defaultArgs, value: "12:00:00", variant: "underlined" }))
    ])
  ]);
}

function renderStatusStory() {
  ensureTimePickerDefined();

  return createFrame([
    createStack([
      createRow("error", createTimePicker({ ...defaultArgs, status: "error", value: "08:15:00" })),
      createRow("warning", createTimePicker({ ...defaultArgs, status: "warning", value: "18:45:00" }))
    ])
  ]);
}

function renderPlacementStory() {
  ensureTimePickerDefined();

  return createFrame([
    createStack([
      createRow("bottomLeft", createTimePicker({ ...defaultArgs, placement: "bottomLeft", value: "09:00:00" })),
      createRow("bottomRight", createTimePicker({ ...defaultArgs, placement: "bottomRight", value: "10:00:00" })),
      createRow("topLeft", createTimePicker({ ...defaultArgs, placement: "topLeft", value: "11:00:00" })),
      createRow("topRight", createTimePicker({ ...defaultArgs, placement: "topRight", value: "12:00:00" }))
    ])
  ]);
}

function renderDisabledStory() {
  ensureTimePickerDefined();

  return createFrame([createTimePicker({ ...defaultArgs, disabled: true, value: "09:00:00" })]);
}

const meta: Meta<TimePickerStoryArgs> = {
  title: "Components/Data Entry/TimePicker",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "TimePicker는 하루 안의 시간을 직접 입력하거나 패널에서 선택하는 Data Entry 컴포넌트입니다. 시간 간격, 12시간 표기, 크기, 상태, variant, placement, clear 동작을 Web Component API로 제공합니다."
      }
    }
  },
  argTypes: {
    allowClear: { control: "boolean" },
    defaultValue: { control: "text" },
    disabled: { control: "boolean" },
    format: { control: "text" },
    hourStep: { control: "number" },
    inputReadOnly: { control: "boolean" },
    minuteStep: { control: "number" },
    open: { control: "boolean" },
    placeholder: { control: "text" },
    placement: {
      control: "inline-radio",
      options: ["bottomLeft", "bottomRight", "topLeft", "topRight"]
    },
    secondStep: { control: "number" },
    showNow: { control: "boolean" },
    size: {
      control: "inline-radio",
      options: ["small", "medium", "large"]
    },
    status: {
      control: "inline-radio",
      options: [undefined, "error", "warning"]
    },
    use12Hours: { control: "boolean" },
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

type Story = StoryObj<TimePickerStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.default)
};

export const Sizes: Story = {
  render: renderSizesStory,
  parameters: createDocsDescription(storyDescriptions.sizes)
};

export const Steps: Story = {
  render: renderStepsStory,
  parameters: createDocsDescription(storyDescriptions.steps)
};

export const TwelveHours: Story = {
  render: renderTwelveHoursStory,
  parameters: createDocsDescription(storyDescriptions.twelveHours)
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

export const Disabled: Story = {
  render: renderDisabledStory,
  parameters: createDocsDescription(storyDescriptions.disabled)
};
