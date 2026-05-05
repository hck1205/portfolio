import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Popconfirm.stories.css";
import { defineDsPopconfirm, type PopconfirmPlacement } from ".";

type PopconfirmStoryArgs = {
  description: string;
  placement: PopconfirmPlacement;
  title: string;
};

const storyDescriptions = {
  customSemanticDomStyling: "`part`로 팝업, 제목, 액션 버튼의 의미 DOM 스타일을 조정합니다.",
  default: "사용자의 위험하거나 되돌리기 어려운 행동 앞에서 한 번 더 확인을 받습니다.",
  placement: "트리거 주변의 기본 네 방향 배치를 확인합니다.",
  text: "확인과 취소 버튼의 표시 문구를 작업 맥락에 맞게 바꿉니다."
};

const defaultArgs = {
  description: "이 작업은 즉시 적용되며 필요하면 나중에 복원할 수 있습니다.",
  placement: "top",
  title: "이 항목을 삭제할까요?"
} satisfies PopconfirmStoryArgs;

function createDocsDescription(story: string) {
  return { docs: { description: { story } } };
}

function createButton(label: string, danger = false) {
  const button = document.createElement("button");

  button.className = `ds-popconfirm-story-button${danger ? " ds-popconfirm-story-danger" : ""}`;
  button.type = "button";
  button.textContent = label;

  return button;
}

function createPopconfirm(args: PopconfirmStoryArgs, label = "삭제", danger = true) {
  const popconfirm = document.createElement("ds-popconfirm");

  popconfirm.setAttribute("title", args.title);
  popconfirm.setAttribute("description", args.description);
  popconfirm.setAttribute("placement", args.placement);
  popconfirm.append(createButton(label, danger));

  return popconfirm;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-popconfirm-story-frame";
  frame.append(...children);

  return frame;
}

function renderDefault(args: PopconfirmStoryArgs) {
  defineDsPopconfirm();

  return createFrame([createPopconfirm(args)]);
}

function renderPlacement() {
  defineDsPopconfirm();

  const placements: PopconfirmPlacement[] = ["top", "right", "bottom", "left"];

  return createFrame(placements.map((placement) => createPopconfirm({ ...defaultArgs, placement }, placement, false)));
}

function renderText() {
  defineDsPopconfirm();

  const popconfirm = createPopconfirm(defaultArgs);

  popconfirm.setAttribute("ok-text", "삭제");
  popconfirm.setAttribute("cancel-text", "유지");

  return createFrame([popconfirm]);
}

function renderCustomSemanticDomStyling() {
  defineDsPopconfirm();

  const popconfirm = createPopconfirm({ ...defaultArgs, title: "스타일이 조정된 확인" }, "확인", false);

  popconfirm.className = "ds-popconfirm-story-custom";

  return createFrame([popconfirm]);
}

const meta: Meta<PopconfirmStoryArgs> = {
  title: "Components/Feedback/Popconfirm",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Popconfirm은 사용자의 클릭 행동 직후 작은 확인 레이어를 띄워 취소와 확정을 선택하게 하는 피드백 컴포넌트입니다."
      }
    }
  },
  argTypes: {
    placement: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"]
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<PopconfirmStoryArgs>;

export const Default: Story = { parameters: createDocsDescription(storyDescriptions.default) };
export const Placement: Story = { render: renderPlacement, parameters: createDocsDescription(storyDescriptions.placement) };
export const Text: Story = { render: renderText, parameters: createDocsDescription(storyDescriptions.text) };
export const CustomSemanticDomStyling: Story = {
  render: renderCustomSemanticDomStyling,
  parameters: createDocsDescription(storyDescriptions.customSemanticDomStyling)
};
