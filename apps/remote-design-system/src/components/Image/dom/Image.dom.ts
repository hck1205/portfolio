export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback: boolean) {
  const value = element.getAttribute(name);

  if (value === null) {
    return fallback;
  }

  return value !== "false";
}

export function syncNullableAttribute(element: HTMLElement, name: string, value: string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, value);
}

export function getDimensionValue(value: string | null) {
  if (!value) {
    return "";
  }

  return /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
}
