export function getRowCount(element: HTMLElement) {
  const value = Number(element.getAttribute("paragraph-rows"));

  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 3;
}

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback: boolean) {
  if (!element.hasAttribute(name)) {
    return fallback;
  }

  const value = element.getAttribute(name);

  return value === "" || value === "true";
}
