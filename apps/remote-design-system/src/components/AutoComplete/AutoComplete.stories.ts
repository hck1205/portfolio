import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./AutoComplete.stories.css";
import {
  defineDsAutoComplete,
  type AutoCompleteInputMode,
  type AutoCompleteOption,
  type AutoCompleteSize,
  type AutoCompleteStatus,
  type AutoCompleteVariant
} from ".";

type AutoCompleteStoryArgs = {
  allowClear: boolean;
  backfill: boolean;
  defaultActiveFirstOption: boolean;
  disabled: boolean;
  filterOption: boolean;
  inputMode: AutoCompleteInputMode;
  placeholder: string;
  size: AutoCompleteSize;
  status?: AutoCompleteStatus;
  value: string;
  variant: AutoCompleteVariant;
};

const basicOptions = [
  { value: "Burns Bay Road" },
  { value: "Downing Street" },
  { value: "Wall Street" }
] satisfies AutoCompleteOption[];

const languageOptions = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "Rust", value: "rust" },
  { label: "Kotlin", value: "kotlin" }
] satisfies AutoCompleteOption[];

const categoryOptions = [
  { label: "Libraries - React", value: "react" },
  { label: "Libraries - Vue", value: "vue" },
  { label: "Frameworks - Next.js", value: "nextjs" },
  { label: "Frameworks - Remix", value: "remix" },
  { label: "Tools - Vite", value: "vite" }
] satisfies AutoCompleteOption[];

const defaultArgs = {
  allowClear: false,
  backfill: false,
  defaultActiveFirstOption: true,
  disabled: false,
  filterOption: true,
  inputMode: "input",
  placeholder: "input here",
  size: "medium",
  value: "",
  variant: "outlined"
} satisfies AutoCompleteStoryArgs;

const storyDescriptions = {
  basic: "기본 AutoComplete는 입력값에 따라 옵션 목록을 열고 선택한 값을 input에 반영합니다.",
  customized: "label과 value가 다른 옵션을 사용해 추천 목록의 표시 텍스트를 커스터마이즈합니다.",
  customInput: "input-mode를 textarea로 바꿔 여러 줄 입력 영역에서도 추천 목록이 같은 방식으로 동작하는지 확인합니다.",
  caseInsensitive: "대소문자를 구분하지 않는 필터링으로 입력값과 옵션 label, value를 비교합니다.",
  certainLookup: "카테고리가 확정된 추천어처럼 label에 구분 정보를 포함한 옵션 목록을 보여줍니다.",
  uncertainLookup: "입력값이 선택지에 없어도 자유 입력을 유지하고, 옵션 선택 시에만 select 이벤트를 발생시킵니다.",
  status: "error와 warning 상태에서 border 색상과 focus 상태가 함께 유지되는지 비교합니다.",
  variants: "outlined, filled, borderless, underlined variant별 입력 스타일을 같은 옵션으로 비교합니다.",
  clear: "allow-clear 상태에서 입력값이 있을 때 clear 버튼이 표시되고 clear 이벤트가 발생합니다.",
  sizes: "small, default, large 크기별 높이와 폰트 크기를 비교합니다.",
  childOptions: "추천 옵션을 속성 값이 아니라 자식 요소로 직접 선언하는 사용 방식을 확인합니다.",
  disabled: "disabled 상태에서는 입력, clear, 추천 목록 열림이 비활성화됩니다."
};

function ensureAutoCompleteDefined() {
  defineDsAutoComplete();
}

function createAutoComplete(args: AutoCompleteStoryArgs, options: AutoCompleteOption[] = basicOptions) {
  const element = document.createElement("ds-auto-complete");

  element.setAttribute("options", JSON.stringify(options));
  element.setAttribute("placeholder", args.placeholder);
  element.setAttribute("size", args.size);
  element.setAttribute("variant", args.variant);
  element.setAttribute("value", args.value);
  element.setAttribute("input-mode", args.inputMode);
  element.toggleAttribute("allow-clear", args.allowClear);
  element.toggleAttribute("backfill", args.backfill);
  element.toggleAttribute("disabled", args.disabled);
  element.setAttribute("default-active-first-option", String(args.defaultActiveFirstOption));
  element.setAttribute("filter-option", String(args.filterOption));

  if (args.status) {
    element.setAttribute("status", args.status);
  }

  return element;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-auto-complete-story-frame";
  frame.append(...children);

  return frame;
}

function createStack(children: HTMLElement[]) {
  const stack = document.createElement("div");

  stack.className = "ds-auto-complete-story-stack";
  stack.append(...children);

  return stack;
}

function createRow(children: HTMLElement[]) {
  const row = document.createElement("div");

  row.className = "ds-auto-complete-story-row";
  row.append(...children);

  return row;
}

function createSection(title: string, children: HTMLElement[]) {
  const section = document.createElement("section");
  const heading = document.createElement("h3");

  section.className = "ds-auto-complete-story-section";
  heading.className = "ds-auto-complete-story-section__title";
  heading.textContent = title;
  section.append(heading, ...children);

  return section;
}

function createOutput(element: HTMLElement) {
  const output = document.createElement("pre");

  output.className = "ds-auto-complete-story-output";
  output.textContent = "value: ";
  element.addEventListener("ds-auto-complete-change", (event) => {
    const detail = (event as CustomEvent<{ value: string }>).detail;

    output.textContent = `change: ${detail.value}`;
  });
  element.addEventListener("ds-auto-complete-select", (event) => {
    const detail = (event as CustomEvent<{ value: string }>).detail;

    output.textContent = `select: ${detail.value}`;
  });
  element.addEventListener("ds-auto-complete-clear", () => {
    output.textContent = "clear";
  });

  return output;
}

function renderBasicStory(args: AutoCompleteStoryArgs) {
  ensureAutoCompleteDefined();
  const element = createAutoComplete(args);

  element.classList.add("ds-auto-complete-story-wide");

  return createFrame([element]);
}

function renderOutputStory(args: AutoCompleteStoryArgs, options: AutoCompleteOption[]) {
  ensureAutoCompleteDefined();
  const element = createAutoComplete(args, options);

  element.classList.add("ds-auto-complete-story-wide");

  return createFrame([createStack([element, createOutput(element)])]);
}

function renderVariantStory(args: AutoCompleteStoryArgs) {
  ensureAutoCompleteDefined();

  return createFrame([
    createStack(
      (["outlined", "filled", "borderless", "underlined"] as const).map((variant) => {
        return createSection(variant, [
          createAutoComplete(
            {
              ...args,
              placeholder: variant,
              variant
            },
            languageOptions
          )
        ]);
      })
    )
  ]);
}

function renderStatusStory(args: AutoCompleteStoryArgs) {
  ensureAutoCompleteDefined();

  return createFrame([
    createRow([
      createSection("Error", [
        createAutoComplete(
          {
            ...args,
            placeholder: "error status",
            status: "error"
          },
          languageOptions
        )
      ]),
      createSection("Warning", [
        createAutoComplete(
          {
            ...args,
            placeholder: "warning status",
            status: "warning"
          },
          languageOptions
        )
      ])
    ])
  ]);
}

function renderSizeStory(args: AutoCompleteStoryArgs) {
  ensureAutoCompleteDefined();

  return createFrame([
    createStack(
      (["small", "medium", "large"] as const).map((size) => {
        return createSection(size === "medium" ? "Default" : size, [
          createAutoComplete(
            {
              ...args,
              placeholder: size,
              size
            },
            languageOptions
          )
        ]);
      })
    )
  ]);
}

function renderTextareaStory(args: AutoCompleteStoryArgs) {
  ensureAutoCompleteDefined();
  const element = createAutoComplete(
    {
      ...args,
      inputMode: "textarea",
      placeholder: "여러 줄 입력에서도 추천을 확인합니다"
    },
    languageOptions
  );

  element.classList.add("ds-auto-complete-story-textarea");

  return createFrame([element]);
}

function renderChildOptionsStory(args: AutoCompleteStoryArgs) {
  ensureAutoCompleteDefined();
  const element = createAutoComplete(
    {
      ...args,
      placeholder: "자식 옵션으로 검색"
    },
    []
  );

  for (const option of languageOptions) {
    const optionElement = document.createElement("ds-auto-complete-option");

    optionElement.setAttribute("value", option.value);
    optionElement.setAttribute("label", option.label ?? option.value);
    element.append(optionElement);
  }

  element.classList.add("ds-auto-complete-story-wide");

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
  title: "Components/Data Entry/AutoComplete",
  tags: ["autodocs"],
  render: renderBasicStory,
  args: defaultArgs,
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large"]
    },
    status: {
      control: "select",
      options: [undefined, "error", "warning"]
    },
    inputMode: {
      control: "select",
      options: ["input", "textarea"]
    },
    variant: {
      control: "select",
      options: ["outlined", "filled", "borderless", "underlined"]
    }
  },
  parameters: {
    docs: {
      description: {
        component: "입력 필드에 추천 옵션을 결합해 자유 입력과 빠른 선택을 함께 제공하는 컴포넌트입니다."
      }
    }
  }
} satisfies Meta<AutoCompleteStoryArgs>;

export default meta;

type Story = StoryObj<AutoCompleteStoryArgs>;

export const BasicUsage: Story = {
  parameters: createDocsDescription(storyDescriptions.basic)
};

export const Customized: Story = {
  render: (args) => renderOutputStory(args, languageOptions),
  args: {
    allowClear: true,
    placeholder: "언어를 입력하세요"
  },
  parameters: createDocsDescription(storyDescriptions.customized)
};

export const CustomizeInputComponent: Story = {
  render: renderTextareaStory,
  parameters: createDocsDescription(storyDescriptions.customInput)
};

export const NonCaseSensitive: Story = {
  render: (args) =>
    renderOutputStory(
      {
        ...args,
        placeholder: "TypeScript 또는 typescript"
      },
      languageOptions
    ),
  parameters: createDocsDescription(storyDescriptions.caseInsensitive)
};

export const LookupPatternsCertainCategory: Story = {
  render: (args) =>
    renderOutputStory(
      {
        ...args,
        placeholder: "카테고리 검색"
      },
      categoryOptions
    ),
  parameters: createDocsDescription(storyDescriptions.certainLookup)
};

export const LookupPatternsUncertainCategory: Story = {
  render: (args) =>
    renderOutputStory(
      {
        ...args,
        allowClear: true,
        placeholder: "없는 값도 입력 가능"
      },
      languageOptions
    ),
  parameters: createDocsDescription(storyDescriptions.uncertainLookup)
};

export const Status: Story = {
  render: renderStatusStory,
  parameters: createDocsDescription(storyDescriptions.status)
};

export const Variants: Story = {
  render: renderVariantStory,
  parameters: createDocsDescription(storyDescriptions.variants)
};

export const CustomizeClearButton: Story = {
  render: (args) =>
    renderOutputStory(
      {
        ...args,
        allowClear: true,
        placeholder: "clear button",
        value: "typescript"
      },
      languageOptions
    ),
  parameters: createDocsDescription(storyDescriptions.clear)
};

export const Sizes: Story = {
  render: renderSizeStory,
  parameters: createDocsDescription(storyDescriptions.sizes)
};

export const ChildOptions: Story = {
  render: renderChildOptionsStory,
  parameters: createDocsDescription(storyDescriptions.childOptions)
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "disabled"
  },
  parameters: createDocsDescription(storyDescriptions.disabled)
};
