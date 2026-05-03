import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./ColorPicker.stories.css";
import {
  defineDsColorPicker,
  type ColorPickerFormat,
  type ColorPickerPickerPlacement,
  type ColorPickerPreset,
  type ColorPickerSize,
  type ColorPickerTrigger
} from ".";

type ColorPickerStoryArgs = {
  allowClear: boolean;
  defaultFormat: ColorPickerFormat;
  defaultValue: string;
  disabled: boolean;
  disabledAlpha: boolean;
  disabledFormat: boolean;
  format: ColorPickerFormat;
  open: boolean;
  pickerPlacement: ColorPickerPickerPlacement;
  showText: boolean;
  size: ColorPickerSize;
  trigger: ColorPickerTrigger;
  value: string;
};

const storyDescriptions = {
  default:
    "기본 ColorPicker입니다. 트리거를 누르면 색상 패널이 열리고 선택한 색상을 value로 반영합니다.",
  size:
    "size 속성으로 small, middle, large 트리거 크기를 선택할 수 있습니다.",
  controlled:
    "value와 open 속성을 지정해 외부 상태로 색상과 패널 열림 상태를 제어하는 예시입니다.",
  showText:
    "show-text 속성은 트리거 안에 현재 색상 값을 함께 표시합니다.",
  disabled:
    "disabled 상태에서는 트리거와 패널 입력이 모두 비활성화됩니다.",
  disabledAlpha:
    "disabled-alpha 속성은 투명도 컨트롤을 비활성화하고 완전 불투명 색상으로 출력합니다.",
  clear:
    "allow-clear 속성은 선택한 색상을 비울 수 있는 clear 액션을 제공합니다.",
  trigger:
    "trigger 속성으로 click 또는 hover 방식의 패널 열림 동작을 선택합니다.",
  format:
    "format 속성은 HEX, RGB, HSB 출력 형식을 선택하며 disabled-format으로 형식 선택 UI를 잠글 수 있습니다.",
  pickerPlacement:
    "picker-placement 속성은 트리거를 기준으로 패널이 열리는 방향을 top, right, bottom, left 중에서 선택합니다.",
  presets:
    "presets 속성 또는 property로 자주 쓰는 색상 묶음을 패널에 표시합니다."
};

const defaultArgs = {
  allowClear: false,
  defaultFormat: "hex",
  defaultValue: "#1677ff",
  disabled: false,
  disabledAlpha: false,
  disabledFormat: false,
  format: "hex",
  open: false,
  pickerPlacement: "bottom",
  showText: false,
  size: "middle",
  trigger: "click",
  value: ""
} satisfies ColorPickerStoryArgs;

const presetGroups: ColorPickerPreset[] = [
  {
    colors: ["#1677ff", "#52c41a", "#faad14", "#ff4d4f", "#722ed1"],
    label: "Brand"
  },
  {
    colors: ["#111316", "#626b7a", "#a9afba", "#e1e3e8", "#ffffff"],
    label: "Neutral"
  }
];

function ensureColorPickerDefined() {
  defineDsColorPicker();
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-color-picker-story-frame";
  frame.append(...children);

  return frame;
}

function createRow(children: HTMLElement[]) {
  const row = document.createElement("div");

  row.className = "ds-color-picker-story-row";
  row.append(...children);

  return row;
}

function createLabeled(label: string, picker: HTMLElement) {
  const panel = document.createElement("div");
  const labelElement = document.createElement("span");

  panel.className = "ds-color-picker-story-panel";
  labelElement.className = "ds-color-picker-story-label";
  labelElement.textContent = label;
  panel.append(labelElement, picker);

  return panel;
}

function createColorPicker(args: ColorPickerStoryArgs) {
  const picker = document.createElement("ds-color-picker") as HTMLElement & {
    presets: ColorPickerPreset[];
  };

  picker.setAttribute("default-format", args.defaultFormat);
  picker.setAttribute("default-value", args.defaultValue);
  picker.setAttribute("format", args.format);
  picker.setAttribute("picker-placement", args.pickerPlacement);
  picker.setAttribute("size", args.size);
  picker.setAttribute("trigger", args.trigger);
  picker.toggleAttribute("allow-clear", args.allowClear);
  picker.toggleAttribute("disabled", args.disabled);
  picker.toggleAttribute("disabled-alpha", args.disabledAlpha);
  picker.toggleAttribute("disabled-format", args.disabledFormat);
  picker.toggleAttribute("open", args.open);
  picker.toggleAttribute("show-text", args.showText);

  if (args.value) {
    picker.setAttribute("value", args.value);
  }

  return picker;
}

function renderDefault(args: ColorPickerStoryArgs) {
  ensureColorPickerDefined();

  return createFrame([createColorPicker(args)]);
}

function renderSizeStory() {
  ensureColorPickerDefined();

  return createFrame([
    createRow(
      (["small", "middle", "large"] as ColorPickerSize[]).map((size) =>
        createLabeled(
          size,
          createColorPicker({
            ...defaultArgs,
            showText: true,
            size
          })
        )
      )
    )
  ]);
}

function renderControlledStory() {
  ensureColorPickerDefined();

  return createFrame([
    createColorPicker({
      ...defaultArgs,
      open: true,
      showText: true,
      value: "#722ed1"
    })
  ]);
}

function renderShowTextStory() {
  ensureColorPickerDefined();

  return createFrame([
    createRow([
      createColorPicker({
        ...defaultArgs,
        showText: true
      }),
      createColorPicker({
        ...defaultArgs,
        format: "rgb",
        showText: true,
        value: "rgba(22, 119, 255, 0.65)"
      })
    ])
  ]);
}

function renderDisabledStory() {
  ensureColorPickerDefined();

  return createFrame([
    createRow([
      createColorPicker({
        ...defaultArgs,
        disabled: true,
        showText: true
      }),
      createColorPicker({
        ...defaultArgs,
        disabled: true,
        showText: true,
        value: "#faad14"
      })
    ])
  ]);
}

function renderDisabledAlphaStory() {
  ensureColorPickerDefined();

  return createFrame([
    createColorPicker({
      ...defaultArgs,
      disabledAlpha: true,
      open: true,
      showText: true,
      value: "rgba(22, 119, 255, 0.4)"
    })
  ]);
}

function renderClearStory() {
  ensureColorPickerDefined();

  return createFrame([
    createColorPicker({
      ...defaultArgs,
      allowClear: true,
      open: true,
      showText: true
    })
  ]);
}

function renderTriggerStory() {
  ensureColorPickerDefined();

  return createFrame([
    createRow([
      createLabeled(
        "Click",
        createColorPicker({
          ...defaultArgs,
          showText: true,
          trigger: "click"
        })
      ),
      createLabeled(
        "Hover",
        createColorPicker({
          ...defaultArgs,
          showText: true,
          trigger: "hover",
          value: "#52c41a"
        })
      )
    ])
  ]);
}

function renderFormatStory() {
  ensureColorPickerDefined();

  return createFrame([
    createRow(
      (["hex", "rgb", "hsb"] as ColorPickerFormat[]).map((format) =>
        createLabeled(
          format.toUpperCase(),
          createColorPicker({
            ...defaultArgs,
            format,
            open: format === "hex",
            showText: true
          })
        )
      )
    )
  ]);
}

function renderPickerPlacementStory() {
  ensureColorPickerDefined();

  const frame = createFrame([
    createRow(
      (["top", "right", "bottom", "left"] as ColorPickerPickerPlacement[]).map((pickerPlacement) =>
        createLabeled(
          pickerPlacement,
          createColorPicker({
            ...defaultArgs,
            open: true,
            pickerPlacement,
            showText: true
          })
        )
      )
    )
  ]);

  frame.classList.add("ds-color-picker-story-frame--placement");

  return frame;
}

function renderPresetsStory() {
  ensureColorPickerDefined();

  const picker = createColorPicker({
    ...defaultArgs,
    open: true,
    showText: true
  }) as HTMLElement & {
    presets: ColorPickerPreset[];
  };

  picker.presets = presetGroups;

  return createFrame([picker]);
}

const meta: Meta<ColorPickerStoryArgs> = {
  title: "Components/Data Entry/ColorPicker",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "ColorPicker는 사용자가 색상을 직접 선택하거나, 프리셋 색상 중 하나를 골라 CSS 색상 값으로 제출할 때 사용하는 Data Entry 컴포넌트입니다."
      }
    }
  },
  argTypes: {
    defaultFormat: {
      control: "inline-radio",
      options: ["hex", "rgb", "hsb"]
    },
    format: {
      control: "inline-radio",
      options: ["hex", "rgb", "hsb"]
    },
    pickerPlacement: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"]
    },
    size: {
      control: "inline-radio",
      options: ["small", "middle", "large"]
    },
    trigger: {
      control: "inline-radio",
      options: ["click", "hover"]
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<ColorPickerStoryArgs>;

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

export const Controlled: Story = {
  render: renderControlledStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.controlled
      }
    }
  }
};

export const ShowText: Story = {
  render: renderShowTextStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.showText
      }
    }
  }
};

export const Disabled: Story = {
  render: renderDisabledStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.disabled
      }
    }
  }
};

export const DisabledAlpha: Story = {
  render: renderDisabledAlphaStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.disabledAlpha
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

export const Trigger: Story = {
  render: renderTriggerStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.trigger
      }
    }
  }
};

export const Format: Story = {
  render: renderFormatStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.format
      }
    }
  }
};

export const PickerPlacement: Story = {
  render: renderPickerPlacementStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.pickerPlacement
      }
    }
  }
};

export const Presets: Story = {
  render: renderPresetsStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.presets
      }
    }
  }
};
