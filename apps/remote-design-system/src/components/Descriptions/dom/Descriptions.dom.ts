import type { DescriptionsLayout, DescriptionsSize } from "../types/Descriptions.types";

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback: boolean) {
  const value = element.getAttribute(name);

  if (value === null) {
    return fallback;
  }

  return value !== "false";
}

export function getDescriptionsSize(element: HTMLElement): DescriptionsSize {
  const value = element.getAttribute("size");

  if (value === "large" || value === "small") {
    return value;
  }

  return "middle";
}

export function getDescriptionsLayout(element: HTMLElement): DescriptionsLayout {
  return element.getAttribute("layout") === "vertical" ? "vertical" : "horizontal";
}

export function getDescriptionsColumn(element: HTMLElement) {
  const value = Number(element.getAttribute("column"));

  if (!Number.isFinite(value)) {
    return 3;
  }

  return Math.max(1, Math.min(6, Math.floor(value)));
}

export function getDescriptionsSpan(element: HTMLElement) {
  const value = element.getAttribute("span");

  if (value === "filled") {
    return value;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 1;
  }

  return Math.max(1, Math.min(6, Math.floor(numericValue)));
}

export function syncNullableAttribute(element: HTMLElement, name: string, value: string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, value);
}
