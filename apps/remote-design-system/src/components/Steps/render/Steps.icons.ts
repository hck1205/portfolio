import { Check, Circle, CircleX, LoaderCircle, createElement as createLucideElement } from "lucide";

import type { StepItemData } from "../types/Steps.types";

export function createIndicatorContent(item: StepItemData, progressDot: boolean) {
  if (progressDot) {
    return document.createTextNode("");
  }

  if (item.icon) {
    return document.createTextNode(item.icon);
  }

  if (item.status === "finish") {
    return createIcon(Check);
  }

  if (item.status === "error") {
    return createIcon(CircleX);
  }

  if (item.status === "process") {
    return createIcon(LoaderCircle);
  }

  if (item.status === "wait") {
    return document.createTextNode(String(item.index + 1));
  }

  return createIcon(Circle);
}

export function getIndicatorSignature(item: StepItemData, progressDot: boolean) {
  if (progressDot) {
    return "dot";
  }

  if (item.icon) {
    return `icon:${item.icon}`;
  }

  if (item.status === "wait") {
    return `wait:${item.index}`;
  }

  return item.status;
}

function createIcon(icon: Parameters<typeof createLucideElement>[0]) {
  return createLucideElement(icon, {
    "aria-hidden": "true",
    focusable: "false",
    height: 16,
    width: 16,
    "stroke-width": 2.25
  });
}
