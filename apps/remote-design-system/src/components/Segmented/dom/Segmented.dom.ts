import type { SegmentedOption, SegmentedOrientation, SegmentedShape, SegmentedSize } from "../types/Segmented.types";

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback: boolean) {
  const value = element.getAttribute(name);

  if (value === null) {
    return fallback;
  }

  return value !== "false";
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
            const option = item as { disabled?: boolean; label?: unknown; value: unknown };
            const optionValue = String(option.value);

            return {
              disabled: option.disabled,
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
