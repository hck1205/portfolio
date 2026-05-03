import type { RateSize } from "../types/Rate.types";

export function normalizeBooleanAttribute(element: HTMLElement, name: string, defaultValue: boolean) {
  const value = element.getAttribute(name);

  if (value === null) {
    return defaultValue;
  }

  return value !== "false";
}

export function getRateSize(element: HTMLElement): RateSize {
  const value = element.getAttribute("size");

  return value === "large" || value === "small" ? value : "middle";
}

export function getRateCount(element: HTMLElement) {
  const count = Number(element.getAttribute("count"));

  return Number.isInteger(count) && count > 0 ? count : 5;
}

export function getRateNumberAttribute(element: HTMLElement, name: string, defaultValue: number) {
  const value = Number(element.getAttribute(name));

  return Number.isFinite(value) && value >= 0 ? value : defaultValue;
}

export function clampRateValue(value: number, count: number, allowHalf: boolean) {
  const step = allowHalf ? 0.5 : 1;
  const rounded = Math.round(value / step) * step;

  return Math.min(count, Math.max(0, rounded));
}

export function parseRateTooltips(value: string | null) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (Array.isArray(parsed)) {
      return parsed.map(String);
    }
  } catch {
    return value.split(",").map((item) => item.trim());
  }

  return [];
}

export function syncNullableAttribute(element: HTMLElement, name: string, value: string) {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
}
