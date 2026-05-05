import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Spin.stories.css";
import { defineDsSpin, type SpinSize } from ".";

type SpinStoryArgs = {
  delay: number;
  fullscreen: boolean;
  size: SpinSize;
  spinning: boolean;
  tip: string;
};

const storyDescriptions = {
  customSemanticDomStyling: "`part`를 사용해 인디케이터와 안내 텍스트 스타일을 외부에서 조정합니다.",
  delay: "짧은 작업에서는 로딩 표시가 깜빡이지 않도록 지정 시간 이후에만 표시합니다.",
  default: "진행 시간이 짧지 않은 비동기 작업에서 기본 로딩 상태를 표시합니다.",
  fullscreen: "화면 전체를 덮는 로딩 상태로 페이지 전환이나 큰 작업을 기다리게 합니다.",
  sizes: "작은 영역부터 전체 패널까지 상황에 맞게 크기를 선택합니다."
};

const defaultArgs = {
  delay: 0,
  fullscreen: false,
  size: "middle",
  spinning: true,
  tip: ""
} satisfies SpinStoryArgs;

function createDocsDescription(story: string) {
  return { docs: { description: { story } } };
}

function createSpin(args: SpinStoryArgs) {
  const spin = document.createElement("ds-spin");

  spin.setAttribute("size", args.size);
  spin.setAttribute("delay", String(args.delay));
  spin.toggleAttribute("fullscreen", args.fullscreen);
  spin.toggleAttribute("spinning", args.spinning);

  if (args.tip) {
    spin.setAttribute("tip", args.tip);
  }

  return spin;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-spin-story-frame";
  frame.append(...children);

  return frame;
}

function renderDefault(args: SpinStoryArgs) {
  defineDsSpin();

  return createFrame([createSpin(args)]);
}

function renderSizes() {
  defineDsSpin();

  const row = document.createElement("div");

  row.className = "ds-spin-story-row";
  row.append(
    createSpin({ ...defaultArgs, size: "small" }),
    createSpin({ ...defaultArgs, size: "middle" }),
    createSpin({ ...defaultArgs, size: "large" })
  );

  return createFrame([row]);
}

function renderDelay() {
  defineDsSpin();

  return createFrame([createSpin({ ...defaultArgs, delay: 800, tip: "잠시만 기다려 주세요." })]);
}

function renderFullscreen() {
  defineDsSpin();

  const panel = document.createElement("div");
  const spin = createSpin({ ...defaultArgs, tip: "전체 화면 로딩" });

  panel.className = "ds-spin-story-panel";
  panel.textContent = "실제 전체 화면 동작은 fullscreen 속성을 켜면 viewport 전체에 표시됩니다.";
  spin.setAttribute("tip", "패널 로딩");
  panel.append(spin);

  return createFrame([panel]);
}

function renderCustomSemanticDomStyling() {
  defineDsSpin();

  const spin = createSpin({ ...defaultArgs, size: "large", tip: "강조된 로딩" });

  spin.className = "ds-spin-story-custom";

  return createFrame([spin]);
}

const meta: Meta<SpinStoryArgs> = {
  title: "Components/Feedback/Spin",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Spin은 처리 중인 상태를 짧고 명확하게 보여주는 로딩 피드백 컴포넌트입니다."
      }
    }
  },
  argTypes: {
    size: { control: "inline-radio", options: ["small", "middle", "large"] }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<SpinStoryArgs>;

export const Default: Story = { parameters: createDocsDescription(storyDescriptions.default) };
export const Sizes: Story = { render: renderSizes, parameters: createDocsDescription(storyDescriptions.sizes) };
export const Delay: Story = { render: renderDelay, parameters: createDocsDescription(storyDescriptions.delay) };
export const Fullscreen: Story = { render: renderFullscreen, parameters: createDocsDescription(storyDescriptions.fullscreen) };
export const CustomSemanticDomStyling: Story = {
  render: renderCustomSemanticDomStyling,
  parameters: createDocsDescription(storyDescriptions.customSemanticDomStyling)
};
