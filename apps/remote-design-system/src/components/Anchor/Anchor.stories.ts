import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Anchor.stories.css";
import { defineDsAnchor, type AnchorDirection } from ".";

type AnchorStoryArgs = {
  direction: AnchorDirection;
  replace: boolean;
  targetOffset: number;
};

const sections = [
  {
    description: "긴 페이지의 섹션을 빠르게 훑고 이동할 수 있도록 돕습니다.",
    id: "anchor-overview",
    title: "Overview"
  },
  {
    description: "각 링크는 의미 있는 앵커로 동작하며 호스트 앱에 변경/클릭 이벤트를 전달합니다.",
    id: "anchor-usage",
    title: "Usage"
  },
  {
    description: "wrapper가 사용 가능한 너비와 높이를 제어하고 컴포넌트는 그 안에서 자연스럽게 배치됩니다.",
    id: "anchor-container",
    title: "Container"
  },
  {
    description: "중첩 링크를 사용하면 가까운 섹션을 계층적으로 묶어 보여줄 수 있습니다.",
    id: "anchor-nested",
    title: "Nested"
  }
];

const storyDescriptions = {
  default:
    "세로 방향 Anchor의 기본 사용 예시입니다. 소비하는 wrapper가 크기와 스크롤 영역을 제공하고, Anchor는 해당 영역 안의 섹션 위치를 기준으로 active 상태를 갱신합니다.",
  horizontal:
    "가로 방향 Anchor 예시입니다. 좁은 상단 내비게이션 영역에서도 섹션 이동과 active 상태 계산이 동일하게 동작하는지 확인합니다.",
  nested:
    "상위 링크 아래에 하위 Anchor link를 배치하는 예시입니다. 중첩된 링크도 같은 스크롤 컨테이너 안의 target을 기준으로 이동하고 active 상태를 동기화합니다.",
  replaceHistory:
    "replace 속성을 사용하는 예시입니다. Anchor 클릭 시 브라우저 history를 새 항목으로 추가하지 않고 현재 hash를 교체합니다."
};

function ensureAnchorElementsDefined() {
  defineDsAnchor();
}

function createAnchorLink({ href, title }: { href: string; title: string }) {
  const link = document.createElement("ds-anchor-link");

  link.setAttribute("href", href);
  link.setAttribute("title", title);

  return link;
}

function createAnchor(args: AnchorStoryArgs, nested = false) {
  const anchor = document.createElement("ds-anchor");

  anchor.setAttribute("direction", args.direction);
  anchor.setAttribute("target-offset", String(args.targetOffset));
  anchor.toggleAttribute("replace", args.replace);

  if (nested) {
    const overview = createAnchorLink({ href: "#anchor-overview", title: "Overview" });
    const usage = createAnchorLink({ href: "#anchor-usage", title: "Usage" });

    usage.append(
      createAnchorLink({ href: "#anchor-container", title: "Container" }),
      createAnchorLink({ href: "#anchor-nested", title: "Nested" })
    );
    anchor.append(overview, usage);

    return anchor;
  }

  anchor.append(
    ...sections.map((section) =>
      createAnchorLink({
        href: `#${section.id}`,
        title: section.title
      })
    )
  );

  return anchor;
}

function createContent() {
  const content = document.createElement("main");

  content.className = "ds-anchor-story-content";

  for (const section of sections) {
    const sectionElement = document.createElement("section");
    const heading = document.createElement("h3");
    const paragraph = document.createElement("p");

    sectionElement.id = section.id;
    heading.textContent = section.title;
    paragraph.textContent = section.description;
    sectionElement.append(heading, paragraph);
    content.append(sectionElement);
  }

  return content;
}

function createStoryFrame(args: AnchorStoryArgs, nested = false) {
  ensureAnchorElementsDefined();

  const frame = document.createElement("div");
  const nav = document.createElement("aside");

  frame.className =
    args.direction === "horizontal" ? "ds-anchor-story-frame ds-anchor-story-frame--horizontal" : "ds-anchor-story-frame";
  nav.className = "ds-anchor-story-nav";
  nav.append(createAnchor(args, nested));
  frame.append(nav, createContent());

  return frame;
}

function renderDefault(args: AnchorStoryArgs) {
  return createStoryFrame(args);
}

function renderHorizontal(args: AnchorStoryArgs) {
  return createStoryFrame(
    {
      ...args,
      direction: "horizontal"
    },
    false
  );
}

function renderNested(args: AnchorStoryArgs) {
  return createStoryFrame(args, true);
}

const meta: Meta<AnchorStoryArgs> = {
  title: "Components/Navigation/Anchor",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "긴 콘텐츠 안의 섹션을 탐색하기 위한 Anchor Web Component입니다. 컴포넌트를 소비하는 wrapper가 크기와 스크롤 영역을 결정하고, Anchor는 해당 영역 안에서 target 위치와 visible 영역을 기준으로 active 상태를 계산합니다."
      }
    }
  },
  argTypes: {
    direction: {
      control: "inline-radio",
      options: ["vertical", "horizontal"]
    },
    targetOffset: {
      control: {
        min: 0,
        step: 8,
        type: "number"
      }
    }
  },
  args: {
    direction: "vertical",
    replace: false,
    targetOffset: 0
  },
  render: renderDefault
};

export default meta;

type Story = StoryObj<AnchorStoryArgs>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.default
      }
    }
  }
};

export const Horizontal: Story = {
  render: renderHorizontal,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.horizontal
      }
    }
  }
};

export const Nested: Story = {
  render: renderNested,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.nested
      }
    }
  }
};

export const ReplaceHistory: Story = {
  args: {
    replace: true
  },
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.replaceHistory
      }
    }
  }
};
