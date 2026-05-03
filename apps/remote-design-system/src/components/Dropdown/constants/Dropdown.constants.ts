export const DROPDOWN_ELEMENT_NAME = "ds-dropdown";
export const DROPDOWN_ITEM_ELEMENT_NAME = "ds-dropdown-item";

export const DROPDOWN_OPEN_CHANGE_EVENT = "ds-dropdown-open-change";
export const DROPDOWN_SELECT_EVENT = "ds-dropdown-select";
export const DROPDOWN_ITEM_CLICK_EVENT = "ds-dropdown-item-click";

export const DROPDOWN_OBSERVED_ATTRIBUTES = [
  "arrow",
  "disabled",
  "open",
  "placement",
  "selectable",
  "selected-key",
  "trigger",
  "trigger-label"
] as const;

export const DROPDOWN_ITEM_OBSERVED_ATTRIBUTES = [
  "danger",
  "disabled",
  "href",
  "item-key",
  "label",
  "shortcut",
  "target",
  "type"
] as const;

export const DROPDOWN_HOVER_CLOSE_DELAY = 120;
