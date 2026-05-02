import type { InputMode, InputSize, InputStatus, InputVariant } from "../types/Input.types";

const INPUT_MODES = ["input", "textarea", "search", "password"] as const;
const INPUT_SIZES = ["small", "medium", "large"] as const;
const INPUT_STATUSES = ["error", "warning"] as const;
const INPUT_VARIANTS = ["outlined", "borderless", "filled", "underlined"] as const;

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback = false) {
  if (!element.hasAttribute(name)) {
    return fallback;
  }

  const value = element.getAttribute(name);

  return value === "" || value === name || value === "true";
}

export function getInputMode(element: HTMLElement): InputMode {
  const mode = element.getAttribute("mode");

  if (isOneOf(mode, INPUT_MODES)) {
    return mode;
  }

  const type = element.getAttribute("type");

  if (type === "textarea") {
    return "textarea";
  }

  if (type === "search") {
    return "search";
  }

  if (type === "password") {
    return "password";
  }

  return "input";
}

export function getInputSize(element: HTMLElement): InputSize {
  const value = element.getAttribute("size");

  return isOneOf(value, INPUT_SIZES) ? value : "medium";
}

export function getInputStatus(element: HTMLElement): InputStatus | undefined {
  const value = element.getAttribute("status");

  return isOneOf(value, INPUT_STATUSES) ? value : undefined;
}

export function getInputVariant(element: HTMLElement): InputVariant {
  const value = element.getAttribute("variant");

  return isOneOf(value, INPUT_VARIANTS) ? value : "outlined";
}

export function getNativeInputType(element: HTMLElement, mode: InputMode) {
  if (mode === "password") {
    return "password";
  }

  if (mode === "search") {
    return "search";
  }

  const type = element.getAttribute("type") ?? "text";

  return type && type !== "textarea" ? type : "text";
}

export function getPositiveIntegerAttribute(element: HTMLElement, name: string, fallback: number) {
  if (!element.hasAttribute(name)) {
    return fallback;
  }

  const rawValue = element.getAttribute(name);

  if (rawValue === null || rawValue.trim() === "") {
    return fallback;
  }

  const value = Number(rawValue);

  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function isOneOf<T extends readonly string[]>(value: string | null, options: T): value is T[number] {
  return value !== null && options.includes(value);
}
