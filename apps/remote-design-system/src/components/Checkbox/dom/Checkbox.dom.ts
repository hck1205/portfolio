import type { CheckboxGroupOption, CheckboxGroupOptionInput, CheckboxValue } from "../types/Checkbox.types";

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

export function normalizeOption(option: CheckboxGroupOptionInput): CheckboxGroupOption {
  if (typeof option === "object" && option !== null) {
    const value = isCheckboxValue(option.value) ? option.value : "";
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

export function normalizeOptions(options: CheckboxGroupOptionInput[]): CheckboxGroupOption[] {
  return options.map(normalizeOption);
}

export function parseOptionsAttribute(value: string | null): CheckboxGroupOption[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (Array.isArray(parsed)) {
      return normalizeOptions(parsed as CheckboxGroupOptionInput[]);
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

export function parseValueListAttribute(value: string | null): CheckboxValue[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (Array.isArray(parsed)) {
      return parsed.filter(isCheckboxValue) as CheckboxValue[];
    }
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function serializeValueList(values: CheckboxValue[]) {
  return JSON.stringify(values);
}

export function checkboxValueKey(value: CheckboxValue) {
  return `${typeof value}:${String(value)}`;
}

export function syncNullableAttribute(element: HTMLElement, name: string, value: string) {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
}

function isCheckboxValue(value: unknown): value is CheckboxValue {
  const valueType = typeof value;

  return valueType === "string" || valueType === "number" || valueType === "boolean";
}
