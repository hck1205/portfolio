import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Avatar.stories.css";
import { defineDsAvatar, type AvatarFit, type AvatarShape, type AvatarSize } from ".";

type AvatarStoryArgs = {
  alt: string;
  fit: AvatarFit;
  gap: number;
  icon: string;
  shape: AvatarShape;
  size: AvatarSize;
  src: string;
  text: string;
};

const defaultArgs = {
  alt: "Avatar image",
  fit: "cover",
  gap: 4,
  icon: "",
  shape: "circle",
  size: "middle",
  src: "",
  text: "U"
} satisfies AvatarStoryArgs;

const storyDescriptions = {
  autosize: "글자 수가 많아질 때 gap 값을 기준으로 폰트 크기를 자동 조정합니다.",
  basic: "Avatar는 사용자나 대상을 이미지, 아이콘, 문자로 표현합니다.",
  group: "Avatar.Group은 여러 사용자를 겹쳐서 압축된 형태로 보여줍니다.",
  shape: "circle과 square 두 가지 형태를 제공합니다.",
  size: "small, middle, large 크기를 제공합니다.",
  type: "이미지, 아이콘, 문자 타입을 함께 확인합니다."
};

function ensureAvatarDefined() {
  defineDsAvatar();
}

function createAvatar(args: Partial<AvatarStoryArgs> = {}) {
  const mergedArgs = { ...defaultArgs, ...args };
  const avatar = document.createElement("ds-avatar");

  avatar.setAttribute("alt", mergedArgs.alt);
  avatar.setAttribute("fit", mergedArgs.fit);
  avatar.setAttribute("gap", String(mergedArgs.gap));
  avatar.setAttribute("shape", mergedArgs.shape);
  avatar.setAttribute("size", mergedArgs.size);
  syncOptionalAttribute(avatar, "icon", mergedArgs.icon);
  syncOptionalAttribute(avatar, "src", mergedArgs.src);
  syncOptionalAttribute(avatar, "text", mergedArgs.text);

  return avatar;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-avatar-story-frame";
  frame.append(...children);

  return frame;
}

function createStack(children: HTMLElement[]) {
  const stack = document.createElement("div");

  stack.className = "ds-avatar-story-stack";
  stack.append(...children);

  return stack;
}

function createLabeledRow(label: string, children: HTMLElement[]) {
  const row = document.createElement("div");
  const labelElement = document.createElement("span");

  row.className = "ds-avatar-story-row";
  labelElement.className = "ds-avatar-story-label";
  labelElement.textContent = label;
  row.append(labelElement, ...children);

  return row;
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

function renderDefault(args: AvatarStoryArgs) {
  ensureAvatarDefined();

  return createFrame([createAvatar(args)]);
}

function renderTypeStory() {
  ensureAvatarDefined();

  return createFrame([
    createAvatar({ text: "김" }),
    createAvatar({ icon: "user", text: "" }),
    createAvatar({ src: "https://xsgames.co/randomusers/avatar.php?g=pixel", text: "" })
  ]);
}

function renderShapeStory() {
  ensureAvatarDefined();

  return createFrame([
    createAvatar({ shape: "circle", text: "A" }),
    createAvatar({ shape: "square", text: "A" }),
    createAvatar({ icon: "user", shape: "square", text: "" })
  ]);
}

function renderSizeStory() {
  ensureAvatarDefined();

  return createFrame((["small", "middle", "large"] as AvatarSize[]).map((size) => createAvatar({ size, text: "U" })));
}

function renderAutosizeStory() {
  ensureAvatarDefined();

  return createFrame([
    createStack([
      createLabeledRow("gap 4", [
        createAvatar({ gap: 4, text: "USER" }),
        createAvatar({ gap: 4, shape: "square", text: "KOREA" })
      ]),
      createLabeledRow("gap 8", [
        createAvatar({ gap: 8, text: "USER" }),
        createAvatar({ gap: 8, shape: "square", text: "KOREA" })
      ])
    ])
  ]);
}

function renderGroupStory() {
  ensureAvatarDefined();

  const group = document.createElement("ds-avatar-group");

  group.setAttribute("max-count", "3");
  group.append(
    createAvatar({ text: "A" }),
    createAvatar({ src: "https://xsgames.co/randomusers/avatar.php?g=female", text: "" }),
    createAvatar({ shape: "square", text: "K" }),
    createAvatar({ text: "M" }),
    createAvatar({ text: "+2" })
  );

  return createFrame([group]);
}

function syncOptionalAttribute(element: HTMLElement, name: string, value: string) {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
}

const meta: Meta<AvatarStoryArgs> = {
  title: "Components/Data Display/Avatar",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Avatar는 사용자나 대상을 이미지, 아이콘, 문자로 표현하는 Data Display 컴포넌트입니다. Ant Design의 image, icon, character, group, shape, size 패턴을 Web Component API로 제공합니다."
      }
    }
  },
  argTypes: {
    fit: {
      control: "inline-radio",
      options: ["cover", "contain"]
    },
    gap: {
      control: { min: 0, type: "number" }
    },
    shape: {
      control: "inline-radio",
      options: ["circle", "square"]
    },
    size: {
      control: "inline-radio",
      options: ["small", "middle", "large"]
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<AvatarStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.basic)
};

export const Type: Story = {
  render: renderTypeStory,
  parameters: createDocsDescription(storyDescriptions.type)
};

export const Shape: Story = {
  render: renderShapeStory,
  parameters: createDocsDescription(storyDescriptions.shape)
};

export const Size: Story = {
  render: renderSizeStory,
  parameters: createDocsDescription(storyDescriptions.size)
};

export const AutosetFontSize: Story = {
  render: renderAutosizeStory,
  parameters: createDocsDescription(storyDescriptions.autosize)
};

export const Group: Story = {
  render: renderGroupStory,
  parameters: createDocsDescription(storyDescriptions.group)
};
