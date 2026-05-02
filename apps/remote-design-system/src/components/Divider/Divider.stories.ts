import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Divider.stories.css";
import {
  defineDsDivider,
  type DividerOrientation,
  type DividerSize,
  type DividerTitlePlacement,
  type DividerVariant
} from ".";

type DividerStoryArgs = {
  color: string;
  colorToken: string;
  dashed: boolean;
  label: string;
  orientation: DividerOrientation;
  orientationMargin: string;
  plain: boolean;
  size: DividerSize;
  titlePlacement: DividerTitlePlacement;
  variant: DividerVariant;
};

const storyDescriptions = {
  default: "콘텐츠 사이의 시각적 구분을 위해 기본 horizontal Divider를 사용합니다.",
  text: "텍스트가 있는 Divider는 섹션 제목이나 맥락을 함께 표시할 수 있습니다.",
  placement: "title-placement 속성으로 텍스트 위치를 start, center, end로 조정합니다.",
  color: "color 또는 color-token 속성으로 Divider 선 색상을 조정합니다.",
  styles: "선 스타일, 크기, 텍스트 강조, 위치가 실제 Divider에 적용되는 모습을 한 화면에서 확인합니다.",
  variant: "variant 속성으로 solid, dashed, dotted 선 스타일을 선택합니다.",
  vertical: "vertical Divider는 인라인 콘텐츠나 액션 사이를 짧게 구분할 때 사용합니다.",
  plain: "plain 속성은 텍스트 강조를 줄여 본문 흐름 안에서 자연스럽게 보이도록 합니다.",
  size: "size 속성으로 Divider의 상하 여백을 조정합니다."
};

const defaultArgs = {
  color: "",
  colorToken: "",
  dashed: false,
  label: "",
  orientation: "horizontal",
  orientationMargin: "",
  plain: false,
  size: "medium",
  titlePlacement: "center",
  variant: "solid"
} satisfies DividerStoryArgs;

function ensureDividerDefined() {
  defineDsDivider();
}

function createDivider(args: DividerStoryArgs) {
  const divider = document.createElement("ds-divider");

  divider.setAttribute("orientation", args.orientation);
  divider.setAttribute("size", args.size);
  divider.setAttribute("title-placement", args.titlePlacement);
  divider.setAttribute("variant", args.variant);
  divider.toggleAttribute("dashed", args.dashed);
  divider.toggleAttribute("plain", args.plain);

  if (args.color) {
    divider.setAttribute("color", args.color);
  }

  if (args.colorToken) {
    divider.setAttribute("color-token", args.colorToken);
  }

  if (args.orientationMargin) {
    divider.setAttribute("orientation-margin", args.orientationMargin);
  }

  if (args.label) {
    divider.textContent = args.label;
  }

  return divider;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-divider-story-frame";
  frame.append(...children);

  return frame;
}

function createContentBlock(text: string) {
  const paragraph = document.createElement("p");

  paragraph.textContent = text;

  return paragraph;
}

function renderDefault(args: DividerStoryArgs) {
  ensureDividerDefined();

  return createFrame([
    createContentBlock("첫 번째 콘텐츠 영역입니다."),
    createDivider(args),
    createContentBlock("두 번째 콘텐츠 영역입니다.")
  ]);
}

function renderTextStory() {
  ensureDividerDefined();

  return createFrame([
    createContentBlock("섹션 전환 전 콘텐츠입니다."),
    createDivider({ ...defaultArgs, label: "Section" }),
    createContentBlock("섹션 전환 후 콘텐츠입니다.")
  ]);
}

function renderPlacementStory() {
  ensureDividerDefined();

  return createFrame(
    (["start", "center", "end"] as DividerTitlePlacement[]).map((titlePlacement) =>
      createDivider({
        ...defaultArgs,
        label: titlePlacement,
        titlePlacement
      })
    )
  );
}

function renderVariantStory() {
  ensureDividerDefined();

  return createFrame(
    (["solid", "dashed", "dotted"] as DividerVariant[]).map((variant) =>
      createDivider({
        ...defaultArgs,
        label: variant,
        variant
      })
    )
  );
}

function renderColorStory() {
  ensureDividerDefined();

  return createFrame([
    createDivider({
      ...defaultArgs,
      colorToken: "Blue/Solid/Blue6",
      label: "Blue/Solid/Blue6"
    }),
    createDivider({
      ...defaultArgs,
      colorToken: "Green/Solid/Green6",
      label: "Green/Solid/Green6",
      variant: "dashed"
    }),
    createDivider({
      ...defaultArgs,
      colorToken: "Red/Solid/Red6",
      label: "Red/Solid/Red6",
      titlePlacement: "start"
    }),
    createDivider({
      ...defaultArgs,
      color: "rebeccapurple",
      label: "CSS color",
      titlePlacement: "end",
      variant: "dotted"
    })
  ]);
}

function renderStylesStory() {
  ensureDividerDefined();

  return createFrame([
    createDivider({ ...defaultArgs, label: "Solid / Medium / Center", variant: "solid" }),
    createDivider({
      ...defaultArgs,
      label: "Dashed / Small / Start",
      size: "small",
      titlePlacement: "start",
      variant: "dashed"
    }),
    createDivider({
      ...defaultArgs,
      label: "Dotted / Large / End",
      size: "large",
      titlePlacement: "end",
      variant: "dotted"
    }),
    createDivider({
      ...defaultArgs,
      label: "Plain text",
      plain: true,
      variant: "solid"
    })
  ]);
}

function renderVerticalStory() {
  ensureDividerDefined();

  const row = document.createElement("div");

  row.className = "ds-divider-story-inline-row";
  row.append(
    document.createTextNode("Text"),
    createDivider({ ...defaultArgs, orientation: "vertical" }),
    document.createTextNode("Link"),
    createDivider({ ...defaultArgs, orientation: "vertical", variant: "dashed" }),
    document.createTextNode("Action")
  );

  return createFrame([row]);
}

function renderPlainStory() {
  ensureDividerDefined();

  return createFrame([
    createDivider({ ...defaultArgs, label: "Strong title" }),
    createDivider({ ...defaultArgs, label: "Plain title", plain: true })
  ]);
}

function renderSizeStory() {
  ensureDividerDefined();

  return createFrame(
    (["small", "medium", "large"] as DividerSize[]).map((size) =>
      createDivider({
        ...defaultArgs,
        label: size,
        size
      })
    )
  );
}

const meta: Meta<DividerStoryArgs> = {
  title: "Components/Layout/Divider",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Divider는 콘텐츠 사이의 구분선을 제공하는 레이아웃 컴포넌트입니다. horizontal, vertical 방향과 텍스트 배치, 선 스타일, 여백 크기를 지원합니다."
      }
    }
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"]
    },
    color: {
      control: "color"
    },
    colorToken: {
      control: "text"
    },
    size: {
      control: "inline-radio",
      options: ["small", "medium", "large"]
    },
    titlePlacement: {
      control: "inline-radio",
      options: ["start", "center", "end"]
    },
    variant: {
      control: "inline-radio",
      options: ["solid", "dashed", "dotted"]
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<DividerStoryArgs>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.default
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

export const Color: Story = {
  render: renderColorStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.color
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

export const Plain: Story = {
  render: renderPlainStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.plain
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
