import type {
  RadioButtonStyle,
  RadioGroupOption,
  RadioGroupOptionInput,
  RadioOptionType,
  RadioOrientation,
  RadioSize,
  RadioValue
} from "../types/Radio.types";

export function normalizeBooleanAttribute(element: HTMLElement, name: string, defaultValue: boolean) {
  const value = element.getAttribute(name);

  if (value === null) {
    return defaultValue;
  }

  return value !== "false";
}

export function normalizeOption(option: RadioGroupOptionInput): RadioGroupOption {
  if (typeof option === "object" && option !== null) {
    const value = isRadioValue(option.value) ? option.value : "";
    const label = typeof option.label === "string" ? option.label : String(value);

    return {
      className: typeof option.className === "string" ? option.className : undefined,
      disabled: Boolean(option.disabled),
      label,
      title: typeof option.title === "string" ? option.title : undefined,
      value
    };
  }

  return {
    label: String(option),
    value: option
  };
}

export function normalizeOptions(options: RadioGroupOptionInput[]) {
  return options.map(normalizeOption);
}

export function parseOptionsAttribute(value: string | null): RadioGroupOption[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (Array.isArray(parsed)) {
      return normalizeOptions(parsed as RadioGroupOptionInput[]);
    }
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => normalizeOption(item));
  }

  return [];
}

export function parseValueAttribute(value: string | null): RadioValue | undefined {
  if (value === null || value === "") {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (isRadioValue(parsed)) {
      return parsed;
    }
  } catch {
    return value;
  }

  return value;
}

export function serializeValue(value: RadioValue) {
  return JSON.stringify(value);
}

export function radioValueKey(value: RadioValue) {
  return `${typeof value}:${String(value)}`;
}

export function getRadioSize(element: HTMLElement): RadioSize {
  const value = element.getAttribute("size");

  return value === "large" || value === "small" ? value : "middle";
}

export function getRadioOptionType(element: HTMLElement): RadioOptionType {
  return element.getAttribute("option-type") === "button" ? "button" : "default";
}

export function getRadioButtonStyle(element: HTMLElement): RadioButtonStyle {
  return element.getAttribute("button-style") === "solid" ? "solid" : "outline";
}

export function getRadioOrientation(element: HTMLElement): RadioOrientation {
  if (element.getAttribute("orientation") === "vertical" || normalizeBooleanAttribute(element, "vertical", false)) {
    return "vertical";
  }

  return "horizontal";
}

export function syncNullableAttribute(element: HTMLElement, name: string, value: string) {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
}

function isRadioValue(value: unknown): value is RadioValue {
  const valueType = typeof value;

  return valueType === "string" || valueType === "number" || valueType === "boolean";
}
