import type { MessageType } from "../types/Message.types";

const MESSAGE_TYPES = new Set<MessageType>(["error", "info", "loading", "success", "warning"]);

export function getMessageType(element: HTMLElement): MessageType {
  const type = element.getAttribute("type");

  if (type && MESSAGE_TYPES.has(type as MessageType)) {
    return type as MessageType;
  }

  return "info";
}

export function getMessageDuration(element: HTMLElement) {
  const value = Number(element.getAttribute("duration"));

  return Number.isFinite(value) && value >= 0 ? value : 3;
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
