import { BadgeCheck, Lock, Mail, Search, User, createElement as createLucideElement } from "lucide";
import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Input.stories.css";
import {
  defineDsInput,
  type InputMode,
  type InputSize,
  type InputStatus,
  type InputVariant
} from ".";

type InputStoryArgs = {
  allowClear: boolean;
  disabled: boolean;
  enterButton: boolean;
  loading: boolean;
  maxLength?: number;
  mode: InputMode;
  placeholder: string;
  readonly: boolean;
  searchButtonIcon: boolean;
  searchOnEnter: boolean;
  showCount: boolean;
  size: InputSize;
  status?: InputStatus;
  value: string;
  variant: InputVariant;
};

const defaultArgs = {
  allowClear: false,
  disabled: false,
  enterButton: false,
  loading: false,
  maxLength: undefined,
  mode: "input",
  placeholder: "내용을 입력하세요",
  readonly: false,
  searchButtonIcon: true,
  searchOnEnter: true,
  showCount: false,
  size: "medium",
  status: undefined,
  value: "",
  variant: "outlined"
} satisfies InputStoryArgs;

const storyDescriptions = {
  basic: "가장 기본적인 텍스트 입력 필드입니다. value, placeholder, disabled, readonly 같은 기본 속성을 확인합니다.",
  sizes: "small, medium, large 세 가지 크기를 같은 폭에서 비교합니다.",
  variants: "outlined, filled, borderless, underlined 네 가지 입력 스타일을 제공합니다.",
  prefixSuffix: "prefix와 suffix 슬롯에 실제 아이콘을 넣어 입력 필드 내부 보조 정보를 표현합니다.",
  clearCount: "allow-clear와 show-count를 함께 사용해 입력값 삭제와 문자 수 표시를 확인합니다.",
  status: "error와 warning 상태에서 border, focus, count 색상이 함께 바뀌는지 확인합니다.",
  textarea: "mode=\"textarea\"는 여러 줄 입력을 위해 textarea 요소로 렌더링합니다.",
  search: "mode=\"search\"는 Enter 또는 검색 버튼으로 ds-input-search 이벤트를 발생시키는 검색 입력입니다.",
  password: "mode=\"password\"는 보기 전환 버튼과 보안 입력 타입을 제공합니다."
};

function ensureInputDefined() {
  defineDsInput();
}

function createInput(args: InputStoryArgs) {
  const element = document.createElement("ds-input");

  element.setAttribute("mode", args.mode);
  element.setAttribute("placeholder", args.placeholder);
  element.setAttribute("size", args.size);
  element.setAttribute("variant", args.variant);
  element.toggleAttribute("allow-clear", args.allowClear);
  element.toggleAttribute("disabled", args.disabled);
  element.toggleAttribute("enter-button", args.enterButton);
  element.toggleAttribute("loading", args.loading);
  element.toggleAttribute("readonly", args.readonly);
  element.setAttribute("search-button-icon", String(args.searchButtonIcon));
  element.setAttribute("search-on-enter", String(args.searchOnEnter));
  element.toggleAttribute("show-count", args.showCount);

  if (args.value) {
    element.setAttribute("value", args.value);
  }

  if (args.maxLength) {
    element.setAttribute("maxlength", String(args.maxLength));
  }

  if (args.status) {
    element.setAttribute("status", args.status);
  }

  return element;
}

function createIcon(name: "badge" | "lock" | "mail" | "search" | "user", slot: "prefix" | "suffix") {
  const wrapper = document.createElement("span");
  const iconMap = {
    badge: BadgeCheck,
    lock: Lock,
    mail: Mail,
    search: Search,
    user: User
  };

  wrapper.className = "ds-input-story-icon";
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

  frame.className = "ds-input-story-frame";
  frame.append(...children);

  return frame;
}

function createStack(children: HTMLElement[]) {
  const stack = document.createElement("div");

  stack.className = "ds-input-story-stack";
  stack.append(...children);

  return stack;
}

function createSection(title: string, children: HTMLElement[]) {
  const section = document.createElement("section");
  const heading = document.createElement("h3");

  section.className = "ds-input-story-section";
  heading.className = "ds-input-story-section__title";
  heading.textContent = title;
  section.append(heading, ...children);

  return section;
}

function renderDefault(args: InputStoryArgs) {
  ensureInputDefined();

  return createFrame([createInput(args)]);
}

function renderSizesStory() {
  ensureInputDefined();

  return createFrame([
    createStack([
      createInput({ ...defaultArgs, placeholder: "Small", size: "small" }),
      createInput({ ...defaultArgs, placeholder: "Medium", size: "medium" }),
      createInput({ ...defaultArgs, placeholder: "Large", size: "large" })
    ])
  ]);
}

function renderVariantsStory() {
  ensureInputDefined();

  return createFrame([
    createStack([
      createInput({ ...defaultArgs, placeholder: "Outlined", variant: "outlined" }),
      createInput({ ...defaultArgs, placeholder: "Filled", variant: "filled" }),
      createInput({ ...defaultArgs, placeholder: "Borderless", variant: "borderless" }),
      createInput({ ...defaultArgs, placeholder: "Underlined", variant: "underlined" })
    ])
  ]);
}

function renderPrefixSuffixStory() {
  ensureInputDefined();

  const userInput = createInput({ ...defaultArgs, placeholder: "사용자 이름" });
  const mailInput = createInput({ ...defaultArgs, placeholder: "이메일", value: "design@example.com" });

  userInput.append(createIcon("user", "prefix"));
  mailInput.append(createIcon("mail", "prefix"), createIcon("badge", "suffix"));

  return createFrame([createStack([userInput, mailInput])]);
}

function renderClearCountStory() {
  ensureInputDefined();

  return createFrame([
    createStack([
      createInput({
        ...defaultArgs,
        allowClear: true,
        maxLength: 40,
        placeholder: "삭제 버튼과 글자 수 표시",
        showCount: true,
        value: "입력 필드 패턴"
      }),
      createInput({
        ...defaultArgs,
        allowClear: true,
        mode: "textarea",
        maxLength: 120,
        placeholder: "여러 줄 입력",
        showCount: true,
        value: "긴 설명을 작성하는 영역입니다."
      })
    ])
  ]);
}

function renderStatusStory(args: InputStoryArgs) {
  ensureInputDefined();

  return createFrame([
    createStack([
      createInput({
        ...defaultArgs,
        ...args,
        maxLength: args.maxLength ?? 20,
        placeholder: args.placeholder || "Error",
        showCount: true,
        status: args.status ?? "error",
        value: args.value || "필수 값이 비어있음"
      })
    ])
  ]);
}

function renderTextAreaStory() {
  ensureInputDefined();

  return createFrame([
    createInput({
      ...defaultArgs,
      mode: "textarea",
      placeholder: "메모를 입력하세요",
      value: "여러 줄 텍스트를 입력할 수 있습니다.",
      variant: "outlined"
    })
  ]);
}

function renderSearchStory() {
  ensureInputDefined();

  const inlineSearch = createInput({
    ...defaultArgs,
    allowClear: true,
    mode: "search",
    placeholder: "아이콘 검색",
    value: "Input"
  });
  const prefixSearch = createInput({
    ...defaultArgs,
    allowClear: true,
    mode: "search",
    placeholder: "좌측 아이콘 검색",
    value: "Design System"
  });
  const textButtonSearch = createInput({
    ...defaultArgs,
    enterButton: true,
    mode: "search",
    placeholder: "버튼 텍스트 검색",
    searchButtonIcon: false,
    value: "Text only"
  });
  const buttonSearch = createInput({
    ...defaultArgs,
    enterButton: true,
    mode: "search",
    placeholder: "버튼 검색",
    value: "Storybook"
  });
  const enterTriggerSearch = createInput({
    ...defaultArgs,
    enterButton: true,
    mode: "search",
    placeholder: "Enter로 검색",
    searchOnEnter: true,
    value: "Keyboard query"
  });
  const loadingSearch = createInput({
    ...defaultArgs,
    enterButton: true,
    mode: "search",
    placeholder: "로딩 검색",
    value: "Loading query"
  });

  loadingSearch.addEventListener("ds-input-search", () => {
    loadingSearch.setAttribute("loading", "");
    window.setTimeout(() => {
      loadingSearch.removeAttribute("loading");
    }, 1200);
  });
  const enterTriggerOutput = document.createElement("output");

  enterTriggerOutput.className = "ds-input-story-output";
  enterTriggerOutput.textContent = "Enter 또는 Search 버튼으로 검색을 실행합니다.";
  enterTriggerSearch.addEventListener("ds-input-search", (event) => {
    const searchEvent = event as CustomEvent<{ source: string; value: string }>;

    enterTriggerOutput.textContent = `검색 실행: ${searchEvent.detail.value}`;
  });
  prefixSearch.append(createIcon("user", "prefix"));

  return createFrame([
    createSection("아이콘 검색", [inlineSearch, prefixSearch, textButtonSearch]),
    createSection("검색 버튼 표시", [buttonSearch]),
    createSection("Enter 키 트리거", [enterTriggerSearch, enterTriggerOutput]),
    createSection("Loading", [loadingSearch])
  ]);
}

function renderPasswordStory() {
  ensureInputDefined();

  const passwordInput = createInput({
    ...defaultArgs,
    allowClear: true,
    mode: "password",
    placeholder: "비밀번호",
    value: "password"
  });

  passwordInput.append(createIcon("lock", "prefix"));

  return createFrame([passwordInput]);
}

const meta: Meta<InputStoryArgs> = {
  title: "Components/Data Entry/Input",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Input은 마우스나 키보드로 값을 입력받는 기본 폼 필드입니다. 기본 입력, 여러 줄 입력, 검색, 비밀번호 입력 패턴을 하나의 Web Component API로 제공합니다."
      }
    }
  },
  argTypes: {
    allowClear: {
      control: "boolean"
    },
    disabled: {
      control: "boolean"
    },
    enterButton: {
      control: "boolean"
    },
    loading: {
      control: "boolean"
    },
    maxLength: {
      control: "number"
    },
    mode: {
      control: "inline-radio",
      options: ["input", "textarea", "search", "password"]
    },
    placeholder: {
      control: "text"
    },
    readonly: {
      control: "boolean"
    },
    searchButtonIcon: {
      control: "boolean"
    },
    searchOnEnter: {
      control: "boolean"
    },
    showCount: {
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
    value: {
      control: "text"
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

type Story = StoryObj<InputStoryArgs>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.basic
      }
    }
  }
};

export const Sizes: Story = {
  render: renderSizesStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.sizes
      }
    }
  }
};

export const Variants: Story = {
  render: renderVariantsStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.variants
      }
    }
  }
};

export const PrefixAndSuffix: Story = {
  render: renderPrefixSuffixStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.prefixSuffix
      }
    }
  }
};

export const AllowClearAndShowCount: Story = {
  render: renderClearCountStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.clearCount
      }
    }
  }
};

export const Status: Story = {
  render: renderStatusStory,
  args: {
    ...defaultArgs,
    maxLength: 20,
    placeholder: "Error",
    showCount: true,
    status: "error",
    value: "필수 값이 비어있음"
  },
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.status
      }
    }
  }
};

export const TextArea: Story = {
  render: renderTextAreaStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.textarea
      }
    }
  }
};

export const SearchBox: Story = {
  render: renderSearchStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.search
      }
    }
  }
};

export const Password: Story = {
  render: renderPasswordStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.password
      }
    }
  }
};
