import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Progress.stories.css";
import { defineDsProgress, type ProgressSize, type ProgressStatus, type ProgressType } from ".";

type ProgressStoryArgs = {
  percent: number;
  showInfo: boolean;
  size: ProgressSize;
  status: ProgressStatus;
  type: ProgressType;
};

const storyDescriptions = {
  circle: "원형 진행률로 좁은 영역에서도 완료 정도를 명확히 보여줍니다.",
  customSemanticDomStyling: "`part`를 사용해 진행 막대와 정보 텍스트의 스타일을 외부에서 조정합니다.",
  default: "기본 선형 진행률입니다. 작업의 완료 정도를 숫자와 막대로 함께 보여줍니다.",
  status: "진행 중, 성공, 오류 상태에 따라 색상과 의미를 구분합니다.",
  steps: "단계형 진행률로 여러 구간으로 나뉜 작업의 진행 상태를 보여줍니다."
};

const defaultArgs = {
  percent: 68,
  showInfo: true,
  size: "middle",
  status: "normal",
  type: "line"
} satisfies ProgressStoryArgs;

function createDocsDescription(story: string) {
  return { docs: { description: { story } } };
}

function createProgress(args: ProgressStoryArgs) {
  const progress = document.createElement("ds-progress");

  progress.setAttribute("percent", String(args.percent));
  progress.setAttribute("size", args.size);
  progress.setAttribute("status", args.status);
  progress.setAttribute("type", args.type);
  progress.toggleAttribute("show-info", args.showInfo);

  return progress;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-progress-story-frame";
  frame.append(...children);

  return frame;
}

function createRow(children: HTMLElement[]) {
  const row = document.createElement("div");

  row.className = "ds-progress-story-row";
  row.append(...children);

  return row;
}

function renderDefault(args: ProgressStoryArgs) {
  defineDsProgress();

  return createFrame([createProgress(args)]);
}

function renderStatus() {
  defineDsProgress();

  return createFrame([
    createProgress({ ...defaultArgs, percent: 45, status: "active" }),
    createProgress({ ...defaultArgs, percent: 100, status: "success" }),
    createProgress({ ...defaultArgs, percent: 52, status: "exception" })
  ]);
}

function renderCircle() {
  defineDsProgress();

  return createRow([
    createProgress({ ...defaultArgs, percent: 75, type: "circle" }),
    createProgress({ ...defaultArgs, percent: 100, status: "success", type: "circle" })
  ]);
}

function renderSteps() {
  defineDsProgress();

  const progress = createProgress({ ...defaultArgs, percent: 60, type: "steps" });

  progress.setAttribute("steps", "6");

  return createFrame([progress]);
}

function renderCustomSemanticDomStyling() {
  defineDsProgress();

  const progress = createProgress({ ...defaultArgs, percent: 42 });

  progress.className = "ds-progress-story-custom";

  return createFrame([progress]);
}

const meta: Meta<ProgressStoryArgs> = {
  title: "Components/Feedback/Progress",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Progress는 작업의 완료 정도, 진행 상태, 단계별 흐름을 시각적으로 전달하는 피드백 컴포넌트입니다."
      }
    }
  },
  argTypes: {
    size: { control: "inline-radio", options: ["small", "middle", "large"] },
    status: { control: "inline-radio", options: ["normal", "active", "success", "exception"] },
    type: { control: "inline-radio", options: ["line", "circle", "steps"] }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<ProgressStoryArgs>;

export const Default: Story = { parameters: createDocsDescription(storyDescriptions.default) };
export const Status: Story = { render: renderStatus, parameters: createDocsDescription(storyDescriptions.status) };
export const Circle: Story = { render: renderCircle, parameters: createDocsDescription(storyDescriptions.circle) };
export const Steps: Story = { render: renderSteps, parameters: createDocsDescription(storyDescriptions.steps) };
export const CustomSemanticDomStyling: Story = {
  render: renderCustomSemanticDomStyling,
  parameters: createDocsDescription(storyDescriptions.customSemanticDomStyling)
};
