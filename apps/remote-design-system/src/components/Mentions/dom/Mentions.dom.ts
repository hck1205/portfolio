import type { MentionsPlacement, MentionsSize, MentionsStatus, MentionsVariant } from "../types/Mentions.types";

const PLACEMENTS = ["bottom", "top"] as const;
const SIZES = ["small", "medium", "large"] as const;
const STATUSES = ["error", "warning"] as const;
const VARIANTS = ["outlined", "borderless", "filled", "underlined"] as const;

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback = false) {
  if (!element.hasAttribute(name)) {
    return fallback;
  }

  const value = element.getAttribute(name);

  return value === "" || value === name || value === "true";
}

export function getMentionsPlacement(element: HTMLElement): MentionsPlacement {
  const value = element.getAttribute("placement");

  return isOneOf(value, PLACEMENTS) ? value : "bottom";
}

export function getMentionsSize(element: HTMLElement): MentionsSize {
  const value = element.getAttribute("size");

  return isOneOf(value, SIZES) ? value : "medium";
}

export function getMentionsStatus(element: HTMLElement): MentionsStatus | undefined {
  const value = element.getAttribute("status");

  return isOneOf(value, STATUSES) ? value : undefined;
}

export function getMentionsVariant(element: HTMLElement): MentionsVariant {
  const value = element.getAttribute("variant");

  return isOneOf(value, VARIANTS) ? value : "outlined";
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

export function getMentionsPrefixes(element: HTMLElement) {
  const prefix = element.getAttribute("prefix") || "@";

  return prefix
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isOneOf<T extends readonly string[]>(value: string | null, options: T): value is T[number] {
  return value !== null && options.includes(value);
}
