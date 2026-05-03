import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./DatePicker.stories.css";
import {
  defineDsDatePicker,
  type DatePickerPicker,
  type DatePickerPlacement,
  type DatePickerSize,
  type DatePickerStatus,
  type DatePickerVariant
} from ".";

type DatePickerStoryArgs = {
  allowClear: boolean;
  defaultValue: string;
  disabled: boolean;
  format: string;
  maxDate: string;
  minDate: string;
  open: boolean;
  picker: DatePickerPicker;
  placeholder: string;
  placement: DatePickerPlacement;
  readOnly: boolean;
  size: DatePickerSize;
  status: DatePickerStatus | "";
  value: string;
  variant: DatePickerVariant;
};

const storyDescriptions = {
  default: "기본 DatePicker는 입력 필드를 클릭해 날짜 패널을 열고 하루 단위 날짜를 선택합니다.",
  picker: "picker 속성으로 월 또는 연도 단위 선택 패널을 사용할 수 있습니다.",
  format: "format 속성은 dayjs 포맷 문자열을 사용해 입력값과 표시값의 형식을 바꿉니다.",
  range: "min-date와 max-date 속성으로 선택 가능한 날짜 범위를 제한합니다.",
  size: "size 속성은 small, middle, large 입력 높이를 제공합니다.",
  status: "status 속성은 검증 결과를 error 또는 warning 상태로 표시합니다.",
  variant: "variant 속성은 outlined, filled, borderless, underlined 형태를 보여줍니다.",
  disabled: "disabled와 read-only 상태에서는 사용자가 날짜를 변경하지 못합니다.",
  placement: "placement 속성은 날짜 패널이 트리거 기준 어느 방향에 붙는지 제어합니다."
};

const defaultArgs = {
  allowClear: true,
  defaultValue: "",
  disabled: false,
  format: "",
  maxDate: "",
  minDate: "",
  open: false,
  picker: "date",
  placeholder: "Select date",
  placement: "bottomLeft",
  readOnly: false,
  size: "middle",
  status: "",
  value: "",
  variant: "outlined"
} satisfies DatePickerStoryArgs;

function ensureDatePickerDefined() {
  defineDsDatePicker();
}

function createDatePicker(args: Partial<DatePickerStoryArgs> = {}) {
  const mergedArgs = { ...defaultArgs, ...args };
  const datePicker = document.createElement("ds-date-picker");

  datePicker.setAttribute("picker", mergedArgs.picker);
  datePicker.setAttribute("placement", mergedArgs.placement);
  datePicker.setAttribute("placeholder", mergedArgs.placeholder);
  datePicker.setAttribute("size", mergedArgs.size);
  datePicker.setAttribute("variant", mergedArgs.variant);
  datePicker.setAttribute("allow-clear", String(mergedArgs.allowClear));
  datePicker.toggleAttribute("disabled", mergedArgs.disabled);
  datePicker.toggleAttribute("open", mergedArgs.open);
  datePicker.toggleAttribute("read-only", mergedArgs.readOnly);
  syncOptionalAttribute(datePicker, "default-value", mergedArgs.defaultValue);
  syncOptionalAttribute(datePicker, "format", mergedArgs.format);
  syncOptionalAttribute(datePicker, "max-date", mergedArgs.maxDate);
  syncOptionalAttribute(datePicker, "min-date", mergedArgs.minDate);
  syncOptionalAttribute(datePicker, "status", mergedArgs.status);
  syncOptionalAttribute(datePicker, "value", mergedArgs.value);

  return datePicker;
}

function createFrame(children: HTMLElement[], className = "") {
  const frame = document.createElement("div");

  frame.className = ["ds-date-picker-story-frame", className].filter(Boolean).join(" ");
  frame.append(...children);

  return frame;
}

function createRow(children: HTMLElement[]) {
  const row = document.createElement("div");

  row.className = "ds-date-picker-story-row";
  row.append(...children);

  return row;
}

function createPickerPreview(child: HTMLElement) {
  const preview = document.createElement("div");

  preview.className = "ds-date-picker-story-picker-item";
  preview.append(child);

  return preview;
}

function renderDefault(args: DatePickerStoryArgs) {
  ensureDatePickerDefined();

  return createFrame([createDatePicker(args)]);
}

function renderPickerStory() {
  ensureDatePickerDefined();

  return createFrame(
    [
      createPickerPreview(createDatePicker({ defaultValue: "2026-05-03", picker: "date" })),
      createPickerPreview(createDatePicker({ defaultValue: "2026-05", picker: "month" })),
      createPickerPreview(createDatePicker({ defaultValue: "2026", picker: "year" }))
    ],
    "ds-date-picker-story-picker"
  );
}

function renderFormatStory() {
  ensureDatePickerDefined();

  return createFrame(
    [
      createDatePicker({
        defaultValue: "03/05/2026",
        format: "DD/MM/YYYY",
        placeholder: "DD/MM/YYYY"
      })
    ],
    "ds-date-picker-story-format"
  );
}

function renderRangeStory() {
  ensureDatePickerDefined();

  return createFrame(
    [
      createDatePicker({
        defaultValue: "2026-05-03",
        maxDate: "2026-05-20",
        minDate: "2026-05-01"
      })
    ],
    "ds-date-picker-story-range"
  );
}

function renderSizeStory() {
  ensureDatePickerDefined();

  return createFrame(
    (["small", "middle", "large"] as DatePickerSize[]).map((size) =>
      createDatePicker({
        defaultValue: "2026-05-03",
        size
      })
    ),
    "ds-date-picker-story-size"
  );
}

function renderStatusStory() {
  ensureDatePickerDefined();

  return createFrame([
    createRow([
      createDatePicker({ defaultValue: "2026-05-03", status: "error" }),
      createDatePicker({ defaultValue: "2026-05-03", status: "warning" })
    ])
  ]);
}

function renderVariantStory() {
  ensureDatePickerDefined();

  return createFrame(
    (["outlined", "filled", "borderless", "underlined"] as DatePickerVariant[]).map((variant) =>
      createDatePicker({
        defaultValue: "2026-05-03",
        variant
      })
    ),
    "ds-date-picker-story-variant"
  );
}

function renderDisabledStory() {
  ensureDatePickerDefined();

  return createFrame([
    createRow([
      createDatePicker({ defaultValue: "2026-05-03", disabled: true }),
      createDatePicker({ defaultValue: "2026-05-03", readOnly: true })
    ])
  ]);
}

function renderPlacementStory() {
  ensureDatePickerDefined();

  return createFrame(
    (["bottomLeft", "bottomRight", "topLeft", "topRight"] as DatePickerPlacement[]).map((placement) =>
      createPickerPreview(
        createDatePicker({
          defaultValue: "2026-05-03",
          placement
        })
      )
    ),
    "ds-date-picker-story-placement"
  );
}

function syncOptionalAttribute(element: HTMLElement, name: string, value: string) {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
}

const meta: Meta<DatePickerStoryArgs> = {
  title: "Components/Data Entry/DatePicker",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "DatePicker는 날짜, 월, 연도 값을 입력하거나 달력 패널에서 선택하는 Data Entry 컴포넌트입니다. 내부 날짜 계산과 포맷 파싱은 dayjs를 사용합니다."
      }
    }
  },
  argTypes: {
    picker: {
      control: "inline-radio",
      options: ["date", "month", "year"]
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

type Story = StoryObj<DatePickerStoryArgs>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.default
      }
    }
  }
};

export const Picker: Story = {
  render: renderPickerStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.picker
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

export const LimitRange: Story = {
  render: renderRangeStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.range
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

export const Status: Story = {
  render: renderStatusStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.status
      }
    }
  }
};

export const Variant: Story = {
  render: renderVariantStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.variant
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

export const Placement: Story = {
  render: renderPlacementStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.placement
      }
    }
  }
};
