import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Carousel.stories.css";
import { defineDsCarousel, type CarouselDotPlacement, type CarouselEffect } from ".";

type CarouselStoryArgs = {
  arrows: boolean;
  autoplay: boolean;
  autoplaySpeed: number;
  dotPlacement: CarouselDotPlacement;
  dots: boolean;
  draggable: boolean;
  effect: CarouselEffect;
  infinite: boolean;
};

const defaultArgs = {
  arrows: false,
  autoplay: false,
  autoplaySpeed: 3000,
  dotPlacement: "bottom",
  dots: true,
  draggable: false,
  effect: "scrollx",
  infinite: true
} satisfies CarouselStoryArgs;

const storyDescriptions = {
  arrows: "arrows 속성으로 이전/다음 버튼을 표시합니다.",
  autoplay: "autoplay와 autoplay-speed로 자동 전환을 제어합니다.",
  basic: "Carousel은 같은 수준의 콘텐츠 묶음을 제한된 공간에서 순환 표시합니다.",
  fade: "effect=fade로 슬라이드가 겹쳐서 전환되게 할 수 있습니다.",
  placement: "dot-placement로 indicator 위치를 조정합니다."
};

function ensureCarouselDefined() {
  defineDsCarousel();
}

function createCarousel(args: Partial<CarouselStoryArgs> = {}) {
  const mergedArgs = { ...defaultArgs, ...args };
  const carousel = document.createElement("ds-carousel");

  carousel.setAttribute("arrows", String(mergedArgs.arrows));
  carousel.setAttribute("autoplay", String(mergedArgs.autoplay));
  carousel.setAttribute("autoplay-speed", String(mergedArgs.autoplaySpeed));
  carousel.setAttribute("dot-placement", mergedArgs.dotPlacement);
  carousel.setAttribute("dots", String(mergedArgs.dots));
  carousel.setAttribute("draggable", String(mergedArgs.draggable));
  carousel.setAttribute("effect", mergedArgs.effect);
  carousel.setAttribute("infinite", String(mergedArgs.infinite));
  carousel.append(...[1, 2, 3, 4].map(createSlide));

  return carousel;
}

function createSlide(index: number) {
  const slide = document.createElement("section");

  slide.className = "ds-carousel-story-slide";
  slide.textContent = String(index);

  return slide;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-carousel-story-frame";
  frame.append(...children);

  return frame;
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

function renderDefault(args: CarouselStoryArgs) {
  ensureCarouselDefined();

  return createFrame([createCarousel(args)]);
}

const meta: Meta<CarouselStoryArgs> = {
  title: "Components/Data Display/Carousel",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Carousel은 이미지나 카드처럼 같은 수준의 콘텐츠를 순환 표시하는 Data Display 컴포넌트입니다. Ant Design의 dots, dot placement, autoplay, fade, arrows, draggable 패턴을 Web Component API로 제공합니다."
      }
    }
  },
  argTypes: {
    dotPlacement: {
      control: "inline-radio",
      options: ["bottom", "top", "start", "end"]
    },
    effect: {
      control: "inline-radio",
      options: ["scrollx", "fade"]
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<CarouselStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.basic)
};

export const Autoplay: Story = {
  args: { autoplay: true, autoplaySpeed: 1800 },
  parameters: createDocsDescription(storyDescriptions.autoplay)
};

export const Arrows: Story = {
  args: { arrows: true },
  parameters: createDocsDescription(storyDescriptions.arrows)
};

export const Fade: Story = {
  args: { effect: "fade" },
  parameters: createDocsDescription(storyDescriptions.fade)
};

export const DotPlacement: Story = {
  args: { dotPlacement: "end" },
  parameters: createDocsDescription(storyDescriptions.placement)
};
