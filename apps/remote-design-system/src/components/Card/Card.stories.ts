import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Card.stories.css";
import { defineDsCard, type CardSize, type CardVariant } from ".";

type CardStoryArgs = {
  coverSrc: string;
  extra: string;
  hoverable: boolean;
  loading: boolean;
  size: CardSize;
  title: string;
  type: string;
  variant: CardVariant;
};

const defaultArgs = {
  coverSrc: "",
  extra: "More",
  hoverable: false,
  loading: false,
  size: "medium",
  title: "Card title",
  type: "",
  variant: "outlined"
} satisfies CardStoryArgs;

const storyDescriptions = {
  basic: "Card는 단일 주제와 관련된 정보를 담는 컨테이너입니다.",
  cover: "cover와 Card.Meta를 조합해 이미지 중심 콘텐츠를 구성합니다.",
  grid: "Card.Grid는 카드 내부 정보를 격자로 배치합니다.",
  inner: "inner card는 다단계 정보 구조 안에 배치하기 좋습니다.",
  loading: "loading 상태에서는 body 대신 skeleton을 표시합니다.",
  variant: "outlined와 borderless variant를 제공합니다."
};

function ensureCardDefined() {
  defineDsCard();
}

function createCard(args: Partial<CardStoryArgs> = {}, content = "Card content") {
  const mergedArgs = { ...defaultArgs, ...args };
  const card = document.createElement("ds-card");
  const body = document.createElement("p");

  card.setAttribute("hoverable", String(mergedArgs.hoverable));
  card.setAttribute("loading", String(mergedArgs.loading));
  card.setAttribute("size", mergedArgs.size);
  card.setAttribute("variant", mergedArgs.variant);
  syncOptionalAttribute(card, "cover-src", mergedArgs.coverSrc);
  syncOptionalAttribute(card, "extra", mergedArgs.extra);
  syncOptionalAttribute(card, "title", mergedArgs.title);
  syncOptionalAttribute(card, "type", mergedArgs.type);
  body.className = "ds-card-story-text";
  body.textContent = content;
  card.append(body);

  return card;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-card-story-frame";
  frame.append(...children);

  return frame;
}

function createRow(children: HTMLElement[]) {
  const row = document.createElement("div");

  row.className = "ds-card-story-row";
  row.append(...children);

  return row;
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

function renderDefault(args: CardStoryArgs) {
  ensureCardDefined();

  return createFrame([createCard(args)]);
}

function renderVariantStory() {
  ensureCardDefined();

  return createFrame([
    createRow([
      createCard({ variant: "outlined" }, "Outlined card content"),
      createCard({ variant: "borderless" }, "Borderless card content")
    ])
  ]);
}

function renderCoverStory() {
  ensureCardDefined();

  const card = createCard(
    {
      coverSrc: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
      hoverable: true,
      title: ""
    },
    ""
  );
  const meta = document.createElement("ds-card-meta");

  meta.setAttribute("title", "Europe Street beat");
  meta.setAttribute("description", "www.instagram.com");
  card.replaceChildren(meta);

  return createFrame([card]);
}

function renderGridStory() {
  ensureCardDefined();

  const card = createCard({ title: "Grid card" }, "");

  card.replaceChildren(...["Content", "Content", "Content", "Content", "Content", "Content"].map((text) => {
    const grid = document.createElement("ds-card-grid");

    grid.textContent = text;

    return grid;
  }));

  return createFrame([card]);
}

function renderInnerStory() {
  ensureCardDefined();

  const outer = createCard({ title: "Outer card" }, "");
  const inner = createCard({ title: "Inner card", type: "inner" }, "Inner Card content");

  outer.append(inner);

  return createFrame([outer]);
}

function renderLoadingStory() {
  ensureCardDefined();

  return createFrame([createCard({ loading: true })]);
}

function syncOptionalAttribute(element: HTMLElement, name: string, value: string) {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
}

const meta: Meta<CardStoryArgs> = {
  title: "Components/Data Display/Card",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Card는 단일 주제의 정보를 title, extra, cover, body, actions, grid, meta 구조로 담는 Data Display 컨테이너입니다. Ant Design의 variant, hoverable, loading, inner card, Card.Grid, Card.Meta 패턴을 Web Component API로 제공합니다."
      }
    }
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["medium", "small"]
    },
    variant: {
      control: "inline-radio",
      options: ["outlined", "borderless"]
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<CardStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.basic)
};

export const Variant: Story = {
  render: renderVariantStory,
  parameters: createDocsDescription(storyDescriptions.variant)
};

export const Cover: Story = {
  render: renderCoverStory,
  parameters: createDocsDescription(storyDescriptions.cover)
};

export const Grid: Story = {
  render: renderGridStory,
  parameters: createDocsDescription(storyDescriptions.grid)
};

export const Inner: Story = {
  render: renderInnerStory,
  parameters: createDocsDescription(storyDescriptions.inner)
};

export const Loading: Story = {
  render: renderLoadingStory,
  parameters: createDocsDescription(storyDescriptions.loading)
};
