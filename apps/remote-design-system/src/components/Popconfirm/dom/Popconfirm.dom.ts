import type { PopconfirmPlacement } from "../types/Popconfirm.types";

const PLACEMENTS = new Set<PopconfirmPlacement>(["bottom", "left", "right", "top"]);

export function getPlacement(element: HTMLElement): PopconfirmPlacement {
  const placement = element.getAttribute("placement");

  return placement && PLACEMENTS.has(placement as PopconfirmPlacement) ? (placement as PopconfirmPlacement) : "top";
}

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback: boolean) {
  if (!element.hasAttribute(name)) {
    return fallback;
  }

  const value = element.getAttribute(name);

  return value === "" || value === "true";
}

export function syncBooleanAttribute(element: HTMLElement, name: string, value: boolean) {
  element.setAttribute(name, String(value));
}

export function syncNullableAttribute(element: HTMLElement, name: string, value: string | null | undefined) {
  if (value === null || value === undefined) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, value);
}
