import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Image.stories.css";
import { defineDsImage } from ".";

type ImageStoryArgs = {
  alt: string;
  fallback: string;
  height: string;
  mask: boolean;
  placeholder: boolean;
  placeholderSrc: string;
  preview: boolean;
  previewSrc: string;
  src: string;
  width: string;
};

const defaultArgs = {
  alt: "Mountain landscape",
  fallback: "",
  height: "200",
  mask: true,
  placeholder: false,
  placeholderSrc: "",
  preview: true,
  previewSrc: "",
  src: "https://picsum.photos/id/1015/640/420",
  width: "300"
} satisfies ImageStoryArgs;

const brokenImageSrc = "data:image/png;base64,not-a-valid-image";
const fallbackImageSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200" role="img" aria-label="No image fallback">
    <rect width="300" height="200" rx="10" fill="#f5f5f5"/>
    <rect x="18" y="18" width="264" height="164" rx="8" fill="#ffffff" stroke="#d9d9d9" stroke-width="2" stroke-dasharray="8 8"/>
    <path d="M116 121h68l-21-27-16 20-11-13-20 20Z" fill="#d9d9d9"/>
    <circle cx="128" cy="81" r="11" fill="#d9d9d9"/>
    <path d="M108 62h84v76h-84V62Z" fill="none" stroke="#bfbfbf" stroke-width="6" stroke-linejoin="round"/>
    <path d="M100 146 204 54" stroke="#8c8c8c" stroke-width="7" stroke-linecap="round"/>
    <text x="150" y="168" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="#8c8c8c">No image available</text>
  </svg>
`;
const fallbackImageSrc = `data:image/svg+xml,${encodeURIComponent(fallbackImageSvg)}`;

const storyDescriptions = {
  default: "이미지 위에 마우스를 올리거나 클릭하면 확대 미리보기를 열 수 있습니다.",
  fallback: "원본 이미지를 불러오지 못할 때 오류 상태나 대체 이미지를 표시합니다.",
  progressive: "큰 이미지가 로드되는 동안 저해상도 placeholder 이미지를 먼저 보여줍니다.",
  multiple: "여러 이미지를 독립적인 미리보기 상태를 가진 갤러리로 구성합니다.",
  previewFromOneImage: "한 장의 썸네일에서 더 큰 미리보기 이미지를 엽니다.",
  customPreviewImage: "화면에 보이는 이미지와 미리보기에서 열리는 이미지를 다르게 지정합니다.",
  previewMask: "이미지 위에 마우스를 올렸을 때 미리보기 마스크와 진입 버튼을 표시합니다.",
  customSemanticDomStyling: "공개된 semantic part를 사용해 이미지 프레임, 마스크, 미리보기 도구 영역의 스타일을 조정합니다.",
  mask: "미리보기 마스크를 비활성화해 이미지 위 오버레이 없이 표시합니다."
};

function ensureImageDefined() {
  defineDsImage();
}

function createImage(args: ImageStoryArgs) {
  const element = document.createElement("ds-image");

  element.setAttribute("alt", args.alt);
  element.setAttribute("height", args.height);
  element.setAttribute("mask", String(args.mask));
  element.setAttribute("placeholder", String(args.placeholder));
  element.setAttribute("preview", String(args.preview));
  element.setAttribute("src", args.src);
  element.setAttribute("width", args.width);

  if (args.fallback) {
    element.setAttribute("fallback", args.fallback);
  }

  if (args.previewSrc) {
    element.setAttribute("preview-src", args.previewSrc);
  }

  if (args.placeholderSrc) {
    element.setAttribute("placeholder-src", args.placeholderSrc);
  }

  return element;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-image-story-frame";
  frame.append(...children);

  return frame;
}

function createGrid(children: HTMLElement[]) {
  const grid = document.createElement("div");

  grid.className = "ds-image-story-grid";
  grid.append(...children);

  return grid;
}

function createCard(child: HTMLElement) {
  const card = document.createElement("div");

  card.className = "ds-image-story-card";
  card.append(child);

  return card;
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

function renderDefault(args: ImageStoryArgs) {
  ensureImageDefined();

  return createFrame([createImage(args)]);
}

function renderGallery() {
  ensureImageDefined();

  return createFrame([
    createGrid(
      [1015, 1025, 1035].map((id) =>
        createCard(
          createImage({
            ...defaultArgs,
            alt: `Gallery image ${id}`,
            height: "150",
            src: `https://picsum.photos/id/${id}/480/320`,
            width: "200"
          })
        )
      )
    )
  ]);
}

function renderCustomSemanticDomStyling() {
  ensureImageDefined();

  const image = createImage({
    ...defaultArgs,
    alt: "Styled mountain landscape",
    height: "220",
    src: "https://picsum.photos/id/1036/680/440",
    width: "340"
  });

  image.classList.add("ds-image-story-semantic");

  return createFrame([image]);
}

const meta: Meta<ImageStoryArgs> = {
  title: "Components/Data Display/Image",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Image는 이미지 표시, 오류 대체 처리, 점진적 로딩 placeholder, 미리보기 마스크, 확대와 회전을 제공하는 미리보기 도구막대를 함께 제공합니다."
      }
    }
  },
  argTypes: {
    alt: { control: "text" },
    fallback: { control: "text" },
    height: { control: "text" },
    mask: { control: "boolean" },
    placeholder: { control: "boolean" },
    placeholderSrc: { control: "text" },
    preview: { control: "boolean" },
    previewSrc: { control: "text" },
    src: { control: "text" },
    width: { control: "text" }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<ImageStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.default)
};

export const FaultTolerant: Story = {
  args: {
    alt: "Broken image",
    fallback: fallbackImageSrc,
    src: brokenImageSrc
  },
  parameters: createDocsDescription(storyDescriptions.fallback)
};

export const ProgressiveLoading: Story = {
  args: {
    placeholder: true,
    placeholderSrc: "https://picsum.photos/id/1043/60/40",
    src: "https://picsum.photos/id/1043/1200/800"
  },
  parameters: createDocsDescription(storyDescriptions.progressive)
};

export const MultipleImagePreview: Story = {
  name: "Multiple image preview",
  render: renderGallery,
  parameters: createDocsDescription(storyDescriptions.multiple)
};

export const PreviewFromOneImage: Story = {
  name: "Preview from one image",
  args: {
    alt: "Preview thumbnail",
    height: "200",
    previewSrc: "https://picsum.photos/id/1015/1200/800",
    src: "https://picsum.photos/id/1015/320/214",
    width: "300"
  },
  parameters: createDocsDescription(storyDescriptions.previewFromOneImage)
};

export const CustomPreviewImage: Story = {
  name: "Custom preview image",
  args: {
    alt: "Custom preview image",
    height: "200",
    previewSrc: "https://picsum.photos/id/1039/1200/800",
    src: "https://picsum.photos/id/1015/640/420",
    width: "300"
  },
  parameters: createDocsDescription(storyDescriptions.customPreviewImage)
};

export const PreviewMask: Story = {
  name: "preview mask",
  args: {
    mask: true,
    preview: true
  },
  parameters: createDocsDescription(storyDescriptions.previewMask)
};

export const CustomSemanticDomStyling: Story = {
  name: "Custom semantic dom styling",
  render: renderCustomSemanticDomStyling,
  parameters: createDocsDescription(storyDescriptions.customSemanticDomStyling)
};

export const NoMask: Story = {
  args: {
    mask: false
  },
  parameters: createDocsDescription(storyDescriptions.mask)
};
