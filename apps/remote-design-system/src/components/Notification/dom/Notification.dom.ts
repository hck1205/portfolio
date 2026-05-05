import type { NotificationPlacement, NotificationType } from "../types/Notification.types";

const PLACEMENTS = new Set<NotificationPlacement>(["bottom", "bottomLeft", "bottomRight", "top", "topLeft", "topRight"]);
const TYPES = new Set<NotificationType>(["error", "info", "success", "warning"]);

export function getNotificationPlacement(element: HTMLElement): NotificationPlacement {
  const placement = element.getAttribute("placement");

  return placement && PLACEMENTS.has(placement as NotificationPlacement) ? (placement as NotificationPlacement) : "topRight";
}

export function getNotificationType(element: HTMLElement): NotificationType {
  const type = element.getAttribute("type");

  return type && TYPES.has(type as NotificationType) ? (type as NotificationType) : "info";
}

export function getDuration(element: HTMLElement) {
  const value = Number(element.getAttribute("duration"));

  return Number.isFinite(value) && value >= 0 ? value : 4.5;
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
