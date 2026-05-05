import type { PopoverPlacement, PopoverTrigger } from "../types/Popover.types";

const PLACEMENTS = new Set<PopoverPlacement>([
  "top",
  "topLeft",
  "topRight",
  "bottom",
  "bottomLeft",
  "bottomRight",
  "left",
  "leftTop",
  "leftBottom",
  "right",
  "rightTop",
  "rightBottom"
]);

const TRIGGERS = new Set<PopoverTrigger>(["hover", "focus", "click", "contextMenu"]);

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback: boolean) {
  const value = element.getAttribute(name);

  if (value === null) {
    return fallback;
  }

  return value !== "false";
}

export function getPopoverPlacement(element: HTMLElement): PopoverPlacement {
  const value = element.getAttribute("placement") as PopoverPlacement | null;

  return value && PLACEMENTS.has(value) ? value : "top";
}

export function getPopoverTriggers(element: HTMLElement): PopoverTrigger[] {
  const value = element.getAttribute("trigger") ?? "hover";
  const triggers = value
    .split(/[,\s]+/)
    .map((item) => item.trim())
    .filter((item): item is PopoverTrigger => TRIGGERS.has(item as PopoverTrigger));

  return triggers.length > 0 ? triggers : ["hover"];
}

export function syncNullableAttribute(element: HTMLElement, name: string, value: string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, value);
}
