import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Drawer.stories.css";
import { defineDsDrawer, type DrawerPlacement } from ".";

type DrawerStoryArgs = {
  closable: boolean;
  mask: boolean;
  placement: DrawerPlacement;
  title: string;
};

const storyDescriptions = {
  customPlacement: "왼쪽, 오른쪽, 위, 아래 가장자리에서 열리는 배치 방식을 한 화면에서 확인합니다.",
  customSemanticDomStyling: "`part`를 통해 패널과 제목 영역의 의미 DOM을 외부 스타일로 조정하는 예시입니다.",
  default: "오른쪽 가장자리에서 열리는 기본 드로어입니다. 보조 작업이나 상세 정보를 현재 화면 위에 보여줍니다.",
  extraActions: "헤더와 푸터 슬롯에 보조 액션을 넣어 드로어 안에서 확인, 취소 같은 흐름을 구성합니다.",
  noMask: "배경 마스크 없이 패널만 열어 주변 화면을 계속 볼 수 있는 상태를 보여줍니다."
};

const defaultArgs = {
  closable: true,
  mask: true,
  placement: "right",
  title: "상세 정보"
} satisfies DrawerStoryArgs;

function createDocsDescription(story: string) {
  return {
    docs: {
      description: {
        story
      }
    }
  };
}

function createTrigger(label: string, drawer: HTMLElement) {
  const button = document.createElement("button");

  button.className = "ds-drawer-story-button";
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", () => drawer.setAttribute("open", "true"));

  return button;
}

function createDrawer(args: DrawerStoryArgs, content = "선택한 항목의 상세 정보와 다음 작업을 이 영역에서 확인할 수 있습니다.") {
  const drawer = document.createElement("ds-drawer");
  const body = document.createElement("div");

  drawer.setAttribute("title", args.title);
  drawer.setAttribute("placement", args.placement);
  drawer.toggleAttribute("closable", args.closable);
  drawer.toggleAttribute("mask", args.mask);
  body.className = "ds-drawer-story-content";
  body.innerHTML = `<strong>드로어 콘텐츠</strong><span>${content}</span>`;
  drawer.append(body);

  return drawer;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-drawer-story-frame";
  frame.append(...children);

  return frame;
}

function renderDefault(args: DrawerStoryArgs) {
  defineDsDrawer();

  const drawer = createDrawer(args);

  return createFrame([createTrigger("드로어 열기", drawer), drawer]);
}

function renderPlacements() {
  defineDsDrawer();

  const placements: DrawerPlacement[] = ["left", "right", "top", "bottom"];
  const children = placements.flatMap((placement) => {
    const drawer = createDrawer({ ...defaultArgs, placement, title: `${placement} 드로어` });

    return [createTrigger(`${placement} 열기`, drawer), drawer];
  });

  return createFrame(children);
}

function renderExtraActions() {
  defineDsDrawer();

  const drawer = createDrawer({
    ...defaultArgs,
    title: "설정 변경"
  });
  const footerCancel = document.createElement("button");
  const footerConfirm = document.createElement("button");
  const extra = document.createElement("button");

  footerCancel.className = "ds-drawer-story-footer-button";
  footerConfirm.className = "ds-drawer-story-button";
  extra.className = "ds-drawer-story-footer-button";
  footerCancel.slot = "footer";
  footerConfirm.slot = "footer";
  extra.slot = "extra";
  footerCancel.textContent = "취소";
  footerConfirm.textContent = "저장";
  extra.textContent = "도움말";
  drawer.append(extra, footerCancel, footerConfirm);

  return createFrame([createTrigger("설정 열기", drawer), drawer]);
}

function renderNoMask() {
  defineDsDrawer();

  const drawer = createDrawer({ ...defaultArgs, mask: false, title: "마스크 없는 드로어" });

  return createFrame([createTrigger("마스크 없이 열기", drawer), drawer]);
}

function renderCustomSemanticDomStyling() {
  defineDsDrawer();

  const drawer = createDrawer({ ...defaultArgs, title: "스타일이 조정된 드로어" });

  drawer.className = "ds-drawer-story-custom";

  return createFrame([createTrigger("스타일 예시 열기", drawer), drawer]);
}

const meta: Meta<DrawerStoryArgs> = {
  title: "Components/Feedback/Drawer",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Drawer는 현재 화면 흐름을 유지하면서 가장자리에서 보조 패널을 열어 상세 정보나 후속 작업을 제공하는 피드백 컴포넌트입니다."
      }
    }
  },
  argTypes: {
    placement: {
      control: "inline-radio",
      options: ["left", "right", "top", "bottom"]
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<DrawerStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.default)
};

export const CustomPlacement: Story = {
  render: renderPlacements,
  parameters: createDocsDescription(storyDescriptions.customPlacement)
};

export const ExtraActions: Story = {
  render: renderExtraActions,
  parameters: createDocsDescription(storyDescriptions.extraActions)
};

export const NoMask: Story = {
  render: renderNoMask,
  parameters: createDocsDescription(storyDescriptions.noMask)
};

export const CustomSemanticDomStyling: Story = {
  render: renderCustomSemanticDomStyling,
  parameters: createDocsDescription(storyDescriptions.customSemanticDomStyling)
};
