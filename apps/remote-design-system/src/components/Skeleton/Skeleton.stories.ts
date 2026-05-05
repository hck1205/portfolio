import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Skeleton.stories.css";
import { defineDsSkeleton } from ".";

type SkeletonStoryArgs = {
  active: boolean;
  avatar: boolean;
  loading: boolean;
  paragraphRows: number;
  round: boolean;
  title: boolean;
};

type SkeletonStoryOverrides = Partial<SkeletonStoryArgs>;
type SkeletonBooleanAttribute = "active" | "avatar" | "loading" | "round" | "title";

const SKELETON_BOOLEAN_ATTRIBUTES = ["active", "avatar", "loading", "round", "title"] satisfies SkeletonBooleanAttribute[];

const storyDescriptions = {
  active: "로딩 중임을 더 명확하게 보여주기 위해 shimmer 애니메이션을 적용합니다.",
  avatar: "사용자 프로필이나 목록 카드처럼 아바타 영역이 필요한 레이아웃을 표현합니다.",
  customSemanticDomStyling: "`part`를 사용해 skeleton 영역의 세부 DOM 스타일을 외부에서 조정합니다.",
  default: "콘텐츠가 로딩되는 동안 화면 구조를 유지하는 기본 skeleton입니다.",
  loaded: "`loading`이 false가 되면 실제 슬롯 콘텐츠를 표시합니다.",
  paragraph: "문단 row 개수와 title 표시 여부가 다른 skeleton 상태를 비교합니다.",
  round: "둥근 skeleton 라인으로 더 부드러운 placeholder 형태를 표현합니다."
};

const defaultArgs = {
  active: false,
  avatar: false,
  loading: true,
  paragraphRows: 3,
  round: false,
  title: true
} satisfies SkeletonStoryArgs;

function createDocsDescription(story: string) {
  return { docs: { description: { story } } };
}

function createSkeleton(overrides: SkeletonStoryOverrides = {}) {
  const args = { ...defaultArgs, ...overrides };
  const skeleton = document.createElement("ds-skeleton");
  const content = document.createElement("div");

  SKELETON_BOOLEAN_ATTRIBUTES.forEach((attribute) => {
    skeleton.setAttribute(attribute, String(args[attribute]));
  });
  skeleton.setAttribute("paragraph-rows", String(args.paragraphRows));
  content.className = "ds-skeleton-story-card";
  content.append(createContentTitle("로드된 콘텐츠"), createContentText("데이터 로딩이 완료되면 실제 콘텐츠가 이 영역에 표시됩니다."));
  skeleton.append(content);

  return skeleton;
}

function createSkeletons(items: SkeletonStoryOverrides[]) {
  return items.map((item) => createSkeleton(item));
}

function createContentTitle(text: string) {
  const title = document.createElement("strong");

  title.textContent = text;

  return title;
}

function createContentText(text: string) {
  const content = document.createElement("span");

  content.textContent = text;

  return content;
}

function createFrame(...children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-skeleton-story-frame";
  frame.append(...children);

  return frame;
}

function createRow(...children: HTMLElement[]) {
  const row = document.createElement("div");

  row.className = "ds-skeleton-story-row";
  row.append(...children);

  return row;
}

function renderDefault(args: SkeletonStoryArgs) {
  defineDsSkeleton();

  return createFrame(createSkeleton(args));
}

function renderActive() {
  defineDsSkeleton();

  return createFrame(createSkeleton({ active: true }));
}

function renderAvatar() {
  defineDsSkeleton();

  return createFrame(createSkeleton({ active: true, avatar: true }));
}

function renderParagraph() {
  defineDsSkeleton();

  return createFrame(
    ...createSkeletons([{ paragraphRows: 2 }, { paragraphRows: 4 }, { paragraphRows: 3, title: false }])
  );
}

function renderRound() {
  defineDsSkeleton();

  return createFrame(createSkeleton({ active: true, round: true }));
}

function renderLoaded() {
  defineDsSkeleton();

  return createFrame(createSkeleton({ loading: false }));
}

function renderCustomSemanticDomStyling() {
  defineDsSkeleton();

  const plainSkeleton = createSkeleton({ active: true, round: true });
  const avatarSkeleton = createSkeleton({ active: true, avatar: true, paragraphRows: 4 });

  plainSkeleton.className = "ds-skeleton-story-custom";
  avatarSkeleton.className = "ds-skeleton-story-custom";

  return createFrame(createRow(plainSkeleton, avatarSkeleton));
}

const meta: Meta<SkeletonStoryArgs> = {
  title: "Components/Feedback/Skeleton",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Skeleton은 데이터가 준비되기 전 콘텐츠의 구조를 먼저 보여주어 로딩 중 화면 흔들림을 줄이는 피드백 컴포넌트입니다."
      }
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<SkeletonStoryArgs>;

export const Default: Story = { parameters: createDocsDescription(storyDescriptions.default) };
export const Active: Story = { render: renderActive, parameters: createDocsDescription(storyDescriptions.active) };
export const Avatar: Story = { render: renderAvatar, parameters: createDocsDescription(storyDescriptions.avatar) };
export const Paragraph: Story = { render: renderParagraph, parameters: createDocsDescription(storyDescriptions.paragraph) };
export const Round: Story = { render: renderRound, parameters: createDocsDescription(storyDescriptions.round) };
export const Loaded: Story = { render: renderLoaded, parameters: createDocsDescription(storyDescriptions.loaded) };
export const CustomSemanticDomStyling: Story = {
  render: renderCustomSemanticDomStyling,
  parameters: createDocsDescription(storyDescriptions.customSemanticDomStyling)
};
