import type {
  AutoCompleteInputMode,
  AutoCompleteOption,
  AutoCompleteSize,
  AutoCompleteStatus,
  AutoCompleteVariant
} from "../types/AutoComplete.types";

const INPUT_MODES = ["input", "textarea"] as const;
const SIZES = ["small", "medium", "large"] as const;
const STATUSES = ["error", "warning"] as const;
const VARIANTS = ["outlined", "borderless", "filled", "underlined"] as const;

let autoCompleteId = 0;

export function createAutoCompleteId(part: string) {
  autoCompleteId += 1;

  return `ds-auto-complete-${part}-${autoCompleteId}`;
}

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback = false) {
  if (!element.hasAttribute(name)) {
    return fallback;
  }

  const value = element.getAttribute(name);

  return value === "" || value === name || value === "true";
}

export function getAutoCompleteInputMode(element: HTMLElement): AutoCompleteInputMode {
  const value = element.getAttribute("input-mode");

  return isOneOf(value, INPUT_MODES) ? value : "input";
}

export function getAutoCompleteSize(element: HTMLElement): AutoCompleteSize {
  const value = element.getAttribute("size");

  return isOneOf(value, SIZES) ? value : "medium";
}

export function getAutoCompleteStatus(element: HTMLElement): AutoCompleteStatus | undefined {
  const value = element.getAttribute("status");

  return isOneOf(value, STATUSES) ? value : undefined;
}

export function getAutoCompleteVariant(element: HTMLElement): AutoCompleteVariant {
  const value = element.getAttribute("variant");

  return isOneOf(value, VARIANTS) ? value : "outlined";
}

export function parseOptions(value: string): AutoCompleteOption[] {
  if (!value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.flatMap((item) => normalizeOption(item));
  } catch {
    return [];
  }
}

export function filterOptions(options: AutoCompleteOption[], inputValue: string, enabled: boolean) {
  if (!enabled || !inputValue) {
    return options;
  }

  const keyword = inputValue.toLocaleLowerCase();

  return options.filter((option) => {
    return `${option.label ?? option.value} ${option.value}`.toLocaleLowerCase().includes(keyword);
  });
}

export function getNextEnabledOptionIndex(
  options: AutoCompleteOption[],
  activeIndex: number,
  direction: 1 | -1
) {
  if (!options.length) {
    return -1;
  }

  let nextIndex = activeIndex;

  for (let attempt = 0; attempt < options.length; attempt += 1) {
    nextIndex = (nextIndex + direction + options.length) % options.length;

    if (!options[nextIndex]?.disabled) {
      return nextIndex;
    }
  }

  return -1;
}

function normalizeOption(item: unknown): AutoCompleteOption[] {
  if (typeof item === "string") {
    return [{ value: item }];
  }

  if (!item || typeof item !== "object") {
    return [];
  }

  const option = item as Partial<AutoCompleteOption>;
  const value = String(option.value ?? "");

  if (!value) {
    return [];
  }

  return [
    {
      disabled: Boolean(option.disabled),
      label: option.label === undefined ? undefined : String(option.label),
      value
    }
  ];
}

function isOneOf<T extends readonly string[]>(value: string | null, options: T): value is T[number] {
  return value !== null && options.includes(value);
}
