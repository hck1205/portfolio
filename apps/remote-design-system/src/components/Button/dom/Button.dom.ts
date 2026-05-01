import type {
  ButtonColor,
  ButtonHtmlType,
  ButtonIconPlacement,
  ButtonShape,
  ButtonSize,
  ButtonType,
  ButtonVariant,
  ResolvedButtonAppearance
} from "../types/Button.types";

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

export function getButtonType(element: HTMLElement): ButtonType {
  const value = element.getAttribute("type");

  if (value === "primary" || value === "dashed" || value === "text" || value === "link") {
    return value;
  }

  return "default";
}

export function getButtonColor(element: HTMLElement): ButtonColor | undefined {
  const value = element.getAttribute("color");

  if (value === "primary" || value === "danger" || value === "default") {
    return value;
  }

  return undefined;
}

export function getButtonVariant(element: HTMLElement): ButtonVariant | undefined {
  const value = element.getAttribute("variant");

  if (
    value === "solid" ||
    value === "outlined" ||
    value === "dashed" ||
    value === "filled" ||
    value === "text" ||
    value === "link"
  ) {
    return value;
  }

  return undefined;
}

export function getButtonSize(element: HTMLElement): ButtonSize {
  const value = element.getAttribute("size");

  if (value === "large" || value === "small") {
    return value;
  }

  return "middle";
}

export function getButtonShape(element: HTMLElement): ButtonShape {
  const value = element.getAttribute("shape");

  if (value === "round" || value === "circle") {
    return value;
  }

  return "default";
}

export function getButtonIconPlacement(element: HTMLElement): ButtonIconPlacement {
  return element.getAttribute("icon-placement") === "end" ? "end" : "start";
}

export function getButtonHtmlType(element: HTMLElement): ButtonHtmlType {
  const value = element.getAttribute("html-type");

  if (value === "submit" || value === "reset") {
    return value;
  }

  return "button";
}

export function resolveButtonAppearance({
  color,
  danger,
  type,
  variant
}: {
  color?: ButtonColor;
  danger: boolean;
  type: ButtonType;
  variant?: ButtonVariant;
}): ResolvedButtonAppearance {
  if (color || variant) {
    return {
      color: color ?? (danger ? "danger" : "default"),
      variant: variant ?? "outlined"
    };
  }

  if (type === "primary") {
    return { color: danger ? "danger" : "primary", variant: "solid" };
  }

  if (type === "dashed") {
    return { color: danger ? "danger" : "default", variant: "dashed" };
  }

  if (type === "text") {
    return { color: danger ? "danger" : "default", variant: "text" };
  }

  if (type === "link") {
    return { color: danger ? "danger" : "primary", variant: "link" };
  }

  return { color: danger ? "danger" : "default", variant: "outlined" };
}

