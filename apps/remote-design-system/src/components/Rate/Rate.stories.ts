import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Rate.stories.css";
import { defineDsRate, type RateSize } from ".";

type RateStoryArgs = {
  allowClear: boolean;
  allowHalf: boolean;
  character: string;
  count: number;
  defaultValue: number;
  disabled: boolean;
  keyboard: boolean;
  size: RateSize;
  tooltips: string;
  value: number;
};

const storyDescriptions = {
  default: "기본 Rate는 항목에 대한 평가 값을 빠르게 선택하는 입력입니다.",
  size: "size 속성으로 평가 문자의 크기를 small, middle, large로 조정합니다.",
  half: "allow-half 속성은 반 단위 평가 선택을 허용합니다.",
  copy: "변경 이벤트를 받아 선택한 평가 값에 맞는 보조 문구를 함께 표시할 수 있습니다.",
  readonly: "disabled 상태에서는 현재 평가 값만 보여주고 상호작용을 막습니다.",
  clear: "이미 선택한 별점을 다시 클릭해 선택을 해제할 수 있습니다.",
  character: "character 속성은 별 대신 다른 문자로 평가 항목을 표시합니다.",
  tooltip: "tooltips 속성은 각 평가 항목의 title 텍스트를 지정합니다."
};

const defaultArgs = {
  allowClear: true,
  allowHalf: false,
  character: "",
  count: 5,
  defaultValue: 0,
  disabled: false,
  keyboard: true,
  size: "middle",
  tooltips: "",
  value: 0
} satisfies RateStoryArgs;

function ensureRateDefined() {
  defineDsRate();
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-rate-story-frame";
  frame.append(...children);

  return frame;
}

function createRow(children: HTMLElement[]) {
  const row = document.createElement("div");

  row.className = "ds-rate-story-row";
  row.append(...children);

  return row;
}

function createLabeled(label: string, rate: HTMLElement) {
  const wrapper = document.createElement("div");
  const labelElement = document.createElement("span");

  wrapper.className = "ds-rate-story-labeled";
  labelElement.className = "ds-rate-story-label";
  labelElement.textContent = label;
  wrapper.append(labelElement, rate);

  return wrapper;
}

function createRate(args: Partial<RateStoryArgs> = {}) {
  const mergedArgs = { ...defaultArgs, ...args };
  const rate = document.createElement("ds-rate");

  rate.setAttribute("allow-clear", String(mergedArgs.allowClear));
  rate.setAttribute("count", String(mergedArgs.count));
  rate.setAttribute("keyboard", String(mergedArgs.keyboard));
  rate.setAttribute("size", mergedArgs.size);
  rate.toggleAttribute("allow-half", mergedArgs.allowHalf);
  rate.toggleAttribute("disabled", mergedArgs.disabled);
  syncOptionalAttribute(rate, "character", mergedArgs.character);
  syncOptionalAttribute(rate, "default-value", mergedArgs.defaultValue ? String(mergedArgs.defaultValue) : "");
  syncOptionalAttribute(rate, "tooltips", mergedArgs.tooltips);
  syncOptionalAttribute(rate, "value", mergedArgs.value ? String(mergedArgs.value) : "");

  return rate;
}

function renderDefault(args: RateStoryArgs) {
  ensureRateDefined();

  return createFrame([createRate(args)]);
}

function renderSizeStory() {
  ensureRateDefined();

  return createFrame((["small", "middle", "large"] as RateSize[]).map((size) => createRate({ defaultValue: 3, size })));
}

function renderHalfStory() {
  ensureRateDefined();

  return createFrame([createRate({ allowHalf: true, defaultValue: 2.5 })]);
}

function renderCopyStory() {
  ensureRateDefined();

  const labels = ["terrible", "bad", "normal", "good", "wonderful"];
  const wrapper = document.createElement("div");
  const rate = createRate({ defaultValue: 3 });
  const text = document.createElement("span");

  wrapper.className = "ds-rate-story-copy";
  text.className = "ds-rate-story-text";
  text.textContent = labels[2];
  rate.addEventListener("ds-rate-change", (event) => {
    const customEvent = event as CustomEvent<{ value: number }>;

    text.textContent = labels[Math.max(0, Math.ceil(customEvent.detail.value) - 1)] ?? "";
  });
  wrapper.append(rate, text);

  return createFrame([wrapper]);
}

function renderReadonlyStory() {
  ensureRateDefined();

  return createFrame([createRate({ disabled: true, value: 3 })]);
}

function renderClearStory() {
  ensureRateDefined();

  return createFrame([
    createRow([
      createLabeled("Clear", createRate({ allowClear: true, value: 3 })),
      createLabeled("Not clear", createRate({ allowClear: false, value: 3 }))
    ])
  ]);
}

function renderCharacterStory() {
  ensureRateDefined();

  return createFrame([
    createRow([
      createRate({ character: "A", defaultValue: 3 }),
      createRate({ character: "별", defaultValue: 4 })
    ])
  ]);
}

function renderTooltipStory() {
  ensureRateDefined();

  return createFrame([
    createRate({
      defaultValue: 4,
      tooltips: JSON.stringify(["terrible", "bad", "normal", "good", "wonderful"])
    })
  ]);
}

function syncOptionalAttribute(element: HTMLElement, name: string, value: string) {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
}

const meta: Meta<RateStoryArgs> = {
  title: "Components/Data Entry/Rate",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Rate는 대상에 대한 평가 값을 별점이나 사용자 지정 문자로 빠르게 입력하는 Data Entry 컴포넌트입니다."
      }
    }
  },
  argTypes: {
    character: {
      control: "text"
    },
    count: {
      control: { min: 1, type: "number" }
    },
    defaultValue: {
      control: { min: 0, type: "number" }
    },
    size: {
      control: "inline-radio",
      options: ["small", "middle", "large"]
    },
    value: {
      control: { min: 0, type: "number" }
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<RateStoryArgs>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.default
      }
    }
  }
};

export const Size: Story = {
  render: renderSizeStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.size
      }
    }
  }
};

export const Half: Story = {
  render: renderHalfStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.half
      }
    }
  }
};

export const Copywriting: Story = {
  render: renderCopyStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.copy
      }
    }
  }
};

export const ReadOnly: Story = {
  render: renderReadonlyStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.readonly
      }
    }
  }
};

export const Clear: Story = {
  render: renderClearStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.clear
      }
    }
  }
};

export const Character: Story = {
  render: renderCharacterStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.character
      }
    }
  }
};

export const Tooltip: Story = {
  render: renderTooltipStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.tooltip
      }
    }
  }
};
