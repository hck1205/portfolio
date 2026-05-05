export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback: boolean) {
  if (!element.hasAttribute(name)) {
    return fallback;
  }

  const value = element.getAttribute(name);

  return value === "" || value === "true";
}

export function hasAssignedContent(slotElement: HTMLSlotElement) {
  return slotElement
    .assignedNodes({ flatten: true })
    .some((node) => node.nodeType !== Node.TEXT_NODE || Boolean(node.textContent?.trim()));
}

export function syncBooleanAttribute(element: HTMLElement, name: string, value: boolean) {
  element.setAttribute(name, String(value));
}

export function syncNullableAttribute(element: HTMLElement, name: string, value: string | null | undefined) {
  if (value === null || value === undefined) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, value);
}
