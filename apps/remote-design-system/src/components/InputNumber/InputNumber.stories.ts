import { DollarSign, Percent, Timer, createElement as createLucideElement } from "lucide";
import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./InputNumber.stories.css";
import {
  defineDsInputNumber,
  type InputNumberFormatter,
  type InputNumberSize,
  type InputNumberStatus,
  type InputNumberVariant
} from ".";

type InputNumberStoryArgs = {
  controls: boolean;
  disabled: boolean;
  formatter: InputNumberFormatter;
  keyboard: boolean;
  max?: number;
  min?: number;
  placeholder: string;
  precision?: number;
  readonly: boolean;
  size: InputNumberSize;
  status?: InputNumberStatus;
  step: number;
  value?: number;
  variant: InputNumberVariant;
  wheel: boolean;
};

const defaultArgs = {
  controls: true,
  disabled: false,
  formatter: "decimal",
  keyboard: true,
  max: undefined,
  min: undefined,
  placeholder: "숫자를 입력하세요",
  precision: undefined,
  readonly: false,
  size: "medium",
  status: undefined,
  step: 1,
  value: 3,
  variant: "outlined",
  wheel: false
} satisfies InputNumberStoryArgs;

const storyDescriptions = {
  basic: "기본 InputNumber는 직접 입력과 우측 컨트롤 버튼으로 숫자 값을 변경합니다.",
  sizes: "small, medium, large 크기의 높이와 컨트롤 밀도를 비교합니다.",
  disabled: "disabled와 readonly 상태는 입력과 step 버튼 동작을 제한합니다.",
  range: "min, max, step, precision 조합으로 값의 범위와 증가 단위를 제한합니다.",
  formatter: "formatter 프리셋으로 currency, percent 표시 형식을 확인합니다.",
  variants: "outlined, filled, borderless, underlined 네 가지 variant를 제공합니다.",
  status: "error와 warning 상태에서 border와 focus 색상이 달라집니다.",
  prefixSuffix: "prefix와 suffix 슬롯으로 단위, 통화, 보조 아이콘을 입력 영역 안에 배치합니다.",
  keyboardWheel: "keyboard와 wheel 속성으로 ArrowUp, ArrowDown, wheel 증감 동작을 제어합니다."
};

function ensureInputNumberDefined() {
  defineDsInputNumber();
}

function createInputNumber(args: InputNumberStoryArgs) {
  const element = document.createElement("ds-input-number");

  element.setAttribute("formatter", args.formatter);
  element.setAttribute("placeholder", args.placeholder);
  element.setAttribute("size", args.size);
  element.setAttribute("step", String(args.step));
  element.setAttribute("variant", args.variant);
  element.setAttribute("controls", String(args.controls));
  element.setAttribute("keyboard", String(args.keyboard));
  element.setAttribute("wheel", String(args.wheel));
  element.toggleAttribute("disabled", args.disabled);
  element.toggleAttribute("readonly", args.readonly);

  if (args.value !== undefined) {
    element.setAttribute("value", String(args.value));
  }

  if (args.min !== undefined) {
    element.setAttribute("min", String(args.min));
  }

  if (args.max !== undefined) {
    element.setAttribute("max", String(args.max));
  }

  if (args.precision !== undefined) {
    element.setAttribute("precision", String(args.precision));
  }

  if (args.status) {
    element.setAttribute("status", args.status);
  }

  return element;
}

function createIcon(name: "currency" | "percent" | "timer", slot: "prefix" | "suffix") {
  const wrapper = document.createElement("span");
  const iconMap = {
    currency: DollarSign,
    percent: Percent,
    timer: Timer
  };

  wrapper.className = "ds-input-number-story-icon";
  wrapper.slot = slot;
  wrapper.append(
    createLucideElement(iconMap[name], {
      "aria-hidden": "true",
      focusable: "false",
      height: 16,
      width: 16,
      "stroke-width": 2.25
    })
  );

  return wrapper;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-input-number-story-frame";
  frame.append(...children);

  return frame;
}

function createStack(children: HTMLElement[]) {
  const stack = document.createElement("div");

  stack.className = "ds-input-number-story-stack";
  stack.append(...children);

  return stack;
}

function createSection(title: string, children: HTMLElement[]) {
  const section = document.createElement("section");
  const heading = document.createElement("h3");

  section.className = "ds-input-number-story-section";
  heading.className = "ds-input-number-story-section__title";
  heading.textContent = title;
  section.append(heading, ...children);

  return section;
}

function createFieldRow(input: HTMLElement, description: string) {
  const row = document.createElement("div");
  const desc = document.createElement("span");

  row.className = "ds-input-number-story-field-row";
  desc.className = "ds-input-number-story-field-desc";
  desc.textContent = description;
  row.append(input, desc);

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

function renderDefault(args: InputNumberStoryArgs) {
  ensureInputNumberDefined();

  return createFrame([createInputNumber(args)]);
}

function renderSizesStory() {
  ensureInputNumberDefined();

  return createFrame([
    createStack([
      createInputNumber({ ...defaultArgs, placeholder: "Small", size: "small", value: 1 }),
      createInputNumber({ ...defaultArgs, placeholder: "Medium", size: "medium", value: 2 }),
      createInputNumber({ ...defaultArgs, placeholder: "Large", size: "large", value: 3 })
    ])
  ]);
}

function renderDisabledStory() {
  ensureInputNumberDefined();

  return createFrame([
    createStack([
      createInputNumber({ ...defaultArgs, disabled: true, value: 4 }),
      createInputNumber({ ...defaultArgs, readonly: true, value: 5 })
    ])
  ]);
}

function renderRangeStory() {
  ensureInputNumberDefined();

  return createFrame([
    createStack([
      createFieldRow(
        createInputNumber({ ...defaultArgs, max: 10, min: 0, step: 1, value: 3 }),
        "min 0 / max 10 / step 1"
      ),
      createFieldRow(
        createInputNumber({ ...defaultArgs, max: 2, min: -2, precision: 2, step: 0.25, value: 0.5 }),
        "min -2 / max 2 / step 0.25 / precision 2"
      ),
      createFieldRow(
        createInputNumber({ ...defaultArgs, controls: false, max: 100, min: 0, step: 10, value: 20 }),
        "controls false / min 0 / max 100 / step 10"
      )
    ])
  ]);
}

function renderFormatterStory() {
  ensureInputNumberDefined();

  return createFrame([
    createStack([
      createInputNumber({ ...defaultArgs, formatter: "currency", precision: 2, value: 1280 }),
      createInputNumber({ ...defaultArgs, formatter: "percent", precision: 1, step: 0.5, value: 12.5 }),
      createInputNumber({ ...defaultArgs, formatter: "decimal", precision: 3, step: 0.125, value: 8.375 })
    ])
  ]);
}

function renderVariantsStory() {
  ensureInputNumberDefined();

  return createFrame([
    createStack([
      createInputNumber({ ...defaultArgs, placeholder: "Outlined", variant: "outlined", value: 1 }),
      createInputNumber({ ...defaultArgs, placeholder: "Filled", variant: "filled", value: 2 }),
      createInputNumber({ ...defaultArgs, placeholder: "Borderless", variant: "borderless", value: 3 }),
      createInputNumber({ ...defaultArgs, placeholder: "Underlined", variant: "underlined", value: 4 })
    ])
  ]);
}

function renderStatusStory() {
  ensureInputNumberDefined();

  return createFrame([
    createStack([
      createInputNumber({ ...defaultArgs, status: "error", value: 120 }),
      createInputNumber({ ...defaultArgs, status: "warning", value: 80 })
    ])
  ]);
}

function renderPrefixSuffixStory() {
  ensureInputNumberDefined();

  const price = createInputNumber({ ...defaultArgs, formatter: "currency", precision: 2, value: 320 });
  const rate = createInputNumber({ ...defaultArgs, precision: 1, step: 0.5, value: 12.5 });
  const minutes = createInputNumber({ ...defaultArgs, max: 120, min: 0, step: 5, value: 30 });

  price.append(createIcon("currency", "prefix"));
  rate.append(createIcon("percent", "suffix"));
  minutes.append(createIcon("timer", "prefix"));

  return createFrame([createStack([price, rate, minutes])]);
}

function renderKeyboardWheelStory() {
  ensureInputNumberDefined();

  return createFrame([
    createSection("Keyboard enabled", [
      createInputNumber({ ...defaultArgs, keyboard: true, max: 10, min: 0, value: 5 })
    ]),
    createSection("Keyboard disabled", [
      createInputNumber({ ...defaultArgs, keyboard: false, max: 10, min: 0, value: 5 })
    ]),
    createSection("Wheel enabled", [
      createInputNumber({ ...defaultArgs, max: 10, min: 0, value: 5, wheel: true })
    ])
  ]);
}

const meta: Meta<InputNumberStoryArgs> = {
  title: "Components/Data Entry/InputNumber",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "InputNumber는 범위, 증가 단위, 표시 형식을 가진 숫자 입력 컴포넌트입니다. 숫자 입력에 필요한 상태와 표시 옵션을 Web Component API로 제공합니다."
      }
    }
  },
  argTypes: {
    controls: {
      control: "boolean"
    },
    disabled: {
      control: "boolean"
    },
    formatter: {
      control: "inline-radio",
      options: ["decimal", "currency", "percent"]
    },
    keyboard: {
      control: "boolean"
    },
    max: {
      control: "number"
    },
    min: {
      control: "number"
    },
    placeholder: {
      control: "text"
    },
    precision: {
      control: "number"
    },
    readonly: {
      control: "boolean"
    },
    size: {
      control: "inline-radio",
      options: ["small", "medium", "large"]
    },
    status: {
      control: "inline-radio",
      options: [undefined, "error", "warning"]
    },
    step: {
      control: "number"
    },
    value: {
      control: "number"
    },
    variant: {
      control: "inline-radio",
      options: ["outlined", "filled", "borderless", "underlined"]
    },
    wheel: {
      control: "boolean"
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<InputNumberStoryArgs>;

export const Basic: Story = {
  parameters: createDocsDescription(storyDescriptions.basic)
};

export const Sizes: Story = {
  render: renderSizesStory,
  parameters: createDocsDescription(storyDescriptions.sizes)
};

export const DisabledAndReadOnly: Story = {
  render: renderDisabledStory,
  parameters: createDocsDescription(storyDescriptions.disabled)
};

export const RangeAndStep: Story = {
  render: renderRangeStory,
  parameters: createDocsDescription(storyDescriptions.range)
};

export const Formatter: Story = {
  render: renderFormatterStory,
  parameters: createDocsDescription(storyDescriptions.formatter)
};

export const Variants: Story = {
  render: renderVariantsStory,
  parameters: createDocsDescription(storyDescriptions.variants)
};

export const Status: Story = {
  render: renderStatusStory,
  parameters: createDocsDescription(storyDescriptions.status)
};

export const PrefixAndSuffix: Story = {
  render: renderPrefixSuffixStory,
  parameters: createDocsDescription(storyDescriptions.prefixSuffix)
};

export const KeyboardAndWheel: Story = {
  render: renderKeyboardWheelStory,
  parameters: createDocsDescription(storyDescriptions.keyboardWheel)
};
