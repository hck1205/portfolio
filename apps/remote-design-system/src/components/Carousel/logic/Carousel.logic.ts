import type { CarouselDotPlacement, CarouselEffect } from "../types/Carousel.types";

export const CAROUSEL_TRANSITION_FALLBACK_MS = 550;

export type CarouselAxis = "horizontal" | "vertical";
export type CarouselLoopDirection = "backward" | "forward";

type GetCarouselLoopDirectionOptions = {
  count: number;
  currentIndex: number;
  effect: CarouselEffect;
  index: number;
  infinite: boolean;
};

type GetCarouselDragDeltaOptions = {
  axis: CarouselAxis;
  currentX: number;
  currentY: number;
  startX: number;
  startY: number;
};

export function getCarouselAxis(dotPlacement: CarouselDotPlacement): CarouselAxis {
  return dotPlacement === "start" || dotPlacement === "end" ? "vertical" : "horizontal";
}

export function normalizeCarouselIndex(index: number, count: number, infinite: boolean) {
  if (infinite) {
    return ((index % count) + count) % count;
  }

  return Math.min(Math.max(index, 0), count - 1);
}

export function getCarouselLoopDirection({
  count,
  currentIndex,
  effect,
  index,
  infinite
}: GetCarouselLoopDirectionOptions): CarouselLoopDirection | undefined {
  if (effect !== "scrollx" || !infinite || count <= 1) {
    return undefined;
  }

  if (index >= count && currentIndex === count - 1) {
    return "forward";
  }

  if (index < 0 && currentIndex === 0) {
    return "backward";
  }

  return undefined;
}

export function getCarouselDragDelta({
  axis,
  currentX,
  currentY,
  startX,
  startY
}: GetCarouselDragDeltaOptions) {
  return axis === "vertical" ? currentY - startY : currentX - startX;
}
