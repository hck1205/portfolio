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

const storyDescriptions = {
  active: "로딩 중임을 더 명확히 보여주기 위해 shimmer 애니메이션을 적용합니다.",
  avatar: "사용자 프로필이나 목록 카드처럼 아바타 영역이 필요한 레이아웃을 표현합니다.",
  customSemanticDomStyling: "`part`를 사용해 스켈레톤 영역의 의미 DOM 스타일을 외부에서 조정합니다.",
  default: "콘텐츠가 로딩되는 동안 화면 구조를 유지하는 기본 스켈레톤입니다.",
  loaded: "loading 값이 false가 되면 실제 슬롯 콘텐츠를 표시합니다."
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

function createSkeleton(args: SkeletonStoryArgs) {
  const skeleton = document.createElement("ds-skeleton");
  const content = document.createElement("div");

  skeleton.toggleAttribute("active", args.active);
  skeleton.toggleAttribute("avatar", args.avatar);
  skeleton.toggleAttribute("loading", args.loading);
  skeleton.toggleAttribute("round", args.round);
  skeleton.toggleAttribute("title", args.title);
  skeleton.setAttribute("paragraph-rows", String(args.paragraphRows));
  content.className = "ds-skeleton-story-card";
  content.innerHTML = "<strong>로드된 콘텐츠</strong><span>데이터 로딩이 완료되면 실제 콘텐츠가 이 영역에 표시됩니다.</span>";
  skeleton.append(content);

  return skeleton;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-skeleton-story-frame";
  frame.append(...children);

  return frame;
}

function renderDefault(args: SkeletonStoryArgs) {
  defineDsSkeleton();

  return createFrame([createSkeleton(args)]);
}

function renderActive() {
  defineDsSkeleton();

  return createFrame([createSkeleton({ ...defaultArgs, active: true })]);
}

function renderAvatar() {
  defineDsSkeleton();

  return createFrame([createSkeleton({ ...defaultArgs, active: true, avatar: true })]);
}

function renderLoaded() {
  defineDsSkeleton();

  return createFrame([createSkeleton({ ...defaultArgs, loading: false })]);
}

function renderCustomSemanticDomStyling() {
  defineDsSkeleton();

  const skeleton = createSkeleton({ ...defaultArgs, active: true, round: true });

  skeleton.className = "ds-skeleton-story-custom";

  return createFrame([skeleton]);
}

const meta: Meta<SkeletonStoryArgs> = {
  title: "Components/Feedback/Skeleton",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Skeleton은 데이터가 준비되기 전 콘텐츠의 구조를 먼저 보여주어 로딩 중 화면 흔들림을 줄이는 피드백 컴포넌트입니다."
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
export const Loaded: Story = { render: renderLoaded, parameters: createDocsDescription(storyDescriptions.loaded) };
export const CustomSemanticDomStyling: Story = {
  render: renderCustomSemanticDomStyling,
  parameters: createDocsDescription(storyDescriptions.customSemanticDomStyling)
};
