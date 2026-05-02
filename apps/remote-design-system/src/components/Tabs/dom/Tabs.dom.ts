import type { TabsPlacement, TabsSize, TabsType } from "../types/Tabs.types";

export function normalizeBooleanAttribute(element: HTMLElement, name: string, defaultValue: boolean) {
  if (!element.hasAttribute(name)) {
    return defaultValue;
  }

  const value = element.getAttribute(name);

  return value === "" || value === "true";
}

export function getTabsSize(element: HTMLElement): TabsSize {
  const value = element.getAttribute("size");

  if (value === "large" || value === "small") {
    return value;
  }

  return "medium";
}

export function getTabsType(element: HTMLElement): TabsType {
  return element.getAttribute("type") === "card" ? "card" : "line";
}

export function getTabsPlacement(element: HTMLElement): TabsPlacement {
  const value = element.getAttribute("tab-placement");

  if (value === "bottom" || value === "start" || value === "end") {
    return value;
  }

  return "top";
}
