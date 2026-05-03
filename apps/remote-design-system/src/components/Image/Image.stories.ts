import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Image.stories.css";
import { defineDsImage } from ".";

type ImageStoryArgs = {
  alt: string;
  fallback: string;
  height: string;
  mask: boolean;
  placeholder: boolean;
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
  preview: true,
  previewSrc: "",
  src: "https://picsum.photos/id/1015/640/420",
  width: "300"
} satisfies ImageStoryArgs;

const storyDescriptions = {
  default: "Click or hover the image to open a zoomable preview.",
  fallback: "Fallback content is displayed when the source cannot be loaded.",
  progressive: "Placeholder keeps the frame stable while the image loads.",
  multiple: "Images can be composed into simple galleries with independent previews.",
  mask: "Preview mask can be dimmed or disabled."
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

const meta: Meta<ImageStoryArgs> = {
  title: "Components/Data Display/Image",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Image displays preview-able pictures with fault-tolerant fallback, stable placeholders, a hover preview mask, and a lightweight preview toolbar for zoom and rotation."
      }
    }
  },
  argTypes: {
    alt: { control: "text" },
    fallback: { control: "text" },
    height: { control: "text" },
    mask: { control: "boolean" },
    placeholder: { control: "boolean" },
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
    fallback: "",
    src: "https://example.invalid/not-found.png"
  },
  parameters: createDocsDescription(storyDescriptions.fallback)
};

export const ProgressiveLoading: Story = {
  args: {
    placeholder: true,
    src: "https://picsum.photos/id/1043/1200/800"
  },
  parameters: createDocsDescription(storyDescriptions.progressive)
};

export const Gallery: Story = {
  render: renderGallery,
  parameters: createDocsDescription(storyDescriptions.multiple)
};

export const NoMask: Story = {
  args: {
    mask: false
  },
  parameters: createDocsDescription(storyDescriptions.mask)
};
