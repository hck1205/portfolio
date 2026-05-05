import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Progress.stories.css";
import { defineDsButton } from "../Button";
import { defineDsProgress, type ProgressSize, type ProgressStatus, type ProgressType } from ".";

type ProgressStoryArgs = {
  format?: string;
  percent: number;
  showInfo: boolean;
  size: ProgressSize;
  status: ProgressStatus;
  steps?: number;
  type: ProgressType;
};

type ProgressStoryOverrides = Partial<ProgressStoryArgs>;

const storyDescriptions = {
  circle: "원형 진행률로 좁은 영역에서도 완료 정도를 명확히 보여줍니다.",
  circularProgressBar: "원형 진행률에서 상태별 아이콘 색상과 사용자 정의 텍스트를 함께 표시합니다.",
  customLineGradient: "선형 진행률의 채움 영역에 방향과 색상이 다른 그라데이션을 적용합니다.",
  customTextFormat: "진행률 정보 영역을 퍼센트 외의 업무 문맥에 맞는 텍스트로 표시합니다.",
  customSemanticDomStyling: "`part`를 사용해 진행 막대와 정보 텍스트의 스타일을 외부에서 조정합니다.",
  default: "기본 선형 진행률입니다. 작업의 완료 정도를 숫자와 막대로 함께 보여줍니다.",
  dynamic: "버튼으로 진행률을 직접 변경해 진행 상태가 동적으로 갱신되는 모습을 확인합니다.",
  progressBarWithSteps: "단계 개수와 상태가 다른 단계형 진행률을 비교합니다.",
  progressSize: "선형과 원형 진행률을 크기별로 비교합니다.",
  status: "진행 중, 성공, 오류 상태에 따라 색상과 흐름을 구분합니다.",
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
  progress.setAttribute("show-info", String(args.showInfo));
  if (args.format) {
    progress.setAttribute("format", args.format);
  }
  if (args.steps !== undefined) {
    progress.setAttribute("steps", String(args.steps));
  }

  return progress;
}

function createProgresses(items: ProgressStoryOverrides[]) {
  return items.map((item) => createProgress({ ...defaultArgs, ...item }));
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

function createProgressFrame(items: ProgressStoryOverrides[]) {
  return createFrame(createProgresses(items));
}

function createProgressRow(items: ProgressStoryOverrides[]) {
  return createRow(createProgresses(items));
}

function createActionButton(label: string, onClick: () => void) {
  const button = document.createElement("ds-button");

  button.setAttribute("html-type", "button");
  button.setAttribute("aria-label", label);
  button.textContent = label;
  button.addEventListener("ds-button-click", onClick);

  return button;
}

function renderDefault(args: ProgressStoryArgs) {
  defineDsProgress();

  return createFrame([createProgress(args)]);
}

function renderStatus() {
  defineDsProgress();

  return createProgressFrame([
    { percent: 45, status: "active" },
    { percent: 100, status: "success" },
    { percent: 52, status: "exception" }
  ]);
}

function renderCircle() {
  defineDsProgress();

  return createProgressRow([
    { percent: 75, type: "circle" },
    { percent: 100, status: "success", type: "circle" }
  ]);
}

function renderCircularProgressBar() {
  defineDsProgress();

  return createProgressRow([
    { format: "Ready", percent: 24, type: "circle" },
    { format: "Running", percent: 68, status: "active", type: "circle" },
    { format: "Done", percent: 100, status: "success", type: "circle" },
    { format: "Failed", percent: 72, status: "exception", type: "circle" }
  ]);
}

function renderDynamic() {
  defineDsButton();
  defineDsProgress();

  let percent = 30;
  const lineProgress = createProgress({ ...defaultArgs, percent });
  const circleProgress = createProgress({ ...defaultArgs, percent, type: "circle" });
  const decreaseButton = createActionButton("-", () => updatePercent(percent - 10));
  const increaseButton = createActionButton("+", () => updatePercent(percent + 10));
  const controls = createRow([decreaseButton, increaseButton]);

  controls.classList.add("ds-progress-story-controls");

  function updatePercent(nextPercent: number) {
    percent = Math.min(100, Math.max(0, nextPercent));
    lineProgress.setAttribute("percent", String(percent));
    circleProgress.setAttribute("percent", String(percent));
    decreaseButton.toggleAttribute("disabled", percent <= 0);
    increaseButton.toggleAttribute("disabled", percent >= 100);
  }

  updatePercent(percent);

  return createFrame([lineProgress, createRow([circleProgress]), controls]);
}

function renderCustomTextFormat() {
  defineDsProgress();

  return createFrame([
    ...createProgresses([{ format: "{percent} Days", percent: 75 }]),
    createProgressRow([{ format: "Done", percent: 100, type: "circle" }])
  ]);
}

function renderCustomLineGradient() {
  defineDsProgress();

  const coolGradient = createProgress({ ...defaultArgs, percent: 72 });
  const warmGradient = createProgress({ ...defaultArgs, percent: 88, size: "large" });

  coolGradient.className = "ds-progress-story-gradient ds-progress-story-gradient--cool";
  warmGradient.className = "ds-progress-story-gradient ds-progress-story-gradient--warm";

  return createFrame([coolGradient, warmGradient]);
}

function renderProgressSize() {
  defineDsProgress();

  return createFrame([
    ...createProgresses([
      { percent: 30, size: "small" },
      { percent: 50, size: "middle" },
      { percent: 70, size: "large" }
    ]),
    createProgressRow([
      { percent: 30, size: "small", type: "circle" },
      { percent: 50, size: "middle", type: "circle" },
      { percent: 70, size: "large", type: "circle" }
    ])
  ]);
}

function renderProgressBarWithSteps() {
  defineDsProgress();

  return createProgressFrame([
    { percent: 40, steps: 5, type: "steps" },
    { percent: 60, steps: 8, type: "steps" },
    { percent: 100, status: "success", steps: 8, type: "steps" },
    { percent: 70, status: "exception", steps: 10, type: "steps" }
  ]);
}

function renderSteps() {
  defineDsProgress();

  return createProgressFrame([{ percent: 60, steps: 6, type: "steps" }]);
}

function renderCustomSemanticDomStyling() {
  defineDsProgress();

  const lineProgress = createProgress({ ...defaultArgs, format: "{percent}% shipped", percent: 64 });
  const circleProgress = createProgress({ ...defaultArgs, percent: 82, type: "circle" });
  const stepsProgress = createProgress({ ...defaultArgs, percent: 50, type: "steps" });

  lineProgress.className = "ds-progress-story-custom";
  circleProgress.className = "ds-progress-story-custom";
  stepsProgress.className = "ds-progress-story-custom";
  stepsProgress.setAttribute("steps", "8");

  return createFrame([lineProgress, createRow([circleProgress, stepsProgress])]);
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
export const CircularProgressBar: Story = {
  render: renderCircularProgressBar,
  parameters: createDocsDescription(storyDescriptions.circularProgressBar)
};
export const Dynamic: Story = { render: renderDynamic, parameters: createDocsDescription(storyDescriptions.dynamic) };
export const CustomTextFormat: Story = {
  render: renderCustomTextFormat,
  parameters: createDocsDescription(storyDescriptions.customTextFormat)
};
export const CustomLineGradient: Story = {
  render: renderCustomLineGradient,
  parameters: createDocsDescription(storyDescriptions.customLineGradient)
};
export const ProgressSizes: Story = {
  name: "Progress Size",
  render: renderProgressSize,
  parameters: createDocsDescription(storyDescriptions.progressSize)
};
export const ProgressBarWithSteps: Story = {
  render: renderProgressBarWithSteps,
  parameters: createDocsDescription(storyDescriptions.progressBarWithSteps)
};
export const Steps: Story = { render: renderSteps, parameters: createDocsDescription(storyDescriptions.steps) };
export const CustomSemanticDomStyling: Story = {
  render: renderCustomSemanticDomStyling,
  parameters: createDocsDescription(storyDescriptions.customSemanticDomStyling)
};
