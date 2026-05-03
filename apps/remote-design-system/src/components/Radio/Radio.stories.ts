import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Radio.stories.css";
import {
  defineDsRadio,
  type RadioButtonStyle,
  type RadioGroupOptionInput,
  type RadioOptionType,
  type RadioOrientation,
  type RadioSize,
  type RadioValue
} from ".";

type RadioStoryArgs = {
  buttonStyle: RadioButtonStyle;
  checked: boolean;
  defaultChecked: boolean;
  defaultValue: string;
  disabled: boolean;
  label: string;
  name: string;
  optionType: RadioOptionType;
  orientation: RadioOrientation;
  size: RadioSize;
  value: string;
};

const storyDescriptions = {
  default:
    "기본 Radio는 여러 선택지 중 하나의 상태를 고르는 단일 선택 입력입니다.",
  disabled:
    "disabled 상태에서는 선택 변경을 막고 현재 선택 여부만 시각적으로 유지합니다.",
  group:
    "Radio Group은 options 또는 자식 Radio를 통해 여러 선택지를 묶고 value 하나만 선택합니다.",
  vertical:
    "orientation을 vertical로 지정하면 선택지를 세로 방향으로 나열합니다.",
  block:
    "block 속성은 button 타입 Radio Group이 부모 너비를 채우도록 만듭니다.",
  button:
    "option-type을 button으로 지정하면 선택지를 세그먼트 버튼처럼 표시합니다.",
  size:
    "size 속성은 button 타입 Radio Group의 높이를 small, middle, large로 조정합니다.",
  solid:
    "button-style을 solid로 지정하면 선택된 버튼을 채운 배경으로 강조합니다.",
  custom:
    "직접 배치한 ds-radio 자식을 그룹이 제어하는 구조를 보여줍니다."
};

const defaultArgs = {
  buttonStyle: "outline",
  checked: false,
  defaultChecked: false,
  defaultValue: "",
  disabled: false,
  label: "Radio",
  name: "",
  optionType: "default",
  orientation: "horizontal",
  size: "middle",
  value: "radio"
} satisfies RadioStoryArgs;

function ensureRadioDefined() {
  defineDsRadio();
}

function createFrame(children: HTMLElement[], className = "") {
  const frame = document.createElement("div");

  frame.className = ["ds-radio-story-frame", className].filter(Boolean).join(" ");
  frame.append(...children);

  return frame;
}

function createRow(children: HTMLElement[]) {
  const row = document.createElement("div");

  row.className = "ds-radio-story-row";
  row.append(...children);

  return row;
}

function createRadio({
  checked,
  defaultChecked,
  disabled,
  label,
  name,
  value
}: RadioStoryArgs) {
  const radio = document.createElement("ds-radio");

  radio.textContent = label;
  radio.setAttribute("value", value);

  if (name) {
    radio.setAttribute("name", name);
  }

  radio.toggleAttribute("checked", checked);
  radio.toggleAttribute("default-checked", defaultChecked);
  radio.toggleAttribute("disabled", disabled);

  return radio;
}

function createGroup({
  block = false,
  buttonStyle = "outline",
  defaultValue = undefined,
  disabled = false,
  name = "radio-story",
  optionType = "default",
  options,
  orientation = "horizontal",
  size = "middle",
  value = undefined
}: {
  block?: boolean;
  buttonStyle?: RadioButtonStyle;
  defaultValue?: RadioValue;
  disabled?: boolean;
  name?: string;
  optionType?: RadioOptionType;
  options: RadioGroupOptionInput[];
  orientation?: RadioOrientation;
  size?: RadioSize;
  value?: RadioValue;
}) {
  const group = document.createElement("ds-radio-group") as HTMLElement & {
    defaultValue?: RadioValue;
    options: RadioGroupOptionInput[];
    value?: RadioValue;
  };

  group.setAttribute("aria-label", "Options");
  group.setAttribute("button-style", buttonStyle);
  group.setAttribute("name", name);
  group.setAttribute("option-type", optionType);
  group.setAttribute("orientation", orientation);
  group.setAttribute("size", size);
  group.toggleAttribute("block", block);
  group.toggleAttribute("disabled", disabled);
  group.options = options;

  if (value !== undefined) {
    group.value = value;
  } else if (defaultValue !== undefined) {
    group.defaultValue = defaultValue;
  }

  return group;
}

function renderDefault(args: RadioStoryArgs) {
  ensureRadioDefined();

  return createFrame([createRadio(args)]);
}

function renderDisabledStory() {
  ensureRadioDefined();

  return createFrame([
    createRow([
      createRadio({ ...defaultArgs, disabled: true, label: "Disabled" }),
      createRadio({ ...defaultArgs, checked: true, disabled: true, label: "Selected disabled" })
    ])
  ]);
}

function renderGroupStory() {
  ensureRadioDefined();

  return createFrame([
    createGroup({
      defaultValue: "Apple",
      options: ["Apple", "Pear", "Orange"]
    }),
    createGroup({
      defaultValue: "Pear",
      options: [
        { label: "Apple", value: "Apple" },
        { label: "Pear", value: "Pear" },
        { disabled: true, label: "Orange", value: "Orange" }
      ]
    })
  ]);
}

function renderVerticalStory() {
  ensureRadioDefined();

  return createFrame([
    createGroup({
      defaultValue: "Shanghai",
      options: ["Hangzhou", "Shanghai", "Beijing", "Chengdu"],
      orientation: "vertical"
    })
  ]);
}

function renderBlockStory() {
  ensureRadioDefined();

  return createFrame(
    [
      createGroup({
        block: true,
        defaultValue: "B",
        optionType: "button",
        options: ["A", "B", "C", "D"]
      })
    ],
    "ds-radio-story-block"
  );
}

function renderButtonStory() {
  ensureRadioDefined();

  return createFrame([
    createGroup({
      defaultValue: "Line",
      optionType: "button",
      options: ["Line", "Dot", "Bar", "Pie"]
    })
  ]);
}

function renderSizeStory() {
  ensureRadioDefined();

  return createFrame(
    (["small", "middle", "large"] as RadioSize[]).map((size) =>
      createGroup({
        defaultValue: "B",
        optionType: "button",
        options: ["A", "B", "C"],
        size
      })
    )
  );
}

function renderSolidStory() {
  ensureRadioDefined();

  return createFrame([
    createGroup({
      buttonStyle: "solid",
      defaultValue: "Apple",
      optionType: "button",
      options: ["Apple", "Pear", "Orange"]
    })
  ]);
}

function renderCustomStory() {
  ensureRadioDefined();

  const group = document.createElement("ds-radio-group") as HTMLElement & {
    value: RadioValue;
  };

  group.setAttribute("aria-label", "Cities");
  group.value = "Beijing";
  group.append(
    createRadio({ ...defaultArgs, label: "Hangzhou", value: "Hangzhou" }),
    createRadio({ ...defaultArgs, label: "Shanghai", value: "Shanghai" }),
    createRadio({ ...defaultArgs, label: "Beijing", value: "Beijing" }),
    createRadio({ ...defaultArgs, label: "Chengdu", value: "Chengdu" })
  );

  return createFrame([group]);
}

const meta: Meta<RadioStoryArgs> = {
  title: "Components/Data Entry/Radio",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Radio는 여러 선택지 중 하나만 선택해야 하는 상황에서 사용하는 Data Entry 컴포넌트입니다. 선택지는 화면에 드러나 비교하기 쉬워야 하므로 너무 많은 항목에는 적합하지 않습니다."
      }
    }
  },
  argTypes: {
    buttonStyle: {
      control: "inline-radio",
      options: ["outline", "solid"]
    },
    label: {
      control: "text"
    },
    optionType: {
      control: "inline-radio",
      options: ["default", "button"]
    },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"]
    },
    size: {
      control: "inline-radio",
      options: ["small", "middle", "large"]
    },
    value: {
      control: "text"
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<RadioStoryArgs>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.default
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

export const Group: Story = {
  render: renderGroupStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.group
      }
    }
  }
};

export const Vertical: Story = {
  render: renderVerticalStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.vertical
      }
    }
  }
};

export const Block: Story = {
  render: renderBlockStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.block
      }
    }
  }
};

export const ButtonStyle: Story = {
  render: renderButtonStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.button
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

export const Solid: Story = {
  render: renderSolidStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.solid
      }
    }
  }
};

export const CustomChildren: Story = {
  render: renderCustomStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.custom
      }
    }
  }
};
