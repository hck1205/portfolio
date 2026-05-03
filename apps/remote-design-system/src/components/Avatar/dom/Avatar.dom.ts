import type { AvatarFit, AvatarShape, AvatarSize } from "../types/Avatar.types";

export function getAvatarShape(element: HTMLElement): AvatarShape {
  return element.getAttribute("shape") === "square" ? "square" : "circle";
}

export function getAvatarSize(element: HTMLElement): AvatarSize {
  const value = element.getAttribute("size");

  if (value === "small" || value === "large") {
    return value;
  }

  return "middle";
}

export function getAvatarFit(element: HTMLElement): AvatarFit {
  return element.getAttribute("fit") === "contain" ? "contain" : "cover";
}

export function getAvatarGap(element: HTMLElement) {
  const value = Number(element.getAttribute("gap"));

  return Number.isFinite(value) && value >= 0 ? value : 4;
}

export function getPositiveIntegerAttribute(element: HTMLElement, name: string) {
  const value = Number(element.getAttribute(name));

  return Number.isFinite(value) && value > 0 ? Math.floor(value) : undefined;
}

export function syncNullableAttribute(element: HTMLElement, name: string, value: string) {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
}

export function getAvatarTextContent(element: HTMLElement) {
  return element.getAttribute("text") ?? element.textContent?.trim() ?? "";
}
