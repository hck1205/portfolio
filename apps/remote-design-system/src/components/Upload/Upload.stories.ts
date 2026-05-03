import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Upload.stories.css";
import { defineDsUpload, type UploadListType } from ".";

type UploadStoryArgs = {
  accept: string;
  directory: boolean;
  disabled: boolean;
  drag: boolean;
  hint: string;
  listType: UploadListType;
  maxCount?: number;
  multiple: boolean;
  showUploadList: boolean;
  text: string;
};

const defaultArgs = {
  accept: "",
  directory: false,
  disabled: false,
  drag: false,
  hint: "Support for a single or bulk upload.",
  listType: "text",
  maxCount: undefined,
  multiple: false,
  showUploadList: true,
  text: "Click to Upload"
} satisfies UploadStoryArgs;

const storyDescriptions = {
  default: "기본 Upload는 버튼을 눌러 파일 선택 창을 열고 선택한 파일 목록을 표시합니다.",
  drag: "drag 상태에서는 점선 영역에 파일을 드래그 앤 드롭할 수 있습니다.",
  multiple: "multiple과 max-count로 여러 파일 선택과 최대 개수를 제한합니다.",
  listType: "picture, picture-card, picture-circle 목록 표현을 확인합니다.",
  disabled: "disabled 상태에서는 파일 선택과 드래그 앤 드롭이 막힙니다."
};

function ensureUploadDefined() {
  defineDsUpload();
}

function createUpload(args: UploadStoryArgs) {
  const element = document.createElement("ds-upload");

  element.setAttribute("accept", args.accept);
  element.setAttribute("hint", args.hint);
  element.setAttribute("list-type", args.listType);
  element.setAttribute("show-upload-list", String(args.showUploadList));
  element.setAttribute("text", args.text);
  element.toggleAttribute("directory", args.directory);
  element.toggleAttribute("disabled", args.disabled);
  element.toggleAttribute("drag", args.drag);
  element.toggleAttribute("multiple", args.multiple);

  if (args.maxCount !== undefined) {
    element.setAttribute("max-count", String(args.maxCount));
  }

  return element;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-upload-story-frame";
  frame.append(...children);

  return frame;
}

function createStack(children: HTMLElement[]) {
  const stack = document.createElement("div");

  stack.className = "ds-upload-story-stack";
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

function renderDefault(args: UploadStoryArgs) {
  ensureUploadDefined();

  return createFrame([createUpload(args)]);
}

function renderListTypeStory() {
  ensureUploadDefined();

  return createFrame([
    createStack([
      createUpload({ ...defaultArgs, listType: "picture", text: "Picture list" }),
      createUpload({ ...defaultArgs, listType: "picture-card", text: "Picture card" }),
      createUpload({ ...defaultArgs, listType: "picture-circle", text: "Picture circle" })
    ])
  ]);
}

const meta: Meta<UploadStoryArgs> = {
  title: "Components/Data Entry/Upload",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Upload는 파일 선택과 드래그 앤 드롭으로 업로드 대상 파일 목록을 구성하는 Data Entry 컴포넌트입니다. multiple, max-count, directory, drag, list-type, disabled와 파일 목록 변경 이벤트를 Web Component API로 제공합니다."
      }
    }
  },
  argTypes: {
    accept: { control: "text" },
    directory: { control: "boolean" },
    disabled: { control: "boolean" },
    drag: { control: "boolean" },
    hint: { control: "text" },
    listType: {
      control: "inline-radio",
      options: ["text", "picture", "picture-card", "picture-circle"]
    },
    maxCount: { control: "number" },
    multiple: { control: "boolean" },
    showUploadList: { control: "boolean" },
    text: { control: "text" }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<UploadStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.default)
};

export const Drag: Story = {
  args: {
    drag: true,
    hint: "Support for a single or bulk upload. Do not upload sensitive files.",
    multiple: true,
    text: "Click or drag file to this area to upload"
  },
  parameters: createDocsDescription(storyDescriptions.drag)
};

export const Multiple: Story = {
  args: { maxCount: 3, multiple: true, text: "Upload up to 3 files" },
  parameters: createDocsDescription(storyDescriptions.multiple)
};

export const ListType: Story = {
  render: renderListTypeStory,
  parameters: createDocsDescription(storyDescriptions.listType)
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: createDocsDescription(storyDescriptions.disabled)
};
