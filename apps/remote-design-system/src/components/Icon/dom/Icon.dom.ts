export function getIconNumberAttribute(
  element: HTMLElement,
  name: string,
  fallback: number
) {
  const value = Number(element.getAttribute(name));

  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function normalizeBooleanAttribute(
  element: HTMLElement,
  name: string,
  fallback: boolean
) {
  const value = element.getAttribute(name);

  if (value === null) {
    return fallback;
  }

  return value !== "false";
}
