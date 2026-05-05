import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Modal.stories.css";
import { defineDsModal } from ".";

type ModalStoryArgs = {
  centered: boolean;
  closable: boolean;
  mask: boolean;
  title: string;
};

const storyDescriptions = {
  centered: "모달을 화면 중앙에 배치해 사용자의 확인이 필요한 흐름을 더 강하게 강조합니다.",
  customFooter: "푸터 슬롯에 확인과 취소 액션을 배치해 결정이 필요한 작업 흐름을 구성합니다.",
  customSemanticDomStyling: "`part`를 사용해 대화상자와 제목 영역의 의미 DOM 스타일을 외부에서 조정합니다.",
  default: "기본 모달은 현재 화면 위에 중요한 정보나 확인 흐름을 대화상자로 표시합니다.",
  noMask: "마스크 없이 모달을 표시해 주변 화면과 함께 대화상자를 확인할 수 있습니다."
};

const defaultArgs = {
  centered: false,
  closable: true,
  mask: true,
  title: "작업 확인"
} satisfies ModalStoryArgs;

function createDocsDescription(story: string) {
  return {
    docs: {
      description: {
        story
      }
    }
  };
}

function createTrigger(label: string, modal: HTMLElement) {
  const button = document.createElement("button");

  button.className = "ds-modal-story-button";
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", () => modal.setAttribute("open", "true"));

  return button;
}

function createModal(args: ModalStoryArgs, content = "진행하기 전에 변경 내용을 확인해 주세요.") {
  const modal = document.createElement("ds-modal");
  const body = document.createElement("div");

  modal.setAttribute("title", args.title);
  modal.toggleAttribute("centered", args.centered);
  modal.toggleAttribute("closable", args.closable);
  modal.toggleAttribute("mask", args.mask);
  body.className = "ds-modal-story-content";
  body.innerHTML = `<strong>확인 내용</strong><span>${content}</span>`;
  modal.append(body);

  return modal;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-modal-story-frame";
  frame.append(...children);

  return frame;
}

function renderDefault(args: ModalStoryArgs) {
  defineDsModal();

  const modal = createModal(args);

  return createFrame([createTrigger("모달 열기", modal), modal]);
}

function renderCentered() {
  defineDsModal();

  const modal = createModal({ ...defaultArgs, centered: true, title: "중앙 모달" });

  return createFrame([createTrigger("중앙에서 열기", modal), modal]);
}

function renderCustomFooter() {
  defineDsModal();

  const modal = createModal({ ...defaultArgs, title: "삭제 확인" }, "삭제 후에는 30일 안에만 복원할 수 있습니다.");
  const cancel = document.createElement("button");
  const confirm = document.createElement("button");

  cancel.className = "ds-modal-story-footer-button";
  confirm.className = "ds-modal-story-button";
  cancel.slot = "footer";
  confirm.slot = "footer";
  cancel.textContent = "취소";
  confirm.textContent = "삭제";
  modal.append(cancel, confirm);

  return createFrame([createTrigger("삭제 모달 열기", modal), modal]);
}

function renderNoMask() {
  defineDsModal();

  const modal = createModal({ ...defaultArgs, mask: false, title: "마스크 없는 모달" });

  return createFrame([createTrigger("마스크 없이 열기", modal), modal]);
}

function renderCustomSemanticDomStyling() {
  defineDsModal();

  const modal = createModal({ ...defaultArgs, title: "스타일이 조정된 모달" });

  modal.className = "ds-modal-story-custom";

  return createFrame([createTrigger("스타일 예시 열기", modal), modal]);
}

const meta: Meta<ModalStoryArgs> = {
  title: "Components/Feedback/Modal",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Modal은 사용자의 집중이 필요한 정보, 확인, 결정 흐름을 현재 화면 위에 대화상자로 표시하는 피드백 컴포넌트입니다."
      }
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<ModalStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.default)
};

export const Centered: Story = {
  render: renderCentered,
  parameters: createDocsDescription(storyDescriptions.centered)
};

export const CustomFooter: Story = {
  render: renderCustomFooter,
  parameters: createDocsDescription(storyDescriptions.customFooter)
};

export const NoMask: Story = {
  render: renderNoMask,
  parameters: createDocsDescription(storyDescriptions.noMask)
};

export const CustomSemanticDomStyling: Story = {
  render: renderCustomSemanticDomStyling,
  parameters: createDocsDescription(storyDescriptions.customSemanticDomStyling)
};
