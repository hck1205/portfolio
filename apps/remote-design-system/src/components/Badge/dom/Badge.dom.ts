import type { BadgeRibbonPlacement, BadgeSize, BadgeStatus } from "../types/Badge.types";

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback = false) {
  const value = element.getAttribute(name);

  if (value === null) {
    return fallback;
  }

  return value !== "false";
}

export function getBadgeSize(element: HTMLElement): BadgeSize {
  return element.getAttribute("size") === "small" ? "small" : "middle";
}

export function getBadgeStatus(element: HTMLElement): BadgeStatus | undefined {
  const value = element.getAttribute("status");

  if (value === "success" || value === "processing" || value === "default" || value === "error" || value === "warning") {
    return value;
  }

  return undefined;
}

export function getBadgeOverflowCount(element: HTMLElement) {
  const value = Number(element.getAttribute("overflow-count"));

  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 99;
}

export function getBadgeOffset(element: HTMLElement): [number, number] {
  const [x = 0, y = 0] = (element.getAttribute("offset") ?? "")
    .split(",")
    .map((part) => Number(part.trim()));

  return [Number.isFinite(x) ? x : 0, Number.isFinite(y) ? y : 0];
}

export function getBadgeCountText(count: string, overflowCount: number) {
  const numericCount = Number(count);

  if (Number.isFinite(numericCount) && numericCount > overflowCount) {
    return `${overflowCount}+`;
  }

  return count;
}

export function getRibbonPlacement(element: HTMLElement): BadgeRibbonPlacement {
  return element.getAttribute("placement") === "start" ? "start" : "end";
}

export function syncNullableAttribute(element: HTMLElement, name: string, value: string) {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
}
