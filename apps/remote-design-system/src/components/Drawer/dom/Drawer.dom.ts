import type { DrawerPlacement } from "../types/Drawer.types";

const DRAWER_PLACEMENTS = new Set<DrawerPlacement>(["bottom", "left", "right", "top"]);

export function getDrawerPlacement(element: HTMLElement): DrawerPlacement {
  const placement = element.getAttribute("placement");

  if (placement && DRAWER_PLACEMENTS.has(placement as DrawerPlacement)) {
    return placement as DrawerPlacement;
  }

  return "right";
}

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback: boolean) {
  if (!element.hasAttribute(name)) {
    return fallback;
  }

  const value = element.getAttribute(name);

  return value === "" || value === "true";
}

export function syncNullableAttribute(element: HTMLElement, name: string, value: string | null | undefined) {
  if (value === null || value === undefined) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, value);
}
