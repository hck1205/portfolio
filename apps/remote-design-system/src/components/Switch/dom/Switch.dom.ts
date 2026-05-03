import type { SwitchSize } from "../types/Switch.types";

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback = false) {
  const value = element.getAttribute(name);

  if (value === null) {
    return fallback;
  }

  return value !== "false";
}

export function getSwitchSize(element: HTMLElement): SwitchSize {
  return element.getAttribute("size") === "small" ? "small" : "medium";
}

export function getInitialChecked(element: HTMLElement) {
  return (
    normalizeBooleanAttribute(element, "checked", false) ||
    normalizeBooleanAttribute(element, "value", false) ||
    normalizeBooleanAttribute(element, "default-checked", false) ||
    normalizeBooleanAttribute(element, "default-value", false)
  );
}
