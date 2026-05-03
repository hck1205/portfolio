import type {
  InputNumberFormatter,
  InputNumberSize,
  InputNumberStatus,
  InputNumberVariant
} from "../types/InputNumber.types";

const FORMATTERS = ["decimal", "currency", "percent"] as const;
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

export function getInputNumberFormatter(element: HTMLElement): InputNumberFormatter {
  const value = element.getAttribute("formatter");

  return isOneOf(value, FORMATTERS) ? value : "decimal";
}

export function getInputNumberSize(element: HTMLElement): InputNumberSize {
  const value = element.getAttribute("size");

  return isOneOf(value, SIZES) ? value : "medium";
}

export function getInputNumberStatus(element: HTMLElement): InputNumberStatus | undefined {
  const value = element.getAttribute("status");

  return isOneOf(value, STATUSES) ? value : undefined;
}

export function getInputNumberVariant(element: HTMLElement): InputNumberVariant {
  const value = element.getAttribute("variant");

  return isOneOf(value, VARIANTS) ? value : "outlined";
}

export function getNumberAttribute(element: HTMLElement, name: string): number | undefined {
  return getFiniteNumberFromAttribute(element, name);
}

export function parseInputNumber(displayValue: string, decimalSeparator = ".") {
  const normalized = decimalSeparator === "." ? displayValue : displayValue.replace(decimalSeparator, ".");
  const numericValue = normalized.replace(/[^\d.+-]/g, "").trim();

  if (
    !numericValue ||
    numericValue === "-" ||
    numericValue === "+" ||
    numericValue === "." ||
    numericValue === "-." ||
    numericValue === "+."
  ) {
    return null;
  }

  const parsed = Number(numericValue);

  return Number.isFinite(parsed) ? parsed : null;
}

export function formatInputNumber({
  decimalSeparator,
  formatter,
  precision,
  value
}: {
  decimalSeparator: string;
  formatter: InputNumberFormatter;
  precision?: number;
  value: number | null;
}) {
  if (value === null || !Number.isFinite(value)) {
    return "";
  }

  const fractionDigits = precision ?? getDecimalLength(value);
  const normalizedValue = precision === undefined ? value : Number(value.toFixed(precision));
  const formatted = normalizedValue.toLocaleString("en-US", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: formatter === "decimal" ? 0 : fractionDigits
  });
  const withSeparator = decimalSeparator === "." ? formatted : formatted.replace(".", decimalSeparator);

  if (formatter === "currency") {
    return `$ ${withSeparator}`;
  }

  if (formatter === "percent") {
    return `${withSeparator}%`;
  }

  return withSeparator;
}

export function clampInputNumber(value: number | null, min?: number, max?: number) {
  if (value === null || !Number.isFinite(value)) {
    return null;
  }

  if (min !== undefined && value < min) {
    return min;
  }

  if (max !== undefined && value > max) {
    return max;
  }

  return value;
}

export function getPrecision(element: HTMLElement) {
  const value = getFiniteNumberFromAttribute(element, "precision");

  return value !== undefined && Number.isInteger(value) && value >= 0 ? value : undefined;
}

export function getStep(element: HTMLElement) {
  const value = Number(element.getAttribute("step"));

  return Number.isFinite(value) && value > 0 ? value : 1;
}

export function roundToPrecision(value: number, precision?: number) {
  if (precision === undefined) {
    return value;
  }

  return Number(value.toFixed(precision));
}

function getDecimalLength(value: number) {
  const [, decimal = ""] = String(value).split(".");

  return Math.min(decimal.length, 8);
}

function getFiniteNumberFromAttribute(element: HTMLElement, name: string) {
  if (!element.hasAttribute(name)) {
    return undefined;
  }

  const rawValue = element.getAttribute(name);

  if (rawValue === null || rawValue.trim() === "") {
    return undefined;
  }

  const value = Number(rawValue);

  return Number.isFinite(value) ? value : undefined;
}

function isOneOf<T extends readonly string[]>(value: string | null, options: T): value is T[number] {
  return value !== null && options.includes(value);
}
