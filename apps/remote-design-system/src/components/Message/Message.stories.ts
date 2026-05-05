import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Message.stories.css";
import { defineDsButton } from "../Button";
import { DsMessage, defineDsMessage, type MessageType } from ".";
import {
  createDocsDescription,
  createFrame,
  createMessage,
  createMessageButton,
  createRow,
  type MessageStoryArgs
} from "./stories/Message.storyDom";

const storyDescriptions = {
  closable: "사용자가 직접 닫을 수 있는 메시지입니다. 닫힘은 `ds-message-close` 이벤트로 전달됩니다.",
  customSemanticDomStyling: "`part`를 사용해 루트와 콘텐츠 영역을 제품 맥락에 맞게 조정하는 예시입니다.",
  default: "짧은 성공, 실패, 안내 상태를 화면 위에 부담 없이 전달하는 기본 메시지입니다.",
  duration: "지정한 시간 뒤 자동으로 사라지는 전역 메시지를 버튼으로 실행합니다.",
  otherTypesOfMessage: "버튼을 눌러 성공, 정보, 경고, 오류, 로딩 메시지를 각각 실행합니다."
};

const defaultArgs = {
  closable: false,
  content: "변경 사항이 저장되었습니다.",
  duration: 3,
  type: "success"
} satisfies MessageStoryArgs;

const messageTypeActions = [
  { content: "저장되었습니다.", label: "Success", type: "success" },
  { content: "새 알림이 있습니다.", label: "Info", type: "info" },
  { content: "확인이 필요합니다.", label: "Warning", type: "warning" },
  { content: "처리에 실패했습니다.", label: "Error", type: "error" },
  { content: "처리 중입니다.", label: "Loading", type: "loading" }
] satisfies Array<{ content: string; label: string; type: MessageType }>;

function renderDefault(args: MessageStoryArgs) {
  defineDsMessage();

  return createFrame([createMessage(args)]);
}

function renderOtherTypesOfMessage() {
  defineDsMessage();
  defineDsButton();

  return createFrame([
    createRow(
      messageTypeActions.map(({ content, label, type }) =>
        createMessageButton(label, () =>
          DsMessage.show({
            content,
            duration: 3,
            type
          })
        )
      )
    )
  ]);
}

function renderClosable() {
  defineDsMessage();

  return createFrame([createMessage({ ...defaultArgs, closable: true, content: "이 메시지는 직접 닫을 수 있습니다." })]);
}

function renderDuration() {
  defineDsMessage();
  defineDsButton();

  const button = createMessageButton("메시지 표시", () =>
    DsMessage.show({
      content: "3초 뒤 자동으로 사라집니다.",
      duration: 3,
      type: "info"
    })
  );

  return createFrame([button]);
}

function renderCustomSemanticDomStyling() {
  defineDsMessage();

  const message = createMessage({ ...defaultArgs, content: "의미 DOM 스타일이 적용된 메시지입니다.", type: "info" });

  message.className = "ds-message-story-custom";

  return createFrame([message]);
}

const meta: Meta<MessageStoryArgs> = {
  title: "Components/Feedback/Message",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Message는 사용자의 행동 결과나 짧은 시스템 상태를 화면 위에 간결하게 전달하는 피드백 컴포넌트입니다."
      }
    }
  },
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["success", "info", "warning", "error", "loading"]
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<MessageStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.default)
};

export const OtherTypesOfMessage: Story = {
  render: renderOtherTypesOfMessage,
  parameters: createDocsDescription(storyDescriptions.otherTypesOfMessage)
};

export const Closable: Story = {
  render: renderClosable,
  parameters: createDocsDescription(storyDescriptions.closable)
};

export const Duration: Story = {
  render: renderDuration,
  parameters: createDocsDescription(storyDescriptions.duration)
};

export const CustomSemanticDomStyling: Story = {
  render: renderCustomSemanticDomStyling,
  parameters: createDocsDescription(storyDescriptions.customSemanticDomStyling)
};
