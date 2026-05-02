import { LAYOUT_BREAKPOINTS } from "../constants/Layout.constants";
import type { LayoutBreakpoint, LayoutSiderTheme } from "../types/Layout.types";

export function normalizeBooleanAttribute(element: HTMLElement, name: string, defaultValue: boolean) {
  if (!element.hasAttribute(name)) {
    return defaultValue;
  }

  const value = element.getAttribute(name);

  return value === "" || value === "true";
}

export function normalizeNumberAttribute(
  element: HTMLElement,
  name: string,
  defaultValue: number,
  minimum = 0
) {
  const value = Number(element.getAttribute(name));

  if (!Number.isFinite(value) || value < minimum) {
    return defaultValue;
  }

  return value;
}

export function getLayoutBreakpoint(element: HTMLElement): LayoutBreakpoint | undefined {
  const value = element.getAttribute("breakpoint");

  if (value && value in LAYOUT_BREAKPOINTS) {
    return value as LayoutBreakpoint;
  }

  return undefined;
}

export function getLayoutSiderTheme(element: HTMLElement): LayoutSiderTheme {
  return element.getAttribute("theme") === "light" ? "light" : "dark";
}

export function normalizeWidthValue(value: string | null, defaultValue: number) {
  if (!value) {
    return `${defaultValue}px`;
  }

  const numericValue = Number(value);

  if (Number.isFinite(numericValue)) {
    return `${Math.max(0, numericValue)}px`;
  }

  return value;
}

export function syncOptionalBooleanAttribute(element: HTMLElement, name: string, force: boolean) {
  if (element.hasAttribute(name) !== force) {
    element.toggleAttribute(name, force);
  }
}

