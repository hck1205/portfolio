export const MENU_ELEMENT_NAME = "ds-menu";
export const MENU_ITEM_ELEMENT_NAME = "ds-menu-item";

export const MENU_SELECT_EVENT = "ds-menu-select";
export const MENU_OPEN_CHANGE_EVENT = "ds-menu-open-change";
export const MENU_ITEM_CLICK_EVENT = "ds-menu-item-click";
export const MENU_ITEM_TOGGLE_EVENT = "ds-menu-item-toggle";

export const MENU_OBSERVED_ATTRIBUTES = [
  "accordion",
  "default-open-keys",
  "default-selected-keys",
  "inline-collapsed",
  "mode",
  "multiple",
  "open-keys",
  "selectable",
  "selected-keys",
  "theme"
] as const;

export const MENU_ITEM_OBSERVED_ATTRIBUTES = [
  "danger",
  "disabled",
  "extra",
  "href",
  "item-key",
  "label",
  "target",
  "type"
] as const;
