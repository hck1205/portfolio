import type {
  TypographyDisplay,
  TypographyTextAlign,
  TypographyTextDecoration,
  TypographyTextOverflow,
  TypographyTitleLevel,
  TypographyTypoName,
  TypographyType,
  TypographyVariant
} from "../types/Typography.types";

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

export function getTypographyVariant(element: HTMLElement): TypographyVariant {
  const value = element.getAttribute("variant");

  if (value === "title" || value === "paragraph") {
    return value;
  }

  return "text";
}

export function getTypographyType(element: HTMLElement): TypographyType {
  const value = element.getAttribute("type");

  if (value === "secondary" || value === "success" || value === "warning" || value === "danger") {
    return value;
  }

  return "default";
}

export function getTypographyTitleLevel(element: HTMLElement): TypographyTitleLevel {
  const value = Number(element.getAttribute("level"));

  if (value === 2 || value === 3 || value === 4 || value === 5) {
    return value;
  }

  return 1;
}

export function getTypographyRows(element: HTMLElement) {
  const value = Number(element.getAttribute("rows"));

  if (Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }

  return 1;
}

export function getTypographyAs(element: HTMLElement) {
  const value = element.getAttribute("as")?.toLowerCase();

  if (
    value === "p" ||
    value === "span" ||
    value === "div" ||
    value === "strong" ||
    value === "em" ||
    value === "small" ||
    value === "label" ||
    value === "h1" ||
    value === "h2" ||
    value === "h3" ||
    value === "h4" ||
    value === "h5" ||
    value === "h6"
  ) {
    return value;
  }

  return "";
}

export function getTypographyDisplay(element: HTMLElement): TypographyDisplay | undefined {
  const value = element.getAttribute("display");

  if (
    value === "block" ||
    value === "inline" ||
    value === "inline-block" ||
    value === "flex" ||
    value === "inline-flex" ||
    value === "grid" ||
    value === "inline-grid" ||
    value === "contents" ||
    value === "flow-root" ||
    value === "none"
  ) {
    return value;
  }

  return undefined;
}

export function getTypographyTextAlign(element: HTMLElement): TypographyTextAlign | undefined {
  const value = element.getAttribute("text-align");

  if (
    value === "left" ||
    value === "right" ||
    value === "center" ||
    value === "justify" ||
    value === "start" ||
    value === "end"
  ) {
    return value;
  }

  return undefined;
}

export function getTypographyTextDecoration(
  element: HTMLElement
): TypographyTextDecoration | undefined {
  const value = element.getAttribute("text-decoration");

  if (value === "overline" || value === "underline" || value === "line-through" || value === "none") {
    return value;
  }

  return undefined;
}

export function getTypographyTextOverflow(element: HTMLElement): TypographyTextOverflow {
  const value = element.getAttribute("text-overflow");

  if (value === "truncate" || value === "break") {
    return value;
  }

  return "none";
}

export function getTypographyTypoName(element: HTMLElement): TypographyTypoName {
  const value = element.getAttribute("typo-name");

  if (value) {
    return value as TypographyTypoName;
  }

  if (getTypographyVariant(element) === "title") {
    return `Normal/Title/${getTypographyTitleLevel(element)}/Bold` as TypographyTypoName;
  }

  return "Normal/Body/3/Normal";
}

export function getTypographyTagName({
  as,
  href,
  level,
  variant
}: {
  as: string;
  href: string;
  level: TypographyTitleLevel;
  variant: TypographyVariant;
}) {
  if (as) {
    return as;
  }

  if (variant === "title") {
    return `h${level}`;
  }

  if (variant === "paragraph") {
    return "p";
  }

  if (href) {
    return "a";
  }

  return "span";
}

export function getTypographyTokenStyle(typoName: TypographyTypoName) {
  const [scope, scale, maybeLevel, maybeWeight] = typoName.split("/");
  const hasLevel = scale !== "LargeTitle";
  const level = hasLevel ? Number(maybeLevel) : 1;
  const weightName = hasLevel ? maybeWeight : maybeLevel;
  const lineHeight = scope === "UI" ? "1.3" : "1.7";
  const size = getTypographySize(scale, level);
  const weight = getTypographyWeight(weightName);

  return {
    lineHeight: scale === "Display" || scale === "Headline" ? "1.2" : lineHeight,
    size,
    weight
  };
}

export function colorTokenToCssVariable(colorToken: string) {
  if (!colorToken) {
    return "";
  }

  const [family = "", type = "", shade = ""] = colorToken.split("/");
  const familyName = normalizeColorFamily(family);
  const typeName = type.toLowerCase() === "opacity" ? "alpha" : type.toLowerCase();
  const shadeName = normalizeColorShade(shade);

  return `var(--color-${familyName}-${typeName}-${shadeName})`;
}

function getTypographySize(scale: string, level: number) {
  const sizeMap: Record<string, Record<number, string>> = {
    Button: { 1: "var(--spacing-s4)", 2: "var(--spacing-s3)", 3: "var(--spacing-s2)", 4: "var(--spacing-s1)" },
    Body: { 1: "var(--spacing-m1)", 2: "var(--spacing-s4)", 3: "var(--spacing-s3)", 4: "var(--spacing-s2)", 5: "var(--spacing-s1)" },
    Callout: { 1: "var(--spacing-m3)", 2: "var(--spacing-m2)", 3: "var(--spacing-m1)", 4: "var(--spacing-s4)", 5: "var(--spacing-s3)", 6: "var(--spacing-s2)", 7: "var(--spacing-s1)" },
    Display: { 1: "16rem", 2: "var(--spacing-xl4)", 3: "var(--spacing-xl3)", 4: "var(--spacing-xl1)", 5: "var(--spacing-l3)" },
    Footnote: { 1: "var(--spacing-s2)", 2: "var(--spacing-s1)" },
    Headline: { 1: "var(--spacing-l2)", 2: "var(--spacing-l1)", 3: "var(--spacing-m4)", 4: "var(--spacing-m3)" },
    Label: { 1: "var(--spacing-s4)", 2: "var(--spacing-s3)", 3: "var(--spacing-s2)", 4: "var(--spacing-s1)" },
    LargeTitle: { 1: "var(--spacing-l3)" },
    Subtitle: { 1: "var(--spacing-m3)", 2: "var(--spacing-m2)", 3: "var(--spacing-m1)", 4: "var(--spacing-s4)", 5: "var(--spacing-s3)", 6: "var(--spacing-s2)" },
    Title: { 1: "var(--spacing-l1)", 2: "var(--spacing-m4)", 3: "var(--spacing-m3)", 4: "var(--spacing-m2)", 5: "var(--spacing-m1)" }
  };

  return sizeMap[scale]?.[level] ?? "var(--text-ds-3)";
}

function getTypographyWeight(weightName: string) {
  const weightMap: Record<string, string> = {
    Bold: "700",
    Medium: "500",
    Normal: "400",
    SemiBold: "600"
  };

  return weightMap[weightName] ?? "400";
}

function normalizeColorFamily(family: string) {
  const familyMap: Record<string, string> = {
    grayscale: "neutral",
    green: "moss",
    pink: "rose",
    red: "coral",
    yellow: "amber"
  };
  const key = family.toLowerCase();

  return familyMap[key] ?? key;
}

function normalizeColorShade(shade: string) {
  return shade.toLowerCase().replace(/^g(\d+)$/, "n$1").replace(/^level(\d+)$/, "n$1");
}
