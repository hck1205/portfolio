import type { CarouselDotPlacement, CarouselEffect } from "../types/Carousel.types";

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback = false) {
  const value = element.getAttribute(name);

  if (value === null) {
    return fallback;
  }

  return value !== "false";
}

export function getCarouselDotPlacement(element: HTMLElement): CarouselDotPlacement {
  const value = element.getAttribute("dot-placement");

  if (value === "top" || value === "start" || value === "end") {
    return value;
  }

  return "bottom";
}

export function getCarouselEffect(element: HTMLElement): CarouselEffect {
  return element.getAttribute("effect") === "fade" ? "fade" : "scrollx";
}

export function getPositiveNumberAttribute(element: HTMLElement, name: string, fallback: number) {
  const value = Number(element.getAttribute(name));

  return Number.isFinite(value) && value > 0 ? value : fallback;
}
