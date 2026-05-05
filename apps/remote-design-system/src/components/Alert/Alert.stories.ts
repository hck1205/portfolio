import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Alert.stories.css";
import { defineDsAlert, type AlertType } from ".";

type AlertStoryArgs = {
  banner: boolean;
  closable: boolean;
  description: string;
  showIcon: boolean;
  title: string;
  type: AlertType;
};

const storyDescriptions = {
  banner: "페이지나 영역 상단에서 긴급하게 알려야 하는 내용을 배너 형태로 표시합니다.",
  closable: "사용자가 직접 닫을 수 있는 알림을 보여주며, 닫힘 동작은 `ds-alert-close` 이벤트로 전달됩니다.",
  customAction: "알림 안에 보조 액션을 배치해 사용자가 바로 후속 작업을 실행할 수 있습니다.",
  customSemanticDomStyling: "`part`를 사용해 루트, 제목처럼 의미가 분리된 DOM 영역을 외부 스타일로 조정하는 예시입니다.",
  default: "가장 기본적인 정보 알림입니다. 짧은 상태 메시지를 명확하게 전달할 때 사용합니다.",
  description: "제목 아래에 설명 문장을 함께 배치해 사용자가 판단에 필요한 맥락을 바로 읽을 수 있습니다.",
  types: "성공, 정보, 경고, 오류 상태를 각각 다른 색상과 아이콘으로 구분합니다."
};

const defaultArgs = {
  banner: false,
  closable: false,
  description: "",
  showIcon: false,
  title: "작업이 정상적으로 저장되었습니다.",
  type: "info"
} satisfies AlertStoryArgs;

function createDocsDescription(story: string) {
  return {
    docs: {
      description: {
        story
      }
    }
  };
}

function createAlert(args: AlertStoryArgs) {
  const alert = document.createElement("ds-alert");

  alert.setAttribute("title", args.title);
  alert.setAttribute("type", args.type);
  alert.toggleAttribute("banner", args.banner);
  alert.toggleAttribute("closable", args.closable);
  alert.toggleAttribute("show-icon", args.showIcon);

  if (args.description) {
    alert.setAttribute("description", args.description);
  }

  return alert;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-alert-story-frame";
  frame.append(...children);

  return frame;
}

function renderDefault(args: AlertStoryArgs) {
  defineDsAlert();

  return createFrame([createAlert(args)]);
}

function renderTypes() {
  defineDsAlert();

  return createFrame([
    createAlert({ ...defaultArgs, showIcon: true, title: "처리가 완료되었습니다.", type: "success" }),
    createAlert({ ...defaultArgs, showIcon: true, title: "새로운 업데이트가 있습니다.", type: "info" }),
    createAlert({ ...defaultArgs, showIcon: true, title: "입력값을 다시 확인해 주세요.", type: "warning" }),
    createAlert({ ...defaultArgs, showIcon: true, title: "요청을 처리하지 못했습니다.", type: "error" })
  ]);
}

function renderDescription() {
  defineDsAlert();

  return createFrame([
    createAlert({
      ...defaultArgs,
      description: "변경 사항은 즉시 반영되며, 필요한 경우 활동 기록에서 이전 상태를 확인할 수 있습니다.",
      showIcon: true,
      title: "설정이 업데이트되었습니다.",
      type: "success"
    })
  ]);
}

function renderClosable() {
  defineDsAlert();

  return createFrame([
    createAlert({
      ...defaultArgs,
      closable: true,
      description: "닫기 버튼을 누르면 알림이 화면에서 제거됩니다.",
      showIcon: true,
      title: "임시 안내 메시지",
      type: "warning"
    })
  ]);
}

function renderBanner() {
  defineDsAlert();

  return createFrame([
    createAlert({
      ...defaultArgs,
      banner: true,
      description: "일부 기능은 점검이 끝난 뒤 다시 사용할 수 있습니다.",
      title: "서비스 점검이 예정되어 있습니다.",
      type: "warning"
    })
  ]);
}

function renderCustomAction() {
  defineDsAlert();

  const alert = createAlert({
    ...defaultArgs,
    description: "삭제된 항목은 30일 동안 보관함에서 복원할 수 있습니다.",
    showIcon: true,
    title: "항목이 삭제되었습니다.",
    type: "info"
  });
  const action = document.createElement("span");

  action.className = "ds-alert-story-action";
  action.slot = "action";
  action.textContent = "되돌리기";
  alert.append(action);

  return createFrame([alert]);
}

function renderCustomSemanticDomStyling() {
  defineDsAlert();

  const alert = createAlert({
    ...defaultArgs,
    description: "외부 스타일에서 의미 DOM 파트를 지정해 제품 맥락에 맞는 강조를 줄 수 있습니다.",
    showIcon: true,
    title: "의미 DOM 스타일링",
    type: "info"
  });

  alert.className = "ds-alert-story-custom";

  return createFrame([alert]);
}

const meta: Meta<AlertStoryArgs> = {
  title: "Components/Feedback/Alert",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Alert는 사용자가 놓치면 안 되는 상태, 경고, 결과 메시지를 화면 안에 고정된 영역으로 전달하는 피드백 컴포넌트입니다."
      }
    }
  },
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["success", "info", "warning", "error"]
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<AlertStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.default)
};

export const Types: Story = {
  render: renderTypes,
  parameters: createDocsDescription(storyDescriptions.types)
};

export const Description: Story = {
  render: renderDescription,
  parameters: createDocsDescription(storyDescriptions.description)
};

export const Closable: Story = {
  render: renderClosable,
  parameters: createDocsDescription(storyDescriptions.closable)
};

export const Banner: Story = {
  render: renderBanner,
  parameters: createDocsDescription(storyDescriptions.banner)
};

export const CustomAction: Story = {
  render: renderCustomAction,
  parameters: createDocsDescription(storyDescriptions.customAction)
};

export const CustomSemanticDomStyling: Story = {
  render: renderCustomSemanticDomStyling,
  parameters: createDocsDescription(storyDescriptions.customSemanticDomStyling)
};
