import type { EmptySize } from "../types/Empty.types";

export function getEmptySize(element: HTMLElement): EmptySize {
  return element.getAttribute("size") === "small" ? "small" : "middle";
}

export function syncNullableAttribute(element: HTMLElement, name: string, value: string | null | undefined) {
  if (value === null || value === undefined) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, value);
}

export function isImageUrl(value: string) {
  return /^(https?:|data:|\/|\.\/|\.\.\/)/.test(value);
}
