import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Card.stories.css";
import { defineDsCard, type CardSize, type CardVariant } from ".";

type CardStoryArgs = {
  coverSrc: string;
  extra: string;
  extraHref: string;
  extraRel: string;
  extraTarget: string;
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
  extraHref: "#more",
  extraRel: "",
  extraTarget: "",
  hoverable: false,
  loading: false,
  size: "medium",
  title: "Card title",
  type: "",
  variant: "outlined"
} satisfies CardStoryArgs;

const storyDescriptions = {
  basic: "Card는 단일 주제와 관련된 정보를 담는 컨테이너입니다. extra와 extra-href를 함께 사용하면 우측 More 영역이 링크로 동작합니다.",
  column: "여러 Card를 컬럼 레이아웃으로 배치해 개요 화면이나 목록형 콘텐츠를 구성합니다.",
  cover: "cover와 Card.Meta를 조합해 이미지 중심 콘텐츠를 구성합니다.",
  grid: "Card.Grid는 카드 내부 정보를 격자로 배치합니다.",
  inner: "inner card는 다단계 정보 구조 안에 배치하기 좋습니다.",
  loading: "loading 상태에서는 body 대신 skeleton을 표시합니다.",
  variant: "outlined와 borderless variant를 제공합니다."
};

const contentCards = [
  {
    avatarSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    coverSrc: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
    description: "www.instagram.com",
    title: "Europe Street beat"
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    coverSrc: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80",
    description: "Design system overview",
    title: "Object Card"
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
    coverSrc: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80",
    description: "Component documentation",
    title: "Function Card"
  }
] as const;

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
  syncOptionalAttribute(card, "extra-href", mergedArgs.extraHref);
  syncOptionalAttribute(card, "extra-rel", mergedArgs.extraRel);
  syncOptionalAttribute(card, "extra-target", mergedArgs.extraTarget);
  syncOptionalAttribute(card, "title", mergedArgs.title);
  syncOptionalAttribute(card, "type", mergedArgs.type);
  body.className = "ds-card-story-text";
  body.textContent = content;
  card.append(body);

  return card;
}

function createMeta({
  avatarSrc,
  description,
  title
}: {
  avatarSrc?: string;
  description: string;
  title: string;
}) {
  const meta = document.createElement("ds-card-meta");

  syncOptionalAttribute(meta, "avatar-src", avatarSrc ?? "");
  meta.setAttribute("title", title);
  meta.setAttribute("description", description);

  return meta;
}

function createContentCard({
  avatarSrc,
  coverSrc,
  description,
  title
}: {
  avatarSrc: string;
  coverSrc: string;
  description: string;
  title: string;
}) {
  const card = createCard({ coverSrc, hoverable: true, title: "" }, "");

  card.replaceChildren(createMeta({ avatarSrc, description, title }));

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

  return createFrame([createContentCard(contentCards[0])]);
}

function renderColumnStory() {
  ensureCardDefined();

  return createFrame([createRow(contentCards.map(createContentCard))]);
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

export const CardInColumn: Story = {
  render: renderColumnStory,
  parameters: createDocsDescription(storyDescriptions.column)
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
