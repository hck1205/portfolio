import type {
  DividerOrientation,
  DividerSize,
  DividerTitlePlacement,
  DividerVariant
} from "../types/Divider.types";

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

export function getDividerOrientation(element: HTMLElement): DividerOrientation {
  if (normalizeBooleanAttribute(element, "vertical", false)) {
    return "vertical";
  }

  return element.getAttribute("orientation") === "vertical" ? "vertical" : "horizontal";
}

export function getDividerSize(element: HTMLElement): DividerSize {
  const value = element.getAttribute("size");

  if (value === "small" || value === "large") {
    return value;
  }

  return "medium";
}

export function getDividerTitlePlacement(element: HTMLElement): DividerTitlePlacement {
  const value = element.getAttribute("title-placement");

  if (value === "start" || value === "end") {
    return value;
  }

  return "center";
}

export function getDividerVariant(element: HTMLElement): DividerVariant {
  if (normalizeBooleanAttribute(element, "dashed", false)) {
    return "dashed";
  }

  const value = element.getAttribute("variant");

  if (value === "dashed" || value === "dotted") {
    return value;
  }

  return "solid";
}

export function normalizeOrientationMargin(value: string) {
  if (!value) {
    return "";
  }

  return /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
}

export function colorTokenToCssVariable(colorToken: string) {
  if (!colorToken) {
    return "";
  }

  const [family = "", type = "", shade = ""] = colorToken.split("/");
  const familyName = normalizeColorFamily(family);
  const typeName = type.toLowerCase() === "opacity" ? "alpha" : type.toLowerCase();
  const shadeName = normalizeColorShade(shade, familyName);

  return `var(--color-${familyName}-${typeName}-${shadeName})`;
}

function normalizeColorFamily(family: string) {
  const familyMap: Record<string, string> = {
    grayscale: "neutral",
    blue: "indigo",
    green: "moss",
    pink: "rose",
    red: "coral",
    yellow: "amber"
  };
  const key = family.toLowerCase();

  return familyMap[key] ?? key;
}

function normalizeColorShade(shade: string, familyName: string) {
  const shadeName = shade.toLowerCase().replace(/^g(\d+)$/, "n$1").replace(/^level(\d+)$/, "n$1");
  const shadeMatch = shadeName.match(/^([a-z]+)(\d+)$/);

  if (!shadeMatch || familyName === "neutral") {
    return shadeName;
  }

  const [, shadeFamily, shadeLevel] = shadeMatch;
  const normalizedShadeFamily = normalizeColorFamily(shadeFamily);

  return normalizedShadeFamily === familyName ? `${familyName}${shadeLevel}` : shadeName;
}
