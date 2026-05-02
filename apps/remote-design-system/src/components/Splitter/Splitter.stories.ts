import type { Meta, StoryObj } from "@storybook/web-components-vite";

import { defineDsSplitter, type SplitterOrientation } from ".";

type SplitterStoryArgs = {
  lazy: boolean;
  orientation: SplitterOrientation;
};

const storyDescriptions = {
  default: "가로 방향으로 인접한 패널을 나누고 dragger를 움직여 크기를 조절하는 기본 Splitter입니다.",
  vertical: "소비하는 wrapper가 제공한 높이 안에서 세로 방향 패널 크기를 조절하는 Splitter입니다.",
  constrained:
    "패널별 min, max, default-size를 지정한 예시입니다. dragger는 각 패널의 제한값 안에서만 이동합니다.",
  multiple: "세 개 이상의 패널을 나누는 예시입니다. 인접한 패널 사이마다 dragger가 생성됩니다.",
  lazy: "lazy 모드에서는 드래그 중 즉시 크기를 반영하지 않고 pointer를 놓을 때 최종 크기를 적용합니다.",
  nonResizable: "resizable=false 패널과 맞닿은 dragger는 비활성화되어 크기를 조절할 수 없습니다."
};

function ensureSplitterElementsDefined() {
  defineDsSplitter();
}

function createPanel(label: string, description: string, options: Record<string, string> = {}) {
  const panel = document.createElement("ds-splitter-panel");
  const body = document.createElement("section");
  const heading = document.createElement("h3");
  const paragraph = document.createElement("p");

  body.className = "ds-splitter-story-panel";
  heading.textContent = label;
  paragraph.textContent = description;
  body.append(heading, paragraph);
  panel.append(body);

  for (const [name, value] of Object.entries(options)) {
    panel.setAttribute(name, value);
  }

  return panel;
}

function createSplitterElement(args: SplitterStoryArgs, panels: HTMLElement[]) {
  const preview = document.createElement("div");
  const splitter = document.createElement("ds-splitter");

  preview.className = "ds-splitter-story-preview";
  splitter.setAttribute("orientation", args.orientation);
  splitter.setAttribute("lazy", String(args.lazy));
  splitter.append(...panels);
  preview.append(splitter);

  return preview;
}

function renderDefault(args: SplitterStoryArgs) {
  ensureSplitterElementsDefined();

  return createSplitterElement(args, [
    createPanel("First", "Primary work area", { "default-size": "35%", min: "180" }),
    createPanel("Second", "Secondary detail area", { min: "180" })
  ]);
}

function renderVertical(args: SplitterStoryArgs) {
  ensureSplitterElementsDefined();

  return createSplitterElement(
    {
      ...args,
      orientation: "vertical"
    },
    [
      createPanel("Top", "Summary and filters", { "default-size": "42%", min: "120" }),
      createPanel("Bottom", "Result table and logs", { min: "160" })
    ]
  );
}

function renderConstrained(args: SplitterStoryArgs) {
  ensureSplitterElementsDefined();

  return createSplitterElement(args, [
    createPanel("Navigation", "Fixed range side panel", {
      "default-size": "240",
      max: "360",
      min: "180"
    }),
    createPanel("Content", "Main panel with remaining space", {
      min: "280"
    })
  ]);
}

function renderMultiple(args: SplitterStoryArgs) {
  ensureSplitterElementsDefined();

  return createSplitterElement(args, [
    createPanel("Panel 1", "Left panel", { "default-size": "25%", min: "160" }),
    createPanel("Panel 2", "Center panel", { "default-size": "45%", min: "220" }),
    createPanel("Panel 3", "Right panel", { min: "160" })
  ]);
}

function renderNonResizable(args: SplitterStoryArgs) {
  ensureSplitterElementsDefined();

  return createSplitterElement(args, [
    createPanel("Locked", "This panel disables resizing.", {
      "default-size": "260",
      resizable: "false"
    }),
    createPanel("Flexible", "The adjacent dragger is disabled because one side is locked.")
  ]);
}

const meta: Meta<SplitterStoryArgs> = {
  title: "Components/Layout/Splitter",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Splitter는 하나의 영역을 크기 조절 가능한 패널로 나누는 Web Component입니다. 사용 가능한 width와 height는 이 컴포넌트를 소비하는 wrapper가 결정합니다."
      }
    }
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"]
    }
  },
  args: {
    lazy: false,
    orientation: "horizontal"
  },
  render: renderDefault
};

export default meta;

type Story = StoryObj<SplitterStoryArgs>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.default
      }
    }
  }
};

export const Vertical: Story = {
  render: renderVertical,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.vertical
      }
    }
  }
};

export const Constrained: Story = {
  render: renderConstrained,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.constrained
      }
    }
  }
};

export const MultiplePanels: Story = {
  render: renderMultiple,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.multiple
      }
    }
  }
};

export const Lazy: Story = {
  args: {
    lazy: true
  },
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.lazy
      }
    }
  }
};

export const NonResizable: Story = {
  render: renderNonResizable,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.nonResizable
      }
    }
  }
};
