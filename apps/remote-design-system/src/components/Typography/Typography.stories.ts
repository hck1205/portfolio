import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Typography.stories.css";
import {
  defineDsTypography,
  type TypographyTitleLevel,
  type TypographyType,
  type TypographyVariant
} from ".";

type TypographyStoryArgs = {
  as: string;
  code: boolean;
  color: string;
  colorToken: string;
  copyable: boolean;
  delete: boolean;
  disabled: boolean;
  display: string;
  editable: boolean;
  ellipsis: boolean;
  href: string;
  italic: boolean;
  keyboard: boolean;
  label: string;
  level: TypographyTitleLevel;
  mark: boolean;
  rows: number;
  strong: boolean;
  textAlign: string;
  textDecoration: string;
  textOverflow: "truncate" | "break" | "none";
  typoName: string;
  type: TypographyType;
  underline: boolean;
  variant: TypographyVariant;
};

const storyDescriptions = {
  default: "기본 Typography는 짧은 텍스트, 문단, 제목을 DS 토큰 기반의 일관된 서체로 표시합니다.",
  typoName: "typo-name 속성으로 spec의 Normal/UI 토큰 이름을 지정해 크기, 굵기, 줄 높이를 일관되게 적용합니다.",
  title: "level 속성으로 h1부터 h5까지 의미 있는 제목 계층을 렌더링합니다.",
  text: "type 속성으로 secondary, success, warning, danger 상태 텍스트를 표현합니다.",
  styles: "strong, italic, underline, delete, mark, code, keyboard 속성으로 텍스트 표현을 조합합니다.",
  tokenScale: "Typography spec의 text token을 한 화면에서 비교할 수 있도록 크기 순서와 실제 렌더링을 함께 보여줍니다.",
  link: "href가 제공되면 텍스트를 native anchor로 렌더링합니다.",
  copyable: "copyable 속성으로 텍스트 복사 액션을 제공합니다.",
  editable: "editable 속성으로 텍스트를 textarea에서 수정할 수 있습니다.",
  ellipsis: "ellipsis와 rows 속성으로 여러 줄 텍스트를 지정한 줄 수에서 말줄임 처리합니다."
};

const longText =
  "Typography는 제목, 본문, 보조 텍스트처럼 문서형 UI에서 반복되는 텍스트 패턴을 일관된 계층과 상태로 표현합니다.";

const defaultArgs = {
  as: "",
  code: false,
  color: "",
  colorToken: "",
  copyable: false,
  delete: false,
  disabled: false,
  display: "",
  editable: false,
  ellipsis: false,
  href: "",
  italic: false,
  keyboard: false,
  label: "Typography text",
  level: 1,
  mark: false,
  rows: 1,
  strong: false,
  textAlign: "",
  textDecoration: "",
  textOverflow: "none",
  typoName: "Normal/Body/3/Normal",
  type: "default",
  underline: false,
  variant: "text"
} satisfies TypographyStoryArgs;

function ensureTypographyDefined() {
  defineDsTypography();
}

function createTypography(args: TypographyStoryArgs) {
  const typography = document.createElement("ds-typography");

  typography.textContent = args.label;
  typography.setAttribute("variant", args.variant);
  typography.setAttribute("type", args.type);
  typography.setAttribute("level", String(args.level));
  typography.setAttribute("rows", String(args.rows));
  typography.setAttribute("text-overflow", args.textOverflow);
  typography.setAttribute("typo-name", args.typoName);
  typography.toggleAttribute("code", args.code);
  typography.toggleAttribute("copyable", args.copyable);
  typography.toggleAttribute("delete", args.delete);
  typography.toggleAttribute("disabled", args.disabled);
  typography.toggleAttribute("editable", args.editable);
  typography.toggleAttribute("ellipsis", args.ellipsis);
  typography.toggleAttribute("italic", args.italic);
  typography.toggleAttribute("keyboard", args.keyboard);
  typography.toggleAttribute("mark", args.mark);
  typography.toggleAttribute("strong", args.strong);
  typography.toggleAttribute("underline", args.underline);

  if (args.href) {
    typography.setAttribute("href", args.href);
    typography.setAttribute("target", "_blank");
  }

  if (args.as) {
    typography.setAttribute("as", args.as);
  }

  if (args.color) {
    typography.setAttribute("color", args.color);
  }

  if (args.colorToken) {
    typography.setAttribute("color-token", args.colorToken);
  }

  if (args.display) {
    typography.setAttribute("display", args.display);
  }

  if (args.textAlign) {
    typography.setAttribute("text-align", args.textAlign);
  }

  if (args.textDecoration) {
    typography.setAttribute("text-decoration", args.textDecoration);
  }

  return typography;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-typography-story-frame";
  frame.append(...children);

  return frame;
}

function renderDefault(args: TypographyStoryArgs) {
  ensureTypographyDefined();

  return createFrame([createTypography(args)]);
}

function renderTitleStory() {
  ensureTypographyDefined();

  return createFrame(
    ([1, 2, 3, 4, 5] as TypographyTitleLevel[]).map((level) =>
      createTypography({
        ...defaultArgs,
        label: `h${level}. Design System Typography`,
        level,
        typoName: `Normal/Title/${level}/Bold`,
        variant: "title"
      })
    )
  );
}

function renderTypoNameStory() {
  ensureTypographyDefined();

  return createFrame([
    createTypography({
      ...defaultArgs,
      label: "Normal/Title/3/Bold",
      typoName: "Normal/Title/3/Bold"
    }),
    createTypography({
      ...defaultArgs,
      label: "Normal/Body/3/Normal - 긴 본문과 설명문에 사용하는 읽기용 토큰입니다.",
      typoName: "Normal/Body/3/Normal",
      variant: "paragraph"
    }),
    createTypography({
      ...defaultArgs,
      label: "UI/Button/3/Normal",
      typoName: "UI/Button/3/Normal"
    }),
    createTypography({
      ...defaultArgs,
      colorToken: "Grayscale/Solid/G7",
      label: "color-token으로 foundation 색상 토큰을 지정한 보조 텍스트입니다.",
      typoName: "Normal/Label/3/Normal"
    })
  ]);
}

const tokenScaleGroups = [
  {
    tokens: [
      "UI/Display/1/Bold",
      "UI/Display/2/Bold",
      "UI/Display/3/Bold",
      "UI/Display/4/Bold",
      "UI/Display/5/Bold"
    ],
    title: "Display"
  },
  {
    tokens: ["Normal/LargeTitle/Bold"],
    title: "LargeTitle"
  },
  {
    tokens: [
      "Normal/Headline/1/Bold",
      "Normal/Headline/2/Bold",
      "Normal/Headline/3/Bold",
      "Normal/Headline/4/Bold"
    ],
    title: "Headline"
  },
  {
    tokens: [
      "Normal/Title/1/Bold",
      "Normal/Title/2/Bold",
      "Normal/Title/3/Bold",
      "Normal/Title/4/Bold",
      "Normal/Title/5/Bold"
    ],
    title: "Title"
  },
  {
    tokens: [
      "Normal/Subtitle/1/Medium",
      "Normal/Subtitle/2/Medium",
      "Normal/Subtitle/3/Medium",
      "Normal/Subtitle/4/Medium",
      "Normal/Subtitle/5/Medium",
      "Normal/Subtitle/6/Medium"
    ],
    title: "Subtitle"
  },
  {
    tokens: [
      "Normal/Body/1/Normal",
      "Normal/Body/2/Normal",
      "Normal/Body/3/Normal",
      "Normal/Body/4/Normal",
      "Normal/Body/5/Normal"
    ],
    title: "Body"
  },
  {
    tokens: ["Normal/Label/1/Normal", "Normal/Label/2/Normal", "Normal/Label/3/Normal", "Normal/Label/4/Normal"],
    title: "Label"
  },
  {
    tokens: [
      "Normal/Callout/1/Normal",
      "Normal/Callout/2/Normal",
      "Normal/Callout/3/Normal",
      "Normal/Callout/4/Normal",
      "Normal/Callout/5/Normal",
      "Normal/Callout/6/Normal",
      "Normal/Callout/7/Normal"
    ],
    title: "Callout"
  },
  {
    tokens: ["Normal/Footnote/1/Normal", "Normal/Footnote/2/Normal"],
    title: "Footnote"
  },
  {
    tokens: ["UI/Button/1/Normal", "UI/Button/2/Normal", "UI/Button/3/Normal", "UI/Button/4/Normal"],
    title: "Button"
  }
] as const;

function renderTokenScaleStory() {
  ensureTypographyDefined();

  const catalog = document.createElement("div");

  catalog.className = "ds-typography-token-scale";
  tokenScaleGroups.forEach((group) => {
    const section = document.createElement("section");
    const title = document.createElement("h3");
    const list = document.createElement("div");

    title.textContent = group.title;
    list.className = "ds-typography-token-scale__list";
    group.tokens.forEach((token) => {
      const row = document.createElement("div");
      const name = document.createElement("code");
      const preview = createTypography({
        ...defaultArgs,
        label: "The quick brown fox jumps over the lazy dog",
        textOverflow: "truncate",
        typoName: token
      });

      row.className = "ds-typography-token-scale__row";
      name.textContent = token;
      row.append(name, preview);
      list.append(row);
    });

    section.append(title, list);
    catalog.append(section);
  });

  return catalog;
}

function renderTextStory() {
  ensureTypographyDefined();

  return createFrame(
    (["default", "secondary", "success", "warning", "danger"] as TypographyType[]).map((type) =>
      createTypography({
        ...defaultArgs,
        label: `Typography ${type}`,
        type
      })
    )
  );
}

function renderStylesStory() {
  ensureTypographyDefined();

  return createFrame([
    createTypography({ ...defaultArgs, label: "Strong text", strong: true }),
    createTypography({ ...defaultArgs, italic: true, label: "Italic text" }),
    createTypography({ ...defaultArgs, label: "Underlined text", underline: true }),
    createTypography({ ...defaultArgs, delete: true, label: "Deleted text" }),
    createTypography({ ...defaultArgs, label: "Marked text", mark: true }),
    createTypography({ ...defaultArgs, code: true, label: "const value = typography;" }),
    createTypography({ ...defaultArgs, keyboard: true, label: "Ctrl + Enter" })
  ]);
}

function renderLinkStory() {
  ensureTypographyDefined();

  return createFrame([
    createTypography({
      ...defaultArgs,
      href: "https://github.com/hck1205/portfolio",
      label: "Portfolio Typography"
    })
  ]);
}

function renderCopyableStory() {
  ensureTypographyDefined();

  return createFrame([
    createTypography({
      ...defaultArgs,
      copyable: true,
      label: "복사 가능한 Typography 텍스트입니다."
    })
  ]);
}

function renderEditableStory() {
  ensureTypographyDefined();

  return createFrame([
    createTypography({
      ...defaultArgs,
      editable: true,
      label: "수정 가능한 Typography 텍스트입니다."
    })
  ]);
}

function renderEllipsisStory() {
  ensureTypographyDefined();

  return createFrame([
    createTypography({
      ...defaultArgs,
      ellipsis: true,
      label: `${longText} ${longText}`,
      rows: 2,
      variant: "paragraph"
    })
  ]);
}

const meta: Meta<TypographyStoryArgs> = {
  title: "Components/General/Typography",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Typography는 제목, 본문, 보조 텍스트를 의미 있는 HTML과 DS foundation token으로 표현하는 컴포넌트입니다. 프로젝트 typography spec의 주요 개념을 Web Component API에 맞춰 제공합니다."
      }
    }
  },
  argTypes: {
    level: {
      control: "inline-radio",
      options: [1, 2, 3, 4, 5]
    },
    textOverflow: {
      control: "inline-radio",
      options: ["none", "truncate", "break"]
    },
    type: {
      control: "inline-radio",
      options: ["default", "secondary", "success", "warning", "danger"]
    },
    variant: {
      control: "inline-radio",
      options: ["text", "title", "paragraph"]
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<TypographyStoryArgs>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.default
      }
    }
  }
};

export const Title: Story = {
  render: renderTitleStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.title
      }
    }
  }
};

export const TypoName: Story = {
  render: renderTypoNameStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.typoName
      }
    }
  }
};

export const Text: Story = {
  render: renderTextStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.text
      }
    }
  }
};

export const Styles: Story = {
  render: renderStylesStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.styles
      }
    }
  }
};

export const TokenScale: Story = {
  render: renderTokenScaleStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.tokenScale
      }
    }
  }
};

export const Link: Story = {
  render: renderLinkStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.link
      }
    }
  }
};

export const Copyable: Story = {
  render: renderCopyableStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.copyable
      }
    }
  }
};

export const Editable: Story = {
  render: renderEditableStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.editable
      }
    }
  }
};

export const Ellipsis: Story = {
  render: renderEllipsisStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.ellipsis
      }
    }
  }
};
