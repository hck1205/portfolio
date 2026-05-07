import type { Meta, StoryObj } from "@storybook/web-components-vite";
import clsx from "classnames";

import "./Descriptions.stories.css";
import { defineDsDescriptions, type DescriptionsLayout, type DescriptionsSize } from ".";

type DescriptionsStoryArgs = {
  bordered: boolean;
  colon: boolean;
  column: number;
  layout: DescriptionsLayout;
  size: DescriptionsSize;
  title: string;
};

const defaultArgs = {
  bordered: false,
  colon: true,
  column: 3,
  layout: "horizontal",
  size: "middle",
  title: "사용자 정보"
} satisfies DescriptionsStoryArgs;

const storyDescriptions = {
  default: "읽기 전용 정보를 라벨과 값의 쌍으로 묶어 명확하게 보여줍니다.",
  bordered: "테두리가 있는 형태는 1px 구분선과 은은한 라벨 배경으로 정보를 표처럼 정리합니다.",
  responsive: "넓은 화면에서는 여러 항목을 한 줄에 정리하고, 좁은 화면에서는 각 항목이 읽기 좋은 단일 열로 자연스럽게 재배치됩니다.",
  vertical: "세로 레이아웃은 각 라벨을 값 위에 배치해 좁은 영역에서도 정보를 안정적으로 보여줍니다.",
  sizes: "작게, 보통, 크게 크기를 조정해 같은 사용 방식으로 셀의 밀도를 바꿀 수 있습니다.",
  span: "항목 폭 설정과 채움 항목을 사용해 긴 설명이 필요한 값을 더 넓은 행으로 표시할 수 있습니다.",
  extra: "제목 오른쪽의 extra 슬롯을 사용해 수정, 링크, 상태 같은 보조 액션을 배치할 수 있습니다.",
  semantic: "의미 영역 part를 사용해 제목, 액션 영역, 라벨, 콘텐츠 스타일을 필요한 범위만 맞춤 설정할 수 있습니다."
};

const baseItems = [
  ["사용자명", "김민준"],
  ["전화번호", "010-1234-5678"],
  ["거주지", "서울, 대한민국"],
  ["비고", "활성 고객"],
  ["주소", "서울특별시 강남구 테헤란로 12"],
  ["상태", "운영 중"]
] as const;

function ensureDescriptionsDefined() {
  defineDsDescriptions();
}

function createItem(label: string, content: string | Node, span?: number | "filled") {
  const item = document.createElement("ds-descriptions-item");

  item.setAttribute("label", label);

  if (span !== undefined) {
    item.setAttribute("span", String(span));
  }

  if (typeof content === "string") {
    item.textContent = content;
  } else {
    item.append(content);
  }

  return item;
}

function createMultilineContent(lines: string[]) {
  const content = document.createElement("span");

  for (const line of lines) {
    const lineElement = document.createElement("span");

    lineElement.textContent = line;
    content.append(lineElement, document.createElement("br"));
  }

  content.lastChild?.remove();

  return content;
}

function createStatus(text: string) {
  const status = document.createElement("span");

  status.className = "ds-descriptions-story-status";
  status.textContent = text;

  return status;
}

function createDescriptions(args: DescriptionsStoryArgs, items: HTMLElement[] = createBaseItems()) {
  const element = document.createElement("ds-descriptions");

  element.setAttribute("colon", String(args.colon));
  element.setAttribute("column", String(args.column));
  element.setAttribute("layout", args.layout);
  element.setAttribute("size", args.size);
  element.setAttribute("title", args.title);
  element.toggleAttribute("bordered", args.bordered);
  element.append(...items);

  return element;
}

function createBaseItems() {
  return baseItems.map(([label, content]) => createItem(label, content));
}

function createFrame(children: HTMLElement[], className?: string) {
  const frame = document.createElement("div");

  frame.className = clsx("ds-descriptions-story-frame", className);
  frame.append(...children);

  return frame;
}

function createStack(children: HTMLElement[]) {
  const stack = document.createElement("div");

  stack.className = "ds-descriptions-story-stack";
  stack.append(...children);

  return stack;
}

function createDocsDescription(story: string) {
  return {
    docs: {
      description: {
        story
      }
    }
  };
}

function renderDefault(args: DescriptionsStoryArgs) {
  ensureDescriptionsDefined();

  return createFrame([createDescriptions(args)]);
}

function renderBordered(args: DescriptionsStoryArgs) {
  ensureDescriptionsDefined();

  const status = createStatus("운영 중");
  const frame = createFrame([
    createDescriptions(
      { ...args, bordered: true, column: 4, title: "상품 정보" },
      [
        createItem("상품", "클라우드 데이터베이스"),
        createItem("결제 방식", "선불"),
        createItem("자동 갱신", "사용"),
        createItem("주문 시간", "2018-04-24 18:00:00"),
        createItem("이용 기간", "2019-04-24 18:00:00", 2),
        createItem("상태", status, 2),
        createItem("협의 금액", "$80.00"),
        createItem("할인", "$20.00"),
        createItem("공식 영수증", "$60.00"),
        createItem(
          "설정 정보",
          createMultilineContent([
            "데이터 디스크 유형: MongoDB",
            "데이터베이스 버전: 3.4",
            "패키지: dds.mongo.mid",
            "저장 공간: 10 GB",
            "복제 계수: 3",
            "리전: 중국 동부 1"
          ])
        )
      ]
    )
  ], "ds-descriptions-story-bordered-frame");

  return frame;
}

function renderResponsiveDescriptions(args: DescriptionsStoryArgs) {
  ensureDescriptionsDefined();

  const status = createStatus("운영 중");
  const descriptions = createDescriptions(
    { ...args, bordered: true, column: 4, title: "서비스 상태", size: "middle" },
    [
      createItem("서비스", "주문 API"),
      createItem("환경", "프로덕션"),
      createItem("담당 팀", "플랫폼 운영"),
      createItem("리전", "한국 중부"),
      createItem("현재 상태", status, 2),
      createItem("최근 배포", "2026-05-04 09:30:00", 2),
      createItem("응답 시간", "평균 124ms", 2),
      createItem("가용성", "최근 30일 99.98%", 2),
      createItem(
        "운영 메모",
        createMultilineContent([
          "평일 트래픽 피크 시간대 자동 확장 사용",
          "장애 알림은 슬랙 #platform-alert 채널로 전송",
          "정기 점검 창: 매월 첫째 주 화요일 02:00"
        ]),
        "filled"
      )
    ]
  );
  const extra = document.createElement("span");

  descriptions.classList.add("ds-descriptions-story-responsive");
  extra.slot = "extra";
  extra.textContent = "실시간 동기화";
  descriptions.append(extra);

  return createFrame([descriptions], "ds-descriptions-story-responsive-frame");
}

function renderSizes() {
  ensureDescriptionsDefined();

  return createFrame([
    createStack([
      createDescriptions({ ...defaultArgs, size: "small", title: "작게", bordered: true }, createBaseItems().slice(0, 3)),
      createDescriptions({ ...defaultArgs, size: "middle", title: "보통", bordered: true }, createBaseItems().slice(0, 3)),
      createDescriptions({ ...defaultArgs, size: "large", title: "크게", bordered: true }, createBaseItems().slice(0, 3))
    ])
  ]);
}

function renderWithExtra(args: DescriptionsStoryArgs) {
  ensureDescriptionsDefined();

  const descriptions = createDescriptions(args);
  const actions = document.createElement("span");
  const edit = document.createElement("a");

  actions.className = "ds-descriptions-story-actions";
  actions.slot = "extra";
  edit.className = "ds-descriptions-story-link";
  edit.href = "#";
  edit.textContent = "수정";
  actions.append(edit);
  descriptions.append(actions);

  return createFrame([descriptions]);
}

function renderCustomSemanticDomStyling(args: DescriptionsStoryArgs) {
  ensureDescriptionsDefined();

  const descriptions = createDescriptions(
    { ...args, bordered: true, title: "맞춤 상세 정보" },
    [
      createItem("서비스", "클라우드 데이터베이스"),
      createItem("결제 방식", "선불"),
      createItem("상태", "활성"),
      createItem("담당 팀", "플랫폼 운영"),
      createItem("리전", "한국 중부"),
      createItem("설정", "고가용성 구성, 자동 백업 사용", "filled")
    ]
  );
  const extra = document.createElement("span");

  descriptions.classList.add("ds-descriptions-story-semantic");
  extra.slot = "extra";
  extra.textContent = "검토 완료";
  descriptions.append(extra);

  return createFrame([descriptions]);
}

const meta: Meta<DescriptionsStoryArgs> = {
  title: "Components/Data Display/Descriptions",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Descriptions는 여러 읽기 전용 필드를 그룹화된 상세 정보 레이아웃으로 보여줍니다. 테두리 셀, 가로 및 세로 레이아웃, 반응형 컬럼, 항목 폭 설정, 크기, 제목, 추가 액션 슬롯을 지원합니다."
      }
    }
  },
  argTypes: {
    bordered: { control: "boolean" },
    colon: { control: "boolean" },
    column: { control: { type: "number", min: 1, max: 6 } },
    layout: {
      control: "inline-radio",
      options: ["horizontal", "vertical"]
    },
    size: {
      control: "inline-radio",
      options: ["small", "middle", "large"]
    },
    title: { control: "text" }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<DescriptionsStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.default)
};

export const Bordered: Story = {
  render: renderBordered,
  parameters: createDocsDescription(storyDescriptions.bordered)
};

export const ResponsiveDescriptions: Story = {
  name: "Responsive Descriptions",
  render: renderResponsiveDescriptions,
  parameters: createDocsDescription(storyDescriptions.responsive)
};

export const Vertical: Story = {
  args: {
    bordered: true,
    layout: "vertical",
    title: "세로 상세 정보"
  },
  parameters: createDocsDescription(storyDescriptions.vertical)
};

export const Sizes: Story = {
  render: renderSizes,
  parameters: createDocsDescription(storyDescriptions.sizes)
};

export const Extra: Story = {
  render: renderWithExtra,
  parameters: createDocsDescription(storyDescriptions.extra)
};

export const CustomSemanticDomStyling: Story = {
  name: "Custom semantic dom styling",
  render: renderCustomSemanticDomStyling,
  parameters: createDocsDescription(storyDescriptions.semantic)
};
