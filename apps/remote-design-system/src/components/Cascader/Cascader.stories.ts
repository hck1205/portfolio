import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Cascader.stories.css";
import {
  defineDsCascader,
  type CascaderExpandTrigger,
  type CascaderOption,
  type CascaderPlacement,
  type CascaderSize,
  type CascaderStatus,
  type CascaderVariant
} from ".";

type CascaderStoryArgs = {
  allowClear: boolean;
  changeOnSelect: boolean;
  disabled: boolean;
  expandTrigger: CascaderExpandTrigger;
  multiple: boolean;
  placeholder: string;
  placement: CascaderPlacement;
  showSearch: boolean;
  size: CascaderSize;
  status?: CascaderStatus;
  value: string;
  variant: CascaderVariant;
};

const locationOptions = [
  {
    label: "North America",
    value: "north-america",
    children: [
      {
        label: "Canada",
        value: "canada",
        children: [
          { label: "Toronto", value: "toronto" },
          { label: "Vancouver", value: "vancouver" }
        ]
      },
      {
        label: "United States",
        value: "united-states",
        children: [{ label: "Seattle", value: "seattle" }]
      }
    ]
  },
  {
    label: "Europe",
    value: "europe",
    children: [
      {
        label: "France",
        value: "france",
        children: [{ label: "Paris", value: "paris" }]
      }
    ]
  }
] satisfies CascaderOption[];

const disabledOptions = [
  {
    label: "North America",
    value: "north-america",
    children: [
      {
        disabled: true,
        label: "Canada",
        value: "canada",
        children: [{ label: "Toronto", value: "toronto" }]
      },
      {
        label: "United States",
        value: "united-states",
        children: [{ label: "Seattle", value: "seattle" }]
      }
    ]
  },
  {
    disabled: true,
    label: "Europe",
    value: "europe"
  }
] satisfies CascaderOption[];

const productOptions = [
  {
    label: "Design",
    value: "design",
    children: [
      { label: "Foundation", value: "foundation" },
      { label: "Components", value: "components" }
    ]
  },
  {
    label: "Engineering",
    value: "engineering",
    children: [
      { label: "Frontend", value: "frontend" },
      { label: "Platform", value: "platform" }
    ]
  }
] satisfies CascaderOption[];

const defaultArgs = {
  allowClear: true,
  changeOnSelect: false,
  disabled: false,
  expandTrigger: "click",
  multiple: false,
  placeholder: "Please select",
  placement: "bottomLeft",
  showSearch: false,
  size: "medium",
  value: "",
  variant: "outlined"
} satisfies CascaderStoryArgs;

const storyDescriptions = {
  basic: "기본 Cascader는 여러 단계로 연결된 선택지를 한 번의 popup에서 순서대로 선택합니다.",
  defaultValue: "value에 선택 경로 배열을 지정해 초기 선택 상태와 표시 값을 확인합니다.",
  hover: "expand-trigger를 hover로 설정해 마우스를 올렸을 때 다음 단계 메뉴가 열리는 흐름을 확인합니다.",
  disabledOption: "disabled 옵션은 선택과 확장이 막히고 비활성 상태로 표시됩니다.",
  changeOnSelect: "change-on-select를 사용하면 마지막 단계가 아니어도 현재 단계 값을 선택할 수 있습니다.",
  multiple: "multiple 상태에서는 각 option 앞의 checkbox로 여러 경로를 선택하고 selector 안에 선택값이 tag 형태로 추가됩니다.",
  size: "small, default, large 크기별 selector 높이와 popup 배치를 세로로 비교합니다.",
  search: "show-search 상태에서 경로 label을 검색하고 검색 결과를 직접 선택합니다.",
  variants: "outlined, filled, borderless, underlined variant별 selector 스타일을 비교합니다.",
  status: "error와 warning 상태에서 validation border 색상이 유지되는지 확인합니다.",
  placement: "placement 값에 따라 popup이 selector 기준 어느 방향으로 열리는지 확인합니다.",
  panel: "selector 없이 Cascader panel처럼 메뉴 영역을 열린 상태로 유지하는 사용 방식을 확인합니다."
};

function ensureCascaderDefined() {
  defineDsCascader();
}

function createCascader(args: CascaderStoryArgs, options: CascaderOption[] = locationOptions) {
  const element = document.createElement("ds-cascader");

  element.setAttribute("expand-trigger", args.expandTrigger);
  element.setAttribute("options", JSON.stringify(options));
  element.setAttribute("placeholder", args.placeholder);
  element.setAttribute("placement", args.placement);
  element.setAttribute("size", args.size);
  element.setAttribute("value", args.value);
  element.setAttribute("variant", args.variant);
  element.toggleAttribute("allow-clear", args.allowClear);
  element.toggleAttribute("change-on-select", args.changeOnSelect);
  element.toggleAttribute("disabled", args.disabled);
  element.toggleAttribute("multiple", args.multiple);
  element.toggleAttribute("show-search", args.showSearch);

  if (args.status) {
    element.setAttribute("status", args.status);
  }

  return element;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-cascader-story-frame";
  frame.append(...children);

  return frame;
}

function createStack(children: HTMLElement[]) {
  const stack = document.createElement("div");

  stack.className = "ds-cascader-story-stack";
  stack.append(...children);

  return stack;
}

function createRow(children: HTMLElement[]) {
  const row = document.createElement("div");

  row.className = "ds-cascader-story-row";
  row.append(...children);

  return row;
}

function createSection(title: string, children: HTMLElement[]) {
  const section = document.createElement("section");
  const heading = document.createElement("h3");

  section.className = "ds-cascader-story-section";
  heading.className = "ds-cascader-story-section__title";
  heading.textContent = title;
  section.append(heading, ...children);

  return section;
}

function createOutput(element: HTMLElement) {
  const output = document.createElement("pre");

  output.className = "ds-cascader-story-output";
  output.textContent = "value: ";
  element.addEventListener("ds-cascader-change", (event) => {
    const detail = (event as CustomEvent<{ value: string[]; values: string[][] }>).detail;

    output.textContent = `value: ${detail.value.join(" / ")}\nvalues: ${JSON.stringify(detail.values)}`;
  });

  return output;
}

function renderBasicStory(args: CascaderStoryArgs) {
  ensureCascaderDefined();
  const element = createCascader(args);

  element.classList.add("ds-cascader-story-wide");

  return createFrame([element]);
}

function renderOutputStory(args: CascaderStoryArgs, options: CascaderOption[] = locationOptions) {
  ensureCascaderDefined();
  const element = createCascader(args, options);

  element.classList.add("ds-cascader-story-wide");

  return createFrame([createStack([element, createOutput(element)])]);
}

function renderMultipleStory(args: CascaderStoryArgs) {
  ensureCascaderDefined();
  const element = createCascader(args);

  element.classList.add("ds-cascader-story-multiple");

  return createFrame([createStack([element, createOutput(element)])]);
}

function renderSizeStory(args: CascaderStoryArgs) {
  ensureCascaderDefined();

  return createFrame([
    createStack(
      (["small", "medium", "large"] as const).map((size) => {
        return createSection(size === "medium" ? "Default" : size, [
          createCascader({
            ...args,
            placeholder: size,
            size
          })
        ]);
      })
    )
  ]);
}

function renderVariantStory(args: CascaderStoryArgs) {
  ensureCascaderDefined();

  return createFrame([
    createStack(
      (["outlined", "filled", "borderless", "underlined"] as const).map((variant) => {
        return createSection(variant, [
          createCascader({
            ...args,
            placeholder: variant,
            variant
          })
        ]);
      })
    )
  ]);
}

function renderStatusStory(args: CascaderStoryArgs) {
  ensureCascaderDefined();

  return createFrame([
    createRow([
      createSection("Error", [createCascader({ ...args, placeholder: "error status", status: "error" })]),
      createSection("Warning", [createCascader({ ...args, placeholder: "warning status", status: "warning" })])
    ])
  ]);
}

function renderPlacementStory(args: CascaderStoryArgs) {
  ensureCascaderDefined();

  return createFrame([
    createRow(
      (["bottomLeft", "bottomRight", "topLeft", "topRight"] as const).map((placement) => {
        return createSection(placement, [
          createCascader({
            ...args,
            placeholder: placement,
            placement
          })
        ]);
      })
    )
  ]);
}

function renderPanelStory(args: CascaderStoryArgs) {
  ensureCascaderDefined();
  const element = createCascader(
    {
      ...args,
      placeholder: "Panel"
    },
    productOptions
  );

  element.setAttribute("open", "true");
  element.classList.add("ds-cascader-story-wide");

  return createFrame([element]);
}

function createDocsDescription(description: string) {
  return {
    docs: {
      description: {
        story: description
      }
    }
  };
}

const meta = {
  title: "Components/Data Entry/Cascader",
  tags: ["autodocs"],
  render: renderBasicStory,
  args: defaultArgs,
  argTypes: {
    expandTrigger: {
      control: "select",
      options: ["click", "hover"]
    },
    placement: {
      control: "select",
      options: ["bottomLeft", "bottomRight", "topLeft", "topRight"]
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"]
    },
    status: {
      control: "select",
      options: [undefined, "error", "warning"]
    },
    variant: {
      control: "select",
      options: ["outlined", "filled", "borderless", "underlined"]
    }
  },
  parameters: {
    docs: {
      description: {
        component: "계층형 데이터를 여러 단계 메뉴로 탐색하고 하나 또는 여러 경로를 선택하는 컴포넌트입니다."
      }
    }
  }
} satisfies Meta<CascaderStoryArgs>;

export default meta;

type Story = StoryObj<CascaderStoryArgs>;

export const BasicUsage: Story = {
  parameters: createDocsDescription(storyDescriptions.basic)
};

export const DefaultValue: Story = {
  args: {
    value: JSON.stringify(["north-america", "canada", "toronto"])
  },
  parameters: createDocsDescription(storyDescriptions.defaultValue)
};

export const Hover: Story = {
  args: {
    expandTrigger: "hover"
  },
  parameters: createDocsDescription(storyDescriptions.hover)
};

export const DisabledOption: Story = {
  render: (args) => renderOutputStory(args, disabledOptions),
  parameters: createDocsDescription(storyDescriptions.disabledOption)
};

export const ChangeOnSelect: Story = {
  render: (args) => renderOutputStory(args),
  args: {
    changeOnSelect: true
  },
  parameters: createDocsDescription(storyDescriptions.changeOnSelect)
};

export const Multiple: Story = {
  render: renderMultipleStory,
  args: {
    multiple: true,
    value: JSON.stringify([
      ["north-america", "canada", "toronto"],
      ["europe", "france", "paris"]
    ])
  },
  parameters: createDocsDescription(storyDescriptions.multiple)
};

export const Size: Story = {
  render: renderSizeStory,
  parameters: createDocsDescription(storyDescriptions.size)
};

export const Search: Story = {
  render: (args) => renderOutputStory(args),
  args: {
    showSearch: true
  },
  parameters: createDocsDescription(storyDescriptions.search)
};

export const Variants: Story = {
  render: renderVariantStory,
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

export const Panel: Story = {
  render: renderPanelStory,
  parameters: createDocsDescription(storyDescriptions.panel)
};

export const Disabled: Story = {
  args: {
    disabled: true
  },
  parameters: createDocsDescription("disabled 상태에서는 selector와 popup interaction이 모두 비활성화됩니다.")
};
