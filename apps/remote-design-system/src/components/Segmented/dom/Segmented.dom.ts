import type {
  SegmentedIconName,
  SegmentedOption,
  SegmentedOrientation,
  SegmentedShape,
  SegmentedSize
} from "../types/Segmented.types";

const SEGMENTED_ICON_NAMES = new Set<SegmentedIconName>(["calendar", "chart", "table"]);

function isSegmentedIconName(value: unknown): value is SegmentedIconName {
  return typeof value === "string" && SEGMENTED_ICON_NAMES.has(value as SegmentedIconName);
}

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback: boolean) {
  const value = element.getAttribute(name);

  if (value === null) {
    return fallback;
  }

  return value !== "false";
}

export function syncAttribute(element: HTMLElement, name: string, value: string) {
  if (element.getAttribute(name) === value) {
    return;
  }

  element.setAttribute(name, value);
}

export function getSegmentedSize(element: HTMLElement): SegmentedSize {
  const value = element.getAttribute("size");

  if (value === "large" || value === "small") {
    return value;
  }

  return "middle";
}

export function getSegmentedOrientation(element: HTMLElement): SegmentedOrientation {
  const value = element.getAttribute("orientation");

  if (value === "vertical" || (value === null && normalizeBooleanAttribute(element, "vertical", false))) {
    return "vertical";
  }

  return "horizontal";
}

export function getSegmentedShape(element: HTMLElement): SegmentedShape {
  return element.getAttribute("shape") === "round" ? "round" : "default";
}

export function parseSegmentedOptions(value: string | null): SegmentedOption[] {
  if (!value) {
    return ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"].map((label) => ({ label, value: label }));
  }

  try {
    const parsedValue = JSON.parse(value) as unknown;

    if (Array.isArray(parsedValue)) {
      return parsedValue
        .map((item) => {
          if (typeof item === "string" || typeof item === "number") {
            return { label: String(item), value: String(item) };
          }

          if (item && typeof item === "object" && "value" in item) {
            const option = item as { disabled?: boolean; icon?: unknown; label?: unknown; value: unknown };
            const optionValue = String(option.value);
            const icon = isSegmentedIconName(option.icon) ? option.icon : undefined;

            return {
              disabled: option.disabled,
              icon,
              label: String(option.label ?? optionValue),
              value: optionValue
            };
          }

          return undefined;
        })
        .filter((item): item is SegmentedOption => Boolean(item));
    }
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((label) => ({ label, value: label }));
  }

  return [];
}
