import type { SelectMode, SelectOption, SelectPlacement, SelectSize, SelectStatus, SelectVariant } from "../types/Select.types";

let selectId = 0;

export function createSelectId(prefix: string) {
  selectId += 1;
  return `ds-select-${prefix}-${selectId}`;
}

export function normalizeBooleanAttribute(element: HTMLElement, name: string, defaultValue: boolean) {
  const value = element.getAttribute(name);

  if (value === null) {
    return defaultValue;
  }

  return value !== "false";
}

export function getSelectMode(element: HTMLElement): SelectMode {
  const value = element.getAttribute("mode");

  return value === "multiple" || value === "tags" ? value : "single";
}

export function getSelectPlacement(element: HTMLElement): SelectPlacement {
  const value = element.getAttribute("placement");

  if (value === "bottomRight" || value === "topLeft" || value === "topRight") {
    return value;
  }

  return "bottomLeft";
}

export function getSelectSize(element: HTMLElement): SelectSize {
  const value = element.getAttribute("size");

  return value === "large" || value === "small" ? value : "middle";
}

export function getSelectStatus(element: HTMLElement): SelectStatus | undefined {
  const value = element.getAttribute("status");

  return value === "error" || value === "warning" ? value : undefined;
}

export function getSelectVariant(element: HTMLElement): SelectVariant {
  const value = element.getAttribute("variant");

  if (value === "borderless" || value === "filled" || value === "underlined") {
    return value;
  }

  return "outlined";
}

export function parseSelectOptions(value: string) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (Array.isArray(parsed)) {
      return parsed.flatMap((item) => normalizeOption(item) ?? []);
    }
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => ({ label: item, value: item }));
  }

  return [];
}

export function parseSelectValue(value: string, mode: SelectMode): string | string[] {
  if (mode === "single") {
    return value;
  }

  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (Array.isArray(parsed)) {
      return parsed.map(String);
    }
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function serializeSelectValue(value: string | string[]) {
  return Array.isArray(value) ? JSON.stringify(value) : value;
}

export function filterSelectOptions(options: SelectOption[], searchValue: string, filterOption: boolean) {
  if (!filterOption || !searchValue) {
    return options;
  }

  const normalizedSearch = searchValue.toLowerCase();

  return options.filter((option) => {
    return `${option.label} ${option.value}`.toLowerCase().includes(normalizedSearch);
  });
}

export function getNextEnabledOptionIndex(options: SelectOption[], currentIndex: number, direction: 1 | -1) {
  if (options.length === 0) {
    return -1;
  }

  for (let offset = 1; offset <= options.length; offset += 1) {
    const index = (currentIndex + direction * offset + options.length) % options.length;

    if (!options[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

export function syncNullableAttribute(element: HTMLElement, name: string, value: string | undefined) {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
}

function normalizeOption(value: unknown): SelectOption | undefined {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return {
      label: String(value),
      value: String(value)
    };
  }

  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  const option = value as Partial<SelectOption>;
  const optionValue = option.value === undefined ? "" : String(option.value);

  return {
    disabled: Boolean(option.disabled),
    label: option.label === undefined ? optionValue : String(option.label),
    title: option.title === undefined ? undefined : String(option.title),
    value: optionValue
  };
}
