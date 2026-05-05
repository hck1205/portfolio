import type { ProgressSize, ProgressStatus, ProgressType } from "../types/Progress.types";

export function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function getNumberAttribute(element: HTMLElement, name: string, fallback: number) {
  const value = Number(element.getAttribute(name));

  return Number.isFinite(value) ? value : fallback;
}

export function getProgressSize(element: HTMLElement): ProgressSize {
  const size = element.getAttribute("size");

  return size === "small" || size === "large" ? size : "middle";
}

export function getProgressStatus(element: HTMLElement): ProgressStatus {
  const status = element.getAttribute("status");

  return status === "active" || status === "exception" || status === "success" ? status : "normal";
}

export function getProgressType(element: HTMLElement): ProgressType {
  const type = element.getAttribute("type");

  return type === "circle" || type === "steps" ? type : "line";
}

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback: boolean) {
  if (!element.hasAttribute(name)) {
    return fallback;
  }

  const value = element.getAttribute(name);

  return value === "" || value === "true";
}
