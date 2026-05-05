import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Modal.stories.css";
import { defineDsButton } from "../Button";
import { defineDsModal } from ".";
import { createSemanticContent } from "./stories/Modal.storyContent";
import {
  appendFooterActions,
  createDocsDescription,
  createFrame,
  createModal,
  createTrigger
} from "./stories/Modal.storyDom";
import type { ModalStoryArgs } from "./stories/Modal.storyTypes";

const storyDescriptions = {
  centered: "모달을 화면 중앙에 배치해 사용자의 확인이 필요한 흐름을 더 강하게 강조합니다.",
  customFooter: "푸터 슬롯에 확인과 취소 액션을 배치해 결정이 필요한 작업 흐름을 구성합니다.",
  customSemanticDomStyling:
    "`part`를 사용해 mask, dialog, header, body, footer를 꾸미고 centered 옵션으로 배치 위치를 전환합니다.",
  default: "기본 모달은 header, content, footer를 갖고 footer에 주요 액션 버튼을 배치합니다.",
  noMask: "마스크 없이 모달을 표시해 주변 화면과 함께 대화상자를 확인할 수 있습니다."
};

const defaultArgs = {
  centered: false,
  closable: true,
  mask: true,
  title: "작업 확인"
} satisfies ModalStoryArgs;

function renderDefault(args: ModalStoryArgs) {
  defineDsModal();
  defineDsButton();

  const modal = createModal(args, "작업을 계속 진행하려면 내용을 확인한 뒤 확인 버튼을 선택해 주세요.");

  appendFooterActions(modal, {
    primaryLabel: "확인",
    secondaryLabel: "취소"
  });

  return createFrame([createTrigger("모달 열기", modal), modal]);
}

function renderCentered() {
  defineDsModal();
  defineDsButton();

  const modal = createModal({ ...defaultArgs, centered: true, title: "중앙 모달" });

  return createFrame([createTrigger("중앙에서 열기", modal), modal]);
}

function renderCustomFooter() {
  defineDsModal();
  defineDsButton();

  const modal = createModal({ ...defaultArgs, title: "삭제 확인" }, "삭제 후에는 30일 안에만 복원할 수 있습니다.");

  appendFooterActions(modal, {
    primaryLabel: "삭제",
    secondaryLabel: "취소"
  });

  return createFrame([createTrigger("삭제 모달 열기", modal), modal]);
}

function renderNoMask() {
  defineDsModal();
  defineDsButton();

  const modal = createModal({ ...defaultArgs, mask: false, title: "마스크 없는 모달" });

  return createFrame([createTrigger("마스크 없이 열기", modal), modal]);
}

function renderCustomSemanticDomStyling(args: ModalStoryArgs) {
  defineDsModal();
  defineDsButton();

  const modal = createModal(args, createSemanticContent());

  modal.className = "ds-modal-story-custom";
  appendFooterActions(modal, {
    primaryClassName: "ds-modal-story-custom-primary",
    primaryLabel: "변경 적용",
    secondaryClassName: "ds-modal-story-custom-secondary",
    secondaryLabel: "나중에"
  });

  return createFrame([createTrigger("스타일 모달 열기", modal), modal]);
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
  args: {
    ...defaultArgs,
    centered: true,
    title: "릴리즈 변경사항"
  },
  parameters: createDocsDescription(storyDescriptions.customSemanticDomStyling)
};
