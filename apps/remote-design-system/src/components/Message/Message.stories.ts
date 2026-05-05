import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Message.stories.css";
import { DsMessage, defineDsMessage, type MessageType } from ".";

type MessageStoryArgs = {
  closable: boolean;
  content: string;
  duration: number;
  type: MessageType;
};

const storyDescriptions = {
  closable: "사용자가 직접 닫을 수 있는 메시지입니다. 닫힘은 `ds-message-close` 이벤트로 전달됩니다.",
  customSemanticDomStyling: "`part`를 사용해 루트와 콘텐츠 영역을 제품 맥락에 맞게 조정하는 예시입니다.",
  default: "짧은 성공, 실패, 안내 상태를 화면 위에 부담 없이 전달하는 기본 메시지입니다.",
  duration: "지정한 시간 뒤 자동으로 사라지는 전역 메시지를 버튼으로 실행합니다.",
  types: "성공, 정보, 경고, 오류, 로딩 상태를 각각 다른 아이콘과 의미 역할로 표시합니다."
};

const defaultArgs = {
  closable: false,
  content: "변경 사항이 저장되었습니다.",
  duration: 3,
  type: "success"
} satisfies MessageStoryArgs;

function createDocsDescription(story: string) {
  return {
    docs: {
      description: {
        story
      }
    }
  };
}

function createMessage(args: MessageStoryArgs) {
  const message = document.createElement("ds-message");

  message.setAttribute("content", args.content);
  message.setAttribute("duration", "0");
  message.setAttribute("type", args.type);
  message.toggleAttribute("closable", args.closable);

  return message;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-message-story-frame";
  frame.append(...children);

  return frame;
}

function createRow(children: HTMLElement[]) {
  const row = document.createElement("div");

  row.className = "ds-message-story-row";
  row.append(...children);

  return row;
}

function renderDefault(args: MessageStoryArgs) {
  defineDsMessage();

  return createFrame([createMessage(args)]);
}

function renderTypes() {
  defineDsMessage();

  return createFrame([
    createRow([
      createMessage({ ...defaultArgs, content: "저장되었습니다.", type: "success" }),
      createMessage({ ...defaultArgs, content: "새 알림이 있습니다.", type: "info" }),
      createMessage({ ...defaultArgs, content: "확인이 필요합니다.", type: "warning" }),
      createMessage({ ...defaultArgs, content: "처리에 실패했습니다.", type: "error" }),
      createMessage({ ...defaultArgs, content: "처리 중입니다.", type: "loading" })
    ])
  ]);
}

function renderClosable() {
  defineDsMessage();

  return createFrame([createMessage({ ...defaultArgs, closable: true, content: "이 메시지는 직접 닫을 수 있습니다." })]);
}

function renderDuration() {
  defineDsMessage();

  const button = document.createElement("button");

  button.className = "ds-message-story-button";
  button.type = "button";
  button.textContent = "메시지 표시";
  button.addEventListener("click", () =>
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

export const Types: Story = {
  render: renderTypes,
  parameters: createDocsDescription(storyDescriptions.types)
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
