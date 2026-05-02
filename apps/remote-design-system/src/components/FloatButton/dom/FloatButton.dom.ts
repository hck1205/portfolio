import type {
  FloatButtonGroupPlacement,
  FloatButtonGroupTrigger,
  FloatButtonHtmlType,
  FloatButtonShape,
  FloatButtonType
} from "../types/FloatButton.types";

export function normalizeBooleanAttribute(
  element: HTMLElement,
  name: string,
  defaultValue: boolean
) {
  const value = element.getAttribute(name);

  if (value === null) {
    return defaultValue;
  }

  return value !== "false";
}

export function getFloatButtonType(element: HTMLElement): FloatButtonType {
  return element.getAttribute("type") === "primary" ? "primary" : "default";
}

export function getFloatButtonShape(element: HTMLElement): FloatButtonShape {
  return element.getAttribute("shape") === "square" ? "square" : "circle";
}

export function getFloatButtonHtmlType(element: HTMLElement): FloatButtonHtmlType {
  const value = element.getAttribute("html-type");

  if (value === "submit" || value === "reset") {
    return value;
  }

  return "button";
}

export function getFloatButtonVisibilityHeight(element: HTMLElement) {
  const value = Number(element.getAttribute("visibility-height"));

  if (Number.isFinite(value) && value >= 0) {
    return value;
  }

  return 400;
}

export function getFloatButtonGroupPlacement(element: HTMLElement): FloatButtonGroupPlacement {
  const value = element.getAttribute("placement");

  if (value === "right" || value === "bottom" || value === "left") {
    return value;
  }

  return "top";
}

export function getFloatButtonGroupTrigger(
  element: HTMLElement
): FloatButtonGroupTrigger | undefined {
  const value = element.getAttribute("trigger");

  if (value === "click" || value === "hover") {
    return value;
  }

  return undefined;
}
