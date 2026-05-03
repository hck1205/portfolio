import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Mentions.stories.css";
import {
  defineDsMentions,
  type MentionsPlacement,
  type MentionsSize,
  type MentionsStatus,
  type MentionsVariant
} from ".";

type MentionsStoryArgs = {
  allowClear: boolean;
  autosize: boolean;
  disabled: boolean;
  filterOption: boolean;
  maxRows?: number;
  notFoundContent: string;
  placeholder: string;
  placement: MentionsPlacement;
  prefix: string;
  readonly: boolean;
  rows: number;
  size: MentionsSize;
  split: string;
  status?: MentionsStatus;
  value: string;
  variant: MentionsVariant;
};

type MentionOptionStoryData = {
  disabled?: boolean;
  label: string;
  value: string;
};

type FormFieldElements = {
  control: HTMLDivElement;
  help: HTMLDivElement;
  row: HTMLDivElement;
};

const defaultOptions = [
  { label: "Chris", value: "chris" },
  { label: "Daisy", value: "daisy" },
  { label: "Jason", value: "jason" },
  { label: "Taylor", value: "taylor" }
] satisfies MentionOptionStoryData[];

const coderOptions = [
  { label: "afc163", value: "afc163" },
  { label: "zombieJ", value: "zombieJ" },
  { label: "yesmeck", value: "yesmeck" }
] satisfies MentionOptionStoryData[];

const triggerTokenOptions = [
  { label: "Design", value: "design" },
  { label: "Frontend", value: "frontend" },
  { label: "Budget", value: "budget" },
  { label: "Invoice", value: "invoice" }
] satisfies MentionOptionStoryData[];

const defaultArgs = {
  allowClear: false,
  autosize: false,
  disabled: false,
  filterOption: true,
  maxRows: undefined,
  notFoundContent: "결과가 없습니다",
  placeholder: "@를 입력해 멘션을 추가하세요",
  placement: "bottom",
  prefix: "@",
  readonly: false,
  rows: 1,
  size: "medium",
  split: " ",
  status: undefined,
  value: "",
  variant: "outlined"
} satisfies MentionsStoryArgs;

const storyDescriptions = {
  basic: "특정 prefix를 입력하면 추천 목록을 열고 선택한 값을 본문에 삽입합니다.",
  placement: "추천 목록이 입력 영역 위 또는 아래에 열리는 위치를 확인합니다.",
  size: "large, default, small 크기의 입력 높이와 텍스트 크기 차이를 확인합니다.",
  form: "controlled form 흐름에서 한 줄 Mentions와 여러 줄 Mentions의 검증, submit, reset 상태를 확인합니다.",
  prefix: "여러 trigger 문자를 지원하는 prefix 설정을 확인합니다.",
  triggerToken: "기본값과 다른 trigger token인 #, $로 추천 목록을 여는 흐름을 확인합니다.",
  variants: "outlined, filled, borderless, underlined 입력 스타일을 확인합니다.",
  status: "error와 warning 상태에서 border와 focus 표현이 달라지는지 확인합니다.",
  disabled: "disabled와 readonly 상태에서 입력 및 옵션 선택이 제한되는지 확인합니다.",
  allowClear: "입력값이 있을 때 clear 버튼을 표시하고 값을 지울 수 있습니다.",
  autosize: "autosize와 max-rows 조합으로 여러 줄 입력 높이가 제한되는지 확인합니다."
};

function ensureMentionsDefined() {
  defineDsMentions();
}

function createMentions(args: MentionsStoryArgs, options: MentionOptionStoryData[] = defaultOptions) {
  const element = document.createElement("ds-mentions");

  syncStringAttributes(element, {
    "filter-option": String(args.filterOption),
    "not-found-content": args.notFoundContent,
    placeholder: args.placeholder,
    placement: args.placement,
    prefix: args.prefix,
    rows: String(args.rows),
    size: args.size,
    split: args.split,
    variant: args.variant
  });
  syncBooleanAttributes(element, {
    "allow-clear": args.allowClear,
    autosize: args.autosize,
    disabled: args.disabled,
    readonly: args.readonly
  });

  if (args.maxRows) {
    element.setAttribute("max-rows", String(args.maxRows));
  }

  if (args.status) {
    element.setAttribute("status", args.status);
  }

  if (args.value) {
    element.setAttribute("value", args.value);
  }

  element.append(...options.map(createMentionOption));

  return element;
}

function createMentionOption(option: MentionOptionStoryData) {
  const element = document.createElement("ds-mention-option");

  element.setAttribute("label", option.label);
  element.setAttribute("value", option.value);
  element.toggleAttribute("disabled", Boolean(option.disabled));

  return element;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-mentions-story-frame";
  frame.append(...children);

  return frame;
}

function createStack(children: HTMLElement[]) {
  const stack = document.createElement("div");

  stack.className = "ds-mentions-story-stack";
  stack.append(...children);

  return stack;
}

function createSection(title: string, children: HTMLElement[]) {
  const section = document.createElement("section");
  const heading = document.createElement("h3");

  section.className = "ds-mentions-story-section";
  heading.className = "ds-mentions-story-section__title";
  heading.textContent = title;
  section.append(heading, ...children);

  return section;
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

function renderDefault(args: MentionsStoryArgs) {
  ensureMentionsDefined();

  return createFrame([createMentions(args)]);
}

function renderPlacementStory() {
  ensureMentionsDefined();

  return createFrame([
    createSection("Bottom", [createMentions({ ...defaultArgs, placement: "bottom", value: "안녕하세요 @" })]),
    createSection("Top", [createMentions({ ...defaultArgs, placement: "top", value: "검색어 @" })])
  ]);
}

function renderSizeStory() {
  ensureMentionsDefined();

  return createFrame([
    createStack([
      createMentions({ ...defaultArgs, placeholder: "Large", size: "large" }),
      createMentions({ ...defaultArgs, placeholder: "Default", size: "medium" }),
      createMentions({ ...defaultArgs, placeholder: "Small", size: "small" })
    ])
  ]);
}

function renderFormStory() {
  ensureMentionsDefined();

  const form = document.createElement("form");
  const codersField = createFormField("Top coders");
  const bioField = createFormField("Bio");
  const submitButton = createFormButton("Submit", "submit");
  const resetButton = createFormButton("Reset", "reset");
  const codersMentions = createMentions(
    {
      ...defaultArgs,
      placeholder: "@로 2명 이상 선택하세요",
      value: "@afc163"
    },
    coderOptions
  );
  const bioMentions = createMentions(
    {
      ...defaultArgs,
      placeholder: "You can use @ to ref user here",
      rows: 3
    },
    coderOptions
  );
  const validate = () => validateMentionsForm({ bioField, bioMentions, codersField, codersMentions });

  form.className = "ds-mentions-story-form ds-mentions-story-form--horizontal";
  codersMentions.setAttribute("name", "coders");
  bioMentions.setAttribute("name", "bio");
  bioMentions.setAttribute("required", "");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    validate();
  });
  resetButton.addEventListener("click", () => {
    setMentionsValue(codersMentions, "@afc163");
    setMentionsValue(bioMentions, "");
    clearFormValidation(codersField, codersMentions);
    clearFormValidation(bioField, bioMentions);
  });

  codersField.control.prepend(codersMentions);
  bioField.control.prepend(bioMentions);
  form.append(codersField.row, bioField.row, createFormActions([submitButton, resetButton]));

  return createFrame([form]);
}

function renderPrefixStory() {
  ensureMentionsDefined();

  return createFrame([
    createMentions(
      {
        ...defaultArgs,
        placeholder: "@ 또는 #을 입력하세요",
        prefix: "@,#",
        value: "담당자 @, 주제 #"
      },
      [...defaultOptions, { label: "Design System", value: "design-system" }, { label: "Release", value: "release" }]
    )
  ]);
}

function renderCustomizeTriggerTokenStory() {
  ensureMentionsDefined();

  return createFrame([
    createStack([
      createMentions(
        {
          ...defaultArgs,
          placeholder: "# 또는 $를 입력하세요",
          prefix: "#,$",
          value: "태그 #, 비용 $"
        },
        triggerTokenOptions
      )
    ])
  ]);
}

function renderVariantsStory() {
  ensureMentionsDefined();

  return createFrame([
    createStack([
      createMentions({ ...defaultArgs, placeholder: "Outlined", variant: "outlined" }),
      createMentions({ ...defaultArgs, placeholder: "Filled", variant: "filled" }),
      createMentions({ ...defaultArgs, placeholder: "Borderless", variant: "borderless" }),
      createMentions({ ...defaultArgs, placeholder: "Underlined", variant: "underlined" })
    ])
  ]);
}

function renderStatusStory() {
  ensureMentionsDefined();

  return createFrame([
    createStack([
      createMentions({ ...defaultArgs, status: "error", value: "필수 담당자 @" }),
      createMentions({ ...defaultArgs, status: "warning", value: "확인 필요 @" })
    ])
  ]);
}

function renderDisabledStory() {
  ensureMentionsDefined();

  return createFrame([
    createStack([
      createMentions({ ...defaultArgs, disabled: true, value: "비활성 상태 @chris" }),
      createMentions({ ...defaultArgs, readonly: true, value: "읽기 전용 @daisy" })
    ])
  ]);
}

function renderAllowClearStory() {
  ensureMentionsDefined();

  return createFrame([
    createMentions({
      ...defaultArgs,
      allowClear: true,
      value: "회의 참석자 @chris @daisy"
    })
  ]);
}

function renderAutosizeStory() {
  ensureMentionsDefined();

  return createFrame([
    createMentions({
      ...defaultArgs,
      autosize: true,
      maxRows: 4,
      rows: 2,
      value: "여러 줄 입력에서 @를 입력해 추천 목록을 확인합니다."
    })
  ]);
}

function createFormField(labelText: string): FormFieldElements {
  const row = document.createElement("div");
  const label = document.createElement("label");
  const control = document.createElement("div");
  const help = document.createElement("div");

  row.className = "ds-mentions-story-form__row";
  label.className = "ds-mentions-story-form__label";
  control.className = "ds-mentions-story-form__control";
  help.className = "ds-mentions-story-form__help";
  label.textContent = labelText;
  row.append(label, control);
  control.append(help);

  return {
    control,
    help,
    row
  };
}

function createFormActions(buttons: HTMLButtonElement[]) {
  const row = document.createElement("div");
  const spacer = document.createElement("div");
  const actions = document.createElement("div");

  row.className = "ds-mentions-story-form__row";
  spacer.className = "ds-mentions-story-form__label";
  actions.className = "ds-mentions-story-form__actions";
  actions.append(...buttons);
  row.append(spacer, actions);

  return row;
}

function createFormButton(label: string, variant: "submit" | "reset") {
  const button = document.createElement("button");

  button.className = `ds-mentions-story-form__${variant}`;
  button.type = variant === "submit" ? "submit" : "button";
  button.textContent = label;

  return button;
}

function validateMentionsForm({
  bioField,
  bioMentions,
  codersField,
  codersMentions
}: {
  bioField: FormFieldElements;
  bioMentions: HTMLElement;
  codersField: FormFieldElements;
  codersMentions: HTMLElement;
}) {
  let valid = true;

  clearFormValidation(codersField, codersMentions);
  clearFormValidation(bioField, bioMentions);

  if (getMentionTokens(getMentionsValue(codersMentions)).length < 2) {
    setFormError(codersField, codersMentions, "2명 이상 선택해야 합니다.");
    valid = false;
  }

  if (!getMentionsValue(bioMentions).trim()) {
    setFormError(bioField, bioMentions, "Bio를 입력하세요.");
    valid = false;
  }

  return valid;
}

function setFormError(field: FormFieldElements, mentions: HTMLElement, message: string) {
  mentions.setAttribute("status", "error");
  field.help.textContent = message;
}

function clearFormValidation(field: FormFieldElements, mentions: HTMLElement) {
  mentions.removeAttribute("status");
  field.help.textContent = "";
}

function getMentionsValue(element: HTMLElement) {
  return (element as HTMLElement & { value?: string }).value ?? element.getAttribute("value") ?? "";
}

function setMentionsValue(element: HTMLElement, value: string) {
  (element as HTMLElement & { value?: string }).value = value;
}

function getMentionTokens(value: string) {
  return value.match(/@\S+/g) ?? [];
}

function syncStringAttributes(element: HTMLElement, attributes: Record<string, string>) {
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
}

function syncBooleanAttributes(element: HTMLElement, attributes: Record<string, boolean>) {
  for (const [name, value] of Object.entries(attributes)) {
    element.toggleAttribute(name, value);
  }
}

const meta: Meta<MentionsStoryArgs> = {
  title: "Components/Data Entry/Mentions",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "특정 prefix를 입력했을 때 추천 목록을 제공하고 선택한 항목을 텍스트에 삽입하는 입력 컴포넌트입니다."
      }
    }
  },
  argTypes: {
    allowClear: { control: "boolean" },
    autosize: { control: "boolean" },
    disabled: { control: "boolean" },
    filterOption: { control: "boolean" },
    maxRows: { control: "number" },
    notFoundContent: { control: "text" },
    placeholder: { control: "text" },
    placement: {
      control: "inline-radio",
      options: ["bottom", "top"]
    },
    prefix: { control: "text" },
    readonly: { control: "boolean" },
    rows: { control: "number" },
    size: {
      control: "inline-radio",
      options: ["small", "medium", "large"]
    },
    split: { control: "text" },
    status: {
      control: "inline-radio",
      options: [undefined, "error", "warning"]
    },
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

type Story = StoryObj<MentionsStoryArgs>;

export const Basic: Story = {
  parameters: createDocsDescription(storyDescriptions.basic)
};

export const Placement: Story = {
  render: renderPlacementStory,
  parameters: createDocsDescription(storyDescriptions.placement)
};

export const Size: Story = {
  render: renderSizeStory,
  parameters: createDocsDescription(storyDescriptions.size)
};

export const WithForm: Story = {
  render: renderFormStory,
  parameters: createDocsDescription(storyDescriptions.form)
};

export const Prefix: Story = {
  render: renderPrefixStory,
  parameters: createDocsDescription(storyDescriptions.prefix)
};

export const CustomizeTriggerToken: Story = {
  render: renderCustomizeTriggerTokenStory,
  parameters: createDocsDescription(storyDescriptions.triggerToken)
};

export const Variants: Story = {
  render: renderVariantsStory,
  parameters: createDocsDescription(storyDescriptions.variants)
};

export const Status: Story = {
  render: renderStatusStory,
  parameters: createDocsDescription(storyDescriptions.status)
};

export const DisabledAndReadOnly: Story = {
  render: renderDisabledStory,
  parameters: createDocsDescription(storyDescriptions.disabled)
};

export const AllowClear: Story = {
  render: renderAllowClearStory,
  parameters: createDocsDescription(storyDescriptions.allowClear)
};

export const AutoSize: Story = {
  render: renderAutosizeStory,
  parameters: createDocsDescription(storyDescriptions.autosize)
};
