import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Result.stories.css";
import { defineDsButton } from "../Button";
import { createDsButton } from "../shared/stories/storyElements";
import { defineDsResult, type ResultStatus } from ".";

type ResultStoryArgs = {
  status: ResultStatus;
  subTitle: string;
  title: string;
};

type ResultStoryOverrides = Partial<ResultStoryArgs>;

const RESULT_STATUS_EXAMPLES = [
  "success",
  "info",
  "warning",
  "error",
  "404",
  "500"
] satisfies ResultStatus[];

const storyDescriptions = {
  customSemanticDomStyling: "`part`를 사용해 결과 아이콘과 제목 스타일을 외부에서 조정합니다.",
  default: "작업이 끝난 뒤 사용자가 다음 상태를 이해할 수 있도록 결과를 명확하게 보여줍니다.",
  extra: "결과 화면 아래에 다음 행동을 위한 액션을 배치합니다.",
  status: "성공, 정보, 경고, 오류와 HTTP 상태 결과를 각각 다른 표현으로 표시합니다."
};

const defaultArgs = {
  status: "success",
  subTitle: "변경 사항이 저장되었으며 언제든지 다시 수정할 수 있습니다.",
  title: "작업이 완료되었습니다"
} satisfies ResultStoryArgs;

function createDocsDescription(story: string) {
  return { docs: { description: { story } } };
}

function createResult(args: ResultStoryArgs) {
  const result = document.createElement("ds-result");

  result.setAttribute("status", args.status);
  result.setAttribute("title", args.title);
  result.setAttribute("sub-title", args.subTitle);

  return result;
}

function createResults(items: ResultStoryOverrides[]) {
  return items.map((item) => createResult({ ...defaultArgs, ...item }));
}

function createFrame(...children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-result-story-frame";
  frame.append(...children);

  return frame;
}

function createResultRow(items: ResultStoryOverrides[]) {
  const row = document.createElement("div");

  row.className = "ds-result-story-row";
  row.append(...createResults(items));

  return row;
}

function createExtraButton(label: string) {
  const button = createDsButton({ label, type: "primary" });

  button.className = "ds-result-story-button";
  button.slot = "extra";

  return button;
}

function renderDefault(args: ResultStoryArgs) {
  defineDsResult();

  return createFrame(createResult(args));
}

function renderStatus() {
  defineDsResult();

  return createFrame(
    createResultRow(
      RESULT_STATUS_EXAMPLES.map((status) => ({
        status,
        subTitle: "상태에 맞는 결과 메시지를 표시합니다.",
        title: `${status} 결과`
      }))
    )
  );
}

function renderExtra() {
  defineDsResult();
  defineDsButton();

  const result = createResult(defaultArgs);

  result.append(createExtraButton("대시보드로 이동"));

  return createFrame(result);
}

function renderCustomSemanticDomStyling() {
  defineDsResult();

  const result = createResult({ ...defaultArgs, title: "스타일이 조정된 결과" });

  result.className = "ds-result-story-custom";

  return createFrame(result);
}

const meta: Meta<ResultStoryArgs> = {
  title: "Components/Feedback/Result",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Result는 작업 결과, 예외 상태, 완료 화면처럼 하나의 상태를 화면 중앙에서 명확하게 전달하는 피드백 컴포넌트입니다."
      }
    }
  },
  argTypes: {
    status: {
      control: "select",
      options: ["success", "info", "warning", "error", "403", "404", "500"]
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<ResultStoryArgs>;

export const Default: Story = { parameters: createDocsDescription(storyDescriptions.default) };
export const Status: Story = { render: renderStatus, parameters: createDocsDescription(storyDescriptions.status) };
export const Extra: Story = { render: renderExtra, parameters: createDocsDescription(storyDescriptions.extra) };
export const CustomSemanticDomStyling: Story = {
  render: renderCustomSemanticDomStyling,
  parameters: createDocsDescription(storyDescriptions.customSemanticDomStyling)
};
