import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Notification.stories.css";
import { defineDsButton } from "../Button";
import { defineDsNotification, type NotificationPlacement } from ".";
import {
  createButton,
  createDocsDescription,
  createFrame,
  createNotification,
  createPlacementButtons,
  preventCloseButtonAction
} from "./stories/Notification.storyDom";
import type { NotificationStoryArgs } from "./stories/Notification.storyTypes";

const storyDescriptions = {
  customSemanticDomStyling: "`part`를 사용해 알림 카드의 루트와 제목 영역 스타일을 외부에서 조정합니다.",
  default: "복잡한 안내나 후속 행동을 알려야 할 때 사용하는 기본 알림 카드입니다.",
  placement: "화면 여섯 위치 중 원하는 위치에 전역 알림을 띄울 수 있습니다.",
  progress: "자동 닫힘까지 남은 시간을 진행 바로 보여주는 알림입니다.",
  types: "성공, 정보, 경고, 오류 상태를 서로 다른 아이콘과 색상으로 구분합니다."
};

const defaultArgs = {
  description: "작업이 완료되었으며, 필요한 후속 단계를 확인할 수 있습니다.",
  placement: "topRight",
  showProgress: false,
  title: "알림 제목",
  type: "info"
} satisfies NotificationStoryArgs;

function renderDefault(args: NotificationStoryArgs) {
  defineDsNotification();

  return createFrame([createNotification(args)]);
}

function renderTypes() {
  defineDsNotification();

  return createFrame([
    createNotification({ ...defaultArgs, title: "성공 알림", type: "success" }),
    createNotification({ ...defaultArgs, title: "정보 알림", type: "info" }),
    createNotification({ ...defaultArgs, title: "경고 알림", type: "warning" }),
    createNotification({ ...defaultArgs, title: "오류 알림", type: "error" })
  ]);
}

function renderPlacement() {
  defineDsNotification();
  defineDsButton();

  const placements: NotificationPlacement[] = ["topLeft", "topRight", "bottomLeft", "bottomRight"];

  return createFrame([createPlacementButtons(placements)]);
}

function renderProgress() {
  defineDsNotification();
  defineDsButton();

  return createFrame([
    createButton("진행 알림 표시", {
      description: "진행 바가 닫힘까지 남은 시간을 보여줍니다.",
      duration: 4.5,
      showProgress: true,
      title: "자동 닫힘 알림",
      type: "info"
    })
  ]);
}

function renderCustomSemanticDomStyling() {
  defineDsNotification();

  const notification = createNotification({ ...defaultArgs, title: "스타일이 조정된 알림" });

  notification.className = "ds-notification-story-custom";
  preventCloseButtonAction(notification);

  return createFrame([notification]);
}

const meta: Meta<NotificationStoryArgs> = {
  title: "Components/Feedback/Notification",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Notification은 화면 모서리나 지정 위치에서 복합적인 안내와 후속 정보를 전달하는 피드백 컴포넌트입니다."
      }
    }
  },
  argTypes: {
    placement: {
      control: "select",
      options: ["top", "topLeft", "topRight", "bottom", "bottomLeft", "bottomRight"]
    },
    type: {
      control: "inline-radio",
      options: ["success", "info", "warning", "error"]
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<NotificationStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.default)
};

export const Types: Story = {
  render: renderTypes,
  parameters: createDocsDescription(storyDescriptions.types)
};

export const Placement: Story = {
  render: renderPlacement,
  parameters: createDocsDescription(storyDescriptions.placement)
};

export const Progress: Story = {
  render: renderProgress,
  parameters: createDocsDescription(storyDescriptions.progress)
};

export const CustomSemanticDomStyling: Story = {
  render: renderCustomSemanticDomStyling,
  parameters: createDocsDescription(storyDescriptions.customSemanticDomStyling)
};
