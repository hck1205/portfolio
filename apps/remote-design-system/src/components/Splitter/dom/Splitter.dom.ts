import type { SplitterOrientation } from "../types/Splitter.types";

export function normalizeBooleanAttribute(element: HTMLElement, name: string, defaultValue: boolean) {
  if (!element.hasAttribute(name)) {
    return defaultValue;
  }

  const value = element.getAttribute(name);

  return value === "" || value === "true";
}

export function getSplitterOrientation(element: HTMLElement): SplitterOrientation {
  const orientation = element.getAttribute("orientation");

  if (orientation === "vertical" || orientation === "horizontal") {
    return orientation;
  }

  return normalizeBooleanAttribute(element, "vertical", false) ? "vertical" : "horizontal";
}

export function normalizeSizeValue(value: string | null, fallback: string) {
  if (!value) {
    return fallback;
  }

  const numericValue = Number(value);

  if (Number.isFinite(numericValue)) {
    return `${Math.max(0, numericValue)}px`;
  }

  return value;
}

export function parsePixelSize(value: string, containerSize: number) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return undefined;
  }

  if (trimmedValue.endsWith("%")) {
    const percent = Number(trimmedValue.slice(0, -1));

    return Number.isFinite(percent) ? (containerSize * percent) / 100 : undefined;
  }

  if (trimmedValue.endsWith("px")) {
    const pixels = Number(trimmedValue.slice(0, -2));

    return Number.isFinite(pixels) ? pixels : undefined;
  }

  const numericValue = Number(trimmedValue);

  return Number.isFinite(numericValue) ? numericValue : undefined;
}

export function formatPixelSize(value: number) {
  return `${Math.max(0, Math.round(value))}px`;
}

export function clampSize(value: number, min?: number, max?: number) {
  const minValue = min ?? 0;
  const maxValue = max ?? Number.POSITIVE_INFINITY;

  return Math.min(Math.max(value, minValue), maxValue);
}
