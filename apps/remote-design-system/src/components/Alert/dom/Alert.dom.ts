import type { AlertType } from "../types/Alert.types";

const ALERT_TYPES = new Set<AlertType>(["error", "info", "success", "warning"]);

export function getAlertType(element: HTMLElement): AlertType {
  const type = element.getAttribute("type");

  if (type && ALERT_TYPES.has(type as AlertType)) {
    return type as AlertType;
  }

  return normalizeBooleanAttribute(element, "banner", false) ? "warning" : "info";
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
