import type { DropdownItemType, DropdownPlacement, DropdownTrigger } from "../types/Dropdown.types";

const DROPDOWN_PLACEMENTS = new Set<DropdownPlacement>([
  "bottom-left",
  "bottom",
  "bottom-right",
  "top-left",
  "top",
  "top-right"
]);

const DROPDOWN_TRIGGERS = new Set<DropdownTrigger>(["click", "hover", "context-menu"]);

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback = false) {
  const value = element.getAttribute(name);

  if (value === null) {
    return fallback;
  }

  return value === "" || value.toLowerCase() === "true";
}

export function getDropdownPlacement(element: HTMLElement): DropdownPlacement {
  const placement = element.getAttribute("placement") as DropdownPlacement | null;

  return placement && DROPDOWN_PLACEMENTS.has(placement) ? placement : "bottom-left";
}

export function getDropdownTrigger(element: HTMLElement): DropdownTrigger {
  const trigger = element.getAttribute("trigger") as DropdownTrigger | null;

  return trigger && DROPDOWN_TRIGGERS.has(trigger) ? trigger : "click";
}

export function getDropdownItemType(element: HTMLElement): DropdownItemType {
  return element.getAttribute("type") === "divider" ? "divider" : "item";
}

export function isElementInside(host: HTMLElement, target: EventTarget | null) {
  return target instanceof Node && (host === target || host.contains(target));
}
