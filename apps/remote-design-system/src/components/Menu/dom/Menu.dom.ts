import type { MenuItemType, MenuMode, MenuTheme } from "../types/Menu.types";

const MENU_MODES = new Set<MenuMode>(["vertical", "horizontal", "inline"]);
const MENU_THEMES = new Set<MenuTheme>(["light", "dark"]);

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback = false) {
  const value = element.getAttribute(name);

  if (value === null) {
    return fallback;
  }

  return value === "" || value.toLowerCase() === "true";
}

export function getMenuMode(element: HTMLElement): MenuMode {
  const mode = element.getAttribute("mode") as MenuMode | null;

  return mode && MENU_MODES.has(mode) ? mode : "vertical";
}

export function getMenuTheme(element: HTMLElement): MenuTheme {
  const theme = element.getAttribute("theme") as MenuTheme | null;

  return theme && MENU_THEMES.has(theme) ? theme : "light";
}

export function getMenuItemType(element: HTMLElement): MenuItemType {
  const type = element.getAttribute("type");

  if (type === "submenu" || type === "group" || type === "divider") {
    return type;
  }

  return "item";
}

export function parseKeyList(value: string) {
  return value
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean);
}

export function serializeKeyList(keys: string[]) {
  return keys.join(",");
}
