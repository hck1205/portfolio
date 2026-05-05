import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, createElement as createLucideElement } from "lucide";

import type { CarouselAxis } from "../logic/Carousel.logic";

export type CarouselElements = {
  dotsElement: HTMLOListElement;
  nextButton: HTMLButtonElement;
  prevButton: HTMLButtonElement;
  rootElement: HTMLDivElement;
  slotElement: HTMLSlotElement;
  trackElement: HTMLDivElement;
  viewportElement: HTMLDivElement;
};

type CreateCarouselElementsOptions = {
  onNext: () => void;
  onPointerDown: (event: PointerEvent) => void;
  onPointerUp: (event: PointerEvent) => void;
  onPrev: () => void;
  onSlotChange: () => void;
};

export function createCarouselElements({
  onNext,
  onPointerDown,
  onPointerUp,
  onPrev,
  onSlotChange
}: CreateCarouselElementsOptions): CarouselElements {
  const rootElement = document.createElement("div");
  const viewportElement = document.createElement("div");
  const trackElement = document.createElement("div");
  const slotElement = document.createElement("slot");
  const dotsElement = document.createElement("ol");
  const prevButton = createArrowButton("prev", onPrev);
  const nextButton = createArrowButton("next", onNext);

  rootElement.className = "ds-carousel";
  viewportElement.className = "ds-carousel__viewport";
  trackElement.className = "ds-carousel__track";
  dotsElement.className = "ds-carousel__dots";
  slotElement.addEventListener("slotchange", onSlotChange);
  viewportElement.addEventListener("pointerdown", onPointerDown);
  viewportElement.addEventListener("pointerup", onPointerUp);
  trackElement.append(slotElement);
  viewportElement.append(trackElement, prevButton, nextButton);
  rootElement.append(viewportElement, dotsElement);

  return {
    dotsElement,
    nextButton,
    prevButton,
    rootElement,
    slotElement,
    trackElement,
    viewportElement
  };
}

export function syncCarouselArrowButtons({
  axis,
  nextButton,
  prevButton
}: {
  axis: CarouselAxis;
  nextButton: HTMLButtonElement;
  prevButton: HTMLButtonElement;
}) {
  const vertical = axis === "vertical";

  if (prevButton.dataset.axis === axis && nextButton.dataset.axis === axis) {
    return;
  }

  prevButton.dataset.axis = axis;
  nextButton.dataset.axis = axis;
  prevButton.setAttribute("aria-label", vertical ? "Previous slide up" : "Previous slide");
  nextButton.setAttribute("aria-label", vertical ? "Next slide down" : "Next slide");
  prevButton.replaceChildren(createIcon(vertical ? ChevronUp : ChevronLeft));
  nextButton.replaceChildren(createIcon(vertical ? ChevronDown : ChevronRight));
}

export function createCarouselDot(index: number, currentIndex: number, onClick: () => void) {
  const item = document.createElement("li");
  const dot = document.createElement("button");

  dot.className = "ds-carousel__dot";
  dot.type = "button";
  dot.dataset.active = String(index === currentIndex);
  dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
  dot.addEventListener("click", onClick);
  item.append(dot);

  return item;
}

function createArrowButton(direction: "next" | "prev", onClick: () => void) {
  const button = document.createElement("button");

  button.className = "ds-carousel__arrow";
  button.dataset.direction = direction;
  button.type = "button";
  button.addEventListener("click", onClick);

  return button;
}

function createIcon(icon: Parameters<typeof createLucideElement>[0]) {
  return createLucideElement(icon, {
    "aria-hidden": "true",
    focusable: "false",
    height: 18,
    width: 18,
    "stroke-width": 2
  });
}
