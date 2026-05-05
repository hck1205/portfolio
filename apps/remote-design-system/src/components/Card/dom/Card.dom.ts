import type { CardSize, CardVariant } from "../types/Card.types";

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback = false) {
  const value = element.getAttribute(name);

  if (value === null) {
    return fallback;
  }

  return value !== "false";
}

export function getCardSize(element: HTMLElement): CardSize {
  return element.getAttribute("size") === "small" ? "small" : "medium";
}

export function getCardVariant(element: HTMLElement): CardVariant {
  return element.getAttribute("variant") === "borderless" ? "borderless" : "outlined";
}

export function syncNullableAttribute(element: HTMLElement, name: string, value: string) {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
}
