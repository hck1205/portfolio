import type {
  StepsOrientation,
  StepsSize,
  StepsStatus,
  StepsTitlePlacement,
  StepsType,
  StepsVariant
} from "../types/Steps.types";

export function normalizeBooleanAttribute(element: HTMLElement, name: string, defaultValue: boolean) {
  if (!element.hasAttribute(name)) {
    return defaultValue;
  }

  const value = element.getAttribute(name);

  return value === "" || value === "true";
}

export function getNonNegativeIntegerAttribute(element: HTMLElement, name: string, fallback: number) {
  const value = Number(element.getAttribute(name));

  if (Number.isInteger(value) && value >= 0) {
    return value;
  }

  return fallback;
}

export function getPercentAttribute(element: HTMLElement) {
  const value = Number(element.getAttribute("percent"));

  if (Number.isFinite(value)) {
    return Math.min(Math.max(value, 0), 100);
  }

  return 0;
}

export function getStepsOrientation(element: HTMLElement): StepsOrientation {
  return element.getAttribute("orientation") === "vertical" ? "vertical" : "horizontal";
}

export function getStepsSize(element: HTMLElement): StepsSize {
  return element.getAttribute("size") === "small" ? "small" : "medium";
}

export function getStepsStatus(element: HTMLElement): StepsStatus {
  const value = element.getAttribute("status");

  if (value === "wait" || value === "finish" || value === "error") {
    return value;
  }

  return "process";
}

export function getStepsTitlePlacement(element: HTMLElement): StepsTitlePlacement {
  return element.getAttribute("title-placement") === "vertical" ? "vertical" : "horizontal";
}

export function getStepsType(element: HTMLElement): StepsType {
  const value = element.getAttribute("type");

  if (value === "dot" || value === "inline" || value === "navigation" || value === "panel") {
    return value;
  }

  return "default";
}

export function getStepsVariant(element: HTMLElement): StepsVariant {
  return element.getAttribute("variant") === "outlined" ? "outlined" : "filled";
}

export function getStepStatus(element: HTMLElement): StepsStatus | undefined {
  const value = element.getAttribute("status");

  if (value === "wait" || value === "process" || value === "finish" || value === "error") {
    return value;
  }

  return undefined;
}
