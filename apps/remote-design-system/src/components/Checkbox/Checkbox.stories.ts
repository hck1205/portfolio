import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Checkbox.stories.css";
import {
  defineDsCheckbox,
  type CheckboxGroupOptionInput,
  type CheckboxValue
} from ".";

type CheckboxStoryArgs = {
  checked: boolean;
  defaultChecked: boolean;
  disabled: boolean;
  indeterminate: boolean;
  label: string;
  name: string;
  value: string;
};

const storyDescriptions = {
  default:
    "기본 Checkbox입니다. 선택 여부를 표시하고 변경 시 ds-checkbox-change 이벤트를 발생시킵니다.",
  controlled:
    "checked와 disabled 상태를 명시적으로 지정해 외부 상태와 함께 제어하는 Checkbox 예시입니다.",
  disabled:
    "disabled 상태에서는 포커스와 선택 변경이 막히며, 현재 선택 여부는 그대로 표시됩니다.",
  group:
    "Checkbox Group은 options로 여러 선택지를 만들고 value 배열로 선택된 값을 관리합니다.",
  checkAll:
    "indeterminate 상태를 이용해 일부만 선택된 상태와 전체 선택 상태를 함께 표현합니다.",
  grid:
    "그룹 안에 직접 ds-checkbox 자식을 배치해 더 복잡한 레이아웃을 구성할 수 있습니다."
};

const defaultArgs = {
  checked: false,
  defaultChecked: false,
  disabled: false,
  indeterminate: false,
  label: "Checkbox",
  name: "",
  value: "checkbox"
} satisfies CheckboxStoryArgs;

function ensureCheckboxDefined() {
  defineDsCheckbox();
}

function createFrame(children: Array<HTMLElement | Text>) {
  const frame = document.createElement("div");

  frame.className = "ds-checkbox-story-frame";
  frame.append(...children);

  return frame;
}

function createRow(children: HTMLElement[]) {
  const row = document.createElement("div");

  row.className = "ds-checkbox-story-row";
  row.append(...children);

  return row;
}

function createDivider() {
  const divider = document.createElement("div");

  divider.className = "ds-checkbox-story-divider";

  return divider;
}

function createCheckbox({
  checked,
  defaultChecked,
  disabled,
  indeterminate,
  label,
  name,
  value
}: CheckboxStoryArgs) {
  const checkbox = document.createElement("ds-checkbox");

  checkbox.textContent = label;
  checkbox.setAttribute("value", value);

  if (name) {
    checkbox.setAttribute("name", name);
  }

  checkbox.toggleAttribute("checked", checked);
  checkbox.toggleAttribute("default-checked", defaultChecked);
  checkbox.toggleAttribute("disabled", disabled);
  checkbox.toggleAttribute("indeterminate", indeterminate);

  return checkbox;
}

function createGroup({
  defaultValue = [],
  disabled = false,
  name = "fruits",
  options,
  value
}: {
  defaultValue?: CheckboxValue[];
  disabled?: boolean;
  name?: string;
  options: CheckboxGroupOptionInput[];
  value?: CheckboxValue[];
}) {
  const group = document.createElement("ds-checkbox-group") as HTMLElement & {
    defaultValue: CheckboxValue[];
    options: CheckboxGroupOptionInput[];
    value: CheckboxValue[];
  };

  group.setAttribute("aria-label", "Fruits");
  group.setAttribute("name", name);
  group.toggleAttribute("disabled", disabled);
  group.options = options;

  if (value) {
    group.value = value;
  } else {
    group.defaultValue = defaultValue;
  }

  return group;
}

function renderDefault(args: CheckboxStoryArgs) {
  ensureCheckboxDefined();

  return createFrame([createCheckbox(args)]);
}

function renderControlledStory() {
  ensureCheckboxDefined();

  return createFrame([
    createRow([
      createCheckbox({
        ...defaultArgs,
        checked: true,
        label: "Checked"
      }),
      createCheckbox({
        ...defaultArgs,
        disabled: true,
        label: "Disabled"
      })
    ])
  ]);
}

function renderDisabledStory() {
  ensureCheckboxDefined();

  return createFrame([
    createRow([
      createCheckbox({
        ...defaultArgs,
        disabled: true,
        label: "Disabled"
      }),
      createCheckbox({
        ...defaultArgs,
        checked: true,
        disabled: true,
        label: "Checked disabled"
      })
    ])
  ]);
}

function renderGroupStory() {
  ensureCheckboxDefined();

  return createFrame([
    createGroup({
      defaultValue: ["Apple"],
      options: ["Apple", "Pear", "Orange"]
    }),
    createGroup({
      defaultValue: ["Pear"],
      options: [
        { label: "Apple", value: "Apple" },
        { label: "Pear", value: "Pear" },
        { disabled: true, label: "Orange", value: "Orange" }
      ]
    })
  ]);
}

function renderCheckAllStory() {
  ensureCheckboxDefined();

  const options = ["Apple", "Pear", "Orange"];
  const checkAll = createCheckbox({
    ...defaultArgs,
    indeterminate: true,
    label: "Check all",
    value: "all"
  });
  const group = createGroup({
    options,
    value: ["Apple", "Orange"]
  });

  checkAll.addEventListener("ds-checkbox-change", (event) => {
    const customEvent = event as CustomEvent<{ checked: boolean }>;

    (group as typeof group & { value: CheckboxValue[] }).value = customEvent.detail.checked
      ? options
      : [];
    checkAll.toggleAttribute("indeterminate", false);
  });

  group.addEventListener("ds-checkbox-group-change", (event) => {
    const customEvent = event as CustomEvent<{ value: CheckboxValue[] }>;
    const selectedCount = customEvent.detail.value.length;

    checkAll.toggleAttribute("checked", selectedCount === options.length);
    checkAll.toggleAttribute("indeterminate", selectedCount > 0 && selectedCount < options.length);
  });

  return createFrame([checkAll, createDivider(), group]);
}

function renderGridStory() {
  ensureCheckboxDefined();

  const group = document.createElement("ds-checkbox-group");

  group.setAttribute("value", JSON.stringify(["A", "C"]));
  group.append(
    createCheckbox({ ...defaultArgs, label: "A", value: "A" }),
    createCheckbox({ ...defaultArgs, label: "B", value: "B" }),
    createCheckbox({ ...defaultArgs, label: "C", value: "C" }),
    createCheckbox({ ...defaultArgs, label: "D", value: "D" }),
    createCheckbox({ ...defaultArgs, label: "E", value: "E" })
  );

  return createFrame([group]);
}

const meta: Meta<CheckboxStoryArgs> = {
  title: "Components/Data Entry/Checkbox",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Checkbox는 여러 선택지 중 하나 이상을 선택하거나, 단일 항목의 선택 상태를 표시하는 Data Entry 컴포넌트입니다. native checkbox 입력을 사용해 키보드, 포커스, disabled 동작을 유지합니다."
      }
    }
  },
  argTypes: {
    label: {
      control: "text"
    },
    value: {
      control: "text"
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<CheckboxStoryArgs>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.default
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

export const CheckAll: Story = {
  render: renderCheckAllStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.checkAll
      }
    }
  }
};

export const Grid: Story = {
  render: renderGridStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.grid
      }
    }
  }
};
