import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Form.stories.css";
import {
  defineDsForm,
  type FormLabelAlign,
  type FormLayout,
  type FormRequiredMark,
  type FormSize,
  type FormValidateTrigger,
  type FormVariant
} from ".";

type FormStoryArgs = {
  colon: boolean;
  disabled: boolean;
  labelAlign: FormLabelAlign;
  layout: FormLayout;
  requiredMark: FormRequiredMark;
  size: FormSize;
  validateTrigger: FormValidateTrigger;
  variant: FormVariant;
};

type FieldOptions = {
  extra?: string;
  help?: string;
  label: string;
  layout?: FormLayout;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: "input" | "password" | "textarea" | "select";
  validateStatus?: string;
  value?: string;
};

const defaultArgs = {
  colon: true,
  disabled: false,
  labelAlign: "left",
  layout: "horizontal",
  requiredMark: "true",
  size: "medium",
  validateTrigger: "onSubmit",
  variant: "outlined"
} satisfies FormStoryArgs;

const storyDescriptions = {
  basic: "기본 폼 구조에서 label, required, help, submit validation 흐름을 확인합니다.",
  methods: "Submit과 Reset을 실행했을 때 입력값 수집, 필수값 검증, 초기화 동작을 확인합니다.",
  layout: "horizontal, vertical, inline 레이아웃 차이를 같은 필드 구성으로 비교합니다.",
  mixLayout: "폼 기본 레이아웃 안에서 특정 item만 다른 레이아웃으로 배치하는 구성을 확인합니다.",
  disabled: "form disabled 상태가 내부 native controls까지 전파되는지 확인합니다.",
  variants: "outlined, filled, borderless, underlined 입력 스타일이 form 단위로 적용되는지 확인합니다.",
  requiredMark: "필수 표시, 숨김, optional 표시의 required mark 방식을 비교합니다.",
  size: "small, default, large 크기가 폼 내부 control에 전파되는지 확인합니다.",
  labelWrap: "긴 label이 있는 horizontal form에서 label 영역과 control 영역이 안정적으로 배치되는지 확인합니다.",
  validateTrigger: "onChange validation에서 입력 변경 즉시 required 상태가 갱신되는지 확인합니다.",
  inlineLogin: "inline layout을 사용한 compact login form 구성을 확인합니다.",
  registration: "회원가입처럼 여러 required 필드와 선택 항목이 섞인 form 구성을 확인합니다."
};

function ensureFormDefined() {
  defineDsForm();
}

function createForm(args: FormStoryArgs, children: HTMLElement[]) {
  const form = document.createElement("ds-form");

  setStringAttributes(form, {
    colon: String(args.colon),
    "label-align": args.labelAlign,
    layout: args.layout,
    "required-mark": args.requiredMark,
    size: args.size,
    "validate-trigger": args.validateTrigger,
    variant: args.variant
  });
  form.toggleAttribute("disabled", args.disabled);
  form.append(...children);

  return form;
}

function createFormItem({ extra, help, label, layout, name, placeholder, required, type = "input", validateStatus, value }: FieldOptions) {
  const item = document.createElement("ds-form-item");

  setStringAttributes(item, {
    label,
    name
  });
  item.toggleAttribute("required", Boolean(required));

  if (extra) {
    item.setAttribute("extra", extra);
  }

  if (help) {
    item.setAttribute("help", help);
  }

  if (layout) {
    item.setAttribute("layout", layout);
  }

  if (validateStatus) {
    item.setAttribute("validate-status", validateStatus);
  }

  item.append(createControl({ name, placeholder, type, value }));

  return item;
}

function createControl({ name, placeholder, type, value }: Pick<FieldOptions, "name" | "placeholder" | "type" | "value">) {
  if (type === "textarea") {
    const textarea = document.createElement("textarea");

    textarea.name = name;
    textarea.placeholder = placeholder ?? "";
    textarea.value = value ?? "";

    return textarea;
  }

  if (type === "select") {
    const select = document.createElement("select");

    select.name = name;
    for (const optionLabel of ["Designer", "Engineer", "Product Manager"]) {
      const option = document.createElement("option");

      option.value = optionLabel.toLowerCase().replaceAll(" ", "-");
      option.textContent = optionLabel;
      select.append(option);
    }

    return select;
  }

  const input = document.createElement("input");

  input.name = name;
  input.placeholder = placeholder ?? "";
  input.type = type === "password" ? "password" : "text";
  input.value = value ?? "";

  return input;
}

function createActions() {
  const item = document.createElement("ds-form-item");
  const actions = document.createElement("div");

  item.setAttribute("no-style", "");
  actions.className = "ds-form-story-actions";
  actions.append(createButton("Submit", "submit", "primary"), createButton("Reset", "reset", "secondary"));
  item.append(actions);

  return item;
}

function createButton(label: string, type: "button" | "reset" | "submit", variant: "primary" | "secondary") {
  const button = document.createElement("button");

  button.className = `ds-form-story-button ds-form-story-button--${variant}`;
  button.type = type;
  button.textContent = label;

  return button;
}

function createOutput(text = "Submit 결과가 여기에 표시됩니다.") {
  const output = document.createElement("pre");

  output.className = "ds-form-story-output";
  output.textContent = text;

  return output;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-form-story-frame";
  frame.append(...children);

  return frame;
}

function createStack(children: HTMLElement[]) {
  const stack = document.createElement("div");

  stack.className = "ds-form-story-stack";
  stack.append(...children);

  return stack;
}

function createSection(title: string, child: HTMLElement) {
  const section = document.createElement("section");
  const heading = document.createElement("h3");

  section.className = "ds-form-story-section";
  heading.className = "ds-form-story-section__title";
  heading.textContent = title;
  section.append(heading, child);

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

function createBasicFields() {
  return [
    createFormItem({
      label: "Username",
      name: "username",
      placeholder: "사용자 이름",
      required: true
    }),
    createFormItem({
      extra: "프로필에 표시되는 소개입니다.",
      label: "Bio",
      name: "bio",
      placeholder: "간단한 소개",
      type: "textarea"
    }),
    createActions()
  ];
}

function bindFormOutput(form: HTMLElement, output: HTMLElement) {
  form.addEventListener("ds-form-submit", (event) => {
    const { values } = (event as CustomEvent<{ values: Record<string, unknown> }>).detail;

    output.textContent = JSON.stringify(values, null, 2);
  });
  form.addEventListener("ds-form-submit-failed", (event) => {
    const { errorFields } = (event as CustomEvent<{ errorFields: unknown[] }>).detail;

    output.textContent = `검증 실패\n${JSON.stringify(errorFields, null, 2)}`;
  });
}

function renderDefault(args: FormStoryArgs) {
  ensureFormDefined();

  const form = createForm(args, createBasicFields());
  const output = createOutput();

  bindFormOutput(form, output);

  return createFrame([form, output]);
}

function renderMethodsStory(args: FormStoryArgs) {
  ensureFormDefined();

  const form = createForm(args, createBasicFields());
  const output = createOutput();
  const controls = document.createElement("div");
  const submitButton = createButton("form.submit()", "button", "primary");
  const resetButton = createButton("form.reset()", "button", "secondary");

  controls.className = "ds-form-story-actions";
  submitButton.addEventListener("click", () => (form as HTMLElement & { submit: () => void }).submit());
  resetButton.addEventListener("click", () => (form as HTMLElement & { reset: () => void }).reset());
  controls.append(submitButton, resetButton);
  bindFormOutput(form, output);

  return createFrame([controls, form, output]);
}

function renderLayoutStory(args: FormStoryArgs) {
  ensureFormDefined();

  return createFrame([
    createStack(
      (["horizontal", "vertical", "inline"] as const).map((layout) =>
        createSection(
          layout,
          createForm({ ...args, layout }, [
            createFormItem({ label: "Name", name: `${layout}-name`, placeholder: "이름" }),
            createFormItem({ label: "Role", name: `${layout}-role`, type: "select" }),
            createActions()
          ])
        )
      )
    )
  ]);
}

function renderMixLayoutStory(args: FormStoryArgs) {
  ensureFormDefined();

  return createFrame([
    createForm(args, [
      createFormItem({ label: "Horizontal", name: "horizontal", placeholder: "기본 layout" }),
      createFormItem({ label: "Inline", layout: "inline", name: "inline", placeholder: "item layout" }),
      createFormItem({ label: "Memo", name: "memo", placeholder: "vertical item", type: "textarea" }),
      createActions()
    ])
  ]);
}

function renderDisabledStory(args: FormStoryArgs) {
  ensureFormDefined();

  return createFrame([createForm({ ...args, disabled: true }, createBasicFields())]);
}

function renderVariantsStory(args: FormStoryArgs) {
  ensureFormDefined();

  return createFrame([
    createStack(
      (["outlined", "filled", "borderless", "underlined"] as const).map((variant) =>
        createSection(
          variant,
          createForm({ ...args, variant }, [
            createFormItem({ label: "Field", name: variant, placeholder: variant }),
            createActions()
          ])
        )
      )
    )
  ]);
}

function renderRequiredMarkStory(args: FormStoryArgs) {
  ensureFormDefined();

  return createFrame([
    createStack(
      (["true", "false", "optional"] as const).map((requiredMark) =>
        createSection(
          requiredMark,
          createForm({ ...args, requiredMark }, [
            createFormItem({ label: "Required", name: `${requiredMark}-required`, required: true }),
            createFormItem({ label: "Optional", name: `${requiredMark}-optional` })
          ])
        )
      )
    )
  ]);
}

function renderSizeStory(args: FormStoryArgs) {
  ensureFormDefined();

  return createFrame([
    createStack(
      (["small", "medium", "large"] as const).map((size) =>
        createSection(
          size === "medium" ? "default" : size,
          createForm({ ...args, size }, [createFormItem({ label: "Name", name: size, placeholder: size })])
        )
      )
    )
  ]);
}

function renderLabelWrapStory(args: FormStoryArgs) {
  ensureFormDefined();

  const form = createForm(args, [
    createFormItem({
      label: "아주 긴 라벨도 줄바꿈되며 control과 겹치지 않습니다",
      name: "long-label",
      placeholder: "label wrap"
    }),
    createActions()
  ]);

  form.classList.add("ds-form-story-long-label");

  return createFrame([form]);
}

function renderValidateTriggerStory(args: FormStoryArgs) {
  ensureFormDefined();

  return createFrame([
    createForm({ ...args, validateTrigger: "onChange" }, [
      createFormItem({ label: "Email", name: "email", placeholder: "입력하면 에러가 해제됩니다", required: true }),
      createActions()
    ])
  ]);
}

function renderInlineLoginStory(args: FormStoryArgs) {
  ensureFormDefined();

  return createFrame([
    createForm({ ...args, layout: "inline" }, [
      createFormItem({ label: "Username", name: "login-username", placeholder: "username", required: true }),
      createFormItem({ label: "Password", name: "login-password", placeholder: "password", required: true, type: "password" }),
      createActions()
    ])
  ]);
}

function renderRegistrationStory(args: FormStoryArgs) {
  ensureFormDefined();

  return createFrame([
    createForm({ ...args, requiredMark: "optional" }, [
      createFormItem({ label: "Username", name: "reg-username", required: true }),
      createFormItem({ label: "Password", name: "reg-password", required: true, type: "password" }),
      createFormItem({ label: "Role", name: "reg-role", type: "select" }),
      createFormItem({ label: "Intro", name: "reg-intro", type: "textarea" }),
      createActions()
    ])
  ]);
}

function setStringAttributes(element: HTMLElement, attributes: Record<string, string>) {
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
}

const meta: Meta<FormStoryArgs> = {
  title: "Components/Data Entry/Form",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "정보 입력, 값 수집, 검증 메시지, 레이아웃을 함께 관리하는 form Web Component입니다."
      }
    }
  },
  argTypes: {
    colon: { control: "boolean" },
    disabled: { control: "boolean" },
    labelAlign: {
      control: "inline-radio",
      options: ["left", "right"]
    },
    layout: {
      control: "inline-radio",
      options: ["horizontal", "vertical", "inline"]
    },
    requiredMark: {
      control: "inline-radio",
      options: ["true", "false", "optional"]
    },
    size: {
      control: "inline-radio",
      options: ["small", "medium", "large"]
    },
    validateTrigger: {
      control: "inline-radio",
      options: ["onSubmit", "onChange"]
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

type Story = StoryObj<FormStoryArgs>;

export const BasicUsage: Story = {
  parameters: createDocsDescription(storyDescriptions.basic)
};

export const FormMethods: Story = {
  render: renderMethodsStory,
  parameters: createDocsDescription(storyDescriptions.methods)
};

export const Layout: Story = {
  render: renderLayoutStory,
  parameters: createDocsDescription(storyDescriptions.layout)
};

export const MixLayout: Story = {
  render: renderMixLayoutStory,
  parameters: createDocsDescription(storyDescriptions.mixLayout)
};

export const FormDisabled: Story = {
  render: renderDisabledStory,
  parameters: createDocsDescription(storyDescriptions.disabled)
};

export const FormVariants: Story = {
  render: renderVariantsStory,
  parameters: createDocsDescription(storyDescriptions.variants)
};

export const RequiredStyle: Story = {
  render: renderRequiredMarkStory,
  parameters: createDocsDescription(storyDescriptions.requiredMark)
};

export const Size: Story = {
  render: renderSizeStory,
  parameters: createDocsDescription(storyDescriptions.size)
};

export const LabelCanWrap: Story = {
  render: renderLabelWrapStory,
  parameters: createDocsDescription(storyDescriptions.labelWrap)
};

export const ValidateTrigger: Story = {
  render: renderValidateTriggerStory,
  parameters: createDocsDescription(storyDescriptions.validateTrigger)
};

export const InlineLoginForm: Story = {
  render: renderInlineLoginStory,
  parameters: createDocsDescription(storyDescriptions.inlineLogin)
};

export const Registration: Story = {
  render: renderRegistrationStory,
  parameters: createDocsDescription(storyDescriptions.registration)
};
