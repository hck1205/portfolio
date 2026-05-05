import type { SpinSize } from "../types/Spin.types";

export function getDelay(element: HTMLElement) {
  const delay = Number(element.getAttribute("delay"));

  return Number.isFinite(delay) && delay > 0 ? delay : 0;
}

export function getSpinSize(element: HTMLElement): SpinSize {
  const size = element.getAttribute("size");

  return size === "small" || size === "large" ? size : "middle";
}

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback: boolean) {
  if (!element.hasAttribute(name)) {
    return fallback;
  }

  const value = element.getAttribute(name);

  return value === "" || value === "true";
}

export function syncNullableAttribute(element: HTMLElement, name: string, value: string | null | undefined) {
  if (value === null || value === undefined) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, value);
}
